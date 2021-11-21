function ZendeskChatService() {
    var _this = this;
    var ZENDESK_SDK_INITIALIZED = false;
    var ZENDESK_API_KEY = "";
    var AGENT_ID_USERNAME_MAP = {};
    
    _this.init = function (zendeskApiKey) {
        ZENDESK_API_KEY = zendeskApiKey;
        _this.loadZopimSDK();
        var events = {
            'onMessageSent': _this.handleUserMessage,
            'onMessageReceived': _this.handleBotMessage,
        };
        Kommunicate.subscribeToEvents(events);
    };

    _this.loadZopimSDK = function () {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://km-prod-cdn.s3.us-east-1.amazonaws.com/kommunicate/zendesk-web-sdk-1.11.2.js";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
    };

    _this.handleUserMessage = function (event) {
        if (!event.message || !ZENDESK_SDK_INITIALIZED) {
            return;
        }
        window.console.log("handleUserMessage: ", event);
        zChat.sendChatMsg(event.message.message, function (err, data) {
            window.console.log("zChat.sendChatMsg ", err, data)
        });
        // TODO look for attachment
    };

    _this.handleBotMessage = function (event) {
        window.console.log("handleBotMessage: ", event);
        if (event.message.metadata.hasOwnProperty("KM_ASSIGN_TO")) {
            if (!ZENDESK_SDK_INITIALIZED && ZENDESK_API_KEY) {
                zChat.init({
                    account_key: ZENDESK_API_KEY,
                });
                zChat.on("chat", function (eventDetails) {
                    window.console.log('[ZendeskChat] zChat.on("chat") ', eventDetails);
                    if (eventDetails.type == "chat.msg") {
                        _this.handleZendeskAgentMessageEvent(eventDetails);
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
        _this.getUserDetailsByZendeskId(event, function (agentId){
            console.log("getUserDetailsByZendeskId ", agentId, event);
            var messagePxy = {
                message: event.msg,
                fromUserName: agentId,
                groupId: CURRENT_GROUP_DATA.tabId
            };
            Kommunicate.sendMessage(messagePxy);
        });
    };

    _this.getUserDetailsByZendeskId = function (eventDetails, callback) {
        var agentId = eventDetails.nick.split(":")[1];
        if (AGENT_ID_USERNAME_MAP[agentId]) {
            callback(AGENT_ID_USERNAME_MAP[agentId]);
        } else {
            mckUtils.ajax({
                url: Kommunicate.getBaseUrl() + "/rest/ws/zendesk/users/" + agentId,
                type: 'get',
                headers: {
                    'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
                },
                success: function (result) {
                    console.log("result zendesk chat get user details ", result);
                    var agentUserName = result.data.userName;
                    AGENT_ID_USERNAME_MAP[agentId] = agentUserName;
                    typeof callback == 'function' && callback(agentUserName);
                },
                error: function (err) {
                    console.log('err while getting user details in zendesk service');
                },
            });
        }
    };
};
