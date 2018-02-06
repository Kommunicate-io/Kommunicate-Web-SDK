

Kommunicate ={
    getBaseUrl: function(){
        switch(MCK_BASE_URL){
            case "https://apps-test.applozic.com/":
            case "https://apps-test.applozic.com":
                return "https://api-test.kommunicate.io";
            default:
                return "https://api.kommunicate.io";
        }
    },
    setDefaultAgent :function(agentName){
        //kommunicate.defaultAgent  = agentName;
        throw new Error("not implemented");
     },
     getConversationOfParticipent:function(options, callback){
        if(typeof(callback)!=='function'){
            throw new Error("invalid callback! expected: Kommunicate.startNewConversation(options, callback) ");
        }
        $applozic.ajax({
            url: Kommunicate.getBaseUrl()+ "/conversations/participent/"+options.userId,
            type: "get",
            success: function(result) {
                callback(null,result);
            },
            error: function(err){
                callback(err);
            }
        });
     },
    createNewConversation:function(options,callback){
        if(typeof(callback)!=='function'){
            throw new Error("invalid callback! expected: Kommunicate.startNewConversation(options, callback) ");
        }
        let data ={
                "groupId": options.groupId,
                "participentUserId": options.participentUserId,
                "createdBy": options.participentUserId,
                "defaultAgentId":options.defaultAgentId,
                "applicationId":options.applicationId,
        }
       $applozic.ajax({
            url: Kommunicate.getBaseUrl()+ "/conversations",
            type: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(result) {
                console.log("conversation started successfully");
                callback(null,result);
            },
            error: function(err){
                console.log("err while starting Conversation");
                callback(err);
            }
        });
    },
    triggerEvent:function(event,options){
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + "/applications/events?type="+event,
            type: "post",
            data: JSON.stringify({"conversationId":options.groupId,"applicationId":options.applicationId}),
            contentType: "application/json",
            success: function(result) {
                console.log("conversation triggering event");
            },
            error: function(err){
                console.log("err while starting Conversation");
            }
        });
    },
    updateUserIdentity:function(newUserId){
        $applozic.fn.applozic('updateUserIdentity', 
                                {'newUserId':newUserId,
                                'callback':function(response){
                                    console.log("callback response :", response);
                                }});
    },
    isRichTextMessage:function(metadata){
        // contentType should be 300 for rich text message in metadata
        return metadata&&metadata.contentType==300;
    },
    getConatainerTypeForRichMessage : function(metadata){
        if(metadata){
            switch(metadata.templateId){
                // add template Id to enable slick effsect
                // 2 for get room pax info template
                case "2":
                    return "km-slick-container";
                    break;
                default:
                    return "km-fixed-container";
                    break;

            }
        }

    },
    processPaymentRequest:function(options){

    },
    sendMessage: function(messagePxy){
        var $mck_msg_inner= $applozic("#mck-message-cell .mck-message-inner");
        var $mck_msg_to=  $applozic("#mck-msg-to");
 
         if ($mck_msg_inner.data("isgroup") === true) {
             messagePxy.groupId = $mck_msg_to.val();
             } else {
             messagePxy.to = $mck_msg_to.val();
             }
        $applozic.fn.applozic('sendGroupMessage',messagePxy);

    },
    getRichTextMessageTemplate: function(metadata){
        if (metadata){
            switch(metadata.templateId){
                // 1 for get room pax info template
                case "1":
                    return Kommunicate.markup.getHotelRoomPaxInfoTemplate();
                    break;
                //2 for hotel card template
                case "2":
                    
                    return Kommunicate.markup.getHotelCardContainerTemplate(JSON.parse(metadata.hotelList||"[]"),metadata.sessionId);
                    break;
                // 3 for button container
                case "3": 
                    return Kommunicate.markup.buttonContainerTemplate(metadata); 
                    break;
                case "5":
                    return Kommunicate.markup.getPassangerDetail(metadata);
                    break;
                case "4":
                return Kommunicate.markup.getRoomDetailsContainerTemplate(JSON.parse(metadata.hotelRoomDetail || "[]"), metadata.sessionId)
                break;
                default:
                return "";
                break;
            }
        }else{
            return "";
        }
    }
   
}
function KommunicateClient(){
    //groupName:DEFAULT_GROUP_NAME,
    //agentId:DEFAULT_AGENT_ID

}

