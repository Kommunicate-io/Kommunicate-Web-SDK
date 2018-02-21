---
id: ios-logout
title: Logout
sidebar_label: Logout


Call the following code when a user logs out from your app:


### Objective c 

```

ALRegisterUserClientService *registerUserClientService = [[ALRegisterUserClientService alloc] init];
[registerUserClientService logoutWithCompletionHandler:^(ALAPIResponse *response, NSError *error) {
    if(!error && [response.status isEqualToString:@"success"])
    {
        NSLog(@"Logout success");
    }
    else
    {
        NSLog(@"Logout failed with response : %@",response.response);
    }
	}];
}

```




### Swift

```
let registerUserClientService: ALRegisterUserClientService = ALRegisterUserClientService()
registerUserClientService.logout { (response, error) in
			if(error == nil && response.status == "success") {
      		NSLog("Logout success")
       } else {
       		NSLog("Logout failed with response : %@", response.response)
       }
     }
}

```
