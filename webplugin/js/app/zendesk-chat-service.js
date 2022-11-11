var newConversationCreated = false;

function ZendeskChatService() {
    // This integration is supported by zopim, for any apis please refer their docs.
    var _this = this;
    var ZENDESK_SDK_INITIALIZED = false;
    var ZENDESK_SDK_CONNECTED = false;
    var ZENDESK_CHAT_SDK_KEY = "";
    var AGENT_INFO_MAP = {};
    var preChatLeadData = {};
    var phoneNumber = "";
    var messagesInBuffer = [];
    var userJWT = "";
    

    _this.init = function (zendeskChatSdkKey, preChatData) {
        ZENDESK_CHAT_SDK_KEY = zendeskChatSdkKey;
        preChatLeadData = preChatData;
        phoneNumber = preChatLeadData.contactNumber;
        _this.loadZopimSDK();
        var events = {
            'onMessageSent': _this.handleUserMessage,
            'onMessageReceived': _this.handleBotMessage,
        };
        Kommunicate.subscribeToEvents(events);

        var restartConversation = document.getElementById(
            'mck-restart-conversation'
        );
        restartConversation.addEventListener('click', function () {
            Kommunicate.startConversation(); 
            console.log("Inside addEventListener");
        })

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

    _this.initializeSDK = function () {
        if (!ZENDESK_SDK_INITIALIZED && ZENDESK_CHAT_SDK_KEY) {
            var zendeskInitOptions = {
                account_key: ZENDESK_CHAT_SDK_KEY,
            }
            var name = preChatLeadData.displayName;
            var email = preChatLeadData.email;
            var externalId = preChatLeadData.userId;
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
                                userJWT = result.data.jwt;
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
            zChat.on('connection_update', _this.handleZopimConnectedStatus);
            zChat.on("chat", _this.zopimEvents);
        }
    };

    _this.handleZopimConnectedStatus = function (status) {
        if (status === 'connected') {
            ZENDESK_SDK_CONNECTED = true;
            console.log("SDK Connected");
            messagesInBuffer.length && messagesInBuffer.map(messageEvent => {
                console.log("handleUserMessage: ", messageEvent);
                _this.sendMessageToZendesk(messageEvent);                
            });
            messagesInBuffer = [];
        }
    }
    _this.zopimEvents = function b(eventDetails) {
        _this.updateNumberInZopim();
        console.log('[ZendeskChat] zChat.on("chat") ', eventDetails);
        if (eventDetails.type == "chat.msg") { //If agent sends normal message
            _this.handleZendeskAgentMessageEvent(eventDetails);
        } else if (eventDetails.type == "chat.file") { //If agent sends file attachments
            _this.handleZendeskAgentFileSendEvent(eventDetails);
        } else if (eventDetails.type == "chat.memberleave") { //If agent leaves conversation
            _this.handleZendeskAgentLeaveEvent(eventDetails);
        }
    }
    _this.updateNumberInZopim = function() {
        if(phoneNumber && zChat.getVisitorInfo().phone != phoneNumber){
            zChat.setVisitorInfo({ phone: phoneNumber }, function(err) {
                if (!err) {
                     console.log(zChat.getVisitorInfo());
                }
            });
        }
    };
    _this.handleUserMessage = function (event) {
        if (!event.message || !ZENDESK_SDK_INITIALIZED) {
            return;
        }

        _this.sendMessageToZendesk(event)
    };

    _this.sendMessageToZendesk = (messageEvent) => {
        if (!ZENDESK_SDK_CONNECTED) {
            messagesInBuffer.push(messageEvent);
            return;
        }  

        if (messageEvent.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT) {
            zChat.sendChatMsg(messageEvent.message.message, function (err, data) {
                console.log("zChat.sendChatMsg ", err, data)
            });
        } else if (messageEvent.message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ATTACHMENT) {

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
            newConversationCreated = true;
            _this.initializeSDK();
            ZENDESK_SDK_INITIALIZED = true;

            _this.sendMessageToZendesk({
                message: {
                    contentType: KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT,
                    message: 'This chat is initiated from kommunicate widget, look for more here: ' +
                                KM_PLUGIN_SETTINGS.dashboardUrl +
                                '/conversations/' +
                                CURRENT_GROUP_DATA.tabId
                }
            });

            //Sending chat transcript        
            kommunicate.client.getChatListByGroupId({ 
                groupId: CURRENT_GROUP_DATA.tabId 
            }, function(err, result) {
                if (err || !result) {
                    console.log('An error occurred while fetching chatList ',err);
                    return;
                }

                var messageListDetails = result.message;
                var userDetails = result.userDetails;
                console.log("userDetails are ",userDetails);

                var userId = kommunicate._globals.userId;

                var currentGroupData = MCK_GROUP_MAP[CURRENT_GROUP_DATA.tabId];

                var transcriptString = "Transcript:\n";

                for (var i = messageListDetails.length-2; i >= 0 ; i--) {
                    var currentMessageDetail = messageListDetails[i];
                    
                    var username = "";

                    if (currentMessageDetail.to === userId) {
                        username = "User";
                    } else {
                        //Get bot name
                        username = _this.getBotNameById(currentMessageDetail.to, userDetails);
                    }

                    var message = _this.getMessageForTranscript(currentMessageDetail);

                    if (username && message) {
                        transcriptString += username + ": " + message + "\n";
                    }
                }

                console.log(transcriptString);
               
                _this.sendMessageToZendesk({
                    message: {
                        contentType: KommunicateConstants.MESSAGE_CONTENT_TYPE.DEFAULT,
                        message: transcriptString
                    }
                });
            });
        }
    };

    _this.getBotNameById = function(botId, userDetails) {
        for (var i = 0; i<userDetails.length; i++) {
            var currentUserDetail = userDetails[i];
            if (currentUserDetail.userId == botId) {
                return currentUserDetail.userName;
            }
        }
        return "";
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
        var agentId = event.nick.replace(":", "-")
        if (!AGENT_INFO_MAP[agentId]) {
            AGENT_INFO_MAP[agentId] = {
                displayName: event.display_name,
                agentId: agentId
            }
        }
        console.log("AGENT_INFO_MAP", AGENT_INFO_MAP);

        var messagePxy = {
            message: event.msg,
            fromUserName: agentId,
            groupId: CURRENT_GROUP_DATA.tabId,
            agentInfo: AGENT_INFO_MAP[agentId]
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
        var agentId = event.nick.replace(":", "-")
        if (!AGENT_INFO_MAP[agentId]) {
            AGENT_INFO_MAP[agentId] = {
                displayName: event.display_name,
                agentId: agentId
            }
        }

        console.log("AGENT_INFO_MAP file", AGENT_INFO_MAP);
        
        var messagePxy = {
            fileAttachment: event.attachment,
            fromUserName: agentId,
            groupId: CURRENT_GROUP_DATA.tabId,
            auth: window.Applozic.ALApiService.AUTH_TOKEN,
            agentInfo: AGENT_INFO_MAP[agentId]
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

    };

    _this.handleZendeskAgentLeaveEvent = function (event) {
        //Resolve conversation on widget
        KommunicateUI.showClosedConversationBanner(
            true
        );
        KommunicateUI.isConvJustResolved = true;
        KommunicateUI.isConversationResolvedFromZendesk = true;
        
        //Call API to resolve the conversation on Dashboard
        kommunicate.client.resolveConversation({ 
            groupId: CURRENT_GROUP_DATA.tabId 
        }, function(err, result) {
            if (err || !result) {
                console.log("An error occurred while resolving conversation ",err);
                return;
            }
            console.log("Resolved conversation on Kommunicate Dashboard", result);

            zChat.un('chat', _this.zopimEvents);
            zChat.un('connection_update', _this.handleZopimConnectedStatus);
            zChat.logout();
            
            ZENDESK_SDK_INITIALIZED = false;
            ZENDESK_SDK_CONNECTED = false;
        });
    }; 
};


var onTabClickedHandlerForZendeskConversations = function (event) {
    console.log("onTabClicked from zendesk: ", event, MCK_GROUP_MAP[event.tabId]);
    if (kommunicate._globals.zendeskChatSdkKey) {
        var currentGroupData = MCK_GROUP_MAP[event.tabId];
        var conversationInfo = {
            groupId: event.tabId,
            metadata: {
                "source" : "zopim"
            }
        }
        Kommunicate.updateConversationMetadata(conversationInfo);
        var assigneeInfo = currentGroupData && currentGroupData.users && Object.values(currentGroupData.users).find(function (member) {
            return member.userId == currentGroupData.metadata.CONVERSATION_ASSIGNEE
        })
        if (!newConversationCreated && assigneeInfo.role != KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT) {
            console.log("currentGroupData ", currentGroupData, assigneeInfo, newConversationCreated);
            newConversationCreated = true;
            Kommunicate.startConversation();
        }
    }
};