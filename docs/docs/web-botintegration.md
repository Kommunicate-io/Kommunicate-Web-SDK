---
id: web-botintegration
title: Integrate bot with kommunicate
sidebar_label: Bot Integration
---

NOTE: [Configuring bot from dashboard](https://docs.kommunicate.io/docs/bot-configration.html) is required before this step.

## Assign all new conversations to Bot by Default
Go to [Kommunicate Dashboard -> Settings -> Conversation Routing](https://dashboard.kommunicate.io/settings/agent-assignment) and enable "Assign new conversations to bot", select the configured bot. 
Once its configured, go to the chat widget integrated in your website, click on "Start New Conversation", send a message and verify that the configured bot is replying.


## Assign conversations to specific bots based on the webpage
Pass array of botIds in `botIds` parameter in [installation script](https://docs.kommunicate.io/docs/web-installation.html#script) in webpages where the specific bot need to be a default bot to handle incoming conversations.

```javascript
     var kommunicateSettings = {"appId": appId,"agentId":agentId,"botIds":["liz"],"conversationTitle":conversationTitle,"botIds":["bot1","bot2"],"onInit":callback};
```

## Assign conversations to specific bots based on certain events
You can start group conversations with bot using `startConversation(conversationDetail, callback)`.

```javascript
  var conversationDetail = {
    agentId: "agentId",
    botIds: ["bot1","bot2"]
  };
  Kommunicate.startConversation(conversationDetail, function (response) {
  console.log("new conversation created");
  }); 
```
