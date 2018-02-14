---
id: android-conversation
title: Conversation
sidebar_label: Conversation
---

Launch chat screen:
You can launch the chat screen(Where all the conversations are listed in descending order of communication time) as below:
```java
         Kommunicate.openConversation(context);
```
Create a new Conversation:
You can create a new conversation as below :
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
Open a particular conversation:
You can open a particular conversation if you have the group id of the conversation.
```java
Kommunicate.openParticularConversation(context, <Group Id (Integer)>);
```