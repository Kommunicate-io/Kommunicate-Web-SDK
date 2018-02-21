---
id: android-installation
title: Installation
sidebar_label: Installation
---

Kommunicate.io Android Chat SDK for Customer Support <br />

### Installation 

Clone this repo  Kommunicate-Android-Chat-SDK-Customer-Support from github 

```
git clone https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK-Customer-Support.git
```


Then from Android Studio select File ->New -> Import Module -> Select 'kommunicate' from cloned path.

Check in your app level gradle file, if the dependency for kommunicate does'nt exists then add it as below


```
compile project(':kommunicate')
```
