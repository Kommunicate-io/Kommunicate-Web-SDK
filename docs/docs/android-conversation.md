---
id: android-conversation
title: Conversation
sidebar_label: Conversation
---

You can launch the chat screen (where all the conversations are listed in descending order of time of communication) by using this method:
```java
Kommunicate.openConversation(context);
```
Create a new Conversation: You can create a new conversation as described below:
```java
Kommunicate.startNewConversation(context, <pass agent id here>, <pass bot id here, null accepted>, new KMCreateChatCallback() {
    @Override
    public void onSuccess(Channel channel, Context context) {
        
    }

    @Override
    public void onFailure(ChannelFeedApiResponse channelFeedApiResponse, Context context) {

    }
});
```
Open a particular conversation: You can open a particular conversation if you have the group ID of that particular conversation by this method.
```java
Kommunicate.openParticularConversation(context, <Group Id (Integer)>);
```