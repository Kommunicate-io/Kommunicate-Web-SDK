var kmVoiceMessageHandler = {
    _queuedVoiceMessageSignatures: [],
    _MAX_MESSAGE_TEXT_SUMMARY_DEPTH: 5,

    getVoiceController: function () {
        return typeof mckVoice !== 'undefined' ? mckVoice : null;
    },

    getStableMessageIdentity: function (message) {
        if (!message) {
            return '';
        }
    },
    isVoiceStreamingEnabled: function () {
        return mckVoice?.shouldUseVoiceStreamPlayback();
    },

    isVoiceInterfaceActive: function () {
        return mckVoice?.isVoiceModeActive();
    },

    getMessageVoiceSignature: function (message) {
        if (!message) {
            return '';
        }
        var stableIdentity = this.getStableMessageIdentity(message);
        if (!stableIdentity) {
            return '';
        }
        return [stableIdentity, message.groupId || message.to || '', message.type || ''].join('::');
    },

    hasVisitedSummaryValue: function (visited, value) {
        if (!visited || !value || typeof value !== 'object') {
            return false;
        }
        if (typeof WeakSet === 'function' && visited instanceof WeakSet) {
            return visited.has(value);
        }
        return visited.indexOf(value) !== -1;
    },

    markVisitedSummaryValue: function (visited, value) {
        if (!visited || !value || typeof value !== 'object') {
            return;
        }
        if (typeof WeakSet === 'function' && visited instanceof WeakSet) {
            visited.add(value);
            return;
        }
        visited.push(value);
    },

    getMessageTextSummaryFromValue: function (value, depth, visited) {
        var currentDepth = typeof depth === 'number' ? depth : 0;
        var currentVisited = visited || (typeof WeakSet === 'function' ? new WeakSet() : []);
        if (currentDepth > this._MAX_MESSAGE_TEXT_SUMMARY_DEPTH) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return String(value);
        }
        if (Array.isArray(value)) {
            if (this.hasVisitedSummaryValue(currentVisited, value)) {
                return '';
            }
            this.markVisitedSummaryValue(currentVisited, value);
            return value
                .map((item) =>
                    this.getMessageTextSummaryFromValue(item, currentDepth + 1, currentVisited)
                )
                .filter(Boolean)
                .join(' ');
        }
        if (value && typeof value === 'object') {
            if (this.hasVisitedSummaryValue(currentVisited, value)) {
                return '';
            }
            this.markVisitedSummaryValue(currentVisited, value);
            if (typeof value.message === 'string' || typeof value.message === 'number') {
                return String(value.message);
            }
        }
        return '';
    },

    getMessageTextSummary: function (message) {
        if (!message) {
            return '';
        }
        return this.getMessageTextSummaryFromValue(message.message).trim();
    },

    getMessageTextLength: function (message) {
        return this.getMessageTextSummary(message).length;
    },

    normalizeIncomingMessages: function (message) {
        if (Array.isArray(message)) {
            return message.filter(Boolean);
        }
        return message ? [message] : [];
    },

    hasQueuedVoiceMessageSignature: function (signature) {
        return Boolean(signature && this._queuedVoiceMessageSignatures.indexOf(signature) !== -1);
    },

    rememberQueuedVoiceMessageSignature: function (signature) {
        if (!signature) {
            return;
        }
        if (this._queuedVoiceMessageSignatures.indexOf(signature) !== -1) {
            return;
        }
        this._queuedVoiceMessageSignatures.push(signature);
        if (this._queuedVoiceMessageSignatures.length > 100) {
            this._queuedVoiceMessageSignatures.splice(
                0,
                this._queuedVoiceMessageSignatures.length - 100
            );
        }
    },

    resetQueuedVoiceMessages: function () {
        this._queuedVoiceMessageSignatures = [];
    },

    isVoiceInterfaceActive: function () {
        var voiceController = this.getVoiceController();
        return Boolean(voiceController && voiceController.isVoiceModeActive());
    },

    isIncomingBotMessage: function (message) {
        return message && (message.type === 0 || message.type === 4 || message.type === 6);
    },

    isCurrentConversationMessage: function (message, tabId) {
        if (!message || tabId === undefined || tabId === null) {
            return false;
        }
        return message.groupId ? message.groupId == tabId : message.to == tabId;
    },

    isEligibleForUIRendering: function (message, msgThroughListAPI) {
        if (!message) {
            return false;
        }
        var isFinalStreamingMessage =
            message &&
            message.metadata &&
            message.metadata.lastToken === 'true' &&
            !message.tokenMessage &&
            Boolean(message.message);
        if (
            typeof Kommunicate !== 'undefined' &&
            Kommunicate &&
            typeof Kommunicate.visibleMessage === 'function' &&
            !Kommunicate.visibleMessage(message, msgThroughListAPI) &&
            !isFinalStreamingMessage
        ) {
            return false;
        }
        if (
            message.metadata &&
            !(
                (message.metadata.category !== 'HIDDEN' && message.metadata.hide !== 'true') ||
                (!message.message &&
                    (message.metadata.hasOwnProperty('KM_ASSIGN_TO') ||
                        message.metadata.hasOwnProperty('KM_ASSIGN_TEAM')))
            )
        ) {
            return false;
        }
        return true;
    },

    getQueueVoiceDecision: function (message, appOptions, msgThroughListAPI) {
        var signature = this.getMessageVoiceSignature(message);
        var messageTextSummary = this.getMessageTextSummary(message);
        if (!this.isVoiceInterfaceActive()) {
            return { allowed: false, reason: 'voice_interface_inactive', signature: signature };
        }
        if (!this.isIncomingBotMessage(message)) {
            return { allowed: false, reason: 'not_incoming_bot_message', signature: signature };
        }
        if (!this.isEligibleForUIRendering(message, msgThroughListAPI)) {
            return { allowed: false, reason: 'message_not_visible', signature: signature };
        }
        if (!messageTextSummary) {
            return { allowed: false, reason: 'empty_message', signature: signature };
        }
        if (message._kmVoiceQueued) {
            return {
                allowed: false,
                reason: 'message_object_already_queued',
                signature: signature,
            };
        }
        if (message.tokenMessage) {
            return { allowed: false, reason: 'token_message_skipped', signature: signature };
        }
        if (!(appOptions && appOptions.voiceChat)) {
            return { allowed: false, reason: 'voice_chat_disabled', signature: signature };
        }
        if (signature && this.hasQueuedVoiceMessageSignature(signature)) {
            return { allowed: false, reason: 'message_already_queued', signature: signature };
        }
        return { allowed: true, reason: 'queued', signature: signature };
    },
    isVoiceStreamMessage: function (message) {
        return Boolean(message && message.type === 'voice_stream');
    },

    isVoiceStreamErrorMessage: function (message) {
        return Boolean(message && message.type === 'voice_stream_error');
    },

    isWelcomeVoiceMessage: function (message) {
        var metadata = message && message.metadata ? message.metadata : {};
        return Boolean(
            metadata &&
                (metadata.WELCOME_EVENT === true ||
                    metadata.WELCOME_EVENT === 'true' ||
                    metadata.KM_TRIGGER_EVENT === 'WELCOME')
        );
    },

    isIncomingBotVoiceStream: function (message) {
        var metadata = message && message.messageMetadata;
        if (!metadata) {
            return false;
        }
        if (KommunicateUtils?.isCurrentAssigneeBot()) {
            return true;
        }
        if (
            typeof KommunicateConstants !== 'undefined' &&
            KommunicateConstants &&
            KommunicateConstants.MESSAGE_SOURCE &&
            metadata.source === KommunicateConstants.MESSAGE_SOURCE.PLATFORM
        ) {
            return true;
        }
        var senderName =
            typeof metadata.senderName === 'string' ? metadata.senderName.toLowerCase() : '';
        return senderName === 'bot';
    },

    handleSocketVoiceStream: function (message, tabId, appOptions) {
        if (
            appOptions &&
            appOptions.voiceChat &&
            this.isVoiceStreamErrorMessage(message) &&
            mckVoice &&
            typeof mckVoice.handleVoiceStreamError === 'function'
        ) {
            mckVoice.handleVoiceStreamError(message);
            return true;
        }
        if (
            !appOptions ||
            !appOptions.voiceChat ||
            !this.isVoiceStreamMessage(message) ||
            !this.isVoiceStreamingEnabled() ||
            !this.isCurrentConversationMessage(
                {
                    groupId: message?.messageMetadata?.groupId,
                    to: message?.messageMetadata?.groupId,
                },
                tabId
            ) ||
            !this.isIncomingBotVoiceStream(message)
        ) {
            return false;
        }
        mckVoice.processVoiceStreamMessage(message);
        return true;
    },

    canQueueVoiceMessage: function (message, appOptions, msgThroughListAPI) {
        return (
            this.isVoiceInterfaceActive() &&
            this.isIncomingBotMessage(message) &&
            this.isEligibleForUIRendering(message, msgThroughListAPI) &&
            message &&
            message.message &&
            !message._kmVoiceQueued &&
            // Skip intermediate streaming tokens — only queue the final complete message.
            // Token messages have tokenMessage=true; the complete message that replaces
            // them does not, so TTS fires exactly once per bot turn.
            !message.tokenMessage &&
            appOptions &&
            appOptions.voiceChat
        );
    },

    queueFromMessageRender: function (message, displayName, appOptions, msgThroughListAPI) {
        var messages = this.normalizeIncomingMessages(message);
        var queuedAtLeastOne = false;
        for (var index = 0; index < messages.length; index++) {
            var currentMessage = messages[index];
            var decision = this.getQueueVoiceDecision(
                currentMessage,
                appOptions,
                msgThroughListAPI
            );
            if (!decision.allowed) {
                continue;
            }
            if (!mckVoice.processMessagesAsAudio(currentMessage, displayName)) {
                continue;
            }
            currentMessage._kmVoiceQueued = true;
            decision.signature && this.rememberQueuedVoiceMessageSignature(decision.signature);
            queuedAtLeastOne = true;
        }
        return queuedAtLeastOne;
    },

    queueFromSocketReceive: function (message, tabId, appOptions) {
        var messages = this.normalizeIncomingMessages(message);
        var queuedAtLeastOne = false;
        for (var index = 0; index < messages.length; index++) {
            var currentMessage = messages[index];
            var decision = this.getQueueVoiceDecision(currentMessage, appOptions, false);
            if (!decision.allowed || !this.isCurrentConversationMessage(currentMessage, tabId)) {
                continue;
            }
            var displayName =
                typeof mckMessageLayout !== 'undefined' &&
                mckMessageLayout &&
                typeof mckMessageLayout.getTabDisplayName === 'function'
                    ? mckMessageLayout.getTabDisplayName(currentMessage.to, false)
                    : '';
            if (!mckVoice.processMessagesAsAudio(currentMessage, displayName)) {
                continue;
            }
            currentMessage._kmVoiceQueued = true;
            decision.signature && this.rememberQueuedVoiceMessageSignature(decision.signature);
            queuedAtLeastOne = true;
        }
        return queuedAtLeastOne;
    },
};
