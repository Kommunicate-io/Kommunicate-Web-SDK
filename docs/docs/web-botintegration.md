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
## Welcome message from bot

When a conversation routed through bot it will trigger an `WELCOME` event to Dialogflow agent. You can enable default welcome intent in Dialogflow or create an custom event `WELCOME`. 
This message is different from the Welcome message you set in Kommunicate dashboard. If 
welcome message for bot and agent(confugured from dashboard) both are enabled, both welcome message will be sent to the users. We recommend to disable the welcome message from dashboard in this case.  

## Send attachments to bot

When user attach a file or share a location, Kommunicate dispatch an event `KOMMUNICATE_MEDIA_EVENT` to your bot along with the attached file information. If you have enabled the fulfillment, you will receive the following data in `originalDetectIntentRequest` parameter.  
This is sample JSON for file attachment:
```js
{
	"attachments": [{
		"payload": {
			"size": "size in bytes",
			"name": "name of the file",
			"url": "URL of the file"
		},
		"type": "image/png" // media type (in form of type/subtype) . Use the regex 'type/*' to get the generic type
	}]
}

```
Sample JSON for location messages 

```js
{
	"attachments": [{
		"payload": {
			"lat": "latitude",
			"lon": "Longitude"
		},
		"type": "location"
	}]
}

```

## Make your bot multilingual
 Kommunicate allow you to integrate your multilingual bot so that your bot can reply in user's languages. You need to pass the user's language tag to kommunicate. Language tags follow the [HTTP/1.1 specification, section 3.10](https://tools.ietf.org/html/rfc2616#section-3.10). Kommunicate will send this information along with every message to the integrated bot platform. You can use below method to update user's langauge:

```js

Kommunciate.updateUserLanguage("en-US"); 

``` 
You can call this method when kommunicate SDK initialized. For example if you are using web SDK you can put this inside `onInit` callback function in Kommunicate installation [script](web-installation#web-installation). 

### Multilingual dialogflow agents: 
When you integrate a Dialogflow bot, Kommunicate sets English(en-US) the default language for bot. This setting will be overriden by user's language. Here is the [list of languages](https://dialogflow.com/docs/reference/language) supported by dialogflow. You need to pass the appropriate language tag in `Kommunciate.updateUserLanguage("languageTag")` method. Once this is set, only intents created in this language will be matched against user query. If none of the intents is matched `Default Fallback Intent` will be triggered. Here is the more information on creating [multilingual agent in Dialogflow](https://dialogflow.com/docs/agents/multilingual).      


## Working with custom actions
Actions are the triggers which tell the Kommunciate to perform certain tasks. A bot can request an action to kommunicate to perform below task:

### Fetch the agent's availability status
your bot can make a request to fetch the agent's availability status. This information can be useful to decide if there are any agents available to respond to a user's query. Bot can handover the conversation based on this information.     
Bot make this request by passing `actionRequest` parameter along with the action name `fetchAgentAvailability` in custom payload. This parameter should be used with `replyMetadata` so that your bot will get the action response along with the message reply. 
** Here is an example to understand this: **  
Assume, you have designed a button `talk to Human`. when user click on this button you want to handover the conversation only if support agents are online. If none of agents are online you want to display some other message:
Here is the custom payload for this kind of button.  

```json
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

When user click on this button kommunicate will send the action response as below to your bot platform: 

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
* `offline` - if none of agent is neither online nor away.

Dialogflow, further, send this data to your web hook as part of `originalDetectIntentRequest`. You can get this information and decide wether handover the conversation to agents or send any other message.  
