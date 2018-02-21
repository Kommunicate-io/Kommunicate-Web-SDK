---
id: ios-pushnotification
title: Push Notification
sidebar_label: Push Notification
---


#### Push Notification Setup

#### Objective c

Add import statment in appdelegate file to access the methods 
```
#import <Applozic/Applozic.h>
```


##### a) Send device token to Kommunicate server :

In your AppDelegate’s **didRegisterForRemoteNotificationsWithDeviceToken **method send device registration to Kommunicate server after you get deviceToken from APNS. Sample code is as below:             

```
 - (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)
   deviceToken {                
  
    const unsigned *tokenBytes = [deviceToken bytes];            
    NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",                 
    ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),             
    ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),             
    ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];              
    
    NSString *apnDeviceToken = hexToken;            
    NSLog(@"apnDeviceToken: %@", hexToken);                  
 
   //TO AVOID Multiple call to server check if previous apns token is same as recent one, 
   If its different then call Kommunicate server.          

    if (![[ALUserDefaultsHandler getApnDeviceToken] isEqualToString:apnDeviceToken]) {                         
       ALRegisterUserClientService *registerUserClientService = [[ALRegisterUserClientService alloc] init];          
       [registerUserClientService updateApnDeviceTokenWithCompletion
       :apnDeviceToken withCompletion:^(ALRegistrationResponse
       *rResponse, NSError *error) {   
       
       if (error) {          
             NSLog(@"%@",error);             
            return;           
          }              
    NSLog(@"Registration response from server:%@", rResponse);                         
    }]; 
  } 
}                                 

```


##### b) Receiving push notification :

Once your app receive notification, pass it to Kommunicate handler for chat notification processing.             

```

- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)dictionary {

    NSLog(@"Received notification WithoutCompletion: %@", dictionary);
    ALPushNotificationService *pushNotificationService = [[ALPushNotificationService alloc] init];
    [pushNotificationService notificationArrivedToApplication:application withDictionary:dictionary];
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
   
    NSLog(@"Received notification Completion: %@", userInfo);
    ALPushNotificationService *pushNotificationService = [[ALPushNotificationService alloc] init];
     [pushNotificationService notificationArrivedToApplication:application withDictionary:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
    
}

```


##### c) Handling app launch on notification click :          

```

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    // checks wheather app version is updated/changed then makes server call setting VERSION_CODE
    [ALRegisterUserClientService isAppUpdated];
    
    // Register for Kommunicate notification tap actions and network change notifications
    ALAppLocalNotifications *localNotification = [ALAppLocalNotifications appLocalNotificationHandler];
    [localNotification dataConnectionNotificationHandler];
    
    // Override point for customization after application launch.
    NSLog(@"launchOptions: %@", launchOptions);
    if (launchOptions != nil) {
        NSDictionary *dictionary = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
        if (dictionary != nil) {
            NSLog(@"Launched from push notification: %@", dictionary);
            ALPushNotificationService *pushNotificationService = [[ALPushNotificationService alloc] init];
            BOOL applozicProcessed = [pushNotificationService processPushNotification:dictionary updateUI:[NSNumber numberWithInt:APP_STATE_INACTIVE]];
            
            //IF not a appplozic notification, process it
            if (!applozicProcessed) {
                //Note: notification for app
            }
        }
    }
    return YES;
}

```

##### d) AppDelegate changes to observe background/foreground notification.

```
- (void)applicationDidEnterBackground:(UIApplication *)application {
    
    ALRegisterUserClientService *registerUserClientService = [[ALRegisterUserClientService alloc] init];
    [registerUserClientService disconnect];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"APP_ENTER_IN_BACKGROUND" object:nil];
}
```

```
- (void)applicationWillEnterForeground:(UIApplication *)application {

    ALRegisterUserClientService *registerUserClientService = [[ALRegisterUserClientService alloc] init];
    [registerUserClientService connect];
    [ALPushNotificationService applicationEntersForeground];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"APP_ENTER_IN_FOREGROUND" object:nil];
}
```

##### e) Save Context when app terminates

```
- (void)applicationWillTerminate:(UIApplication *)application {

    [[ALDBHandler sharedInstance] saveContext];
}
```





### Swift


#### Push Notification Setup


Add import statment in appdelegate file to access the methods 
```
import Applozic
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

        if (ALUserDefaultsHandler.getApnDeviceToken() != deviceTokenString)
        {
            let alRegisterUserClientService: ALRegisterUserClientService = ALRegisterUserClientService()
            alRegisterUserClientService.updateApnDeviceToken(withCompletion: deviceTokenString, withCompletion: { (response, error) in
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
    let alPushNotificationService: ALPushNotificationService = ALPushNotificationService()
    alPushNotificationService.notificationArrived(to: application, with: userInfo)
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {

    print("Received notification With Completion :: \(userInfo.description)")
    let alPushNotificationService: ALPushNotificationService = ALPushNotificationService()

    alPushNotificationService.notificationArrived(to: application, with: userInfo)
    completionHandler(UIBackgroundFetchResult.newData)
}                                                        
```


##### c) Handling app launch on notification click :          

```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

  // Override point for customization after application launch.
  let alApplocalNotificationHnadler : ALAppLocalNotifications =  ALAppLocalNotifications.appLocalNotificationHandler();
  alApplocalNotificationHnadler.dataConnectionNotificationHandler();

      if (launchOptions != nil)
          {
              let dictionary = launchOptions?[UIApplicationLaunchOptionsKey.remoteNotification] as? NSDictionary

              if (dictionary != nil)
              {
                  print("launched from push notification")
                  let alPushNotificationService: ALPushNotificationService = ALPushNotificationService()

                  let appState: NSNumber = NSNumber(value: 0 as Int32)
                  let applozicProcessed = alPushNotificationService.processPushNotification(launchOptions,updateUI:appState)
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

        ALPushNotificationService.applicationEntersForeground()
        print("APP_ENTER_IN_FOREGROUND")

        NotificationCenter.default.post(name: Notification.Name(rawValue: "APP_ENTER_IN_FOREGROUND"), object: nil)
        UIApplication.shared.applicationIconBadgeNumber = 0
}
```

##### e) Save Context when app terminates

```
    func applicationWillTerminate(application: UIApplication) {
        ALDBHandler.sharedInstance().saveContext()
    }
```
