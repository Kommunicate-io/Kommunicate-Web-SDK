---
id: actionable-messages
title: Actionable Messages
sidebar_label: Actionable Message
---
# Actionable Messages

**Configure Actionable Messages in Kommunicate**

A pure textual experience is not enough to make a conversation interactive, fruitful, and easy to act upon. Kommunicate allows you to add several other interactive components in conversations such as Images, Audios, and Video in the form of Message Templates, Quick Replies, Buttons, Cards, Lists and other actionable items to provide a rich messaging experience.

Kommunicate renders a valid JSON into Actionable Message. Pass the JSON described below as metadata to utilize Actionable Messages. This example renders Quick Replies along with the message:

 ``` JSON
 {
    "message":"Do you want more updates?"
    "metadata": {
        "contentType": "300",
        "templateId": "6",
        "payload": [{
            "title ": "Yes",
            "message ": "Cool! send me more."
        }, {
            "title ": "No ",
            "message": "Don't send it to me again"
        }]
    }
}
```
Here is a list of available Actionable Messages:

* Buttons

    * Link Buttons

    * Submit Buttons

* Quick Replies

* Lists (coming soon)

* Cards (coming soon)

**Buttons** 

You can add any number of Button in your conversations for faster navigation. There are two type of Buttons supported in Kommunicate:

* **Link Button** 
Link Button redirects users to a given URL in a new tab. Use below metadata to render the Link Buttons:

``` JSON
{
  "contentType": "300",
  "templateId": "3",
  "payload": [{
          "type": "link",
          "url": "www.google.com",
          "name": "Go To Google",
      },
      {
          "type": "link",
          "url": "www.facebook.com",
          "name": "Go To Facebook"
      }
  ]
}
```

* **Submit Button** 
Submit button allows you to post given data on a given URL.

``` JSON 
{
  "contentType": "300",
  "templateId": "3",
  "payload": [{
      "name ": "Submit",
      "handlerId ": "km-eh-001"
  }],
  "formData": {
      "name":"Tom Marvolo Riddle",
              "nickName":"Voldemort"
  },
  "formAction": "https://example.com/users"
}
```

**Quick Replies** 
Quick Replies provides a way to send messages on a click without typing them all out manually. You can add any number of Quick Replies by passing values in the metadata as described below:

``` JSON
{
    "contentType": "300",
    "templateId": "6",
    "payload": [{
        "title ": "Yes",
        "message ": "Cool! send me more."
    }, {
        "title ": "No ",
        "message": "Don't send it to me again"
    }]
}
```

The appearance of the Quick Replies and Buttons will be adjusted automatically.
  
