class Voice {
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
    _DEFAULT_VOICE_SESSION_KEY = '__default_voice_session__';
    _voiceSocketClient = null;
    _voiceSocketSubscription = null;
    _voiceSocketRequestSeq = 0;
    _voiceSocketPendingRequests = {};
    _voiceSocketChannelId = null;
    _voiceSocketResponseTopic = null;
    _voiceLanguageStateBySessionKey = {};

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

    getOmnichannelHeaders(options = {}) {
        const headers = {};
        const hasCustomAccept = Object.prototype.hasOwnProperty.call(options, 'accept');
        const hasCustomContentType = Object.prototype.hasOwnProperty.call(options, 'contentType');
        const acceptHeader = hasCustomAccept ? options.accept : 'application/json';
        const contentTypeHeader = hasCustomContentType ? options.contentType : 'application/json';
        if (acceptHeader) {
            headers.Accept = acceptHeader;
        }
        if (contentTypeHeader) {
            headers['Content-Type'] = contentTypeHeader;
        }
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

    isMimeType(contentType, expectedType) {
        const normalizedContentType = String(contentType || '')
            .split(';')[0]
            .trim()
            .toLowerCase();
        return (
            normalizedContentType ===
            String(expectedType || '')
                .trim()
                .toLowerCase()
        );
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

    getActiveConversationId() {
        return (
            typeof CURRENT_GROUP_DATA !== 'undefined' &&
            CURRENT_GROUP_DATA &&
            CURRENT_GROUP_DATA.tabId
        );
    }

    getAgentDefaultLanguageCode() {
        return this.normalizeLanguageCode(this.voiceInputConfig.languageCode) || 'en-US';
    }

    getBrowserLanguageCode() {
        return this.normalizeLanguageCode(
            (typeof navigator !== 'undefined' && navigator.language) || ''
        );
    }

    getBotDetailsLanguageCode(groupId) {
        const activeConversationId = this.getActiveConversationId();
        if (!groupId || !activeConversationId || String(groupId) !== String(activeConversationId)) {
            return '';
        }
        return this.normalizeLanguageCode(
            (typeof CURRENT_GROUP_DATA !== 'undefined' &&
                CURRENT_GROUP_DATA &&
                CURRENT_GROUP_DATA.BOT_DETAILS_LANGUAGE_CODE) ||
                ''
        );
    }

    getVoiceLanguageSessionKey(groupId) {
        if (groupId !== undefined && groupId !== null && groupId !== '') {
            return String(groupId);
        }
        return this._DEFAULT_VOICE_SESSION_KEY;
    }

    resolveVoiceSessionUcid(ucid) {
        return (
            ucid ||
            this.voiceInputConfig.ucid ||
            this.omnichannelConfig.ucid ||
            this.getActiveConversationId()
        );
    }

    getVoiceLanguageState(groupId) {
        const sessionKey = this.getVoiceLanguageSessionKey(groupId);
        if (!this._voiceLanguageStateBySessionKey[sessionKey]) {
            this._voiceLanguageStateBySessionKey[sessionKey] = {
                // First STT request should omit languageCode and rely on backend detection.
                languageCode: '',
                hasDetectedLanguageCode: false,
            };
        }
        return {
            sessionKey,
            state: this._voiceLanguageStateBySessionKey[sessionKey],
        };
    }

    getGroupChatContext(groupId) {
        if (!groupId || typeof MCK_GROUP_MAP === 'undefined' || !MCK_GROUP_MAP) {
            return {};
        }
        const groupData = MCK_GROUP_MAP[groupId];
        if (!groupData || !groupData.metadata) {
            return {};
        }
        const groupChatContext = groupData.metadata.KM_CHAT_CONTEXT;
        return KommunicateUtils.parseChatContext(groupChatContext);
    }

    getLanguageCodeFromChatContext(chatContext, options = {}) {
        const context = chatContext && typeof chatContext === 'object' ? chatContext : {};
        const normalizedUserLanguage = this.normalizeLanguageCode(context.kmUserLanguageCode || '');
        if (normalizedUserLanguage) {
            return normalizedUserLanguage;
        }
        if (options.includeLocaleFallback) {
            return this.normalizeLanguageCode(context.kmUserLocale || '');
        }
        return '';
    }

    getSessionVoiceLanguageCode(state) {
        if (!state || !state.hasDetectedLanguageCode) {
            return '';
        }
        return this.normalizeLanguageCode(state.languageCode || '');
    }

    setSessionVoiceLanguageCode(state, languageCode) {
        const normalizedLanguage = this.normalizeLanguageCode(languageCode);
        if (!state || !normalizedLanguage) {
            return false;
        }
        if (state.hasDetectedLanguageCode && state.languageCode === normalizedLanguage) {
            return false;
        }
        state.languageCode = normalizedLanguage;
        state.hasDetectedLanguageCode = true;
        return true;
    }

    getFirstSttAlternativeLanguageCodes(primaryLanguageCode, groupId) {
        const alternatives = [];
        const addAlternative = (code) => {
            const normalizedCode = this.normalizeLanguageCode(code);
            if (
                !normalizedCode ||
                normalizedCode === primaryLanguageCode ||
                alternatives.indexOf(normalizedCode) !== -1
            ) {
                return;
            }
            alternatives.push(normalizedCode);
        };
        addAlternative(this.getBrowserLanguageCode());
        addAlternative(this.getAgentDefaultLanguageCode());
        addAlternative(this.getBotDetailsLanguageCode(groupId));
        const configuredAlternatives = this.getAlternativeLanguageCodes();
        for (let i = 0; i < configuredAlternatives.length; i++) {
            addAlternative(configuredAlternatives[i]);
        }
        return alternatives;
    }

    syncVoiceLanguageWithChatContext(languageCode) {
        const normalizedLanguage = this.normalizeLanguageCode(languageCode);
        if (normalizedLanguage) {
            Kommunicate.updateUserLanguage(normalizedLanguage);
        }
    }

    async persistVoiceLanguageForGroup(groupId, languageCode) {
        const normalizedLanguage = this.normalizeLanguageCode(languageCode);
        if (!groupId || !normalizedLanguage) {
            return;
        }
        const currentGroupChatContext = this.getGroupChatContext(groupId);
        const updatedGroupChatContext = {
            ...currentGroupChatContext,
            kmUserLanguageCode: normalizedLanguage,
        };
        try {
            const updateResponse = Kommunicate.updateConversationMetadata({
                groupId,
                metadata: {
                    KM_CHAT_CONTEXT: updatedGroupChatContext,
                },
            });
            if (updateResponse && typeof updateResponse.then === 'function') {
                await updateResponse;
            }
            if (typeof MCK_GROUP_MAP !== 'undefined' && MCK_GROUP_MAP && MCK_GROUP_MAP[groupId]) {
                MCK_GROUP_MAP[groupId].metadata = MCK_GROUP_MAP[groupId].metadata || {};
                MCK_GROUP_MAP[groupId].metadata.KM_CHAT_CONTEXT = updatedGroupChatContext;
            }
        } catch (error) {
            console.warn('Voice language metadata persist failed', {
                groupId,
                languageCode: normalizedLanguage,
                message: error && error.message ? error.message : '',
            });
        }
    }

    getChatContextLanguageCode() {
        let chatContext = null;
        chatContext = KommunicateUtils.getSettings('KM_CHAT_CONTEXT');
        const settingsLanguageCode = this.getLanguageCodeFromChatContext(chatContext, {
            includeLocaleFallback: true,
        });
        if (settingsLanguageCode) {
            return settingsLanguageCode;
        }
        return this.getLanguageCodeFromChatContext(
            this.getGroupChatContext(this.getActiveConversationId()),
            {
                includeLocaleFallback: true,
            }
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
        const primaryParts = normalizedPrimaryLanguageCode.split('-');
        const primaryRegion = primaryParts.length > 1 ? String(primaryParts[1]).toUpperCase() : '';
        const primaryLanguage = (primaryParts[0] || '').toLowerCase();
        const userLocale = this.normalizeLanguageCode(
            (typeof kommunicate !== 'undefined' &&
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.userLocale) ||
                ''
        );
        const navigatorLocale = this.normalizeLanguageCode(
            (typeof navigator !== 'undefined' && navigator.language) || ''
        );
        const localeSignals = [normalizedPrimaryLanguageCode, userLocale, navigatorLocale];
        const isIndiaLocale = localeSignals.some((localeCode) => /-IN$/i.test(localeCode));
        if (isIndiaLocale || primaryRegion === 'IN' || primaryLanguage === 'hi') {
            values = values.concat(['en-IN', 'hi-IN']);
        }
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

    getRawVoiceSocketConfig() {
        return (
            (typeof kommunicate !== 'undefined' &&
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.voiceSocket) ||
            {}
        );
    }

    mergeVoiceSocketConfig(baseConfig = {}, overrideConfig = {}) {
        const mergedConfig = Object.assign({}, baseConfig, overrideConfig);
        delete mergedConfig.tts;
        delete mergedConfig.stt;
        delete mergedConfig.sst;
        return mergedConfig;
    }

    getVoiceSocketConfig(mode = 'tts') {
        const rawConfig = this.getRawVoiceSocketConfig();
        if (!rawConfig || typeof rawConfig !== 'object') {
            return {};
        }
        if (mode === 'stt' || mode === 'sst') {
            const nestedSttConfig = rawConfig.stt || rawConfig.sst;
            if (!nestedSttConfig || typeof nestedSttConfig !== 'object') {
                return { enabled: false };
            }
            return this.mergeVoiceSocketConfig(rawConfig, nestedSttConfig);
        }
        const nestedTtsConfig = rawConfig.tts;
        if (nestedTtsConfig && typeof nestedTtsConfig === 'object') {
            return this.mergeVoiceSocketConfig(rawConfig, nestedTtsConfig);
        }
        return rawConfig;
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

    subscribeToVoiceSocketTopic(channelId, socketConfigOverride) {
        const socketConfig = socketConfigOverride || this.getVoiceSocketConfig('tts');
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

    ensureVoiceSocketSubscription(channelId, socketConfigOverride) {
        const resolvedChannelId = this.getVoiceSocketChannelId(channelId);
        this.subscribeToVoiceSocketTopic(resolvedChannelId, socketConfigOverride);
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
        const socketConfig = options.socketConfig || this.getVoiceSocketConfig('tts');
        if (!this.isVoiceSocketEnabled(socketConfig)) {
            throw new Error('Voice socket transport is not enabled');
        }
        const channelId = this.getVoiceSocketChannelId(options.channelId);
        this.ensureVoiceSocketSubscription(channelId, socketConfig);

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

    handleOmnichannelVoiceError(error, { transport, silentMessage, defaultMessage }) {
        if (error && error.code === 'SILENT_AUDIO') {
            console.warn(silentMessage || 'Silent audio blocked before voice request', {
                sampleCount: error.sampleCount,
                nonZeroRatio: error.nonZeroRatio,
                rms: error.rms,
                peakAbs: error.peakAbs,
            });
            return;
        }
        const message =
            transport === 'socket'
                ? defaultMessage || 'There was a problem with the voice socket operation:'
                : defaultMessage || 'There was a problem with the fetch operation:';
        console.error(message, error);
    }

    async requestOmnichannelVoiceTransport({
        payload,
        socketAction,
        socketConfig,
        socketNormalizePayload,
        httpPath,
        httpErrorOperation,
        operation,
        enableSilentAudioLogging = false,
        preferSocket = true,
    }) {
        const resolvedSocketConfig = socketConfig || this.getVoiceSocketConfig('tts');
        const sampleCount = Array.isArray(payload && payload.samples)
            ? payload.samples.length
            : null;
        if (preferSocket && this.isVoiceSocketEnabled(resolvedSocketConfig)) {
            try {
                const data = await this.requestVoiceSocket(socketAction, payload, {
                    socketConfig: resolvedSocketConfig,
                });
                return socketNormalizePayload ? socketNormalizePayload.call(this, data) : data;
            } catch (error) {
                this.handleOmnichannelVoiceError(error, {
                    transport: 'socket',
                    silentMessage: 'Silent audio blocked before voice-to-text socket request',
                });
                throw error;
            }
        }

        const httpUrl = this.getOmnichannelApiUrl(httpPath);
        try {
            const response = await fetch(httpUrl, {
                method: 'POST',
                headers: this.getOmnichannelHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                if (httpErrorOperation) {
                    throw await this.buildHttpError(response, httpErrorOperation);
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        } catch (error) {
            this.handleOmnichannelVoiceError(error, {
                transport: 'http',
                silentMessage: enableSilentAudioLogging
                    ? 'Silent audio blocked before voice-to-text API call'
                    : undefined,
            });
            throw error;
        }
    }

    async requestBinaryTextToVoice(payload) {
        const httpUrl = this.getOmnichannelApiUrl('/text-to-voice');
        try {
            const response = await fetch(httpUrl, {
                method: 'POST',
                headers: this.getOmnichannelHeaders({
                    accept: 'audio/mpeg, application/json;q=0.9, */*;q=0.8',
                }),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw await this.buildHttpError(response, 'text-to-voice');
            }

            const contentType = response.headers.get('Content-Type') || '';
            if (!this.isMimeType(contentType, 'audio/mpeg')) {
                throw new Error(
                    `text-to-voice failed to return audio/mpeg. Received ${
                        contentType || 'unknown content type'
                    }`
                );
            }

            const audioBytes = await response.arrayBuffer();
            if (!audioBytes || !audioBytes.byteLength) {
                throw new Error('text-to-voice returned an empty audio response');
            }

            return new Blob([audioBytes], { type: 'audio/mpeg' });
        } catch (error) {
            this.handleOmnichannelVoiceError(error, {
                transport: 'http',
                defaultMessage: 'There was a problem with the text-to-voice fetch operation:',
            });
            throw error;
        }
    }

    createPlaybackBlobFromTextToVoiceResponse(responsePayload) {
        if (responsePayload instanceof Blob) {
            return responsePayload;
        }
        const normalizedPayload = this.normalizeTextToVoiceSocketPayload(responsePayload);
        if (normalizedPayload && Array.isArray(normalizedPayload.frames)) {
            return this.createWavBlobFromOmnichannelFrames(normalizedPayload);
        }
        throw new Error('Omnichannel TTS failed to return playable audio');
    }

    async textToVoice(text = '') {
        const activeConversationId = this.getActiveConversationId();
        const { state } = this.getVoiceLanguageState(activeConversationId);
        const languageCode = this.getSessionVoiceLanguageCode(state);
        const payload = {
            text,
            source: 'web',
            responseFormat: 'binary',
            sampleRate: this.getTextToVoiceSampleRate(),
        };
        if (languageCode) {
            payload.languageCode = languageCode;
        }
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
        return this.requestBinaryTextToVoice(payload);
    }

    normalizePcmInt16Samples(input) {
        if (input instanceof Int16Array) {
            return input;
        }
        if (Array.isArray(input)) {
            return Int16Array.from(input);
        }
        return null;
    }

    async resolveVoiceToTextSamples(audioInput, sampleRate) {
        const normalizedPcmSamples = this.normalizePcmInt16Samples(audioInput);
        if (normalizedPcmSamples) {
            return normalizedPcmSamples;
        }
        const extractedSamples = await this.extractPcmInt16Samples(audioInput, sampleRate);
        return Int16Array.from(extractedSamples);
    }

    getBinaryVoiceToTextHeaders({
        sampleRate,
        channelCount,
        bitsPerSample,
        ucid,
        languageCode,
        alternativeLanguageCodes,
        sttMode,
    }) {
        const headers = this.getOmnichannelHeaders({
            accept: 'application/json',
            contentType: 'application/octet-stream',
        });
        headers['X-Audio-Sample-Rate'] = String(sampleRate);
        headers['X-Audio-Channel-Count'] = String(channelCount);
        headers['X-Audio-Bits-Per-Sample'] = String(bitsPerSample);
        headers['X-Voice-Source'] = 'web';
        if (ucid !== undefined && ucid !== null && ucid !== '') {
            headers['X-Voice-Ucid'] = String(ucid);
        }
        if (languageCode) {
            headers['X-Language-Code'] = String(languageCode);
        }
        if (Array.isArray(alternativeLanguageCodes) && alternativeLanguageCodes.length) {
            headers['X-Alternative-Language-Codes'] = alternativeLanguageCodes.join(',');
        }
        if (sttMode) {
            headers['X-Stt-Mode'] = String(sttMode);
        }
        return headers;
    }

    async parseVoiceToTextHttpResponse(response, operation) {
        const contentType = response.headers.get('Content-Type') || '';
        try {
            if (!contentType || this.isMimeType(contentType, 'application/json')) {
                return await response.json();
            }
            const responseText = await response.text();
            return JSON.parse(responseText);
        } catch (error) {
            throw new Error(`${operation} returned an unsupported response payload`);
        }
    }

    async requestBinaryVoiceToText({ samples, payload }) {
        const httpUrl = this.getOmnichannelApiUrl('/voice-to-text');
        const requestBody = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
        try {
            const response = await fetch(httpUrl, {
                method: 'POST',
                headers: this.getBinaryVoiceToTextHeaders(payload),
                body: requestBody,
            });
            if (!response.ok) {
                throw await this.buildHttpError(response, 'voice-to-text');
            }
            return await this.parseVoiceToTextHttpResponse(response, 'voice-to-text');
        } catch (error) {
            this.handleOmnichannelVoiceError(error, {
                transport: 'http',
                silentMessage: 'Silent audio blocked before voice-to-text API call',
                defaultMessage:
                    'There was a problem with the binary voice-to-text fetch operation:',
            });
            throw error;
        }
    }

    async voiceToText(audioInput, { ucid, sttMode, sampleRate: sampleRateOverride } = {}) {
        const sampleRate = Number(sampleRateOverride) || this.getVoiceToTextSampleRate();
        const samples = await this.resolveVoiceToTextSamples(audioInput, sampleRate);
        const audioMetrics = this.evaluatePcmInt16Quality(samples);
        if (audioMetrics.isSilent) {
            const silentAudioError = this.createSilentAudioError(audioMetrics);
            throw silentAudioError;
        }
        const activeConversationUcid = this.getActiveConversationId();
        const resolvedUcid = this.resolveVoiceSessionUcid(ucid);
        const { state } = this.getVoiceLanguageState(activeConversationUcid);
        const sttLanguageCode = this.getSessionVoiceLanguageCode(state);
        const shouldSendAlternativeLanguageCodes = !sttLanguageCode;

        const payload = {
            bitsPerSample: this._OMNICHANNEL_STT_AUDIO_CONFIG.bitsPerSample,
            sampleRate,
            channelCount: this._OMNICHANNEL_STT_AUDIO_CONFIG.channelCount,
            source: 'web',
            sttMode: sttMode || 'recognize',
        };
        if (sttLanguageCode) {
            payload.languageCode = sttLanguageCode;
        }
        if (shouldSendAlternativeLanguageCodes) {
            const firstRequestAlternatives = this.getFirstSttAlternativeLanguageCodes(
                sttLanguageCode,
                activeConversationUcid
            );
            if (firstRequestAlternatives.length) {
                payload.alternativeLanguageCodes = firstRequestAlternatives;
            }
        }
        if (resolvedUcid !== undefined && resolvedUcid !== null && resolvedUcid !== '') {
            payload.ucid = String(resolvedUcid);
        }
        const response = await this.requestBinaryVoiceToText({ samples, payload });
        const detectedLanguageCode = this.normalizeLanguageCode(response && response.languageCode);
        if (detectedLanguageCode) {
            const didUpdateLanguage = this.setSessionVoiceLanguageCode(state, detectedLanguageCode);
            if (didUpdateLanguage) {
                this.syncVoiceLanguageWithChatContext(detectedLanguageCode);
                await this.persistVoiceLanguageForGroup(
                    activeConversationUcid,
                    detectedLanguageCode
                );
            }
        }
        return response;
    }

    evaluatePcmInt16Quality(samples = []) {
        const sampleCount = samples && typeof samples.length === 'number' ? samples.length : 0;
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

    async extractPcmInt16Samples(audioBlob, targetSampleRate) {
        const resolvedTargetSampleRate =
            Number(targetSampleRate) || this.getVoiceToTextSampleRate();
        const audioBuffer = await this.decodeAudioBlob(audioBlob);
        const mono = this.getMonoChannelData(audioBuffer);
        const preprocessed = this.preprocessSttFloat32Samples(mono, audioBuffer.sampleRate);
        const downsampled = this.resampleToTargetRate(
            preprocessed,
            audioBuffer.sampleRate,
            resolvedTargetSampleRate
        );
        const int16Samples = this.float32ToInt16(downsampled);
        return Array.from(int16Samples);
    }

    preprocessSttFloat32Samples(floatData, sampleRate) {
        if (!floatData || !floatData.length) {
            return new Float32Array(0);
        }

        const processed = new Float32Array(floatData.length);

        // Remove DC offset first to keep VAD/STT energy metrics stable.
        let mean = 0;
        for (let i = 0; i < floatData.length; i++) {
            mean += floatData[i];
        }
        mean = mean / floatData.length;
        for (let i = 0; i < floatData.length; i++) {
            processed[i] = floatData[i] - mean;
        }

        // One-pole high-pass filter to suppress low-frequency rumble.
        const cutoffHz = 90;
        const dt = 1 / Math.max(sampleRate || 16000, 1);
        const rc = 1 / (2 * Math.PI * cutoffHz);
        const alpha = rc / (rc + dt);
        let previousInput = processed[0] || 0;
        let previousOutput = 0;
        for (let i = 0; i < processed.length; i++) {
            const currentInput = processed[i];
            const output = alpha * (previousOutput + currentInput - previousInput);
            processed[i] = output;
            previousInput = currentInput;
            previousOutput = output;
        }

        // Safe gain for weak captures (seen frequently on Safari).
        let peakAbs = 0;
        let sumSquares = 0;
        for (let i = 0; i < processed.length; i++) {
            const abs = Math.abs(processed[i]);
            if (abs > peakAbs) {
                peakAbs = abs;
            }
            sumSquares += processed[i] * processed[i];
        }
        const rms = Math.sqrt(sumSquares / processed.length);
        if (peakAbs > 0 && peakAbs < 0.08 && rms > 0.001) {
            const targetPeak = 0.42;
            const gain = Math.min(targetPeak / peakAbs, 14);
            for (let i = 0; i < processed.length; i++) {
                processed[i] = Math.max(-0.98, Math.min(0.98, processed[i] * gain));
            }
        }

        return processed;
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
        let pcmData = Int16Array.from(flattened);
        // Normalize low-amplitude PCM for more consistent playback loudness,
        // especially on Safari output paths that can sound very quiet.
        let peak = 0;
        for (let i = 0; i < pcmData.length; i++) {
            const abs = Math.abs(pcmData[i]);
            if (abs > peak) {
                peak = abs;
            }
        }
        if (peak > 0 && peak < 12000) {
            const targetPeak = 18000;
            const gain = Math.min(targetPeak / peak, 4);
            const normalized = new Int16Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                const amplified = Math.round(pcmData[i] * gain);
                normalized[i] = Math.max(-32768, Math.min(32767, amplified));
            }
            pcmData = normalized;
        }
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
