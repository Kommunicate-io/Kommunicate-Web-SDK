---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Overview
This section is dedicated to launching and managing conversations in the chat widget on certain triggers. For example, the chat widget will only appear on the website on click of a specific button. This could be useful if you wish to show support chat only on certain triggers and not all the time.

## Conversations

### Conversation Settings
Kommunicate provides some parameter to configure the conversation rules when it is created. These parameters can be used to override the conversation rules you have set from dashboard. These parameters can be set using the `Kommunicate.updateSettings()` methods.
The updated setting will be effective from the next conversation user creates by either clicking on the `Start new conversation` on chat widget or calling the `Kommunicate.startConversation()`.  

Below is the sample code to update the conversation setting:

```js
var defaultSettings = {
    "defaultAgentIds": ["<AGENT_ID>"],
    "defaultBotIds": ["<BOT_ID>"], // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "defaultAssignee": "<BOT_ID>", // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "skipBotEvent": '["<EVENT_NAME>"]', // Replace <EVENT_NAME> with the bot platform event names which you want to skip
    "skipRouting": true
};
Kommunicate.updateSettings(defaultSettings);  

```

Below is the detail about the supported parameters:  

|Parameters|Type|Default value|Descriptions|
|---	   |---	   |---  |---	    |
|defaultAssignee           | string| Configured routing rules for agents from dashboard| You need to pass the agentId/botId. If nothing is passed the default agent will automatically get selected.  <br> NOTE: You need to pass "skipRouting": true with defaultAssignee parameter if you have assigned a default assignee from the [conversation rules](https://dashboard.kommunicate.io/settings/conversation-rules)  section|
|defaultAgentIds           | array| Configured routing rules for agents from dashboard| You can pass the default agents that you want to be present in every new conversation created.|
|defaultBotIds             | array | Configured routing rules for bots from dashboard| You can pass the default bots that you want to be present in every new conversation created. |
|WELCOME_MESSAGE           | string| Configured from dashboard|You can pass the default welcome message here and it will override the welcome message which you have set from dashboard. <br> NOTE: It will not override the welcome message sent by your bot.|
|skipRouting               | boolean| false | If you pass this value true then it will skip routing rules set from [conversation rules](https://dashboard.kommunicate.io/settings/conversation-rules) section.|
|skipBotEvent              | array| None | You can pass the bot event names that you want to skip in every new conversation created. Read more about bot events [here](bot-configration#bot-events) |

#### Example : Assigning conversations to a specific bot/agent on certain events

*Usecase:*  A user comes to your website and starts a conversation with support agents. When user navigates to another page you wants to start conversation  with another agents or bots. You can achieve this by updating the conversation rules dynamically. 
Set the appropriate values in above mentioned parameters and Kommunicate will use these parameters while creating the conversation. You can update the empty values when user navigate to previous page to make old conversation rules(set from dashboard) effective. 
Below is the sample code for the same:
```javascript

// Example : Adding bot as a default assignee 
var defaultSettings = {
    "defaultAgentIds": ["<AGENT_ID>"]
    "defaultBotIds": ["<BOT_ID>"], // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "defaultAssignee": "<BOT_ID>", // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "skipRouting": true
};
Kommunicate.updateSettings(defaultSettings);  

```

### Launch conversation List
To launch the chat widget and conversation list, use the following method.


```
Kommunicate.launchConversation();
```
#### How it works ?
1. Initially, if there are no previous conversations, then it will create a new conversation and open it.
2. If you have old/previous conversations, it will open the conversation list.


### Create a new conversation
A conversation can be created using startConversation method. Below is the example code for the same. You can choose to define certain parameters to profile this conversation and allot assignee.

>Note: You have to set "automaticChatOpenOnNavigation" parameter to false as this option won't be compatible with startConversation method.

```javascript
var conversationDetail = {
    "agentIds": ["<AGENT_ID>"], // Optional. If you do not pass any agent ID, the default agent will automatically get selected.
    "botIds": ["<BOT_ID>"], // Optional. Pass the bot IDs of the bots you want to add in this conversation.
    "skipRouting":"true", // Optional. If this parameter is set to 'true', then routing rules will be skipped for this conversation.
    "assignee":"<BOT_ID> or <AGENT_ID>" // Optional. You can assign this conversation to any agent or bot. If you do not pass the ID. the conversation will assigned to the default agent.
};
Kommunicate.startConversation(conversationDetail, function (response) {
    console.log("new conversation created");
});                    
```

>Note: If called with empty parameters it will inherits the conversation rules from [conversation settings](web-conversation#conversation-settings) object. It can be helpful to set conversation rules dynamically. Refer to below example :

```javascript
var defaultSettings = {
    "defaultBotIds": ["<BOT_ID>"], // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "defaultAssignee": "<BOT_ID>", // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "skipRouting": true
};
Kommunicate.updateSettings(defaultSettings); 

//Pass the empty parameter to use the default conversation setting.  
Kommunicate.startConversation(); 
```

### Open a particular conversation
If you wish to open a particular conversation, pass the group ID of that conversation by using the method mentioned below:

```
Kommunicate.openConversation(<GROUP_ID>);
```

### Open chat window when a new message comes
If you want the chat window to pop open when a new conversation comes, add `"openConversationOnNewMessage": true` in `kommunicateSettings` object. This will open the chat window when a new message comes.

```javascript

    var kommunicateSettings = {
            ...
            "appId": "<APP_ID>",
            "openConversationOnNewMessage":true
            ...
            };


```
