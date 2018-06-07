---
id: android-authentication
title: Authentication
sidebar_label: Authentication
---

#### Authorization

You need to initialise the Kommunicate SDK with your application key obtained from dashboard before accessing any method.
Call the below method:

```java
Kommunicate.init(context, <your-app-id>);
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

#### Starting Anonymous chat:
You can start a chat by generating a Random userId for a user and then logging in the user to Kommunicate. Use the below method to generate a Random userId:
```java
  public String generateUserId() {
        StringBuilder text = new StringBuilder("");
        SecureRandom random = new SecureRandom();
        String possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < 32; i++) {
            text.append(possible.charAt(random.nextInt(possible.length())));
        }
        return text.toString();
    }
```
Then login the user to Kommunicate:
```java
  KMUser user = new KMUser();
  user.setUserId(generateUserId());

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
