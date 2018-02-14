---
id: android-authentication
title: Authentication
sidebar_label: Authentication
---

Authorization
You can authorize a user as below:
```java
KMUser user = new KMUser();
user.setUserId("reytum_01");  //unique userId
user.setApplicationId("22823b4a764f9944ad7913ddb3e43cae1");   //your application key
```
Then call the below method:
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
      }
```
If at some point you need to check if the user is logged in, you can use the below code:
```java
        KMUser.isLoggedIn(context){
            //user is logged in  
        }
```
You can get the logged in user details as below:
```java
        KMUser user = KMUser.getLoggedInUser(context);
```