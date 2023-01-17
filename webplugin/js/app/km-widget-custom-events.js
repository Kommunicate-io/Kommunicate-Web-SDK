/**
 // Kommunicate custom events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // definition of function can be overwrite by user through subscribeToEvents function.
 */
var kmWidgetEvents = {
    gaTrackingId: function () {
        var trackingID = '';

        if (!trackingID) {
            trackingID =
                applozic._globals.gaTrackingID ||
                (applozic._globals.appSettings.chatWidget.isGAEnabled &&
                    applozic._globals.appSettings.chatWidget.gaTrackingId);
        }

        return trackingID.toString();
    },
    sendEventToGoogleAnalytics: function (
        eventCategory,
        eventAction,
        eventLabel,
        eventValue
    ) {
        try {
            if (
                kmWidgetEvents.gaTrackingId() &&
                typeof window.top.ga !== 'undefined'
            ) {
                window.top.ga('create', kmWidgetEvents.gaTrackingId(), 'auto');
                window.top.ga('send', {
                    hitType: 'event',
                    eventCategory: eventCategory,
                    eventAction: eventAction,
                    eventLabel: eventLabel,
                    eventValue: eventValue,
                });
            }
        } catch (error) {
            console.log('Cannot reach to top window. Error => ', error);
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
            kmWidgetEvents.gaTrackingId() &&
                kmWidgetEvents.sendEventToGoogleAnalytics(
                    eventObject.data.eventCategory,
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

/* Description for the events in eventMapping object.
    eventName: {
        data:{
            eventCategory: category of event,
            eventAction: action happening on the,
            eventLabel: unique label for every event (for some events ie. onRichButtonClick it get created dynamically while calling the respective function),
            eventValue: getting created dynamically while calling the respective function,
        },
        eventFunction: default is null but overwrite the function here which is sent by user in subscribeToEvents(),
    }
    data property 
    similar format will follow in ga4 as follow
    {
        eventCategory: became custom parameter
        eventAction: became event name
        eventLabel: became custom parameter
    }
*/
var eventMapping = {
    onChatWidgetOpen: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_open',
            eventLabel: 'Chat Widget Open',
        },
        eventFunction: null,
    },
    onChatWidgetClose: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_close',
            eventLabel: 'Chat Widget Close',
        },
        eventFunction: null,
    },
    onRichMessageButtonClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_rich_message_button_click',
        },
        eventFunction: null,
    },
    onFaqClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_faq_click',
            eventLabel: 'FAQ Menu',
        },
        eventFunction: null,
    },
    onRateConversationClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_CSAT_started',
            eventLabel: 'CSAT Start',
        },
        eventFunction: null,
    },
    onSubmitRatingClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_CSAT_submit',
            eventLabel: 'CSAT Submit',
        },
        eventFunction: null,
    },
    onShowResolvedClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_resolve_click',
            eventLabel: 'Show Resolve',
        },
        eventFunction: null,
    },
    onStartNewConversation: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_start_new_conversation',
            eventLabel: 'Conversation Start',
        },
        eventFunction: null,
    },
    onGreetingMessageNotificationClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_greeting_message_click',
            eventLabel: 'Greeting',
        },
        eventFunction: null,
    },
    onRestartConversationClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_restart_conversation',
            eventLabel: 'Conversation Restart',
        },
        eventFunction: null,
    },
    onRateConversationEmoticonsClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_ratings_conversation',
        },
        eventFunction: null,
    },
    onLocationIconClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_location_share',
            eventLabel: 'Location',
        },
        eventFunction: null,
    },
    onAttachmentClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_send_attachment',
            eventLabel: 'Attachment',
        },
        eventFunction: null,
    },
    onCameraButtonClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_camera_icon_click',
            eventLabel: 'Camera Button Click',
        },
        eventFunction: null,
    },
    onNotificationClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_notification_click',
            eventLabel: 'Notification',
        },
        eventFunction: null,
    },
    onVoiceIconClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_voice_input',
            eventLabel: 'VoiceInput',
        },
        eventFunction: null,
    },
    onMessageSent: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_message_sent',
            eventLabel: 'Message',
        },
        eventFunction: null,
    },
    onMessageReceived: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_message_received',
            eventLabel: 'Message',
        },
        eventFunction: null,
    },
};
