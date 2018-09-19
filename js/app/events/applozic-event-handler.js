Kommunicate.KmEventHandler = {
    'openChatOnNotification': function (message) {
        if (message && message.groupId && !(document.getElementById("mck-sidebox").style.display === 'block')) {
            window.Kommunicate.openConversation(message.groupId);
        } else {
            window.Kommunicate.openDirectConversation(message.to);
        }
    },
    'notificationEvent': function (message) {
        if (KommunicateUtils.getDataFromKmSession("appOptions").openConversationOnNewMessage) {
            Kommunicate.KmEventHandler.openChatOnNotification(message);
        }
    }

} 