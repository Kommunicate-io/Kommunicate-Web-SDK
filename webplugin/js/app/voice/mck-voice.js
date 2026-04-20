class MckVoice {
    // Using underscore prefix instead of # for compatibility with build tools
    _RMS_THRESHOLD = 0.018;
    _ZERO_CROSSING_THRESHOLD = 0.03;
    _SILENCE_DURATION = 600; // generic silence fallback for non-omnichannel capture
    _MIN_SPEECH_DURATION = 120; // require at least 120ms of speech before silencing
    _MAX_RECORDING_DURATION = 30000; // fail-safe to avoid endless recording
    _VOICE_MODE_SESSION_TIMEOUT = 300000; // close voice mode after 5 minutes without switching to chat
    _SILENCE_NOISE_TOLERANCE = 200; // ignore short spikes after silence starts
    _AUTO_LISTEN_COOLDOWN = 1000; // wait before auto-listen restarts after a forced stop
    _VOICE_START_THRESHOLD_RMS = 160;
    _VOICE_STOP_THRESHOLD_RMS = 120;
    _VOICE_PRE_ROLL_MS = 900;
    _IOS_HALF_DUPLEX_PRE_ROLL_MS = 1500;
    _VOICE_POST_ROLL_MS = 800;
    _VOICE_FRAME_MS = 20;
    _VOICE_MIN_VOICED_MS = 160;
    _VOICE_MAX_CHUNK_MS = 2800;
    _VOICE_INITIAL_SPEECH_TIMEOUT_MS = 5000;
    _VOICE_STT_MERGE_MAX_MS = 30000;
    _VOICE_MIN_SAMPLES_TO_SEND = 3200;
    _VOICE_MIN_CHUNK_RMS = 120;
    _VOICE_MAX_ABS_SILENCE_THRESHOLD = 80;
    _VOICE_OMNICHANNEL_SEGMENT_SILENCE_MS = 400;
    _VOICE_CONTINUATION_MIN_WAIT_MS = 600;
    _VOICE_CONTINUATION_MAX_SILENCE_MS = 3000;
    _VOICE_EMPTY_STT_SUPPRESS_WINDOW_MS = 10000; // suppress low-confidence retries after repeated empty STT
    _VOICE_EMPTY_STT_SUPPRESS_COUNT = 2;
    _NATIVE_SPEECH_RESTART_DELAY_MS = 400;
    _AUDIO_PLAYBACK_START_TIMEOUT_MS = 4000;
    _AUDIO_PLAYBACK_RETRY_DELAY_MS = 150;
    _WEBKIT_BOT_PLAYBACK_RESTART_DELAY_MS = 2200;
    _VOICE_ECHO_SUPPRESS_WINDOW_MS = 7000;
    // Threshold for frequency-domain visualizer (0..255 scale)
    _NOISE_THRESHOLD = 8;

    // animation scale for speaking
    _MIN_SPEAK_ANIMATION_SCALE = 0.7;
    _MAX_SPEAK_ANIMATION_SCALE = 1.0;
    _RING_RECEDE_DURATION = 800;

    constructor() {
        this.mediaRecorder = null;
        this.recordedMimeType = 'audio/wav';
        this.audioChunks = []; // recorded audio chunks
        this.isRecording = false;
        this.stream = null;
        this.agentOrBotName = '';
        this.agentOrBotLastMsg = '';
        this.agentOrBotLastMsgAudio = null;
        this.agentOrBotLastMsgPlaybackData = null;
        this.lastBotPlaybackEndedAt = 0;
        this.lastBotPlaybackText = '';
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
        this.recordingStopReason = null;
        this.pendingVoiceMessageTimer = null;
        this.pendingVoiceSegments = {};
        this.pendingVoiceSegmentSeq = 0;
        this.pendingVoiceSegmentInFlight = 0;
        this.pendingContinuationStart = false;
        this.continuationDecisionActive = false;
        this.continuationSpeechDetected = false;
        this.continuationWindowStartedAt = 0;
        this.discardNextRecordingPayload = false;
        this.maxRecordingTimer = null;
        this.deferredRecordingHandler = null;
        this.silenceDetectionContext = null;
        this.silenceTimeout = null;
        this.initialSpeechTimeout = null;
        this.silenceNoiseStart = null;
        this.lastRecordingEnd = 0;
        this.voiceModeTimeoutId = null;
        this.voiceOutputTemporarilyDisabled = false;
        this.previousVoiceOutputState = null;
        this.nativeRecognition = null;
        this.nativeRecognitionActive = false;
        this.nativeRecognitionShouldRestart = false;
        this.nativeRecognitionFailed = false;
        this.activeRecognitionMode = 'omnichannel';
        this.nativeSpeechUtterance = null;
        this.adaptiveVadState = null;
        this.inlineActionDelegatedBound = false;
        this.pendingVoiceSessionSource = null;
        this.consecutiveEmptySttResponses = 0;
        this.lastEmptySttResponseAt = 0;
        this.vadCaptureChunks = [];
        this.vadCaptureSampleRate = 0;
        this.voiceProgressElement = null;
        this.voiceProgressAutoHideTimeout = null;
        this.awaitingBotResponsePlayback = false;
        this.awaitingBotResponseTimeout = null;
        this.audioPlaybackWatchdog = null;
        this.audioPlaybackStartTimeout = null;
        this.visualizerAudioContext = null;
        this.visualizerSourceNodes = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
        this.replyPlaybackAudioContext = null;
        this.currentReplyPlaybackSource = null;
        this.currentReplyPlaybackActive = false;
        this.VOICE_ENTRY_SOURCE = {
            START_CONVERSATION_SCREEN: 'start_conversation_screen',
            CONVERSATIONS_SCREEN: 'conversations_screen',
        };
        this.voiceDebugPrefix = '[KM Voice Debug]';
        this.voiceInputSettings = this.getVoiceInputSettings();
        this.activeRecognitionMode = this.determineRecognitionMode();
    }

    getVoiceEntrySources() {
        return this.VOICE_ENTRY_SOURCE;
    }

    trackVoiceEvent(eventKey, source) {
        if (
            typeof kmWidgetEvents === 'object' &&
            kmWidgetEvents &&
            typeof kmWidgetEvents.eventTracking === 'function' &&
            typeof eventMapping === 'object' &&
            eventMapping &&
            eventMapping[eventKey]
        ) {
            kmWidgetEvents.eventTracking(eventMapping[eventKey], source);
        }
    }

    getAudioTrackDebugState(stream = this.stream) {
        const track =
            stream &&
            typeof stream.getAudioTracks === 'function' &&
            stream.getAudioTracks().length > 0
                ? stream.getAudioTracks()[0]
                : null;
        if (!track) {
            return null;
        }
        return {
            label: track.label || '',
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState || null,
            settings: typeof track.getSettings === 'function' ? track.getSettings() : null,
        };
    }

    logVoiceDebug(eventName, details = {}, level = 'log') {
        const consoleMethod = console[level] || console.log;
        consoleMethod.call(
            console,
            `${this.voiceDebugPrefix} ${eventName}`,
            this.compactVoiceDebugDetails(details)
        );
    }

    compactVoiceDebugDetails(details) {
        if (!details || typeof details !== 'object' || Array.isArray(details)) {
            return details;
        }
        const compact = {};
        const detailKeys = Object.keys(details);

        for (let i = 0; i < detailKeys.length; i++) {
            const key = detailKeys[i];
            const value = details[key];
            if (value === undefined || value === null || value === '') {
                continue;
            }
            compact[key] = this.compactVoiceDebugValue(value);
        }

        return compact;
    }

    compactVoiceDebugValue(value) {
        if (typeof value === 'string') {
            return value.length > 120 ? `${value.slice(0, 117)}...` : value;
        }
        if (Array.isArray(value)) {
            return `[${value.length} items]`;
        }
        if (value && typeof value === 'object') {
            return '[object]';
        }
        return value;
    }

    resetVoicePlaybackQueue(reason = 'manual_reset') {
        this.messagesQueue = [];
    }

    async startVoiceMode(
        source = 'start_conversation_screen',
        { onPermissionDenied = null, suppressPermissionAlert = false } = {}
    ) {
        kmVoiceMessageHandler.resetQueuedVoiceMessages();
        this.trackVoiceEvent('onVoiceEntryClicked', source);
        this.trackVoiceEvent('onVoiceIconClick', source);
        this.disableNativeVoiceOutputForVoiceMode();
        this.enableAutoListening();
        if (this.shouldUseSafariBufferPlayback()) {
            try {
                await this.unlockReplyPlaybackAudioContext();
            } catch (error) {
                console.warn('Reply playback AudioContext unlock failed', error);
            }
        }
        this.voiceMuted = false;
        this.updateMuteButton();
        this.clearVoiceStatus();
        this.hideInlineStatus();
        this.hideInlineMicButton();
        this.resetVoicePlaybackQueue('start_voice_mode');
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
        this.pendingVoiceSessionSource = source;
        const isRecordingStarted = await this.requestAudioRecordingWhenReady({
            source,
            onPermissionDenied,
            suppressPermissionAlert,
            trackPermission: true,
        });
        if (!isRecordingStarted) {
            this.pendingVoiceSessionSource = null;
            this.stopVoiceMode();
        }
        return Boolean(isRecordingStarted);
    }

    shouldApplyWebKitVoiceWorkarounds() {
        return KommunicateUtils.isIOSWebKitBrowser();
    }

    getAudioCaptureConstraints() {
        if (this.shouldApplyWebKitVoiceWorkarounds()) {
            return {
                audio: {
                    // WebKit on iPhone can over-process mic input causing weak speech capture.
                    // Keep capture raw and normalize in STT preprocessing.
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    channelCount: 1,
                    sampleRate: 44100,
                    sampleSize: 16,
                },
            };
        }
        return {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1,
            },
        };
    }

    createMediaRecorder(stream) {
        const supportedMimeTypes = [];
        if (
            !this.shouldApplyWebKitVoiceWorkarounds() ||
            typeof MediaRecorder.isTypeSupported !== 'function'
        ) {
            return new MediaRecorder(stream);
        }

        const preferredMimeTypes = [
            'audio/mp4;codecs=mp4a.40.2',
            'audio/mp4',
            'video/mp4;codecs=mp4a.40.2',
            'video/mp4',
        ];

        for (let i = 0; i < preferredMimeTypes.length; i++) {
            const mimeType = preferredMimeTypes[i];
            if (MediaRecorder.isTypeSupported(mimeType)) {
                supportedMimeTypes.push(mimeType);
                try {
                    return new MediaRecorder(stream, { mimeType });
                } catch (error) {
                    console.warn(`MediaRecorder init failed for ${mimeType}`, error);
                }
            }
        }

        return new MediaRecorder(stream);
    }

    configureInlineAudioPlayback(audio) {
        audio.preload = 'auto';
        audio.playsInline = true;
        audio.setAttribute('playsinline', 'true');
        audio.muted = false;
        audio.volume = 1;
    }

    shouldUseSafariBufferPlayback() {
        return (
            this.activeRecognitionMode === 'omnichannel' && KommunicateUtils.isIOSWebKitBrowser()
        );
    }

    shouldUseHalfDuplexVoiceCapture() {
        return (
            this.activeRecognitionMode === 'omnichannel' && KommunicateUtils.isIOSWebKitBrowser()
        );
    }

    shouldEnableAudioVisualizer() {
        return !KommunicateUtils.isIOSWebKitBrowser();
    }

    getReplyPlaybackAudioContext() {
        if (!this.replyPlaybackAudioContext && (window.AudioContext || window.webkitAudioContext)) {
            this.replyPlaybackAudioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
        }
        return this.replyPlaybackAudioContext;
    }

    async unlockReplyPlaybackAudioContext() {
        if (!this.shouldUseSafariBufferPlayback()) {
            return null;
        }
        const audioContext = this.getReplyPlaybackAudioContext();
        if (!audioContext) {
            return null;
        }
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        return audioContext;
    }

    stopReplyPlaybackSource() {
        if (this.currentReplyPlaybackSource) {
            try {
                this.currentReplyPlaybackSource.onended = null;
                this.currentReplyPlaybackSource.stop(0);
            } catch (error) {}
            try {
                this.currentReplyPlaybackSource.disconnect();
            } catch (error) {}
        }
        this.currentReplyPlaybackSource = null;
        this.currentReplyPlaybackActive = false;
    }

    teardownAudioElement(audioElement = this.audioElement, { preserveSrc = false } = {}) {
        if (!audioElement) {
            return;
        }
        this.clearDeferredRecordingHandler(audioElement);
        try {
            audioElement.pause();
        } catch (error) {}
        try {
            audioElement.currentTime = 0;
        } catch (error) {}
        if (!preserveSrc) {
            try {
                audioElement.removeAttribute('src');
                audioElement.src = '';
            } catch (error) {}
            try {
                if (typeof audioElement.load === 'function') {
                    audioElement.load();
                }
            } catch (error) {}
        }
    }

    isAudioPlaybackActive(audioElement = this.audioElement) {
        return (
            this.currentReplyPlaybackActive ||
            (audioElement && !audioElement.paused && !audioElement.ended)
        );
    }

    clearAudioPlaybackWatchdog() {
        if (this.audioPlaybackWatchdog) {
            clearInterval(this.audioPlaybackWatchdog);
            this.audioPlaybackWatchdog = null;
        }
    }

    clearAudioPlaybackStartTimeout() {
        if (this.audioPlaybackStartTimeout) {
            clearTimeout(this.audioPlaybackStartTimeout);
            this.audioPlaybackStartTimeout = null;
        }
    }

    resumeAudioContext(audioContext, contextName = 'audio') {
        if (!audioContext || audioContext.state !== 'suspended') {
            return;
        }
        audioContext.resume().catch((error) => {
            console.warn(`${contextName} AudioContext resume failed`, error);
        });
    }

    getVoiceInputSettings() {
        const config =
            (kommunicate && kommunicate._globals && kommunicate._globals.voiceInputSettings) || {};
        const vadConfig = config.vadConfig || {};
        const requestedMode = (
            config.recognitionMode ||
            config.voiceRecognitionMode ||
            'omnichannel'
        )
            .toString()
            .toLowerCase();
        const language =
            config.voiceLanguage ||
            config.language ||
            (typeof navigator !== 'undefined' && navigator.language) ||
            'en-US';
        const defaultSilenceStopMs =
            requestedMode === 'omnichannel'
                ? this._VOICE_OMNICHANNEL_SEGMENT_SILENCE_MS
                : this._SILENCE_DURATION;
        const rawSilenceStopMs =
            config.silenceStopMs ?? config.silenceDuration ?? defaultSilenceStopMs;
        const normalizedSilenceStopMs =
            Number(rawSilenceStopMs) > 0 ? Number(rawSilenceStopMs) : this._SILENCE_DURATION;
        // Guardrail: avoid very large silence windows that delay first STT call.
        const silenceStopMs = Math.min(Math.max(normalizedSilenceStopMs, 300), 2500);
        return {
            recognitionMode: requestedMode,
            voiceLanguage: language,
            ucid: config.ucid || null,
            silenceDuration: silenceStopMs,
            silenceStopMs,
            frameMs: config.frameMs ?? this._VOICE_FRAME_MS,
            startThresholdRms: config.startThresholdRms ?? this._VOICE_START_THRESHOLD_RMS,
            stopThresholdRms: config.stopThresholdRms ?? this._VOICE_STOP_THRESHOLD_RMS,
            minVoicedMs: config.minVoicedMs ?? this._VOICE_MIN_VOICED_MS,
            initialSpeechTimeoutMs:
                config.initialSpeechTimeoutMs ?? this._VOICE_INITIAL_SPEECH_TIMEOUT_MS,
            maxChunkMs: config.maxChunkMs ?? this._VOICE_MAX_CHUNK_MS,
            preRollMs: config.preRollMs ?? this._VOICE_PRE_ROLL_MS,
            postRollMs: config.postRollMs ?? this._VOICE_POST_ROLL_MS,
            continuationMinWaitMs:
                config.continuationMinWaitMs ?? this._VOICE_CONTINUATION_MIN_WAIT_MS,
            continuationMaxSilenceMs:
                config.continuationMaxSilenceMs ?? this._VOICE_CONTINUATION_MAX_SILENCE_MS,
            minSamplesToSend: config.minSamplesToSend ?? this._VOICE_MIN_SAMPLES_TO_SEND,
            minChunkRms: config.minChunkRms ?? this._VOICE_MIN_CHUNK_RMS,
            maxAbsSilenceThreshold:
                config.maxAbsSilenceThreshold ?? this._VOICE_MAX_ABS_SILENCE_THRESHOLD,
            minSpeechDuration: config.minSpeechDuration ?? this._MIN_SPEECH_DURATION,
            vad: {
                startFactor: vadConfig.startFactor ?? 2.2,
                endFactor: vadConfig.endFactor ?? 1.8,
                startFrames: vadConfig.startFrames ?? 3,
                endFrames: vadConfig.endFrames ?? 20,
                noiseAlpha: vadConfig.noiseAlpha ?? 0.95,
                historyMs: vadConfig.historyMs ?? 2000,
                minStartRms: vadConfig.minStartRms ?? 0.008,
            },
        };
    }

    processMessagesAsAudio(msg, displayName) {
        try {
            // Block any pending auto-listen immediately when a bot reply is queued.
            // This prevents recording from starting in the short async gap before
            // TTS audio element is created/played.
            this.clearAutoListenTimeout();
            this.setAwaitingBotResponsePlayback(true);
            // If bot response audio is about to play, stop any active recording capture.
            // This avoids capturing bot TTS into mic input and prevents long max-duration waits.
            if (this.isRecording) {
                this.resetPendingVoiceSegments();
                this.discardNextRecordingPayload = true;
                this.stopRecording(true, 'bot_playback');
            }
            this.clearVoiceProgressMessage();
            const queueItems = this.createQueuedVoiceMessages(msg, displayName);
            if (queueItems.length === 0) {
                this.setAwaitingBotResponsePlayback(false);
                this.resumeListeningAfterPlayback();
                return false;
            }
            const shouldStartPlayback = this.messagesQueue.length === 0;
            this.messagesQueue.push(...queueItems);
            if (shouldStartPlayback) {
                this.processNextMessage(queueItems[0]);
            }
            return true;
        } catch (err) {
            console.error(err);
            this.messagesQueue.shift();
            if (this.messagesQueue.length > 0) {
                const nextMsg = this.messagesQueue[0];
                this.processNextMessage(nextMsg);
            }
            return false;
        }
    }

    releaseStoredReplayAudio() {
        if (
            this.agentOrBotLastMsgAudio &&
            typeof this.agentOrBotLastMsgAudio === 'string' &&
            this.agentOrBotLastMsgAudio.indexOf('blob:') === 0
        ) {
            URL.revokeObjectURL(this.agentOrBotLastMsgAudio);
        }
        this.agentOrBotLastMsgAudio = null;
    }

    blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () =>
                    reject(reader.error || new Error('Failed to convert blob to data URL'));
                reader.readAsDataURL(blob);
            } catch (error) {
                reject(error);
            }
        });
    }

    normalizeQueuedVoiceMessages(msg) {
        if (Array.isArray(msg)) {
            const normalizedMessages = [];
            msg.forEach((item) => {
                normalizedMessages.push(...this.normalizeQueuedVoiceMessages(item));
            });
            return normalizedMessages;
        }
        if (!msg || typeof msg !== 'object') {
            return [];
        }
        if (!Array.isArray(msg.message)) {
            return [msg];
        }
        const baseMessage = { ...msg };
        const normalizedParts = [];
        msg.message.forEach((part, index) => {
            normalizedParts.push(
                ...this.createNormalizedQueuedVoiceMessageParts(baseMessage, part, index)
            );
        });
        return normalizedParts;
    }

    createNormalizedQueuedVoiceMessageParts(baseMessage, part, index) {
        if (Array.isArray(part)) {
            const normalizedParts = [];
            part.forEach((nestedPart, nestedIndex) => {
                normalizedParts.push(
                    ...this.createNormalizedQueuedVoiceMessageParts(
                        baseMessage,
                        nestedPart,
                        `${index}-${nestedIndex}`
                    )
                );
            });
            return normalizedParts;
        }
        if (typeof part === 'string' || typeof part === 'number') {
            return [
                {
                    ...baseMessage,
                    key:
                        baseMessage.key && typeof baseMessage.key === 'string'
                            ? `${baseMessage.key}::part-${index}`
                            : baseMessage.key,
                    message: String(part),
                },
            ];
        }
        if (part && typeof part === 'object') {
            const mergedMessage = {
                ...baseMessage,
                ...part,
            };
            if (mergedMessage.key === baseMessage.key && baseMessage.key && !part.key) {
                mergedMessage.key = `${baseMessage.key}::part-${index}`;
            }
            if (Array.isArray(mergedMessage.message)) {
                return this.normalizeQueuedVoiceMessages(mergedMessage);
            }
            if (
                typeof mergedMessage.message === 'string' ||
                typeof mergedMessage.message === 'number'
            ) {
                mergedMessage.message = String(mergedMessage.message);
                return [mergedMessage];
            }
        }
        return [];
    }

    createQueuedVoiceMessages(msg, displayName) {
        const normalizedMessages = this.normalizeQueuedVoiceMessages(msg);
        return normalizedMessages.map((normalizedMessage) =>
            this.createQueuedVoiceMessage(normalizedMessage, displayName)
        );
    }

    extractVoiceMessageTextFromValue(value) {
        if (Array.isArray(value)) {
            return value
                .map((item) => this.extractVoiceMessageTextFromValue(item))
                .filter(Boolean)
                .join(' ');
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return String(value);
        }
        if (value && typeof value === 'object') {
            return this.extractVoiceMessageTextFromValue(value.message);
        }
        return '';
    }

    createQueuedVoiceMessage(msg, displayName) {
        const originalMessage = this.extractVoiceMessageTextFromValue(msg && msg.message);
        const messageWithoutSource = originalMessage.replace(
            /[\n\r]*Sources:.*?(https?:\/\/\S+)/g,
            ''
        );
        const spokenText = messageWithoutSource.trim();
        const queueItem = {
            msg,
            displayName,
            messageWithoutSource,
            spokenText,
            ttsPromise: null,
            ttsBlob: null,
            ttsPlaybackData: null,
            ttsError: null,
        };

        if (
            spokenText &&
            !this.shouldUseNativeSpeechSynthesis() &&
            this.activeRecognitionMode === 'omnichannel'
        ) {
            queueItem.ttsPromise = kmVoice
                .textToVoice(spokenText)
                .then((data) => {
                    if (this.shouldUseSafariBufferPlayback()) {
                        queueItem.ttsPlaybackData = kmVoice.createPlaybackAudioDataFromOmnichannelFrames(
                            data
                        );
                    } else {
                        queueItem.ttsBlob = kmVoice.createWavBlobFromOmnichannelFrames(data);
                    }
                    queueItem.ttsError = null;
                    return queueItem.ttsPlaybackData || queueItem.ttsBlob;
                })
                .catch((error) => {
                    queueItem.ttsPromise = null;
                    queueItem.ttsError = error;
                    return null;
                });
        }

        return queueItem;
    }

    async processNextMessage(queueItemOrMsg, displayName) {
        try {
            const queueItem =
                queueItemOrMsg &&
                typeof queueItemOrMsg === 'object' &&
                Object.prototype.hasOwnProperty.call(queueItemOrMsg, 'messageWithoutSource')
                    ? queueItemOrMsg
                    : this.createQueuedVoiceMessage(queueItemOrMsg, displayName);
            const { messageWithoutSource, spokenText, displayName: queuedDisplayName } = queueItem;

            this.agentOrBotName = queuedDisplayName;
            const responseText = queuedDisplayName
                ? `${queuedDisplayName}: ${messageWithoutSource}`
                : messageWithoutSource;
            this.updateResponseText(responseText, { autoHide: 0 });
            this.agentOrBotLastMsg = messageWithoutSource;
            this.releaseStoredReplayAudio();

            if (!spokenText) {
                this.advanceQueueAfterPlayback();
                return;
            }

            if (this.shouldUseNativeSpeechSynthesis()) {
                this.playNativeSpeech(spokenText);
                return;
            }

            if (
                queueItem.ttsError &&
                !queueItem.ttsBlob &&
                !queueItem.ttsPlaybackData &&
                !queueItem.ttsPromise
            ) {
                const prefetchError = queueItem.ttsError;
                queueItem.ttsError = null;
                throw prefetchError;
            }
            if (!queueItem.ttsBlob && !queueItem.ttsPlaybackData && !queueItem.ttsPromise) {
                queueItem.ttsPromise = kmVoice
                    .textToVoice(spokenText)
                    .then((data) => {
                        if (this.shouldUseSafariBufferPlayback()) {
                            queueItem.ttsPlaybackData = kmVoice.createPlaybackAudioDataFromOmnichannelFrames(
                                data
                            );
                        } else {
                            queueItem.ttsBlob = kmVoice.createWavBlobFromOmnichannelFrames(data);
                        }
                        queueItem.ttsError = null;
                        return queueItem.ttsPlaybackData || queueItem.ttsBlob;
                    })
                    .catch((error) => {
                        queueItem.ttsPromise = null;
                        queueItem.ttsError = error;
                        throw error;
                    });
            }
            const playbackAsset =
                queueItem.ttsPlaybackData || queueItem.ttsBlob || (await queueItem.ttsPromise);
            if (!playbackAsset) {
                throw new Error('Omnichannel TTS failed to return audio');
            }
            if (this.shouldUseSafariBufferPlayback()) {
                this.playSafariPlaybackDataWithQueue(playbackAsset);
                return;
            }
            this.playAudioBlobWithQueue(playbackAsset);
        } catch (err) {
            this.handlePlaybackFailure(err);
        }
    }

    async playAudioWithMediaSource(response) {
        this.clearDeferredRecordingHandler(this.audioElement);
        const audio = new Audio();
        this.configureInlineAudioPlayback(audio);
        this.audioElement = audio;

        const mediaSource = new MediaSource();
        const mediaSourceUrl = URL.createObjectURL(mediaSource);

        audio.src = mediaSourceUrl;
        const fullChunks = [];

        try {
            if (!response || !response.body || typeof response.body.getReader !== 'function') {
                throw new Error('Invalid TTS stream response');
            }
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
                        audio
                            .play()
                            .then(() => {
                                hasPlaybackStarted = true;
                                if (this.shouldEnableAudioVisualizer()) {
                                    this.visualizerCleanup = this.createAudioVisualizer(audio);
                                }
                            })
                            .catch((error) => {
                                this.handlePlaybackFailure(error);
                            });
                    }
                },
                { once: true }
            );

            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(mediaSourceUrl);
                const nextMsg = this.shiftToNextQueuedMessage();

                if (nextMsg) {
                    // Clean up visualizer before starting next message
                    if (this.visualizerCleanup) {
                        this.visualizerCleanup();
                        this.visualizerCleanup = null;
                    }

                    this.processNextMessage(nextMsg);
                    return;
                }

                const finalBlob = new Blob(fullChunks, { type: 'audio/mpeg' });
                const blobUrl = URL.createObjectURL(finalBlob);

                this.releaseStoredReplayAudio();
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

                // Wait for animation to complete before removing all classes
                this.audioElement = null;
                this.setAwaitingBotResponsePlayback(false);
                this.resumeListeningAfterPlayback();
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                    if (!this.isRecording) {
                        this.removeAllAnimation();
                        this.clearVoiceStatus();
                    }
                }, this._RING_RECEDE_DURATION); // Match animation duration in CSS
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
                const nextMsg = this.shiftToNextQueuedMessage();
                nextMsg && this.processNextMessage(nextMsg);
            });
        } catch (err) {
            console.error(err);
            URL.revokeObjectURL(mediaSourceUrl);
            if (mediaSource.readyState === 'open') {
                try {
                    mediaSource.endOfStream();
                } catch (e) {}
            }
            this.handlePlaybackFailure(err);
        }
    }

    async playAudioBlobWithQueue(audioBlob, retryAttempt = 0, sourceMode = 'object_url') {
        this.clearAudioPlaybackWatchdog();
        this.clearAudioPlaybackStartTimeout();
        if (this.visualizerCleanup) {
            this.visualizerCleanup();
            this.visualizerCleanup = null;
        }
        this.teardownAudioElement(this.audioElement);

        let audioSrc = '';
        let shouldRevokeAudioSrc = false;
        if (sourceMode === 'data_url') {
            audioSrc = await this.blobToDataUrl(audioBlob);
        } else {
            audioSrc = URL.createObjectURL(audioBlob);
            shouldRevokeAudioSrc = true;
        }
        const audio = new Audio(audioSrc);
        this.configureInlineAudioPlayback(audio);
        this.audioElement = audio;
        this.addSpeakingAnimation();
        let playbackStarted = false;
        let playbackSettled = false;
        let lastObservedTime = 0;
        let stalledTickCount = 0;
        const releaseAudioSrc = () => {
            if (shouldRevokeAudioSrc && audioSrc) {
                URL.revokeObjectURL(audioSrc);
                shouldRevokeAudioSrc = false;
            }
        };

        const settlePlayback = (reason) => {
            if (playbackSettled || this.audioElement !== audio) {
                return;
            }
            const shouldRememberPlayback =
                reason === 'ended_event' ||
                reason === 'ended_flag' ||
                reason === 'duration_reached';
            playbackSettled = true;
            this.clearAudioPlaybackWatchdog();
            this.clearAudioPlaybackStartTimeout();
            const nextMsg = this.shiftToNextQueuedMessage();

            if (nextMsg) {
                releaseAudioSrc();
                if (this.visualizerCleanup) {
                    this.visualizerCleanup();
                    this.visualizerCleanup = null;
                }
                this.audioElement = null;
                this.processNextMessage(nextMsg);
                return;
            }

            this.releaseStoredReplayAudio();
            this.agentOrBotLastMsgAudio = audioSrc;
            if (sourceMode === 'object_url') {
                shouldRevokeAudioSrc = false;
            }

            document.getElementById('mck-voice-repeat-last-msg').classList.remove('mck-hidden');
            if (shouldRememberPlayback) {
                this.rememberRecentBotPlayback(this.agentOrBotLastMsg);
            }

            if (this.visualizerCleanup) {
                this.visualizerCleanup();
                this.visualizerCleanup = null;
            }

            kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');
            const ring1 = document.querySelector('.voice-ring-1');
            ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
            ring1.classList.add('ring-recede');

            this.audioElement = null;
            this.setAwaitingBotResponsePlayback(false);
            this.resumeListeningAfterPlayback();
            setTimeout(() => {
                ring1.classList.remove('ring-recede');
                if (!this.isRecording) {
                    this.removeAllAnimation();
                    this.clearVoiceStatus();
                }
            }, this._RING_RECEDE_DURATION);
        };

        const startPlaybackWatchdog = () => {
            this.clearAudioPlaybackWatchdog();
            this.audioPlaybackWatchdog = setInterval(() => {
                if (playbackSettled || this.audioElement !== audio) {
                    this.clearAudioPlaybackWatchdog();
                    return;
                }
                const currentTime = audio.currentTime || 0;
                const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
                const progressed = currentTime > lastObservedTime + 0.02;
                if (progressed) {
                    lastObservedTime = currentTime;
                    stalledTickCount = 0;
                    return;
                }
                if (audio.ended) {
                    settlePlayback('ended_flag');
                    return;
                }
                if (duration > 0 && currentTime >= Math.max(duration - 0.12, 0)) {
                    settlePlayback('duration_reached');
                    return;
                }
                if (audio.paused && currentTime > 0.05) {
                    stalledTickCount++;
                    if (stalledTickCount >= 2) {
                        settlePlayback('paused_after_progress');
                    }
                    return;
                }
                if (!audio.paused && currentTime > 0 && duration > 0) {
                    stalledTickCount++;
                    if (stalledTickCount >= 8) {
                        settlePlayback('stalled_after_progress');
                    }
                    return;
                }
                stalledTickCount = 0;
            }, 500);
        };

        const startPlaybackTimeout = () => {
            this.clearAudioPlaybackStartTimeout();
            this.audioPlaybackStartTimeout = setTimeout(() => {
                if (playbackSettled || playbackStarted || this.audioElement !== audio) {
                    return;
                }
                console.warn('Audio playback start timed out');
                if (retryAttempt < 1) {
                    this.clearDeferredRecordingHandler(audio);
                    this.clearAudioPlaybackWatchdog();
                    this.clearAudioPlaybackStartTimeout();
                    if (this.visualizerCleanup) {
                        this.visualizerCleanup();
                        this.visualizerCleanup = null;
                    }
                    this.teardownAudioElement(audio);
                    if (this.audioElement === audio) {
                        this.audioElement = null;
                    }
                    releaseAudioSrc();
                    setTimeout(() => {
                        if (!this.awaitingBotResponsePlayback || this.messagesQueue.length === 0) {
                            return;
                        }
                        this.playAudioBlobWithQueue(audioBlob, retryAttempt + 1, sourceMode);
                    }, this._AUDIO_PLAYBACK_RETRY_DELAY_MS);
                    return;
                }
                if (sourceMode === 'object_url') {
                    this.teardownAudioElement(audio);
                    if (this.audioElement === audio) {
                        this.audioElement = null;
                    }
                    releaseAudioSrc();
                    setTimeout(() => {
                        if (!this.awaitingBotResponsePlayback || this.messagesQueue.length === 0) {
                            return;
                        }
                        this.playAudioBlobWithQueue(audioBlob, 0, 'data_url');
                    }, this._AUDIO_PLAYBACK_RETRY_DELAY_MS);
                    return;
                }
                this.handleAudioPlaybackStartFailure(
                    new Error('Audio playback start timed out'),
                    audio
                );
            }, this._AUDIO_PLAYBACK_START_TIMEOUT_MS);
        };

        audio.onerror = (error) => {
            console.error(error, 'audio play error');
            if (!playbackStarted) {
                if (retryAttempt < 1) {
                    this.clearAudioPlaybackWatchdog();
                    this.clearAudioPlaybackStartTimeout();
                    if (this.visualizerCleanup) {
                        this.visualizerCleanup();
                        this.visualizerCleanup = null;
                    }
                    this.teardownAudioElement(audio);
                    if (this.audioElement === audio) {
                        this.audioElement = null;
                    }
                    releaseAudioSrc();
                    setTimeout(() => {
                        if (!this.awaitingBotResponsePlayback || this.messagesQueue.length === 0) {
                            return;
                        }
                        this.playAudioBlobWithQueue(audioBlob, retryAttempt + 1, sourceMode);
                    }, this._AUDIO_PLAYBACK_RETRY_DELAY_MS);
                    return;
                }
                if (sourceMode === 'object_url') {
                    this.teardownAudioElement(audio);
                    if (this.audioElement === audio) {
                        this.audioElement = null;
                    }
                    releaseAudioSrc();
                    setTimeout(() => {
                        if (!this.awaitingBotResponsePlayback || this.messagesQueue.length === 0) {
                            return;
                        }
                        this.playAudioBlobWithQueue(audioBlob, 0, 'data_url');
                    }, this._AUDIO_PLAYBACK_RETRY_DELAY_MS);
                    return;
                }
                releaseAudioSrc();
                this.handleAudioPlaybackStartFailure(error, audio);
                return;
            }
            releaseAudioSrc();
            this.handlePlaybackFailure(error);
        };

        const startPlayback = () => {
            if (playbackStarted || this.audioElement !== audio) {
                return;
            }
            audio
                .play()
                .then(() => {
                    playbackStarted = true;
                    this.clearAudioPlaybackStartTimeout();
                    startPlaybackWatchdog();
                    this.logVoiceDebug('play_audio_blob_started', {
                        readyState: audio.readyState,
                        networkState: audio.networkState,
                        retryAttempt,
                        sourceMode,
                    });
                    if (this.shouldEnableAudioVisualizer()) {
                        this.visualizerCleanup = this.createAudioVisualizer(audio);
                    }
                })
                .catch((error) => {
                    this.handleAudioPlaybackStartFailure(error, audio);
                });
        };

        audio.addEventListener('canplay', startPlayback, { once: true });

        audio.addEventListener(
            'loadeddata',
            () => {
                startPlayback();
            },
            { once: true }
        );

        if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            startPlayback();
        }

        startPlaybackTimeout();

        audio.addEventListener('ended', () => {
            settlePlayback('ended_event');
        });

        audio.addEventListener('stalled', () => {
            if (!playbackStarted || playbackSettled) {
                return;
            }
        });
    }

    async playSafariPlaybackDataWithQueue(playbackData, { isRepeat = false } = {}) {
        this.clearAudioPlaybackWatchdog();
        this.clearAudioPlaybackStartTimeout();
        if (this.visualizerCleanup) {
            this.visualizerCleanup();
            this.visualizerCleanup = null;
        }
        this.teardownAudioElement(this.audioElement);
        this.audioElement = null;
        this.stopReplyPlaybackSource();

        try {
            const audioContext = await this.unlockReplyPlaybackAudioContext();
            if (!audioContext) {
                throw new Error('Reply playback audio context is unavailable');
            }
            const sampleRate = Number(playbackData && playbackData.sampleRate) || 24000;
            const float32Data =
                playbackData && playbackData.float32Data instanceof Float32Array
                    ? playbackData.float32Data
                    : new Float32Array(
                          Array.isArray(playbackData && playbackData.float32Data)
                              ? playbackData.float32Data
                              : []
                      );
            if (!float32Data.length) {
                throw new Error('Safari playback data is empty');
            }

            const audioBuffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
            audioBuffer.copyToChannel(float32Data, 0);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            this.currentReplyPlaybackSource = source;
            this.currentReplyPlaybackActive = true;
            this.addSpeakingAnimation();
            source.onended = () => {
                if (this.currentReplyPlaybackSource !== source) {
                    return;
                }
                this.currentReplyPlaybackSource = null;
                this.currentReplyPlaybackActive = false;
                if (isRepeat) {
                    this.removeAllAnimation();
                    if (!this.isRecording) {
                        this.clearVoiceStatus();
                    }
                    return;
                }

                const nextMsg = this.shiftToNextQueuedMessage();
                if (nextMsg) {
                    this.processNextMessage(nextMsg);
                    return;
                }

                this.agentOrBotLastMsgPlaybackData = playbackData;
                this.rememberRecentBotPlayback(this.agentOrBotLastMsg);
                const repeatButton = document.getElementById('mck-voice-repeat-last-msg');
                repeatButton && repeatButton.classList.remove('mck-hidden');
                kommunicateCommons.hide('.voice-ring-2', '.voice-ring-3');
                const ring1 = document.querySelector('.voice-ring-1');
                ring1 && ring1.classList.remove('speaking-voice-ring', 'speaking-voice-ring-1');
                ring1 && ring1.classList.add('ring-recede');
                this.setAwaitingBotResponsePlayback(false);
                this.resumeListeningAfterPlayback();
                setTimeout(() => {
                    ring1 && ring1.classList.remove('ring-recede');
                    if (!this.isRecording) {
                        this.removeAllAnimation();
                        this.clearVoiceStatus();
                    }
                }, this._RING_RECEDE_DURATION);
            };

            source.start(0);
            this.logVoiceDebug('play_audio_buffer_started', {
                isRepeat,
                sampleRate,
                sampleCount: float32Data.length,
                duration: audioBuffer.duration,
                audioContextState: audioContext.state,
            });
        } catch (error) {
            this.stopReplyPlaybackSource();
            if (isRepeat) {
                this.showVoiceErrorMessage(error, 'Voice playback failed');
                return;
            }
            this.handlePlaybackFailure(error);
        }
    }

    shiftToNextQueuedMessage() {
        if (this.messagesQueue.length === 0) {
            return null;
        }
        this.messagesQueue.shift();
        return this.messagesQueue.length > 0 ? this.messagesQueue[0] : null;
    }

    shouldUseNativeSpeechSynthesis() {
        return this.activeRecognitionMode === 'native' && this.isNativeSpeechSynthesisAvailable();
    }

    isNativeSpeechSynthesisAvailable() {
        return typeof speechSynthesis !== 'undefined';
    }

    playNativeSpeech(text) {
        if (!text || !this.isNativeSpeechSynthesisAvailable()) {
            this.advanceQueueAfterPlayback();
            return;
        }
        this.cancelNativeSpeech();
        this.addSpeakingAnimation();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.voiceInputSettings.voiceLanguage || 'en-US';
        utterance.onend = () => this.onNativeSpeechEnded();
        utterance.onerror = (error) => this.onNativeSpeechError(error);
        this.nativeSpeechUtterance = utterance;
        try {
            speechSynthesis.speak(utterance);
        } catch (error) {
            this.handlePlaybackFailure(error);
        }
    }

    handleAudioPlaybackStartFailure(error, audioElement = this.audioElement) {
        if (this.audioElement !== audioElement) {
            return;
        }
        console.error('Audio playback start failed', error);
        this.logVoiceDebug(
            'audio_playback_start_failed',
            {
                errorName: error && error.name,
                errorMessage: error && error.message,
            },
            'warn'
        );
        if (this.visualizerCleanup) {
            this.visualizerCleanup();
            this.visualizerCleanup = null;
        }
        if (audioElement) {
            try {
                this.teardownAudioElement(audioElement);
            } catch (pauseError) {
                console.error('Audio cleanup failed after playback start error', pauseError);
            }
        }
        this.audioElement = null;
        this.handlePlaybackFailure(error);
    }

    cancelNativeSpeech() {
        if (this.nativeSpeechUtterance && this.isNativeSpeechSynthesisAvailable()) {
            speechSynthesis.cancel();
        }
        this.nativeSpeechUtterance = null;
    }

    onNativeSpeechEnded() {
        this.nativeSpeechUtterance = null;
        this.removeAllAnimation();
        this.advanceQueueAfterPlayback({ fromNativeSpeech: true, rememberPlayback: true });
    }

    onNativeSpeechError(error) {
        this.nativeSpeechUtterance = null;
        this.removeAllAnimation();
        this.advanceQueueAfterPlayback({ fromNativeSpeech: true });
    }

    rememberRecentBotPlayback(text) {
        const normalizedText = typeof text === 'string' ? text.trim() : '';
        this.lastBotPlaybackEndedAt = Date.now();
        this.lastBotPlaybackText = normalizedText;
    }

    advanceQueueAfterPlayback({ fromNativeSpeech = false, rememberPlayback = false } = {}) {
        const nextMsg = this.shiftToNextQueuedMessage();
        if (nextMsg) {
            this.processNextMessage(nextMsg);
            return;
        }
        if (
            this.agentOrBotLastMsgPlaybackData ||
            this.agentOrBotLastMsgAudio ||
            (this.agentOrBotLastMsg && this.shouldUseNativeSpeechSynthesis())
        ) {
            const repeatButton = document.getElementById('mck-voice-repeat-last-msg');
            repeatButton && repeatButton.classList.remove('mck-hidden');
        }
        if (rememberPlayback) {
            this.rememberRecentBotPlayback(this.agentOrBotLastMsg);
        }
        this.setAwaitingBotResponsePlayback(false);
        this.resumeListeningAfterPlayback({ fromNativeSpeech });
    }

    handlePlaybackFailure(error) {
        console.error(error);
        this.logVoiceDebug(
            'playback_failed',
            {
                errorName: error && error.name,
                errorMessage: error && error.message,
            },
            'warn'
        );
        this.clearDeferredRecordingHandler(this.audioElement);
        this.stopReplyPlaybackSource();
        this.showVoiceErrorMessage(error, 'Voice playback failed');
        this.removeAllAnimation();
        this.clearVoiceStatus();
        this.audioElement = null;
        this.nativeSpeechUtterance = null;
        this.advanceQueueAfterPlayback();
    }

    async repeatLastMsgAudio(blobUrl = this.agentOrBotLastMsgAudio) {
        if (this.shouldUseSafariBufferPlayback() && this.agentOrBotLastMsgPlaybackData) {
            await this.playSafariPlaybackDataWithQueue(this.agentOrBotLastMsgPlaybackData, {
                isRepeat: true,
            });
            return;
        }
        if (!blobUrl) {
            if (this.agentOrBotLastMsg && this.shouldUseNativeSpeechSynthesis()) {
                this.playNativeSpeech(this.agentOrBotLastMsg);
            }
            return;
        }
        try {
            if (this.visualizerCleanup) {
                this.visualizerCleanup();
                this.visualizerCleanup = null;
            }
            this.teardownAudioElement(this.audioElement);
            this.audioElement = null;
            this.stopReplyPlaybackSource();
            this.addSpeakingAnimation();
            let audioBlobUrl = blobUrl;

            const audio = new Audio(audioBlobUrl);
            this.configureInlineAudioPlayback(audio);
            this.audioElement = audio;
            let playbackStarted = false;

            const startPlayback = async () => {
                if (playbackStarted || this.audioElement !== audio) {
                    return;
                }
                await audio.play();
                playbackStarted = true;
                this.visualizerCleanup = this.createAudioVisualizer(audio);
            };

            try {
                await startPlayback();
            } catch (error) {
                this.handleAudioPlaybackStartFailure(error, audio);
                return;
            }

            audio.onplay = () => {};
            audio.onerror = (err) => {
                console.error('Playback failed', err);
                if (!playbackStarted) {
                    this.handleAudioPlaybackStartFailure(err, audio);
                    return;
                }
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

                // Remove ring-recede class after animation completes
                this.audioElement = null;
                this.resumeListeningAfterPlayback();
                setTimeout(() => {
                    ring1.classList.remove('ring-recede');
                    if (!this.isRecording) {
                        this.clearVoiceStatus();
                    }
                }, this._RING_RECEDE_DURATION); // Match animation duration in CSS
            };
        } catch (error) {
            console.error('Playback failed:', error);
        }
    }

    addEventListeners() {
        const self = this;
        const stopVoiceAndFocusTyping = () => {
            this.stopVoiceMode();
            if (
                typeof KommunicateUI === 'object' &&
                KommunicateUI &&
                typeof KommunicateUI.activateTypingField === 'function'
            ) {
                KommunicateUI.activateTypingField();
            }
        };
        const bindOnce = (element, eventName, handler, flagName) => {
            if (!element) {
                return;
            }
            if (element.dataset && element.dataset[flagName] === 'true') {
                return;
            }
            element.addEventListener(eventName, handler);
            if (element.dataset) {
                element.dataset[flagName] = 'true';
            }
        };
        this.updateMuteButton();
        this.updateChatButtonText();
        bindOnce(
            document.querySelector('.mck-voice-web'),
            'click',
            () => this.startVoiceMode(this.VOICE_ENTRY_SOURCE.START_CONVERSATION_SCREEN),
            'voiceOpenListenerAttached'
        );

        bindOnce(
            document.querySelector('#mck-voice-chat-btn'),
            'click',
            () => {
                kommunicateCommons.modifyClassList(
                    { class: ['mck-voice-repeat-last-msg'] },
                    'mck-hidden'
                );
                this.stopVoiceMode();
            },
            'voiceChatSwitchListenerAttached'
        );

        bindOnce(
            document.querySelector('#mck-voice-speak-btn'),
            'click',
            () => {
                this.toggleMute();
            },
            'voiceMuteToggleListenerAttached'
        );

        bindOnce(
            document.getElementById('mck-voice-repeat-last-msg'),
            'click',
            function () {
                this.classList.toggle('mck-hidden');

                kommunicateCommons.show('.voice-ring-2', '.voice-ring-3');
                const ring1 = document.querySelector('.voice-ring-1');
                ring1.classList.remove('mck-ring-remove-animation');

                self.repeatLastMsgAudio();
            },
            'voiceRepeatListenerAttached'
        );

        const inlineActionBtn = document.getElementById('km-voice-inline-action-btn');
        bindOnce(
            inlineActionBtn,
            'click',
            () => {
                stopVoiceAndFocusTyping();
            },
            'voiceInlineActionListenerAttached'
        );
        const inlineMicBtn = document.getElementById('km-voice-inline-mic-btn');
        bindOnce(
            inlineMicBtn,
            'click',
            () => {
                this.toggleMute();
            },
            'voiceInlineMicListenerAttached'
        );
        if (!this.inlineActionDelegatedBound && typeof document !== 'undefined') {
            document.addEventListener(
                'click',
                (event) => {
                    const actionBtn =
                        event &&
                        event.target &&
                        typeof event.target.closest === 'function' &&
                        event.target.closest('#km-voice-inline-action-btn');
                    if (!actionBtn) {
                        return;
                    }
                    event.preventDefault();
                    stopVoiceAndFocusTyping();
                },
                true
            );
            this.inlineActionDelegatedBound = true;
        }
    }

    getUserOverride() {
        return typeof userOverride !== 'undefined' ? userOverride : null;
    }

    disableNativeVoiceOutputForVoiceMode() {
        const override = this.getUserOverride();
        if (!override || this.voiceOutputTemporarilyDisabled || !override.voiceOutput) {
            return;
        }
        this.previousVoiceOutputState = override.voiceOutput;
        override.voiceOutput = false;
        this.voiceOutputTemporarilyDisabled = true;
        if (typeof speechSynthesis !== 'undefined') {
            speechSynthesis.cancel();
        }
        this.updateVoiceOutputUI(false);
    }

    restoreNativeVoiceOutputAfterVoiceMode() {
        if (!this.voiceOutputTemporarilyDisabled) {
            return;
        }
        const override = this.getUserOverride();
        this.voiceOutputTemporarilyDisabled = false;
        if (!override) {
            this.previousVoiceOutputState = null;
            return;
        }
        const desiredState =
            this.previousVoiceOutputState !== null ? this.previousVoiceOutputState : false;
        this.previousVoiceOutputState = null;
        override.voiceOutput = desiredState;
        this.updateVoiceOutputUI(desiredState);
    }

    updateVoiceOutputUI(state) {
        const override = this.getUserOverride();
        if (!override) {
            return;
        }
        if (typeof mckInit !== 'undefined' && typeof mckInit.toggleTTSCTA === 'function') {
            mckInit.toggleTTSCTA(override);
            return;
        }
        if (typeof KommunicateUI !== 'undefined' && KommunicateUI.toggleVoiceOutputOverride) {
            KommunicateUI.toggleVoiceOutputOverride(state);
        }
    }

    async requestAudioRecording({
        source = 'start_conversation_screen',
        onPermissionDenied = null,
        suppressPermissionAlert = false,
        trackPermission = false,
        existingStream = null,
    } = {}) {
        if (this.awaitingBotResponsePlayback || this.messagesQueue.length > 0) {
            return false;
        }
        if (this.isAudioPlaybackActive()) {
            this.deferRecordingUntilPlaybackEnds();
            return false;
        }
        if (this.isRecording) {
            this.stopRecording();
            return false;
        }

        this.refreshRecognitionMode();
        if (this.activeRecognitionMode === 'native') {
            this.startNativeRecognition();
            if (trackPermission) {
                this.trackVoiceEvent('onVoicePermissionGranted', source);
            }
            return true;
        }

        const constraints = this.getAudioCaptureConstraints();

        if (existingStream) {
            this.voiceInputSettings = this.getVoiceInputSettings();
            this.startRecording(existingStream);
            return true;
        }

        // getUserMedia requires a secure context (HTTPS or localhost).
        if (window.isSecureContext === false) {
            console.error('Voice recording requires a secure (HTTPS) context');
            this.showVoiceErrorMessage(
                'Voice recording is not available over an insecure connection. Please use HTTPS.'
            );
            if (!suppressPermissionAlert) {
                alert(
                    'Voice recording is not available over an insecure connection. Please use HTTPS.'
                );
            }
            return false;
        }

        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('Your browser does not support audio recording');
            this.showVoiceErrorMessage('Your browser does not support audio recording');
            if (!suppressPermissionAlert) {
                alert('Your browser does not support audio recording');
            }
            return false;
        }

        // Request audio permission
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.voiceInputSettings = this.getVoiceInputSettings();
            this.startRecording(stream);
            if (trackPermission) {
                this.trackVoiceEvent('onVoicePermissionGranted', source);
            }
            return true;
        } catch (error) {
            const isPermissionDenied =
                error &&
                (error.name === 'NotAllowedError' ||
                    error.name === 'PermissionDeniedError' ||
                    error.name === 'SecurityError');
            if (trackPermission && isPermissionDenied) {
                this.trackVoiceEvent('onVoicePermissionDenied', source);
            }
            console.error('Error accessing microphone:', error);
            this.showVoiceErrorMessage(
                error,
                'Could not access your microphone. Please allow microphone access and try again.'
            );
            if (isPermissionDenied && typeof onPermissionDenied === 'function') {
                onPermissionDenied(error);
            }
            if (!suppressPermissionAlert) {
                alert(
                    'Could not access your microphone. Please allow microphone access and try again.'
                );
            }
            return false;
        }
    }

    async requestAudioRecordingWhenReady(options = {}) {
        if (this.isAudioPlaybackActive()) {
            this.deferRecordingUntilPlaybackEnds();
            return true;
        }
        return this.requestAudioRecording(options);
    }

    deferRecordingUntilPlaybackEnds() {
        const audioElement = this.audioElement;
        if (!audioElement) {
            this.requestAudioRecording();
            return;
        }

        this.clearDeferredRecordingHandler(audioElement);

        const finalizeDeferredRecording = (clearAudioElement = false) => {
            this.clearDeferredRecordingHandler(audioElement);
            if (clearAudioElement && this.audioElement === audioElement) {
                this.audioElement = null;
            }
            if (
                this.autoListeningEnabled &&
                this.isVoiceInterfaceVisible() &&
                !this.voiceMuted &&
                !this.isRecording
            ) {
                this.requestAudioRecording();
            }
        };

        const deferredHandler = () => {
            finalizeDeferredRecording(true);
        };

        this.deferredRecordingHandler = {
            ended: deferredHandler,
            error: deferredHandler,
            abort: deferredHandler,
            emptied: deferredHandler,
        };
        audioElement.addEventListener('ended', deferredHandler);
        audioElement.addEventListener('error', deferredHandler);
        audioElement.addEventListener('abort', deferredHandler);
        audioElement.addEventListener('emptied', deferredHandler);
    }

    clearDeferredRecordingHandler(audioElement = this.audioElement) {
        if (this.deferredRecordingHandler && audioElement) {
            audioElement.removeEventListener('ended', this.deferredRecordingHandler.ended);
            audioElement.removeEventListener('error', this.deferredRecordingHandler.error);
            audioElement.removeEventListener('abort', this.deferredRecordingHandler.abort);
            audioElement.removeEventListener('emptied', this.deferredRecordingHandler.emptied);
        }
        this.deferredRecordingHandler = null;
    }

    startRecording(stream) {
        this.clearPendingVoiceMessageTimer();
        this.addListeningAnimation();
        this.setTextboxVoiceActive(true);
        this.stream = stream;
        this.discardNextRecordingPayload = false;
        this.audioChunks = [];
        this.isRecording = true;
        this.silenceTimer = null;
        this.lastAudioLevel = 0;
        this.silenceStart = null;
        this.hasSoundDetected = false;
        this.soundSamples = 0;
        this.totalSamples = 0;
        this.speechDetected = false;
        this.isInSilence = false;
        this.firstSpeechTimestamp = 0;
        this.recordingStopReason = null;
        this.maxRecordingTimer = null;
        this.lastRecordingEnd = 0;
        this.silenceNoiseStart = null;
        this.silenceTimeout = null;
        this.vadCaptureChunks = [];
        this.vadCaptureSampleRate = 0;
        // Create MediaRecorder instance
        this.mediaRecorder = this.createMediaRecorder(stream);
        this.recordedMimeType = this.mediaRecorder.mimeType || 'audio/wav';
        this.logVoiceDebug('recording_started', {
            recordedMimeType: this.recordedMimeType,
            audioTrack: this.getAudioTrackDebugState(stream),
        });

        // Handle data available event
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        this.mediaRecorder.onerror = (event) => {
            const recorderError = event && event.error ? event.error : event;
            console.error('MediaRecorder error', recorderError);
        };

        // Handle recording stop event
        this.mediaRecorder.onstop = async () => {
            const recordingStream = this.stream;
            const recordedMimeType = this.recordedMimeType;
            const recordedChunks = Array.isArray(this.audioChunks) ? this.audioChunks.slice() : [];
            const recordedVadCaptureChunks = Array.isArray(this.vadCaptureChunks)
                ? this.vadCaptureChunks.slice()
                : [];
            const recordedVadCaptureSampleRate = this.vadCaptureSampleRate;
            const stopReason = this.recordingStopReason || 'manual';
            const hadDetectedSpeech =
                this.speechDetected || this.hasSoundDetected || this.soundSamples > 0;
            const hadConfirmedSpeech =
                Boolean(this.firstSpeechTimestamp) || Boolean(this.speechDetected);
            const shouldUseHalfDuplexCapture = this.shouldUseHalfDuplexVoiceCapture();
            const hasRecordedPayload =
                recordedChunks.length > 0 || recordedVadCaptureChunks.length > 0;
            const shouldProcessRecording =
                !this.discardNextRecordingPayload &&
                (Boolean(this.isRecording) ||
                    ((stopReason === 'segment_pause' || stopReason === 'continuation_idle') &&
                        hasRecordedPayload));
            const shouldAggregateSegments =
                !shouldUseHalfDuplexCapture &&
                this.activeRecognitionMode === 'omnichannel' &&
                hadConfirmedSpeech &&
                (stopReason === 'segment_pause' || stopReason === 'continuation_idle');
            const shouldRestartContinuationRecording =
                !shouldUseHalfDuplexCapture &&
                this.activeRecognitionMode === 'omnichannel' &&
                hadConfirmedSpeech &&
                stopReason === 'segment_pause';
            const shouldReuseContinuationStream =
                shouldRestartContinuationRecording &&
                recordingStream &&
                recordingStream.active &&
                recordingStream.getAudioTracks().some((track) => track.readyState === 'live');
            const segmentSeq = shouldAggregateSegments
                ? ++this.pendingVoiceSegmentSeq
                : this.pendingVoiceSegmentSeq;
            if (shouldAggregateSegments) {
                this.pendingVoiceSegmentInFlight++;
            }
            // Mark recording as ended immediately so stale VAD/silence loops
            // cannot keep firing while STT work is still running.
            this.isRecording = false;
            this.recordingStopReason = null;
            this.discardNextRecordingPayload = false;
            this.clearInitialSpeechTimeout();
            this.clearSilenceTimeout();
            if (this.silenceTimer) {
                clearInterval(this.silenceTimer);
                this.silenceTimer = null;
            }
            if (this.maxRecordingTimer) {
                clearTimeout(this.maxRecordingTimer);
                this.maxRecordingTimer = null;
            }
            // Clean up the finished recorder before any follow-up recording starts,
            // otherwise the old onstop path can clear timers/state owned by the next session.
            if (!shouldReuseContinuationStream && recordingStream) {
                recordingStream.getTracks().forEach((track) => track.stop());
            }
            if (this.stream === recordingStream) {
                this.stream = null;
            }
            this.vadCaptureChunks = [];
            this.vadCaptureSampleRate = 0;
            this.lastRecordingEnd = Date.now();
            if (this.silenceTimer) {
                clearInterval(this.silenceTimer);
                this.silenceTimer = null;
            }
            this.clearSilenceTimeout();
            if (this.maxRecordingTimer) {
                clearTimeout(this.maxRecordingTimer);
                this.maxRecordingTimer = null;
            }
            this.clearInitialSpeechTimeout();
            try {
                if (shouldRestartContinuationRecording && recordingStream) {
                    this.beginContinuationDecisionWindow();
                    this.pendingContinuationStart = true;
                    Promise.resolve(
                        this.requestAudioRecordingWhenReady({
                            existingStream: shouldReuseContinuationStream ? recordingStream : null,
                        })
                    )
                        .catch((error) => {
                            console.error('Voice continuation restart failed', error);
                            if (shouldReuseContinuationStream && recordingStream) {
                                recordingStream.getTracks().forEach((track) => track.stop());
                            }
                            return false;
                        })
                        .finally(() => {
                            this.pendingContinuationStart = false;
                            this.maybeFinalizePendingVoiceMessageAfterSegment();
                        });
                }
                // Create blob from recorded chunks
                if (shouldProcessRecording) {
                    const audioBlob = new Blob(recordedChunks, { type: recordedMimeType });
                    const sampleRate = kmVoice.getVoiceToTextSampleRate();
                    let rawSamples = [];
                    if (this.shouldApplyWebKitVoiceWorkarounds()) {
                        rawSamples = this.extractPcmInt16FromVadCaptureChunks(
                            recordedVadCaptureChunks,
                            recordedVadCaptureSampleRate
                        );
                    }
                    if (!rawSamples.length) {
                        rawSamples = await kmVoice.extractPcmInt16Samples(audioBlob);
                    }
                    const preparedAudio = this.prepareVoiceChunks(rawSamples, sampleRate);
                    const { chunks } = preparedAudio;
                    console.debug(
                        `Voice transcribing started samples=${rawSamples.length} chunks=${chunks.length}`
                    );

                    this.hasSoundDetected = false;
                    this.soundSamples = 0;
                    this.totalSamples = 0;
                    if (!chunks.length) {
                        if (shouldAggregateSegments) {
                            return;
                        }
                        this.removeAllAnimation();
                        this.clearVoiceStatus();
                        this.updateLiveTranscript(
                            this.getVoiceLabel(
                                'voiceInterface.noSpeechDetected',
                                'No speech detected. Please try again.'
                            ),
                            { autoHide: 3000 }
                        );
                        return;
                    }

                    this.updateVoiceStatus(
                        this.getVoiceLabel('voiceInterface.processing', 'Processing')
                    );
                    this.showVoiceProgressMessage(
                        this.getVoiceLabel('voiceInterface.transcribing', 'Transcribing...'),
                        { state: 'transcribing' }
                    );
                    let data = null;
                    try {
                        data = await this.transcribePreparedVoiceChunks(chunks, sampleRate);
                    } catch (error) {
                        if (error && error.code === 'SILENT_AUDIO') {
                            if (shouldAggregateSegments) {
                                return;
                            }
                            this.removeAllAnimation();
                            this.clearVoiceStatus();
                            this.updateLiveTranscript(
                                this.getVoiceLabel(
                                    'voiceInterface.noSpeechDetected',
                                    'No speech detected. Please try again.'
                                ),
                                { autoHide: 2500 }
                            );
                            // Re-enter listening automatically so the user doesn't
                            // have to tap the mic button again.
                            this.scheduleAutoListen(2600);
                            return;
                        }
                        throw error;
                    }
                    if (!data) {
                        if (shouldAggregateSegments) {
                            return;
                        }
                        console.warn(
                            'Voice transcription failed: empty response from speechToText'
                        );
                        this.removeAllAnimation();
                        this.clearVoiceStatus();
                        // Show a brief "didn't catch that" hint, then re-enter
                        // listening mode automatically so the conversation continues
                        // without the user having to tap the mic again.
                        this.updateLiveTranscript(
                            this.getVoiceLabel(
                                'voiceInterface.didNotCatchThat',
                                "Didn't catch that. Please try again."
                            ),
                            { autoHide: 2500 }
                        );
                        this.scheduleAutoListen(2600);
                        return;
                    }
                    const rawText = typeof data.text === 'string' ? data.text : '';
                    if (!rawText.trim()) {
                        if (shouldAggregateSegments) {
                            return;
                        }
                        console.warn(
                            'Voice transcription failed: missing/empty text in speechToText response',
                            data
                        );
                        return;
                    }
                    const userMsg = rawText.trim();
                    if (shouldAggregateSegments) {
                        this.appendPendingVoiceSegment(segmentSeq, userMsg);
                        this.showListeningState();
                        return;
                    }
                    if (!this.handleVoiceQuery(userMsg)) {
                        return;
                    }
                }
            } catch (error) {
                console.error(error);
                this.removeAllAnimation();
                this.clearVoiceStatus();
                this.showVoiceErrorMessage(
                    error,
                    this.getVoiceLabel(
                        'voiceInterface.processingFailed',
                        'Unable to transcribe the recording. Please try again.'
                    ),
                    { autoHide: 6000 }
                );
                this.recoverAfterVoiceProcessingFailure(error, {
                    stopReason,
                    shouldAggregateSegments,
                });
            } finally {
                if (shouldAggregateSegments) {
                    this.pendingVoiceSegmentInFlight = Math.max(
                        0,
                        this.pendingVoiceSegmentInFlight - 1
                    );
                }
                const hasPendingVoiceSegments = this.getPendingVoiceSegmentCount() > 0;
                if (stopReason === 'segment_pause' && shouldAggregateSegments) {
                    this.maybeFinalizePendingVoiceMessageAfterSegment();
                } else if (
                    stopReason === 'continuation_idle' &&
                    (shouldAggregateSegments || hasPendingVoiceSegments)
                ) {
                    this.resolveContinuationDecisionWindow();
                    this.finalizePendingVoiceMessage();
                } else {
                    this.scheduleAutoListen();
                }
            }
        };

        // Start recording
        this.mediaRecorder.start(); // Collect data every second
        if (this.pendingVoiceSessionSource) {
            this.trackVoiceEvent('onVoiceSessionStarted', this.pendingVoiceSessionSource);
            this.pendingVoiceSessionSource = null;
        }
        this.maxRecordingTimer = setTimeout(() => {
            if (this.isRecording) {
                this.addThinkingAnimation();
                this.stopRecording(false, 'segment_pause');
            }
        }, this._MAX_RECORDING_DURATION);

        this.clearInitialSpeechTimeout();
        const initialSpeechTimeoutMs = Number(
            this.voiceInputSettings.initialSpeechTimeoutMs || this._VOICE_INITIAL_SPEECH_TIMEOUT_MS
        );
        if (initialSpeechTimeoutMs > 0) {
            this.initialSpeechTimeout = setTimeout(() => {
                if (!this.isRecording || this.speechDetected) {
                    return;
                }
                this.addThinkingAnimation();
                this.stopRecording(false, 'segment_pause');
            }, initialSpeechTimeoutMs);
        }

        // Set up audio analysis for silence detection
        this.setupSilenceDetection(stream);
        const listeningLabel = this.getVoiceLabel('voiceInterface.listening', 'Listening...');
        this.updateVoiceStatus(listeningLabel, true);
        this.updateLiveTranscript('');
        this.showVoiceProgressMessage(listeningLabel, { state: 'listening' });
    }

    prepareVoiceChunks(rawSamples = [], sampleRate = 16000) {
        const totalSamples = Array.isArray(rawSamples) ? rawSamples.length : 0;
        const isHalfDuplexCapture = this.shouldUseHalfDuplexVoiceCapture();
        const configuredPreRollMs = Number(
            this.voiceInputSettings.preRollMs || this._VOICE_PRE_ROLL_MS
        );
        const preRollMs = isHalfDuplexCapture
            ? Math.max(configuredPreRollMs, this._IOS_HALF_DUPLEX_PRE_ROLL_MS)
            : configuredPreRollMs;
        const postRollMs = Number(this.voiceInputSettings.postRollMs || this._VOICE_POST_ROLL_MS);
        const maxChunkMs = Number(this.voiceInputSettings.maxChunkMs || this._VOICE_MAX_CHUNK_MS);
        const startThresholdRms = Number(this.voiceInputSettings.startThresholdRms);
        const stopThresholdRms = Number(this.voiceInputSettings.stopThresholdRms);
        const frameMs = Number(this.voiceInputSettings.frameMs || this._VOICE_FRAME_MS);
        const minVoicedMs = Number(
            this.voiceInputSettings.minVoicedMs || this._VOICE_MIN_VOICED_MS
        );
        const frameSize = Math.max(1, Math.round((sampleRate * frameMs) / 1000));
        const preRollSamples = Math.max(0, Math.round((sampleRate * preRollMs) / 1000));
        const postRollSamples = Math.max(0, Math.round((sampleRate * postRollMs) / 1000));
        const maxChunkSamples = Math.max(frameSize, Math.round((sampleRate * maxChunkMs) / 1000));
        const minVoicedFrames = Math.max(1, Math.round(minVoicedMs / Math.max(frameMs, 1)));
        const rawDurationMs = totalSamples > 0 ? Math.round((totalSamples / sampleRate) * 1000) : 0;
        let peakAbs = 0;
        for (let i = 0; i < totalSamples; i++) {
            const abs = Math.abs(Number(rawSamples[i]) || 0);
            if (abs > peakAbs) {
                peakAbs = abs;
            }
        }

        if (!totalSamples) {
            return {
                chunks: [],
                rawDurationMs,
                trimmedDurationMs: 0,
                trimStartMs: 0,
                trimEndMs: 0,
            };
        }

        let firstSpeechFrameIndex = -1;
        let firstStopSpeechFrameIndex = -1;
        let lastSpeechFrameIndex = -1;
        let currentVoicedRun = 0;
        const frameRmsValues = [];
        const frameCount = Math.ceil(totalSamples / frameSize);
        for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
            const start = frameIndex * frameSize;
            const end = Math.min(start + frameSize, totalSamples);
            let sumSquares = 0;
            let frameLength = 0;
            for (let i = start; i < end; i++) {
                const sample = Number(rawSamples[i]) || 0;
                sumSquares += sample * sample;
                frameLength++;
            }
            const frameRms = frameLength ? Math.sqrt(sumSquares / frameLength) : 0;
            frameRmsValues.push(frameRms);
            const isStartVoiceFrame = frameRms >= startThresholdRms;
            const isStopVoiceFrame = frameRms >= stopThresholdRms;
            if (isStartVoiceFrame) {
                currentVoicedRun++;
            } else {
                currentVoicedRun = 0;
            }
            if (firstSpeechFrameIndex === -1 && currentVoicedRun >= minVoicedFrames) {
                firstSpeechFrameIndex = Math.max(0, frameIndex - minVoicedFrames + 1);
            }
            if (isStopVoiceFrame) {
                if (firstStopSpeechFrameIndex === -1) {
                    firstStopSpeechFrameIndex = frameIndex;
                }
                lastSpeechFrameIndex = frameIndex;
            }
        }

        // Fallback for softer speech that doesn't hit strict startThreshold consecutively.
        if (firstSpeechFrameIndex === -1 && firstStopSpeechFrameIndex !== -1) {
            const relaxedStartThreshold = Math.max(
                stopThresholdRms,
                Math.round(startThresholdRms * 0.75)
            );
            const relaxedMinVoicedFrames = Math.max(1, Math.round(minVoicedFrames / 2));
            let relaxedRun = 0;
            for (let frameIndex = 0; frameIndex < frameRmsValues.length; frameIndex++) {
                if (frameRmsValues[frameIndex] >= relaxedStartThreshold) {
                    relaxedRun++;
                    if (relaxedRun >= relaxedMinVoicedFrames) {
                        firstSpeechFrameIndex = Math.max(
                            0,
                            frameIndex - relaxedMinVoicedFrames + 1
                        );
                        break;
                    }
                } else {
                    relaxedRun = 0;
                }
            }
            if (firstSpeechFrameIndex === -1) {
                firstSpeechFrameIndex = Math.max(
                    0,
                    firstStopSpeechFrameIndex - relaxedMinVoicedFrames + 1
                );
            }
        }

        // Guardrail: if start is detected after the first stop-threshold hit, anchor start earlier.
        // This avoids dropping the beginning of a sentence when opening words are softer.
        if (firstStopSpeechFrameIndex !== -1 && firstSpeechFrameIndex > firstStopSpeechFrameIndex) {
            const anchorFrames = Math.max(1, Math.round(minVoicedFrames / 2));
            const anchoredStartIndex = Math.max(0, firstStopSpeechFrameIndex - anchorFrames + 1);
            firstSpeechFrameIndex = anchoredStartIndex;
        }

        // If speech appears near the beginning, keep the capture from frame 0 so
        // opening words are not clipped by threshold warm-up.
        if (
            firstStopSpeechFrameIndex !== -1 &&
            firstStopSpeechFrameIndex <= Math.max(minVoicedFrames * 3, 6) &&
            firstSpeechFrameIndex > 0
        ) {
            firstSpeechFrameIndex = 0;
        }
        if (
            isHalfDuplexCapture &&
            firstSpeechFrameIndex !== -1 &&
            firstSpeechFrameIndex <= Math.max(minVoicedFrames * 8, 20)
        ) {
            firstSpeechFrameIndex = 0;
        }

        if (firstSpeechFrameIndex === -1 || lastSpeechFrameIndex === -1) {
            return {
                chunks: [],
                rawDurationMs,
                trimmedDurationMs: 0,
                trimStartMs: rawDurationMs,
                trimEndMs: 0,
            };
        }

        const firstSpeechSample = firstSpeechFrameIndex * frameSize;
        const leadingEdgeFrameWindow = Math.max(minVoicedFrames * 2, 4);
        const trailingEdgeFrameWindow = Math.max(minVoicedFrames * 2, 4);
        const startSample =
            firstSpeechFrameIndex <= leadingEdgeFrameWindow
                ? 0
                : Math.max(0, firstSpeechSample - preRollSamples);
        const endSample =
            lastSpeechFrameIndex >= frameCount - trailingEdgeFrameWindow
                ? totalSamples
                : Math.min(totalSamples, (lastSpeechFrameIndex + 1) * frameSize + postRollSamples);
        const trimmedSamples = rawSamples.slice(startSample, endSample);
        const trimmedDurationMs = Math.round((trimmedSamples.length / sampleRate) * 1000);
        const trimStartMs = Math.round((startSample / sampleRate) * 1000);
        const trimEndMs = Math.max(0, rawDurationMs - trimmedDurationMs - trimStartMs);

        const chunks = [];
        for (let i = 0; i < trimmedSamples.length; i += maxChunkSamples) {
            chunks.push(
                trimmedSamples.slice(i, Math.min(i + maxChunkSamples, trimmedSamples.length))
            );
        }

        return {
            chunks,
            rawDurationMs,
            trimmedDurationMs,
            trimStartMs,
            trimEndMs,
        };
    }

    async transcribePreparedVoiceChunks(chunks = [], sampleRate = 16000, options = {}) {
        if (!Array.isArray(chunks) || !chunks.length) {
            return null;
        }
        const isProbe = Boolean(options && options.isProbe);
        const transcriptParts = [];
        const acceptedChunkSamples = [];
        let sentSamplesCount = 0;
        let sttRequestCount = 0;
        const minSamplesToSend = Number(
            this.voiceInputSettings.minSamplesToSend || this._VOICE_MIN_SAMPLES_TO_SEND
        );
        const minChunkRms = Number(
            this.voiceInputSettings.minChunkRms || this._VOICE_MIN_CHUNK_RMS
        );
        const maxAbsSilenceThreshold = Number(
            this.voiceInputSettings.maxAbsSilenceThreshold || this._VOICE_MAX_ABS_SILENCE_THRESHOLD
        );
        const frameMs = Number(this.voiceInputSettings.frameMs || this._VOICE_FRAME_MS);
        const frameSize = Math.max(1, Math.round((sampleRate * frameMs) / 1000));
        const startThresholdRms = Number(
            this.voiceInputSettings.startThresholdRms || this._VOICE_START_THRESHOLD_RMS
        );
        const stopThresholdRms = Number(
            this.voiceInputSettings.stopThresholdRms || this._VOICE_STOP_THRESHOLD_RMS
        );
        const minVoicedMs = Number(
            this.voiceInputSettings.minVoicedMs || this._VOICE_MIN_VOICED_MS
        );
        const postRollMs = Number(this.voiceInputSettings.postRollMs || this._VOICE_POST_ROLL_MS);
        const minVoicedFrames = Math.max(1, Math.round(minVoicedMs / Math.max(frameMs, 1)));
        const postRollSamples = Math.max(0, Math.round((sampleRate * postRollMs) / 1000));
        const maxMergedChunkMs = Number(
            this.voiceInputSettings.sttMergeMaxMs || this._VOICE_STT_MERGE_MAX_MS
        );
        const maxMergedSamples = Math.max(
            frameSize,
            Math.round((sampleRate * Math.max(1000, maxMergedChunkMs)) / 1000)
        );

        const normalizeSamplesForStt = (samples) => {
            if (!samples || !samples.length) {
                return samples || new Int16Array(0);
            }
            let peak = 0;
            for (let i = 0; i < samples.length; i++) {
                const abs = Math.abs(samples[i]);
                if (abs > peak) {
                    peak = abs;
                }
            }
            // Safari can produce very low-amplitude PCM even when speech exists.
            // Boost quiet captures before STT to improve recognition reliability.
            if (peak > 0 && peak < 2200) {
                const targetPeak = 14000;
                const gain = Math.min(targetPeak / peak, 24);
                const normalized = new Int16Array(samples.length);
                for (let i = 0; i < samples.length; i++) {
                    const amplified = Math.round(samples[i] * gain);
                    normalized[i] = Math.max(-32768, Math.min(32767, amplified));
                }
                return normalized;
            }
            return samples;
        };

        const sendSamplesForStt = async (samples, label = '') => {
            if (!samples || !samples.length) {
                return null;
            }
            const preparedSamples = normalizeSamplesForStt(samples);
            sentSamplesCount += preparedSamples.length;
            const chunkBlob = kmVoice.createWavBlobFromPcmData(
                Int16Array.from(preparedSamples),
                sampleRate,
                kmVoice._OMNICHANNEL_STT_AUDIO_CONFIG.channelCount,
                kmVoice._OMNICHANNEL_STT_AUDIO_CONFIG.bitsPerSample
            );
            sttRequestCount++;
            let response;
            try {
                response = await kmVoice.voiceToText(chunkBlob, {
                    ucid: this.voiceInputSettings.ucid,
                    sttMode: 'recognize',
                });
            } catch (error) {
                if (error && error.code === 'SILENT_AUDIO') {
                    return null;
                }
                throw error;
            }
            if (response && typeof response.text === 'string' && response.text.trim()) {
                transcriptParts.push(response.text.trim());
                if (!isProbe) {
                    this.consecutiveEmptySttResponses = 0;
                    this.lastEmptySttResponseAt = 0;
                }
                return response;
            }
            if (!isProbe) {
                this.consecutiveEmptySttResponses++;
                this.lastEmptySttResponseAt = Date.now();
            }
            return response || null;
        };

        const mergeChunkGroups = (candidateChunks, maxSamplesPerGroup) => {
            const groups = [];
            let currentGroup = [];
            let currentSampleCount = 0;
            for (let i = 0; i < candidateChunks.length; i++) {
                const candidate = candidateChunks[i];
                const candidateLength = candidate.length;
                if (
                    currentGroup.length &&
                    currentSampleCount + candidateLength > maxSamplesPerGroup
                ) {
                    groups.push(currentGroup);
                    currentGroup = [];
                    currentSampleCount = 0;
                }
                currentGroup.push(candidate);
                currentSampleCount += candidateLength;
            }
            if (currentGroup.length) {
                groups.push(currentGroup);
            }
            return groups;
        };

        const flattenChunkGroup = (group) => {
            const totalSamples = group.reduce(
                (total, chunkSamples) => total + chunkSamples.length,
                0
            );
            const merged = new Int16Array(totalSamples);
            let offset = 0;
            for (let i = 0; i < group.length; i++) {
                merged.set(group[i], offset);
                offset += group[i].length;
            }
            return merged;
        };

        for (let i = 0; i < chunks.length; i++) {
            const chunkSamples = chunks[i];
            if (!chunkSamples || !chunkSamples.length) {
                continue;
            }

            let firstVoiceFrame = -1;
            let lastVoiceFrame = -1;
            let consecutiveStartFrames = 0;
            let maxConsecutiveStartFrames = 0;
            let stopVoiceFrames = 0;
            const frameCount = Math.ceil(chunkSamples.length / frameSize);
            for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                const start = frameIndex * frameSize;
                const end = Math.min(start + frameSize, chunkSamples.length);
                let frameSumSquares = 0;
                let frameLength = 0;
                for (let sampleIndex = start; sampleIndex < end; sampleIndex++) {
                    const sample = Number(chunkSamples[sampleIndex]) || 0;
                    frameSumSquares += sample * sample;
                    frameLength++;
                }
                const frameRms = frameLength ? Math.sqrt(frameSumSquares / frameLength) : 0;
                if (frameRms >= startThresholdRms) {
                    consecutiveStartFrames++;
                    if (consecutiveStartFrames > maxConsecutiveStartFrames) {
                        maxConsecutiveStartFrames = consecutiveStartFrames;
                    }
                } else {
                    consecutiveStartFrames = 0;
                }
                if (frameRms >= stopThresholdRms) {
                    stopVoiceFrames++;
                    if (firstVoiceFrame === -1) {
                        firstVoiceFrame = frameIndex;
                    }
                    lastVoiceFrame = frameIndex;
                }
            }

            if (maxConsecutiveStartFrames < minVoicedFrames || firstVoiceFrame === -1) {
                const relaxedStartThreshold = Math.max(
                    stopThresholdRms,
                    Math.round(startThresholdRms * 0.75)
                );
                const relaxedMinVoicedFrames = Math.max(1, Math.round(minVoicedFrames / 2));
                let relaxedRun = 0;
                let relaxedFirstVoiceFrame = -1;
                for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                    const start = frameIndex * frameSize;
                    const end = Math.min(start + frameSize, chunkSamples.length);
                    let frameSumSquares = 0;
                    let frameLength = 0;
                    for (let sampleIndex = start; sampleIndex < end; sampleIndex++) {
                        const sample = Number(chunkSamples[sampleIndex]) || 0;
                        frameSumSquares += sample * sample;
                        frameLength++;
                    }
                    const frameRms = frameLength ? Math.sqrt(frameSumSquares / frameLength) : 0;
                    if (frameRms >= relaxedStartThreshold) {
                        relaxedRun++;
                        if (relaxedRun >= relaxedMinVoicedFrames && relaxedFirstVoiceFrame === -1) {
                            relaxedFirstVoiceFrame = Math.max(
                                0,
                                frameIndex - relaxedMinVoicedFrames + 1
                            );
                        }
                    } else {
                        relaxedRun = 0;
                    }
                    if (frameRms >= stopThresholdRms && firstVoiceFrame === -1) {
                        firstVoiceFrame = frameIndex;
                    }
                    if (frameRms >= stopThresholdRms) {
                        lastVoiceFrame = frameIndex;
                    }
                }
                if (relaxedFirstVoiceFrame !== -1) {
                    firstVoiceFrame = relaxedFirstVoiceFrame;
                } else if (firstVoiceFrame === -1) {
                    continue;
                }
            }

            const leadingEdgeFrameWindow = Math.max(minVoicedFrames * 2, 4);
            const trailingEdgeFrameWindow = Math.max(minVoicedFrames * 2, 4);
            const trimmedStart =
                firstVoiceFrame <= leadingEdgeFrameWindow ? 0 : firstVoiceFrame * frameSize;
            const trimmedEnd =
                lastVoiceFrame >= frameCount - trailingEdgeFrameWindow
                    ? chunkSamples.length
                    : Math.min(
                          chunkSamples.length,
                          (lastVoiceFrame + 1) * frameSize + postRollSamples
                      );
            const processedChunkSamples = chunkSamples.slice(trimmedStart, trimmedEnd);
            if (processedChunkSamples.length < minSamplesToSend) {
                continue;
            }

            let sumSquares = 0;
            let maxAbs = 0;
            for (let j = 0; j < processedChunkSamples.length; j++) {
                const value = Number(processedChunkSamples[j]) || 0;
                const absValue = Math.abs(value);
                sumSquares += value * value;
                if (absValue > maxAbs) {
                    maxAbs = absValue;
                }
            }
            const chunkRms = Math.sqrt(sumSquares / Math.max(processedChunkSamples.length, 1));
            if (chunkRms < minChunkRms || maxAbs < maxAbsSilenceThreshold) {
                continue;
            }
            const stopVoiceRatio = frameCount > 0 ? stopVoiceFrames / frameCount : 0;
            const now = Date.now();
            const inEmptySuppressWindow =
                this.consecutiveEmptySttResponses >= this._VOICE_EMPTY_STT_SUPPRESS_COUNT &&
                now - this.lastEmptySttResponseAt < this._VOICE_EMPTY_STT_SUPPRESS_WINDOW_MS;
            const isHighConfidenceChunk =
                (chunkRms >= minChunkRms * 1.6 && stopVoiceRatio >= 0.2) ||
                (maxAbs >= maxAbsSilenceThreshold * 3 && stopVoiceRatio >= 0.25);
            if (inEmptySuppressWindow && !isHighConfidenceChunk) {
                continue;
            }
            acceptedChunkSamples.push(Int16Array.from(processedChunkSamples));
        }

        if (!acceptedChunkSamples.length) {
            // Fallback: Safari/low-gain inputs can fail strict chunk gates even when
            // speech exists. Send one merged low-threshold attempt instead of returning empty.
            const mergedSamples = flattenChunkGroup(
                chunks.map((chunkSamples) => Int16Array.from(chunkSamples || []))
            );
            if (mergedSamples.length >= minSamplesToSend) {
                let nonZero = 0;
                let maxAbs = 0;
                for (let i = 0; i < mergedSamples.length; i++) {
                    const abs = Math.abs(mergedSamples[i]);
                    if (abs > 0) {
                        nonZero++;
                    }
                    if (abs > maxAbs) {
                        maxAbs = abs;
                    }
                }
                const nonZeroRatio = nonZero / Math.max(mergedSamples.length, 1);
                const fallbackPeakThreshold = Math.max(
                    20,
                    Math.round(maxAbsSilenceThreshold * 0.35)
                );
                if (maxAbs >= fallbackPeakThreshold && nonZeroRatio >= 0.01) {
                    acceptedChunkSamples.push(mergedSamples);
                }
            }
        }

        if (!acceptedChunkSamples.length) {
            return null;
        }

        if (this.activeRecognitionMode === 'omnichannel') {
            const mergedGroups = mergeChunkGroups(acceptedChunkSamples, maxMergedSamples);
            for (let i = 0; i < mergedGroups.length; i++) {
                const mergedSamples = flattenChunkGroup(mergedGroups[i]);
                await sendSamplesForStt(mergedSamples, `merged-${i}`);
            }
        } else {
            for (let i = 0; i < acceptedChunkSamples.length; i++) {
                await sendSamplesForStt(acceptedChunkSamples[i], `chunk-${i}`);
            }
        }

        if (!transcriptParts.length) {
            return null;
        }
        return { text: transcriptParts.join(' ').trim() };
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

    recoverListeningAfterPlaybackIfIdle(reason = 'unknown') {
        if (!this.autoListeningEnabled || this.voiceMuted || this.isRecording) {
            return;
        }
        const isAudioActive = this.isAudioPlaybackActive();
        if (isAudioActive || this.messagesQueue.length > 0) {
            return;
        }
        if (this.awaitingBotResponsePlayback) {
            this.setAwaitingBotResponsePlayback(false);
        }
        this.resumeListeningAfterPlayback();
    }

    createAudioVisualizer(audioElement) {
        try {
            if (!audioElement) {
                return () => {};
            }
            if (!this.visualizerAudioContext) {
                this.visualizerAudioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
            }
            const audioContext = this.visualizerAudioContext;
            this.resumeAudioContext(audioContext, 'voice_visualizer');
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 512; // Increased for better frequency resolution

            let source = this.visualizerSourceNodes && this.visualizerSourceNodes.get(audioElement);
            if (!source) {
                source = audioContext.createMediaElementSource(audioElement);
                if (this.visualizerSourceNodes) {
                    this.visualizerSourceNodes.set(audioElement, source);
                }
            }

            try {
                source.disconnect();
            } catch (error) {}
            try {
                analyzer.disconnect();
            } catch (error) {}

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

            // Keep track of previous scale for smooth transitions
            let lastScale = this._MIN_SPEAK_ANIMATION_SCALE; // Initialize with minimum scale (matching minScale)

            // Animation function with improved response to sound
            const visualize = () => {
                if (!ring || !audioElement || audioElement.paused) {
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

            // Return cleanup function
            return () => {
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
                setTimeout(() => {
                    this.recoverListeningAfterPlaybackIfIdle('visualizer_cleanup');
                }, 0);
            };
        } catch (error) {
            console.error('Error creating audio visualizer:', error);
            return () => {};
        }
    }
    getStatusElement() {
        if (!this.statusElement || !this.statusElement.isConnected) {
            this.statusElement = document.getElementById('km-voice-inline-text');
        }
        return this.statusElement;
    }

    getTranscriptElement() {
        if (!this.transcriptElement || !this.transcriptElement.isConnected) {
            this.transcriptElement = document.getElementById('mck-voice-live-transcript');
        }
        return this.transcriptElement;
    }

    getResponseElement() {
        if (!this.responseElement || !this.responseElement.isConnected) {
            this.responseElement = document.getElementById('mck-voice-response-text');
        }
        return this.responseElement;
    }

    getInlineStatusContainer() {
        if (!this.inlineStatusContainer || !this.inlineStatusContainer.isConnected) {
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

    getVoiceProgressContainer() {
        return document.querySelector('#mck-message-cell .mck-message-inner');
    }

    clearVoiceProgressAutoHide() {
        if (this.voiceProgressAutoHideTimeout) {
            clearTimeout(this.voiceProgressAutoHideTimeout);
            this.voiceProgressAutoHideTimeout = null;
        }
    }

    showVoiceProgressMessage(text, { state = 'listening', autoHide = 0 } = {}) {
        const container = this.getVoiceProgressContainer();
        if (!container) {
            return;
        }
        this.clearVoiceProgressAutoHide();
        if (!this.voiceProgressElement || !this.voiceProgressElement.isConnected) {
            const wrapper = document.createElement('div');
            wrapper.id = 'km-voice-progress-message';
            wrapper.className = 'km-voice-progress-message';
            const bubble = document.createElement('div');
            bubble.className = 'km-voice-progress-bubble';
            wrapper.appendChild(bubble);
            container.appendChild(wrapper);
            this.voiceProgressElement = wrapper;
        }
        this.voiceProgressElement.dataset.state = state;
        const bubble = this.voiceProgressElement.querySelector('.km-voice-progress-bubble');
        if (bubble) {
            bubble.textContent = text || '';
        }
        container.scrollTop = container.scrollHeight;
        if (autoHide > 0) {
            this.voiceProgressAutoHideTimeout = setTimeout(() => {
                this.clearVoiceProgressMessage();
            }, autoHide);
        }
    }

    getVoiceErrorMessage(error, fallback = 'Voice error') {
        if (!error) {
            return fallback;
        }
        if (typeof error === 'string') {
            return error;
        }
        const detail = error.message || error.name || '';
        return detail ? `${fallback}: ${detail}` : fallback;
    }

    showVoiceErrorMessage(error, fallback = 'Voice error', { autoHide = 9000 } = {}) {
        const message = this.getVoiceErrorMessage(error, fallback);
        this.updateVoiceStatus(this.getVoiceLabel('voiceInterface.error', 'Voice error'));
        this.updateLiveTranscript(message, { autoHide });
        this.showVoiceProgressMessage(message, { state: 'error', autoHide });
    }

    clearVoiceProgressMessage() {
        this.clearVoiceProgressAutoHide();
        if (this.voiceProgressElement && this.voiceProgressElement.parentNode) {
            this.voiceProgressElement.parentNode.removeChild(this.voiceProgressElement);
        }
        this.voiceProgressElement = null;
    }

    exitVoiceModeWithMessage(labelKeyOrMessage, fallbackOrOptions) {
        this.stopVoiceMode();

        let fallback;
        let autoHide = 5000;

        if (typeof fallbackOrOptions === 'string') {
            fallback = fallbackOrOptions;
        } else if (fallbackOrOptions && typeof fallbackOrOptions === 'object') {
            fallback = fallbackOrOptions.fallback;
            if (typeof fallbackOrOptions.autoHide === 'number') {
                autoHide = fallbackOrOptions.autoHide;
            }
        }

        const isLikelyLabelKey =
            typeof labelKeyOrMessage === 'string' &&
            /^[\\w$.]+$/.test(labelKeyOrMessage) &&
            !labelKeyOrMessage.includes(' ');

        let message;
        if (labelKeyOrMessage) {
            message = isLikelyLabelKey
                ? this.getVoiceLabel(labelKeyOrMessage, fallback)
                : labelKeyOrMessage;
        } else if (fallback) {
            message = fallback;
        }

        if (message) {
            this.updateLiveTranscript(message, { autoHide });
        }
    }

    handleVoiceQuery(userMsg) {
        const trimmedMessage = userMsg ? userMsg.trim() : '';
        const prefix = this.getVoiceLabel('you', 'You');
        const noSpeechLabel = this.getVoiceLabel(
            'voiceInterface.noSpeechDetected',
            'No speech detected. Please try again.'
        );
        const transcriptText = trimmedMessage ? `${prefix}: ${trimmedMessage}` : noSpeechLabel;
        this.updateLiveTranscript(transcriptText, { autoHide: 9000 });
        if (!trimmedMessage) {
            return false;
        }
        if (!CURRENT_GROUP_DATA || !CURRENT_GROUP_DATA.tabId) {
            this.updateLiveTranscript(
                this.getVoiceLabel(
                    'voiceInterface.noActiveConversation',
                    'Please open a conversation first.'
                ),
                { autoHide: 5000 }
            );
            return false;
        }
        if (this.shouldSuppressRecentBotEcho(trimmedMessage)) {
            this.updateLiveTranscript(
                this.getVoiceLabel(
                    'voiceInterface.echoSuppressed',
                    'Ignored echoed bot audio. Listening again...'
                ),
                { autoHide: 2200 }
            );
            this.clearVoiceProgressMessage();
            this.scheduleAutoListen(this._WEBKIT_BOT_PLAYBACK_RESTART_DELAY_MS, {
                skipCooldown: false,
            });
            return false;
        }
        this.setAwaitingBotResponsePlayback(true);
        this.clearVoiceProgressMessage();
        this.logVoiceDebug('voice_query_submitted', {
            textLength: trimmedMessage.length,
        });
        const messagePayload = {
            contentType: 10,
            source: 1,
            type: 5,
            message: trimmedMessage,
            groupId: CURRENT_GROUP_DATA.tabId,
        };
        if (this.isVoiceModeActive()) {
            messagePayload.metadata = {
                KM_INPUT_TYPE: 'VOICE',
            };
        }
        kommunicate.sendMessage(messagePayload);
        return true;
    }

    normalizeVoiceComparisonText(text) {
        return (text || '')
            .toString()
            .toLowerCase()
            .replace(/[\s\n\r\t]+/g, ' ')
            .replace(/[^\w ]+/g, '')
            .trim();
    }

    shouldSuppressRecentBotEcho(text) {
        if (!KommunicateUtils.isIOSWebKitBrowser()) {
            return false;
        }
        if (!text || !this.lastBotPlaybackText || !this.lastBotPlaybackEndedAt) {
            return false;
        }
        const elapsedMs = Date.now() - this.lastBotPlaybackEndedAt;
        if (elapsedMs < 0 || elapsedMs > this._VOICE_ECHO_SUPPRESS_WINDOW_MS) {
            return false;
        }
        const normalizedTranscript = this.normalizeVoiceComparisonText(text);
        const normalizedBotText = this.normalizeVoiceComparisonText(this.lastBotPlaybackText);
        if (!normalizedTranscript || !normalizedBotText) {
            return false;
        }
        if (normalizedTranscript.length < 5 || normalizedBotText.length < 5) {
            return false;
        }
        if (normalizedTranscript === normalizedBotText) {
            return true;
        }
        if (
            normalizedTranscript.includes(normalizedBotText) ||
            normalizedBotText.includes(normalizedTranscript)
        ) {
            return true;
        }
        const shortestLength = Math.min(normalizedTranscript.length, normalizedBotText.length);
        const longestLength = Math.max(normalizedTranscript.length, normalizedBotText.length);
        const overlapRatio = shortestLength / longestLength;
        if (overlapRatio < 0.85) {
            return false;
        }
        return (
            normalizedTranscript.startsWith(normalizedBotText) ||
            normalizedBotText.startsWith(normalizedTranscript)
        );
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
        if (text) {
            const statusEl = document.getElementById('mck-status-live');
            const label = window.MCK_LABELS && window.MCK_LABELS['voice.response.received.status'];
            if (statusEl && label) {
                statusEl.textContent = '';
                setTimeout(() => {
                    statusEl.textContent = label;
                }, 50);
            }
        }
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
        if (!this.responseContainer || !this.responseContainer.isConnected) {
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

    clearAwaitingBotResponseTimeout() {
        if (this.awaitingBotResponseTimeout) {
            clearTimeout(this.awaitingBotResponseTimeout);
            this.awaitingBotResponseTimeout = null;
        }
    }

    setAwaitingBotResponsePlayback(isPending, timeoutMs = 30000) {
        this.awaitingBotResponsePlayback = Boolean(isPending);
        this.clearAwaitingBotResponseTimeout();
        if (this.awaitingBotResponsePlayback) {
            this.awaitingBotResponseTimeout = setTimeout(() => {
                const isPlaybackStillActive = this.isAudioPlaybackActive();
                const hasQueuedBotMessages = this.messagesQueue.length > 0;
                if (isPlaybackStillActive || hasQueuedBotMessages) {
                    this.setAwaitingBotResponsePlayback(true, timeoutMs);
                    return;
                }
                this.awaitingBotResponsePlayback = false;
                this.awaitingBotResponseTimeout = null;
                const listeningLabel = this.getVoiceLabel(
                    'voiceInterface.listening',
                    'Listening...'
                );
                this.updateVoiceStatus(listeningLabel, true);
                this.showVoiceProgressMessage(listeningLabel, { state: 'listening' });
                this.scheduleAutoListen(0);
            }, timeoutMs);
        }
    }

    clearSilenceTimeout() {
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
        }
        this.silenceNoiseStart = null;
    }

    clearInitialSpeechTimeout() {
        if (this.initialSpeechTimeout) {
            clearTimeout(this.initialSpeechTimeout);
            this.initialSpeechTimeout = null;
        }
    }

    clearPendingVoiceMessageTimer() {
        if (this.pendingVoiceMessageTimer) {
            clearTimeout(this.pendingVoiceMessageTimer);
            this.pendingVoiceMessageTimer = null;
        }
    }

    resetPendingVoiceSegments() {
        this.clearPendingVoiceMessageTimer();
        this.pendingVoiceSegments = {};
        this.pendingVoiceSegmentSeq = 0;
        this.pendingVoiceSegmentInFlight = 0;
        this.pendingContinuationStart = false;
        this.continuationDecisionActive = false;
        this.continuationSpeechDetected = false;
        this.continuationWindowStartedAt = 0;
        this.discardNextRecordingPayload = false;
    }

    beginContinuationDecisionWindow() {
        this.continuationDecisionActive = true;
        this.continuationSpeechDetected = false;
        this.continuationWindowStartedAt = Date.now();
        this.clearPendingVoiceMessageTimer();
    }

    resolveContinuationDecisionWindow() {
        this.continuationDecisionActive = false;
        this.continuationSpeechDetected = false;
        this.continuationWindowStartedAt = 0;
        this.clearPendingVoiceMessageTimer();
    }

    appendPendingVoiceSegment(segmentSeq, text) {
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }
        this.pendingVoiceSegments[segmentSeq] = trimmedText;
    }

    getPendingVoiceSegmentCount() {
        return Object.keys(this.pendingVoiceSegments).length;
    }

    buildPendingVoiceMessageText() {
        const segmentIds = Object.keys(this.pendingVoiceSegments)
            .map((value) => Number(value))
            .filter((value) => !Number.isNaN(value))
            .sort((a, b) => a - b);
        const transcriptParts = [];
        for (let i = 0; i < segmentIds.length; i++) {
            const part = this.pendingVoiceSegments[segmentIds[i]];
            if (part) {
                transcriptParts.push(part);
            }
        }
        return transcriptParts.join(' ').trim();
    }

    schedulePendingVoiceMessageFinalize(delay = 100) {
        this.clearPendingVoiceMessageTimer();
        const finalizeDelay = Number(delay);
        if (!(finalizeDelay > 0)) {
            this.finalizePendingVoiceMessage();
            return;
        }
        this.pendingVoiceMessageTimer = setTimeout(() => {
            this.pendingVoiceMessageTimer = null;
            this.finalizePendingVoiceMessage();
        }, finalizeDelay);
    }

    maybeFinalizePendingVoiceMessageAfterSegment() {
        this.finalizePendingVoiceMessage();
    }

    showListeningState() {
        const listeningLabel = this.getVoiceLabel('voiceInterface.listening', 'Listening...');
        this.updateVoiceStatus(listeningLabel, true);
        this.showVoiceProgressMessage(listeningLabel, { state: 'listening' });
    }

    recoverAfterVoiceProcessingFailure(error, context = {}) {
        this.resetPendingVoiceSegments();
        if (this.awaitingBotResponsePlayback) {
            this.setAwaitingBotResponsePlayback(false);
        }
        if (this.autoListeningEnabled && !this.voiceMuted && !this.isAudioPlaybackActive()) {
            this.showListeningState();
            this.scheduleAutoListen(1200);
        }
    }

    finalizePendingVoiceMessage() {
        const continuationMinWaitMs = Number(
            this.voiceInputSettings.continuationMinWaitMs || this._VOICE_CONTINUATION_MIN_WAIT_MS
        );
        const continuationMaxSilenceMs = Number(
            this.voiceInputSettings.continuationMaxSilenceMs ||
                this._VOICE_CONTINUATION_MAX_SILENCE_MS
        );
        if (this.continuationDecisionActive) {
            if (this.continuationSpeechDetected) {
                this.resolveContinuationDecisionWindow();
                return;
            }
            if (this.pendingContinuationStart) {
                this.schedulePendingVoiceMessageFinalize(100);
                return;
            }
            const continuationElapsed = this.continuationWindowStartedAt
                ? Date.now() - this.continuationWindowStartedAt
                : continuationMinWaitMs;
            if (this.isRecording) {
                if (this.speechDetected || this.firstSpeechTimestamp) {
                    this.resolveContinuationDecisionWindow();
                    return;
                }
                if (
                    continuationElapsed >= continuationMinWaitMs &&
                    this.pendingVoiceSegmentInFlight === 0
                ) {
                    this.stopRecording(false, 'continuation_idle');
                    return;
                }
                if (continuationElapsed >= continuationMaxSilenceMs) {
                    this.stopRecording(false, 'continuation_idle');
                    return;
                }
                const waitForMinWindow = Math.max(continuationMinWaitMs - continuationElapsed, 0);
                const waitForMaxWindow = Math.max(
                    continuationMaxSilenceMs - continuationElapsed,
                    0
                );
                const nextDelay = this.pendingVoiceSegmentInFlight > 0 ? 100 : waitForMinWindow;
                if (nextDelay > 0) {
                    this.schedulePendingVoiceMessageFinalize(Math.min(nextDelay, waitForMaxWindow));
                    return;
                }
                this.schedulePendingVoiceMessageFinalize(Math.min(100, waitForMaxWindow || 100));
                return;
            }
            if (
                continuationElapsed < continuationMinWaitMs ||
                this.pendingVoiceSegmentInFlight > 0
            ) {
                const waitForMinWindow = Math.max(continuationMinWaitMs - continuationElapsed, 0);
                const nextDelay = this.pendingVoiceSegmentInFlight > 0 ? 100 : waitForMinWindow;
                this.schedulePendingVoiceMessageFinalize(nextDelay || 100);
                return;
            }
            this.resolveContinuationDecisionWindow();
        }
        if (this.pendingContinuationStart) {
            this.schedulePendingVoiceMessageFinalize(200);
            return;
        }
        if (this.isRecording) {
            const silenceElapsed = this.silenceStart ? Date.now() - this.silenceStart : 0;
            const continuationMinWaitMs = Number(
                this.voiceInputSettings.continuationMinWaitMs ||
                    this._VOICE_CONTINUATION_MIN_WAIT_MS
            );
            const continuationMaxSilenceMs = Number(
                this.voiceInputSettings.continuationMaxSilenceMs ||
                    this._VOICE_CONTINUATION_MAX_SILENCE_MS
            );
            if (
                !this.speechDetected &&
                this.pendingVoiceSegmentInFlight === 0 &&
                this.isInSilence &&
                silenceElapsed >= continuationMinWaitMs
            ) {
                this.stopRecording(false, 'continuation_idle');
                return;
            }
            if (
                !this.speechDetected &&
                this.pendingVoiceSegmentInFlight === 0 &&
                this.isInSilence &&
                silenceElapsed >= continuationMaxSilenceMs
            ) {
                this.stopRecording(false, 'continuation_idle');
                return;
            }
            this.schedulePendingVoiceMessageFinalize(200);
            return;
        }
        if (this.pendingVoiceSegmentInFlight > 0) {
            this.schedulePendingVoiceMessageFinalize(200);
            return;
        }
        const userMsg = this.buildPendingVoiceMessageText();
        this.resetPendingVoiceSegments();
        if (!userMsg) {
            this.removeAllAnimation();
            this.clearVoiceStatus();
            this.updateLiveTranscript(
                this.getVoiceLabel(
                    'voiceInterface.didNotCatchThat',
                    "Didn't catch that. Please try again."
                ),
                { autoHide: 2500 }
            );
            this.scheduleAutoListen(2600);
            return;
        }
        this.handleVoiceQuery(userMsg);
    }

    startSilenceTimeout() {
        this.clearSilenceTimeout();
        if (!this.silenceStart) {
            return;
        }
        const elapsed = Date.now() - this.silenceStart;
        const delay = Math.max(this.voiceInputSettings.silenceDuration - elapsed, 0);
        if (delay === 0) {
            this.handleSilenceTimeout();
            return;
        }
        this.silenceTimeout = setTimeout(() => this.handleSilenceTimeout(), delay);
    }

    async handleSilenceTimeout() {
        this.silenceTimeout = null;
        if (!this.isRecording || !this.isInSilence) {
            return;
        }
        const silenceDuration = this.silenceStart ? Date.now() - this.silenceStart : 0;
        if (silenceDuration < this.voiceInputSettings.silenceDuration) {
            this.startSilenceTimeout();
            return;
        }
        this.addThinkingAnimation();
        this.updateLiveTranscript(
            this.getVoiceLabel(
                'voiceInterface.silenceTimeout',
                'No speech detected. Listening for more...'
            ),
            { autoHide: 2000 }
        );
        this.stopRecording(false, 'segment_pause');
    }

    enableAutoListening() {
        this.autoListeningEnabled = true;
        this.clearAutoListenTimeout();
        this.clearResponseTimeout();
        this.startVoiceModeTimeout();
    }

    disableAutoListening() {
        this.autoListeningEnabled = false;
        this.clearAutoListenTimeout();
        this.clearResponseTimeout();
        this.clearVoiceModeTimeout();
    }

    scheduleAutoListen(delay = 300, { skipCooldown = false } = {}) {
        this.clearAutoListenTimeout();
        if (!skipCooldown && this.lastRecordingEnd) {
            const cooldownElapsed = Date.now() - this.lastRecordingEnd;
            if (cooldownElapsed < this._AUTO_LISTEN_COOLDOWN) {
                delay = Math.max(delay, this._AUTO_LISTEN_COOLDOWN - cooldownElapsed);
            }
        }
        if (
            !this.autoListeningEnabled ||
            this.voiceMuted ||
            this.isRecording ||
            this.awaitingBotResponsePlayback ||
            this.messagesQueue.length > 0 ||
            !this.isVoiceInterfaceVisible() ||
            this.isAudioPlaybackActive()
        ) {
            return;
        }
        this.autoListenTimeout = setTimeout(() => {
            this.autoListenTimeout = null;
            if (
                this.autoListeningEnabled &&
                !this.voiceMuted &&
                !this.isRecording &&
                !this.awaitingBotResponsePlayback &&
                this.messagesQueue.length === 0 &&
                this.isVoiceInterfaceVisible() &&
                !this.isAudioPlaybackActive()
            ) {
                this.requestAudioRecording();
            }
        }, delay);
    }

    resumeListeningAfterPlayback({ fromNativeSpeech = false } = {}) {
        this.showListeningState();
        const isIOSWebKit = KommunicateUtils.isIOSWebKitBrowser();
        const isHalfDuplexCapture = this.shouldUseHalfDuplexVoiceCapture();
        const shouldDelayNativeSpeechRestart = fromNativeSpeech && isIOSWebKit;
        const shouldDelayBotPlaybackRestart =
            !fromNativeSpeech && isIOSWebKit && !isHalfDuplexCapture;
        const restartDelay = shouldDelayNativeSpeechRestart
            ? this._NATIVE_SPEECH_RESTART_DELAY_MS
            : shouldDelayBotPlaybackRestart
            ? this._WEBKIT_BOT_PLAYBACK_RESTART_DELAY_MS
            : 0;
        this.scheduleAutoListen(restartDelay, { skipCooldown: restartDelay === 0 });
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

    startVoiceModeTimeout() {
        this.clearVoiceModeTimeout();
        if (!this.isVoiceInterfaceVisible()) {
            return;
        }
        this.voiceModeTimeoutId = setTimeout(
            () => this.handleVoiceModeTimeout(),
            this._VOICE_MODE_SESSION_TIMEOUT
        );
    }

    clearVoiceModeTimeout() {
        if (this.voiceModeTimeoutId) {
            clearTimeout(this.voiceModeTimeoutId);
            this.voiceModeTimeoutId = null;
        }
    }

    handleVoiceModeTimeout() {
        this.voiceModeTimeoutId = null;
        if (!this.isVoiceInterfaceVisible()) {
            return;
        }
        const isVoicePlaybackActive = this.isAudioPlaybackActive();
        if (this.isRecording || isVoicePlaybackActive) {
            this.startVoiceModeTimeout();
            return;
        }
        this.startVoiceModeTimeout();
    }

    setupSilenceDetection(stream) {
        // Close any leftover context from a previous recording session that wasn't
        // cleaned up (e.g. if an exception interrupted the onaudioprocess teardown).
        if (this.silenceDetectionContext) {
            try {
                this.silenceDetectionContext.close();
            } catch (_) {}
            this.silenceDetectionContext = null;
        }
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.resumeAudioContext(audioContext, 'silence_detection');
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        this.silenceDetectionContext = audioContext;

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        this.initializeAdaptiveVad(audioContext.sampleRate, analyser.fftSize);
        const detectionInterval = Math.max(
            Math.round(this.adaptiveVadState?.frameDurationMs || 23),
            20
        );

        const silenceDetection = () => {
            if (!this.isRecording || !this.adaptiveVadState) {
                return;
            }
            const timeData = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(timeData);
            this.handleAdaptiveVadFrame(timeData);
        };

        this.silenceTimer = setInterval(silenceDetection, detectionInterval);

        // Clean up when recording stops
        scriptProcessor.onaudioprocess = (event) => {
            if (this.isRecording && event && event.inputBuffer) {
                const inputChannel = event.inputBuffer.getChannelData(0);
                if (inputChannel && inputChannel.length) {
                    this.vadCaptureChunks.push(new Float32Array(inputChannel));
                    if (!this.vadCaptureSampleRate) {
                        this.vadCaptureSampleRate = audioContext.sampleRate;
                    }
                }
            }
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
                this.adaptiveVadState = null;
            }
        };
    }

    extractPcmInt16FromVadCaptureChunks(vadCaptureChunks = [], vadCaptureSampleRate = 16000) {
        if (!Array.isArray(vadCaptureChunks) || !vadCaptureChunks.length) {
            return [];
        }
        let totalLength = 0;
        for (let i = 0; i < vadCaptureChunks.length; i++) {
            totalLength += vadCaptureChunks[i].length;
        }
        if (!totalLength) {
            return [];
        }
        const merged = new Float32Array(totalLength);
        let offset = 0;
        for (let i = 0; i < vadCaptureChunks.length; i++) {
            const chunk = vadCaptureChunks[i];
            merged.set(chunk, offset);
            offset += chunk.length;
        }
        const sourceRate = vadCaptureSampleRate || 16000;
        const targetRate = kmVoice.getVoiceToTextSampleRate();
        const preprocessed =
            typeof kmVoice.preprocessSttFloat32Samples === 'function'
                ? kmVoice.preprocessSttFloat32Samples(merged, sourceRate)
                : merged;
        const resampled = kmVoice.resampleToTargetRate(preprocessed, sourceRate, targetRate);
        const int16 = kmVoice.float32ToInt16(resampled);
        return Array.from(int16);
    }

    initializeAdaptiveVad(sampleRate, fftSize) {
        const vadSettings = this.voiceInputSettings?.vad || {};
        const frameDurationMs = (fftSize / sampleRate) * 1000;
        const historyMs = vadSettings.historyMs ?? 2000;
        const maxHistoryFrames = Math.max(1, Math.round(historyMs / Math.max(frameDurationMs, 1)));
        // Calibration: suppress speech detection briefly so the noise
        // floor has time to converge before we start listening for speech.
        const calibrationMs = vadSettings.calibrationMs ?? 180;
        const calibrationFrameTarget = Math.max(
            1,
            Math.round(calibrationMs / Math.max(frameDurationMs, 1))
        );
        this.adaptiveVadState = {
            frameDurationMs,
            maxHistoryFrames,
            history: [],
            startFactor: vadSettings.startFactor ?? 2.2,
            endFactor: vadSettings.endFactor ?? 1.8,
            startFrames: vadSettings.startFrames ?? 3,
            endFrames: vadSettings.endFrames ?? 20,
            noiseAlpha: vadSettings.noiseAlpha ?? 0.95,
            minStartRms: vadSettings.minStartRms ?? 0.008,
            noiseFloor: 0.002,
            noiseZcr: 0.02,
            speechActive: false,
            startCounter: 0,
            endCounter: 0,
            // Calibration state
            calibrating: true,
            calibrationFrames: 0,
            calibrationFrameTarget,
            // Faster alpha during calibration so the floor converges quickly
            calibrationNoiseAlpha: vadSettings.calibrationNoiseAlpha ?? 0.7,
        };
    }

    handleAdaptiveVadFrame(timeData) {
        const state = this.adaptiveVadState;
        if (!state || !timeData || timeData.length === 0) {
            return;
        }

        const rms = this.calculateRms(timeData);
        const zcr = this.calculateZeroCrossingRate(timeData);
        const now = Date.now();

        state.history.push({ timestamp: now, rms, zcr, speech: state.speechActive });
        if (state.history.length > state.maxHistoryFrames) {
            state.history.shift();
        }

        // Calibration phase: update noise floor aggressively but don't trigger
        // speech detection yet. This prevents false starts in noisy environments
        // (fan noise, AC, background chatter) before the floor has converged.
        if (state.calibrating) {
            state.calibrationFrames++;
            const alpha = state.calibrationNoiseAlpha;
            state.noiseFloor = Math.max(state.noiseFloor * alpha + rms * (1 - alpha), 5e-5);
            state.noiseZcr = Math.max(state.noiseZcr * alpha + zcr * (1 - alpha), 0.001);
            if (state.calibrationFrames >= state.calibrationFrameTarget) {
                state.calibrating = false;
            }
            return;
        }

        const noiseFloor = Math.max(state.noiseFloor, 1e-5);
        const startThreshold = noiseFloor * state.startFactor;
        const endThreshold = noiseFloor * Math.max(state.endFactor, 0.5);
        const minStartRms = Number(state.minStartRms || 0.008);

        // Use ZCR to distinguish voiced speech from unvoiced noise.
        // Voiced speech (vowels, nasals) has lower ZCR than broadband noise or
        // fricatives. Require the ZCR not to be excessively high relative to the
        // noise baseline for a start-candidate to count as speech. This reduces
        // false triggers from hissing fans, keyboards, or breath noises.
        const noiseZcr = Math.max(state.noiseZcr, 0.001);
        const zcrNotNoise = zcr < noiseZcr * 4.0;
        const startCandidate = rms > Math.max(startThreshold, minStartRms) && zcrNotNoise;
        const endCandidate = rms < endThreshold;

        const isSpeechFrame = state.speechActive || startCandidate;
        this.totalSamples++;
        if (isSpeechFrame) {
            this.hasSoundDetected = true;
            this.soundSamples++;
        }

        if (!state.speechActive) {
            if (startCandidate) {
                state.startCounter++;
            } else {
                state.startCounter = 0;
                this.updateVadNoiseEstimate(rms, zcr, state);
            }
            if (state.startCounter >= state.startFrames) {
                state.speechActive = true;
                state.startCounter = 0;
                this.onVadSpeechStart();
            }
        } else {
            if (endCandidate) {
                state.endCounter++;
            } else {
                state.endCounter = 0;
            }
            if (state.endCounter >= state.endFrames) {
                state.speechActive = false;
                state.endCounter = 0;
                this.updateVadNoiseEstimate(rms, zcr, state);
                this.onVadSpeechEnd();
            }
        }
    }

    calculateRms(timeData) {
        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
            const sample = timeData[i];
            sumSquares += sample * sample;
        }
        return Math.sqrt(sumSquares / Math.max(timeData.length, 1));
    }

    calculateZeroCrossingRate(timeData) {
        if (!timeData || timeData.length <= 1) {
            return 0;
        }
        let zeroCrossings = 0;
        let prevSign = timeData[0] >= 0;
        for (let i = 1; i < timeData.length; i++) {
            const sign = timeData[i] >= 0;
            if (sign !== prevSign) {
                zeroCrossings++;
                prevSign = sign;
            }
        }
        return zeroCrossings / (timeData.length - 1);
    }

    updateVadNoiseEstimate(rms, zcr, state) {
        const alpha = state.noiseAlpha;
        state.noiseFloor = Math.max(state.noiseFloor * alpha + rms * (1 - alpha), 5e-5);
        state.noiseZcr = Math.max(state.noiseZcr * alpha + zcr * (1 - alpha), 0.001);
    }

    onVadSpeechStart() {
        if (this.continuationDecisionActive) {
            this.continuationSpeechDetected = true;
            this.resolveContinuationDecisionWindow();
        }
        this.speechDetected = true;
        this.isInSilence = false;
        this.clearInitialSpeechTimeout();
        this.clearSilenceTimeout();
        this.silenceStart = null;
        const hearingLabel = this.getVoiceLabel('voiceInterface.hearingYou', 'Hearing you...');
        this.updateVoiceStatus(hearingLabel, true);
        this.showVoiceProgressMessage(hearingLabel, { state: 'listening' });
        if (!this.firstSpeechTimestamp) {
            this.firstSpeechTimestamp = Date.now();
        }
    }

    onVadSpeechEnd() {
        if (!this.isRecording) {
            return;
        }
        this.speechDetected = false;
        this.isInSilence = true;
        const listeningLabel = this.getVoiceLabel('voiceInterface.listening', 'Listening...');
        this.updateVoiceStatus(listeningLabel, true);
        this.showVoiceProgressMessage(listeningLabel, { state: 'listening' });
        this.silenceStart = Date.now();
        this.startSilenceTimeout();
    }

    refreshRecognitionMode() {
        this.activeRecognitionMode = this.determineRecognitionMode();
        return this.activeRecognitionMode;
    }

    determineRecognitionMode() {
        const requested = (this.voiceInputSettings?.recognitionMode || 'omnichannel')
            .toString()
            .toLowerCase();
        if (requested === 'native') {
            if (!this.nativeRecognitionFailed && this.isNativeSpeechRecognitionAvailable()) {
                return 'native';
            }
            return 'omnichannel';
        }
        return 'omnichannel';
    }

    isNativeSpeechRecognitionAvailable() {
        return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    initializeNativeRecognition() {
        if (!this.isNativeSpeechRecognitionAvailable()) {
            return null;
        }
        if (this.nativeRecognition) {
            return this.nativeRecognition;
        }
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
            return null;
        }
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = this.voiceInputSettings.voiceLanguage || 'en-US';
        recognition.maxAlternatives = 1;
        recognition.onresult = (event) => this.handleNativeRecognitionResult(event);
        recognition.onerror = (event) => this.handleNativeRecognitionError(event);
        recognition.onend = () => {
            this.nativeRecognitionActive = false;
            this.isRecording = false;
            if (this._nativeRecognitionWatchdog) {
                clearTimeout(this._nativeRecognitionWatchdog);
                this._nativeRecognitionWatchdog = null;
            }
            if (this.nativeRecognitionShouldRestart && this.activeRecognitionMode === 'native') {
                try {
                    recognition.start();
                    this.nativeRecognitionActive = true;
                    this.isRecording = true;
                    // Watchdog: if no onresult/onerror fires within 3s the browser
                    // silently failed to start — reset state and retry from scratch.
                    this._nativeRecognitionWatchdog = setTimeout(() => {
                        this._nativeRecognitionWatchdog = null;
                        if (this.nativeRecognitionActive && !this._nativeRecognitionEventFired) {
                            console.warn('SpeechRecognition silent failure detected, resetting');
                            this.nativeRecognitionActive = false;
                            this.isRecording = false;
                            this.nativeRecognition = null;
                            if (this.nativeRecognitionShouldRestart && this.isVoiceModeActive()) {
                                this.startNativeRecognition();
                            }
                        }
                    }, 3000);
                    this._nativeRecognitionEventFired = false;
                } catch (err) {
                    console.error('SpeechRecognition restart failed:', err);
                    this.nativeRecognitionActive = false;
                    this.isRecording = false;
                    this.nativeRecognitionShouldRestart = false;
                }
            }
        };
        this.nativeRecognition = recognition;
        return recognition;
    }

    startNativeRecognition() {
        this.refreshRecognitionMode();
        if (this.activeRecognitionMode !== 'native') {
            return;
        }
        const recognition = this.initializeNativeRecognition();
        if (!recognition) {
            this.activeRecognitionMode = 'omnichannel';
            this.nativeRecognitionFailed = true;
            this.requestAudioRecording();
            return;
        }
        if (this.nativeRecognitionActive) {
            return;
        }
        this.nativeRecognitionShouldRestart = true;
        this.isRecording = true;
        try {
            recognition.start();
            this.nativeRecognitionActive = true;
            this.logVoiceDebug('native_recognition_started', {
                language: recognition.lang,
            });
            this.setTextboxVoiceActive(true);
            this.addListeningAnimation();
            const listeningLabel = this.getVoiceLabel('voiceInterface.listening', 'Listening...');
            this.updateVoiceStatus(listeningLabel, true);
            this.updateLiveTranscript('');
        } catch (error) {
            console.error('SpeechRecognition start failed:', error);
            this.logVoiceDebug(
                'native_recognition_start_failed',
                {
                    errorName: error && error.name,
                    errorMessage: error && error.message,
                },
                'warn'
            );
            this.nativeRecognitionShouldRestart = false;
            this.nativeRecognitionFailed = true;
            this.nativeRecognitionActive = false;
            this.isRecording = false;
            this.refreshRecognitionMode();
            this.activeRecognitionMode = 'omnichannel';
            this.requestAudioRecording();
        }
    }

    stopNativeRecognition() {
        this.nativeRecognitionShouldRestart = false;
        if (this._nativeRecognitionWatchdog) {
            clearTimeout(this._nativeRecognitionWatchdog);
            this._nativeRecognitionWatchdog = null;
        }
        if (this.nativeRecognition && this.nativeRecognitionActive) {
            try {
                this.nativeRecognition.stop();
            } catch (err) {
                console.error('SpeechRecognition stop failed:', err);
            }
        }
        this.nativeRecognitionActive = false;
        this.isRecording = false;
    }

    handleNativeRecognitionResult(event) {
        this._nativeRecognitionEventFired = true;
        if (!event || !event.results) {
            return;
        }
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0]?.transcript || '';
            if (result.isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        const cleanInterim = interimTranscript.trim();
        if (cleanInterim) {
            this.updateLiveTranscript(cleanInterim);
        }
        const cleanFinal = finalTranscript.trim();
        if (cleanFinal) {
            this.handleVoiceQuery(cleanFinal);
        }
    }

    handleNativeRecognitionError(event) {
        this._nativeRecognitionEventFired = true;
        if (!event) {
            return;
        }
        console.error('SpeechRecognition error:', event.error);
        this.logVoiceDebug(
            'native_recognition_error',
            {
                errorName: event.error || null,
                message: event.message || null,
            },
            'warn'
        );
        this.nativeRecognitionFailed = true;
        this.refreshRecognitionMode();
        this.stopNativeRecognition();
        if (this.activeRecognitionMode !== 'native' && this.isVoiceModeActive()) {
            this.requestAudioRecording();
        }
    }

    stopRecording(forceStop = false, stopReason = 'manual') {
        this.clearInitialSpeechTimeout();
        this.clearSilenceTimeout();
        if (this.activeRecognitionMode === 'native') {
            this.nativeRecognitionShouldRestart = false;
            this.stopNativeRecognition();
            this.cancelNativeSpeech();
            if (this.maxRecordingTimer) {
                clearTimeout(this.maxRecordingTimer);
                this.maxRecordingTimer = null;
            }
            forceStop && this.stopAudio();
            return;
        }
        if (this.mediaRecorder && this.isRecording) {
            this.recordingStopReason = stopReason;
            this.mediaRecorder.stop();
            forceStop && (this.isRecording = false);

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
        this.clearAudioPlaybackWatchdog();
        this.clearAudioPlaybackStartTimeout();
        this.teardownAudioElement(this.audioElement);
        this.stopReplyPlaybackSource();

        if (this.visualizerCleanup) {
            this.visualizerCleanup();
            this.visualizerCleanup = null;
        }

        this.audioElement = null;
    }

    stopVoiceMode() {
        kmVoiceMessageHandler.resetQueuedVoiceMessages();
        this.disableAutoListening();
        this.clearDeferredRecordingHandler();
        this.clearResponseTimeout();
        this.setAwaitingBotResponsePlayback(false);
        this.resetVoicePlaybackQueue('stop_voice_mode');
        this.nativeRecognitionShouldRestart = false;
        this.stopRecording(true);
        this.cancelNativeSpeech();
        this.nativeRecognitionFailed = false;
        this.refreshRecognitionMode();
        this.voiceMuted = false;
        this.clearVoiceStatus();
        this.updateLiveTranscript('');
        this.updateResponseText('');
        this.clearVoiceProgressMessage();
        this.hideInlineStatus();
        this.hideInlineMicButton();
        this.updateMuteButton();
        this.updateChatButtonText();
        this.pendingVoiceSessionSource = null;
        this.setTextboxVoiceActive(false);
        this.setVoiceButtonState('idle');
        this.restoreNativeVoiceOutputAfterVoiceMode();
        kommunicateCommons.show('#mck-voice-web');
        const inlineStatus = document.getElementById('km-voice-listening-status');
        inlineStatus && kommunicateCommons.hide(inlineStatus);
        this.speechDetected = false;
        this.isInSilence = false;
        this.firstSpeechTimestamp = 0;
        this.recordingStopReason = null;
        this.discardNextRecordingPayload = false;
        this.agentOrBotLastMsgPlaybackData = null;
        this.resetPendingVoiceSegments();
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
