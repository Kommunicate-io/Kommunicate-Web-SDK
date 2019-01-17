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


## Customize chat widget by using css
You can pass the css after stringifying it in Kommunicate.customizeWidgetCss() method.

#### To change sent messages color
```javascript
Example : 

var cssChanges = ".mck-msg-right .mck-msg-box{background-color: blue!important;color:yellow!important;}";
Kommunicate.customizeWidgetCss(cssChanges);

```

#### To change received messages color

```javascript
Example :

var cssChanges = ".mck-msg-left .mck-msg-box{background-color: blue!important;color:yellow!important;}";
Kommunicate.customizeWidgetCss(cssChanges);

```

#### To show/hide the Chat Widget
To hide the chat widget you can use the following CSS.

```css
/* To hide the Chat Widget */
#kommunicate-widget-iframe {
    display: none;
}
```

To show the chat widget on click of a button use the following code.
```javascript
var btn = document.getElementById("button"); //Assuming this the button on your website from where you will trigger the click event to show the chat widget

btn.addEventListener("click", function() {
    document.getElementById("kommunicate-widget-iframe").style.display = 'block';
});
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
