---
id: android-authentication
title: Authentication
sidebar_label: Authentication
---

#### Authorization

You need to initialise the Kommunicate SDK with your application key obtained from dashboard before accessing any method.
You can get the application key by Signing up on [Kommunicate dashboard](https://dashboard.kommunicate.io):

```java
Kommunicate.init(context, <your-app-key>);
```
You can authorize a user as described below:
```java
        KMUser user = new KMUser();
        user.setUserId("reytum_01");  //unique userId
        user.setPassword("password");
        user.setImageLink(<image-url>);
        user.setApplicationId("22823b4a764f9944ad7913ddb3e43cae1");   //your application key
```
Post this, call the method described below:
```java
Kommunicate.login(this, user, new KMLoginHandler() {
      @Override
      public void onSuccess(RegistrationResponse registrationResponse, Context context) {
            //do something in on success
      }

      @Override
      public void onFailure(RegistrationResponse registrationResponse, Exception exception) {
            //do something in on failure
      }
});
```
If at some point, you need to check if the user is logged in, you can use this code snippet:
```java
KMUser.isLoggedIn(context){
      //user is logged in  
}
```
To get the user details of logged in user, use this code snippet:
```java
KMUser user = KMUser.getLoggedInUser(context);
```

#### Starting Visitor Chat:
You can start a visitor's chat by calling the below method from the SDK.
```java
  Kommunicate.loginAsVisitor(this, new KMLoginHandler() {
      @Override
      public void onSuccess(RegistrationResponse registrationResponse, Context context) {
            //do something in on success
      }

      @Override
      public void onFailure(RegistrationResponse registrationResponse, Exception exception) {
            //do something in on failure
      }
  });
```
