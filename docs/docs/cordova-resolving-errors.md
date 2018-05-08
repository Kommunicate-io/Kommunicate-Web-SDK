#### Android support libraries/google versions conflict

If using multiple plugins, you may get support libraries or firebase version conflict issues in android. 
Use the below gradle script in your `app/platform/android/build.gradle` file's dependencies :

```
dependencies {
  configurations.all {
     resolutionStrategy.eachDependency { DependencyResolveDetails details ->
         def requested = details.requested
         if (requested.group == 'com.google.firebase' || requested.group == 'com.google.android.gms') {
            details.useVersion '11.6.0'  //use a common firebase/google version here
        }

         if (requested.group == 'com.android.support' && requested.name != 'multidex') {
            details.useVersion '27.0.2'  //use a common support libraries version here
        }
     }
   }
}
```

#### iOS Swift version issue

Older versions of the plugin may give the build error "Swift version not specified". 
Open the `YourProject.xcworkspace` from yourApp/platforms/ios directory in your Xcode and build the project.
Then click on the Kommunicate module and specify the `SWIFT_VERSION`
Similary for ApplozicSwift module.

