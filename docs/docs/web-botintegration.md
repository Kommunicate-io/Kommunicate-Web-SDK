---
id: web-botintegration
title: Integrate bot with Kommunicate
sidebar_label: Bot Integration
---

## Overview

Kommunicate has the provisions to integrate any third-party (Dialogflow, Microsoft Bot Framework, IBM Watson etc) or custom-made bots in the website. Bots can handle all the incoming conversations and when unable to answer, they can assign conversion to humans. In this section, learn how to:

* Assign conversation to bot
* Assign conversation to bot based on certain events
* Pass custom data to the bot platform
* Send attachments to bots
* Make your bot multilingual
* Assign conversation to humans based on availability

> **Note: Creating a bot and [configuring it from the Dashboard](https://docs.kommunicate.io/docs/bot-configration.html) is required before this step.**

## Assign all the new conversations to the bot by default

Go to [Kommunicate Dashboard -> Settings -> Conversation Routing](https://dashboard.kommunicate.io/settings/agent-assignment) and enable "Assign new conversations to bot", select the configured bot. 

After this, go to the chat widget integrated into your website, click on "Start New Conversation", send a message and verify that the configured bot is replying.

## Assign conversations to specific bots based on the webpage

If you wish to assign conversations to specific bots based on which webpage the conversation is started from, pass an array of botIds in `botIds` parameter in the [installation script](https://docs.kommunicate.io/docs/web-installation.html#script) in webpages where the specific bot need to be the default bot to handle incoming conversations.

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

> Note: This feature is supported by only Dialogflow V2 APIs. 

Kommunicate allows you to send custom data to your Dialogflow bot. Create a `KM_CHAT_CONTEXT` object and update it to Kommunicate settings by calling `Kommunicate.updateSettings` method. 

The chat context object will be sent along with every message user sends. The best place to call this method is the `onInit` method you pass in the <a href="web-installation.html#step-2-add-the-customized-kommunicate-plugin-to-your-website" target="_blank">installation script</a>.

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
## Welcome message from bots

When a conversation is routed through the bot, it will trigger a `WELCOME` event to the Dialogflow bot. You can enable default welcome intent in Dialogflow or create a custom event `WELCOME`. 

This message is different from the [Welcome Message](https://dashboard.kommunicate.io/settings/welcome-message) you set in Kommunicate dashboard. If Welcome Message for bot and humans (configured from the dashboard) both are enabled, both welcome message will be sent to the users. We recommend disabling the Welcome Message from the dashboard in this case.

## Send attachments to bot

When a user attaches a file or shares location, Kommunicate dispatches an event `KOMMUNICATE_MEDIA_EVENT` to your bot along with the attached file information. 

If you have enabled the fulfillment in Dialogflow, you will receive the following data in `originalDetectIntentRequest` parameter.  

This is sample JSON for file attachment:

```js
{
	"attachments": [{
		"payload": {
			"size": "Size in bytes",
			"name": "Name of the file",
			"url": "URL of the file"
		},
		"type": "image/png" // media type (in form of type/subtype) . Use the regex 'type/*' to get the generic type
	}]
}

```
Sample JSON for the location message

```js
{
	"attachments": [{
		"payload": {
			"lat": "Latitude",
			"lon": "Longitude"
		},
		"type": "location"
	}]
}

```

## Make your bot multilingual

Kommunicate allows you to integrate your multilingual bot so that your bot can reply in the user's language. You need to pass the user's language tag to Kommunicate. 

Language tags follow the [HTTP/1.1 specification, section 3.10](https://tools.ietf.org/html/rfc2616#section-3.10). Kommunicate will send this information with every message to the integrated bot platform. You can use the below method to update the user's language:

```js

Kommunicate.updateUserLanguage("en-US"); 

``` 
You can call this method when kommunicate SDK is initialized. For example, if you are using web SDK you can put this inside `onInit` callback function in Kommunicate [installation script](web-installation#web-installation). 

### Multilingual dialogflow agents

When you integrate a Dialogflow bot, Kommunicate sets US English(en-US) the default language. This setting will be overridden by the user's language. Here is the [list of languages](https://dialogflow.com/docs/reference/language) supported by Dialogflow. 

You need to pass the appropriate language tag in `Kommunicate.updateUserLanguage("languageTag")` method. Once this is set, only intents created in this language will be matched against user queries. If none of the intents is matched, `Default Fallback Intent` will be triggered. Here is more information on creating [multilingual agent in Dialogflow](https://dialogflow.com/docs/agents/multilingual).      


## Working with custom actions

Actions are the triggers which tell Kommunicate to perform certain tasks. A bot can request an action for Kommunicate to perform the below task:

### Fetch the human agent's availability status

Your bot can make a request to fetch the human agent's availability status. This information can be useful to decide if there are any human agents available to respond to the user's query. The bot can handover the conversation based on this information. 

The bot makes this request by passing `actionRequest` parameter along with the action name `fetchAgentAvailability` in the custom payload. This parameter should be used with `replyMetadata` so that your bot will get the response of the action along with the message reply.

** Here is an example to understand this: **  
Assume, you have designed a button `Talk to Human`. When a user clicks on this button, you want to handover the conversation only if your human agents are online. If none of the agents are online you want to display some other message. Here is the custom payload for this kind of button:

```JSON
{
	"platform": "kommunicate",
	"metadata": {
		"contentType": "300",
		"templateId": "6",
		"payload": [{
			"title": "Talk to Human",
			"message": "I want to talk to a human",
			"replyMetadata": {
				"actionRequest": "fetchAgentAvailability"
			}
		}]
	}
}
```

When the user clicks on this button, Kommunicate will send the action response to your bot platform. See a sample response below: 

```js
{
"actionResponse": [{
        "payload": {
          "availabilityStatus": "away" // possible values - online, offline, away
        },
        "name": "fetchAgentAvailability"
      }],
}

```
Possible values for availability status are:
* `online` - if at least one agent is online
* `away` - if no agent is online and at least one agent is away
* `offline` - if none of the agents is neither online nor away.

Dialogflow, further, sends this data to your Webhook as the part of `originalDetectIntentRequest`. You can get this information and decide whether to handover the conversation to any of the human agents or send any other message.  
