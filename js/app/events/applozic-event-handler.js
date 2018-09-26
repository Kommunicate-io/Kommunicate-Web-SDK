Kommunicate.KmEventHandler = {
    'openChatOnNotification': function (message) {
        if (!(document.getElementById("mck-sidebox").style.display === 'block')) {
            if (message && message.groupId) {
                document.getElementById('launcher-agent-img-container').classList.remove('vis');
                document.getElementById('launcher-agent-img-container').classList.add('n-vis');
                document.getElementById('launcher-svg-container').classList.remove('n-vis');
                document.getElementById('launcher-svg-container').classList.add('vis');
                window.Kommunicate.openConversation(message.groupId);
            } else {
                window.Kommunicate.openDirectConversation(message.to);
            }
               KommunicateUI.hideMessagePreview();
        }
    },
    'notificationEvent': function (message) {
        if (KommunicateUtils.getDataFromKmSession("appOptions").openConversationOnNewMessage) {
            Kommunicate.KmEventHandler.openChatOnNotification(message);
        }
    }

} 