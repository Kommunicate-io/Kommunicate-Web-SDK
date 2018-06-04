---
id: cordova-authentication
title: Authentication
sidebar_label: Authentication
---

To authenticate a user you need to create a user object and then pass it to the `login` function. The User object has the following properties:

|parameters | description|
|---    |---    |
|userId | Unique ID for the user|
|displayName | Display name of the user. Agents will identify users by this display name|
|email | Email ID of logged in user|
|password | User's password|
|imageLink | This image will be visible to the user |
|authenticationTypeId | Pass 1 for authentication from kommunicate |
|applicationId | Pass your applicationId here |
|deviceApnsType | 0 for development, 1 for release |

### There are 2 ways to Login
#### **1. Visitors**
Whenever users come to your app and starts the chat, you can assign them a random ID. This behaviour is best suited for anonymous user.
Add below function to generate a random userId:

```js
 public getRandomId() : string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
```
Then create the User object using random Id:
```js
 var kmUser = {
      'userId' : this.getRandomId(),
      'applicationId' : '22823b4a764f9944ad7913ddb3e43cae1',  //replace this with your Application Key from Applozic Dashboard
      'deviceApnsType' : 0    //Set 0 for Development and 1 for Distribution (Release)
      };
```
Then call the `login` function from the plugin:

```js
kommunicate.login(kmUser, function(response) {
        //login success
    }, function(response) {
       //login failed
    });
  }
```

### **2. Logged In Users**
If the user is already logged in to your app, then pass the user details to create a user object:
```js
    var kmUser = {
        'userId' : this.userId,   //Replace it with the userId of the logged in user
        'password' : this.password,  //Put password here
        'authenticationTypeId' : 1,
        'imageLink' : <image-link-for-user>
        'applicationId' : '22823b4a764f9944ad7913ddb3e43cae1',  //replace this with your Application Key from Applozic Dashboard
        'deviceApnsType' : 0    //Set 0 for Development and 1 for Distribution (Release)
    };
```
Then call the `login` function from the plugin:

```js
kommunicate.login(kmUser, function(response) {
        //login success
    }, function(response) {
       //login failed
    });
  }
```

You can check if the user is logged in or not by calling the `isLoggedIn()` function from the plugin:

```js
 kommunicate.isLoggedIn((response) => {
      if(response === "true"){
        //The user is logged in, you can directly launch the chat here 
      }else{
        //User is not logged in, maybe you need to call login function here
      }
    });
```
