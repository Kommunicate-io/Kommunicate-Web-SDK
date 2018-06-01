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
            List<String> agentIds; //add agentIds to this list
            List<String> botIds; //add botids to this list
            Kommunicate.startNewConversation(context,
                                             groupName, 
                                             agentIds, 
                                             botIds<null accepted>,
                                             false,  //Pass this as false if you would like to start new Conversation
                                             new KMStartChatHandler() {
                    @Override
                    public void onSuccess(Channel channel, Context context) {
                        channel.getKey(); //get your group Id 
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
