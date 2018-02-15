---
id: android-installation
title: Installation
sidebar_label: Installation
---

Kommunicate-Android-Chat-SDK-Customer-Support
Kommunicate.io Android Chat SDK for Customer Support

Installation
Clone this repo and then from Android Studio select File ->New -> Import Module -> Select 'kommunicate' from cloned path. Check in your app level gradle file, if the dependency for kommunicate does'nt exists then add it as below

```java
compile project(':kommunicate')
```