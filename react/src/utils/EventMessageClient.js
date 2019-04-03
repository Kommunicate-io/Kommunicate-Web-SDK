import EventMessages from './event-messages';
import CommonUtils from './CommonUtils';

const EventMessageClient = { 

    getClientGroupId: function(userId) {
        return "km-onboarding-" + userId;
    },
    
    setupEventMessageGroup: function(userId) {
        let _this = this;
        let clientGroupId = this.getClientGroupId(userId);
        KommunicateGlobal.Applozic.ALApiService.getGroupInfo({
            data: {
                clientGroupId: clientGroupId,
            },
            success: function (response) { 
                if (response.status == "error") {                    
                    var conversationDetail = {
                        "clientGroupId": clientGroupId,
                        "botIds": ["kommunicate-support-bot"], // Optional. Pass the bot IDs of the bots you want to add in this conversation.
                        "skipRouting":"true", // Optional. If this parameter is set to 'true', then routing rules will be skipped for this conversation.
                        "assignee":"kommunicate-support-bot", // Optional. You can asign this conversation to any agent or bot. If you do not pass the ID. the conversation will assigned to the default agent.
                        "skipBotEvent":'["WELCOME_EVENT"]'
                    };
                    Kommunicate.startConversation(conversationDetail, function (response) {
                        console.log("new conversation created");
                        _this.sendEventMessage('welcome-post-signup');
                    });                    
                } else {
                    console.log("onboarding group exists");
                }
            },
            error: function () { }
        });
    },

    sendEventMessage: function(trigger) {
        if (!EventMessages[trigger]) {
          return;
        }
    
        KommunicateGlobal.Applozic.ALApiService.sendMessage({
          data: {
              message: {
                  "type": 5,
                  "contentType": 10,
                  "message": "Event: " + trigger,
                  "clientGroupId": this.getClientGroupId(CommonUtils.getUserSession().userName),
                  "metadata": {"category": "HIDDEN", "KM_TRIGGER_EVENT": trigger},
                  "source": 1
              }
          },
          success: function (response) { 
            console.log(response); 
          },
          error: function () { }
        });
      },
}

export default EventMessageClient;