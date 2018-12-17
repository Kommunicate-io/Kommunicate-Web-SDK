---
id: android-installation
title: Installation
sidebar_label: Installation
---


Installing Kommunicate in your Android app is easy and fast. We will walk you through the procedure so you can start answering your support queries within few minutes.<br />

## Installation 

Add the following in your app build.gradle dependency:

```
implementation 'io.kommunicate:kommunicate:1.6.3'
```

## Initialise SDK
After the gradle sync has finished with kommunicate dependency, you can initialise the SDK by calling the below method:
```java
 Kommunicate.init(context, Your APP_ID);
```

You can get the Application Id by signing up on [Kommunicate Dashboard](https://dashboard.kommunicate.io).


## Launch chat

Launch the chat using the below method:

```java
 Kommunicate.launchSingleChat(context, groupName, kmUser, withPreChat, isUnique, agentList, botList, callback);
```

Below are the parameter's description:

| Parameter        | Type           | Description  |
| ------------- |:-------------:| -----:|
| context      | Activity | Only Activity Context is accepted. Excpetion is thrown otherwise  |
| groupName      | String      |   Optional, you can pass a group name or null |
| kmUser | KMUser     |    Pass the details if you have the user details, null other wise. |
| withPreChat | boolean      |   Pass true if you would like the user to fill the details before starting the chat. IF you have user details then you can pass false. |
| isUnique | boolean      |    Pass true if you would like to create only one conversation for every user. The next time user starts the chat the same conversation would open |
| agentList | List<String>      |    Pass the list of agents. The agent id would be the email id you used to register on kommunicate|
| botList | List<String>      |    Pass the list of bots. Leave null if you haven't integrated any bots |
| callback | KmCallback      |    Callback to notify Success or Failure |

### Launching chat for visitor:
If you would like to launch the chat directly without the visiting user entering any details, then use the method as below:

```java
List<String> agentList = new ArrayList();
agentList.add("agent1@yourdomain.com"); //add your agentID

List<String> botList = new ArrayList();
botList.add("bot1"); //enter your integrated bot Ids

 Kommunicate.launchSingleChat(context, "Support", Kommunicate.getVisitor(), false, true, agentList, botList, new KmCallback(){
                    @Override
                    public void onSuccess(Object message) {
                        Log.d(context, "ChatLaunch", "Success : " + message);
                    }

                    @Override
                    public void onFailure(Object error) {
                        Log.d(context, "ChatLaunch", "Failure : " + error);
                    }
                });
```

### Launching chat for visitor with lead collection:
If you need the user to fill in details like phone number, emailId and name before starting the support chat then launch the chat with `withPreChat` flag as true. In this case you wouldn't need to pass the kmUser. A screen would open up for the user asking for details like emailId, phone number and name. Once the user fills the valid details (atleast emailId or phone number is required), the chat would be launched. Use the method as below:

```java
List<String> agentList = new ArrayList();
agentList.add("agent1@yourdomain.com"); //add your agentID

List<String> botList = new ArrayList();
botList.add("bot1"); //enter your integrated bot Ids

 Kommunicate.launchSingleChat(context, "Support", null, true, true, agentList, botList, new KmCallback(){
                    @Override
                    public void onSuccess(Object message) {
                        Log.d(context, "ChatLaunch", "Success : " + message);
                    }

                    @Override
                    public void onFailure(Object error) {
                        Log.d(context, "ChatLaunch", "Failure : " + error);
                    }
                });
```

### Launching chat with existing user:
If you already have the user details then create a KMUser object using the details and launch the chat. Use the method as below to create KMUser with already existing details:

```java
    KMUser user = new KMUser();
    user.setUserId(userId); //Mandatory unique field
    user.setPassword(password)
    user.setImageLink(image-url);
```

Then pass this user object to the `launchSingleChat` method as below:

```java
List<String> agentList = new ArrayList();
agentList.add("agent1@yourdomain.com"); //add your agentID

List<String> botList = new ArrayList();
botList.add("bot1"); //enter your integrated bot Ids

 Kommunicate.launchSingleChat(context, "Support", user, false, true, agentList, botList, new KmCallback(){
                    @Override
                    public void onSuccess(Object message) {
                        Log.d(context, "ChatLaunch", "Success : " + message);
                    }

                    @Override
                    public void onFailure(Object error) {
                        Log.d(context, "ChatLaunch", "Failure : " + error);
                    }
                });
```

If you have a different use-case and would like to customise the chat creation , user creation and chat launch, you can explore our docs further.
