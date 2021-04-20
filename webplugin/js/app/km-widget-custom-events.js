/**
 // Kommunicate custome events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // defination of function can be overwrite by user through subscribeToEvents function.
 */
kmWidgetEvents = {
    onChatWidgetOpen: function (resp) {},
    onChatWidgetClose: function (resp) {},
    onFaqClick: function (resp) {},
    onStartNewConversation: function (resp) {},
    onAttachmentClick: function (resp) {},
    onVoiceIconClick: function (resp) {},
    onVoiceIconClick: function (resp) {},
    onLocationIconClick: function (resp) {},
    onRateConversationClick: function (resp) {},
    onRateConversationEmoticonsClick: function (resp) {},
    onSubmitRatingClick: function (resp) {},
    onRestartConversationClick: function (resp) {},
    onGreetingMessageNotificationClick: function (resp) {},
    onNotificationClick: function (resp) {},
    onRichMessageButtonClick: function (resp) {},
    sendEventToGoogleAnalytics: function (
        eventCateogry,
        eventAction,
        eventLabel,
        eventValue
    ) {
        var trackingID = applozic._globals.gaTrackingID;
        if (trackingID && typeof window.top.ga !== 'undefined') {
            window.top.ga('create', trackingID.toString(), 'auto');
            window.top.ga('send', {
                hitType: 'event',
                eventCategory: eventCateogry,
                eventAction: eventAction,
                eventLabel: eventLabel,
                eventValue: eventValue,
            });
        }
    },
    EventTracking: function (eventObject) {
        if (kommunicateCommons.isObject(eventObject)) {
            applozic._globals.gaTrackingID &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.eventCateogry,
                    eventObject.eventAction,
                    eventObject.eventLabel,
                    eventObject.eventValue
                );
            if (eventObject.eventLabel == 'FAQ Menu') {
                window.kmWidgetEvents.onFaqClick(eventObject);
            }
            if (eventObject.eventLabel == 'Chat Widget Open') {
                window.kmWidgetEvents.onChatWidgetOpen(eventObject);
            }
            if (eventObject.eventLabel == 'Chat Widget Close') {
                window.kmWidgetEvents.onChatWidgetClose(eventObject);
            }
            if (eventObject.eventLabel == 'Conversation Start') {
                window.kmWidgetEvents.onStartNewConversation(eventObject);
            }
            if (eventObject.eventLabel == 'Attachment') {
                window.kmWidgetEvents.onAttachmentClick(eventObject);
            }
            if (eventObject.eventLabel == 'Attachment') {
                window.kmWidgetEvents.onVoiceIconClick(eventObject);
            }
        } else
            throw new TypeError(
                'EventTracking expect an object but got ' + typeof eventObject
            );
    },
};
