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
## Top Box Color:
Add below code to change color of Top Box Color in your css file
``` 
.mck-box-top {
background-color: green;
}
``` 

## Start new conversation:
Add below code to change color of Start new conversation in your css file
``` 
#mck-msg-new.mck-btn{
background-color: green!important;
}
``` 

## Recieving message color
Add below code to change color of Recieving message color in your css file
``` 
.mck-msg-right .mck-msg-box{
background-color: green;
color:white;
}
``` 

## Sender message color:
Add below code to change color of Sender message color in your css file
``` 
mck-msg-left .mck-msg-box{
background-color: white;
color:black;
}
``` 
