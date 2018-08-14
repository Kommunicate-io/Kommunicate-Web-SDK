---
id: web-installation
title: Installation
sidebar_label: Installation
---

## Overview:
Kommunicate allows you to add live chat in your website that enables you to serve your website visitors and customers through conversation.<br>
Installing Kommunicate is fast and easy. Just add a few lines of code in your website and you can start answering your support queries within few minutes.
Kommunicate can also be used with any of [Website Builder](#install-on-website-builder).

## Install on web:  

### Step 1 : Get the customized plugin script from [Kommunicate dashboard](https://dashboard.kommunicate.io/dashboard).

Create your account by signing up for [Kommunicate](https://dashboard.kommunicate.io/signup). If you already have a Kommunicate account, log in to your account and go to `Settings -> Install` section and copy the script.

Or

You can copy the below script and replace required parameters manually.

Script
```javascript
<script type="text/javascript">
    (function(d, m){

    /*---------------- Kommunicate settings start ----------------*/

     var kommunicateSettings = {"appId": appId,"conversationTitle":conversationTitle,"botIds":["bot1","bot2"],"onInit":callback};

    /*----------------- Kommunicate settings end ------------------*/

     var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>

```

### Step 2: Add the customized Kommunicate plugin to your website

We recommend adding it to your website template so that it automatically goes into each page of your website. Make sure to place Kommunicate plugin code before the closing Body tag.

You can customize the plugin by passing below parameter in option object. Visit `Settings -> Install` section in Kommunicate dashboard to get default values for your account.

|parameters|Descriptions|
|---	   |---	    |
|appId |A unique application ID assigned to your Kommunicate account|
|botIds|Array of bot ids will be added in conversation. eg. botIds=['bot1','bot2']. Bot Ids will be visible in bot section in dashboard if you have created any bot.|
|conversationTitle |All conversation will have this title|
|isAnonymousChat| Allow your users to chat in Anonymous mode. User will be asked to enter email when he/she starts a conversation|
|userId| This is your user’s/visiter's user ID. Kommunicate will generate a random Id if this is not defined|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of the user. User will be notified on this email if not online|
|chatLauncherHtml | Pass html for customize chat icon|
|onInit| This takes a function which will be called after plugin initialized. it takes two parameter error and data.|

## Install on website Builder:
  - <a href="https://www.kommunicate.io/blog/how-to-add-live-chat-plugin-in-wordpress-websites-b449f0f5e12f/" target="_blank">Wordpress</a>
  - <a href="https://www.kommunicate.io/blog/squarespace-live-chat-software-for-website/" target="_blank">Squarespace</a>
  - <a href="https://www.kommunicate.io/blog/how-to-integrate-live-chat-plugin-in-wix-websites-469f155ab314/" target="_blank">Wix</a>
  - <a href="https://www.kommunicate.io/blog/how-to-add-live-chat-in-shopify-websites/" target="_blank">Shopify</a>
