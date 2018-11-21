---
id: actionable-messages
title: Actionable Messages
sidebar_label: Actionable Message
---


A pure textual experience is not enough to make a conversation interactive, fruitful, and easy to act upon. Kommunicate allows you to add several other interactive components in conversations such as Images, Audios, and Video in the form of Message Templates, Quick Replies, Buttons, Cards, Lists and other actionable items to provide a rich messaging experience.

Kommunicate renders a valid JSON into Actionable Message. Pass the JSON described below as metadata to utilize Actionable Messages. This example renders Quick Replies along with the message:

 ``` js
 {
	"message":"Do you want more updates?",
	"ignoreTextResponse": false, // pass true if you want to hide the text response which you're passing along with custom payload in intent. 
    "platform":"kommunicate",
    "metadata": {
        "contentType": "300",
        "templateId": "6",
        "payload": [{
            "title": "Yes",
            "message": "Cool! send me more."
        }, {
            "title": "No ",
            "message": "Don't send it to me again"
        }]
    }
}
```
If you're passing both text response and custom payload in intent and want to hide the text response you can pass 
**ignoreTextResponse : true**. 

Here is a list of available Actionable Messages:

* Buttons
    * Link Buttons
    * Submit Buttons
* Quick Replies
* Images
* List
* Cards (coming soon)

## Buttons 

You can add any number of Button in your conversations for faster navigation. There are two type of Buttons supported in Kommunicate:

* **Link Button** 
Link Button redirects users to a given URL in a new tab. Use below metadata to render the Link Buttons:

``` JSON
{
    "message": "click on the buttons",
    "platform":"kommunicate",
	"metadata": {
		"contentType": "300",
		"templateId": "3",
		"payload": [{
				"type": "link",
				"url": "www.google.com",
				"name": "Go To Google"
			},
			{
				"type": "link",
				"url": "www.facebook.com",
				"name": "Go To Facebook"
			}
		]
	}
}
```

* **Submit Button** 
Submit button allows you to post given data or redirect the user to a given URL. If parameter `requestType:json` is included it will post the data with content type `application/json` on the `formAction` url and `replyText` will be used as acknowledgement message. Default value for `replyText` is same as the value passed in `name` parameter. <br><br>
If `requestType` parameter is not passed, it will submit the `formData` with contentType `application/x-www-form-urlencoded` and redirect the user on `formAction` url. The response will be rendered in new tab.
  
``` JSON 
{
	"message": "click the pay button",
	"platform": "kommunicate",
	"metadata": {
		"contentType": "300",
		"templateId": "3",
		"payload": [{
			"name": "Pay",
			"replyText":"optional, will be used as acknowledgement message to user in case of requestType JSON. Default value is same as name parameter"
		}],
		"formData": {
			"amount": "1000",
			"discription": "movie ticket"
		},
		"formAction": "https://example.com/book",
		"requestType":"json"   
	}
}
```

## Quick Replies

Quick Replies provides a way to send messages on a click without typing them all out manually. You can add any number of Quick Replies by passing values in the metadata as described below:

``` JSON
{
	"message": "Do you want more updates?",
	"platform": "kommunicate",
	"metadata": {
		"contentType": "300",
		"templateId": "6",
		"payload": [{
			"title": "Yes",
			"message": "Cool! send me more.",
			"replyMetadata":{"key1":"value1"} // optional. custom data will be sent along with message when user click on Quick reply button .
		}, {
			"title": "No ",
			"message": "Don't send it to me again" 
		}]
	}
}
```
`replyMetadata` can be used to set [KM_CHAT_CONTEXT](web-botintegration#pass-custom-data-to-bot-platform). 
The appearance of the Quick Replies and Buttons will be adjusted automatically.

## Images
An image can be rendered in conversation using below JSON. An image object contains a caption(optional) and image url. You can send a list of image object in payload. There is no action supported on image template.

```json
{
  "message": "Hey I am Kommunicate support bot",
  "platform":"kommunicate",
  "metadata": {
    "contentType": "300",
    "templateId": "9",
    "payload": [
      {
        "caption": "image caption",
        "url": "image url"
      }]
  }
}

```
## List Template

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
"action": {
	"type": "quick_reply",
	"text": "text will be sent as message" 
       	}

// for navigation link action object will look like this
"action": {
	"type": "link",	
       "url": "url to navigate other page" 
       // page will be opened in new tab 
     	} 
  ```



Here is the sample JSON for the list :

```json
{
	"message": "this is the sample json for list template",
	"platform": "kommunicate",
	"metadata": {
		"contentType": "300",
		"templateId": "7",
		"payload": {
			"headerImgSrc": "url for header image",
			"headerText": "header text.",
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
}
```



## Use autosuggestions in your chat box

Autosuggestions make your life easier by populating the list of possible answers/data in the chat box itself.
If you want to ask any question or enter any text message into the chat box and send possible answers or list of data with that question, you can pass a list of answers or data into metadata. It will be displayed in the suggestion list. Suggestion list can also be fetched from source URL/server if you pass source URL into the message. 


![List Template](/img/autosuggest.png)

The format of the message is as below:

 * MESSAGE FORMAT
 
 ```javascript
{
	"message": "Where you wanna go this summer?",
	"metadata": {
		"KM_AUTO_SUGGESTION": {
			"placeholder": "enter city name ", //optional, this will apear in chat box as placeholder
			"source": []  // check the supported format below 
		}
	}
}
```

The source can be any one of the below formats:

 * **Array of string**
 ```json
{
 	"source": [
 		"London",
 		"New York",
 		"Delhi"
 	]
 }
```

* **Array of object**
```json
{
	"source": [{
			"searchKey": "Photography",
			"message": "Photography Lessons"
		},
		{
			"searchKey": "passport visa Services",
			"message": "Passport & Visa Services"
		}
	]
}
```
* **Url**  - Pass the API endpoint to get the data. Kommunicate will send data in the query parameter. 

```json
{
	"source": {
		"url": "http://localhost:5454/city/v2/search",
		"headers": {}
	}
}
```
API should return data in below format : 

```javascript
[{
    "searchKey": "searchable value",
    "name": "text message which you want display/send into conversation.",
    "metadata": {"key":"value"}//optional, any extra information you want to send with message
}]
```

  
