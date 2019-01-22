kommunicateDashboard ={
    getBaseUrl: function(){
        switch(MCK_BASE_URL){
            case "https://apps-test.applozic.com/":
            case "https://apps-test.applozic.com":
                return "https://api-test.kommunicate.io";
            default:
                return "https://api.kommunicate.io";
        }
    },
    getConatainerTypeForRichMessage: function (message) {
        let metadata = message.metadata;
        if (metadata.templateId) {
            switch (metadata.templateId) {
                // add template Id to enable slick effsect
                // 2 for get room pax info template
                case "2":
                    return "km-slick-container";
                    break;
                default:
                    return "km-fixed-container";
                    break;

            }
        } else if (message.contentType == 3 && message.source == 7) {
            return "km-fixed-container";
        }

    },
    isRichTextMessage:function(metadata){
        // contentType should be 300 for rich text message in metadata
        return metadata&&metadata.contentType==300;
    },
    appendEmailToIframe:function (message){
        var richText = kommunicateDashboard.isRichTextMessage(message.metadata) || message.contentType == 3;
        if(richText && message.source === 7 ){
            var iframeID = "km-iframe-"+ message.groupId;
            var iframe = document.getElementById(iframeID);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(message.message);
            doc.close();
            var anchors = doc.getElementsByTagName('a');
            for (var i=0; i<anchors.length; i++){
              anchors[i].setAttribute('target', '_blank');
            };
        }
    },
    processPaymentRequest:function(options){

    },
    sendMessage: function(messagePxy){
        var $mck_msg_inner= $kmApplozic("#km-message-cell .km-message-inner");
        var $mck_msg_to=  $kmApplozic("#km-msg-to");
        var isGroup = $mck_msg_inner.data("isgroup");
 
         if ($mck_msg_inner.data("isgroup") === true) {
             messagePxy.groupId = $mck_msg_to.val();
             } else {
             messagePxy.to = $mck_msg_to.val();
             }
        $kmApplozic.fn.applozic('sendGroupMessage',messagePxy);

    },
    getRichTextMessageTemplate: function(message){
        let metadata = message.metadata;
        if (metadata.templateId){
            switch(metadata.templateId){
                // 1 for get room pax info template
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_COUNT:
                    return kommunicateDashboard.markup.getHotelRoomPaxInfoTemplate();
                    break;
                //2 for hotel card template
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.HOTEL_BOOKING_CARD:
                    return kommunicateDashboard.markup.getHotelCardContainerTemplate(JSON.parse(metadata.hotelList||"[]"),metadata.sessionId);
                    break;
                // 3 for button container
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.LINK_BUTTON: 
                    return kommunicateDashboard.markup.buttonContainerTemplate(metadata); 
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.PASSENGER_DETAIL:
                    return kommunicateDashboard.markup.getPassangerDetail(metadata);
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_DETAIL:
                    return kommunicateDashboard.markup.getRoomDetailsContainerTemplate(JSON.parse(metadata.hotelRoomDetail || "[]"), metadata.sessionId)
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY:
                    return kommunicateDashboard.markup.quickRepliesContainerTemplate(metadata);
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.LIST:
                    return kommunicateDashboard.markup.getListContainerMarkup(metadata);
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.DIALOG_BOX:
                    return kommunicateDashboard.markup.getDialogboxContainer(metadata);
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.IMAGE:
                    return kommunicateDashboard.markup.getImageContainer(metadata);
                    break;
                case KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
                    return kommunicateDashboard.markup.getCarouselMarkup(metadata);
                    break;
                default:
                    return "";
                    break;
            }
        } else if (message.contentType == 3 && message.source == 7) {
            return kommunicateDashboard.markup.getHtmlMessageMarkups(message);
        } else {
            return "";
        }
    }
   
}
function KommunicateClient(){
    //groupName:DEFAULT_GROUP_NAME,
    //agentId:DEFAULT_AGENT_ID

}

