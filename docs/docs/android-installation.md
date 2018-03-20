---
id: android-installation
title: Installation
sidebar_label: Installation
---


Installing Kommunicate in your Android app is easy and fast. We will walk you through the procedure so you can start answering your support queries within few minutes.<br />

### Installation 

Clone Kommunicate Android repo - `Kommunicate-Android-Chat-SDK-Customer-Support` from GitHub 

Kommunicate.io Android Chat SDK for Customer Support <br />
```
git clone https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK-Customer-Support.git
```

Now, from Android Studio, select `File ->New -> Import Module -> Select 'kommunicate'` from cloned path.

Check if the dependency for kommunicate doesn’t exist in your app level gradle file. If not, then add it by the method described below:
```
compile 'io.kommunicate:kommunicate:1.2.4'
```

After the app has successfully build, open your Application Class(If you do not have an application class, create one) and add imlement the ```KmActionCallback``` interface:

```
      public class KommunicateApplication extends MultiDexApplication implements KmActionCallback {
```

Then override the ```KmActionCallback```'s ```onReceive``` method :

```
 @Override
    public void onReceive(Context context, final Object object, String action) {

        switch (action) {
             //This action will be received on click of the default start new chat button
            case Kommunicate.START_NEW_CHAT:
                Kommunicate.setStartNewChat(context, <your-agent-id>, <your-bot-id>); //pass null if you want to use default bot
                break;
                
             //This action will be received on click of logout option in menu
            case Kommunicate.LOGOUT_CALL:
                Kommunicate.performLogout(context, object); //object will receive the exit Activity, the one that will be launched when logout is successfull
                break;
        }
    }
```

The above method will receive the callbacks with an object. You can do your custom operations based on the actions received or use Kommunicate's default actions.
