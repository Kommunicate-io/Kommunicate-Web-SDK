---
id: web-botintegration
title: Integrate bot with kommunicate
sidebar_label: Bot Integration
---

**Integrate your bot with Kommunicate**
<hr>
Integrate your bots with Kommunicate so that your agents will do what only human can do. Bot Integration happens through Kommunicate [Dashboard](https://dashboard.kommunicate.io/bots). Go to the `bot` section, enter required detail and bot is integrated. 

**Don't have a bot?**
<hr>

If you are new to the bot world, don't worry we will help to get your first bot in place. Send us your bot requirement by clicking on the `Request Custom Bot` in `dashboard->bots`, we will reach you out. 


**Already have a bot?**
<hr>

If you already have a bot running on listed platform, integrating it with Kommunicate is easy. Go to the `dashboard->bots` and select the paltform.<br>
here is the list of supported platform
  * [Dialogflow](https://dialogflow.com/) 
  * [Amazon Lex](https://aws.amazon.com/lex/) (coming soon)
  * [Microsoft Bot Framework](https://dev.botframework.com/) (coming soon)
  
 **To integrate Dialogflow bot follow below steps**
 <hr>
 
  1. Login to Dialogflow console and select your agent from dropdown in left panel.
  2. Go to settings->general and copy `Client access token` and `Developer access token`. .
  3. Go to `kommunicate dashboard->bots` and click on `Dialogflow (settings)`.
  4. Enter the required detail and submit. 
On successfull integration bot will be given a ID(botId) and listed under the `My Integrated Bots` section. The botId  will be used to identify the bot Kommunicate system. 

**Start Conversation with a bot**
<hr>
Once  bot is integrated, it can be added in any conversation. Conversation can be one to one or group conversation.

 * **One to one conversation with bot**
 Get the bot ID from dashboard and pass it in `openDirectConversation(botId)` method.
 ``` javascript
 Kommunicate.openDirectConversation("botId");
 ```
* **Group conversation with bot**

Start the group conversation with bot using `startConversation(conversationDetail, callback)`.  
``` javascript
var conversationDetail = {
    agentId: AGENT_ID,
    botIds: [BOTID1]
};
Kommunicate.startConversation(conversationDetail, function (response) {
    console.log("new conversation created");
}); 
```

**Use Actionable messages to make conversations interactive**
<hr>

Your bot can send rich text messages to make conversations more interactive. Here is the list of [rich text message](https://docs.kommunicate.io/docs/actionable-messages.html) supported by Kommunicate.

When setting a intent [response](https://dialogflow.com/docs/intents#response) in Dialogflow console click on `Add Response` under `DEFAULT` tab and choose `Custom Payload`.
Set below JSON as the response of intent.
``` JSON
{
  "platform": "kommunicate",
  "metadata": {
  // valid JSON for any type of Kommunicate's Actionable message.
  }
}
```
Inside metadata pass any kind of Kommunicate supported [actionable message](https://docs.kommunicate.io/docs/actionable-messages.html).

 * **Example : Sample JSON for Quick Replies**
 
 ``` JSON
  {
 	"platform": "kommunicate",
 	"metadata": {
 		"contentType": "300",
 		"templateId": "6",
 		"payload": [{
 			"title ": "Yes",
 			"message ": "Cool! send me more."
 		}, {
 			"title ": "No ",
 			"message": "Don't send it to me again"
 		}]
 	}
 }
 ```
