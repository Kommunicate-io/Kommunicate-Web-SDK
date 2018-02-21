---
id: ios-installation
title: Installation
sidebar_label: Installation
---



### Prerequisites

 * Apps using Applozic can target iOS 8 or later <br />
 * Xcode 8.0 or later required
 
  
### Add Framework Manually 


Download Kommunicate Chat latest framework [**here**](https://github.com/AppLozic/Applozic-iOS-SDK/tree/groupCreate/Frameworks) and add it to your project.

Note : Framework folder has two frameworks.

1. Universal framework: Complied for both simultor and real devices.
2. Archive framework: Complied for real device only. When archiving your app, please use archive framework.

**Add framework to your project:**

i) Paste Applozic framework to root folder of your project. 

ii) Go to Build Phase. 

Expand Embedded frameworks and add applozic framework.         


![dashboard-blank-content](https://raw.githubusercontent.com/AppLozic/Applozic-Chat-SDK-Documentation/master/Resized-adding-applozic-framework.png)        


### Permissions

Add permission for camera, photo library, Micro phone, contacts and location. </br>
In your info.plist add these permission for diffrent type of attachments.

```

<key>NSCameraUsageDescription</key>
<string>Allow Camera</string>
<key>NSContactsUsageDescription</key>
<string>Allow Contacts</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Allow location sharing!!</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow MicroPhone</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow Photos</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Allow write access</string>

 ````

