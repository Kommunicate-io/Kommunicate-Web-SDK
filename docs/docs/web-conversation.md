---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Launch chat screen:
You can launch the chat screen(Where all the conversations are listed in descending order of communication time) as below:

```
Kommunicate.openConversationList();
```

## Create a new Conversation:

You can create a new conversation as below :
```
var conversationDetail = {
    agentId: DEFAULT_AGENT_ID,
    botIds: ['BOTID1', 'BOTID2'] //optional
};
Kommunicate.startConversation(conversationDetail, function (response) {
                        console.log("new conversation created");
                    });
                    
                    
```

### Example :
```
var conversationDetail = {
    agentId: "debug6",
    botIds: ['botId1', 'botId2'] //optional
};
Kommunicate.startConversation(conversationDetail, function (response) {
    console.log("new conversation created");
});
```
## Open a particular conversation:
You can open a particular conversation if you have the group id of the conversation.

```
Kommunicate.openConversation(groupId);
```
## To update user detail :
If you want to update a particular user detail you can do so by using below code.

```
var userdetail = {
    "userId": "userId", // Whom detail you want to update
    "email":"user email",
    "displayName":"user display name",
    "imageLink":"User profile image url",
    "metadata": {      // add userinfo you want to show in userinfo section of kommunicate dashboard
        "key1": "value1",
        "key2": "value2",
        "key3": "value3"
    }
};
Kommunicate.updateUser(userdetail);
```
