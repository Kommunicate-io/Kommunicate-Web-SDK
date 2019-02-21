---
id: api-detail
title: Endpoints
sidebar_label: Endpoints
---

> Note: All endpoints are relative to the [base url](api-authentication.html#base-url).

## Get user detail
Accepts the list of userIds in and return the list of user detail object.   

Request 

```javascript
POST /rest/ws/user/v2/detail HTTP/1.1
Content-Type: application/json

POST BODY
{
  "userIdList":["userId1","userId2"]
}

```
Response

```javascript 
[{
  "userId": "UserId1", // UserId of the user (String)
  "userName": "Display name", // Name of the user (String)
  "connected": true, // Current connected status of user, if "connected": true 											//that means user is online (boolean)
  "lastSeenAtTime": 12345679,  // Timestamp of the last seen time of user (long)
  "createdAtTime": 148339090,         //  Timestamp of the user's creation (long)
  "imageLink": "http://image.url",    // Image url of the user
  "deactivated": false,               // user active/inactive status (boolean)
  "phoneNumber": "+912345678954", 		// phone number of user
  "unreadCount": 10,  								// total unread message count
  "lastLoggedInAtTime": 1483342919147,//  Timestamp of the user's last logged in 																			 //(long)
  "lastMessageAtTime": 1483343150550  //Timestamp of the user's last message 																				 //(long)
 }]
```

## Update User Details

This API can only update a user's details. To update Agent's Detail please contact to Kommunicate support.
`Of-User-Id` is the user to be updated and should be passed in the request headers. 

``` javascript
POST  /rest/ws/user/update HTTP/1.1
Content-Type: application/json  
Of-User-Id: user_id  // user id to be updated.

POST Body:
{ 
  "email":"user email",
  "displayName":"user display name",
  "imageLink":"User profile image url",
  "metadata":{
    "key-1":"value-1" // any number of key value pairs, it will be visible to agents in dashboard.
    }
}

```

 

## Send Message

Send a message to a conversation/group. A group Id is assigned to every conversation when its created and can not be changed. If messages are received from webhook, every message will have the groupId parameter associated with them. Use this group Id to send the messages in the conversation. 

``` javascript
POST  /rest/ws/message/v2/send HTTP/1.1
Content-Type: application/json
POST Body:
{ 
  "groupId": "group Unique Identifier", 
  "message":"Hi John",
  "fromUserName":"userId of sender"
}
```
 You can also send [Actionable messages](actionable-messages.html) by adding a valid JSON in `metadata` field. The metadata accepts the key-value pair as string. The payload object in the actionable message should be converted into string before adding it into request payload. Below is the example of request body with Actionable message(Quick replies): 


``` javascript
{ 
  "groupId": "group Unique Identifier", 
  "message":"Do you want more updates?",
  "fromUserName":"userId of sender",
  "metadata":{       
       "contentType": "300",
        "templateId": "6",
        "payload": "[{\"title\":\"Yes\",\"message\":\"Cool! send me more.\",{\"title\":\"No \",\"message\":\"Don't send it to me again\"}]"  // any object should be converted into string inside metadata.
  }
}

```
## Change Conversation Status

``` javascript
POST /rest/ws/group/update HTTP/1.1

Content-Type: application/json,
Of-User-Id: your userId,
Api-Key: your api key

POST Body:
    {
      "groupId": "group Unique Identifier",
      "metadata":{
          "CONVERSATION_STATUS": "0" // possible value { OPEN: 0,CLOSED: 2,SPAM: 3,DUPLICATE: 4}
      }
    }
```




