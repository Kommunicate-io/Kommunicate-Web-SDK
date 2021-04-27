/**
 // Kommunicate custom events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // defination of function can be overwrite by user through subscribeToEvents function.
 */
var kmWidgetEvents = {
    onChatWidgetOpen: function (resp) {},
    onChatWidgetClose: function (resp) {},
    onFaqClick: function (resp) {},
    onStartNewConversation: function (resp) {},
    onAttachmentClick: function (resp) {},
    onVoiceIconClick: function (resp) {},
    onLocationIconClick: function (resp) {},
    onRateConversationClick: function (resp) {},
    onRateConversationEmoticonsClick: function (resp) {},
    onSubmitRatingClick: function (resp) {},
    onRestartConversationClick: function (resp) {},
    onGreetingMessageNotificationClick: function (resp) {},
    onNotificationClick: function (resp) {},
    onRichMessageButtonClick: function (resp) {},
    onShowResolvedClick: function (resp) {},
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
    eventTracking: function (eventObject) {
        // Any other analytics tool related code can be add here no need to paste it in every function
        if (kommunicateCommons.isObject(eventObject)) {
            applozic._globals.gaTrackingID &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.eventCateogry,
                    eventObject.eventAction,
                    eventObject.eventLabel,
                    eventObject.eventValue
                );
            eventObject.eventFunction(eventObject.data)
        } else
            throw new TypeError(
                'eventTracking expect an object but got ' + typeof eventObject
            );
    },
};

var eventMapping = {
    chatWidgetOpenEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Open',
            eventLabel: 'Chat Widget Open',
        },
        eventFunction: kmWidgetEvents.onChatWidgetOpen,
    },
    chatWidgetCloseEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Chat widget closed',
            eventLable: 'Chat Widget Close',
        },
        eventFunction: kmWidgetEvents.onChatWidgetClose,
    },
    richMessageButtonEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rich Message Click',
            eventLable: function(buttonText){return buttonText}
        },
        eventFunction: kmWidgetEvents.onRateConversationClick,
    },
    faqEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'FAQ Menu',
        },
        eventFunction: kmWidgetEvents.onFaqClick,
    },
    csatEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Started',
            eventLabel: 'CSAT Start',
        },
        eventFunction: kmWidgetEvents.onRateConversationClick,
    },
    csatSubmitEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Submit',
            eventLabel: 'CSAT Submit',
        },
        eventFunction: kmWidgetEvents.onSubmitRatingClick,
    },
    showResolvedEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Show Resolve',
        },
        eventFunction: kmWidgetEvents.onShowResolvedClick,
    },
    startConversationEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Start New',
            eventLabel: 'Conversation Start',
        },
        eventFunction: kmWidgetEvents.onStartNewConversation,
    },
    greetingMessageEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Greeting',
        },
        eventFunction: kmWidgetEvents.onGreetingMessageNotificationClick,
    },
    conversationRestartEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Restart',
            eventLabel: 'Conversation Restart',
        },
        eventFunction: kmWidgetEvents.onRestartConversationClick,
    },
    ratingEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rate',
        },
        eventFunction: kmWidgetEvents.onRateConversationEmoticonsClick,
    },
    locationEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Location',
        },
        eventFunction: kmWidgetEvents.onLocationIconClick,
    },
    attachmentEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Attachment',
        },
        eventFunction: kmWidgetEvents.onAttachmentClick,
    },
    notificationEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Notification',
        },
        eventFunction: kmWidgetEvents.onNotificationClick,
    },
    voiceInputEvent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'VoiceInput',
        },
        eventFunction: kmWidgetEvents.onVoiceIconClick,
    },
};
