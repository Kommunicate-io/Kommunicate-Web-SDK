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
            if (kmWidgetEvents.gaTrackingId() && typeof window.top.gtag !== 'undefined') {
                window.top.gtag('event', eventObject.data.eventAction, {
                    event_category: eventObject.data.eventCategory,
                    event_label: eventObject.data.eventLabel,
                    value: eventObject.data.eventValue || '',
                });
            }
        } catch (error) {
            console.log('Cannot reach to top window. Error => ', error);
        }
    },
    eventTracking: function (eventObject, customLabel, customValue) {
        // Any other analytics tool related code can be add here no need to paste it in every function
        if (kommunicateCommons.isObject(eventObject)) {
            var data = Object.assign({}, eventObject.data);
            if (customLabel !== undefined) {
                data.eventLabel = customLabel;
            }
            if (customValue !== undefined) {
                data.eventValue = customValue;
            }
            kmWidgetEvents.sendEventToGoogleAnalytics({ data: data });
            if (eventObject.eventFunction !== null) {
                // checks if there is any errors in user provided function
                try {
                    eventObject.eventFunction(data);
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            console.error('eventTracking expect an object but got ' + typeof eventObject);
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
var createWidgetEvent = function (action, label) {
    return {
        data: {
            eventCategory: 'Kommunicate_widget',
            eventAction: action,
            eventLabel: label,
        },
        eventFunction: null,
    };
};

var eventMapping = {
    onChatWidgetOpen: createWidgetEvent('km_widget_open', 'Chat Widget Open'),
    onChatWidgetClose: createWidgetEvent('km_widget_close', 'Chat Widget Close'),
    onRichMessageButtonClick: createWidgetEvent(
        'km_widget_rich_message_button_click',
        'RichMessage Button Click'
    ),
    onFaqClick: createWidgetEvent('km_widget_faq_click', 'FAQ Menu'),
    onRateConversationClick: createWidgetEvent('km_widget_CSAT_started', 'CSAT Start'),
    onSubmitRatingClick: createWidgetEvent('km_widget_CSAT_submit', 'CSAT Submit'),
    onShowResolvedClick: createWidgetEvent('km_widget_resolve_click', 'Show Resolve'),
    onStartNewConversation: createWidgetEvent(
        'km_widget_start_new_conversation',
        'Conversation Start'
    ),
    onGreetingMessageNotificationClick: createWidgetEvent(
        'km_widget_greeting_message_click',
        'Greeting Message Click'
    ),
    onRestartConversationClick: createWidgetEvent(
        'km_widget_restart_conversation',
        'Conversation Restart'
    ),
    onRateConversationEmoticonsClick: createWidgetEvent(
        'km_widget_ratings_conversation',
        'Rating Conversation'
    ),
    onLocationIconClick: createWidgetEvent('km_widget_location_share', 'Location Share'),
    onAttachmentClick: createWidgetEvent('km_widget_send_attachment', 'Attachment Icon Click'),
    onCameraButtonClick: createWidgetEvent('km_widget_camera_icon_click', 'Camera Button Click'),
    onNotificationClick: createWidgetEvent('km_widget_notification_click', 'Notification'),
    onVoiceIconClick: createWidgetEvent('km_widget_voice_input', 'VoiceInput'),
    onMessageSent: createWidgetEvent('km_widget_message_sent', 'Message Sent'),
    onMessageReceived: createWidgetEvent('km_widget_message_received', 'Message Received'),
    onFeedbackClick: createWidgetEvent('km_widget_feedback_click', 'Feedback Clicked'),
};
