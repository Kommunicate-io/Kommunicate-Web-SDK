---
id: bot-custom-integration
title: Custom Bot Integration
sidebar_label: Custom Bot Integration
---

## Overview
Custom bot integration allows you to integrate with any other bot platforms. 
In this section, learn how to:

* [Integrating with custom bot platform](custom-bot-integration#integrating-with-custom-bot-platform)
* [Design your bot to send welcome message](custom-bot-integration#welcome-message-from-bots)
* [Skip bot welcome message](custom-bot-integration#skip-bot-welcome-message)
* [Process documents attached by user](custom-bot-integration#send-attachments-to-bot)
* [Handoff the conversation to human if bot is not able to answer](custom-bot-integration#handoff-conversation-to-human-agents)

## Integrating with custom bot platform

If you have any bot running on platforms other than Dialogflow, you can integrate it with kommunicate by following below steps:
1. Go to Kommunicate [bot integration](https://dashboard.kommunicate.io/bot) and click on `Other bot platforms`.

2. Kommunicate will ask you a webhook URL and request header for the webhook. Webhook URL is required at your backend server so that messages sent to bot can be forwarded to your server. You can use same webhook for multiple bots or can configure different webhook. 
Kommunicate will send the data to your webhook in below format:

```json
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
   	"eventName": "events ie. WELCOME , KOMMUNICATE_MEDIA_EVENT etc",
	"createdAt": "message sent time"
}
```
3.  Kommunicate sends the message to your webhook and waits for the response. The timeout limit for the webhook URL is set to the 30 seconds. Your webhook should return the array of message in response in below format:

```json
[{
	"message": "A message can be simple as a plain text" 
}, {
	"message": "A message can be a actionable message containing metadata",
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

## Welcome message from bots

Kommunicate sends some specific events to your webhook in `eventName` property. When a user creates a new conversation Kommunicate sends `eventName: WELCOME` to your webhook. You can check for this property in payload and reply with a welcome message. 


## Skip bot welcome message

Skip the 'WELCOME' event from dialogflow by setting
```
 "skipBotEvent":'["WELCOME_EVENT"]'
```

### Skip bot welcome message through Settings

```
var defaultSettings = {
      "skipBotEvent": '["WELCOME_EVENT"]',
};
Kommunicate.updateSettings(defaultSettings);
```

### Skip bot welcome message for a specific conversation

```
  var conversationDetail = {
                       "skipBotEvent":'["WELCOME_EVENT"]'
                    };
		    
  Kommunicate.startConversation(conversationDetail, function (response) {
  });      
```


## Send attachments to bot

When a user attaches a file or shares location, Kommunicate sends `eventName: KOMMUNICATE_MEDIA_EVENT` to your bot along with the attached file information. You can find the file information in `KM_CHAT_CONTEXT` object in metadata.
Below is the sample of webhook payload with attachment detail:

This is sample JSON for file attachment:
```json
{
    "eventName": "KOMMUNICATE_MEDIA_EVENT",
	"metadata": {
		"KM_CHAT_CONTEXT": {
			"attachments": [{
				"type": "image/png", // media type (in form of type/subtype) . Use the regex 'type/*' to get the generic type
				"payload": {
					"name": "file name",
					"url": "file url",
					"size": "size in bytes"
				}
			}]
		}
	},
	"createdAt": 1552638706610,
	
}
```

Attachment object for location message

```json
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

## Handoff conversation to human agents

You can design your bot to handoff the conversation to human agents if bot is not able to answer. You can notify Kommunicate by sending an specific human agent Id or an empty value in "KM_ASSIGN_TO" property in metadata. If empty value is passed Kommunicate will check the conversation rules for agents configured in [dashboard](https://dashboard.kommunicate.io/settings/conversation-rules "conversation rules in dashboard"). 
If human agent id is passed then kommunicate will skip the conversation rules and assign conversation to the mentioned agent.

below is the sample response of the webhook agent handoff
```json
[{
  "message": "our agents will get back to you",
  "metadata": {
    "KM_ASSIGN_TO": "" 
  }
}]
```
