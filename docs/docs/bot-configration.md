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

### To integrate your custom bot, follow the below steps:

* * *
1. Webhook API is required at your backend server so that all messages received by Kommunicate can be fowarded to your server.
JSON format of the request body will contain the following:

``` JS

{   
    "key":"message key", 
    "from":"sender unique id", 
    "groupId": 123456, // In case of Group Chat 
    "clientGroupId": "123456", // In case of Group Chat 
    "groupName": "applozicGroup", // In case of Group Chat 
    "conversationId": 23456, // In case of Contextual Chat 
    "message":"message content", "timeStamp":1457958424000, // Long timestamp value 
    "receiverConnected": true, // Boolean value 
    "receiverLastSeenAtTime": 1457958424000 //Long timestamp value 
}

```
2. Upon receiving the chat message in webhook API, call the bot platform api provided by Microsoft to get the response, send that response to  <a href="api-detail#send-message" target="_blank">Kommunicate send message API.</a>

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

* ### Example: Sample JSON for Quick Replies
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
