---
id: ios-installation
title: Installation
sidebar_label: Installation
---

### Prerequisites

 * Apps using Kommunicate can target iOS 9 or later <br />
 * Xcode 8.0 or later required


### Installation

Kommunicate is available through [CocoaPods](http://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod 'Kommunicate'
```

Then run `pod install`.

In any file you'd like to use Kommunicate in, don't forget to
import the framework with `import Kommunicate`.


### Permissions

Add permission for camera, photo library, Micro phone, contacts and location. </br>

In your app's Info.plist file add below listed permissions:

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

```
