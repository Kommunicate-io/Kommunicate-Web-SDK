---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---

## Identify your users
Whenever users come to your website, they are assigned with a unique and random ID by default. This behavior is best suited for anonymous users. If your website asks login details from users, pass these details to Kommunicate so that your agents can identify the user while chatting with them. You can pass these details either in options object in plugin script or after the plugin is initialized.

**1. Options in plugin script**
here are the parameters you can pass in initialization script: 

|parameters | description|
|---    |---    |
|userId | Unique ID for the user|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|
|password | User's password|
|imageLink | This image will be visible to the user |

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
|email| Email ID to be updated|
|displayName | Display name of the user. Agents will identify users by this display name|
|imageLink | This image will be visible to the user |
|metadata | It is the extra information about the user. You can pass information such as user's company name and designation. This information will be visible to the agents in Kommunicate dashboard |
