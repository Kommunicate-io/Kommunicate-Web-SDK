class MckVoice {
    #SILENCE_THRESHOLD = 0.05; // Adjust this threshold as needed
    #SILENCE_DURATION = 3000; // 10 seconds of silence

    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = []; // recorded audio chunks
        this.isRecording = false;
        this.stream = null;
    }

    async processMessagesAsAudio(msg) {
        try {
            const response = await kmVoice.streamTextToSpeech(msg.message);
            this.playAudio(response);
        } catch (err) {
            console.error(err);
        }
    }

    async playAudio(response) {
        try {
            const audioBlob = await response.blob();
            const audioBlobUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioBlobUrl);

            console.log('Audio length =>', audio.duration);
            console.log('Audio is muted =>', audio.muted);
            await audio.play();

            audio.onplay = () => {
                console.log('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
            };
            audio.onended = () => {
                URL.revokeObjectURL(audioBlobUrl);
                console.log('Playback ended');
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    addEventListeners() {
        document.querySelector('.mck-voice-web').addEventListener('click', () => {
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                    class: ['mck-box-body', 'mck-box-top'],
                },
                'n-vis',
                'vis'
            );

            kommunicateCommons.modifyClassList({ id: ['mck-voice-interface'] }, 'vis', 'n-vis');

            // Call the audio recording function
            this.requestAudioRecording();
        });

        document.querySelector('#mck-voice-chat-btn').addEventListener('click', () => {
            this.stopRecording(true);

            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                    class: ['mck-box-body', 'mck-box-top'],
                },
                'vis',
                'n-vis'
            );

            kommunicateCommons.modifyClassList({ id: ['mck-voice-interface'] }, 'n-vis', 'vis');
        });

        document.querySelector('#mck-voice-speak-btn').addEventListener('click', () => {
            this.requestAudioRecording();
        });
    }

    requestAudioRecording() {
        if (this.isRecording) {
            this.stopRecording();
            return;
        }

        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Your browser does not support audio recording');
            alert('Your browser does not support audio recording');
            return;
        }

        // Request audio permission
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                this.startRecording(stream);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
                alert(
                    'Could not access your microphone. Please allow microphone access and try again.'
                );
            });
    }

    startRecording(stream) {
        this.stream = stream;
        this.audioChunks = [];
        this.isRecording = true;
        this.silenceTimer = null;
        this.lastAudioLevel = 0;
        this.silenceStart = null;

        // Create MediaRecorder instance
        this.mediaRecorder = new MediaRecorder(stream);

        // Handle data available event
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        // Handle recording stop event
        this.mediaRecorder.onstop = async () => {
            try {
                // Create blob from recorded chunks
                if (this.isRecording) {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });

                    const data = await kmVoice.speechToText(audioBlob);

                    const userMsg = data.text;

                    kommunicate.sendMessage({
                        contentType: 10,
                        source: 1,
                        type: 5,
                        message: userMsg,
                        groupId: CURRENT_GROUP_DATA.tabId,
                    });
                }
                // Clean up the stream tracks
                this.stream.getTracks().forEach((track) => track.stop());
                this.stream = null;
                this.isRecording = false;

                // Clear any silence detection timers
                if (this.silenceTimer) {
                    clearInterval(this.silenceTimer);
                    this.silenceTimer = null;
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Start recording
        this.mediaRecorder.start(); // Collect data every second
        console.debug('Recording started');

        // Set up audio analysis for silence detection
        this.setupSilenceDetection(stream);
    }

    setupSilenceDetection(stream) {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        const silenceDetection = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += array[i];
            }

            const average = values / length;
            const volume = average / 255; // Convert to a value between 0 and 1

            // Check if the current volume is below the silence threshold
            if (volume < this.#SILENCE_THRESHOLD) {
                if (this.silenceStart === null) {
                    this.silenceStart = Date.now();
                    console.debug('Silence detected, starting timer');
                } else {
                    const silenceDuration = Date.now() - this.silenceStart;
                    if (silenceDuration >= this.#SILENCE_DURATION) {
                        console.debug('User silent for 10 seconds, stopping recording');
                        this.stopRecording();
                    }
                }
            } else {
                // Reset silence timer if sound is detected
                if (this.silenceStart !== null) {
                    console.debug('Sound detected, resetting silence timer');
                    this.silenceStart = null;
                }
            }
        };

        // Check for silence every 300ms
        this.silenceTimer = setInterval(silenceDetection, 300);

        // Clean up when recording stops
        scriptProcessor.onaudioprocess = () => {
            if (!this.isRecording) {
                if (this.silenceTimer) {
                    clearInterval(this.silenceTimer);
                    this.silenceTimer = null;
                }
                microphone.disconnect();
                analyser.disconnect();
                scriptProcessor.disconnect();
            }
        };
    }

    stopRecording(forceStop = false) {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            forceStop && (this.isRecording = false);
            console.log('Recording stopped');
        }
    }
}

const mckVoice = new MckVoice();
