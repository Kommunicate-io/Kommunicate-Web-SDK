

Kommunicate ={
    BASE_URL:{
        "https://chat.kommunicate.io/":"https://api.kommunicate.io",
        //"https://apps-test.applozic.com/":"https://api-test.kommunicate.io/"
        "https://apps-test.applozic.com/":"http://localhost:3999"
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
            url: Kommunicate.BASE_URL[MCK_BASE_URL] + "/conversations/participent/"+options.userId,
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
                "participentUserId": options.userId,
                "createdBy": options.userId,
                "defaultAgentId":options.defaultAgentId
        }
       $applozic.ajax({
            url: Kommunicate.BASE_URL[MCK_BASE_URL] + "/conversations",
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
    }
}
function KommunicateClient(){
    //groupName:DEFAULT_GROUP_NAME,
    //agentId:DEFAULT_AGENT_ID

}

