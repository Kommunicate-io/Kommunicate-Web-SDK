---
id: ios-conversation
title: Conversation
sidebar_label: Conversation
---


### Open Conversation List

To open a list of conversations use below method. Reference to current view controller needs to be passed.

```
  Kommunicate.showConversations(from: self)
```


### New Conversation

To create a new conversation use below method. You have to pass the userId, agentId and botIds are optional.

In the callback, clientChannelKey will be returned.


```
Kommunicate.createConversation(
    userId: userId,
    agentId: agentId,
    botIds: [botId],
    completion: { response in
        guard !response.isEmpty else {return}
        print("client channel key \(response)")
})
 ```


### Open Conversation

Open any particular conversation by passing the `clientChannelKey` and reference to current view controller.

 ```
Kommunicate.showConversationWith(groupId: clientChannelKey, from: self)
 ```
