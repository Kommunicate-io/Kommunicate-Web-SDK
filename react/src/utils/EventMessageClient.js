import EventMessages from './event-messages';
import CommonUtils from './CommonUtils';

const EventMessageClient = { 

    eventGroupSetupCompleted: false,

    isEventGroupSetupCompleted: function() { 
        return this.eventGroupSetupCompleted;
    },

    getClientGroupId: function(userId) {
        return "km-onboarding-" + userId;
    },
    
    setupEventMessageGroup: function() {
        if (!CommonUtils.getUserSession()) {
            console.log("user session not found, skipping event message group setup");
            return;
        }

        let _this = this;
        let clientGroupId = this.getClientGroupId(CommonUtils.getUserSession().userName);
        KommunicateGlobal.Applozic.ALApiService.getGroupInfo({
            data: {
                clientGroupId: encodeURIComponent(clientGroupId),
            },
            success: function (response) { 
                if (response.status == "error") {                    
                    var conversationDetail = {
                        "clientGroupId": clientGroupId,
                        "skipBotEvent":'["WELCOME_EVENT"]'
                    };
                    Kommunicate.startConversation(conversationDetail, function (response) {
                        _this.eventGroupSetupCompleted = true;
                        console.log("new conversation created");
                        _this.sendEventMessage('welcome-post-signup');
                    });                    
                } else {
                    _this.eventGroupSetupCompleted = true;
                    console.log("onboarding group exists");
                }
            },
            error: function () { }
        });
    },

    sendEventMessage: function(trigger) {
        if (!EventMessages[trigger] || !this.eventGroupSetupCompleted) {
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