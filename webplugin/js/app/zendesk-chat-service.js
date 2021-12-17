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
        if(event.message.contentType == 0){  // if customer sends normal message
            zChat.sendChatMsg(event.message.message, function (err, data) {
                window.console.log("zChat.sendChatMsg ", err, data);
            });
            // TODO look for attachment


        }else if(event.message.contentType == 1){ //if customer sends file
            window.console.log("handleUserMessage : for contentType 1");
            let {name,contentType,createdAtTime} = event.message.file;
            // let file=new File([""], event.message.file.name, {type: event.message.file.contentType, lastModified: event.message.file.createdAtTime});
            // let formData=new FormData();
            // formData.append('file',event.message.file);
            // formData.append('filename',name); 
            const parts = [
                new Blob(['you construct a file...'], {
                  type: 'text/plain'
                }),
                ' Same way as you do with blob',
                new Uint16Array([33])
              ];
              
              const file = new File(parts, name, {
                lastModified: new Date(),
                type: 'text/plain'
              });
            zChat.sendFile("5", function(err, data) {
                if(err){
                    console.error("Error while sending file attachment : ",err);
                }else{
                    console.log("File attachment sent successfully : ",data);
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
                    if (eventDetails.type == "chat.msg") {
                        _this.handleZendeskAgentMessageEvent(eventDetails);
                    }
                    else if(eventDetails.type == "chat.file"){
                        window.console.log("Inside chat.file event condition, triggering handleZendeskSendFileEvent()");
                        _this.handleZendeskAgentSendFileEvent(eventDetails);
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

    _this.handleZendeskAgentSendFileEvent= function (event) {
        window.console.log("handleZendeskSendFileEvent", event);

        fetch(event.attachment.url)
        .then(response=>{
            window.console.log("response : ",response);
            response.blob()
        })
        .then(blob=>{
            window.console.log("blob : ",blob)
        })
        let filePxy = {
            file: event.attachment.name, // need to verify this prop
            fromUserName: event.nick.split(":")[1],
            groupId: CURRENT_GROUP_DATA.tabId
        };
        let formData=new FormData();

        // return mckUtils.ajax({
        //     url: Kommunicate.getBaseUrl() + "/rest/ws/zendesk/message/send", //The url will be different
        //     type: 'post',
        //     contentType: false,
        //     processData:false,
        //     data: JSON.stringify(filePxy),
        //     headers: {
        //         'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
        //     },
        //     success: function (result) {
        //         window.console.log("result : zendesk file sending ", result);
        //         typeof callback == 'function' && callback(agentUserName);
        //     },
        //     error: function (err) {
        //         window.console.log('err while getting user details in zendesk service');
        //     },
        // });
    }
};
