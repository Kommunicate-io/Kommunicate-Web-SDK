---
id: android-pushnotification
title: Push Notification
sidebar_label: Push Notification
---
### FCM

If you are already using Firebase in your application, add the below code in Kommunicate.login onSuccess() method and pass the FCM registration token as below:
```java
if(MobiComUserPreference.getInstance(context).isRegistered()) {

    PushNotificationTask pushNotificationTask = null;         
    PushNotificationTask.TaskListener listener = new PushNotificationTask.TaskListener() {                  
        @Override           
        public void onSuccess(RegistrationResponse registrationResponse) {   

        }            
        @Override          
        public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

        } 

    };                    

    pushNotificationTask = new PushNotificationTask(registrationToken, listener, mActivity);            
    pushNotificationTask.execute((Void) null);  
}
```
In your FcmInstanceIDListenerService onTokenRefresh() method add the below code:

```java
 if (MobiComUserPreference.getInstance(this).isRegistered()) {
       new RegisterUserClientService(this).updatePushNotificationId(registrationToken);
 }
```

For Receiving FCM Notifications in your app, Add the following code in your FcmListenerService in onMessageReceived(RemoteMessage remoteMessage) method:
```java
 if (MobiComPushReceiver.isMobiComPushNotification(remoteMessage.getData())) {
       MobiComPushReceiver.processMessageAsync(this, remoteMessage.getData());
       return;
 }
```
### GCM

If you already have GCM enabled in your app, add the below code in Kommunicate.login onSuccess() method and pass the GCM registration token as below:
```java
if(MobiComUserPreference.getInstance(context).isRegistered()) {

      PushNotificationTask pushNotificationTask = null;         
      PushNotificationTask.TaskListener listener = new PushNotificationTask.TaskListener() {                  
            @Override           
            public void onSuccess(RegistrationResponse registrationResponse) {   

            }            
            @Override          
            public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

            } 
      };                    

      pushNotificationTask = new PushNotificationTask(registrationToken, listener, mActivity);            
      pushNotificationTask.execute((Void) null);  
}
```
At the place where you are getting the GCM registration token, add below code:
```java
 if (MobiComUserPreference.getInstance(this).isRegistered()) {
      new RegisterUserClientService(this).updatePushNotificationId(registrationToken);
 }
```
For Receiving GCM Notifications in app, add the following code in your GcmListenerService in onMessageReceived method
```java
if(MobiComPushReceiver.isMobiComPushNotification(data)) {            
      MobiComPushReceiver.processMessageAsync(this, data);               
      return;          
}
```

### Don't have Android Push Notification code ?
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
 PushNotificationTask pushNotificationTask = null;
 PushNotificationTask.TaskListener listener=  new PushNotificationTask.TaskListener() {
     @Override
     public void onSuccess(RegistrationResponse registrationResponse) {

     }
     @Override
     public void onFailure(RegistrationResponse registrationResponse, Exception exception) {

     }
 };
 pushNotificationTask = new PushNotificationTask(Applozic.getInstance(context).getDeviceRegistrationId(),listener,context);
 pushNotificationTask.execute((Void)null);
```

### Custom UI

If you are using custom UI setup then you need to follow all the above steps along with an additional step. Add a job service that is going to start the NotificationIntentService to fire notifications.

You can refer to [this](https://github.com/AppLozic/Applozic-Android-SDK/blob/master/mobicomkitui/src/main/java/com/applozic/mobicomkit/uiwidgets/notification/PushNotificationJobService.java) file or simply copy the file in your project.

Don't forget to register the service in your manifest:
```xml
<service android:exported="false" android:name="com.applozic.mobicomkit.uiwidgets.notification.PushNotificationJobService">
     <intent-filter>
        <action android:name="com.firebase.jobdispatcher.ACTION_EXECUTE"/>
     </intent-filter>
</service>
```
