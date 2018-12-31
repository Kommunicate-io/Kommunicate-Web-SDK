---
id: android-installation
title: Installation
sidebar_label: Installation
---


Installing Kommunicate in your Android app is easy and fast. We will walk you through the procedure so you can start answering your support queries within few minutes.<br />

## Installation 

Add the following in your app build.gradle dependency:

```
implementation 'io.kommunicate:kommunicate:1.7.1'
```

## Launch chat

Kommunicate provides KMChatBuilder class to create and launch chat directly saving you the extra steps of authentication, creation, initialisation and launch. You can customise the process by building the launchChat object according to your requirements. Below are some examples of how you can customise the builder for launching a single chat:

Parmaters of KMChatBuilder:

| Parameter        | Type           | Description  |
| ------------- |:-------------:| -----:|
| context      | Activity | Only Activity Context is accepted. Excpetion is thrown otherwise  |
| applicationId | String  | You can get the Application Id by signing up on [Kommunicate Dashboard](https://dashboard.kommunicate.io).|
| chatName      | String      |   Optional, you can pass a chat name or null |
| kmUser | KMUser     |    Pass the details if you have the user details, null other wise. |
| withPreChat | boolean      |   Pass true if you would like the user to fill the details before starting the chat. IF you have user details then you can pass false. |
| isSingleChat | boolean      |    Pass false if you would like to create new conversation every time user starts a chat. This is true by default which means only one conversation will open for the user every time the user starts a chat. |
| agentList | List<String>      |    Pass the list of agents. The agent id would be the email id you used to register on kommunicate. Leave null if you want to create conversation with default agent.|
| botList | List<String>      |    Pass the list of bots. Leave null if you haven't integrated any bots |
| callback | KmCallback      |    Callback to notify Success or Failure |

### Launching chat for visitor:
If you would like to launch the chat directly without the visiting user entering any details, then use the builder as below:

```java
       new KmChatBuilder(context).setApplicationId(<Your-app-ID>).launchChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Success : " + message);
                        }

                        @Override
                        public void onFailure(Object error) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Failure : " + error);
                        }
                    });
```

If you have your agentList and bot list then use the builder as below:

```java
List<String> agentList = new ArrayList();
agentList.add("agent1@yourdomain.com"); //add your agentID

List<String> botList = new ArrayList();
botList.add("bot1"); //enter your integrated bot Ids

      new KmChatBuilder(context).setApplicationId(<Your-app-ID>).setAgentIds(agentList).setBotIds(botList).launchChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Success : " + message);
                        }

                        @Override
                        public void onFailure(Object error) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Failure : " + error);
                        }
                    });
```


### Launching chat for visitor with lead collection:
If you need the user to fill in details like phone number, emailId and name before starting the support chat then launch the chat with `withPreChat` flag as true. In this case you wouldn't need to pass the kmUser. A screen would open up for the user asking for details like emailId, phone number and name. Once the user fills the valid details (atleast emailId or phone number is required), the chat would be launched. Use the builder as below:

```java
     new KmChatBuilder(MainActivity.this).setApplicationId(<Your-app-ID>).setWithPreChat(true).launchChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Success : " + message);
                        }

                        @Override
                        public void onFailure(Object error) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Failure : " + error);
                        }
                    });
```

### Launching chat with existing user:
If you already have the user details then create a KMUser object using the details and launch the chat. Use the builder as below to create KMUser object with already existing details:

```java
    KMUser user = new KMUser();
    user.setUserId(userId); //Mandatory unique field
    user.setPassword(password)
    user.setImageLink(image-url);
```

Then pass this user object to the `setKmUser` method as below:

```java
new KmChatBuilder(MainActivity.this).setApplicationId(<Your-app-ID>).setKmUser(user).launchChat(new KmCallback() {
                        @Override
                        public void onSuccess(Object message) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Success : " + message);
                        }

                        @Override
                        public void onFailure(Object error) {
                            Utils.printLog(MainActivity.this, "ChatTest", "Failure : " + error);
                        }
                    });
```
If you have a different use-case and would like to customise the chat creation , user creation and chat launch, you can explore our docs further.

