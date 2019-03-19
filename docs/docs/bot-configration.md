---
id: bot-configration
title: Integrate your bot with Kommunicate
sidebar_label: Bot setup
---

## Overview

Kommunicate has the provision to integrate any third-party (Dialogflow, Microsoft Bot Framework, IBM Watson etc) or custom-made bots in the website. You can deploy your bots to automate the repeated tasks and reduce the workload on your human agents. Bots can handle all the incoming conversations and when unable to answer, they can assign conversion to humans. In this section, learn how to:

* [Integrate with any bot platform](bot-configration#integrate-with-any-bot-platform)
* [Assign all conversation to the bot](bot-configration#assign-all-the-new-conversations-to-the-bot-by-default)  
* [Assign conversation to bot based on certain events](bot-configration#assign-conversations-to-specific-bots-based-on-certain-events)
* [Handoff the conversation to human if bot is not able to answer](bot-configration#handoff-the-conversation-to-human-if-bot-is-not-able-to-answer)


## Integrate with any bot platform

Kommunicate has the built in support for some bot platforms like Dialogflow and provides integration with other bot platforms by custom bot integration. 
Here is the list of supported platforms(we will add more platforms in due course) and the detailed instructions for integration:

* [Dialogflow](web-botintegration "instructions to integrate dialogflow bot")

* [Custom made bots](custom-bot-integration "instruction to integrate custom bot")

* [Amazon Lex](https://aws.amazon.com/lex/) (coming soon)

* [Microsoft Bot Framework](https://dev.botframework.com/) (coming soon)

Once you have Integrated the bot you can [let it handle all the incoming conversations](bot-configration#assign-all-the-new-conversations-to-the-bot-by-default). You can design your bot to collect the required detail and handoff the [conversation to a human agent](bot-configration#handoff-the-conversation-to-human-if-bot-is-not-able-to-answer) if its not able to answer.

## Assign all the new conversations to the bot by default

Once you have Integrated a bot, you need to enable the conversation rules for the bots.  

Go to [Kommunicate Dashboard -> Settings -> Conversation rules](https://dashboard.kommunicate.io/settings/agent-assignment) and enable "Assign new conversations to bot" and select the bot from drop down list.

Once this is done, all new incoming conversations will be assigned to the selected bot. You can test it out by starting a new conversation from your website and see how your bot reply. You can always design your bot to handoff t

## Assign conversations to specific bots based on the webpage

If you wish to assign conversations to specific bots based on which webpage the conversation is started from, pass an array of botIds in `botIds` parameter in the [installation script](https://docs.kommunicate.io/docs/web-installation.html#script) in webpages where the specific bot need to be the default bot to handle incoming conversations.

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

Bot to human handoff comes in handy when the bot is unable to answer the customer or is unable to understand what the customer is saying. There are multiple ways of achieving this depends on the bot platform. Detailed instructions can be found here for [dialogflow](web-conversation-assignment#bot-to-human-handoff) and [custom bots](custom-bot-integration#handoff-conversation-to-human-agents).



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


