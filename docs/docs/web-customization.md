---
id: web-customization
title: Customization
sidebar_label: Customization
---

## Chat icon:
Customize the chat icon by passing  `chatLauncherHtml: your html for chat icon` parameter into [initialization script](https://docs.kommunicate.io/docs/web-installation.html#script')

```
     var kommunicateSettings = {"appId": appId,
            "isAnonymousChat": true,

            "chatLauncherHtml": "<img src='https://api.kommunicate.io/img/logo02.svg' width='70px' height='70px'/>", 

            "agentId": agentId,
            "groupName": groupName,
            "email":email
            };

``` 
## Top Header color:
Add below code to change color of Top header Color in your css file
``` 
.mck-box-top {
background-color: green;
}
``` 

## Start new conversation button color:
Add below code to change color of 'Start new conversation' button in your css file
``` 
#mck-msg-new.mck-btn{
background-color: green!important;
}
``` 

## Received messages color:
Add below code to change color of received messages in your css file
``` 
.mck-msg-right .mck-msg-box{
background-color: green;
color:white;
}
``` 

## Sent messages color:
Add below code to change color of sent messages in your css file
``` 
mck-msg-left .mck-msg-box{
background-color: white;
color:black;
}
``` 
