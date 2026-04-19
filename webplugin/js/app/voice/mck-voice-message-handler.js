var kmVoiceMessageHandler = {
    _queuedVoiceMessageSignatures: [],

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

    getMessageTextSummaryFromValue: function (value) {
        if (Array.isArray(value)) {
            return value.map(this.getMessageTextSummaryFromValue, this).filter(Boolean).join(' ');
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return String(value);
        }
        if (value && typeof value === 'object') {
            return this.getMessageTextSummaryFromValue(value.message);
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
            decision.signature && this.rememberQueuedVoiceMessageSignature(decision.signature);
            currentMessage._kmVoiceQueued = true;
            mckVoice.processMessagesAsAudio(currentMessage, displayName);
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
            decision.signature && this.rememberQueuedVoiceMessageSignature(decision.signature);
            currentMessage._kmVoiceQueued = true;
            mckVoice.processMessagesAsAudio(currentMessage, displayName);
            queuedAtLeastOne = true;
        }
        return queuedAtLeastOne;
    },
};
