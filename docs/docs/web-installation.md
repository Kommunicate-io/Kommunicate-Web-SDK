---
id: web-installation
title: Installation
sidebar_label: Installation
---
Kommunicate allows you to add the smart messaging in your website for your customer support.<br>
Installing Kommunicate takes adding few lines of code in your website and you can start answering your support queries within few minutes.

**Step 1- Get the customized plugin script from Kommunicate dashboard.**
<hr>

First, Create your Kommunicate account if not already created, else login to your account.
Go to `configuration -> install` section and copy the script.

Or 

You can copy below script and replace required parameters mannually.
```javascript
<script type="text/javascript">
    (function(d, m){
      let o = {OPTIONS_TO_CUSTOMIZE_CONVERSATIONS};
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


**Step 2- Add the customized Kommunicate plugin in your website**
<hr>
We recommend adding it to your website template so that it automatically goes into each page of your site. 
place Kommunicate plugin code before the closing Body tag `(</body>)`.

You can customize the plugin by passing below parameter in option object. Visit `configuration -> install` section in Kommunicate dasgboard to get Default values for your account.

|parameters|Descriptions|
|---	   |---	    |
|appId |An unique application id assigned to your Kommunicate account| 
|agentId |This agent will be the default support agent . Default agent is registered when you sign up in Kommunicate dashboard.|
|groupName |All conversation will have this title|
|isAnonymousChat| Allow your users to chat in Anonymous mode. User will be asked to enter email when he/she starts a conversation.|
|userId| This is your user/visiter's userId. Kommunicate will generate a random Id if not present.|
|userName | Display name of the user. Agents will know users by Display name|
|email | Email id of user. User will be notified by email if not online|

