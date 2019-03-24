const OnboardingMessageClient = { 

    getClientGroupId: function(userId) {
        return "km-onboarding-" + userId;
    },
    
    setupOnboardingGroup: function(userId) {
        Applozic.ALApiService.getGroupInfo({
            data: {
                clientGroupId: this.getClientGroupId(userId),
            },
            success: function (response) { 
                if (response.status == "error") {
                    var conversationDetail = {
                        "clientGroupId": this.getClientGroupId(userId),
                        "botIds": ["onboarding"], // Optional. Pass the bot IDs of the bots you want to add in this conversation.
                        "skipRouting":"true", // Optional. If this parameter is set to 'true', then routing rules will be skipped for this conversation.
                        "assignee":"onboarding" // Optional. You can asign this conversation to any agent or bot. If you do not pass the ID. the conversation will assigned to the default agent.
                    };
                    Kommunicate.startConversation(conversationDetail, function (response) {
                        console.log("new conversation created");
                    });                    
                } else {
                    console.log("onboarding group exists");
                }
            },
            error: function () { }
        });
    }
}

export default OnboardingMessageClient;