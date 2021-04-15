/**
 // Kommunicate custome events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // defination of function can be overwrite by user through subscribeToEvents function.
 */
KM_WidgetEvents = {
    onChatWidgetOpen: function (resp) {},
    onChatWidgetClose: function (resp) {},
    onFaqClick: function (resp) {},
    onStartNewConversation: function (resp) {},
    onAttachmentClick: function (resp) {},
    onVoiceIconClick: function (resp) {},
    onShowResolvedClick: function (resp) {},
    onLocationIconClick: function (resp) {},
    onRateConversationClick: function (resp) {},
    onRateConversationEmoticonsClick: function (resp) {},
    onSubmitRatingClick: function (resp) {},
    onRestartConversationClick: function (resp) {},
    onGreetingMessageNotificationClick: function (resp) {},
    onNotificationClick: function (resp) {},
    onRichMessageButtonClick: function (resp) {},
};
Analytics = {
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
};
