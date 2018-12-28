---
id: android-authentication
title: Authentication
sidebar_label: Authentication
---

## Authorization

You need to initialise the Kommunicate SDK with your [App ID](https://dashboard.kommunicate.io/settings/install) obtained from dashboard before accessing any method.
You can get the App ID by Signing up on [Kommunicate dashboard](https://dashboard.kommunicate.io):

```java
Kommunicate.init(context, <your APP_ID>);
```
You can authorize a user as described below:
```java
        KMUser user = new KMUser();
        user.setUserId("reytum_01");  //unique userId
        user.setApplicationId("22823b4a764f9944ad7913ddb3e43cae1");   //your APP_ID
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
You can also add other optional fields like emailId, displayName, contact number etc to the user object:
```java
       user.setDisplayName("Keith Richards");
       user.setPassword("password");
       user.setImageLink(<image-url>);
       user.setContactNumber("9087654321");
       user.setEmail("keith@live.com");
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
## Starting Visitor Chat:
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

## Passing additional details:
Sometimes you would need to pass additional details for the user apart from the already existing properties of KMUser. You can pass the additional details in metadata of the KMUser object.

```java
Map<String, String> metadata = new HashMap<>();
metadata.put("Department" , "Engineering");
metadata.put("Designation" , "Software Engineer");
metadata.put("Team" , "Device Team");

kmUser.setMetadata(metadata);
```

## Updating logged in user details:
Once the user has logged in, you can still update some of its properties like displayName, imageUrl, contactNumber, Metadata, and status.
Create a KMUser object and set the property you want to update.
```java
KMUser kmUser = new KMUser();
kmUser.setDisplayName("New display name");
kmUser.setImageLink(<new image link>);

Map<String, String> metadata = user.getMetadata();
if(metadata == null){
  metadata = new HashMap<String, String>();
}

metadata.put("Department" , "Mobility");
metadata.put("Designation" , "Software Engineer II");

kmUser.setMetadata(metadata);
```

Then call the below method in a background thread or Async task:

```java
 UserService.getInstance(context).updateLoggedInUser(kmUser);
```
