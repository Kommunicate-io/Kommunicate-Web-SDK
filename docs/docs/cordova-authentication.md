---
id: cordova-authentication
title: Authentication
sidebar_label: Authentication
---

## Authentication

To authenticate a user you need to create a user object and then pass it to the `login` function:

```
    var kmUser = {
        'userId' : this.userId,   //Replace it with the userId of the logged in user
        'password' : this.password,  //Put password here
        'authenticationTypeId' : 1,
        'applicationId' : '22823b4a764f9944ad7913ddb3e43cae1',  //replace this with your Application Key from Applozic Dashboard
        'deviceApnsType' : 0    //Set 0 for Development and 1 for Distribution (Release)
    };
```

Then call the `login` function from the plugin:

```
kommunicate.login(kmUser, function(response) {
        //login success
    }, function(response) {
       //login failed
    });
  }
```

You can check if the user is logged in or not by calling the `isLoggedIn()` function from the plugin:

```
 kommunicate.isLoggedIn((response) => {
      if(response === "true"){
        //The user is logged in, you can directly launch the chat here 
      }else{
        //User is not logged in, maybe you need to call login function here
      }
    });
```
