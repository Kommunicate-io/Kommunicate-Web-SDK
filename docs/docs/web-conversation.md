---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Launching the chat screen:
You can launch the chat screen (where all the conversations are listed in descending order of time of communication) by using this method:

```
Kommunicate.openConversationList();
```

## Create a new Conversation:

You can create a new conversation as described below:
```
var conversationDetail = {
    agentId: AGENT_ID,
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
You can open a particular conversation if you have the group ID of that particular conversation by this method:

```
Kommunicate.openConversation(groupId);
```

