var newConversationCreated = false;

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
        s.onload = function () {
            _this.initializeSDK();
        };
    };

    _this.initializeSDK = function () {
        if (!ZENDESK_SDK_INITIALIZED && ZENDESK_CHAT_SDK_KEY) {
            var zendeskInitOptions = {
                account_key: ZENDESK_CHAT_SDK_KEY,
            }
            var name = kommunicate._globals.name || kommunicate._globals.userName;
            var email = kommunicate._globals.email;
            var externalId = kommunicate._globals.userId;
            if (name && email && externalId) {
                zendeskInitOptions.authentication = {
                    jwt_fn: function (callback) {
                        var userPxy = {
                            name,
                            email,
                            externalId
                        }
                        mckUtils.ajax({
                            url: Kommunicate.getBaseUrl() + "/rest/ws/zendesk/jwt",
                            type: 'post',
                            contentType: 'application/json',
                            data: JSON.stringify(userPxy),
                            headers: {
                                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
                            },
                            success: function (result) {
                                console.log("result: ", result);
                                callback(result.data.jwt);
                            },
                            error: function (err) {
                                console.log('err while getting user details in zendesk service');
                                return;
                            },
                        });
                    }
                }
            }
            zChat.init(zendeskInitOptions);
            zChat.on("chat", function (eventDetails) {
                console.log('[ZendeskChat] zChat.on("chat") ', eventDetails);
                if (eventDetails.type == "chat.msg") { //If agent sends normal message
                    _this.handleZendeskAgentMessageEvent(eventDetails);
                } else if (eventDetails.type == "chat.file") { //If agent sends file attachments
                    _this.handleZendeskAgentFileSendEvent(eventDetails);
                }
            });
        }
    };
    _this.handleUserMessage = function (event) {
        if (!event.message || !ZENDESK_SDK_INITIALIZED) {
            return;
        }
        console.log("handleUserMessage: ", event);

        if (event.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT) {
            zChat.sendChatMsg(event.message.message, function (err, data) {
                console.log("zChat.sendChatMsg ", err, data)
            });
        } else if (event.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ATTACHMENT) {

            var fileInputElement = document.getElementById("mck-file-input");

            var file = fileInputElement.files[0];

            zChat.sendFile(file, function (err, data) {
                if (err) {
                    console.log("Error while sending file : ", err);
                } else {
                    console.log("File has been sent successfully : ", data);
                }
            });
        }

    };

    _this.handleBotMessage = function (event) {
        console.log("handleBotMessage: ", event);
        if (event.message.metadata.hasOwnProperty("KM_ASSIGN_TO")) {
            ZENDESK_SDK_INITIALIZED = true;
            zChat.sendChatMsg(
                'This chat is initiated from kommunicate widget, look for more here: ' +
                KM_PLUGIN_SETTINGS.dashboardUrl +
                '/conversations/' +
                CURRENT_GROUP_DATA.tabId,
                function (err, data) {
                    console.log('zChat.sendChatMsg ', err, data);
                }
            );

            //Sending chat transcript        
            kommunicate.client.getChatListByGroupId({ 
                groupId: CURRENT_GROUP_DATA.tabId 
            }, function(err, result) {
                if (err || !result) {
                    console.log('An error occurred while fetching chatList ',err);
                    return;
                }

                var messageListDetails = result.message;

                var userId = kommunicate._globals.userId;

                var currentGroupData = MCK_GROUP_MAP[CURRENT_GROUP_DATA.tabId];

                var transcriptString = "Transcript:\n";

                for (var i = messageListDetails.length-2; i >= 0 ; i--) {
                    var currentMessageDetail = messageListDetails[i];
                    
                    var username = "";

                    if (currentMessageDetail.to === userId) {
                        username = "User";
                    } else {
                        username = currentGroupData.displayName;
                    }

                    var message = _this.getMessageForTranscript(currentMessageDetail);

                    if (message) {
                        transcriptString += username + ": " + message + "\n";
                    }
                }

                console.log(transcriptString);

                zChat.sendChatMsg(
                    transcriptString,
                    function (err, data) {
                        console.log('sending transcript to zendesk',err, data);
                    }
                );
            });
        }
    };

    _this.getMessageForTranscript = function(message) {
        if (message.message) {
            return message.message;
        }
        if (message.fileMeta && message.fileMeta.blobKey) {
            return KM_PLUGIN_SETTINGS.applozicBaseUrl + "/rest/ws/attachment/" + message.fileMeta.blobKey;
        }
        if (message.metadata && message.metadata.templateId) {
            return "TemplateId: " + message.metadata.templateId;
        }
    };

    _this.handleZendeskAgentMessageEvent = function (event) {

        console.log("handleZendeskAgentMessageEvent ", event);

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
                console.log("result zendesk chat get user details ", result);
                typeof callback == 'function' && callback(agentUserName);
            },
            error: function (err) {
                console.log('err while getting user details in zendesk service');
            },
        });
    };

    _this.handleZendeskAgentFileSendEvent = function (event) {

        console.log("handleZendeskAgentFileSendEvent ", event);

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
                console.log("Sent File message data to the server ", result);
                typeof callback == 'function' && callback(agentUserName);
            },
            error: function (err) {
                console.log('err while sending File message data to the server');
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
        if (!newConversationCreated && assigneeInfo.role != KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT) {
            newConversationCreated = true;
            Kommunicate.startConversation();
        }
    }
};