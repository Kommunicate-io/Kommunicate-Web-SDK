/**
 // Kommunicate custom events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // defination of function can be overwrite by user through subscribeToEvents function.
 */
var eventMapping = {
    chatWidgetOpenEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Open',
            eventLabel: 'Chat Widget Open',
        },
        eventFunction: kmWidgetEvents.onChatWidgetOpen(
            eventMapping.chatWidgetOpenEvent.eventObject
        ),
    },
    chatWidgetCloseEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Chat widget closed',
            eventLable: 'Chat Widget Close',
        },
        eventFunction: kmWidgetEvents.onChatWidgetClose(
            eventMapping.chatWidgetCloseEvent.eventObject
        ),
    },
    richMessageButtonEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rich Message Click',
        },
        eventFunction: kmWidgetEvents.onRateConversationClick(
            eventMapping.richMessageButtonEvent.eventObject
        ),
    },
    faqEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'FAQ Menu',
        },
        eventFunction: kmWidgetEvents.onFaqClick(
            eventMapping.faqEvent.eventObject
        ),
    },
    csatEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Started',
            eventLabel: 'CSAT Start',
        },
        eventFunction: kmWidgetEvents.onRateConversationClick(
            eventMapping.csatEvent.eventObject
        ),
    },
    csatSubmitEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Submit',
            eventLabel: 'CSAT Submit',
        },
        eventFunction: kmWidgetEvents.onSubmitRatingClick(
            eventMapping.csatSubmitEvent.eventObject
        ),
    },
    showResolvedEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Show Resolve',
        },
        eventFunction: kmWidgetEvents.onShowResolvedClick(
            eventMapping.showResolvedEvent.eventObject
        ),
    },
    startConversationEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Start New',
            eventLabel: 'Conversation Start',
        },
        eventFunction: kmWidgetEvents.onStartNewConversation(
            eventMapping.startConversationEvent.eventObject
        ),
    },
    greetingMessageEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Greeting',
        },
        eventFunction: kmWidgetEvents.onGreetingMessageNotificationClick(
            eventMapping.greetingMessageEvent.eventObject
        ),
    },
    conversationRestartEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Restart',
            eventLabel: 'Conversation Restart',
        },
        eventFunction: kmWidgetEvents.onRestartConversationClick(
            eventMapping.conversationRestartEvent.eventObject
        ),
    },
    ratingEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rate',
        },
        eventFunction: kmWidgetEvents.onRateConversationEmoticonsClick(
            eventMapping.ratingEvent.eventObject
        ),
    },
    locationEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Location',
        },
        eventFunction: kmWidgetEvents.onLocationIconClick(
            eventMapping.locationEvent.eventObject
        ),
    },
    attachmentEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Attachment',
        },
        eventFunction: kmWidgetEvents.onAttachmentClick(
            eventMapping.attachmentEvent.eventObject
        ),
    },
    notificationEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Notification',
        },
        eventFunction: kmWidgetEvents.onNotificationClick(
            eventMapping.notificationEvent.eventObject
        ),
    },
    voiceInputEvent: {
        eventObject: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'VoiceInput',
        },
        eventFunction: kmWidgetEvents.onVoiceIconClick(
            eventMapping.voiceInputEvent.eventObject
        ),
    },
};

kmWidgetEvents = {
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
        if (kommunicateCommons.isObject(eventObject)) {
            applozic._globals.gaTrackingID &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.eventCateogry,
                    eventObject.eventAction,
                    eventObject.eventLabel,
                    eventObject.eventValue
                );
        } else
            throw new TypeError(
                'eventTracking expect an object but got ' + typeof eventObject
            );
    },
};
