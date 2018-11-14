---
id: ios-conversation
title: Conversation
sidebar_label: Conversation
---

In this section you will learn how to create and launch the conversation.

## Create and Launch Conversation

One of the easiest ways to create and launch the conversation is to use the below API.
```
Kommunicate.createAndShowConversation(from: <Name of the view controller from you want to present>)
```
If there are no conversations present, then this method will create a new conversation where the agents and the logged in user will be present. If a conversation is already there, then it will open that conversation. In case there are multiple conversations present then the conversation list will be shown to the user.

If you want to customise it like you want to create your own flow, then check out the `Custom Flow` section below.


## Custom Flow

Using this method you can create your own custom conversation flow. Let's say you want to create a new conversation every time when the user clicks on support, then use the API mentioned in the `New Conversation` section below.

### Open Conversation List

To open a list of conversations use below method. Reference to current view controller needs to be passed.

```
  Kommunicate.showConversations(from: self)
```


### New Conversation

To create a new conversation use below method. You have to pass the `userId`. `agentId` and `botIds` are optional.
If you pass `useLastConversation` as false, then a new conversation will be created everytime you call the below method.

In the callback, clientChannelKey will be returned.


```
Kommunicate.createConversation(
    userId: userId,
    agentIds: [agentId],
    botIds: [botId],
    useLastConversation: true,
    completion: { response in
        guard !response.isEmpty else {return}
        print("client channel key \(response)")
})
 ```


### Open Conversation

Open any particular conversation by passing the `clientChannelKey` and reference to current view controller.

 ```
  Kommunicate.showConversationWith(
      groupId: clientChannelKey,
      from: self,
      completionHandler: { success in
      print("conversation was shown")
  })
 ```
