---
id: cordova-installation
title: Installation
sidebar_label: Installation
---

This plugin uses native UI screens and can be used for cordova, ionic and phonegap projects.

Add the plugin using the below command:
 
```
cordova plugin add kommunicate-cordova-plugin
```

For ionic, use the below command:

```
ionic cordova plugin add kommunicate-cordova-plugin
```
## Get your Application Id
Sign up for [Kommunicate](https://dashboard.kommunicate.io) to get your [APP_ID](https://dashboard.kommunicate.io/settings/install). This APP_ID is used to create/launch conversations.
## Declare kommunicate variable
Declare the variable before calling any function on it. Write the below line at the end of the file.
```js
 declare var kommunicate: any;
```
## Launch single chat
To launch the single chat you need to create a conversation launch object. This object is passed to the `startSingleChat` function and based on the parameters of the object the chat is created/launched.


```js
let conversationObject = {
     'appId' : '<APP_ID>',
     'groupName' : 'My Support group', 
     'kmUser' : JSON.stringify(user),
     'withPreChat' : false,
     'isUnique' : true,
     'agentIds' : ['<AGENT_ID>'], //AGENT_ID is the email id used to signup on kommunicate dashboard
     'botIds' : ['<BOT_ID>'] . //List of botIds. Go to bots(https://dashboard.kommunicate.io/bot) -> Integrated bots -> Copy botID 
}
```

Below are the parmater's description:

| Parameter        | Type           | Description  |
| ------------- |:-------------:| -----:|
| appId      | String      |   Mandatory field. The [APP_ID](https://dashboard.kommunicate.io/settings/install) obtained from kommunicate dashboard |
| groupName      | String      |   Optional, you can pass a group name or ignore |
| kmUser | KMUser     |    Pass the details if you have the user details, ignore otherwise |
| withPreChat | boolean      |   Pass true if you would like the user to fill the details before starting the chat. If you have user details then you can pass false or ignore. |
| isUnique | boolean      |    Pass true if you would like to create only one conversation for every user. The next time user starts the chat the same conversation would open, false if you would like to create a new conversation everytime the user starts the chat. True is recommended for single chat|
| agentIds | List<String>      |    Pass the list of agents. The agent id would be the email id you used to register on kommunicate|
| botIds | List<String>      |    Pass the list of bots. Go to bots(https://dashboard.kommunicate.io/bot) -> Integrated bots -> Copy botID . Ignore you haven't integrated any bots. |
 
Then use the object to launch the chat:
```js
 kommunicate.startSingleChat(conversationObject, (response) => {
       console.log("Test Success response : " + response);
  }, (response) =>{
       console.log("Test Failure response : " + response);
  });
  ```
  
Below are some examples to use the function in different scenarios:

### Launching chat for visitor:
If you would like to launch the chat directly without the visiting user entering any details, then use the method as below:

```js
let conversationObject = {
     'appId' : '<APP_ID>',
     'agentIds' : ['<AGENT_ID>'],  
     'botIds' : ['<BOT_ID>']
}

 kommunicate.startSingleChat(conversationObject, (response) => {
       console.log("Test Success response : " + response);
  }, (response) =>{
       console.log("Test Failure response : " + response);
  });
```
### Launching chat for visitor with lead collection:
If you need the user to fill in details like phone number, emailId and name before starting the support chat then launch the chat with `withPreChat` flag as true. In this case you wouldn't need to pass the kmUser. A screen would open up for the user asking for details like emailId, phone number and name. Once the user fills the valid details (atleast emailId or phone number is required), the chat would be launched. Use the method as below:

```js
let conversationObject = {
     'appId' : '<APP_ID>',
     'withPreChat' : true,
     'agentIds' : ['<AGENT_ID>'],
     'botIds' : ['<BOT_ID>']
}

 kommunicate.startSingleChat(conversationObject, (response) => {
       console.log("Test Success response : " + response);
  }, (response) =>{
       console.log("Test Failure response : " + response);
  });
```

### Launching chat with existing user:
If you already have the user details then create a KMUser object using the details and launch the chat. Use the method as below to create KMUser with already existing details:

```js
let user = {
      'userId' : 'reytum',   //Replace it with the userId of the logged in user
      'password' : 'reytum',  //Put password here if user has password, ignore otherwise
}

let conversationObject = {
     'appId' : '<APP_ID>',
     'kmUser' : JSON.stringify(user),
     'agentIds' : ['<AGENT_ID>'],
     'botIds' : ['<BOT_ID>']
}

 kommunicate.startSingleChat(conversationObject, (response) => {
       console.log("Test Success response : " + response);
  }, (response) =>{
       console.log("Test Failure response : " + response);
  });
```

If you have a different use-case and would like to customise the chat creation , user creation and chat launch, you can explore our docs further.
