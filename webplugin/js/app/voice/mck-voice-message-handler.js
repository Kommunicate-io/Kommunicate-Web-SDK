var kmIsWelcomeVoiceMessage = function (message) {
    var metadata = message && message.metadata ? message.metadata : {};
    return Boolean(
        metadata &&
            (metadata.WELCOME_EVENT === true ||
                metadata.WELCOME_EVENT === 'true' ||
                metadata.KM_TRIGGER_EVENT === 'WELCOME')
    );
};

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
        return (
            message.key ||
            message.createdAtTime ||
            message.pairedMessageKey ||
            (message.metadata &&
                (message.metadata.messageKey ||
                    message.metadata.id ||
                    message.metadata.KM_MESSAGE_KEY)) ||
            ''
        );
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
            if (value.message !== undefined) {
                return this.getMessageTextSummaryFromValue(
                    value.message,
                    currentDepth + 1,
                    currentVisited
                );
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
        if (!Kommunicate.visibleMessage(message, msgThroughListAPI) && !isFinalStreamingMessage) {
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

    isVoiceStreamMessage: function (message) {
        return Boolean(message && message.type === 'voice_stream');
    },

    isVoiceStreamErrorMessage: function (message) {
        return Boolean(message && message.type === 'voice_stream_error');
    },

    getVoiceStreamPayload: function (message) {
        if (!message) {
            return null;
        }
        var payload = message.message || message.payload || message.data || message;
        if (!payload || typeof payload !== 'object') {
            return null;
        }
        if (payload === message) {
            return payload;
        }
        return Object.assign({ type: message.type }, payload);
    },

    getVoiceStreamConversationTarget: function (message) {
        var payload = this.getVoiceStreamPayload(message);
        var metadata = payload && payload.messageMetadata ? payload.messageMetadata : {};
        return {
            groupId:
                (payload && (payload.groupId || payload.clientGroupId)) ||
                metadata.groupId ||
                metadata.clientGroupId,
            to:
                (payload && payload.to) ||
                metadata.to ||
                metadata.userId ||
                metadata.senderId ||
                metadata.contactId,
        };
    },

    isWelcomeVoiceMessage: kmIsWelcomeVoiceMessage,

    isIncomingBotVoiceStream: function (message) {
        var payload = this.getVoiceStreamPayload(message);
        var metadata = payload && payload.messageMetadata;
        if (!metadata) {
            return false;
        }
        if (KommunicateUtils.isCurrentAssigneeBot()) {
            return true;
        }
        if (metadata.source === KommunicateConstants.MESSAGE_SOURCE.PLATFORM) {
            return true;
        }
        var senderName = metadata.senderName ? metadata.senderName.toLowerCase() : '';
        return senderName === 'bot';
    },

    handleSocketVoiceStream: function (message, tabId, appOptions) {
        var voiceStreamPayload = this.getVoiceStreamPayload(message);
        if (!voiceStreamPayload) {
            return false;
        }
        if (appOptions && appOptions.voiceChat && this.isVoiceStreamErrorMessage(message)) {
            mckVoice.handleVoiceStreamError(voiceStreamPayload);
            return true;
        }
        if (
            !appOptions ||
            !appOptions.voiceChat ||
            !this.isVoiceStreamMessage(message) ||
            !voiceStreamPayload.streamId ||
            !mckVoice.shouldUseVoiceStreamPlayback() ||
            !this.isCurrentConversationMessage(
                this.getVoiceStreamConversationTarget(message),
                tabId
            ) ||
            !this.isIncomingBotVoiceStream(message)
        ) {
            return false;
        }
        mckVoice.processVoiceStreamMessage(voiceStreamPayload);
        return true;
    },

    canQueueVoiceMessage: function (message, appOptions, msgThroughListAPI) {
        return this.getQueueVoiceDecision(message, appOptions, msgThroughListAPI).allowed;
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
        if (mckVoice.hasQueuedVoiceMessage(message)) {
            return {
                allowed: false,
                reason: 'message_already_marked_queued',
                signature: signature,
            };
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
            mckVoice.markVoiceMessageQueued(currentMessage);
            currentMessage._kmVoiceQueued = true;
            decision.signature && this.rememberQueuedVoiceMessageSignature(decision.signature);
            queuedAtLeastOne = true;
        }
        return queuedAtLeastOne;
    },

    queueFromSocketReceive: function (message, tabId, appOptions, displayName) {
        if (
            !this.canQueueVoiceMessage(message, appOptions, false) ||
            !this.isCurrentConversationMessage(message, tabId)
        ) {
            return false;
        }
        mckVoice.markVoiceMessageQueued(message);
        message._kmVoiceQueued = true;
        mckVoice.processMessagesAsAudio(message, displayName);
        return true;
    },
};
