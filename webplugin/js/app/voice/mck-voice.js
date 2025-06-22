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

        // to check if audio is empty before sending to server
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;
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
                kommunicateCommons.modifyClassList(
                    { class: ['voice-ring-2', 'voice-ring-3'] },
                    'n-vis'
                );

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
            this.visualizerCleanup = this.createAudioVisualizer(audio);

            await audio.play().catch(console.error);

            audio.onplay = () => {
                console.log('Playback started');
            };
            audio.onerror = (err) => {
                console.error('Playback failed', err);
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
                kommunicateCommons.modifyClassList(
                    { class: ['voice-ring-2', 'voice-ring-3'] },
                    'n-vis'
                );

                // Apply receding animation to the first ring
                const ring1 = document.querySelector('.voice-ring-1');
                ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                ring1.classList.add('ring-recede');

                console.log('Playback ended, starting recede animation');

                // Remove ring-recede class after animation completes
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                }, 1500); // Match this to animation duration in CSS
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
                'n-vis'
            );

            kommunicateCommons.modifyClassList({ id: ['mck-voice-interface'] }, 'vis', 'n-vis');
            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-2', 'voice-ring-3'] },
                '',
                'n-vis'
            );
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

            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                    class: ['mck-box-body'],
                },
                'vis',
                'n-vis'
            );

            document.querySelector('.mck-box-top').classList.remove('n-vis');

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

            kommunicateCommons.modifyClassList(
                { class: ['voice-ring-2', 'voice-ring-3'] },
                '',
                'n-vis'
            );
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
            let lastScale = 0.7; // Initialize with minimum scale (matching minScale)
            const NOISE_THRESHOLD = 130; // Increased threshold to better detect actual sound vs silence

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

                const average = sum / bufferLength;

                // Scale settings
                const minScale = 0.7;
                const maxScale = 1.0;

                // Only change scale if sound is above the noise threshold
                let targetScale;
                if (peakValue > NOISE_THRESHOLD) {
                    // Map peak value to scale range, with emphasis on voice frequencies
                    targetScale = minScale + (peakValue / 255) * (maxScale - minScale);
                } else {
                    // If no significant sound, maintain minimum scale
                    targetScale = minScale;
                }

                // Force exact minimum scale during silence to avoid lingering at 0.85
                if (peakValue <= NOISE_THRESHOLD) {
                    // When silent, ensure it gets very close to minimum or just set it directly
                    if (Math.abs(lastScale - minScale) < 0.05) {
                        // If already very close to minimum, just set it exactly
                        lastScale = minScale;
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

            if (volume > this.#SILENCE_THRESHOLD) {
                this.hasSoundDetected = true;
                this.soundSamples++;
                this.silenceStart = null;
            } else {
                if (this.silenceStart === null) {
                    this.silenceStart = Date.now();
                    console.debug('Silence detected, starting timer');
                } else {
                    const silenceDuration = Date.now() - this.silenceStart;
                    if (silenceDuration >= this.#SILENCE_DURATION) {
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
    }
}

const mckVoice = new MckVoice();
