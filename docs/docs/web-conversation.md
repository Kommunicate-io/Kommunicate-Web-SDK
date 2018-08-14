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

A conversation can be created using `startConversation` method.
```javascript
var conversationDetail = {
    "agentId": "agentId", // optinal, if you dont pass agent Id, default agent will automatically get selected.
    "botIds": ["bot1"], // optional, pass bot Ids you want to add in conversation.
    "assignee":"bot1 or agentId" // optional, who you want to assign this conversation. If not passed conversation will assigned to default agent. if you an bot or agentId,  that bot or agent must be present in conversation.  
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

