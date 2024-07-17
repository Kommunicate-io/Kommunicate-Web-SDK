Kommunicate.KmEventHandler = {
    openChatOnNotification: function (message) {
        if (
            !(document.getElementById('mck-sidebox').style.display === 'block')
        ) {
            if (message && message.groupId) {
                document
                    .getElementById('launcher-agent-img-container')
                    .classList.remove('vis');
                document
                    .getElementById('launcher-agent-img-container')
                    .classList.add('n-vis');
                document
                    .getElementById('launcher-svg-container')
                    .classList.remove('n-vis');
                document
                    .getElementById('launcher-svg-container')
                    .classList.add('vis');
                window.Kommunicate.openConversation(message.groupId);
            } else {
                window.Kommunicate.openDirectConversation(message.to);
            }
            KommunicateUI.hideMessagePreview();
        }
    },
    notificationEvent: function (message) {
        if (
            kmSessionStorage.getDataFromKmSession('appOptions')
                ?.openConversationOnNewMessage
        ) {
            Kommunicate.KmEventHandler.openChatOnNotification(message);
        } else if (
            document
                .getElementById('launcher-agent-img-container')
                .classList.contains('vis')
        ) {
            document
                .querySelector('#mck-sidebox-launcher #launcher-svg-container')
                .classList.add('n-vis');
            document
                .querySelector('#mck-sidebox-launcher #launcher-svg-container')
                .classList.remove('vis');
        }
    },
    onMessageReceived: function (message, toggleSound) {
        //message received

        // turn off the speech
        if (toggleSound) {
            Kommunicate.mediaService.voiceOutputIncomingMessage(
                message,
                toggleSound
            );
            return;
        }
        var validMessageMetadata =
            message.metadata &&
            message.metadata.category != 'HIDDEN' &&
            message.metadata.hide != 'true';
        if (!message.metadata || validMessageMetadata) {
            // hiding away message when new message received from agents.
            KommunicateUI.hideAwayMessage();
            // Send the message for voice output
            message.userOverride.voiceOutput &&
                Kommunicate.mediaService.voiceOutputIncomingMessage(message);
        }
    },
    onMessageSent: function (message) {
        if (!(message && message.metadata && message.metadata.feedback)) {
            KommunicateUI.showClosedConversationBanner(false);
        }
    },
};
