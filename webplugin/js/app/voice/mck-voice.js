class MckVoice {
    // Using underscore prefix instead of # for compatibility with build tools
    _SILENCE_THRESHOLD = 0.05; // Adjust this threshold as needed
    _SILENCE_DURATION = 3000; // 3 seconds of silence
    _NOISE_THRESHOLD = 130; //  silence threshold of audio

    // animation scale for speaking
    _MIN_SPEAK_ANIMATION_SCALE = 0.7;
    _MAX_SPEAK_ANIMATION_SCALE = 1.0;

    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = []; // recorded audio chunks
        this.isRecording = false;
        this.stream = null;
        this.agentOrBotName = '';
        this.agentOrBotLastMsg = '';
        this.agentOrBotLastMsgAudio = null;
        this.messagesQueue = [];

        // to check if audio is empty before sending to server
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;

        this.audioElement = null;
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
                /[\n\r]*Sources:.*?(https?:\/\/\S+)/g,
                ''
            );

            this.agentOrBotName = displayName;
            this.agentOrBotLastMsg = messageWithoutSource;

            const response = await kmVoice.textToSpeechStream(messageWithoutSource);

            this.playAudioWithMediaSource(response);
        } catch (err) {
            console.error(err);
        }
    }

    async playAudioWithMediaSource(response) {
        const audio = new Audio();
        this.audioElement = audio;

        const mediaSource = new MediaSource();
        const mediaSourceUrl = URL.createObjectURL(mediaSource);

        audio.src = mediaSourceUrl;
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
                    } catch (error) {
                        console.error(error);
                    }
                }
            });

            const reader = response.body.getReader();

            audio.onerror = (e) => {
                console.error(e, 'media source play error');
                this.audioElement = null;
            };

            audio.addEventListener(
                'canplay',
                () => {
                    if (!hasPlaybackStarted) {
                        this.addSpeakingAnimation();
                        audio.play().catch(console.error);
                        // Initialize audio visualizer for dynamic animation
                        this.visualizerCleanup = this.createAudioVisualizer(audio);
                        hasPlaybackStarted = true;
                    }
                },
                { once: true }
            );

            audio.addEventListener('ended', () => {
                this.messagesQueue.shift();

                if (this.messagesQueue.length > 0) {
                    const nextMsg = this.messagesQueue[0];

                    // Clean up visualizer before starting next message
                    if (this.visualizerCleanup) {
                        this.visualizerCleanup();
                        this.visualizerCleanup = null;
                    }

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

                // Clean up visualizer but don't remove animation yet
                if (this.visualizerCleanup) {
                    this.visualizerCleanup();
                    this.visualizerCleanup = null;
                }

                // Hide other rings
                kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');

                // Apply receding animation to the first ring
                const ring1 = document.querySelector('.voice-ring-1');
                ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                ring1.classList.add('ring-recede');

                console.log('Playback ended, starting recede animation');

                // Wait for animation to complete before removing all classes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                    this.removeAllAnimation();
                }, 800); // Match this to animation duration in CSS
                this.audioElement = null;
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

    async repeatLastMsgAudio(blobUrl) {
        try {
            this.addSpeakingAnimation();
            let audioBlobUrl = blobUrl;

            const audio = new Audio(audioBlobUrl);
            this.audioElement = audio;

            this.visualizerCleanup = this.createAudioVisualizer(audio);

            await audio.play().catch(console.error);

            audio.onplay = () => {
                console.log('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
                this.audioElement = null;
            };
            audio.onended = () => {
                const lastMsgElement = document.querySelector('.last-message-text');

                // Clean up visualizer but don't remove animation yet
                if (this.visualizerCleanup) {
                    this.visualizerCleanup();
                    this.visualizerCleanup = null;
                }

                lastMsgElement.innerHTML = `<strong>${this.agentOrBotName}</strong>: ${
                    this.agentOrBotLastMsg.slice(0, 100) +
                    (this.agentOrBotLastMsg.length > 100 ? '...' : '')
                }`;

                lastMsgElement.classList.remove('mck-hidden');
                this.agentOrBotLastMsgAudio = audioBlobUrl;

                document.getElementById('mck-voice-repeat-last-msg').classList.remove('mck-hidden');

                // Hide other rings
                kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');

                // Apply receding animation to the first ring
                const ring1 = document.querySelector('.voice-ring-1');
                ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                ring1.classList.add('ring-recede');

                console.log('Playback ended, starting recede animation');

                // Remove ring-recede class after animation completes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                }, 1500); // Match this to animation duration in CSS
                this.audioElement = null;
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    addEventListeners() {
        const self = this;
        document.querySelector('.mck-voice-web').addEventListener('click', () => {
            kommunicateCommons.hide('#mck-sidebox-ft', '.mck-box-body', '.mck-box-top');

            kommunicateCommons.show('#mck-voice-interface');
            kommunicateCommons.show('.voice-ring-2', '.voice-ring-3');
            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-1'] },
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

            kommunicateCommons.show('#mck-sidebox-ft', '.mck-box-body');

            document.querySelector('.mck-box-top').classList.remove('n-vis');

            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg', 'last-message-text'] },
                'mck-hidden'
            );

            kommunicateCommons.hide('#mck-voice-interface');
        });

        document.querySelector('#mck-voice-speak-btn').addEventListener('click', () => {
            this.stopRecording(true);
            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg', 'last-message-text'] },
                'mck-hidden'
            );

            kommunicateCommons.show('.voice-ring-2', '.voice-ring-3');
            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-1'] },
                '',
                'mck-ring-remove-animation'
            );

            this.requestAudioRecording();
        });

        document.getElementById('mck-voice-repeat-last-msg').addEventListener('click', function () {
            this.classList.toggle('mck-hidden');

            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-2', 'voice-ring-3'] },
                '',
                'n-vis'
            );
            const ring1 = document.querySelector('.voice-ring-1');
            ring1.classList.remove('mck-ring-remove-animation');

            self.repeatLastMsgAudio(self.agentOrBotLastMsgAudio);
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
        this.addListeningAnimation();
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

                    const soundPercentage =
                        this.totalSamples > 0 ? (this.soundSamples / this.totalSamples) * 100 : 0;

                    if (!this.hasSoundDetected || soundPercentage < 5) {
                        console.debug('Recording was empty or nearly empty');

                        this.hasSoundDetected = false;
                        this.soundSamples = 0;
                        this.totalSamples = 0;
                        this.removeAllAnimation();
                        return false; // Indicate empty recording
                    }

                    this.hasSoundDetected = false;
                    this.soundSamples = 0;
                    this.totalSamples = 0;

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
                this.removeAllAnimation();
                confirm('Failed to process the audio please try again after some time');
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

    addThinkingAnimation() {
        document.querySelectorAll('.voice-ring').forEach((ring, i) => {
            ring.classList.remove(
                `listening-ring`,
                `listening-ring-${i + 1}`,
                `speaking-voice-ring`,
                `speaking-voice-ring-${i + 1}`
            );
            ring.classList.add(`thinking-voice-ring`, `thinking-voice-ring-${i + 1}`);
        });
    }

    addSpeakingAnimation() {
        document.querySelectorAll('.voice-ring').forEach((ring, i) => {
            ring.classList.remove(
                `thinking-voice-ring`,
                `thinking-voice-ring-${i + 1}`,
                `listening-ring`,
                `listening-ring-${i + 1}`,
                `speaking-voice-ring`,
                `speaking-voice-ring-${i + 1}`
            );

            // Only use the first ring for speaking animation
            if (i === 0) {
                ring.classList.add('speaking-voice-ring', 'speaking-voice-ring-1');
                // Reset any inline styles that might be left from visualization
                ring.style.transform = '';
                ring.style.opacity = '';
            } else {
                // Hide other rings
                ring.classList.add('n-vis');
            }
        });
    }

    addListeningAnimation() {
        document.querySelectorAll('.voice-ring').forEach((ring, i) => {
            ring.classList.remove(
                `speaking-voice-ring`,
                `speaking-voice-ring-${i + 1}`,
                `thinking-voice-ring`,
                `thinking-voice-ring-${i + 1}`
            );
            ring.classList.add(`listening-ring`, `listening-ring-${i + 1}`);
        });
    }

    removeAllAnimation() {
        document.querySelectorAll('.voice-ring').forEach((ring, i) => {
            ring.classList.remove(
                `speaking-voice-ring`,
                `speaking-voice-ring-${i + 1}`,
                `listening-ring`,
                `listening-ring-${i + 1}`,
                `thinking-voice-ring`,
                `thinking-voice-ring-${i + 1}`,
                'ring-recede'
            );

            // Clean up any inline styles that might have been applied
            ring.style.transform = '';
            ring.style.opacity = '';
            ring.style.zIndex = '';
        });
    }

    createAudioVisualizer(audioElement) {
        try {
            // Create audio context and analyzer
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 512; // Increased for better frequency resolution

            // Connect the audio element to the analyzer
            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyzer);
            analyzer.connect(audioContext.destination);

            // Get the main ring element for animation
            const ring = document.querySelector('.speaking-voice-ring-1');
            if (!ring) {
                console.error('Speaking ring element not found');
                return () => {};
            }

            // Make sure the ring is visible
            ring.classList.remove('n-vis');

            // Create buffer for frequency data
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            console.debug('Audio visualizer created, ready to animate ring');

            // Keep track of previous scale for smooth transitions
            let lastScale = this._MIN_SPEAK_ANIMATION_SCALE; // Initialize with minimum scale (matching minScale)

            // Animation function with improved response to sound
            const visualize = () => {
                if (!ring || !audioElement || audioElement.paused) {
                    console.debug('Animation stopped: ring or audio not available');
                    return;
                }

                // Get current audio data
                analyzer.getByteFrequencyData(dataArray);

                // Calculate sound levels with focus on voice frequencies
                let sum = 0;
                let peakValue = 0;

                // Focus on frequencies most relevant to human voice (100-900 Hz)
                const voiceStartBin = Math.floor(
                    (100 * bufferLength) / (audioContext.sampleRate / 2)
                );
                const voiceEndBin = Math.floor(
                    (900 * bufferLength) / (audioContext.sampleRate / 2)
                );

                for (let i = 0; i < bufferLength; i++) {
                    // Give more weight to voice frequencies
                    const value = dataArray[i];
                    sum += value;

                    // Track peak value for better response
                    if (i >= voiceStartBin && i <= voiceEndBin && value > peakValue) {
                        peakValue = value;
                    }
                }

                // Only change scale if sound is above the noise threshold
                let targetScale;
                if (peakValue > this._NOISE_THRESHOLD) {
                    // Map peak value to scale range, with emphasis on voice frequencies
                    targetScale =
                        this._MIN_SPEAK_ANIMATION_SCALE +
                        (peakValue / 255) *
                            (this._MAX_SPEAK_ANIMATION_SCALE - this._MIN_SPEAK_ANIMATION_SCALE);
                } else {
                    // If no significant sound, maintain minimum scale
                    targetScale = this._MIN_SPEAK_ANIMATION_SCALE;
                }

                // Force exact minimum scale during silence to avoid lingering at 0.85
                if (peakValue <= this._NOISE_THRESHOLD) {
                    // When silent, ensure it gets very close to minimum or just set it directly
                    if (Math.abs(lastScale - this._MIN_SPEAK_ANIMATION_SCALE) < 0.05) {
                        // If already very close to minimum, just set it exactly
                        lastScale = this._MIN_SPEAK_ANIMATION_SCALE;
                    } else {
                        // Otherwise use a very aggressive smoothing for quick return
                        lastScale = lastScale + (targetScale - lastScale) * 0.5;
                    }
                } else {
                    // Normal smoothing for sound presence
                    lastScale = lastScale + (targetScale - lastScale) * 0.15;
                }

                // Apply changes with smoother animation
                ring.style.transform = `translate(-50%, -50%) scale(${lastScale})`;

                this.animationFrame = requestAnimationFrame(visualize);
            };

            // Start the animation loop with a single request
            this.animationFrame = requestAnimationFrame(visualize);
            console.debug('Audio visualization started');

            // Return cleanup function
            return () => {
                console.debug('Cleaning up audio visualizer');
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                    this.animationFrame = null;
                }
                try {
                    source.disconnect();
                    analyzer.disconnect();
                    audioContext.close();
                } catch (e) {
                    console.error('Error disconnecting audio nodes:', e);
                }
            };
        } catch (error) {
            console.error('Error creating audio visualizer:', error);
            return () => {};
        }
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
            this.totalSamples++;

            // Check if the current volume is below the silence threshold

            if (volume > this._SILENCE_THRESHOLD) {
                this.hasSoundDetected = true;
                this.soundSamples++;
                this.silenceStart = null;
            } else {
                if (this.silenceStart === null) {
                    this.silenceStart = Date.now();
                    console.debug('Silence detected, starting timer');
                } else {
                    const silenceDuration = Date.now() - this.silenceStart;
                    if (silenceDuration >= this._SILENCE_DURATION) {
                        console.debug('User silent for 3 seconds, stopping recording');
                        this.stopRecording();
                        this.addThinkingAnimation();
                    }
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
        forceStop && this.stopAudio();
    }

    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        this.audioElement = null;
    }

    showMic(appOptions) {
        if (appOptions.voiceChat) {
            kommunicateCommons.modifyClassList({ id: ['mck-voice-web'] }, '', 'n-vis');
        }
    }
}

const mckVoice = new MckVoice();
