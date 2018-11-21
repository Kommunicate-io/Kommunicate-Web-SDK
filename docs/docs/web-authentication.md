---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---


## kommunicateSettings in plugin script

Here are the parameters you can pass in [initialization script](https://docs.kommunicate.io/docs/web-installation.html#script'):

|parameters | description|
|---    |---    |
|userId | Unique ID for the user|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|
|password | User's password|
|imageLink | This image will be visible to the user |
|conversationTitle | Conversation Title|
|defaultMessageMetaData |This will send defaultMessageMetaData with every message.|

There are 3 ways to Login

## 1. Visitors

Whenever users come to your website, they are assigned with a random ID by default. This behaviour is best suited for anonymous user.
Add below setting to allow anonymous user


|parameters | description|
|---    |---    |

Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle
            };


```

## 2. Pre chat Lead Collection

For collecting user contact information before initiating chat, use the following setting 'askUserDetails':

Once configured, user will see the form on click of the chat widget launch icon

|parameters | description| required |
|---    |---    |---    |
|askUserDetails  | ["name", "email", "phone"]| atleast one is required |


<img align="middle" src="https://www.kommunicate.io/blog/wp-content/uploads/2018/06/Screen-Shot-2018-06-05-at-8.40.22-PM.png" />

### Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle,
            "askUserDetails":['name', 'email', 'phone']
            };


```

## 3. Logged In Users

If the user is already logged in your website, then pass the user details to kommunicate using the following setting:

|parameters | description|
|---    |---    |
|userId| Pass your logged in user id|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|




Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle,
            "email": emailId
            };

```



## Update user's identity after plugin initialized

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
