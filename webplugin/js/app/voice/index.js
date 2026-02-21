class Voice {
    _VOICE_PLATFORM_API_URL = 'https://api.elevenlabs.io';
    _VOICE_PLATFORM_API_KEY = kommunicate._globals.voiceChatApiKey;
    _OMNICHANNEL_BASE_URL = 'https://omni-channel-test.kommunicate.io';
    _OMNICHANNEL_API_PREFIX = '/voice';
    _OMNICHANNEL_STT_AUDIO_CONFIG = {
        bitsPerSample: 16,
        sampleRate: 16000,
        channelCount: 1,
    };
    _OMNICHANNEL_TTS_DEFAULT_SAMPLE_RATE = 24000;
    _SILENCE_NON_ZERO_RATIO_THRESHOLD = 0.005;
    _SILENCE_PEAK_ABS_THRESHOLD = 8;
    _SILENCE_RMS_THRESHOLD = 2;
    _SILENCE_MAX_ZCR_THRESHOLD = 0.42;
    _SILENCE_HIGH_ZCR_MAX_RMS = 1200;
    _VOICE_SOCKET_TIMEOUT_MS = 30000;
    _voiceSocketClient = null;
    _voiceSocketSubscription = null;
    _voiceSocketRequestSeq = 0;
    _voiceSocketPendingRequests = {};
    _voiceSocketChannelId = null;
    _voiceSocketResponseTopic = null;

    get voiceChatConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceChatSettings) ||
            {}
        );
    }

    get voiceInputConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.voiceInputSettings) ||
            {}
        );
    }

    get voiceId() {
        return this.voiceChatConfig.voiceId || 'pMsXgVXv3BLzUgSXRplE';
    }

    get voiceSettingsPayload() {
        const settings = {};
        const config = this.voiceChatConfig;
        if (config.stability !== undefined) {
            settings.stability = config.stability;
        }
        if (config.similarityBoost !== undefined) {
            settings.similarity_boost = config.similarityBoost;
        }
        if (config.style !== undefined) {
            settings.style = config.style;
        }
        if (config.useSpeakerBoost !== undefined) {
            settings.use_speaker_boost = config.useSpeakerBoost;
        }
        return Object.keys(settings).length ? settings : null;
    }

    get omnichannelConfig() {
        const globalConfig =
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.omnichannelVoice) ||
            {};
        return this.voiceChatConfig.omnichannel || globalConfig;
    }

    getOmnichannelBaseUrl() {
        const config = this.omnichannelConfig || {};
        const pluginSettingsBaseUrl =
            typeof KM_PLUGIN_SETTINGS !== 'undefined' &&
            KM_PLUGIN_SETTINGS &&
            KM_PLUGIN_SETTINGS.omnichannelBaseUrl;
        return (config.baseUrl || pluginSettingsBaseUrl || this._OMNICHANNEL_BASE_URL).replace(
            /\/+$/,
            ''
        );
    }

    getOmnichannelApiUrl(path = '') {
        return `${this.getOmnichannelBaseUrl()}${this._OMNICHANNEL_API_PREFIX}${path}`;
    }

    getOmnichannelHeaders() {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const config = this.omnichannelConfig || {};
        const authHeaderName = config.authHeaderName || 'Authorization';
        const rawAuthToken = config.authToken ?? config.token ?? null;
        if (rawAuthToken !== null && rawAuthToken !== undefined && rawAuthToken !== '') {
            const authToken = String(rawAuthToken).trim();
            if (!authToken) {
                return headers;
            }
            headers[authHeaderName] = authToken.startsWith('Bearer ')
                ? authToken
                : `Bearer ${authToken}`;
        }
        return headers;
    }

    normalizeLanguageCode(languageCode) {
        if (languageCode == null) {
            return '';
        }
        const normalized = String(languageCode).trim().replace(/_/g, '-');
        if (!normalized) {
            return '';
        }
        if (/^en$/i.test(normalized)) {
            return 'en-US';
        }
        return normalized;
    }

    getChatContextLanguageCode() {
        let chatContext = null;
        if (typeof KommunicateUtils !== 'undefined' && KommunicateUtils) {
            chatContext = KommunicateUtils.getSettings('KM_CHAT_CONTEXT');
        }
        chatContext = chatContext && typeof chatContext === 'object' ? chatContext : {};

        const activeGroupId =
            typeof CURRENT_GROUP_DATA !== 'undefined' &&
            CURRENT_GROUP_DATA &&
            CURRENT_GROUP_DATA.tabId;
        if (
            !chatContext.kmUserLanguageCode &&
            activeGroupId &&
            typeof MCK_GROUP_MAP !== 'undefined' &&
            MCK_GROUP_MAP &&
            MCK_GROUP_MAP[activeGroupId] &&
            MCK_GROUP_MAP[activeGroupId].metadata &&
            MCK_GROUP_MAP[activeGroupId].metadata.KM_CHAT_CONTEXT
        ) {
            const groupChatContext = MCK_GROUP_MAP[activeGroupId].metadata.KM_CHAT_CONTEXT;
            let parsedContext = groupChatContext;
            if (typeof groupChatContext === 'string') {
                try {
                    parsedContext = JSON.parse(groupChatContext || '{}');
                } catch (error) {
                    parsedContext = {};
                }
            }
            if (parsedContext && parsedContext.kmUserLanguageCode) {
                return this.normalizeLanguageCode(parsedContext.kmUserLanguageCode);
            }
            if (parsedContext && parsedContext.kmUserLocale) {
                return this.normalizeLanguageCode(parsedContext.kmUserLocale);
            }
        }

        return this.normalizeLanguageCode(
            chatContext.kmUserLanguageCode || chatContext.kmUserLocale || ''
        );
    }

    getVoiceLanguageCode() {
        const languageFromConfig = this.normalizeLanguageCode(
            this.voiceInputConfig.voiceLanguage ||
                this.voiceInputConfig.languageCode ||
                this.voiceChatConfig.languageCode
        );
        const languageFromChatContext = this.getChatContextLanguageCode();
        const languageFromUserLocale = this.normalizeLanguageCode(
            (typeof kommunicate !== 'undefined' &&
                kommunicate._globals &&
                kommunicate._globals.userLocale) ||
                ''
        );
        const languageFromNavigator = this.normalizeLanguageCode(
            (typeof navigator !== 'undefined' && navigator.language) || ''
        );

        return (
            languageFromConfig ||
            languageFromChatContext ||
            languageFromUserLocale ||
            languageFromNavigator ||
            'en-US'
        );
    }

    getOmnichannelSource(source) {
        const sourceValue =
            source || this.omnichannelConfig.source || this.voiceInputConfig.source || 'web';
        return sourceValue === 'call' ? 'call' : 'web';
    }

    getAlternativeLanguageCodes() {
        const fromInputConfig = this.voiceInputConfig.alternativeLanguageCodes;
        const fromChatConfig = this.voiceChatConfig.alternativeLanguageCodes;
        const fromOmnichannelConfig = this.omnichannelConfig.alternativeLanguageCodes;
        const configuredValue = fromInputConfig || fromChatConfig || fromOmnichannelConfig;
        const primaryLanguageCode = this.getVoiceLanguageCode();
        let values = Array.isArray(configuredValue) ? configuredValue : [];
        if (
            !values.length &&
            typeof navigator !== 'undefined' &&
            Array.isArray(navigator.languages)
        ) {
            values = navigator.languages;
        }
        const normalizedPrimaryLanguageCode = this.normalizeLanguageCode(primaryLanguageCode);
        const uniqueCodes = [];
        values.forEach((code) => {
            const normalizedCode = this.normalizeLanguageCode(code);
            if (
                !normalizedCode ||
                normalizedCode === normalizedPrimaryLanguageCode ||
                uniqueCodes.indexOf(normalizedCode) !== -1
            ) {
                return;
            }
            uniqueCodes.push(normalizedCode);
        });
        return uniqueCodes;
    }

    getSpeechLanguageConfig() {
        const languageCode = this.getVoiceLanguageCode();
        const alternativeLanguageCodes = this.getAlternativeLanguageCodes();
        return { languageCode, alternativeLanguageCodes };
    }

    getVoiceToTextSampleRate() {
        const sampleRate =
            this.voiceInputConfig.sampleRate ||
            this.voiceInputConfig.voiceSampleRate ||
            this.omnichannelConfig.sampleRate ||
            this._OMNICHANNEL_STT_AUDIO_CONFIG.sampleRate;
        return Number(sampleRate) || this._OMNICHANNEL_STT_AUDIO_CONFIG.sampleRate;
    }

    getTextToVoiceSampleRate() {
        const sampleRate =
            this.voiceChatConfig.sampleRate ||
            this.voiceChatConfig.ttsSampleRate ||
            this.omnichannelConfig.ttsSampleRate ||
            this.omnichannelConfig.sampleRate ||
            this._OMNICHANNEL_TTS_DEFAULT_SAMPLE_RATE;
        return Number(sampleRate) || this._OMNICHANNEL_TTS_DEFAULT_SAMPLE_RATE;
    }

    getVoiceSocketConfig() {
        const globalSocketConfig =
            (typeof kommunicate !== 'undefined' &&
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.voiceSocket) ||
            {};
        const omnichannelSocketConfig =
            (this.omnichannelConfig && this.omnichannelConfig.socket) || {};
        const voiceInputSocketConfig = this.voiceInputConfig.socket || {};
        const voiceChatSocketConfig = this.voiceChatConfig.socket || {};
        return {
            ...globalSocketConfig,
            ...omnichannelSocketConfig,
            ...voiceInputSocketConfig,
            ...voiceChatSocketConfig,
        };
    }

    getVoiceSocketChannelId(channelId) {
        if (channelId !== undefined && channelId !== null && channelId !== '') {
            return String(channelId);
        }
        if (this._voiceSocketChannelId) {
            return this._voiceSocketChannelId;
        }
        if (typeof MCK_USER_ID !== 'undefined' && MCK_USER_ID) {
            return String(MCK_USER_ID);
        }
        return null;
    }

    resolveVoiceSocketTopic(rawTopic, channelId) {
        if (!rawTopic) {
            return '';
        }
        const topic = String(rawTopic);
        if (topic.indexOf('{id}') !== -1) {
            return topic.replace('{id}', channelId || '');
        }
        if (topic.indexOf('{channelId}') !== -1) {
            return topic.replace('{channelId}', channelId || '');
        }
        return topic;
    }

    getVoiceSocketResponseTopic(socketConfig, channelId) {
        return this.resolveVoiceSocketTopic(
            socketConfig.responseTopicTemplate || socketConfig.responseTopic,
            channelId
        );
    }

    getVoiceSocketRequestTopic(socketConfig, channelId) {
        return this.resolveVoiceSocketTopic(
            socketConfig.requestTopicTemplate || socketConfig.requestTopic,
            channelId
        );
    }

    resolveVoiceSocketClient(socketConfig) {
        if (
            socketConfig.client &&
            typeof socketConfig.client.publish === 'function' &&
            typeof socketConfig.client.subscribe === 'function'
        ) {
            return socketConfig.client;
        }

        const stompClient =
            typeof window !== 'undefined' &&
            window.Applozic &&
            window.Applozic.ALSocket &&
            window.Applozic.ALSocket.stompClient;
        if (
            stompClient &&
            typeof stompClient.send === 'function' &&
            typeof stompClient.subscribe === 'function'
        ) {
            return {
                publish(topic, payload, headers = {}) {
                    stompClient.send(topic, headers, JSON.stringify(payload));
                },
                subscribe(topic, handler) {
                    return stompClient.subscribe(topic, function (frame) {
                        handler(frame && frame.body ? frame.body : frame);
                    });
                },
                unsubscribe(subscription) {
                    if (subscription && typeof subscription.unsubscribe === 'function') {
                        subscription.unsubscribe();
                    }
                },
            };
        }
        return null;
    }

    isVoiceSocketEnabled(socketConfig = this.getVoiceSocketConfig()) {
        if (!socketConfig || !socketConfig.enabled) {
            return false;
        }
        const channelId = this.getVoiceSocketChannelId();
        const requestTopic = this.getVoiceSocketRequestTopic(socketConfig, channelId);
        const responseTopic = this.getVoiceSocketResponseTopic(socketConfig, channelId);
        if (!requestTopic || !responseTopic) {
            return false;
        }
        return Boolean(this.resolveVoiceSocketClient(socketConfig));
    }

    clearVoiceSocketPendingRequests(reason) {
        const pendingRequestIds = Object.keys(this._voiceSocketPendingRequests);
        for (let i = 0; i < pendingRequestIds.length; i++) {
            const requestId = pendingRequestIds[i];
            const pending = this._voiceSocketPendingRequests[requestId];
            if (!pending) {
                continue;
            }
            clearTimeout(pending.timeoutId);
            pending.reject(
                new Error(reason || 'Voice socket subscription was reset before receiving response')
            );
            delete this._voiceSocketPendingRequests[requestId];
        }
    }

    unsubscribeVoiceSocketTopic() {
        if (this._voiceSocketClient && this._voiceSocketSubscription) {
            try {
                this._voiceSocketClient.unsubscribe(this._voiceSocketSubscription);
            } catch (error) {}
        }
        this._voiceSocketSubscription = null;
        this._voiceSocketResponseTopic = null;
        this.clearVoiceSocketPendingRequests('Voice socket topic unsubscribed');
    }

    subscribeToVoiceSocketTopic(channelId) {
        const socketConfig = this.getVoiceSocketConfig();
        if (!this.isVoiceSocketEnabled(socketConfig)) {
            return false;
        }
        const resolvedChannelId = this.getVoiceSocketChannelId(channelId);
        const responseTopic = this.getVoiceSocketResponseTopic(socketConfig, resolvedChannelId);
        if (!responseTopic) {
            return false;
        }
        if (
            this._voiceSocketSubscription &&
            this._voiceSocketResponseTopic &&
            this._voiceSocketResponseTopic === responseTopic
        ) {
            this._voiceSocketChannelId = resolvedChannelId;
            return true;
        }

        this.unsubscribeVoiceSocketTopic();

        const client = this.resolveVoiceSocketClient(socketConfig);
        if (!client) {
            throw new Error('Voice socket client is not available');
        }
        this._voiceSocketClient = client;
        this._voiceSocketSubscription = client.subscribe(
            responseTopic,
            this.onVoiceSocketMessage.bind(this)
        );
        this._voiceSocketResponseTopic = responseTopic;
        this._voiceSocketChannelId = resolvedChannelId;
        return true;
    }

    ensureVoiceSocketSubscription(channelId) {
        const resolvedChannelId = this.getVoiceSocketChannelId(channelId);
        this.subscribeToVoiceSocketTopic(resolvedChannelId);
    }

    createVoiceSocketRequestId() {
        this._voiceSocketRequestSeq = this._voiceSocketRequestSeq + 1;
        return `km-voice-${Date.now()}-${this._voiceSocketRequestSeq}`;
    }

    parseVoiceSocketMessage(rawMessage) {
        if (!rawMessage) {
            return null;
        }
        if (typeof rawMessage === 'object') {
            return rawMessage;
        }
        try {
            return JSON.parse(rawMessage);
        } catch (error) {
            return null;
        }
    }

    onVoiceSocketMessage(rawMessage) {
        const message = this.parseVoiceSocketMessage(rawMessage);
        if (!message || typeof message !== 'object') {
            return;
        }
        const requestId = message.requestId || message.correlationId || message.id;
        if (!requestId) {
            return;
        }
        const pending = this._voiceSocketPendingRequests[requestId];
        if (!pending) {
            return;
        }
        clearTimeout(pending.timeoutId);
        delete this._voiceSocketPendingRequests[requestId];

        const isError = message.error || message.status === 'error';
        if (isError) {
            const errorMessage =
                (message.error && (message.error.message || message.error)) ||
                message.message ||
                'Voice socket request failed';
            pending.reject(new Error(String(errorMessage)));
            return;
        }

        const payload =
            message.payload !== undefined
                ? message.payload
                : message.data !== undefined
                ? message.data
                : message;
        pending.resolve(payload);
    }

    async requestVoiceSocket(action, payload, options = {}) {
        const socketConfig = this.getVoiceSocketConfig();
        if (!this.isVoiceSocketEnabled(socketConfig)) {
            throw new Error('Voice socket transport is not enabled');
        }
        const channelId = this.getVoiceSocketChannelId(options.channelId);
        this.ensureVoiceSocketSubscription(channelId);

        const requestId = this.createVoiceSocketRequestId();
        const timeoutMs = Number(
            options.timeoutMs || socketConfig.timeoutMs || this._VOICE_SOCKET_TIMEOUT_MS
        );
        const requestTopic = this.getVoiceSocketRequestTopic(socketConfig, channelId);
        if (!requestTopic) {
            throw new Error('Voice socket request topic is missing');
        }
        const requestEnvelope = {
            action,
            requestId,
            timestamp: Date.now(),
            payload,
            context: {
                conversationId:
                    typeof CURRENT_GROUP_DATA !== 'undefined' && CURRENT_GROUP_DATA
                        ? CURRENT_GROUP_DATA.tabId || null
                        : null,
            },
        };

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                delete this._voiceSocketPendingRequests[requestId];
                reject(new Error(`Voice socket request timed out for action ${action}`));
            }, timeoutMs);

            this._voiceSocketPendingRequests[requestId] = {
                resolve,
                reject,
                timeoutId,
            };

            try {
                this._voiceSocketClient.publish(
                    requestTopic,
                    requestEnvelope,
                    socketConfig.publishHeaders || {}
                );
            } catch (error) {
                clearTimeout(timeoutId);
                delete this._voiceSocketPendingRequests[requestId];
                reject(error);
            }
        });
    }

    normalizeTextToVoiceSocketPayload(socketPayload) {
        if (socketPayload && Array.isArray(socketPayload.frames)) {
            return socketPayload;
        }
        if (
            socketPayload &&
            socketPayload.textToVoice &&
            Array.isArray(socketPayload.textToVoice.frames)
        ) {
            return socketPayload.textToVoice;
        }
        return socketPayload;
    }

    normalizeVoiceToTextSocketPayload(socketPayload) {
        if (socketPayload && typeof socketPayload.text === 'string') {
            return socketPayload;
        }
        if (
            socketPayload &&
            socketPayload.voiceToText &&
            typeof socketPayload.voiceToText.text === 'string'
        ) {
            return socketPayload.voiceToText;
        }
        return socketPayload;
    }

    textToSpeechStream(text = '') {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/text-to-speech/${this.voiceId}/stream`;
        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
        };
        const payload = { text };
        const config = this.voiceChatConfig;
        if (config.speed !== undefined) {
            payload.speed = config.speed;
        }
        if (config.model) {
            payload.model = config.model;
        }
        const voiceSettings = this.voiceSettingsPayload;
        if (voiceSettings) {
            payload.voice_settings = voiceSettings;
        }

        return fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response;
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    textToVoice(text = '') {
        const payload = {
            text,
            source: this.getOmnichannelSource(this.voiceChatConfig.source),
            // languageCode: this.getVoiceLanguageCode(),
            sampleRate: this.getTextToVoiceSampleRate(),
        };
        const config = this.voiceChatConfig || {};
        if (config.ssmlGender) {
            payload.ssmlGender = config.ssmlGender;
        }
        if (config.voiceName) {
            payload.voiceName = config.voiceName;
        }
        if (Array.isArray(config.effectsProfileId) && config.effectsProfileId.length) {
            payload.effectsProfileId = config.effectsProfileId;
        }

        const socketConfig = this.getVoiceSocketConfig();
        if (this.isVoiceSocketEnabled(socketConfig)) {
            return this.requestVoiceSocket(
                socketConfig.textToVoiceAction || 'text_to_voice',
                payload
            )
                .then((data) => this.normalizeTextToVoiceSocketPayload(data))
                .catch((error) => {
                    console.error('There was a problem with the voice socket operation:', error);
                    throw error;
                });
        }

        return fetch(this.getOmnichannelApiUrl('/text-to-voice'), {
            method: 'POST',
            headers: this.getOmnichannelHeaders(),
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    speechToText(audioBlob) {
        const apiUrl = `${this._VOICE_PLATFORM_API_URL}/v1/speech-to-text`;

        const headers = {
            'xi-api-key': `${this._VOICE_PLATFORM_API_KEY}`,
        };

        const formdata = new FormData();
        formdata.append('model_id', 'scribe_v1');
        formdata.append('file', audioBlob, 'file');
        formdata.append('tag_audio_events', false);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: headers,
        };

        console.debug('Voice STT request send (elevenlabs)', {
            ts: Date.now(),
            iso: new Date().toISOString(),
            url: apiUrl,
            provider: 'elevenlabs',
        });

        return fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    async voiceToText(audioBlob, { ucid, sttMode } = {}) {
        const sampleRate = this.getVoiceToTextSampleRate();
        const samples = await this.extractPcmInt16Samples(audioBlob);
        const audioMetrics = this.evaluatePcmInt16Quality(samples);
        if (audioMetrics.isSilent) {
            const silentAudioError = this.createSilentAudioError(audioMetrics);
            throw silentAudioError;
        }
        const payload = {
            samples,
            bitsPerSample: this._OMNICHANNEL_STT_AUDIO_CONFIG.bitsPerSample,
            sampleRate,
            channelCount: this._OMNICHANNEL_STT_AUDIO_CONFIG.channelCount,
            source: this.getOmnichannelSource(this.voiceInputConfig.source),
            sttMode: sttMode || 'recognize',
            // languageCode: this.getVoiceLanguageCode(),
        };
        // const alternativeLanguageCodes = this.getAlternativeLanguageCodes();
        // if (alternativeLanguageCodes.length) {
        //     payload.alternativeLanguageCodes = alternativeLanguageCodes;
        // }
        const activeConversationUcid =
            typeof CURRENT_GROUP_DATA !== 'undefined' &&
            CURRENT_GROUP_DATA &&
            CURRENT_GROUP_DATA.tabId;
        const resolvedUcid =
            ucid ||
            this.voiceInputConfig.ucid ||
            this.omnichannelConfig.ucid ||
            activeConversationUcid;
        if (resolvedUcid !== undefined && resolvedUcid !== null && resolvedUcid !== '') {
            payload.ucid = String(resolvedUcid);
        }

        const socketConfig = this.getVoiceSocketConfig();
        if (this.isVoiceSocketEnabled(socketConfig)) {
            console.debug('Voice STT request send (socket)', {
                ts: Date.now(),
                iso: new Date().toISOString(),
                provider: 'omnichannel',
                transport: 'socket',
                action: socketConfig.voiceToTextAction || 'voice_to_text',
                sttMode: payload.sttMode,
                sampleRate: payload.sampleRate,
                sampleCount: Array.isArray(payload.samples) ? payload.samples.length : 0,
            });
            return this.requestVoiceSocket(
                socketConfig.voiceToTextAction || 'voice_to_text',
                payload
            )
                .then((data) => this.normalizeVoiceToTextSocketPayload(data))
                .catch((error) => {
                    if (error && error.code === 'SILENT_AUDIO') {
                        console.warn('Silent audio blocked before voice-to-text socket request', {
                            sampleCount: error.sampleCount,
                            nonZeroRatio: error.nonZeroRatio,
                            rms: error.rms,
                            peakAbs: error.peakAbs,
                        });
                    } else {
                        console.error(
                            'There was a problem with the voice socket operation:',
                            error
                        );
                    }
                    throw error;
                });
        }

        const voiceToTextUrl = this.getOmnichannelApiUrl('/voice-to-text');
        console.debug('Voice STT request send (http)', {
            ts: Date.now(),
            iso: new Date().toISOString(),
            provider: 'omnichannel',
            transport: 'http',
            url: voiceToTextUrl,
            sttMode: payload.sttMode,
            sampleRate: payload.sampleRate,
            sampleCount: Array.isArray(payload.samples) ? payload.samples.length : 0,
        });

        return fetch(voiceToTextUrl, {
            method: 'POST',
            headers: this.getOmnichannelHeaders(),
            body: JSON.stringify(payload),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw await this.buildHttpError(response, 'voice-to-text');
                }
                return response.json();
            })
            .catch((error) => {
                if (error && error.code === 'SILENT_AUDIO') {
                    console.warn('Silent audio blocked before voice-to-text API call', {
                        sampleCount: error.sampleCount,
                        nonZeroRatio: error.nonZeroRatio,
                        rms: error.rms,
                        peakAbs: error.peakAbs,
                    });
                } else {
                    console.error('There was a problem with the fetch operation:', error);
                }
                throw error;
            });
    }

    evaluatePcmInt16Quality(samples = []) {
        const sampleCount = Array.isArray(samples) ? samples.length : 0;
        if (!sampleCount) {
            return {
                isSilent: true,
                sampleCount: 0,
                nonZeroRatio: 0,
                rms: 0,
                peakAbs: 0,
                zcr: 0,
            };
        }
        let nonZeroCount = 0;
        let sumSquares = 0;
        let peakAbs = 0;
        let zeroCrossings = 0;
        let previousSign = null;
        for (let i = 0; i < sampleCount; i++) {
            const value = Number(samples[i]) || 0;
            const absValue = Math.abs(value);
            if (value !== 0) {
                nonZeroCount++;
            }
            if (absValue > peakAbs) {
                peakAbs = absValue;
            }
            sumSquares += value * value;
            const currentSign = value >= 0;
            if (previousSign !== null && currentSign !== previousSign) {
                zeroCrossings++;
            }
            previousSign = currentSign;
        }
        const nonZeroRatio = nonZeroCount / sampleCount;
        const rms = Math.sqrt(sumSquares / sampleCount);
        const zcr = sampleCount > 1 ? zeroCrossings / (sampleCount - 1) : 0;
        const isHighFrequencyNoise =
            zcr > this._SILENCE_MAX_ZCR_THRESHOLD && rms < this._SILENCE_HIGH_ZCR_MAX_RMS;
        const isSilent =
            nonZeroRatio < this._SILENCE_NON_ZERO_RATIO_THRESHOLD ||
            (peakAbs <= this._SILENCE_PEAK_ABS_THRESHOLD && rms <= this._SILENCE_RMS_THRESHOLD) ||
            isHighFrequencyNoise;
        return {
            isSilent,
            sampleCount,
            nonZeroRatio: Number(nonZeroRatio.toFixed(6)),
            rms: Number(rms.toFixed(3)),
            peakAbs,
            zcr: Number(zcr.toFixed(6)),
        };
    }

    createSilentAudioError(metrics) {
        const error = new Error('Silent audio detected. Skipping voice-to-text request.');
        error.code = 'SILENT_AUDIO';
        error.sampleCount = metrics.sampleCount;
        error.nonZeroRatio = metrics.nonZeroRatio;
        error.rms = metrics.rms;
        error.peakAbs = metrics.peakAbs;
        error.zcr = metrics.zcr;
        return error;
    }

    async buildHttpError(response, operation) {
        const status = response && typeof response.status === 'number' ? response.status : 0;
        let details = '';
        try {
            details = await response.text();
        } catch (err) {}
        const message = details
            ? `${operation} failed with status ${status}: ${details}`
            : `${operation} failed with status ${status}`;
        const error = new Error(message);
        error.status = status;
        error.responseBody = details;
        return error;
    }

    async extractPcmInt16Samples(audioBlob) {
        const targetSampleRate = this.getVoiceToTextSampleRate();
        const audioBuffer = await this.decodeAudioBlob(audioBlob);
        const mono = this.getMonoChannelData(audioBuffer);
        const downsampled = this.resampleToTargetRate(
            mono,
            audioBuffer.sampleRate,
            targetSampleRate
        );
        const int16Samples = this.float32ToInt16(downsampled);
        return Array.from(int16Samples);
    }

    async decodeAudioBlob(audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            throw new Error('AudioContext is not supported');
        }
        const audioContext = new AudioContextClass();
        try {
            return await audioContext.decodeAudioData(arrayBuffer.slice(0));
        } finally {
            if (typeof audioContext.close === 'function') {
                audioContext.close().catch(() => {});
            }
        }
    }

    getMonoChannelData(audioBuffer) {
        const channelCount = audioBuffer.numberOfChannels || 1;
        if (channelCount === 1) {
            return audioBuffer.getChannelData(0);
        }
        const frameCount = audioBuffer.length;
        const mono = new Float32Array(frameCount);
        for (let channel = 0; channel < channelCount; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                mono[i] += channelData[i] / channelCount;
            }
        }
        return mono;
    }

    resampleToTargetRate(input, sourceRate, targetRate) {
        if (!input || !input.length || sourceRate === targetRate) {
            return input || new Float32Array(0);
        }
        const ratio = sourceRate / targetRate;
        const targetLength = Math.max(1, Math.round(input.length / ratio));
        const output = new Float32Array(targetLength);
        for (let i = 0; i < targetLength; i++) {
            const sourceIndex = i * ratio;
            const lower = Math.floor(sourceIndex);
            const upper = Math.min(lower + 1, input.length - 1);
            const weight = sourceIndex - lower;
            output[i] = input[lower] * (1 - weight) + input[upper] * weight;
        }
        return output;
    }

    float32ToInt16(floatData) {
        const buffer = new Int16Array(floatData.length);
        for (let i = 0; i < floatData.length; i++) {
            const sample = Math.max(-1, Math.min(1, floatData[i]));
            buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }
        return buffer;
    }

    createWavBlobFromOmnichannelFrames(payload = {}) {
        const frames = Array.isArray(payload.frames) ? payload.frames : [];
        const flattened = [];
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            if (!Array.isArray(frame)) {
                continue;
            }
            for (let j = 0; j < frame.length; j++) {
                flattened.push(frame[j]);
            }
        }
        const pcmData = Int16Array.from(flattened);
        return this.createWavBlobFromPcmData(
            pcmData,
            payload.sampleRate || this.getTextToVoiceSampleRate(),
            payload.channelCount || this._OMNICHANNEL_STT_AUDIO_CONFIG.channelCount,
            payload.bitsPerSample || this._OMNICHANNEL_STT_AUDIO_CONFIG.bitsPerSample
        );
    }

    createWavBlobFromPcmData(pcmData, sampleRate, channelCount, bitsPerSample) {
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = channelCount * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = pcmData.length * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        this.writeAscii(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        this.writeAscii(view, 8, 'WAVE');
        this.writeAscii(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, channelCount, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        this.writeAscii(view, 36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < pcmData.length; i++, offset += 2) {
            view.setInt16(offset, pcmData[i], true);
        }
        return new Blob([view], { type: 'audio/wav' });
    }

    writeAscii(view, offset, value) {
        for (let i = 0; i < value.length; i++) {
            view.setUint8(offset + i, value.charCodeAt(i));
        }
    }
}

const kmVoice = new Voice();
