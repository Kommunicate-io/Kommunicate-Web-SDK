/**
 * all network call. 
 * methods take parameters, make network call, and execute call back on success/error.
 * all methods are attached to Kommunicate.client
 */

var mckGroupService = new MckGroupService();

 Kommunicate.client={
     /**
    * Get the group detail by type. 
    * @param {object} options
    * @param {number} options.type type of groups to be fetched.
    * @param {number} options.startIndex start Index of the result
    * @param {number} options.limit number of records starting from start index. 
    * @param {function} callback callback in error first style
    * 
    */
     getGroupDetailByType: function(options,callback){
        var formData = "type=" + options.type + "&startIndex=" +options.startIndex + "&limit=" + options.limit;
        $applozic.ajax({
            url: MCK_BASE_URL + "/rest/ws/group/bytype",
            type: "get",
            data: formData,
            contentType: "application/json",
            success: function (result) {
                callback(null,result);
            },error:function(err){
                callback(err);
            }
        });
     },
   
    /**
     * create a group in applozic and Kommunicate db
     * @param {Object} conversationDetail
     * @param {String} conversationDetail.groupName
     * @param {Number} conversationDetail.type
     * @param {String} conversationDetail.agentId
     * @param {Object} conversationDetail.users
     * @param {String} conversationDetail.clientGroupId
     */
     createConversation : function(conversationDetail,callback){
        $applozic.fn.applozic("createGroup", {
            createUrl:Kommunicate.getBaseUrl()+"/conversations/create",
            groupName: conversationDetail.groupName,
            type: conversationDetail.type,
            admin: conversationDetail.agentId,
            users: conversationDetail.users,
            clientGroupId:conversationDetail.clientGroupId,
            metadata: {
                CREATE_GROUP_MESSAGE: "",
                REMOVE_MEMBER_MESSAGE: "",
                ADD_MEMBER_MESSAGE: "",
                JOIN_MEMBER_MESSAGE: "",
                GROUP_NAME_CHANGE_MESSAGE: "",
                GROUP_ICON_CHANGE_MESSAGE: "",
                GROUP_LEFT_MESSAGE: "",
                DELETED_GROUP_MESSAGE: "",
                GROUP_USER_ROLE_UPDATED_MESSAGE: "",
                GROUP_META_DATA_UPDATED_MESSAGE: "",
                CONVERSATION_ASSIGNEE: conversationDetail.agentId,
                KM_CONVERSATION_TITLE:conversationDetail.groupName,
                //ALERT: "false",
                HIDE: "true"
            },
            callback: function (response) {
                console.log("response", response);
                if (response.status === 'success' && response.data.clientGroupId) {
                    response.updated ? callback(response.data.value) :
                        Kommunicate.createNewConversation({
                            "groupId": response.data.value,
                            "participentUserId": kommunicate._globals.userId,
                            "defaultAgentId": conversationDetail.agentId,
                            "applicationId": kommunicate._globals.appId
                        }, function (err, result) {
                            console.log(err, result);
                            if (!err) {
                                callback(response.data.value);
                            }
                        })
                }
            }
        });
     },
     /**get the third party settings access key
      * @param {Object} options
      * @param {String} options.appId
      * @param {Number} options.type
      * @param {function} callback
      */
     getThirdPartySettings:function(options,callback){
        $applozic.ajax({
            url:  Kommunicate.getBaseUrl()+ "/integration/settings/"+options.appId+"?type="+options.type,
            type: "get",
            contentType: "application/json",
            success: function (result) {
                callback(null,result);
            },error:function(err){
                callback(err);
            }
        });  

     }
 }

