---
id: ios-authentication
title: Authentication
sidebar_label: Authentication
---

### Setup

There is a setup call that you need to do before registration or login.You can get your applicatio key by signing up on [Kommunicate dashboard](https://dashboard.kommunicate.io).
Add below line in AppDelegate's launch method or just before the registration:

```
Kommunicate.setup(applicationId: <pass your application key>)
```

### Registration/Login


Convenient methods are present in Kommunicate class to register a user on Kommunicate.

To register a user to the Kommunicate server, use below method from `Kommunicate` class:

Create a KMUser object and pass it to the `registerUser` method:

```
let kmUser = KMUser()
kmUser.userId = userId
kmUser.applicationId = applicationKey

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
