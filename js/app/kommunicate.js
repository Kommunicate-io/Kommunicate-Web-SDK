

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
                "defaultAgentId":options.defaultAgentId
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
    }
}
function KommunicateClient(){
    //groupName:DEFAULT_GROUP_NAME,
    //agentId:DEFAULT_AGENT_ID

}

