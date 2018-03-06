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