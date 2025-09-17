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
        this.visualizerCleanup = null;
        this.queueToken = 0;
        this.currentTtsAbortController = null;
        this.currentVoiceStatus = 'idle';
        this.silenceAudioContext = null;
        this.silenceNodes = null;
        this.silenceTimer = null;

        // to check if audio is empty before sending to server
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;

        this.audioElement = null;

        this.updateVoiceStatus('idle');
    }

    async processMessagesAsAudio(msg, displayName) {
        try {
            this.messagesQueue.push({ msg, displayName });
            if (this.messagesQueue.length === 1) {
                const token = this.queueToken;
                this.processNextMessage(msg, displayName, token);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    preConnectDomain() {
        const head = document.head || document.getElementsByTagName('head')[0];

        if (head.querySelector('link[href="https://api.elevenlabs.io"]')) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://api.elevenlabs.io';
        link.crossOrigin = 'anonymous';

        head.appendChild(link);
    }
    async processNextMessage(msg, displayName, token = this.queueToken) {
        if (token !== this.queueToken) {
            return;
        }
        try {
            const rawMessage = typeof msg.message === 'string' ? msg.message : '';
            const messageWithoutSource = rawMessage
                .replace(/(?:\r?\n|\r)+\s*(?:\*\*)?Sources:\s*[\s\S]*$/, '')
                .trim();

            this.agentOrBotName = displayName;
            this.agentOrBotLastMsg = messageWithoutSource;

            this.updateVoiceStatus('thinking');

            this.abortCurrentTts();
            const controller = new AbortController();
            this.currentTtsAbortController = controller;

            const response = await kmVoice.textToSpeechStream(messageWithoutSource, {
                signal: controller.signal,
            });

            if (token !== this.queueToken) {
                this.abortCurrentTts();
                return;
            }

            this.playAudioWithMediaSource(response, token);
        } catch (err) {
            console.error(err);
            this.currentTtsAbortController = null;
            this.cleanupVisualizer();
            this.advanceQueue({
                onEmpty: () => {
                    this.removeAllAnimation();
                    this.hideRepeatControls();
                    this.updateVoiceStatus('idle');
                },
            });
        }
    }

    async playAudioWithMediaSource(response, token = this.queueToken) {
        if (token !== this.queueToken) {
            return;
        }

        const supportsMse =
            typeof window !== 'undefined' &&
            window.MediaSource &&
            typeof window.MediaSource.isTypeSupported === 'function' &&
            window.MediaSource.isTypeSupported('audio/mpeg');

        if (!supportsMse) {
            await this.playAudioWithoutMediaSource(response, token);
            return;
        }

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

            if (token !== this.queueToken) {
                try {
                    if (mediaSource.readyState === 'open') {
                        mediaSource.endOfStream();
                    }
                } catch (e) {
                    console.error('Failed to end media source on stale token:', e);
                }
                this.audioElement = null;
                audio.src = '';
                URL.revokeObjectURL(mediaSourceUrl);
                return;
            }

            let sourceBuffer;
            try {
                sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
            } catch (sourceErr) {
                console.warn('Falling back to non-MSE playback', sourceErr);
                if (mediaSource.readyState === 'open') {
                    try {
                        mediaSource.endOfStream();
                    } catch (e) {}
                }
                try {
                    audio.pause();
                } catch (pauseErr) {}
                audio.src = '';
                this.audioElement = null;
                URL.revokeObjectURL(mediaSourceUrl);
                await this.playAudioWithoutMediaSource(response, token);
                return;
            }
            try {
                if (sourceBuffer.mode !== 'sequence') {
                    sourceBuffer.mode = 'sequence';
                }
            } catch (modeError) {
                console.debug('Unable to set sourceBuffer mode to sequence', modeError);
            }
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
            const cloneChunk = (chunk) =>
                chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);

            audio.addEventListener('error', (e) => {
                console.error(e, 'media source play error');
                if (token !== this.queueToken) {
                    return;
                }
                this.cleanupVisualizer();
                this.audioElement = null;
                this.currentTtsAbortController = null;
                URL.revokeObjectURL(mediaSourceUrl);
                this.advanceQueue({
                    onEmpty: () => {
                        this.removeAllAnimation();
                        this.hideRepeatControls();
                    },
                });
            });

            audio.addEventListener(
                'canplay',
                () => {
                    if (!hasPlaybackStarted) {
                        this.addSpeakingAnimation();
                        audio.play().catch(console.error);
                        this.visualizerCleanup = this.createAudioVisualizer(audio);
                        hasPlaybackStarted = true;
                    }
                },
                { once: true }
            );

            audio.addEventListener('pause', () => {
                if (token !== this.queueToken) {
                    return;
                }

                if (!audio.ended) {
                    this.updateVoiceStatus('idle');
                }
            });

            audio.addEventListener('ended', () => {
                if (token !== this.queueToken) {
                    return;
                }
                this.currentTtsAbortController = null;
                this.cleanupVisualizer();

                this.advanceQueue({
                    onEmpty: () => {
                        const lastMsgElement = document.querySelector('.last-message-text');

                        if (lastMsgElement) {
                            lastMsgElement.innerHTML = `<strong>${this.agentOrBotName}</strong>: ${
                                this.agentOrBotLastMsg.slice(0, 100) +
                                (this.agentOrBotLastMsg.length > 100 ? '...' : '')
                            }`;

                            lastMsgElement.classList.remove('mck-hidden');
                        }

                        const finalBlob = new Blob(fullChunks, { type: 'audio/mpeg' });
                        const blobUrl = URL.createObjectURL(finalBlob);

                        this.agentOrBotLastMsgAudio = blobUrl;

                        document
                            .getElementById('mck-voice-repeat-last-msg')
                            ?.classList.remove('mck-hidden');

                        // Hide other rings
                        kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');

                        // Apply receding animation to the first ring
                        const ring1 = document.querySelector('.voice-ring-1');
                        ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                        ring1.classList.add('ring-recede');

                        // Wait for animation to complete before removing all classes
                        setTimeout(() => {
                            ring1.classList.remove('ring-recede');
                            this.removeAllAnimation();
                        }, 800);
                    },
                });

                this.audioElement = null;
                URL.revokeObjectURL(mediaSourceUrl);
            });

            const processStream = async () => {
                while (true) {
                    if (token !== this.queueToken) {
                        try {
                            await reader.cancel();
                            if (mediaSource.readyState === 'open') {
                                mediaSource.endOfStream();
                            }
                        } catch (error) {}
                        URL.revokeObjectURL(mediaSourceUrl);
                        return;
                    }
                    const { done, value } = await reader.read();
                    if (token !== this.queueToken) {
                        try {
                            await reader.cancel();
                            if (mediaSource.readyState === 'open') {
                                mediaSource.endOfStream();
                            }
                        } catch (error) {}
                        URL.revokeObjectURL(mediaSourceUrl);
                        return;
                    }
                    if (done) {
                        isStreamEnded = true;
                        if (bufferQueue.length === 0 && !sourceBuffer.updating) {
                            if (mediaSource.readyState === 'open') {
                                mediaSource.endOfStream();
                            }
                        }
                        return;
                    }

                    const buffer = cloneChunk(value);
                    fullChunks.push(buffer);
                    if (sourceBuffer.updating || bufferQueue.length > 0) {
                        bufferQueue.push(buffer);
                    } else {
                        try {
                            sourceBuffer.appendBuffer(buffer);
                        } catch (error) {
                            bufferQueue.push(buffer);
                        }
                    }
                }
            };

            processStream().catch((error) => {
                console.error('Error while processing audio stream:', error);
            });
        } catch (err) {
            console.error(err);
            if (mediaSource.readyState === 'open') {
                try {
                    mediaSource.endOfStream();
                } catch (e) {}
            }
            try {
                audio.pause();
            } catch (pauseErr) {}
            audio.src = '';
            this.audioElement = null;
            URL.revokeObjectURL(mediaSourceUrl);
        }
    }

    async playAudioWithoutMediaSource(response, token = this.queueToken) {
        if (token !== this.queueToken) {
            return;
        }

        const audio = new Audio();
        this.audioElement = audio;

        let blobUrl = '';
        try {
            const finalBlob = await response.blob();
            if (token !== this.queueToken) {
                return;
            }

            if (!finalBlob || finalBlob.size === 0) {
                console.warn('Received empty audio stream');
                this.updateVoiceStatus('idle');
                return;
            }

            blobUrl = URL.createObjectURL(finalBlob);
        } catch (error) {
            console.error('Failed to buffer audio stream for fallback playback:', error);
            this.updateVoiceStatus('idle');
            return;
        }

        audio.src = blobUrl;
        audio.load();

        audio.addEventListener(
            'canplay',
            () => {
                this.addSpeakingAnimation();
                const playPromise = audio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch((err) => {
                        console.error(err);
                        this.updateVoiceStatus('idle');
                    });
                }
                this.visualizerCleanup = this.createAudioVisualizer(audio);
            },
            { once: true }
        );

        audio.addEventListener('error', (e) => {
            console.error(e, 'audio playback error (fallback)');
            if (token !== this.queueToken) {
                return;
            }
            this.cleanupVisualizer();
            this.audioElement = null;
            this.currentTtsAbortController = null;
            URL.revokeObjectURL(blobUrl);
            this.advanceQueue({
                onEmpty: () => {
                    this.removeAllAnimation();
                    this.hideRepeatControls();
                },
            });
        });

        audio.addEventListener('pause', () => {
            if (token !== this.queueToken) {
                return;
            }

            if (!audio.ended) {
                this.updateVoiceStatus('idle');
            }
        });

        audio.addEventListener('ended', () => {
            if (token !== this.queueToken) {
                return;
            }

            this.currentTtsAbortController = null;
            this.cleanupVisualizer();

            this.advanceQueue({
                onEmpty: () => {
                    const lastMsgElement = document.querySelector('.last-message-text');

                    if (lastMsgElement) {
                        lastMsgElement.innerHTML = `<strong>${this.agentOrBotName}</strong>: ${
                            this.agentOrBotLastMsg.slice(0, 100) +
                            (this.agentOrBotLastMsg.length > 100 ? '...' : '')
                        }`;

                        lastMsgElement.classList.remove('mck-hidden');
                    }

                    this.agentOrBotLastMsgAudio = blobUrl;

                    document
                        .getElementById('mck-voice-repeat-last-msg')
                        ?.classList.remove('mck-hidden');

                    kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');

                    const ring1 = document.querySelector('.voice-ring-1');
                    ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                    ring1.classList.add('ring-recede');

                    setTimeout(() => {
                        ring1.classList.remove('ring-recede');
                        this.removeAllAnimation();
                    }, 800);
                },
            });
            this.audioElement = null;
            if (this.messagesQueue.length > 0) {
                URL.revokeObjectURL(blobUrl);
            }
            this.updateVoiceStatus('idle');
        });
    }

    async repeatLastMsgAudio(blobUrl) {
        try {
            this.addSpeakingAnimation();
            let audioBlobUrl = blobUrl;

            const audio = new Audio(audioBlobUrl);
            this.audioElement = audio;

            this.visualizerCleanup = this.createAudioVisualizer(audio);

            await audio.play().catch(console.error);

            audio.onerror = (err) => {
                console.error('Playback failed', err);
                this.audioElement = null;
                this.updateVoiceStatus('idle');
            };
            audio.onended = () => {
                const lastMsgElement = document.querySelector('.last-message-text');

                // Clean up visualizer but don't remove animation yet
                this.cleanupVisualizer();

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

                // Remove ring-recede class after animation completes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                }, 1500); // Match this to animation duration in CSS
                this.audioElement = null;
                this.updateVoiceStatus('idle');
            };
        } catch (error) {
            console.error('Playback failed:', error);
            this.updateVoiceStatus('idle');
        }
    }

    addEventListeners() {
        const self = this;
        this.updateVoiceStatus(this.currentVoiceStatus || 'idle');
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
            this.resetState();

            kommunicateCommons.show('#mck-sidebox-ft', '.mck-box-body');

            document.querySelector('.mck-box-top').classList.remove('n-vis');

            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg', 'last-message-text'] },
                'mck-hidden'
            );

            kommunicateCommons.hide('#mck-voice-interface');
        });

        document.querySelector('#mck-voice-speak-btn').addEventListener('click', () => {
            this.resetState();
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
                        this.updateVoiceStatus('idle');
                        return false; // Indicate empty recording
                    }

                    this.hasSoundDetected = false;
                    this.soundSamples = 0;
                    this.totalSamples = 0;

                    this.updateVoiceStatus('thinking');

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
                this.updateVoiceStatus('idle');
            } finally {
                // Clean up the stream tracks
                if (this.stream) {
                    try {
                        this.stream.getTracks().forEach((track) => track.stop());
                    } catch (cleanupError) {
                        console.error('Error while stopping stream tracks:', cleanupError);
                    }
                }
                this.stream = null;
                this.isRecording = false;

                this.cleanupSilenceDetection();
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
        this.updateVoiceStatus('thinking');
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
        this.updateVoiceStatus('speaking');
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
        this.updateVoiceStatus('listening');
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

    getVoiceLabel(key, fallback = '') {
        const labelSource =
            (window.MCK_LABELS && window.MCK_LABELS.voiceInterface) ||
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceInterface) ||
            {};
        return labelSource[key] || fallback;
    }

    updateVoiceStatus(state = 'idle') {
        this.currentVoiceStatus = state;

        const statusEl = document.getElementById('mck-voice-status-text');
        const speakBtn = document.getElementById('mck-voice-speak-btn');
        const speakBtnLabel = document.getElementById('mck-voice-speak-btn-label');

        const statusTextMap = {
            listening: this.getVoiceLabel('listening', 'Listening...'),
            thinking: this.getVoiceLabel('thinking', 'Thinking...'),
            speaking: this.getVoiceLabel('speaking', 'Speaking...'),
            idle: this.getVoiceLabel('ready', this.getVoiceLabel('speak', 'Click to Speak')),
        };

        const statusText = statusTextMap[state] || statusTextMap.idle;

        if (statusEl) {
            statusEl.textContent = statusText;
            statusEl.classList.toggle('mck-hidden', !statusText);
            statusEl.dataset.state = state;
        }

        let speakText = this.getVoiceLabel('speak', 'Click to Speak');
        let speakDisabled = false;

        if (state === 'listening') {
            speakText = statusTextMap.listening;
            speakDisabled = true;
        } else if (state === 'thinking') {
            speakText = statusTextMap.thinking;
            speakDisabled = true;
        }

        if (speakBtn) {
            speakBtn.disabled = speakDisabled;
            speakBtn.setAttribute('aria-disabled', speakDisabled);
            speakBtn.classList.toggle('mck-voice-btn-disabled', speakDisabled);
            speakBtn.setAttribute('aria-label', speakText);
        }

        if (speakBtnLabel) {
            speakBtnLabel.textContent = speakText;
        }
    }

    cleanupSilenceDetection() {
        if (this.silenceTimer) {
            clearInterval(this.silenceTimer);
            this.silenceTimer = null;
        }

        if (this.silenceNodes) {
            const { analyser, microphone, scriptProcessor } = this.silenceNodes;
            try {
                microphone && microphone.disconnect();
                analyser && analyser.disconnect();
                scriptProcessor && scriptProcessor.disconnect();
            } catch (disconnectError) {
                console.error('Error disconnecting silence detection nodes:', disconnectError);
            }
            this.silenceNodes = null;
        }

        if (this.silenceAudioContext) {
            const contextToClose = this.silenceAudioContext;
            contextToClose.close().catch((closeError) => {
                console.error('Error closing silence detection context:', closeError);
            });
            this.silenceAudioContext = null;
        }
    }

    abortCurrentTts() {
        if (!this.currentTtsAbortController) {
            return;
        }

        try {
            this.currentTtsAbortController.abort();
        } catch (error) {
            console.error('Error while aborting TTS request:', error);
        } finally {
            this.currentTtsAbortController = null;
        }
    }

    resetState() {
        try {
            this.stopRecording(true);
        } catch (error) {
            console.error('Error while stopping recording during reset:', error);
        }

        this.abortCurrentTts();
        this.queueToken += 1;
        this.stopAudio();
        this.cleanupVisualizer();
        this.removeAllAnimation();
        this.hideRepeatControls();
        this.cleanupSilenceDetection();

        this.messagesQueue.length = 0;
        this.audioChunks = [];
        this.isRecording = false;
        if (this.stream) {
            try {
                this.stream.getTracks().forEach((track) => track.stop());
            } catch (error) {
                console.error('Error while stopping audio tracks during reset:', error);
            }
        }
        this.stream = null;
        if (this.silenceTimer) {
            clearInterval(this.silenceTimer);
            this.silenceTimer = null;
        }
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;
        this.agentOrBotName = '';
        this.agentOrBotLastMsg = '';
        this.agentOrBotLastMsgAudio = null;
        this.audioElement = null;
        this.mediaRecorder = null;

        this.updateVoiceStatus('idle');
    }

    cleanupVisualizer() {
        if (!this.visualizerCleanup) {
            return;
        }

        try {
            this.visualizerCleanup();
        } catch (error) {
            console.error('Error while cleaning up visualizer:', error);
        } finally {
            this.visualizerCleanup = null;
        }
    }

    hideRepeatControls() {
        const repeatBtn = document.getElementById('mck-voice-repeat-last-msg');
        repeatBtn && repeatBtn.classList.add('mck-hidden');

        const lastMsgElement = document.querySelector('.last-message-text');
        if (lastMsgElement) {
            lastMsgElement.classList.add('mck-hidden');
            lastMsgElement.innerHTML = '';
        }
    }

    advanceQueue({ onEmpty } = {}) {
        const token = this.queueToken;
        if (this.messagesQueue.length > 0) {
            this.messagesQueue.shift();
        }

        if (this.messagesQueue.length > 0) {
            const nextMsg = this.messagesQueue[0];
            this.processNextMessage(nextMsg.msg, nextMsg.displayName, token);
            return;
        }

        if (typeof onEmpty === 'function') {
            onEmpty();
        }

        this.updateVoiceStatus('idle');
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

    async setupSilenceDetection(stream) {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

        if (!AudioContextCtor) {
            console.warn('AudioContext not supported, disabling silence detection');
            return;
        }

        this.cleanupSilenceDetection();

        try {
            // Create audio context
            const audioContext = new AudioContextCtor();

            // Firefox-specific: Handle suspended state with robust error handling
            if (audioContext.state === 'suspended') {
                console.log('AudioContext is suspended, attempting to resume...');

                try {
                    // Create a timeout promise for Firefox's sometimes-hanging resume()
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('AudioContext resume timeout')), 3000);
                    });

                    const resumePromise = audioContext.resume();

                    // Race the resume against timeout
                    await Promise.race([resumePromise, timeoutPromise]);

                    console.log('AudioContext resumed successfully for silence detection');
                } catch (resumeError) {
                    console.error('Failed to resume AudioContext:', resumeError);

                    // Firefox fallback: try creating a new context
                    try {
                        await audioContext.close();
                        const newContext = new AudioContextCtor();

                        if (newContext.state === 'running') {
                            console.log('Created new running AudioContext as fallback');
                            // Replace the suspended context with the new one
                            audioContext = newContext;
                        } else {
                            throw new Error('New AudioContext also suspended');
                        }
                    } catch (fallbackError) {
                        console.error('AudioContext fallback failed:', fallbackError);
                        return; // Give up on silence detection
                    }
                }
            }

            // Verify the context is actually running before proceeding
            if (audioContext.state !== 'running') {
                console.warn('AudioContext not running, disabling silence detection');
                audioContext.close();
                return;
            }

            const analyser = audioContext.createAnalyser();
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            // Create MediaStreamSource - this is where Firefox can have issues
            let microphone;
            try {
                microphone = audioContext.createMediaStreamSource(stream);
            } catch (sourceError) {
                console.error('Failed to create MediaStreamSource:', sourceError);
                audioContext.close();
                return;
            }

            // Firefox sometimes has issues with ScriptProcessor - use AnalyserNode directly
            let scriptProcessor = null;

            try {
                // Try to create ScriptProcessor (deprecated but sometimes more reliable in Firefox)
                if (audioContext.createScriptProcessor) {
                    scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

                    microphone.connect(analyser);
                    analyser.connect(scriptProcessor);
                    scriptProcessor.connect(audioContext.destination);

                    console.log('Using ScriptProcessor for silence detection');
                }
            } catch (scriptError) {
                console.warn('ScriptProcessor failed, using direct polling:', scriptError);
                // Fallback: just connect microphone to analyser without script processor
                microphone.connect(analyser);
                scriptProcessor = null;
            }

            this.silenceAudioContext = audioContext;
            this.silenceNodes = { analyser, microphone, scriptProcessor };

            const silenceDetection = () => {
                // Check if we're still recording and context is still valid
                if (!this.isRecording || audioContext.state !== 'running') {
                    this.cleanupSilenceDetection();
                    return;
                }

                try {
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
                } catch (analysisError) {
                    console.error('Error in silence analysis:', analysisError);
                    this.cleanupSilenceDetection();
                }
            };

            // Check for silence every 300ms
            this.silenceTimer = setInterval(silenceDetection, 300);

            // Set up cleanup handler if using ScriptProcessor
            if (scriptProcessor) {
                scriptProcessor.onaudioprocess = () => {
                    if (!this.isRecording) {
                        this.cleanupSilenceDetection();
                    }
                };
            }

            console.log('Silence detection setup complete');
        } catch (setupError) {
            console.error('Failed to setup silence detection:', setupError);
            this.cleanupSilenceDetection();
        }
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
            this.updateVoiceStatus(this.currentVoiceStatus || 'idle');
        }
    }
}

const mckVoice = new MckVoice();
