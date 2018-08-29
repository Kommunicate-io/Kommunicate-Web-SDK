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
Add the custom CSS on `mck-sidebox-launcher` class to change the look and feel of chat launcher icon. Mark your CSS important if it is being overriden by plugin's CSS.
``` css
.mck-sidebox-launcher {
overflow: "hidden" !important; /* change to 'visible' to allow custom shaped icons*/
box-shadow: "none" !important;  /* change to 'none' to remove underlying shadow */
background: "#6350A9" !important; /* if user is using an image with transparency they can add this property and define a background color*/
}
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

## Default metadata :
Add this metadata in kommunicate setting.This will send defaultMessageMetaData with every message.

### Example

``` 
var kommunicateSettings = {"appId": appId,
            "isAnonymousChat": true,
            "agentId": agentId,
            "defaultMessageMetaData":{"hide":"true"}
            "groupName": groupName,
            "email":email
            };

``` 

