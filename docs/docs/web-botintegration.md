---
id: web-botintegration
title: Integrate bot with kommunicate
sidebar_label: Bot Integration
---

Once the bot is [integrated](https://docs.kommunicate.io/docs/bot-configration.html), it can be added to any conversation in your chat plugin. There are several ways to add bot in any conversation: 
  1. Pass array of botIds in `botIds`  parameter in [installation script](https://docs.kommunicate.io/docs/web-installation.html#script). These bots will be added into every conversation by default.
  2. Use `Kommunicate.startConversation()` method to start group conversation with bots and agents.
  3. Use `Kommunicate.openDirectConversation()` method to start direct conversation with bot. This option is best suited if bot can handle the conversation without any agent.  

# Group conversations with bot
    
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

# One to one conversations with bot
  Get the bot ID from the dashboard and pass it in the `openDirectConversation(botId)` method.

```javascript
    Kommunicate.openDirectConversation("botId");
```

