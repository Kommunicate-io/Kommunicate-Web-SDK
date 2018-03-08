---
id: ios-pushnotification
title: Push Notification
sidebar_label: Push Notification
---


## Push Notification Setup


Add import statement in Appdelegate file to access the methods
```
import Kommunicate
```

##### a) Send device token to Kommunicate server :

In your AppDelegate’s **didRegisterForRemoteNotificationsWithDeviceToken** method send device registration to Kommunicate server after you get deviceToken from APNS. Sample code is as below:             

```
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data)
    {

        NSLog("Device token data :: \(deviceToken.description)")

        var deviceTokenString: String = ""
        for i in 0..<deviceToken.count
        {
            deviceTokenString += String(format: "%02.2hhx", deviceToken[i] as CVarArg)
        }

        NSLog("Device token :: \(deviceTokenString)")

        if (KMUserDefaultsHandler.getApnDeviceToken() != deviceTokenString)
        {
            let kmRegisterUserClientService: KMRegisterUserClientService = KMRegisterUserClientService()
            kmRegisterUserClientService.updateApnDeviceToken(withCompletion: deviceTokenString, withCompletion: { (response, error) in
               if error != nil {
                   NSLog("Error in Registration: %@", error)
               }
               NSLog("Registration Response :: \(response)")
            })
        }
    }

```


##### b) Receiving push notification :

Once your app receive notification, pass it to Kommunicate handler for chat notification processing.             

```
func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any]) {
    print("Received notification :: \(userInfo.description)")
    let kmPushNotificationService: KMPushNotificationService = KMPushNotificationService()
    kmPushNotificationService.notificationArrived(to: application, with: userInfo)
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {

    print("Received notification With Completion :: \(userInfo.description)")
    let kmPushNotificationService: KMPushNotificationService = KMPushNotificationService()

    KMPushNotificationService.notificationArrived(to: application, with: userInfo)
    completionHandler(UIBackgroundFetchResult.newData)
}                                                        
```


##### c) Handling app launch on notification click :          

```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  // Override point for customization after application launch.
  let kmApplocalNotificationHandler : KMAppLocalNotification =  KMAppLocalNotification.appLocalNotificationHandler();
  kmApplocalNotificationHnadler.dataConnectionNotificationHandler();

      if (launchOptions != nil)
          {
              let dictionary = launchOptions?[UIApplicationLaunchOptionsKey.remoteNotification] as? NSDictionary

              if (dictionary != nil)
              {
                  print("launched from push notification")
                  let kmPushNotificationService: KMPushNotificationService = KmPushNotificationService()

                  let appState: NSNumber = NSNumber(value: 0 as Int32)
                  let kommunicateProcessed = kmPushNotificationService.processPushNotification(launchOptions,updateUI:appState)
                  if (!applozicProcessed)
                  {
                      //Note: notification for app
                  }
              }
          }

   return true
}                         

```
##### d)  AppDelegate changes to observe background/foreground notification.

```
    func applicationDidEnterBackground(_ application: UIApplication) {

        print("APP_ENTER_IN_BACKGROUND")
        NotificationCenter.default.post(name: Notification.Name(rawValue: "APP_ENTER_IN_BACKGROUND"), object: nil)
    }

```
 ```
func applicationWillEnterForeground(_ application: UIApplication) {

        KMPushNotificationService.applicationEntersForeground()
        print("APP_ENTER_IN_FOREGROUND")

        NotificationCenter.default.post(name: Notification.Name(rawValue: "APP_ENTER_IN_FOREGROUND"), object: nil)
        UIApplication.shared.applicationIconBadgeNumber = 0
}
```

##### e) Save Context when app terminates

```
    func applicationWillTerminate(application: UIApplication) {
        KMDBHandler.sharedInstance().saveContext()
    }
```
