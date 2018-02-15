---
id: web-conversation
title: Conversation
sidebar_label: Conversation
---
## Launch chat screen:
You can launch the chat screen(Where all the conversations are listed in descending order of communication time) as below:

```
Kommunicate.openConversation();
```

## Create a new Conversation:

You can create a new conversation as below :
```
Kommunicate.startNewConversation({ groupName: DEFAULT_GROUP_NAME, agentId: DEFAULT_AGENT_ID }, function (response) {
                        console.log("new conversation created");
                    });
                    
                    
```

### Example :
```
Kommunicate.startNewConversation({ groupName: "test", agentId: "debug4" }, function (response) {
                        console.log("new conversation created");
                    });
```
## Open a particular conversation:
You can open a particular conversation if you have the group id of the conversation.

```
Kommunicate.openParticularConversation(groupId);
```
