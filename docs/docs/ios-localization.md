---
id: ios-localization
title: Localization
sidebar_label: Localization
---
## Chat Localization Setup

Localizing Kommunicate iOS SDK is a two step process:

1. Download the sample `Localizable.strings` file from [here](https://github.com/Kommunicate-io/Kommunicate-iOS-SDK/blob/master/Example/Kommunicate/Base.lproj/Localizable.strings).
2. Then copy-paste all the text entries from above `Localizable.strings` file in your projects `Localizable.strings` file after modifying the values in your application's supported language.

To know more about adding language support in iOS, you can read Apple's documentation [here](https://developer.apple.com/internationalization/)

We also have an option to pass a custom localization file name. If you want to keep all Kommunicate SDK related keys in a separate file, then pass the name of your file like this:

```
// Add this in your AppDelegate's didFinishLaunchingWithOptions method
Kommunicate.defaultConfiguration.localizedStringFileName = "SampleKommunicateLocalizable"
```
