---
id: android-conversation
title: Conversation
sidebar_label: Conversation
---
## Register Kommunicate Action Callback:
Before creating or launching chat, you need to implement the ```KmActionCallback``` interface in your Application class. This interface will receive the callbacks with an object. You can do your custom operations based on the actions received or use Kommunicate's default actions.

```
 public class KommunicateApplication extends MultiDexApplication implements KmActionCallback {
```

Then override the ```KmActionCallback```'s ```onReceive``` method :

```
 @Override
    public void onReceive(Context context, final Object object, String action) {

        switch (action) {
             //This action will be received on click of the default start new chat button
            case Kommunicate.START_NEW_CHAT:
                List<String> agents = new ArrayList<>(); //add your agents to this list
                List<String> bots = new ArrayList<>(); //add your bots to this list
                 try {
                    KmHelper.setStartNewChat(context, agents, bots);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
             //This action will be received on click of logout option in menu
            case Kommunicate.LOGOUT_CALL:
                KmHelper.performLogout(context, object); //object will receive the exit Activity, the one that will be launched when logout is successfull
                break;
        }
    }
```

## Open Conversation Screen:
You can launch the chat screen (where all the conversations are listed in descending order of time of communication) by using this method:
```java
Kommunicate.openConversation(context);
```
## Create a new Conversation: 
You can create a new conversation as described below:
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

## Create a Single unique conversation:
You can create a unique conversation using the below method. A unique conversation is identified by the list of agentIds and botIds used to create the conversation. If the same set of Ids are passed to the below method, then the already created conversation would be returned instead of creating a new conversation:

```java
       List<String> agentIds; //add agentIds to this list
       List<String> botIds; //add botids to this list
       try {
            Kommunicate.startOrGetConversation(context, groupName, agentIds, botIds, new KMStartChatHandler() {
                @Override
                public void onSuccess(Channel channel, Context context) {
                    dialog.dismiss();
                    Kommunicate.openParticularConversation(context, channel.getKey());
                }

                @Override
                public void onFailure(ChannelFeedApiResponse channelFeedApiResponse, Context context) {
                
                }
            });
        } catch (KmException e) {
            e.printStackTrace();
        }
```

## Open a particular conversation thread:
You can open a particular conversation if you have the group ID of that particular conversation by this method.
```java
Kommunicate.openParticularConversation(context, <Group Id (Integer)>);
```
