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
Launch the chat screen (where all the conversations are listed in descending order of time of communication) by using this method:

```java
Kommunicate.openConversation(context);
```

If you need the callback for launchChat, then use the below method:
```java
Kommunicate.openConversation(context, null, new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Launch Success : " + message);
                        }

                        @Override
                        public void onFailure(Object error) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Launch Failure : " + error);
                        }
                    });
```

## Create a new Conversation: 
You can create a new conversation as below:
```java
     new KmChatBuilder(MainActivity.this)
                            .setChatName("Support")
                            .setSingleChat(false)
                            .createChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Integer chatId = (Integer) message;
                        }

                        @Override
                        public void onFailure(Object error) {
                            Log.d("ChatTest", "Error : " + error);
                        }
                    });
```

If you have your agentList and botList and need to create conversation with them then use the builder as below:
```java
     List<String> agentIds = new ArrayList<>(); //add agentIds to this list
     agentIds.add("agent1");
     List<String> botIds = new ArrayList<>(); //add botids to this list
     botIds.add("bot1");
     
     new KmChatBuilder(MainActivity.this)
                            .setChatName("Support")
                            .setSingleChat(false)
                            .setAgentIds(agentIds)
                            .setBotIds(botIds)
                            .createChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {

                        }

                        @Override
                        public void onFailure(Object error) {

                        }
                    });
```

## Create a Single unique conversation:
You can create a unique conversation using the below method. A unique conversation is identified by the list of agentIds and botIds used to create the conversation. If the same set of Ids are passed to the below method, then the already created conversation would be returned instead of creating a new conversation. If you dont pass the setSingleChat paramater in the builder, a single conversation would be created:

```java
       new KmChatBuilder(MainActivity.this)
                            .setChatName("Support")
                            .createChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Integer chatId = (Integer) message;
                        }

                        @Override
                        public void onFailure(Object error) {
                            Log.d("ChatTest", "Error : " + error);
                        }
                    });
```
If you have your agentList and botList and need to create conversation with them then use the builder as below:
```java
     List<String> agentIds = new ArrayList<>(); //add agentIds to this list
     agentIds.add("agent1");
     List<String> botIds = new ArrayList<>(); //add botids to this list
     botIds.add("bot1");
     
     new KmChatBuilder(MainActivity.this)
                            .setChatName("Support")
                            .setAgentIds(agentIds)
                            .setBotIds(botIds)
                            .createChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {

                        }

                        @Override
                        public void onFailure(Object error) {

                        }
                    });
```
## Open a particular conversation thread:
You can open a particular conversation if you have the chat ID of that particular conversation using the below method.
```java
Kommunicate.openParticularConversation(context, chatId, new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                              
                        }

                        @Override
                        public void onFailure(Object error) {

                        }
                    });
```
