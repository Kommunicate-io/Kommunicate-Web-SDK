---
id: bot-configration
title: Bot setup
sidebar_label: Bot setup
---

**Integrate your bot with Kommunicate**

* * *


You can easily integrate bots with Kommunicate to automate tasks which will reduce the workload on your agents. To integrate bot on your platform, visit kommunicate [dashboard](https://dashboard.kommunicate.io/bots/). Once integrated, the bot can send [actionable messages](https://docs.kommunicate.io/docs/actionable-messages.html) to make a conversation more interactive and design rich.

**Don't have a bot?**

* * *


If you do not have any prior experience with developing and using bots, we will help to get your bot in place. Let us know your custom bot requirements by clicking on the Request Custom Bot in `dashboard->bots`, we will get in touch to assist you in developing the bot.

**Already have a bot?**

* * *


You can easily integrate your bot in Kommunicate if you already have a bot developed on listed platforms. To integrate your bot, go to `Dashboard->bots` and select the bot platform you have used to develop the bot. Submit the required details and you will see a success message on the successful integration of the bot.

Here is the list of supported platforms(we will add more platform in due course):

* [Dialogflow](https://dialogflow.com/)

* [Amazon Lex](https://aws.amazon.com/lex/) (coming soon)

* [Microsoft Bot Framework](https://dev.botframework.com/) (coming soon)

**To integrate bot built using Dialogflow, follow the below steps:**

* * *


1. Login to Dialogflow console and select the agent you want to integrate with Kommunicate from the drop-down in the left panel.

2. Go to `Settings->general` and copy Client access token and Developer access token.

3. Go to kommunicate `dashboard->bots` and click on `Dialogflow (settings)`.

4. Submit the required details.

On successful integration, the bot will be given an ID(botId) and will be listed under My Integrated Bots section. The botId will be used to identify the bot in the Kommunicate system.


**Use Actionable messages to make conversations interactive**

* * *


Your bot is designed to send rich text messages to make conversations more interactive and useful. Here is a list of [rich text messages](https://docs.kommunicate.io/docs/actionable-messages.html) supported by Kommunicate.

When setting an intent [response](https://dialogflow.com/docs/intents#response) in Dialogflow console, click on Add Response under `DEFAULT` tab and choose Custom Payload. Set below JSON as the response of the intent.

``` javascript
{
  "platform": "kommunicate",
  "metadata": {
  // valid JSON for any type of Kommunicate's Actionable message.
  }
}
```

Pass any kind of Kommunicate supported [actionable messages](https://docs.kommunicate.io/docs/actionable-messages.html) inside metadata.

* **Example: Sample JSON for Quick Replies**
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
