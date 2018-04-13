---
id: web-botintegration
title: Integrate bot with kommunicate
sidebar_label: Bot Integration
---

**Start conversations with bot**

* * *
Once the bot is [integrate](https://docs.kommunicate.io/docs/bot-configration.html), it can be added to any conversation in your chat plugin. The bot can be plugged in both one to one and group conversations. 

* **One to one conversations with bot** 

    Get the bot ID from the dashboard and pass it in the `openDirectConversation(botId)` method.
  ```javascript
    Kommunicate.openDirectConversation("botId");
   ```
* **Group conversations with bot**
    You can start group conversations with bot using `startConversation(conversationDetail, callback)`.

   ```javascript
    var conversationDetail = {
     agentId: AGENT_ID,
     botIds: [BOTID1]
    };
    Kommunicate.startConversation(conversationDetail, function (response) {
     console.log("new conversation created");
    }); 
   ```
