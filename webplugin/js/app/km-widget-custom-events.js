/**
 // Kommunicate custom events available for user for the specific event in chat widget.
 // resp - JSON object containing eventAction and other property exposed to user.
 // definition of function can be overwrite by user through subscribeToEvents function.
 */
var kmWidgetEvents = {
    gaTrackingId: function () {
        var trackingID =
            applozic._globals.gaTrackingID ||
            (applozic._globals.appSettings.chatWidget.isGAEnabled &&
                applozic._globals.appSettings.chatWidget.gaTrackingId);

        return (trackingID && trackingID.toString()) || '';
    },
    sendEventToGoogleAnalytics: function (eventObject) {
        try {
            if (
                kmWidgetEvents.gaTrackingId() &&
                typeof window.top.gtag !== 'undefined'
            ) {
                window.top.gtag('event', eventObject.data.eventAction, {
                    category: eventObject.data.eventCategory,
                    label: eventObject.data.eventLabel,
                    value: eventObject.data.eventValue || "",
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
                kmWidgetEvents.sendEventToGoogleAnalytics(eventObject);
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
    https://developers.google.com/tag-platform/gtagjs/reference#event
   
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
            eventLabel: 'RichMessage Button Click',
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
            eventLabel: 'Greeting Message Click',
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
            eventLabel: 'Rating Conversation',
        },
        eventFunction: null,
    },
    onLocationIconClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_location_share',
            eventLabel: 'Location Share',
        },
        eventFunction: null,
    },
    onAttachmentClick: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_send_attachment',
            eventLabel: 'Attachment Icon Click',
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
            eventLabel: 'Message Sent',
        },
        eventFunction: null,
    },
    onMessageReceived: {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: 'km_widget_message_received',
            eventLabel: 'Message Received',
        },
        eventFunction: null,
    },
};
