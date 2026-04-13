var kmVoiceMessageHandler = {
    isVoiceStreamingEnabled: function () {
        return mckVoice?.shouldUseVoiceStreamPlayback();
    },

    isVoiceInterfaceActive: function () {
        return mckVoice?.isVoiceModeActive();
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
        if (!this.canQueueVoiceMessage(message, appOptions, msgThroughListAPI)) {
            return false;
        }
        message._kmVoiceQueued = true;
        mckVoice.processMessagesAsAudio(message, displayName);
        return true;
    },

    queueFromSocketReceive: function (message, tabId, appOptions) {
        if (
            !this.canQueueVoiceMessage(message, appOptions, false) ||
            !this.isCurrentConversationMessage(message, tabId)
        ) {
            return false;
        }
        var displayName =
            typeof mckMessageLayout !== 'undefined' &&
            mckMessageLayout &&
            typeof mckMessageLayout.getTabDisplayName === 'function'
                ? mckMessageLayout.getTabDisplayName(message.to, false)
                : '';
        message._kmVoiceQueued = true;
        mckVoice.processMessagesAsAudio(message, displayName);
        return true;
    },
};
