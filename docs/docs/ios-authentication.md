---
id: ios-authentication
title: Authentication
sidebar_label: Authentication
---


## Download ALChatManager files


* If you are using Objective-C then download the [**ALChatManager.h**](https://raw.githubusercontent.com/AppLozic/Applozic-iOS-SDK/master/sample-with-framework/applozicdemo/ALChatManager.h)   and [**ALChatManager.m**](https://raw.githubusercontent.com/AppLozic/Applozic-iOS-SDK/master/sample-with-framework/applozicdemo/ALChatManager.m) files.


* If you are using Swift then download  [**ALChatManager.swift**](https://raw.githubusercontent.com/AppLozic/Applozic-iOS-Chat-Samples/master/sampleapp-swift/sampleapp-swift/ALChatManager.swift)

In case of Swift there is one extra step:


Add New cocoa class NSObject+ApplozicBridge in Objective-C. On adding, it will ask “Would you like to create bridging header?” say “yes” and in bridging file paste the following code:

```
#import "Applozic/ALMessage.h"
#import "Applozic/ALMessageClientService.h"
#import "Applozic/ALRegistrationResponse.h"
#import "Applozic/ALUser.h"
#import "Applozic/ALChatLauncher.h"
#import "Applozic/ALApplozicSettings.h"
#import "Applozic/ALAppLocalNotifications.h"
#import "Applozic/ALConversationService.h"
```
Change value of applicationId in ALChatManager.h with your applicationKey

At the top of your Objective‑C source files, use `#import "ALChatManager.h"`



## Registration/Login


Convenient methods are present in ALChatManager file to register a user with the Kommunicate

You can Register user to the Kommunicate server by using below method from ALChatManager.h.


### Objective c :

* Create an ALUser object and add pass the details:

```
ALUser *alUser = [[ALUser alloc] init];
[alUser setUserId:@"demoUser"]; //NOTE : +,*,? are not allowed chars in userId.
[alUser setDisplayName:@"Kommunicate demo"]; // Display name of user 
[alUser setContactNumber:@""];// formatted contact no
[alUser setImageLink:@"user_profile_image_link"];// User's profile image link.
```


* Save the details (Add it just after the above ALUser object creation):

```
[ALUserDefaultsHandler setUserId:user.userId];
[ALUserDefaultsHandler setEmailId:user.email];
[ALUserDefaultsHandler setDisplayName:user.displayName];

```

* Call this to register/login:
```
ALChatManager * chatManager = [[ALChatManager alloc] initWithApplicationKey:@"22823b4a764f9944ad7913ddb3e43cae1"];
[chatManager registerUserWithCompletion:user withHandler:^(ALRegistrationResponse *rResponse, NSError *error) {
        
        if (!error)
        {
	   //Kommunicate registration successful
	   
        }
	else
	{
            NSLog(@"Error in Kommunicate registration : %@",error.description);
	}
    }];
 ```
 
 
 ### Swift:
 
 * Create an ALUser object and add pass the details:


```
let alUser : ALUser =  ALUser()
alUser.userId = "demoUser"     // NOTE : +,*,? are not allowed chars in userId.
alUser.email = "support@kommunicate.io"
alUser.imageLink = ""    							// User's profile image link.
alUser.displayName = "Kommunicate demo"  	// User's Display Name
```

* Save the details (Add it just after the above ALUser object creation):

```
ALUserDefaultsHandler.setUserId(alUser.userId)
ALUserDefaultsHandler.setEmailId(alUser.email)
ALUserDefaultsHandler.setDisplayName(alUser.displayName)
```
 
 * Call this to register/login:

```
 let chatManager = ALChatManager(applicationKey: "22823b4a764f9944ad7913ddb3e43cae1")
chatManager.registerUser(alUser) { (response, error) in

    if (error == nil)
      {
      	//Kommunicate registration successful
    } else {
          NSLog("Error in Kommunicate registration : %@",error.description);
    }
})
```

### Token


If [access token validation](https://docs.applozic.com/docs/configuration#access-token-url) is configured from your server then set your server generated token as the password at the time of user registration.


* Set Authentication type to CLIENT in ALChatManager.m

### Objective c :
```
[ALUserDefaultsHandler setUserAuthenticationTypeId:(short)CLIENT];
 ```
 ### Swift:

```
ALUserDefaultsHandler.setUserAuthenticationTypeId(CLIENT)
```


* Set access token generated as a password.

### Objective c :

```
[user setPassword:<YOUR ACCESS TOKEN>];
[ALUserDefaultsHandler setPassword:<YOUR ACCESS TOKEN>]; 
 ```
 ### Swift:
 
 ```
 user.setPassword(<YOUR ACCESS TOKEN>)
 ALUserDefaultsHandler.setPassword(<YOUR ACCESS TOKEN>)
```



