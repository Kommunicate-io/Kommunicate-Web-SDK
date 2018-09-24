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
     var kommunicateSettings = {"appId": appId,"agentId":agentId,"botIds":["liz"],"conversationTitle":conversationTitle,"botIds":["bot1"],"onInit":callback};
```

## Assign conversations to specific bots based on certain events
You can start group conversations with bot using `startConversation(conversationDetail, callback)`.

```javascript
  var conversationDetail = {
    agentId: "agentId", // optinal, if you dont pass agent Id, default agent will automatically get selected.
    botIds: ["bot1"],
    assignee:"bot1" // if nothing is passed, conversation will be assigned to default agent.
  };
  Kommunicate.startConversation(conversationDetail, function (response) {
  console.log("new conversation created");
  }); 
```
## Pass Custom data to bot platform
> *Note:* This feature is supported by only Dialogflow V2 APIs. 

Kommunicate allow to send custom data to your Dialogflow agent. Create a `KM_CHAT_CONTEXT` object and update it to Kommunicate settings by calling `Kommunicate.updateSettings` method. The chat context object will be sent along with every message user sends. The best place to call this method is the `onInit` method you pass in <a href="web-installation.html#step-2-add-the-customized-kommunicate-plugin-to-your-website" target="_blank">installation script</a>.

```javascript
var chatContext = {
  "key1":"value1",
  "key2":"value2"
}
Kommunicate.updateSettings({"KM_CHAT_CONTEXT":chatContext})

```
Dialogflow will send this data in the configured webhook in `originalDetectIntentRequest` param.
 
 ```javascript
 "originalDetectIntentRequest": {
    "payload": {
      "key1": "value1",
      "key2": "value2"
    }
  }
  ```
