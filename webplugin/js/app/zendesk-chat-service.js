function ZendeskChatService() {
    // This integration is supported by zopim, for any apis please refer their docs.
    var _this = this;
    var ZENDESK_SDK_INITIALIZED = false;
    var ZENDESK_CHAT_SDK_KEY = "";

    _this.init = function (zendeskChatSdkKey) {
        ZENDESK_CHAT_SDK_KEY = zendeskChatSdkKey;
        _this.loadZopimSDK();
        var events = {
            'onMessageSent': _this.handleUserMessage,
            'onMessageReceived': _this.handleBotMessage,
        };
        Kommunicate.subscribeToEvents(events);
        // Hide back button
        document.getElementById('mck-contacts-content').classList.add('force-n-vis');
        document.querySelector('.mck-back-btn-container').classList.add('force-n-vis');
    };

    _this.loadZopimSDK = function () {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.kommunicate.io/kommunicate/zendesk-web-sdk-1.11.2.js";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
    };

    _this.handleUserMessage = function (event) {
        if (!event.message || !ZENDESK_SDK_INITIALIZED) {
            return;
        }
        window.console.log("handleUserMessage: ", event);

        if (event.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT) {
            zChat.sendChatMsg(event.message.message, function (err, data) {
                window.console.log("zChat.sendChatMsg ", err, data)
            });
        } else if (event.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ATTACHMENT) {

            var fileInputElement = document.getElementById("mck-file-input");

            var file = fileInputElement.files[0];

            zChat.sendFile(file, function (err, data) {
                if (err) {
                    window.console.log("Error while sending file : ",err);
                } else {
                    window.console.log("File has been sent successfully : ",data);
                }
            });
        }
        
    };

    _this.handleBotMessage = function (event) {
        window.console.log("handleBotMessage: ", event);
        if (event.message.metadata.hasOwnProperty("KM_ASSIGN_TO")) {
            if (!ZENDESK_SDK_INITIALIZED && ZENDESK_CHAT_SDK_KEY) {
                zChat.init({
                    account_key: ZENDESK_CHAT_SDK_KEY,
                });
                zChat.on("chat", function (eventDetails) {
                    window.console.log('[ZendeskChat] zChat.on("chat") ', eventDetails);
                    if (eventDetails.type == "chat.msg") { //If agent sends normal message
                        _this.handleZendeskAgentMessageEvent(eventDetails);
                    } else if (eventDetails.type == "chat.file") { //If agent sends file attachments
                        _this.handleZendeskAgentFileSendEvent(eventDetails);
                    }
                });
                ZENDESK_SDK_INITIALIZED = true;
            }
            zChat.sendChatMsg(
                'This chat is initiated from kommunicate widget, look for more here: ' +
                KM_PLUGIN_SETTINGS.dashboardUrl +
                '/conversations/' +
                CURRENT_GROUP_DATA.tabId,
                function (err, data) {
                    window.console.log('zChat.sendChatMsg ', err, data);
                }
            );
        }
    };

    _this.handleZendeskAgentMessageEvent = function (event) {

        window.console.log("handleZendeskAgentMessageEvent ", event);

        var messagePxy = {
            message: event.msg,
            fromUserName: event.nick.split(":")[1],
            groupId: CURRENT_GROUP_DATA.tabId
        };

        return mckUtils.ajax({
            url: Kommunicate.getBaseUrl() + "/rest/ws/zendesk/message/send",
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(messagePxy),
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            success: function (result) {
                window.console.log("result zendesk chat get user details ", result);
                typeof callback == 'function' && callback(agentUserName);
            },
            error: function (err) {
                window.console.log('err while getting user details in zendesk service');
            },
        });
    };

    _this.handleZendeskAgentFileSendEvent= function (event) {

        window.console.log("handleZendeskAgentFileSendEvent ",event);

        var messagePxy = {
            fileAttachment: event.attachment,
            fromUserName: event.nick.split(":")[1],
            groupId: CURRENT_GROUP_DATA.tabId,
            auth: window.Applozic.ALApiService.AUTH_TOKEN
        };

        return mckUtils.ajax({
                url: Kommunicate.getBaseUrl() + "/rest/ws/zendesk/file/send",
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(messagePxy),
                headers: {
                    'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
                },
                success: function (result) {
                    window.console.log("Sent File message data to the server ", result);
                    typeof callback == 'function' && callback(agentUserName);
                },
                error: function (err) {
                    window.console.log('err while sending File message data to the server');
                },
        });
       
    }
};


var onTabClickedHandlerForZendeskConversations = function (event) {
    console.log("onTabClicked from zendesk: ", event, MCK_GROUP_MAP[event.tabId]);
    if (kommunicate._globals.zendeskChatSdkKey) {
        var currentGroupData = MCK_GROUP_MAP[event.tabId];
        var assigneeInfo = currentGroupData && currentGroupData.users && Object.values(currentGroupData.users).find(function (member) {
            return member.userId == currentGroupData.metadata.CONVERSATION_ASSIGNEE
        })
        if (assigneeInfo && assigneeInfo.role != KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT) {
            Kommunicate.startConversation();
        }
    }
};