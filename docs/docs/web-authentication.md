---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---

## Identify your users

When users come to your website, by default Kommunicate assign them an unique random id. This behaviour best suits for anonymous users. If your website asks login details from user, pass this details to Kommunicate so that your agents could identify the user while chatting with them.
You can pass this detail either in options in plugin script or after plugin is initialized.

**1. options in plugin script**
here are the parameters you can pass in initalization script 

|parameters | description|
|---    |---    |
|userId | Unique Id for user|
|userName | Display name of the user. Agents will know users by Display name|
|email | email id of logged in user|
|password | user's password|
|imageLink | image will be seen |

### Example:
```javascript
<script type="text/javascript">
    (function(d, m){ 
      let o = {"appId":"applicationId","isAnonymousChat":true,"userId":"uniqueId","agentId":"agentId","userName":"userName","groupName":"groupName","email":"email"};
      let s = document.createElement("script");
      s.type = "text/javascript"; s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      let h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = o;
    })(document, window.kommunicate || {});
</script>

```


**2.Update user's identity after plugin initialized**

Once plugin is initialized use `Kommunicate.updateUser(userdetail)` method to update users identity.

```
var userdetail = {
    "email":"user email",
    "displayName":"user display name",
    "imageLink":"User profile image url",
    "metadata": {      // add userinfo you want to show in userinfo section of kommunicate dashboard
        "companyName": "value1",
        "designation": "value2",
        "linkedInProfile": "value3"
    }
};
Kommunicate.updateUser(userdetail);
```
|parameters | description|
|---    |---    |
|email| email id to be updated|
|displayName | Display name of the user. Agents will know users by Display name|
|imageLink | image will be seen |
|metadata | it's the extra information about user. you can pass information like user's company name, designameion etc. This information will be visible to agent in kommunicate dashboard |
