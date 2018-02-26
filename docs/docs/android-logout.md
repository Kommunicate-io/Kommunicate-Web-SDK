---
id: android-logout
title: Logout
sidebar_label: Logout
---

Call the following code when a user logs out from your app to log out the user from Kommunicate:
```java
Kommunicate.logout(context, new KMLogoutHandler() {
    @Override
    public void onSuccess(Context context) {
        Log.i("Logout","Success");
    }

    @Override
    public void onFailure(Exception exception) {
        Log.i("Logout","Failed");

    }
});
 ```      
        

