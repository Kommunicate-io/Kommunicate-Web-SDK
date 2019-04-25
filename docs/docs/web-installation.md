---
id: web-installation
title: Installation
sidebar_label: Installation
---

## Overview
Kommunicate is live-chat and chatbots powered customer support software. Kommunicate allows you to add live chat on your website that enables you to chat with your website visitors and customers using a beautiful chat widget.

Installing Kommunicate is fast and easy. Just add a few lines of code in your website and you can start answering your support queries within a few minutes. Kommunicate can also be used with any of [Website Builder](#install-on-website-builders-or-content-management-systems-cms).

## Web installation

### Step 1: Get the customized plugin script from Kommunicate dashboard

Create your account by [signing](https://dashboard.kommunicate.io/signup) up for Kommunicate. You can signup for free in Kommunicate. If you already have a Kommunicate account, [log in](https://dashboard.kommunicate.io/login) to your account and go to the [Install](https://dashboard.kommunicate.io/settings/install) section and copy the script.

Or

You can copy the below script and replace required parameters manually.

> **Note**: Use web server to view HTML files as real-time updates will not work if you directly open the HTML file in the browser.

#### Script
```javascript
<script type="text/javascript">
    (function(d, m){

    /*---------------- Kommunicate settings start ----------------*/

     var kommunicateSettings = {
      "appId": "<APP_ID>",
      "conversationTitle":"<CONVERSATION_TITLE>",
      "automaticChatOpenOnNavigation": true
      /*
      "onInit": function (){
        // paste your code here
      },
        "botIds":["<BOT_ID_1>","<BOT_ID_2>"]
      */
      };

    /*----------------- Kommunicate settings end ------------------*/

     var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://api.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>

```

### Step 2: Add the customized Kommunicate plugin to your website

We recommend adding the plugin script to your website template so that it automatically goes into each page of your website. Make sure to place Kommunicate plugin script before the closing Body tag.

You can customize the plugin by passing below parameters in the `kommunicateSettings` object. Visit `Settings -> Install` section in Kommunicate dashboard to get default values for your account.

|Parameters|Type|Descriptions|
|---	   |---	   |---	    |
|appId |String| A unique application ID assigned to your Kommunicate account.|
|botIds|Array of strings| You can add bots to any conversation by passing an array of bot IDs. Example array: "botIds":["bot1","bot2"]. Bot IDs will be visible in the [Bot section](https://dashboard.kommunicate.io/bot) in the dashboard if you have created any bot.|
|conversationTitle |String | All conversations will have this title until the conversation gets assigned to the bot/agent. After conversation assignment, the conversation title will be the name of bot/agent whom the conversation is assigned.|
|preLeadCollection| Array of objects| This will enable <a href="web-authentication#2-pre-chat-lead-collection" target="_blank">lead collection</a> in chat. Users will be asked to enter the name, email and phone number when they start a conversation.|
|userId| String| This is your user’s/visiter's user ID. Kommunicate will generate a random ID if this is not defined.|
|userName | String| This is the display name of the user. Agents will identify users by this display name.|
|email | String| Email ID of the user. If not online, the user will be notified by fallback emails sent to this email ID.|
|onInit| Function| This function will be called after the chat plugin is [initialized](/docs/web-installation#script). Here, you can define the actions to be done after the plugin is initialized.|
|attachment| Boolean| Default: true <br> if you want to disable the attachment option in the chat widget, set this parameter to ‘false’.|
|emojilibrary| Boolean| Default: false <br> Emoticons library will be available in the chat widget if this parameter is set to ‘true’.|
|locShare| Boolean| Default: false <br> If you want to enable location sharing in the chat widget, set this parameter to ‘true’.|  
|msgTriggerTimeout| Integer| This will automatically start a conversation with a user after the user has spent a certain amount of time on your website and if the conversation has already been created before then last unread message notification will come. <br> **msgTriggerTimeout will open the conversation in below cases:** <br>1. When a user comes to your website for the first time.<br>2. If a user has any unread message.<br> **msgTriggerTimeout will not open the conversation if:**<br>1. The last message is sent by the user and does not have any unread messages.<br>**You can define the trigger time like this:** "msgTriggerTimeout": 10000 (Note: the time is set in milliseconds).<br> Note: You have to set "automaticChatOpenOnNavigation" parameter to false as this option won't be compatible with msgTriggerTimeout.|
|openConversationOnNewMessage | Boolean| Default: false <br> If this parameter is set to ‘true’, the chat window will be opened whenever a new message comes in the chat widget. For more detail check <a href="web-conversation#open-chat-window-when-a-new-message-comes" target="_blank">openConversationOnNewMessage</a>.|
|automaticChatOpenOnNavigation | Boolean| Default: false <br> If the chat widget is open and the user navigates to some other section in the website or to some other tab, then keep the chat widget open with the current active conversation<br> Note:<a href="web-conversation#create-a-new-conversation" target="_blank"> Kommunicate.startConversation()</a> method and msgTriggerTimeout option won't be compatible with this option.|  



## Install on website builders or Content Management Systems (CMS)

We have written step by step instructions if you are using website builder tools or CMS for your website:

  - <a href="https://www.kommunicate.io/blog/how-to-add-live-chat-plugin-in-wordpress-websites-b449f0f5e12f/" target="_blank">Wordpress</a>
  - <a href="https://www.kommunicate.io/blog/squarespace-live-chat-software-for-website/" target="_blank">Squarespace</a>
  - <a href="https://www.kommunicate.io/blog/how-to-integrate-live-chat-plugin-in-wix-websites-469f155ab314/" target="_blank">Wix</a>
  - <a href="https://www.kommunicate.io/blog/how-to-add-live-chat-in-shopify-websites/" target="_blank">Shopify</a>
