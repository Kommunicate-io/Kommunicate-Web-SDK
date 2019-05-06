
 Kommunicate.ApplozicEvents = {
    'onMessageNotification': function (message) {
        Kommunicate.KmEventHandler.notificationEvent(message);
    },
    'onMessageReceived': function (obj) {
        //message received
        var message = obj && obj.message;
        var validMessageMetadata = message.metadata && (message.metadata.category != 'HIDDEN' && message.metadata.hide != "true");
        if (!message.metadata || (validMessageMetadata)) {
            KommunicateUI.hideAwayMessage();
        }
    },
    'onMessageSent': function(message){
        KommunicateUI.showClosedConversationBanner(false);
    }

} 
