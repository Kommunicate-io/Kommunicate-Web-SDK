---
id: bot-setup
title: Integrate your bot with Kommunicate
sidebar_label: Bot setup
---

## Overview

Kommunicate has the provision to integrate any third-party (Dialogflow, Microsoft Bot Framework, IBM Watson etc) or custom-made bots in the website. You can deploy your bots to automate the repeated tasks and reduce the workload on your human agents. Bots can handle all the incoming conversations and when unable to answer, they can assign conversion to humans. In this section, learn how to:

* [Integrate with any bot platform](bot-setup#integrate-with-any-bot-platform)
* [Assign all conversation to the bot](bot-setup#assign-all-the-new-conversations-to-the-bot-by-default)  
* [Assign conversation to bot based on certain events](bot-setup#assign-conversations-to-specific-bots-based-on-certain-events)
* [Handoff the conversation to human if bot is not able to answer](bot-setup#handoff-the-conversation-to-human-if-bot-is-not-able-to-answer)
* [Use Actionable messages to make conversations interactive](bot-setup#use-actionable-messages-to-make-conversations-interactive)
* [Bot Events](bot-setup#bot-events)


## Integrate with any bot platform

Kommunicate has the built in support for some bot platforms like Dialogflow and provides integration with other bot platforms by custom bot integration. 
Here is the list of supported platforms(we will add more platforms in due course) and the detailed instructions for integration:

* [Dialogflow](bot-dialogflow-integration "instructions to integrate dialogflow bot")

* [Custom made bots](bot-custom-integration "instruction to integrate custom bot")

* [Amazon Lex](https://aws.amazon.com/lex/) (coming soon)

* [Microsoft Bot Framework](https://dev.botframework.com/) (coming soon)

Once you have integrated the bot you can [let it handle all the incoming conversations](bot-setup#assign-all-the-new-conversations-to-the-bot-by-default). You can design your bot to collect the required detail and handoff the [conversation to a human agent](bot-setup#handoff-the-conversation-to-human-if-bot-is-not-able-to-answer) if its not able to answer.

## Assign all the new conversations to the bot by default

Once you have integrated a bot, you need to enable the conversation rules for the bots.  

Go to [Kommunicate Dashboard -> Settings -> Conversation rules](https://dashboard.kommunicate.io/settings/agent-assignment) and enable "Assign new conversations to bot" and select the bot from drop down list.

Once this is done, all new incoming conversations will be assigned to the selected bot. You can test it out by starting a new conversation from your website and see how your bot reply. You can always design your bot to handoff the conversation to human agents if it's not able to answer.

## Assign conversations to specific bots based on the webpage

If you wish to assign conversations to specific bots based on which webpage the conversation is started from, pass a botId in `botIds` array in the [installation script](https://docs.kommunicate.io/docs/web-installation.html#script) in webpages where the specific bot need to be the default bot to handle incoming conversations.

```javascript
     ...
     var kommunicateSettings = {"appId": < APP_ID >,"agentId":<AGENT_ID>,"botIds": [<BOT_ID>],"conversationTitle":<CONVERSATION_TITLE>,"onInit":<CALLBACK_FUNCTION>};
     ...
```

## Assign conversations to specific bots based on certain events

You can start group conversations with bot using `startConversation(conversationDetail, callback)`.

```javascript
  var conversationDetail = {
    agentId: <AGENT_ID>, // optinal, if you dont pass agent Id, default agent will automatically get selected.
    botIds: [<BOT_ID>], // array of bot Ids
    assignee: <ASSIGNEE>//  agent/bot's id who you want to assigne the conversation. if nothing is passed, conversation will be assigned to default agent.
  };
  Kommunicate.startConversation(conversationDetail, function (response) {
  console.log("new conversation created");
  }); 
```

## Handoff the conversation to human if bot is not able to answer

Bot to human handoff comes in handy when the bot is unable to answer the customer or is unable to understand what the customer is saying. There are multiple ways of achieving this and it depends on the bot platform. Detailed instructions can be found [here](web-conversation-assignment#bot-to-human-handoff) for dialogflow and custom bots.



## Use Actionable messages to make conversations interactive

Your bot can be designed to send rich text messages to make conversations more interactive and useful. Here is a list of <a href="actionable-messages" target="_blank">rich text messages</a> supported by Kommunicate.

When setting an intent [response](https://dialogflow.com/docs/intents#response) in Dialogflow console, click on Add Response under `DEFAULT` tab and choose Custom Payload. Set below JSON as the response of the intent.

``` javascript
{
  "platform": "kommunicate",
  "metadata": {
  // valid JSON for any type of Kommunicate's Actionable message.
  }
}
```

Pass any kind of Kommunicate supported <a href="actionable-messages" target="_blank">actionable messages</a>

* ### Example: Sample JSON for Suggested Replies
``` JSON
{
   "platform": "kommunicate",
   "metadata": {
       "contentType": "300",
       "templateId": "6",
       "payload": [{
           "title": "Yes",
           "message": "Cool! send me more."
       }, {
           "title": "No ",
           "message": "Don't send it to me again"
       }]
   }
}
```

## Bot Events
Bot Events signify communication that can't be captured easily through text or voice. Examples include, clicking a 'Buy' button, adding an item to the shopping cart.

If you are using Dialogflow then visit [Dialogflow Custom Events](https://dialogflow.com/docs/events/custom-events) to know more.


### Trigger event on bot platform

Call the following function to trigger an event on the bot platform.

```
KommunicateGlobal.Applozic.ALApiService.sendMessage({
          data: {
              message: {
                  "type": 5,
                  "contentType": 10,
                  "message": "Event: " + <EVENT_NAME>,
                  "groupId": <GROUP_ID>,
                  "metadata": {"category": "HIDDEN", "KM_TRIGGER_EVENT": <EVENT_NAME>},
                  "source": 1
              }
          },
          success: function (response) { 
            console.log(response); 
          },
          error: function () { }
        });
```


Replace:
<GROUP_ID> with the group id of the conversation in which you want to trigger the message.

GroupId value will be available in ’response’ of [Kommunicate.startConversation](web-conversation#create-a-new-conversation) call.
Replace <EVENT_NAME> with the bot platform event name.

## Working with Actions

Actions are the triggers which tell Kommunicate to perform certain tasks. Kommunicate exposes these actions to give more powers to your bot. The example of the actions are: <br> 
* [Resolve a conversation](bot-setup#resolving-the-conversation-from-bot),<br>
* [Handoff a conversation to an agent](web-conversation-assignment#bot-to-human-handoff), <br> 
* [Fetch the availability status of agents](bot-dialogflow-integration#fetch-the-human-agent-s-availability-status).

Your bot can make a action request by passing the action name in the `actionRequest` parameter in metadata. 
Actions are supported with all bot platforms. In case of Dialogflow integration, the metadata can be set in custom payload. In case of custom bot platform it can be returned as the webhook response.

### Resolving the conversation from bot 

A bot can be configured to resolve the conversation when it is appropriate to do. It can be done by making an action request with the value `resolveConversation` to Kommunicate. Once the request is received Kommunicate will close the current conversation, notify the user and conversation will be moved to the resolve section of Kommunicate dashboard.
 

Here is how action request for resolving the conversation look like: 

```JSON
{
  "platform": "kommunicate",
  "metadata": {
    "actionRequest": "resolveConversation"
  }
}
```
