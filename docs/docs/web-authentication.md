---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---

## Overview
In this section, you can get the instructions to authenticate the users coming to the chat. You can set how users are identified and authenticated. You can also set up lead collection forms to get information from the users before initializing the chat.

## User details
You can set and update user details in `kommunicateSettings` function in the Kommunicate chat plugin script.

Here are the parameters you can pass in the [plugin script](https://docs.kommunicate.io/docs/web-installation.html#script') to add the user information:

|Parameters | Description|
|---    |---    |
|userId | This is your user’s/visiter's ID. Kommunicate will generate a random ID if this is not defined.|
|userName | This is the display name of the user. Your team will identify the user by this display name.|
|email | Email ID of the user. If not online, the user will be notified by fallback emails sent to this email ID.|
|password | This will be User's password.|
|imageLink | This will be the profile image of the user.|
|conversationTitle | All conversations will have this title. Once the conversation is assigned to one of your team, their name would come as the conversation title.|
|defaultMessageMetaData |This will send defaultMessageMetaData with every message|
|authenticationTypeId |You can use this to authenticate userId and password from your server <a href="access-token-url-configuration" target="_blank">Set AccessToken URL</a> and pass the value of 'authenticationTypeId' as "1" (Optional).|

## User authentication
There are 3 ways to log in users into the chat. 

### 1. Visitors

Whenever users come to your website, they are assigned a random ID by default. This behavior is best suited for anonymous users. Your anonymous users will be identified by pseudonyms. Our pseudonyms structure contains an adjective with a sea-creature name (For example, Jolly Shellfish). Add the below-mentioned setting to allow anonymous users into the chat:


|Parameters | Description|
|---    |---    |
|appId | A unique application ID assigned to your Kommunicate account.|
|conversationTitle | All conversations will have this title. Once the conversation is assigned to one of your team members, their name would come as the conversation title.|

 > NOTE:  APP_ID is a unique application ID assigned to your Kommunicate account. You can get it from the [Install section](https://dashboard.kommunicate.io/settings/install) in Kommunicate Dashboard.
Example:
```javascript

var kommunicateSettings = {
     ...
    "appId": '<APP_ID>',
    "conversationTitle": '<CONVERSATION_TITLE>'
    ...
};
 
```

### 2. Pre-chat lead collection

For collecting user contact information before initiating chat, use the following setting `preLeadCollection`:

Once configured, user will see the form on click of the chat widget launch icon.

<img align="middle" src="https://www.kommunicate.io/blog/wp-content/uploads/2018/06/Screen-Shot-2018-06-05-at-8.40.22-PM.png" />

> NOTE : Atleast one of (name,email,phone) field is required.

 Example:
```javascript

var kommunicateSettings = {
     ...
    "preLeadCollection": [{
            "field": "name", // Whatever column you want to add
            "required": true, // add whatever text you want to show in placeholder
            "placeholder": "enter your name"
        },
        {
            "field": "email",
            "type": "email",
            "required": true,
            "placeholder": "enter your email"
        },
        {
            "field": "phone",
            "type": "number",
            "required": true,
            "element": "input", //Optional field(Possible values : textarea or input) 
            "placeholder": "enter your phone number"
        }
    ]
    ...
};

```

### 3. Logged in users

If the user has already logged into your website previously, then pass the user details to Kommunicate using the following setting:

|Parameters | Description|
|---    |---    |
|userId| Pass the user ID of the logged in user.|
|userName | Display name of the user. Your team will identify the user by this display name.|
|email | Email ID of logged in user.|




Example:
```javascript

var kommunicateSettings = {
 ...
    "userId": '<USER_ID>',
    "agentId": '<AGENT_ID>',
    "email": '<EMAIL_ID>'
 ...
};

```



## Updating user details after the plugin is initialized

Once the chat plugin is initialized and has returned success response, then you can use `Kommunicate.updateUser(userdetail)` method to update the user's details.

```javascript
var kommunicateSettings = {
    ...
    "onInit": function () {
        // paste your code here
        var userdetail = {
            "email": '<EMAIL_ID>',
            "displayName": '<DISPLAY_NAME>',
            "imageLink": '<PROFILE_IMAGE_URL>',
            "metadata": {      // add userinfo you want to show in userinfo section of kommunicate dashboard
                "companyName": value1,
                "designation": value2,
                "linkedInProfile": value3
            }
        };
     ...
        Kommunicate.updateUser(userdetail);
    }
};

```
|parameters | description|
|---    |---    |
|email| Email ID to be updated.|
|displayName | Display name of the user. Your team will identify the user by this display name.|
|imageLink |This will be the profile image of the user.|
|metadata | It is the extra information about the user. You can pass information such as the user's company name and designation. This information will be visible to your team in the Kommunicate dashboard.|
