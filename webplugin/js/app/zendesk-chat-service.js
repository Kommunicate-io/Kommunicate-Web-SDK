function ZendeskChatService() {
    var _this = this;
    var ZENDESK_SDK_INITIALIZED = false;
    var ZENDESK_API_KEY = "";
    
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
        s.src = "https://dev.zopim.com/web-sdk/latest/web-sdk.js";
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
            zChat.on("chat", function (e) {
                window.console.log('[ZendeskChat] zChat.on("chat") ', e);
            });
        }
    };
};
