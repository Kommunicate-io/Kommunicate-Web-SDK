Kommunicate.KmEventHandler = {
    'openChatOnNotification': function (message) {
        if (!(document.getElementById("mck-sidebox").style.display === 'block')) {
            if (message && message.groupId) {
                window.Kommunicate.openConversation(message.groupId);
            } else {
                window.Kommunicate.openDirectConversation(message.to);
            }
        }
    },
    'notificationEvent': function (message) {
        if (KommunicateUtils.getDataFromKmSession("appOptions").openConversationOnNewMessage) {
            Kommunicate.KmEventHandler.openChatOnNotification(message);
        }
    }

} 