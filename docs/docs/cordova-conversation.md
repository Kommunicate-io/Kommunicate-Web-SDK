---
id: cordova-conversation
title: Conversation
sidebar_label: Conversation
---

### Launching chat screen

You can open the chat screen by calling the below function:

```
kommunicate.launchConversation((response) => {
          //conversation launched successfully
        }, (response) => {
         //conversation launch failed
        });
```

### Launching individual chat thread

You can open an individual chat thread by calling the below function and passing the `groupId`:

```
let convObj = {
        'groupId' : groupId, //pass the groupId here
        'takeOrder' : true //skip chat list on back press, pass false if you want to show chat list on back press
      };
      
kommunicate.launchParticularConversation(convObj, function(response) {
        //Conversation launched successfully
      }, function(response) {
        //Conversation launch failed
      });
```

### Starting a new Conversation

You can start a new conversation by using the below function:

```
 let convInfo = {
      'agentId':'reytum@live.com',
      'botId': 'Hotel-Booking-Assistant'
     };
     
  kommunicate.startNewConversation(convInfo, (response) => {
      //You can launch the particular conversation here, response will be the groupId
       console.log("Kommunicate create conversation successfull : " + response);
    },(response) => {
      console.log("Kommunicate create conversation failed : " + response);
    });
 ```
