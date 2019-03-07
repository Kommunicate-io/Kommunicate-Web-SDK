---
id: cordova-resolving-errors
title: Resolving Errors
sidebar_label: Resolving Errors
---

## Android support libraries/google versions conflict

If using multiple plugins that use android support libraries or google/firebase dependencies, you may get support libraries or firebase version conflict issues in android. 
Use the below script in your `app/platform/android/build.gradle` file's dependencies(paste the script at the end of all the dependencies) :

```groovy
dependencies {
  //Here there will be some depencies
  //This is the last dependency 
  
  configurations.all {
        resolutionStrategy.eachDependency { DependencyResolveDetails details ->
            def requested = details.requested
            if (requested.group == 'com.google.firebase' && requested.name == 'firebase-messaging') {
                details.useVersion '17.1.0'  //use a common firebase version here
            }

            if (requested.group == 'com.google.android.gms' && (requested.name == 'play-services-maps' || requested.name == 'play-services-location')) {
                details.useVersion '15.0.1'  //use a common gms version here
            }

            if (requested.group == 'com.android.support' && requested.name != 'multidex') {
                details.useVersion '27.1.1'  //use a common support libraries version here
            }
        }
    }
}
```

## iOS Swift version issue

Older versions of the plugin may give the build error "Swift version not specified". 
Open the `YourProject.xcworkspace` from yourApp/platforms/ios directory in your Xcode and build the project.
Then click on the Kommunicate module and specify the `SWIFT_VERSION`.

Similary for ApplozicSwift module.

## kommunicate is not defined

If you get the error related to `'ReferenceError: kommunicate is not defined'`, then it could be one of the 3 reasons below:
1) kommunicate varibale has not been defined:

   Make sure you define the varibale in the page where you are calling any function from the plugin.
  ```
  declare var kommunicate: any;
  ```
  
2) Kommunicate plugin is not added:
   
   Please run the below command to check the plugin list in your application. Verify if the plugin `kommunicate-cordova-plugin` is present in the list.
   ```
   ionic cordova plugin ls
   ```
   
 3) You are running the app on platforms other than iOS/Android
 
   This plugin is a wrapper around the native iOS and Android platforms. If you are running the plugin on browser, windows etc    platforms then it would throw this error. Also do not use the `ionic serve` command to run/debug the app with kommunicate      plugin added.
   
 If you still face this error after verifying these 3 reasons, please contact Kommunicate support.
   

