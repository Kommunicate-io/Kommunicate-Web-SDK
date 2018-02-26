---
id: android-installation
title: Installation
sidebar_label: Installation
---

Installing Kommunicate in your Android app is easy and fast. We will walk you through the procedure so you can start answering your support queries within few minutes.<br />

### Installation 

Clone Kommunicate Android repo - `Kommunicate-Android-Chat-SDK-Customer-Support` from GitHub 

```
git clone https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK-Customer-Support.git
```


Now, from Android Studio, select `File ->New -> Import Module -> Select 'kommunicate'` from cloned path.

Check if the dependency for kommunicate doesn’t exist in your app level gradle file. If not, then add it by the method described below:

```
compile project(':kommunicate')
```
