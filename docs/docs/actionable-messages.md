---
id: actionable-messages
title: Actionable Messages
sidebar_label: Actionable Message
---
**Actionable Message in Kommunicate**

Text messages are not enough to make a conversation Interactive. Kommunicate allow you to add several other components like images, audio, video and a set of actionable message in the form of message templates, quick replies, buttons,cards,lists and more to make conversation more interactive.
<br>
Kommunicate renders a valid JSON into actionable message. Pass this JSON as `metadata` as described in below example. This example renders quick replies along with the message : 
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
Here is the list of available actionable messages:
* Buttons
  * Link Buttons
  * Submit Buttons
* Quick Replies 
* Lists (coming soon)
* Cards (coming soon)


**Buttons**
Add  any number of clickable buttons in conversation. There are two type of buttons supported in Kommunicate:
  * **Link Button** 
  Redirect user to a given url in new tab. Use below `metadata` to render the link buttons:
  
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
  Submit button allow you to post the given data on a given url. 
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
Quick replies provides a way to send messages on a click without typing them. Add any number of auto replies by using below `metadata`.

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
The appreance of the Auto replies and buttons will be adjusted automatically.
  
