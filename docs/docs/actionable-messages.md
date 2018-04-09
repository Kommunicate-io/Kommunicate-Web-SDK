---
id: actionable-messages
title: Actionable Messages
sidebar_label: Actionable Message
---


A pure textual experience is not enough to make a conversation interactive, fruitful, and easy to act upon. Kommunicate allows you to add several other interactive components in conversations such as Images, Audios, and Video in the form of Message Templates, Quick Replies, Buttons, Cards, Lists and other actionable items to provide a rich messaging experience.

Kommunicate renders a valid JSON into Actionable Message. Pass the JSON described below as metadata to utilize Actionable Messages. This example renders Quick Replies along with the message:

 ``` JSON
 {
    "message":"Do you want more updates?",
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
* List
* Cards (coming soon)

# Buttons 

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

# Quick Replies

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

# List Template

The list template is a list of  structured items  with a optional header image and header text.

![List Template](/img/list.jpg)




  * **Components of list template**  A list template may contain below items:
    * Header Image
    * Header text
    * List of items- one item may contain below components:
       1. Thumbline image
       2. Title 
       3. Description
       4. Action of Item
    * List of buttons: one button may contain below components:
       1. Name of button
       2. Action of button


  * **Action on the List** :  There are two type of action supported on list items and buttons.
     * Link  - It will navigate user to the another page in new tab.
     * Quick Reply - it will send a message with given text if passed. Default value will be title of list item or name of  button. Action is specified by the action object passed along with each item and buttons. Here is the action object looks like :



```javascript
// for quick reply action object will be like this:  
action: {
	"type": "quick_reply",
	"text": "text will be sent as message" 
       	}

// for navigation link action object will look like this
action: {
	"type": "link",	
       "url": "url to navigate other page" 
       // page will be opened in new tab 
     	} 
  ```



Here is the sample JSON for the list :

```javascript
metadata: {
		"contentType": "300",
		"templateId": "7",
		"payload": {
			"headerImgSrc": "url for header image",
			"headerText": "header text.",
// headerText Will appear below the header image
			"elements": [{
			  	"imgSrc": "thumbnail icon for list item",
				"title": "list item 1",
				"description": " description for list item",
				"action": {
					"url": "https://www.google.com",
					"type": "link"
				}
			}],
			"buttons": [{
                        "name": "See us on facebook",
				"action": {
					"url": "https://www.facebook.com",
					"type": "link"
					}
			}]
		}
	}
```




  
