---
id: web-customization
title: Customization
sidebar_label: Customization
---

## Chat widget customization

You can change the primary color of your chat widget to your brand color. You can also change the chat launcher icon from our given list of multiple icons. You will find these settings in 
<a href="https://dashboard.kommunicate.io/settings/chat-widget-customization" target="_blank">Kommunicate Dashboard -> Chat widget</a>.


If you are in one of our paid plans, you can also upload your own image/icon and use as your customized chat launcher icon.

![Chat_Widget_Customization.png](assets/Chat_Widget_Customization.png)


## Sent messages color
Add below code to change color of sent messages in your css file
```
.mck-msg-right .mck-msg-box{
background-color: green;
color:white;
}

```


## Received messages color
Add below code to change color of received messages in your css file
```
.mck-msg-left .mck-msg-box{
background-color: white;
color:black;
}

```


## Default metadata 
Add this metadata in kommunicate setting.This will send defaultMessageMetaData with every message.

Example

```
var kommunicateSettings = {"appId": appId,
            "isAnonymousChat": true,
            "agentId": agentId,
            "defaultMessageMetaData":{"hide":"true"}
            "groupName": groupName,
            "email":email
            };

```
