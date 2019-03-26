---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Overview
This section is dedicated to launching and managing conversations in the chat widget on certain triggers. For example, the chat widget will only appear on the website on click of a specific button. This could be useful if you wish to show support chat only on certain triggers and not all the time.

## Conversations

### Set default parameters for conversations
You can set default parameters for your conversations which will act as the default settings every time a new conversation is created. Below you can find the default parameters which can be set using the Kommunicate.updateSettings() method : 

|Parameters|Type|Descriptions|
|---	   |---	   |---	    |
|defaultAssignee           | string| You need to pass the agentId/botId. If nothing is passed the default agent will automatically get selected.  <br> NOTE: You need to pass "skipRouting": true with defaultAssignee parameter if you have assigned a default assignee from the [conversation rules](https://dashboard.kommunicate.io/settings/conversation-rules)  section|
|skipRouting               | boolean| Default: false, If you pass this value true then it will skip routing rules set from [conversation rules](https://dashboard.kommunicate.io/settings/conversation-rules) section.|
|defaultAgentIds           | array|  You can pass the default agents that you want to be present in every new conversation created.|
|defaultBotIds             | array | You can pass the default bots that you want to be present in every new conversation created. |
|WELCOME_MESSAGE           | string| You can pass the default welcome message here and it will override the welcome message which you have set from dashboard. <br> NOTE: It will not override the welcome message sent by your bot.|

#### Example : Assigning conversations to a specific bot/agent
```javascript

// Example : Addind bot as a default assignee 
var defaultSettings = {
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
### Show conversation list
To show the conversation list, use the following method.

```
Kommunicate.openConversationList();
```

### Create a new conversation
A conversation can be created using `startConversation` method. Below is the example code for the same. You can choose to define certain parameters to profile this conversation and allot assignee.

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

>Note: If you have configured default parameters for conversations using Kommunicate.updateSettings() method, you can directly call Kommunicate.startConversation() method. Refer to below example :

```javascript
var defaultSettings = {
    "defaultBotIds": ["<BOT_ID>"], // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "defaultAssignee": "<BOT_ID>", // Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
    "skipRouting": true
};
Kommunicate.updateSettings(defaultSettings);  
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
