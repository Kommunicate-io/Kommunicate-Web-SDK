---
id: bot-configration
title: Bot setup
sidebar_label: Bot setup
---

## Integrate your bot with Kommunicate

* * *


You can easily integrate bots with Kommunicate to automate tasks which will reduce the workload on your agents. To integrate bot on your platform, visit kommunicate [dashboard](https://dashboard.kommunicate.io/bots/). Once integrated, the bot can send [actionable messages](https://docs.kommunicate.io/docs/actionable-messages.html) to make a conversation more interactive and design rich.

## Don't have a bot?

* * *


If you do not have any prior experience with developing and using bots, we will help to get your bot in place. Let us know your custom bot requirements by clicking on the Request Custom Bot in `dashboard->bots`, we will get in touch to assist you in developing the bot.

## Already have a bot?

* * *


You can easily integrate your bot in Kommunicate if you already have a bot developed on listed platforms. To integrate your bot, go to `Dashboard->bots` and select the bot platform you have used to develop the bot. Submit the required details and you will see a success message on the successful integration of the bot.

Here is the list of supported platforms(we will add more platform in due course):

* <a href="bot-configration#to-integrate-bot-built-using-dialogflow-follow-the-below-steps" >Dialogflow</a>

* <a href="bot-configration#to-integrate-your-custom-bot-follow-the-below-steps" >Integrate custom bot</a>

* [Amazon Lex](https://aws.amazon.com/lex/) (coming soon)

* [Microsoft Bot Framework](https://dev.botframework.com/) (coming soon)

### To integrate bot built using Dialogflow, follow the below steps:

* * *


1. Login to Dialogflow console and select the agent you want to integrate with Kommunicate from the drop-down in the left panel.

2. Go to `Settings->general` and copy Client access token and Developer access token.

3. Go to kommunicate `dashboard->bots` and click on `Dialogflow (settings)`.

4. Submit the required details.

On successful integration, the bot will be given an ID(botId) and will be listed under My Integrated Bots section. The botId will be used to identify the bot in the Kommunicate system.

### To integrate with other bot platforms, follow the below steps:

* * *
If you have any bot running on platform other than Dialogflow, you can integrate it with kommunicate by following below steps:
1. Go to kommunicate [bot integration](https://dashboard.kommunicate.io/bot) and click on `Other bot platforms`.

2. Kommunicate will ask you a webhook URL and request header for the webhook. Webhook URL is required at your backend server so that messages sent to bot can be forwarded to your server. You can use same webhook for multiple bots or can configure different webhook. 
Kommunicate will send the data to your webhook in below format:

```js
{
	"botId": "bot id who has received the message. This id is same as shown in dashboard.",
	"key": "unique id for every message",
	"from": "user id who has sent the message",
	"message": "message sent by user to the bot",
	"groupId": "conversation id",
	"metadata": "extra information with message",
	"contentType": "content type of the message (text, html, location, etc)",
	"applicationKey": "your APP_ID shown in Dashboard Install section",
	"source": "identifies if message is sent from web or mobile",
	"createdAt": "message sent time"
}
```
3.  Kommunicate sends the message to your webhook and waits for the response. The timeout limit for the webhook URL is set to the 30 seconds. Your webhook should return the array of message in response in below format:

```js
[{
	"message": "text message from webhook" // message without metadata
}, {
	"message": "message with metadata to Suggested Replies", // you can send any valid actionable message in metadata.
	"metadata": {
    "contentType": "300",
        "templateId": "6",
        "payload": [{
            "title": "Suggested Reply button 1",
            "message": "Suggested Reply button 1",
        }, {
            "title": "Suggested Reply button 2",
            "message": "Suggested Reply button 2" 
        }]
	}
}]
```
Each object in message array is rendered as separate message in Kommunicate chat widget.

## Use Actionable messages to make conversations interactive

* * *


Your bot is designed to send rich text messages to make conversations more interactive and useful. Here is a list of <a href="actionable-messages" target="_blank">rich text messages</a> supported by Kommunicate.

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

