---
id: bot-dialogflow-integration
title: Dialogflow Integration
sidebar_label: Dialogflow Integration
---

## Overview
Kommunicate provide a codeless integration with Dialogflow. You can easily integrate your Dialogflow agent form bot section in Kommunicate dashboard.
In this section, learn how to:

* [Integration using Dialogflow V1 APIs](web-botintegration#integration-using-dialogflow-v1-apis)
* [Integration using Dialogflow V2 APIs](web-botintegration#integration-using-dialogflow-v2-apis)  
* [Pass Custom data to bot platform](web-botintegration#pass-custom-data-to-bot-platform)
* [Welcome message from bots](web-botintegration#welcome-message-from-bots)
* [Process documents attached by user](web-botintegration#send-attachments-to-bot)
* [Make your bot multilingual](web-botintegration#make-your-bot-multilingual)
* [Working with Dialogflow fulfillment](web-botintegration#working-with-dialogflow-fulfillment)
* [Working with custom actions](web-botintegration#working-with-custom-actions)


## Integration using Dialogflow V1 APIs
  1. Login to Dialogflow console and select the agent you want to integrate with Kommunicate from the drop-down in the left panel

  2. Go to `Settings->General` and copy Client access token and Developer access token.

  3. Go to Kommunicate [bots](https://dashboard.kommunicate.io/bot) section and click on `Dialogflow (Integrate another bot)`.

  4. Submit the required details.

## Integration using Dialogflow V2 APIs

  1. Login to Dialogflow console. 
  2. Select your Agent from dropdown in left panel.
  3. Click on setting button. It will open a setting page for agent.
  4. Inside general tab search for GOOGLE PROJECTS and click on your service account.
  5. After getting redirected to your SERVICE ACCOUNT, create key in JSON format for your project from actions section and it will get automatically downloaded.
  6. Upload the key file in Kommunicate dashboard.


On successful integration, the bot will be given an ID(botId) and will be listed under My Integrated Bots section. The botId will be used to identify the bot in the Kommunicate system.

## Pass Custom data to bot platform

> Note: This feature is supported by only Dialogflow V2 APIs. 

Kommunicate allows you to send custom data to your Dialogflow bot. Create a `KM_CHAT_CONTEXT` object and update it to Kommunicate settings by calling `Kommunicate.updateSettings` method. 

The chat context object will be sent along with every message user sends. The best place to call this method is the `onInit` method you pass in the <a href="web-installation.html#step-2-add-the-customized-kommunicate-plugin-to-your-website" target="_blank">installation script</a>.

```javascript
var chatContext = {
  "key1":"value1",
  "key2":"value2"
}
Kommunicate.updateChatContext(chatContext);

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

> Note: Multilingual agents are supported only with Dialogflow V2 APIs

Kommunicate allows you to integrate your multilingual bot so that your bot can reply in the user's language. You need to pass the user's language tag to Kommunicate. 

Language tags follow the [HTTP/1.1 specification, section 3.10](https://tools.ietf.org/html/rfc2616#section-3.10). Kommunicate will send this information with every message to the integrated bot platform. You can use the below method to update the user's language:

```js

Kommunicate.updateUserLanguage("en-US"); 

``` 
You can call this method when kommunicate SDK is initialized. For example, if you are using web SDK you can put this inside `onInit` callback function in Kommunicate [installation script](web-installation#web-installation). 

### Multilingual dialogflow agents


When you integrate a Dialogflow bot, Kommunicate sets US English(en-US) the default language. This setting will be overridden by the user's language. Here is the [list of languages](https://dialogflow.com/docs/reference/language) supported by Dialogflow. 

You need to pass the appropriate language tag in `Kommunicate.updateUserLanguage("languageTag")` method. Once this is set, only intents created in this language will be matched against user queries. If none of the intents is matched, `Default Fallback Intent` will be triggered. Here is more information on creating [multilingual agent in Dialogflow](https://dialogflow.com/docs/agents/multilingual).      

## Working with Dialogflow fulfillment
> This feature is only available with Dialogflow V2 APIs. 

Fulfillment lets your Dialogflow agent call business logic on an intent-by-intent basis. Dialogflow supports two ways to configure the fulfillment for an agent. More information on the fulfillment configuration is available on Dialogflow [docs](https://dialogflow.com/docs/fulfillment/configure).

1. Custom webhook
2. Create a webhook with the inline editor

### Custom webhook

A webhook is a web server endpoint that you create and host. When an intent with fulfillment enabled is matched, Dialogflow will make an HTTP POST request to your webhook with a JSON object containing information about the matched intent. And your webhook should respond back with instructions for what Dialogflow should do next. More about the request and response format is available in Dialogflow [docs](https://dialogflow.com/docs/fulfillment/how-it-works). Then Dialogflow wraps webhook response into the [response object](https://dialogflow.com/docs/reference/api-v2/rest/v2/projects.agent.sessions/detectIntent#response-body) depending on the API version you are using and send it to the client. 

Kommunicate look for the fulfillmentMessages array in webhook response. The element in this array can be a text message or an [actionable messages](actionable-messages) supported by kommunicate. Every element is treated as a independent message and rendered into UI according to the data present. 

Below is the sample fullfilmentMessage array for Dialogflow V2 APIs:

```js
{
	"fulfillmentMessages": [{
		"payload": {
			"message": "Object1- this object renders the link button on the UI",
			"platform": "kommunicate",
			"metadata": {
				"contentType": "300",
				"templateId": "3",
				"payload": [{
						"type": "link",
						"url": "www.google.com",
						"name": "Go To Google"
					},
					{
						"type": "link",
						"url": "www.facebook.com",
						"name": "Go To Facebook"
					}
				]
			}
		}
	}, {
		"payload": {
			"message": "Object2 - this object renders this text string on the UI",
			"platform": "kommunicate"
		}
	}]
}

```

### Create a webhook with the inline editor
Dialogflow provides some libraries designed to assist with building a fulfillment webhook. Below is the node js function with dialogflow fulfillment library which render the specified actionable messages on kommunicate chat UI.

``` js
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowfullfilment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response }); 
  function welcome(agent) {
    agent.add(new Payload("PLATFORM_UNSPECIFIED", [{
      "message": "Do you want more updates?",
      "platform": "kommunicate",
      "metadata": {
        "contentType": "300",
        "templateId": "6",
        "payload": [
          {
            "title": "Yes",
            "message": "Cool! send me more."
          },
          {
            "title": "No ",
            "message": "Don't send it to me again"
          }
        ]
      }
    }]));
  }
 
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  agent.handleRequest(intentMap);
});

```

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

## Enable/disable attachment based on the bot response

You can enable or disable the chat widget attachment icon based on the bot response. Use "KM_ENABLE_ATTACHMENT" property in metadata. 

> Note: By default the chat widget attachment icon will be enabled. You can disable it from kommunicateSettings object by setting <a href="web-installation#step-2-add-the-customized-kommunicate-plugin-to-your-website" target="_blank">attachment</a> parameter to false. 

This is the sample JSON to enable attachment

```json
[{
  "message": "Please share the document",// This is your trigger message to ask for attachments from the user. You can customize the message accordingly
  "metadata": {
    "KM_ENABLE_ATTACHMENT": true 
  }
}]
``` 
This is the sample JSON to disable attachment

```json
[{
  "message": "Thanks for sharing the document",// This is your trigger message to disable the attachment icon from the chat widget. You can use this to disable the attachment icon once the user has shared the documents.
  "metadata": {
    "KM_ENABLE_ATTACHMENT": false 
  }
}]
```  
