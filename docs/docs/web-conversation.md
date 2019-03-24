---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Overview
This section is dedicated to launching and managing conversations in the chat widget on certain triggers. For example, the chat widget will only appear on the website on click of a specific button. This could be useful if you wish to show support chat only on certain triggers and not all the time.


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

## Create a new conversation
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
