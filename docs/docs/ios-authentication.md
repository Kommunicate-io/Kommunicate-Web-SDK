---
id: ios-authentication
title: Authentication
sidebar_label: Authentication
---

## Setup

There is a setup call that you need to do before registration or login. You can get your [App ID](https://dashboard.kommunicate.io/settings/install) by signing up on [Kommunicate dashboard](https://dashboard.kommunicate.io).
Add below line in AppDelegate's launch method or just before the registration:

```
Kommunicate.setup(applicationId: <pass your App ID>)
```

## Registration/Login


Convenient methods are present in Kommunicate class to register a user on Kommunicate.

Currently we support two different types of users on our iOS SDK:

### 1.Visitors

In this case you don't have any information of the users that can be used as an `userId`. In this case a randomId will be assigned as an `userId`. So first get the userId as described below and pass the same in registration process mentioned below.

`let userId = Kommunicate.randomId()`

### 2.Registered User

If the user is logged in your app then you can pass the user information in this way.

```
// Use this while creating a `KMUser` object below.
let userId = <pass a unique key>
let emailId = <pass user's emailId> // Optional
```

### Register User

To register a user to the Kommunicate server, use below method from `Kommunicate` class:

Create a KMUser object and pass it to the `registerUser` method:

```
let kmUser = KMUser()
kmUser.userId = userId
kmUser.email = emailId // Optional
kmUser.applicationId = appId

// Use this same API for login
Kommunicate.registerUser(kmUser, completion: {
    response, error in
    guard error == nil else {return}
    print("Success")
})
```

To check if user is already logged in, use below API:

```
if Kommunicate.isLoggedIn {
  // User is already logged in
}
```

Note: To avoid calling in registration everytime use `isLoggedIn` to check if the user is already logged in or not.

### What Next?
1. Check out the [Conversation Section](https://docs.kommunicate.io/docs/ios-conversation) where you will get the details for creating and launching a conversation.
2. [Enable Push Notifications](https://docs.kommunicate.io/docs/ios-pushnotification) to get real-time updates.
