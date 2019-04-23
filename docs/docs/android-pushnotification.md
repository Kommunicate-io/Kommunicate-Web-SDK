---
id: android-pushnotification
title: Push Notification
sidebar_label: Push Notification
---
For push notifications, you must have a firebase account. Signup on [Firebase](https://console.firebase.google.com).
Go to [Kommunicate dashboard](https://dashboard.kommunicate.io/settings/pushnotification) and update the GCM/FCM server key under GCM/FCM key. Make sure you update the FCM server key and not the FCM legacy key or FCM sender Id.

## Note:
Skip the step `Kommunicate.registerForPushNotification` in this doc if you are using KmChatBuilder without calling `Kommunicate.login` or `Kommunicate.loginAsVistor`. This step needs to be called only in onSuccess of Kommunicate login. If using KmChatBuilder, this will automatically be called if you [pass the deviceToken with the builder](https://docs.kommunicate.io/docs/android-installation#launch-chat) or pass the token to Kommunicate in `onTokenRefersh` method of the FirebaseInstanceIdListener service. Pass the token to Kommunicate explicitly as below:
   ```java
     Kommunicate.setDeviceToken(context, "deviceToken");
   ```
   
## FCM
If you are already using Firebase in your application, add the below code in Kommunicate.login onSuccess() method and pass the FCM registration token as below(Skip this step if using KmChatBuilder):
```java
if(MobiComUserPreference.getInstance(context).isRegistered()) {
    Kommunicate.registerForPushNotification(context, deviceToken, new KmPushNotificationHandler() {
                    @Override
                    public void onSuccess(RegistrationResponse registrationResponse) {

                    }

                    @Override
                    public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

                    }
                }); 
}
```
The `deviceToken` is obtained from the onToken refresh method of FcmListenerIdService class.
```java
String deviceToken = FirebaseInstanceId.getInstance().getToken();
```
In your FcmInstanceIDListenerService onTokenRefresh() method add the below code:

```java
if (MobiComUserPreference.getInstance(this).isRegistered()) {
    new RegisterUserClientService(this).updatePushNotificationId(<deviceToken>);
}
```

For Receiving FCM Notifications in your app, Add the following code in your FcmListenerService in onMessageReceived(RemoteMessage remoteMessage) method:
```java
if (Kommunicate.isKmNotification(this, remoteMessage.getData())) {
    return;
}
```
## GCM

If you already have GCM enabled in your app, add the below code in Kommunicate.login onSuccess() method and pass the GCM registration token as below:
```java
if(MobiComUserPreference.getInstance(context).isRegistered()) {
   Kommunicate.registerForPushNotification(context, deviceToken, new KmPushNotificationHandler() {
                    @Override
                    public void onSuccess(RegistrationResponse registrationResponse) {

                    }

                    @Override
                    public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

                    }
                }); 
}
```
At the place where you are getting the GCM registration token, add below code:
```java
if (MobiComUserPreference.getInstance(this).isRegistered()) {
    new RegisterUserClientService(this).updatePushNotificationId(deviceToken);
}
```
For Receiving GCM Notifications in app, add the following code in your GcmListenerService in onMessageReceived method
```java
if (Kommunicate.isKmNotification(this, remoteMessage.getData())) {
    return;
}
```

## Don't have Android Push Notification code ?
To Enable Android Push Notification using Firebase Cloud Messaging (FCM) visit the Firebase console and create new project, add the google service json to your app, configure the build.gradle files in your app.

if you don't have the existing FCM related code, then copy the push notification related files from Applozic sample app to your project from [this](https://github.com/AppLozic/Applozic-Android-SDK/tree/master/app/src/main/java/com/applozic/mobicomkit/sample/pushnotification)
 link and add the below lines in your AndroidManifest.xml file:

```xml
<service android:name="<CLASS_PACKAGE>.FcmListenerService">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>

<service android:name="<CLASS_PACKAGE>.FcmInstanceIDListenerService"
       android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.INSTANCE_ID_EVENT" />
    </intent-filter>
</service>
```
Now Setup the PushNotificationTask by adding the below lines of code in onSuccess() method of Kommunicate.login
```java
Kommunicate.registerForPushNotification(context, Kommunicate.getDeviceToken(context) , new KmPushNotificationHandler() {
                    @Override
                    public void onSuccess(RegistrationResponse registrationResponse) {

                    }

                    @Override
                    public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

                    }
                }); 
```
