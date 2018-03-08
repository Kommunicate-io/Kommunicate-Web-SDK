---
id: ios-authentication
title: Authentication
sidebar_label: Authentication
---


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
