---
id: android-installation
title: Installation
sidebar_label: Installation
---


Installing Kommunicate in your Android app is easy and fast. We will walk you through the procedure so you can start answering your support queries within few minutes.<br />

### Installation 

Add the following in your app build.gradle dependency:

```
compile 'io.kommunicate:kommunicate:1.4'
```
Add the below Activities in your `AndroidManifest.xml` file :

```
          <activity
            android:name="io.kommunicate.activities.KMConversationActivity"
            android:configChanges="keyboardHidden|screenSize|locale|smallestScreenSize|screenLayout|orientation"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:theme="@style/ApplozicTheme" />
            
          <activity
            android:name="com.applozic.mobicomkit.uiwidgets.conversation.activity.ChannelNameActivity"
            android:configChanges="keyboardHidden|screenSize|smallestScreenSize|screenLayout|orientation"
            android:launchMode="singleTop"
            android:parentActivityName="io.kommunicate.activities.KMConversationActivity"
            android:theme="@style/ApplozicTheme" />

        <activity
            android:name="com.applozic.mobicomkit.uiwidgets.conversation.activity.ChannelInfoActivity"
            android:configChanges="keyboardHidden|screenSize|smallestScreenSize|screenLayout|orientation"
            android:launchMode="singleTop"
            android:parentActivityName="io.kommunicate.activities.KMConversationActivity"
            android:theme="@style/ApplozicTheme">
            <meta-data
                android:name="android.support.PARENT_ACTIVITY"
                android:value="io.kommunicate.activities.KMConversationActivity" />
        </activity>

        <activity
            android:name="com.applozic.mobicomkit.uiwidgets.conversation.activity.MobicomLocationActivity"
            android:configChanges="keyboardHidden|screenSize|smallestScreenSize|screenLayout|orientation"
            android:parentActivityName="io.kommunicate.activities.KMConversationActivity"
            android:theme="@style/ApplozicTheme"
            android:windowSoftInputMode="adjustResize" />
```

Add the following permissions in your `AndroidManifest.xml` file:

```
<uses-permission android:name="<your package name>.permission.MAPS_RECEIVE" />
<permission
        android:name="<your package name>..permission.MAPS_RECEIVE"
        android:protectionLevel="signature" />
```

Add your geo-API_KEY in `AndroidManifest.xml` file:
```
       <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="<your-geo-API-KEY>" />
```

After the app has successfully build, open your Application Class(If you do not have an application class, create one) and add implement the ```KmActionCallback``` interface:

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
                List<String> agents = new ArrayList<>(); //add your agents to this list
                List<String> bots = new ArrayList<>(); //add your bots to this list
                 try {
                    KmHelper.setStartNewChat(context, agents, bots);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
             //This action will be received on click of logout option in menu
            case Kommunicate.LOGOUT_CALL:
                KmHelper.performLogout(context, object); //object will receive the exit Activity, the one that will be launched when logout is successfull
                break;
        }
    }
```

The above method will receive the callbacks with an object. You can do your custom operations based on the actions received or use Kommunicate's default actions.
