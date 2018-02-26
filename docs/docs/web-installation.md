---
id: web-installation
title: Installation
sidebar_label: Installation
---
Kommunicate allows you to add live chat in your website that enables you to serve your website visitors and customers through conversation.<br>
Installing Kommunicate on your website is easy and fast. Just add a few lines of code in your website and you can start answering your support queries within few minutes.

**Step 1- Get the customized plugin script from [Kommunicate dashboard](https://dashboard.kommunicate.io/dashboard).**
<hr>

Create your account by signing up for [Kommunicate](https://dashboard.kommunicate.io/signup). If you already have a Kommunicate account, log in to your account and go to `Settings -> Install` section and copy the script.

Or 

You can copy the below script and replace required parameters manually.
```javascript
<script type="text/javascript">
    (function(d, m){
      let o = {"appId":"YOUR_APP_ID","agentId":"AGENT_ID","groupName":"GROUP_NAME"};
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      let h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = o;
    })(document, window.kommunicate || {});
</script>

```

**Step 2- Add the customized Kommunicate plugin to your website**
<hr>
We recommend adding it to your website template so that it automatically goes into each page of your website. Make sure your place Kommunicate plugin code before the closing Body tag.

You can customize the plugin by passing below parameter in option object. Visit `Settings -> Install` section in Kommunicate dashboard to get default values for your account.

|parameters|Descriptions|
|---	   |---	    |
|appId |An unique application id assigned to your Kommunicate account| 
|agentId |This agent will be the default support agent. Default agent is registered when you sign up for Kommunicate|
|groupName |All conversation will have this title|
|isAnonymousChat| Allow your users to chat in Anonymous mode. User will be asked to enter email when he/she starts a conversation|
|userId| This is your user’s/visiter's user ID. Kommunicate will generate a random Id if this is not defined|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of the user. User will be notified on this email if not online|