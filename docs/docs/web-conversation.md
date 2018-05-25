---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---

## Launch conversation List:
To launch the conversation list use the following method.
```
Kommunicate.launchConversation();
```
## Show conversation list:
To show the conversation list use the following method.

```
Kommunicate.openConversationList();
```

## Create a new Conversation:

You can create a new conversation as described below:
```
var conversationDetail = {
    agentId: AGENT_ID,
    botIds: [BOTID1, BOTID2] //optional
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

