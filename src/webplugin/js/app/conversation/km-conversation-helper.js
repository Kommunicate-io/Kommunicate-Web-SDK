Kommunicate =  typeof Kommunicate =='undefined'?{}:Kommunicate;
/**
 * Kommunciate.conversationHelper is a supporting file to conversation service. 
 * It is being loaded before conversation service.
 * Do not call conversation service from her to avoid circular dependency.   
 *   
 */
Kommunicate.conversationHelper = {
    
    status:{
        "INITIAL": -1,
        "OPEN": 0,
        "PROGRESS": 1,
        "CLOSED": 2,
        "SPAM": 3,
        "DUPLICATE": 4,
        "ARCHIVE": 5,
        "UNRESPONDED": 6
    },

    isConversationClosed : function(group){
        if(typeof group !=='undefined'){
            return group.metadata && group.metadata["CONVERSATION_STATUS"] == Kommunicate.conversationHelper.status.CLOSED;
        }
        return;
        
    }
}