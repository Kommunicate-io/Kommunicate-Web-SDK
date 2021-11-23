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
        var trackingID =
                applozic._globals.gaTrackingID ||
                (applozic._globals.appSettings.chatWidget.isGAEnabled &&
                    applozic._globals.appSettings.chatWidget.gaTrackingId);
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
            if (customLabel) {
                eventObject.data.eventLabel = customLabel;
            }
            if (customValue) {
                eventObject.data.eventValue = customValue;
            }
            var trackingID =
                applozic._globals.gaTrackingID ||
                (applozic._globals.appSettings.chatWidget.isGAEnabled &&
                    applozic._globals.appSettings.chatWidget.gaTrackingId);
            trackingID &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.data.eventCateogry,
                    eventObject.data.eventAction,
                    eventObject.data.eventLabel,
                    eventObject.data.eventValue
                );
            if (eventObject.eventFunction !== null) {
                // checks if there is any errors in user provided function
                try {
                    eventObject.eventFunction(eventObject.data);
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            console.error(
                'eventTracking expect an object but got ' + typeof eventObject
            );
        }
    },
};

/* Description for the events in eventMappping object.
    eventName: {
        data:{
            eventCateogry: carteogry of event,
            eventAction: action happening on the,
            eventLabel: unique label for every event (for some events ie. onRichButtonClick it get created dynamically while calling the respective fucntion),
            eventValue: getting created dynamically while calling the respective fucntion,
        },
        eventFunction: default is null but overwrite the function here which is sent by user in subscribeToEvents(),
    }
    data property 
*/
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
            eventAction: 'Close',
            eventLabel: 'Chat Widget Close',
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
    onCameraButtonClick: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Click',
            eventLabel: 'Camera Button Click',
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
            eventLabel: 'Message',
        },
        eventFunction: null,
    },
    onMessageReceived: {
        data: {
            eventCateogry: 'Kommunicate',
            eventAction: 'Received',
            eventLabel: 'Message',
        },
        eventFunction: null,
    },
};
