---
id: android-localization
title: Localization
sidebar_label: Localization
---

## Chat Localization Setup

 Follow the below steps to add locale support in the SDK.
 1) Create the 'Android resource directory' for the locale. For e.g. create values-es for spansish locale in your res directory.
 2) Create the string resource file for your locale and place it under the above directory. For e.g. Create file strings.xml and place it under values-es directory.
 3) Download and override resource string for your locale from below links. Translate all the strings from the below files to your locale and place it in the strings.xml file.
     * [Array Options](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/blob/master/kommunicateui/src/main/res/values/mobicom_array.xml)
     * [Common Strings](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/blob/master/kommunicateui/src/main/res/values/mobicom_strings.xml)
     * [Simple Strings](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/blob/localization/kommunicateui/src/main/res/values/strings.xml)
     
 Example: Change resource string (message) value to Spanish locale:
 ```xml
     <string name="message">Mensaje</string>
 ```
 
#### Note:
We have most of the strings converted to Spanish locale. You can Download the files [from here](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/tree/localization/app/src/main/res/values-es). For your convenience, do cross check if all the strings have been translated and are not left out. Also, please cross check if the translation is accurate.
