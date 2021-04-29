/**
 // Kommunicate custom events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // defination of function can be overwrite by user through subscribeToEvents function.
 */
var kmWidgetEvents = {
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
    eventTracking: function (eventObject, customLabel, customValue) {
        // Any other analytics tool related code can be add here no need to paste it in every function
        if (kommunicateCommons.isObject(eventObject)) {
            customLabel && eventObject.eventLabel ? customLabel : '';
            customValue && eventObject.eventValue ? customValue : '';
            applozic._globals.gaTrackingID &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.eventCateogry,
                    eventObject.eventAction,
                    eventObject.eventLabel,
                    eventObject.eventValue
                );
            eventObject !== null && eventObject.eventFunction(eventObject.data);
        } else
            throw new TypeError(
                'eventTracking expect an object but got ' + typeof eventObject
            );
    },
};

var eventMapping = {
    onChatWidgetOpen: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Open',
            eventLabel: 'Chat Widget Open',
        },
        eventFunction: null,
    },
    onChatWidgetClose: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Chat widget closed',
            eventLable: 'Chat Widget Close',
        },
        eventFunction: null,
    },
    onRichMessageButtonClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rich Message Click',
        },
        eventFunction: null,
    },
    onFaqClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'FAQ Menu',
        },
        eventFunction: null,
    },
    onRateConversationClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Started',
            eventLabel: 'CSAT Start',
        },
        eventFunction: null,
    },
    onSubmitRatingClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Submit',
            eventLabel: 'CSAT Submit',
        },
        eventFunction: null,
    },
    onShowResolvedClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Show Resolve',
        },
        eventFunction: null,
    },
    onStartNewConversation: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Start New',
            eventLabel: 'Conversation Start',
        },
        eventFunction: null,
    },
    onGreetingMessageNotificationClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Greeting',
        },
        eventFunction: null,
    },
    onRestartConversationClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Restart',
            eventLabel: 'Conversation Restart',
        },
        eventFunction: null,
    },
    onRateConversationEmoticonsClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Rate',
        },
        eventFunction: null,
    },
    onLocationIconClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Location',
        },
        eventFunction: null,
    },
    onAttachmentClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Attachment',
        },
        eventFunction: null,
    },
    onNotificationClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Notification',
        },
        eventFunction: null,
    },
    onVoiceIconClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'VoiceInput',
        },
        eventFunction: null,
    },
    onMessageSent: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Sent',
            eventLabel: 'Sent',
        },
        eventFunction: null,
    },
};
