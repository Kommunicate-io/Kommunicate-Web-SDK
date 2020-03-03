/**
 * all network call. 
 * methods take parameters, make network call, and execute call back on success/error.
 * all methods are attached to Kommunicate.client
 */

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
        window.Applozic.ALApiService.ajax({
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
     * @param {Boolean} conversationDetail.isMessage
     * @param {Boolean} conversationDetail.isInternal
     */
     createConversation : function(conversationDetail,callback){
        var chatContext =  $applozic.extend(Kommunicate.getSettings("KM_CHAT_CONTEXT"),conversationDetail.metadata ?conversationDetail.metadata["KM_CHAT_CONTEXT"]:{});

        var userLocale = kommunicate._globals.userLocale;
        var currentLanguage = {
            'kmUserLocale': userLocale ? userLocale.split("-")[0] : (window.navigator.language || window.navigator.userLanguage).split('-')[0]
        };
        chatContext = $applozic.extend(chatContext, currentLanguage);

        var groupMetadata = {
            CREATE_GROUP_MESSAGE: "",
            REMOVE_MEMBER_MESSAGE: "",
            ADD_MEMBER_MESSAGE: "",
            JOIN_MEMBER_MESSAGE: "",
            GROUP_NAME_CHANGE_MESSAGE: "",
            GROUP_ICON_CHANGE_MESSAGE: "",
            GROUP_LEFT_MESSAGE: "",
            CONVERSATION_STATUS: -1,
            DELETED_GROUP_MESSAGE: "",
            GROUP_USER_ROLE_UPDATED_MESSAGE: "",
            GROUP_META_DATA_UPDATED_MESSAGE: "",
            CONVERSATION_ASSIGNEE: conversationDetail.assignee || conversationDetail.agentId,
            KM_CONVERSATION_TITLE: conversationDetail.groupName,
            //ALERT: "false",
            HIDE: "true",
            SKIP_ROUTING: conversationDetail.skipRouting ? conversationDetail.skipRouting : false,
            KM_CHAT_CONTEXT: JSON.stringify(chatContext),
            GROUP_CREATION_URL: parent.location.href
        };

        conversationDetail.metadata.KM_ORIGINAL_TITLE && (groupMetadata.KM_ORIGINAL_TITLE = true);
        conversationDetail.skipBotEvent && (groupMetadata.SKIP_BOT_EVENT = conversationDetail.skipBotEvent);
        conversationDetail.customWelcomeEvent && (groupMetadata.CUSTOM_WELCOME_EVENT = conversationDetail.customWelcomeEvent);

        // Add welcome message in group metadata only if some value for it is coming in conversationDetails parameter.
        conversationDetail.metadata && conversationDetail.metadata.WELCOME_MESSAGE && (groupMetadata.WELCOME_MESSAGE = conversationDetail.metadata.WELCOME_MESSAGE);

        var groupOptions = {
            //createUrl:Kommunicate.getBaseUrl()+"/conversations/create",
            groupName: conversationDetail.groupName,
            type: conversationDetail.type,
            admin: conversationDetail.agentId,
            users: conversationDetail.users,
            clientGroupId: conversationDetail.clientGroupId,
            isMessage: conversationDetail.isMessage,
            isInternal: conversationDetail.isInternal,
            metadata: groupMetadata,
            allowMessagesViaSocket: conversationDetail.allowMessagesViaSocket || false,
            callback: function (response) {
                console.log("response", response);
                if (response.status === 'success' && response.data.clientGroupId) {
                    if (typeof callback == 'function') {
                        callback(response.data.value);
                    }
                    KommunicateUI.hideFaq();
                    KommunicateUI.showClosedConversationBanner(false);
                    /* conversation table migrated to Applozic
                     Kommunicate.createNewConversation({
                         "groupId": response.data.value,
                         "participantUserId": kommunicate._globals.userId,
                         "defaultAgentId": conversationDetail.agentId,
                         "applicationId": kommunicate._globals.appId
                     }, function (err, result) {
                         console.log(err, result);
                         if (!err) {
                             callback(response.data.value);
                         }
                     })*/
                }
            }
        };
        if (conversationDetail.agentId && groupMetadata.SKIP_ROUTING) {
            groupOptions.admin = conversationDetail.agentId;
            groupOptions.users.push({
                userId: conversationDetail.agentId,
                groupRole: 1
            });
            groupOptions.users.push({
                userId: "bot",
                groupRole: 2
            });
        }
        $applozic.fn.applozic("createGroup", groupOptions);
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

