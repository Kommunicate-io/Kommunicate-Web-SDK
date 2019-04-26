---
id: android-customization
title: Customization
sidebar_label: Customization
---

Kommunicate provides easy settings to customise message text color, background colors and enable of disable any particular feature.

Follow the below steps:
1) Download the setting file from [here](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/blob/master/app/src/main/assets/applozic-settings.json).
2) Place the downloaded applozic-settings.json file under your app/src/main/assets/ folder

There are a lot of customisation options in the file, refer [this link](https://docs.applozic.com/docs/android-chat-theme-and-customization#section-applozic-settings-json-properties-detail) for more details.

### Hiding/Showing media attachment and location sharing options:
You can hide or show the media attachments options like camera, emoji, files and location sharing by changing the below values in applozic-settings.json file.
Make an option false if you want to hide it.

```json
"attachmentOptions": {
    ":location": true,
    ":camera": true,
    ":file": true,
    ":audio":true
  }
```

### If location sharing functionality is enabled:
If you are NOT enabling location sharing functionality, you may go to the next step: [Other properties](https://github.com/AppLozic/Kommunicate/blob/reytum-patch-1/docs/docs/android-customization.md#other-properties)

If you are enabling the location option in the `applozic-settings.json` file, make sure to include the below permissions and geo-API key in your `AndroidManifest.xml` file

Add the following permissions in your `AndroidManifest.xml` file:

```xml
   <uses-permission android:name="<your package name>.permission.MAPS_RECEIVE" />
   <permission
        android:name="<your package name>..permission.MAPS_RECEIVE"
        android:protectionLevel="signature" />
```

Add your geo-API_KEY in `AndroidManifest.xml` file:
```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="<your-geo-API-KEY>" />
```

### Other properties
Apart from the properties mentioned in the above [Applozic documentation](https://docs.applozic.com/docs/android-chat-theme-and-customization#section-applozic-settings-json-properties-detail), there are some other properties in `applozic-seetings.json` file that are specific to Kommunicate.

```json
"enableFaqOption": [         //Setting to enable/disable the FAQ button on the toolbar.
    false,                   //Making this true will enable the FAQ button on the conversation list screen(first screen)
    false                    //Making this true will enable the FAQ button on the message list screen(individual chat thread)
  ],
"enableAwayMessage": false,   //Away message will be disabled
"logoutOption": false,        //The logout option in the Option menu will be hidden
"showStartNewConversation" : false, //The default Start New Conversation button will be hidden
"sentMessageCornerRadii": [  //The corner radii for sent message bubble
10,                          //top left corner radius
10,                          //top right corner radius
10,                          //bottom right corner radius
10                           //bottom left corner radius
],
"receivedMessageCornerRadii": [  //The corner radii for received message bubble . (Similar order as sentMessageCornerRadii)
10,
10,
10,
10
]
```

### Changing fonts
Fonts for some TextViews can be changed by setting the fonts in the `applozic-settings.json` file. Add the below property in `applozic-settings.json` file to change the fonts for the respective TextViews:
```
"fontModel": {
    "messageTextFont": "",
    "messageDisplayNameFont": "",
    "createdAtTimeFont": "",
    "toolbarTitleFont": "",
    "toolbarSubtitleFont": "",
    "messageEditTextFont": ""
  }
```
If a particular field is left blank or is not included in the above object, then default font would be used for the same.
To change the font, provide either an external font file or select from a list of default android fonts.

#### Use TTF font file
To use an external font, add the ttf font file under the directory app/src/main/assets/fonts/<your-font>.ttf
Then specify the font for the specific TextView. For e.g to use the above font for toolbarTitle, set the path to the property `toolbarTitleFont`:
```
"fontModel": {
    "messageTextFont": "",
    "messageDisplayNameFont": "",
    "createdAtTimeFont": "",
    "toolbarTitleFont": "fonts/<your-font>.ttf",
    "toolbarSubtitleFont": "",
    "messageEditTextFont": ""
  }
```
   
#### Use android's default fonts
To use the font from the list of default android fonts, set the font name to the TextView property in the fontModel object in `applozic-settings.json` file. Use a font from the below list. Only one font is allowed, no combinations of fonts are allowed.

```
normal, 
bold,
italic,
bold_italic,
default,
default_bold,
monospace,
sans_serif,
serif
```

For e.g to use `sans_serif` font for the toolbar subtitle TextView, set the font name to the `toolbarSubtitleFont` property:
```
"fontModel": {
    "messageTextFont": "",
    "messageDisplayNameFont": "",
    "createdAtTimeFont": "",
    "toolbarTitleFont": "fonts/<your-font>.ttf",
    "toolbarSubtitleFont": "sans_serif",
    "messageEditTextFont": ""
  }
```


### Theme Customization
Not all the colors can be changed from the applozic-settings.json file. There are some colors like the statusbar/toolbar color, message statuc icon colors(sent, delivered etc icons)
which you need to override in your colors file.

Follow the below steps to override the default colors in Kommunicate:
1) Add the below line in your `<resources` tag in the colors.xml file
```
xmlns:tools="http://schemas.android.com/tools"
```
2) Add the below colors in your colors.xml file and use your own color values in them
```xml
    <color name="message_status_icon_colors" tools:override="true">#FF4081</color> // Message status icon color
    <color name="applozic_theme_color" tools:override="true">#FFB3E5FC</color>     //Theme color
    <color name="applozic_theme_color_primary" tools:override="true">#FF4081</color> 
    <color name="applozic_theme_color_primary_dark" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_accent" tools:override="true">#3F51B5</color>
    <color name="default_start_new_button_color" tools:override="true">#FF4081</color> //Default start new conversation button color
```

Sample colors.xml file:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <Your other app specific colors go here>
    
    <color name="message_status_icon_colors" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color" tools:override="true">#FFB3E5FC</color>
    <color name="applozic_theme_color_primary" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_primary_dark" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_accent" tools:override="true">#3F51B5</color>
    <color name="default_start_new_button_color" tools:override="true">#FF4081</color>
</resources>
```

### Sending additional metadata with messages:
If you need to send some additional data with all the messages sent from a device then you need to set a predefined metadata when logging in the user.
For e.g If you need to send deviceInformation with all the messages sent from that device then call the below function in onSuccess of login or whatever initial method you are calling from Kommunicate:

```java
 Map<String, String> metadata = new HashMap<>();
 metadata.put("deviceId", "Current Device ID");
 metadata.put("deviceManufaturer", "Some manufacturer");
 ApplozicClient.getInstance(context).setMessageMetaData(metadata);
 ```
 This data will be sent with all the messages sent from the device.
