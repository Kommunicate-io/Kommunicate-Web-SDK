class MckVoice {
    // Using underscore prefix instead of # for compatibility with build tools
    _RMS_THRESHOLD = 0.018;
    _ZERO_CROSSING_THRESHOLD = 0.03;
    _SILENCE_DURATION = 600; // 0.6 seconds of silence before stopping
    _MIN_SPEECH_DURATION = 120; // require at least 120ms of speech before silencing
    _MAX_RECORDING_DURATION = 30000; // fail-safe to avoid endless recording
    _SILENCE_NOISE_TOLERANCE = 200; // ignore short spikes after silence starts
    // Threshold for frequency-domain visualizer (0..255 scale)
    _NOISE_THRESHOLD = 8;

    // animation scale for speaking
    _MIN_SPEAK_ANIMATION_SCALE = 0.7;
    _MAX_SPEAK_ANIMATION_SCALE = 1.0;
    _RING_RECEDE_DURATION = 800;

    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = []; // recorded audio chunks
        this.isRecording = false;
        this.stream = null;
        this.agentOrBotName = '';
        this.agentOrBotLastMsg = '';
        this.agentOrBotLastMsgAudio = null;
        this.messagesQueue = [];
        this.textboxVoiceActiveClass = 'km-voice-active';

        // to check if audio is empty before sending to server
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;

        this.audioElement = null;
        this.statusElement = null;
        this.transcriptElement = null;
        this.responseElement = null;
        this.responseContainer = null;
        this.responseTimeout = null;
        this.transcriptTimeout = null;
        this.autoListeningEnabled = false;
        this.autoListenTimeout = null;
        this.voiceMuted = false;
        this.inlineStatusContainer = null;
        this.speechDetected = false;
        this.isInSilence = false;
        this.firstSpeechTimestamp = 0;
        this.maxRecordingTimer = null;
        this.deferredRecordingHandler = null;
        this.silenceDetectionContext = null;
        this.silenceTimeout = null;
        this.silenceNoiseStart = null;
    }

    async processMessagesAsAudio(msg, displayName) {
        try {
            this.messagesQueue.push({ msg, displayName });
            if (this.messagesQueue.length === 1) {
                this.processNextMessage(msg, displayName);
            }
        } catch (err) {
            console.error(err);
            this.messagesQueue.shift();
            if (this.messagesQueue.length > 0) {
                const nextMsg = this.messagesQueue[0];
                this.processNextMessage(nextMsg.msg, nextMsg.displayName);
            }
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
            const responseText = displayName
                ? `${displayName}: ${messageWithoutSource}`
                : messageWithoutSource;
            this.updateResponseText(responseText, { autoHide: 0 });

            const response = await kmVoice.textToSpeechStream(messageWithoutSource);

            this.playAudioWithMediaSource(response);
        } catch (err) {
            console.error(err);
        }
    }

    async playAudioWithMediaSource(response) {
        this.clearDeferredRecordingHandler(this.audioElement);
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
                URL.revokeObjectURL(mediaSourceUrl);
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

                const finalBlob = new Blob(fullChunks, { type: 'audio/mpeg' });
                const blobUrl = URL.createObjectURL(finalBlob);

                if (this.agentOrBotLastMsgAudio) {
                    URL.revokeObjectURL(this.agentOrBotLastMsgAudio);
                }
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

                console.debug('Playback ended, starting recede animation');

                // Wait for animation to complete before removing all classes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                    this.removeAllAnimation();
                    this.scheduleAutoListen();
                    this.clearVoiceStatus();
                }, this._RING_RECEDE_DURATION); // Match animation duration in CSS
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

            processStream().catch((err) => {
                console.error('Stream processing error:', err);
                URL.revokeObjectURL(mediaSourceUrl);
                if (mediaSource.readyState === 'open') {
                    try {
                        mediaSource.endOfStream('network');
                    } catch (e) {}
                }
            });
        } catch (err) {
            console.error(err);
            URL.revokeObjectURL(mediaSourceUrl);
            if (mediaSource.readyState === 'open') {
                try {
                    mediaSource.endOfStream();
                } catch (e) {}
            }
        }
    }

    async repeatLastMsgAudio(blobUrl) {
        try {
            if (this.visualizerCleanup) {
                this.visualizerCleanup();
                this.visualizerCleanup = null;
            }
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
                this.audioElement = null;
            }
            this.addSpeakingAnimation();
            let audioBlobUrl = blobUrl;

            const audio = new Audio(audioBlobUrl);
            this.audioElement = audio;

            this.visualizerCleanup = this.createAudioVisualizer(audio);

            await audio.play().catch(console.error);

            audio.onplay = () => {
                console.debug('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
                this.audioElement = null;
            };
            audio.onended = () => {
                // Clean up visualizer but don't remove animation yet
                if (this.visualizerCleanup) {
                    this.visualizerCleanup();
                    this.visualizerCleanup = null;
                }

                document.getElementById('mck-voice-repeat-last-msg').classList.remove('mck-hidden');

                // Hide other rings
                kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');

                // Apply receding animation to the first ring
                const ring1 = document.querySelector('.voice-ring-1');
                ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                ring1.classList.add('ring-recede');

                console.debug('Playback ended, starting recede animation');

                // Remove ring-recede class after animation completes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                    this.scheduleAutoListen();
                    this.clearVoiceStatus();
                }, this._RING_RECEDE_DURATION); // Match animation duration in CSS
                this.audioElement = null;
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    addEventListeners() {
        const self = this;
        const responseLabelElement = document.getElementById('mck-voice-response-label');
        if (responseLabelElement) {
            responseLabelElement.textContent = this.getVoiceLabel(
                'voiceInterface.responseLabel',
                'Response:'
            );
        }
        this.updateMuteButton();
        this.updateChatButtonText();
        document.querySelector('.mck-voice-web').addEventListener('click', () => {
            this.enableAutoListening();
            this.setVoiceMuted(false);
            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-1'] },
                '',
                'mck-ring-remove-animation'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-voice-repeat-last-msg'],
                },
                'mck-hidden'
            );
            // Call the audio recording function
            this.requestAudioRecordingWhenReady();
        });

        document.querySelector('#mck-voice-chat-btn').addEventListener('click', () => {
            this.disableAutoListening();
            this.stopRecording(true);

            kommunicateCommons.modifyClassList(
                { class: ['mck-voice-repeat-last-msg'] },
                'mck-hidden'
            );

            this.clearVoiceStatus();
            this.updateLiveTranscript('');
            this.updateResponseText('');
            this.hideInlineStatus();
            this.setTextboxVoiceActive(false);
        });

        document.querySelector('#mck-voice-speak-btn').addEventListener('click', () => {
            this.toggleMute();
        });

        document.getElementById('mck-voice-repeat-last-msg').addEventListener('click', function () {
            this.classList.toggle('mck-hidden');

            kommunicateCommons.show('.voice-ring-2', '.voice-ring-3');
            const ring1 = document.querySelector('.voice-ring-1');
            ring1.classList.remove('mck-ring-remove-animation');

            self.repeatLastMsgAudio(self.agentOrBotLastMsgAudio);
        });

        const inlineActionBtn = document.getElementById('km-voice-inline-action-btn');
        if (inlineActionBtn) {
            inlineActionBtn.addEventListener('click', () => {
                this.stopVoiceMode();
                if (
                    typeof KommunicateUI === 'object' &&
                    KommunicateUI &&
                    typeof KommunicateUI.activateTypingField === 'function'
                ) {
                    KommunicateUI.activateTypingField();
                }
            });
        }
        const inlineMicBtn = document.getElementById('km-voice-inline-mic-btn');
        if (inlineMicBtn) {
            inlineMicBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }
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

    requestAudioRecordingWhenReady() {
        if (this.audioElement && !this.audioElement.paused && !this.audioElement.ended) {
            this.deferRecordingUntilPlaybackEnds();
            return;
        }
        this.requestAudioRecording();
    }

    deferRecordingUntilPlaybackEnds() {
        const audioElement = this.audioElement;
        if (!audioElement) {
            this.requestAudioRecording();
            return;
        }

        this.clearDeferredRecordingHandler(audioElement);

        const handler = () => {
            this.clearDeferredRecordingHandler(audioElement);
            if (
                this.autoListeningEnabled &&
                this.isVoiceInterfaceVisible() &&
                !this.voiceMuted &&
                !this.isRecording
            ) {
                this.requestAudioRecording();
            }
        };

        this.deferredRecordingHandler = handler;
        audioElement.addEventListener('ended', handler);
        audioElement.addEventListener('pause', handler);
    }

    clearDeferredRecordingHandler(audioElement = this.audioElement) {
        if (this.deferredRecordingHandler && audioElement) {
            audioElement.removeEventListener('ended', this.deferredRecordingHandler);
            audioElement.removeEventListener('pause', this.deferredRecordingHandler);
        }
        this.deferredRecordingHandler = null;
    }

    startRecording(stream) {
        this.addListeningAnimation();
        this.setTextboxVoiceActive(true);
        this.stream = stream;
        this.audioChunks = [];
        this.isRecording = true;
        this.silenceTimer = null;
        this.lastAudioLevel = 0;
        this.silenceStart = null;
        this.agentOrBotLastMsgAudio = null;
        this.agentOrBotLastMsg = '';
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;
        this.speechDetected = false;
        this.isInSilence = false;
        this.firstSpeechTimestamp = 0;
        this.maxRecordingTimer = null;
        this.silenceNoiseStart = null;
        this.silenceTimeout = null;

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

                    this.updateVoiceStatus(
                        this.getVoiceLabel('voiceInterface.processing', 'Processing')
                    );
                    const data = await kmVoice.speechToText(audioBlob);
                    const rawText = data.text || '';
                    const userMsg = rawText.trim();
                    const prefix = this.getVoiceLabel('you', 'You');
                    const noSpeechLabel = this.getVoiceLabel(
                        'voiceInterface.noSpeechDetected',
                        'No speech detected. Please try again.'
                    );
                    const transcriptText = userMsg ? `${prefix}: ${userMsg}` : noSpeechLabel;
                    this.updateLiveTranscript(transcriptText, { autoHide: 9000 });

                    if (!userMsg) {
                        return;
                    }

                    if (!CURRENT_GROUP_DATA || !CURRENT_GROUP_DATA.tabId) {
                        console.error('No active conversation to send voice message');
                        this.updateLiveTranscript(
                            this.getVoiceLabel(
                                'voiceInterface.noActiveConversation',
                                'Please open a conversation first.'
                            ),
                            { autoHide: 5000 }
                        );
                        return;
                    }
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
                this.clearVoiceStatus();
                this.updateLiveTranscript(
                    this.getVoiceLabel(
                        'voiceInterface.processingFailed',
                        'Unable to transcribe the recording. Please try again.'
                    ),
                    { autoHide: 6000 }
                );
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
                this.clearSilenceTimeout();
                if (this.maxRecordingTimer) {
                    clearTimeout(this.maxRecordingTimer);
                    this.maxRecordingTimer = null;
                }
                this.scheduleAutoListen();
            }
        };

        // Start recording
        this.mediaRecorder.start(); // Collect data every second
        console.debug('Recording started');

        this.maxRecordingTimer = setTimeout(() => {
            if (this.isRecording) {
                console.debug('Max recording duration reached, stopping');
                this.stopRecording();
                this.addThinkingAnimation();
            }
        }, this._MAX_RECORDING_DURATION);

        // Set up audio analysis for silence detection
        this.setupSilenceDetection(stream);
        const listeningLabel = this.getVoiceLabel('voiceInterface.listening', 'Listening...');
        this.updateVoiceStatus(listeningLabel, true);
        this.updateLiveTranscript('');
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
        let audioContext = null;
        try {
            // Create audio context and analyzer
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
                audioContext.close().catch(() => {});
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
            if (audioContext) {
                audioContext.close().catch(() => {});
            }
            return () => {};
        }
    }
    getStatusElement() {
        if (!this.statusElement) {
            this.statusElement = document.getElementById('km-voice-inline-text');
        }
        return this.statusElement;
    }

    getTranscriptElement() {
        if (!this.transcriptElement) {
            this.transcriptElement = document.getElementById('mck-voice-live-transcript');
        }
        return this.transcriptElement;
    }

    getResponseElement() {
        if (!this.responseElement) {
            this.responseElement = document.getElementById('mck-voice-response-text');
        }
        return this.responseElement;
    }

    getInlineStatusContainer() {
        if (!this.inlineStatusContainer) {
            this.inlineStatusContainer = document.getElementById('km-voice-listening-status');
        }
        return this.inlineStatusContainer;
    }

    setVoiceButtonState(state) {
        const btn = document.getElementById('mck-voice-web');
        if (!btn) {
            return;
        }
        btn.dataset.voiceState = state;
        const label = btn.querySelector('.mck-voice-state-label');
        const stateTextMap = {
            idle: this.getVoiceLabel('voiceInterface.speak', 'Voice'),
            listening: this.getVoiceLabel('voiceInterface.listening', 'Listening...'),
            processing: this.getVoiceLabel('voiceInterface.processing', 'Processing'),
        };
        if (label) {
            label.textContent = stateTextMap[state] || label.textContent;
        }
    }

    showVoiceStopButton() {
        const stopBtn = document.getElementById('mck-voice-stop-btn');
        stopBtn && kommunicateCommons.show(stopBtn);
    }

    hideVoiceStopButton() {
        const stopBtn = document.getElementById('mck-voice-stop-btn');
        stopBtn && kommunicateCommons.hide(stopBtn);
    }

    setTextboxVoiceActive(isActive) {
        const container = document.getElementById('mck-textbox-container');
        if (!container) {
            return;
        }
        container.classList.toggle(this.textboxVoiceActiveClass, Boolean(isActive));
    }

    showInlineStatus() {
        const container = this.getInlineStatusContainer();
        if (container) {
            container.classList.remove('n-vis');
        }
    }

    showInlineMicButton() {
        const micBtn = document.getElementById('km-voice-inline-mic-btn');
        micBtn && micBtn.classList.remove('n-vis');
    }

    hideInlineMicButton() {
        const micBtn = document.getElementById('km-voice-inline-mic-btn');
        micBtn && micBtn.classList.add('n-vis');
    }

    hideInlineStatus() {
        const container = this.getInlineStatusContainer();
        if (container) {
            kommunicateCommons.hide(container);
            this.hideInlineMicButton();
        }
    }

    clearVoiceStatus() {
        if (this.voiceMuted) {
            return;
        }
        const element = this.getStatusElement();
        if (!element) {
            return;
        }
        element.textContent = '';
        element.classList.add('n-vis');
        element.removeAttribute('data-listening');
    }

    updateVoiceStatus(text, listening = false) {
        const element = this.getStatusElement();
        if (!element) {
            return;
        }
        const micBtn = document.getElementById('km-voice-inline-mic-btn');
        if (micBtn) {
            micBtn.setAttribute(
                'aria-label',
                text || this.getVoiceLabel('voiceInterface.listening', 'Listening')
            );
            micBtn.dataset.listening = listening ? 'true' : 'false';
        }
        if (!text) {
            element.textContent = '';
            element.classList.add('n-vis');
            element.removeAttribute('data-listening');
            this.hideInlineStatus();
            this.hideInlineMicButton();
            return;
        }
        element.textContent = text;
        element.classList.remove('n-vis');
        this.showInlineStatus();
        this.showInlineMicButton();
        element.setAttribute('data-listening', listening ? 'true' : 'false');
    }

    updateLiveTranscript(text, { autoHide = 0 } = {}) {
        const element = this.getTranscriptElement();
        if (!element) {
            return;
        }
        if (this.transcriptTimeout) {
            clearTimeout(this.transcriptTimeout);
            this.transcriptTimeout = null;
        }
        if (!text) {
            element.classList.add('mck-hidden');
            element.textContent = '';
            return;
        }
        element.textContent = text;
        element.classList.remove('mck-hidden');
        if (autoHide > 0) {
            this.transcriptTimeout = setTimeout(() => {
                this.updateLiveTranscript('');
            }, autoHide);
        }
    }

    updateResponseText(text, { autoHide = 0 } = {}) {
        this.clearResponseTimeout();

        const element = this.getResponseElement();
        const container = this.getResponseContainer();
        if (!element || !container) {
            return;
        }
        if (!text) {
            element.textContent = '';
            container.classList.add('mck-hidden');
            return;
        }
        element.textContent = text;
        container.classList.remove('mck-hidden');
        if (autoHide > 0) {
            this.responseTimeout = setTimeout(() => {
                this.responseTimeout = null;
                this.updateResponseText('', {});
            }, autoHide);
        }
    }

    getVoiceLabel(key, fallback) {
        if (window.KommunicateUI && typeof KommunicateUI.getLabel === 'function') {
            return KommunicateUI.getLabel(key, fallback);
        }
        return fallback || '';
    }

    getResponseContainer() {
        if (!this.responseContainer) {
            this.responseContainer = document.getElementById('mck-voice-response');
        }
        return this.responseContainer;
    }

    isVoiceInterfaceVisible() {
        const container = this.getInlineStatusContainer();
        return this.autoListeningEnabled || (container && !container.classList.contains('n-vis'));
    }

    isVoiceModeActive() {
        return this.autoListeningEnabled || this.isRecording;
    }

    clearAutoListenTimeout() {
        if (this.autoListenTimeout) {
            clearTimeout(this.autoListenTimeout);
            this.autoListenTimeout = null;
        }
    }

    clearResponseTimeout() {
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
            this.responseTimeout = null;
        }
    }

    clearSilenceTimeout() {
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
        }
        this.silenceNoiseStart = null;
    }

    startSilenceTimeout() {
        this.clearSilenceTimeout();
        if (!this.silenceStart) {
            return;
        }
        const elapsed = Date.now() - this.silenceStart;
        const delay = Math.max(this._SILENCE_DURATION - elapsed, 0);
        if (delay === 0) {
            this.handleSilenceTimeout();
            return;
        }
        this.silenceTimeout = setTimeout(() => this.handleSilenceTimeout(), delay);
    }

    handleSilenceTimeout() {
        this.silenceTimeout = null;
        if (!this.isRecording || !this.isInSilence) {
            return;
        }
        const silenceDuration = this.silenceStart ? Date.now() - this.silenceStart : 0;
        if (silenceDuration < this._SILENCE_DURATION) {
            this.startSilenceTimeout();
            return;
        }
        console.debug('User silent for a few moments, stopping recording');
        this.stopRecording();
        this.addThinkingAnimation();
    }

    enableAutoListening() {
        this.autoListeningEnabled = true;
        this.clearAutoListenTimeout();
        this.clearResponseTimeout();
    }

    disableAutoListening() {
        this.autoListeningEnabled = false;
        this.clearAutoListenTimeout();
        this.clearResponseTimeout();
    }

    scheduleAutoListen(delay = 300) {
        this.clearAutoListenTimeout();
        if (
            !this.autoListeningEnabled ||
            this.voiceMuted ||
            this.isRecording ||
            !this.isVoiceInterfaceVisible() ||
            this.audioElement !== null
        ) {
            return;
        }
        this.autoListenTimeout = setTimeout(() => {
            this.autoListenTimeout = null;
            if (
                this.autoListeningEnabled &&
                !this.voiceMuted &&
                !this.isRecording &&
                this.isVoiceInterfaceVisible() &&
                this.audioElement === null
            ) {
                const listeningLabel = this.getVoiceLabel(
                    'voiceInterface.listening',
                    'Listening...'
                );
                this.updateVoiceStatus(listeningLabel, true);
                this.requestAudioRecording();
            }
        }, delay);
    }
    updateMuteButton() {
        const button = document.getElementById('mck-voice-speak-btn');
        if (!button) {
            return;
        }
        const actionKey = this.voiceMuted
            ? 'voiceInterface.unmuteAction'
            : 'voiceInterface.muteAction';
        const label = this.getVoiceLabel(
            actionKey,
            this.voiceMuted ? 'Unmute microphone' : 'Mute microphone'
        );
        button.setAttribute('aria-label', label);
        button.dataset.muted = this.voiceMuted ? 'true' : 'false';
        button.classList.toggle('mck-voice-mute-active', this.voiceMuted);
        const textElement = button.querySelector('.mck-voice-btn-text');
        if (textElement) {
            textElement.textContent = label;
        }
        this.updateListeningNote();
    }

    updateListeningNote() {
        const noteElement = document.querySelector('.mck-voice-listening-note');
        if (!noteElement) {
            return;
        }
        const key = this.voiceMuted ? 'voiceInterface.mutedNote' : 'voiceInterface.listeningNote';
        const fallback = this.voiceMuted
            ? 'Microphone paused. Tap the mic to resume voice input.'
            : 'AI assistant is listening for you—just speak.';
        noteElement.textContent = this.getVoiceLabel(key, fallback);
    }

    updateChatButtonText() {
        const button = document.getElementById('mck-voice-chat-btn');
        if (!button) {
            return;
        }
        const label = this.getVoiceLabel('voiceInterface.chat', 'Switch to chat');
        const textElement = button.querySelector('.mck-voice-btn-text');
        if (textElement) {
            textElement.textContent = label;
        }
        button.setAttribute('aria-label', label);

        const inlineActionText = document.getElementById('km-voice-inline-action-text');
        if (inlineActionText) {
            inlineActionText.textContent = label;
        }
        const inlineActionBtn = document.getElementById('km-voice-inline-action-btn');
        if (inlineActionBtn) {
            inlineActionBtn.setAttribute('aria-label', label);
        }
    }

    setVoiceMuted(muted) {
        if (muted) {
            this.clearDeferredRecordingHandler();
        }
        this.voiceMuted = muted;
        this.clearResponseTimeout();
        this.updateMuteButton();
        const statusKey = muted ? 'voiceInterface.muted' : 'voiceInterface.unmuted';
        const statusText = this.getVoiceLabel(statusKey, muted ? 'Microphone muted' : 'Listening');
        const micBtn = document.getElementById('km-voice-inline-mic-btn');
        if (micBtn) {
            micBtn.dataset.muted = muted ? 'true' : 'false';
            micBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
        }
        this.updateVoiceStatus(statusText, !muted);
    }

    toggleMute() {
        if (this.voiceMuted) {
            this.setVoiceMuted(false);
            this.enableAutoListening();
            this.requestAudioRecordingWhenReady();
        } else {
            this.setVoiceMuted(true);
            this.disableAutoListening();
            this.stopRecording(true);
        }
    }
    setupSilenceDetection(stream) {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        this.silenceDetectionContext = audioContext;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        const silenceDetection = () => {
            const timeData = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(timeData);

            let sumSquares = 0;
            let zeroCrossings = 0;
            let prevSign = timeData.length > 0 ? timeData[0] >= 0 : true;
            for (let i = 0; i < timeData.length; i++) {
                const sample = timeData[i];
                sumSquares += sample * sample;
                if (i > 0) {
                    const sign = sample >= 0;
                    if (sign !== prevSign) {
                        zeroCrossings++;
                        prevSign = sign;
                    }
                }
            }

            const rms = Math.sqrt(sumSquares / Math.max(timeData.length, 1));
            const zeroCrossRate = zeroCrossings / Math.max(timeData.length - 1, 1);

            this.totalSamples++;

            const isSpeech =
                rms > this._RMS_THRESHOLD || zeroCrossRate > this._ZERO_CROSSING_THRESHOLD;

            if (isSpeech) {
                this.hasSoundDetected = true;
                this.soundSamples++;
                this.speechDetected = true;
                if (this.isInSilence) {
                    if (!this.silenceNoiseStart) {
                        this.silenceNoiseStart = Date.now();
                    }
                    const noiseDuration = Date.now() - this.silenceNoiseStart;
                    if (noiseDuration < this._SILENCE_NOISE_TOLERANCE) {
                        return;
                    }
                }
                this.silenceStart = null;
                this.silenceNoiseStart = null;
                this.isInSilence = false;
                this.clearSilenceTimeout();
                if (!this.firstSpeechTimestamp) {
                    this.firstSpeechTimestamp = Date.now();
                }
            } else if (!this.speechDetected) {
                return;
            } else {
                if (this.silenceStart === null) {
                    if (
                        this.firstSpeechTimestamp &&
                        Date.now() - this.firstSpeechTimestamp < this._MIN_SPEECH_DURATION
                    ) {
                        return;
                    }
                    this.silenceStart = Date.now();
                    this.isInSilence = true;
                    this.silenceNoiseStart = null;
                    console.debug('Silence detected, starting timer');
                    this.startSilenceTimeout();
                } else {
                    const silenceDuration = Date.now() - this.silenceStart;
                    if (silenceDuration >= this._SILENCE_DURATION) {
                        this.clearSilenceTimeout();
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
                this.clearSilenceTimeout();
                if (this.silenceTimer) {
                    clearInterval(this.silenceTimer);
                    this.silenceTimer = null;
                }
                microphone.disconnect();
                analyser.disconnect();
                scriptProcessor.disconnect();
                if (this.silenceDetectionContext) {
                    this.silenceDetectionContext.close().catch(() => {});
                    this.silenceDetectionContext = null;
                }
            }
        };
    }

    stopRecording(forceStop = false) {
        this.clearSilenceTimeout();
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            forceStop && (this.isRecording = false);
            console.log('Recording stopped');

            if (this.maxRecordingTimer) {
                clearTimeout(this.maxRecordingTimer);
                this.maxRecordingTimer = null;
            }

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

        this.clearDeferredRecordingHandler(this.audioElement);

        if (this.visualizerCleanup) {
            this.visualizerCleanup();
            this.visualizerCleanup = null;
        }

        this.audioElement = null;
    }

    stopVoiceMode() {
        this.disableAutoListening();
        this.clearDeferredRecordingHandler();
        this.clearResponseTimeout();
        this.stopRecording(true);
        this.clearVoiceStatus();
        this.updateLiveTranscript('');
        this.updateResponseText('');
        this.hideInlineStatus();
        this.hideInlineMicButton();
        this.voiceMuted = false;
        this.updateMuteButton();
        this.updateChatButtonText();
        this.setTextboxVoiceActive(false);
        this.setVoiceButtonState('idle');
        this.hideVoiceStopButton();
        kommunicateCommons.show('#mck-voice-web');
        const inlineStatus = document.getElementById('km-voice-listening-status');
        inlineStatus && kommunicateCommons.hide(inlineStatus);
        this.speechDetected = false;
        this.isInSilence = false;
        this.firstSpeechTimestamp = 0;
        if (
            typeof KommunicateUI === 'object' &&
            KommunicateUI &&
            typeof KommunicateUI.activateTypingField === 'function'
        ) {
            KommunicateUI.activateTypingField();
        }
    }

    showMic(appOptions) {
        if (appOptions.voiceChat) {
            kommunicateCommons.show('#mck-voice-web');
        }
    }
}

const mckVoice = new MckVoice();
