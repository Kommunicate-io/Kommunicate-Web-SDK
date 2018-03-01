---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---

## Identify your users
Whenever users come to your website, they are assigned with a random ID by default. This behavior is best suited for anonymous user. If your website asks login details from users, pass these details to Kommunicate so that your agents can identify the user while chatting with them. You can pass these details either in kommunicateSettings in plugin script.

**1. kommunicateSettings in plugin script**
here are the parameters you can pass in [initialization script](https://docs.kommunicate.io/docs/web-installation.html#script'): 

|parameters | description|
|---    |---    |
|userId | Unique ID for the user|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|
|password | User's password|
|imageLink | This image will be visible to the user |

### Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "groupName":groupName,
            "email": emailId
            };
   

```


**2. Update user's identity after plugin initialized**

Once plugin is initialized and return success response, then you can use `Kommunicate.updateUser(userdetail)` method to update users identity.

```
var userdetail = {
    "email": email,
    "displayName": displayName,
    "imageLink": profileImageUrl,
    "metadata": {      // add userinfo you want to show in userinfo section of kommunicate dashboard
        "companyName": value1 ,
        "designation": value2 ,
        "linkedInProfile": value3
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
