
/**
 * all methods exposed to  users. 
 */
$applozic.extend(true,Kommunicate,{
    getBaseUrl: function () {
        switch (MCK_BASE_URL) {
            case "https://apps-test.applozic.com/":
            case "https://apps-test.applozic.com":
                return "https://api-test.kommunicate.io";
                //return "http://localhost:3999"
            default:
                return "https://api.kommunicate.io";
        }
    },
    setDefaultAgent: function (agentName) {
        //kommunicate.defaultAgent  = agentName;
        throw new Error("not implemented");
    },
    getConversationOfParticipent: function (options, callback) {
        if (typeof (callback) !== 'function') {
            throw new Error("invalid callback! expected: Kommunicate.startNewConversation(options, callback) ");
        }
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + "/conversations/participent/" + options.userId,
            type: "get",
            success: function (result) {
                callback(null, result);
            },
            error: function (err) {
                callback(err);
            }
        });
    },
    startConversation: function (params, callback) {
        var user=[{"userId":params.agentId,"groupRole":1},{"userId":"bot","groupRole":2}];
    
        if(params.botIds){
            for (var i = 0; i < params.botIds.length; i++) {
                user.push({"userId":params.botIds[i],"groupRole":2});
            }
        }
        var groupName = params.groupName||kommunicate._globals.conversationTitle||kommunicate._globals.groupName||kommunicate._globals.agentId;
       var conversationDetail = {
           "groupName": groupName,
           "type":10,
           "agentId":params.agentId,
           "users": user,
           "clientGroupId":params.clientGroupId
       }
       
        Kommunicate.client.createConversation(conversationDetail,callback);
    },
    openConversationList: function () {
        window.$applozic.fn.applozic('loadTab', '');
        KommunicateUI.showChat();
    },
    openConversation: function (groupId) {
        window.$applozic.fn.applozic('loadGroupTab', groupId);
    },
    openDirectConversation: function (userId) {
        window.$applozic.fn.applozic('loadTab', userId);
        KommunicateUI.showChat();
    },
    /**
     * load conversation will open or create a conversation between existing users. 
     * it generate clientGroupId from the given conversationDetail, if any group exists with that Id opens that otherwise it will call creatge group API.
     * it will not open the group created by createConversation API. 
     * @param {Object}  conversationDetail
     * @param {Array} conversationDetail.agentIds required parameter
     * @param {Array} conversationDetail.botIds  optional parameter
     */
    loadConversation:function(conversationDetail,callback){
        var agentList = (conversationDetail.agentIds||[]).sort(function(a, b){
            if( a.toLowerCase()< b.toLowerCase()) return -1;
            if(a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });
        console.log("agent list ",agentList);
        var botList = conversationDetail.botIds||[];
        
        if(agentList.length <1){
            var error ={code:"INVALID_PARAMETERS",message:"required parameter agentIds is missing."}
            return typeof callback == 'function'? callback(error):console.log("required parameter agentIds is missing.");
        }
        // max length of clientGroupId is 256 in db. 
        // default bot is not included in client groupId generation
        var loggedInUserName= kommunicate._globals.userId || KommunicateUtils.getCookie("kommunicate-id");
        var agentsNameStr = agentList.join("_");

        var botsNameStr =  botList.join("_");
       var clientGroupId =  encodeURIComponent(botsNameStr?[agentsNameStr,loggedInUserName,botsNameStr].join("_"):[agentsNameStr,loggedInUserName].join("_"));
        if(clientGroupId.length>256){
            var error ={code:"MEMBER_LIMIT_EXCEEDS",message:"try adding fewer members"}

            return typeof callback == 'function'? callback(error):console.log("member limit exceeds. try adding fewer members");
        }
        mckGroupService.getGroupFeed({
            'clientGroupId': clientGroupId,
            'apzCallback': function(result){
                if(result.status=='error'&&result.code=='AL-G-01'){
                    // group not found. createing new group
                    var users=agentList.map(function(item){
                        return {"userId":item,"groupRole":1}
                    });
                    users.push({"userId":"bot","groupRole":2});
                    users.push(botList.map(function(item){
                        return {"userId":item,"groupRole":2}
                    }));
                      var conversationDetail = {
                        "groupName": kommunicate._globals.conversationTitle||kommunicate._globals.groupName||kommunicate._globals.agentId,
                        "type":10,
                        "agentId":users[0].userId,
                        "users": users,
                        "clientGroupId":decodeURIComponent(clientGroupId)
                    }
                    Kommunicate.client.createConversation(conversationDetail,function(result){
                        if(callback){
                        return callback(null,result);
                        }
                    });
                }else if(result.status=='success'){
                 // group exist with clientGroupId
                 var groupId = result.data.id;
                 $applozic.fn.applozic('loadGroupTab',groupId);
                 return callback(null, result);
                }
               

            }
        });
    },
    createGroupName: function(group){
       return group.sort().join().replace(/,/g, "_").substring(0, 250);
    },
    openLastConversation: function (params) {
        var conversationDetail = params;
        var user = [];
        var group = [];
        group.push(params.agentId);
        group.push(kommunicate._globals.userId);
        user.push({ "userId": params.agentId, "groupRole": 1 });
        user.push({ "userId": "bot", "groupRole": 2 });
        if (params.botIds) {
            console.log(params.botIds);
            for (var i = 0; i < params.botIds.length; i++) {
                user.push({ "userId": params.botIds[i], "groupRole": 2 });
                group.push(params.botIds[i]);
            }
        }
        var groupName = Kommunicate.createGroupName(group);
        var groupDetail = {};
        groupDetail.groupName = groupName;
        groupDetail.callback = function (response) {
            if(response.data.groups.length > 0){
              console.log("already have a group");
              Kommunicate.openConversation(response.data.groups[0].id);
            }else{
              console.log("new user");
            Kommunicate.startConversation(conversationDetail, function (response) {
            });
            }
        }
        window.$applozic.fn.applozic('getGroupListByFilter', groupDetail);
    },
    /**
     * creating conversation entry in kommuncate db.
     */
    createNewConversation: function (options, callback) {
        if (typeof (callback) !== 'function') {
            throw new Error("invalid callback! expected: Kommunicate.startNewConversation(options, callback) ");
        }
        let data = {
            "groupId": options.groupId,
            "participantUserId": options.participantUserId,
            "createdBy": options.participantUserId,
            "defaultAgentId": options.defaultAgentId,
            "applicationId": options.applicationId,
        }
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + "/conversations",
            type: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (result) {
                console.log("conversation started successfully");
                callback(null, result);
            },
            error: function (err) {
                console.log("err while starting Conversation");
                callback(err);
            }
        });
    },
    logout: function (event, options) {
        if (typeof window.$kmApplozic !== "undefined" && typeof window.$kmApplozic.fn !== "undefined" && typeof window.$kmApplozic.fn.applozic !== "undefined" && window.$kmApplozic.fn.applozic("getLoggedInUser")) {
            window.$kmApplozic.fn.applozic('logout');
        }
        if (typeof window.$applozic !== "undefined" && typeof window.$applozic.fn !== "undefined" && typeof window.$applozic.fn.applozic !== "undefined" && window.$applozic.fn.applozic("getLoggedInUser")) {
            window.$applozic.fn.applozic('logout');
        }
        sessionStorage.clear();
        localStorage.clear();
    },
    launchConversation: function () {
        window.$applozic.fn.applozic("mckLaunchSideboxChat");
    },
    triggerEvent: function (event, options) {
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + "/applications/events?type=" + event,
            type: "post",
            data: JSON.stringify({ "conversationId": options.groupId, "applicationId": options.applicationId }),
            contentType: "application/json",
            success: function (result) {
                console.log("conversation triggering event");
            },
            error: function (err) {
                console.log("err while starting Conversation");
            }
        });
    }, updateUser: function (options) {
        var data ={data:options};
        window.$applozic.fn.applozic('updateUser', data);
    },getAwayMessage:function(options, callback){
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + "/applications/"+options.applicationId+"/awaymessage?conversationId="+options.conversationId,
            type: "get",
            contentType: "application/json",
            success: function (result) {
                console.debug("got away message data");
                typeof callback =='function'?callback(null,result):"";
                
            },
            error: function (err) {
                console.log("err while fetching away message");
                typeof callback =='function'?callback(err):"";

            }
        });
    },
    updateUserIdentity: function (newUserId) {
        window.$applozic.fn.applozic('updateUserIdentity', {
            newUserId: newUserId, callback: function (response) {
                KommunicateUtils.setCookie('kommunicate-id', newUserId);
                if (response == 'success') {
                    window.$applozic.fn.applozic('reInitialize', { userId: newUserId });
                }
            }
        });
    },
    isRichTextMessage: function (metadata) {
        // contentType should be 300 for rich text message in metadata
        return metadata && metadata.contentType == 300;
    },
    getConatainerTypeForRichMessage: function (metadata) {
        // this method is obsolete, not in use. use km-div-slider to get slide effect
        if (metadata) {
            switch (metadata.templateId) {
                // add template Id to enable slick effect
                // 2 for get room pax info template
                case "2":
                case "4":
                    return "km-slick-container";
                    break;
                case "6":
                    return "km-border-less-container";
                    break;

                default:
                    return "km-fixed-container";
                    break;

            }
        }

    },
    processPaymentRequest: function (options) {

    },
    sendMessage: function (messagePxy) {
        var $mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner");
        var $mck_msg_to = $applozic("#mck-msg-to");

        if ($mck_msg_inner.data("isgroup") === true) {
            messagePxy.groupId = $mck_msg_to.val();
        } else {
            messagePxy.to = $mck_msg_to.val();
        }
        var chatContext = Kommunicate.getSettings("KM_CHAT_CONTEXT");
        var metadata = messagePxy.metadata||{};
        if(chatContext){
            metadata ={"KM_CHAT_CONTEXT":chatContext}
        }
        messagePxy.metadata=metadata;
        $applozic.fn.applozic('sendGroupMessage', messagePxy);

    },
    getRichTextMessageTemplate: function (metadata) {
        if (metadata) {
            switch (metadata.templateId) {
                // 1 for get room pax info template
                case "1":
                    return Kommunicate.markup.getHotelRoomPaxInfoTemplate();
                    break;
                //2 for hotel card template
                case "2":

                    return Kommunicate.markup.getHotelCardContainerTemplate(JSON.parse(metadata.hotelList || "[]"), metadata.sessionId);
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
                case "6":
                    return Kommunicate.markup.quickRepliesContainerTemplate(metadata);
                    break;
                case "7":
                    return Kommunicate.markup.getListContainerMarkup(metadata);
                    
                case "8":
                    return Kommunicate.markup.getDialogboxContainer(metadata);
                default:
                    return "";
                    break;
            }
        } else {
            return "";
        }
    },
    updateSettings:function(options){
        var settings = KommunicateUtils.getDataFromKmSession("settings");
        settings=  settings?JSON.parse(settings):{}

        for (var key in options){
            settings[key]= options[key];
        }
        KommunicateUtils.storeDataIntoKmSession("settings",JSON.stringify(settings));
    },
    getSettings:function(setting){
        var settings = KommunicateUtils.getDataFromKmSession("settings");
        settings=  settings?JSON.parse(settings):null;
        return setting&&settings?settings[setting]:(settings?settings:"");
    }

});
