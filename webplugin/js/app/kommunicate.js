
/**
 * all methods exposed to  users. 
 */

// above code will expose below function from iframe window to browser window.
var KOMMUNICATE_VERSION = window.kommunicate.version;
KOMMUNICATE_VERSION === "v2" && (parent.Kommunicate = window.Kommunicate);

$applozic.extend(true,Kommunicate,{
    getBaseUrl: function () {
       return KM_PLUGIN_SETTINGS.kommunicateApiUrl;
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
        kommunicateCommons.setWidgetStateOpen(true);
        params = typeof params == 'object' ? params : {};
        params = Kommunicate.updateConversationDetail(params);
        if (!params.agentId && !params.agentIds) {
            params.agentId = KommunicateUtils.getDataFromKmSession('appOptions').agentId;
        }
        var user = [{ "userId": "bot", "groupRole": 2 }];
        if (params.agentIds) {
            for (var i = 0; i < params.agentIds.length; i++) {
                user.push({ "userId": params.agentIds[i], "groupRole": 1 });
            }
        } else {
            user.push({ "userId": params.agentId, "groupRole": 1 });
        }
        if (params.botIds) {
            for (var i = 0; i < params.botIds.length; i++) {
                user.push({ "userId": params.botIds[i], "groupRole": 2 });
            }
        }
        var groupName = params.conversationTitle || params.groupName || kommunicate._globals.conversationTitle || kommunicate._globals.groupName || kommunicate._globals.agentId;
        var assignee = params.defaultAssignee || params.assignee || params.agentId;

        var groupMetadata = {};

        ((typeof params.metadata == "object"  && typeof params.metadata['KM_CHAT_CONTEXT'] == "object")) && (groupMetadata.KM_CHAT_CONTEXT = params.metadata['KM_CHAT_CONTEXT']);

        params.WELCOME_MESSAGE && (groupMetadata.WELCOME_MESSAGE = params.WELCOME_MESSAGE);

        var conversationDetail = {
            "groupName": groupName,
            "type": 10,
            "agentId": params.agentId,
            "assignee": assignee,
            "users": user,
            "clientGroupId": params.clientGroupId,
            "isMessage": params.isMessage,
            "isInternal": params.isInternal,
            "skipRouting": params.skipRouting,
            "skipBotEvent": params.skipBotEvent,
            "metadata": groupMetadata
        }
        Kommunicate.client.createConversation(conversationDetail, callback);
    },
    updateConversationDetail: function(conversationDetail){
        var kommunicateSettings = KommunicateUtils.getDataFromKmSession("settings");
        if ((typeof kommunicateSettings === "undefined" || kommunicateSettings === null)) {
            return conversationDetail;
        };
         // Update welcome message only if some value for it is coming in conversationDetails parameter or kommunicateSettings.
        conversationDetail.WELCOME_MESSAGE = conversationDetail.WELCOME_MESSAGE || kommunicateSettings.WELCOME_MESSAGE;
        conversationDetail.defaultAssignee = conversationDetail.assignee || kommunicateSettings.defaultAssignee;
        conversationDetail.agentIds = conversationDetail.agentIds || kommunicateSettings.defaultAgentIds;
        conversationDetail.botIds = conversationDetail.botIds || kommunicateSettings.defaultBotIds;
        conversationDetail.skipRouting = conversationDetail.skipRouting || kommunicateSettings.skipRouting;
        conversationDetail.skipBotEvent = conversationDetail.skipBotEvent || kommunicateSettings.skipBotEvent;

        return conversationDetail;
    },
    openConversationList: function () {
        kommunicateCommons.setWidgetStateOpen(true);
        window.$applozic.fn.applozic('loadTab', '');
        KommunicateUI.showChat();
        KommunicateUI.hideFaq();
    },
    openConversation: function (groupId) {
        kommunicateCommons.setWidgetStateOpen(true);
        window.$applozic.fn.applozic('loadGroupTab', groupId);
        KommunicateUI.hideFaq();
    },
    openDirectConversation: function (userId) {
        kommunicateCommons.setWidgetStateOpen(true);
        window.$applozic.fn.applozic('loadTab', userId);
        KommunicateUI.showChat(); 
        KommunicateUI.hideFaq();


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
        var loggedInUserName= kommunicate._globals.userId || KommunicateUtils.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID);
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
    logout: function () {
        if (typeof window.$applozic !== "undefined" && typeof window.$applozic.fn !== "undefined" && typeof window.$applozic.fn.applozic !== "undefined") {
            window.$applozic.fn.applozic('logout');
        };
        KommunicateUtils.deleteUserCookiesOnLogout();
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
            url: Kommunicate.getBaseUrl() + "/applications/"+options.applicationId+"/awaymessage?conversationId="+options.conversationId+"&languageCode="+options.languageCode,
            type: "get",
            contentType: "application/json",
            success: function (result) {
                // console.log("got away message data");
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
                KommunicateUtils.setCookie({"name":KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,"value": newUserId,expiresInDays:30,domain:KommunicateUtils.getDomainFromUrl()});
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
    appendEmailToIframe:function (message){
        var richText = Kommunicate.isRichTextMessage(message.metadata) || message.contentType == 3;
        if(richText && message.source === 7){
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
    isAttachment: function(msg) {
        return (typeof msg.fileMeta === "object" && msg.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ATTACHMENT) || msg.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.LOCATION; 
    },
    getContainerTypeForRichMessage: function (message) {
        // this method is obsolete, not in use. use km-div-slider to get slide effect
        var metadata = message.metadata;
        var sliderClass = "km-slick-container ";
        ((metadata.templateId == KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL && metadata.payload && metadata.payload.length > 1) && (sliderClass += "km-slider-multiple-cards-container"));
        if (metadata.templateId) {
            switch (metadata.templateId) {
                // add template Id to enable slick effect
                // 2 for get room pax info template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.HOTEL_BOOKING_CARD:
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_DETAIL:
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
                    return sliderClass;
                    break;
                case "6":
                    return "km-border-less-container";
                    break;

                default:
                    return "km-fixed-container";
                    break;

            }
        }else if (message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.TEXT_HTML && message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR) {
            return "km-fixed-container";
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
        $applozic.fn.applozic('sendGroupMessage', messagePxy);

    },
    getRichTextMessageTemplate: function (message) {
        var metadata = message.metadata;
        if (metadata.templateId) {
            switch (metadata.templateId) {
                // 1 for get room pax info template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_COUNT:
                    return Kommunicate.markup.getHotelRoomPaxInfoTemplate();
                    break;
                //2 for hotel card template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.HOTEL_BOOKING_CARD:

                    return Kommunicate.markup.getHotelCardContainerTemplate(JSON.parse(metadata.hotelList || "[]"), metadata.sessionId);
                    break;
                // 3 for button container
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.LINK_BUTTON:
                    return Kommunicate.markup.buttonContainerTemplate(metadata);
                    break; 
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.PASSENGER_DETAIL:
                    return Kommunicate.markup.getPassangerDetail(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_DETAIL:
                    return Kommunicate.markup.getRoomDetailsContainerTemplate(JSON.parse(metadata.hotelRoomDetail || "[]"), metadata.sessionId);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY:
                    return Kommunicate.markup.quickRepliesContainerTemplate(metadata, KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.LIST:
                    return Kommunicate.markup.getListContainerMarkup(metadata);
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.DIALOG_BOX:
                    return Kommunicate.markup.getDialogboxContainer(metadata);
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.IMAGE:
                    return Kommunicate.markup.getImageContainer(metadata);
                    break;    
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
                    return Kommunicate.markup.getCarouselMarkup(metadata);
                    break;
                default:
                    return "";
                    break;
            }
        }else if (message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.TEXT_HTML && message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR) {
            return Kommunicate.markup.getHtmlMessageMarkups(message); 
        }    
        else {
            return "";
        }
    },
    /*
       updateSettings parameters 
       1. defaultAssignee [single value]
       2. defaultAgentIds [multiple values]
       3. defaultBotIds [multiple values]
       4. skipRouting [boolean]
       5. skipBotEvent [multiple values]
       6. KM_CHAT_CONTEXT
       7. WELCOME_MESSAGE
   */
    updateSettings:function(options){
        let type = typeof options;
        if(type !='object'){
            throw new error("update settings expects an object, found "+type);
        }
        var settings = KommunicateUtils.getDataFromKmSession("settings");
        settings=  settings?settings:{}

        for (var key in options){
            settings[key]= options[key];
        }
        KommunicateUtils.storeDataIntoKmSession("settings",settings);
    },
    getSettings:function(setting){
        return KommunicateUtils.getSettings(setting);
    },
    updateChatContext : function(options){
        if(typeof options == 'object'){
            var chatContext = KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
            for (var key in options){
                chatContext[key]= options[key];
            }
        Kommunicate.updateSettings({"KM_CHAT_CONTEXT": chatContext});
        }else{
            console.info("can not update chat context, expected data type is 'object', found ",(typeof chatContext));
        }
    },
    updateUserLanguage: function(languageCode){
        var chatContext = KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
        chatContext[KommunicateConstants.SETTINGS.KM_USER_LANGUAGE_CODE] =languageCode;
        Kommunicate.updateChatContext(chatContext);
    },
    setDefaultIframeConfigForOpenChat: function (isPopupEnabled) {
        !kommunicateCommons.checkIfDeviceIsHandheld() && kommunicateCommons.modifyClassList( {id : ["mck-sidebox"]}, "popup-enabled","");
        var kommunicateIframe = parent.document.getElementById("kommunicate-widget-iframe");
        var kommunicateIframeDocument = kommunicateIframe.contentDocument;
        var popUpcloseButton = kommunicateIframeDocument.getElementById("km-popup-close-button");
        kommunicateIframe.style.width = '';
        kommunicateIframe.classList.remove('km-iframe-notification','km-iframe-closed');
        isPopupEnabled ? ( kommunicateIframe.classList.add('km-iframe-dimension-with-popup') , popUpcloseButton.style.display = 'flex' ) : kommunicateIframe.classList.add('km-iframe-dimension-no-popup');
        kommunicateIframe.classList.add('kommunicate-iframe-enable-media-query');
    },

    // add css to style component in window
    customizeWidgetCss : function (classSettings) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = classSettings;
            document.getElementsByTagName('head')[0].appendChild(style);
    },

    // subscribe to custom events
    subscribeToEvents : function (events) {
        $applozic.fn.applozic('subscribeToEvents', events);
    },
    /**
     * 
     * @param {String} timezone 
     */
    updateUserTimezone: function(timezone){
        if (KommunicateUtils.isValidTimeZone(timezone)){
            var chatContext = KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
            chatContext[KommunicateConstants.SETTINGS.KM_USER_TIMEZONE] = timezone;
            Kommunicate.updateChatContext(chatContext);
        } 
    }
});
