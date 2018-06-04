---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---


**kommunicateSettings in plugin script**

Here are the parameters you can pass in [initialization script](https://docs.kommunicate.io/docs/web-installation.html#script'): 

|parameters | description|
|---    |---    |
|userId | Unique ID for the user|
|userName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|
|password | User's password|
|imageLink | This image will be visible to the user |
|isAnonymousChat | true/false|
|conversationTitle | Conversation Title|

## There are 3 ways to Login

## **1. Visitors**

Whenever users come to your website, they are assigned with a random ID by default. This behaviour is best suited for anonymous user.
Add below setting to allow anonymous user


|parameters | description|
|---    |---    |
|isAnonymousChat | true|


### Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle,
            "email": emailId,
            "isAnonymousChat":true
            };
   

```

## **2. Pre chat Lead Collection**

If you want to ask the user contact information before initiating the chat widget, then use the following setting:

Here in askUserDetails name, email, phone are optional

|parameters | description|
|---    |---    |
|isAnonymousChat | false|
|askUserDetails  | ['name', 'email', 'phone']|

### Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle,
            "email": emailId,
            "isAnonymousChat":false,
            "askUserDetails":['name', 'email', 'phone']
            };
   

```

## **3. Logged In Users**

If the user is already logged in your website, then pass the user details to kommunicate using the following setting:

|parameters | description|
|---    |---    |
|isAnonymousChat| true|
|userId| Pass your logged in user id|



### Example:
```javascript

    var kommunicateSettings = {"appId": applicationId,
            "userId": userId,
            "agentId": agentId,
            "userName": userName,
            "conversationTitle":conversationTitle,
            "email": emailId,
            "isAnonymousChat":true
            };
   

```


**Update user's identity after plugin initialized**

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
