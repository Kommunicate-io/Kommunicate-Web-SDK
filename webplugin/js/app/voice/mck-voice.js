class MckVoice {
    #SILENCE_THRESHOLD = 0.05; // Adjust this threshold as needed
    #SILENCE_DURATION = 3000; // 3 seconds of silence

    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = []; // recorded audio chunks
        this.isRecording = false;
        this.stream = null;
        this.agentOrBotName = '';
        this.agentOrBotLastMsg = '';
        this.agentOrBotLastMsgAudio = null;
        this.messagesQueue = [];
    }

    async processMessagesAsAudio(msg, displayName) {
        try {
            this.messagesQueue.push({ msg, displayName });
            if (this.messagesQueue.length === 1) {
                this.processNextMessage(msg, displayName);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async processNextMessage(msg, displayName) {
        try {
            const messageWithoutSource = msg.message.replace(
                /\n*Sources:.*(?:\nhttps?:\/\/\S+)+/g,
                ''
            );

            this.agentOrBotName = displayName;
            this.agentOrBotLastMsg = messageWithoutSource;

            const response = await kmVoice.streamTextToSpeech(messageWithoutSource);

            //add the animation again
            // kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, '', 'n-vis');
            // document.querySelector('.ring-1').classList.remove('mck-ring-remove-animation');

            this.playAudioWithMediaSource(response);
        } catch (err) {
            console.error(err);
        }
    }

    async playAudioWithMediaSource(response) {
        const audio = new Audio();
        const mediaSource = new MediaSource();
        audio.src = URL.createObjectURL(mediaSource);
        const fullChunks = [];

        try {
            const sourceOpenPromise = new Promise((resolve) => {
                mediaSource.addEventListener('sourceopen', resolve, { once: true });
            });

            await sourceOpenPromise;

            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            const bufferQueue = [];
            let isStreamEnded = false;
            let hasPlaybackStarted = false;

            sourceBuffer.addEventListener('updateend', () => {
                if (bufferQueue.length > 0 && !sourceBuffer.updating) {
                    const chunk = bufferQueue.shift();
                    try {
                        sourceBuffer.appendBuffer(chunk);
                    } catch (error) {
                        bufferQueue.unshift(chunk);
                    }
                } else if (isStreamEnded && bufferQueue.length === 0 && !sourceBuffer.updating) {
                    try {
                        if (mediaSource.readyState === 'open') {
                            mediaSource.endOfStream();
                        }
                    } catch (error) {}
                }
            });

            const reader = response.body.getReader();

            audio.addEventListener(
                'canplay',
                () => {
                    if (!hasPlaybackStarted) {
                        audio.play().catch(console.error);
                        hasPlaybackStarted = true;
                    }
                },
                { once: true }
            );

            audio.addEventListener('ended', () => {
                this.messagesQueue.shift();

                if (this.messagesQueue.length > 0) {
                    const nextMsg = this.messagesQueue[0];
                    this.processNextMessage(nextMsg.msg, nextMsg.displayName);
                    return;
                }

                const lastMsgElement = document.querySelector('.last-message-text');

                lastMsgElement.innerHTML = `<strong>${this.agentOrBotName}</strong>: ${
                    this.agentOrBotLastMsg.slice(0, 100) +
                    (this.agentOrBotLastMsg.length > 100 ? '...' : '')
                }`;

                lastMsgElement.classList.remove('mck-hidden');
                const finalBlob = new Blob(fullChunks, { type: 'audio/mpeg' });
                const blobUrl = URL.createObjectURL(finalBlob);

                this.agentOrBotLastMsgAudio = blobUrl;

                document.getElementById('mck-voice-repeat-last-msg').classList.remove('mck-hidden');

                kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, 'n-vis');

                document.querySelector('.ring-1').classList.add('mck-ring-remove-animation');
                console.log('Playback ended');
            });

            async function processStream() {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        isStreamEnded = true;
                        if (bufferQueue.length === 0 && !sourceBuffer.updating) {
                            if (mediaSource.readyState === 'open') {
                                mediaSource.endOfStream();
                            }
                        }
                        return;
                    }

                    fullChunks.push(value);
                    if (sourceBuffer.updating || bufferQueue.length > 0) {
                        bufferQueue.push(value);
                    } else {
                        try {
                            sourceBuffer.appendBuffer(value);
                        } catch (error) {
                            bufferQueue.push(value);
                        }
                    }
                }
            }

            processStream();
        } catch (err) {
            console.error(err);
            if (mediaSource.readyState === 'open') {
                try {
                    mediaSource.endOfStream();
                } catch (e) {}
            }
        }
    }

    async playAudio(response, isAudioBlob = false) {
        try {
            let audioBlobUrl = isAudioBlob ? response : null;

            if (!isAudioBlob) {
                const audioBlob = await response.blob();
                audioBlobUrl = URL.createObjectURL(audioBlob);
            }

            const audio = new Audio(audioBlobUrl);

            await audio.play();

            audio.onplay = () => {
                console.log('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
            };
            audio.onended = () => {
                const lastMsgElement = document.querySelector('.last-message-text');

                lastMsgElement.innerHTML = `<strong>${this.agentOrBotName}</strong>: ${
                    this.agentOrBotLastMsg.slice(0, 100) +
                    (this.agentOrBotLastMsg.length > 100 ? '...' : '')
                }`;

                lastMsgElement.classList.remove('mck-hidden');

                if (!isAudioBlob) {
                    this.agentOrBotLastMsgAudio && URL.revokeObjectURL(this.agentOrBotLastMsgAudio); // revoke the previous audio blob url
                }
                this.agentOrBotLastMsgAudio = audioBlobUrl;

                document.getElementById('mck-voice-repeat-last-msg').classList.remove('mck-hidden');

                kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, 'n-vis');

                document.querySelector('.ring-1').classList.add('mck-ring-remove-animation');
                console.log('Playback ended');
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    addEventListeners() {
        const self = this;
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
            kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, '', 'n-vis');
            kommunicateCommons.modifyClassList(
                { class: ['ring-1'] },
                '',
                'mck-ring-remove-animation'
            );

            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-voice-repeat-last-msg', 'last-message-text'],
                },
                'mck-hidden'
            );
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

            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg', 'last-message-text'] },
                'mck-hidden'
            );

            kommunicateCommons.modifyClassList({ id: ['mck-voice-interface'] }, 'n-vis', 'vis');
        });

        document.querySelector('#mck-voice-speak-btn').addEventListener('click', () => {
            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg', 'last-message-text'] },
                'mck-hidden'
            );

            kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, '', 'n-vis');
            kommunicateCommons.modifyClassList(
                { class: ['ring-1'] },
                '',
                'mck-ring-remove-animation'
            );

            this.requestAudioRecording();
        });

        document.getElementById('mck-voice-repeat-last-msg').addEventListener('click', function () {
            this.classList.toggle('mck-hidden');

            kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, '', 'n-vis');
            document.querySelector('.ring-1').classList.remove('mck-ring-remove-animation');

            self.playAudio(self.agentOrBotLastMsgAudio, true);
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
        this.agentOrBotLastMsgAudio = null;
        this.agentOrBotLastMsg = '';

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
            } catch (error) {
                console.error(error);
            } finally {
                // Clean up the stream tracks
                this.stream.getTracks().forEach((track) => track.stop());
                this.stream = null;
                this.isRecording = false;

                // Clear any silence detection timers
                if (this.silenceTimer) {
                    clearInterval(this.silenceTimer);
                    this.silenceTimer = null;
                }
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
                        console.debug('User silent for 3 seconds, stopping recording');
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

            // hide the ring animation
            // kommunicateCommons.modifyClassList({ class: ['ring-2', 'ring-3'] }, 'n-vis', '');
            // document.querySelector('.ring-1').classList.add('mck-ring-remove-animation');
        }
    }
}

const mckVoice = new MckVoice();
