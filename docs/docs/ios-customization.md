---
id: ios-customization
title: Customization
sidebar_label: Customization
---

## Theme Customization

In this section we have explained about the configuration options present in the SDK to modify color, font etc.

You can override any of the properties from the default configuration. Doing it in your AppDelegate is preferred.

### Conversation Screen Background Color

Background color of the Conversation screen

`Kommunicate.defaultConfiguration.backgroundColor = UIColor.white`

### Received Message Background Color

The background color of the received message bubble.

`ALKMessageStyle.receivedBubble.color = UIColor.lightGray`


### Sent Message Background Color

The background color of the sent message bubble.

`ALKMessageStyle.receivedBubble.color = UIColor.lightGray`


### Message Text Font and Color

Use this for changing message text font and color in the Conversation screen.

`ALKMessageStyle.message = Style(font: UIFont.systemFont(ofSize: 14), text: UIColor.black)`

### Navigation Bar's Background Color

The navigation bar's background color in all the screens.

`Kommunicate.defaultConfiguration.navigationBarBackgroundColor = UIColor.navigationOceanBlue()`

### Navigation Bar's Tint color

Use this for changing colors of buttons on navigation bar like back button.

`Kommunicate.defaultConfiguration.navigationBarItemColor = UIColor.navigationTextOceanBlue()`


### Navigation Bar's Title color

The navigation bar's title color.

`Kommunicate.defaultConfiguration.navigationBarTitleColor = UIColor.black`

## Sending additional metadata with messages

If you want to send additional metadata with all the messages sent from a device then use below code:

```
// Add this in AppDelegate's `didFinishLaunchingWithOptions` method
let customData = ["custom-key": "value"]
Kommunicate.defaultConfiguration.messageMetadata = ["KM_CHAT_CONTEXT":"\(customData)"]
```

