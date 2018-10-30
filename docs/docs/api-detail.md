---
id: api-detail
title: Endpoints
sidebar_label: Endpoints
---
All endpoints are relative to the [base url](api-authentication.html#base-url).

## Get user detail :
Accepts the list of userIds in and return the list of user detail object.   

Request 

```javascript
POST /user/v2/detail HTTP/1.1
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

## Send Message :

``` JS

SEND MESSAGE URL:
https://chat.kommunicate.io/rest/ws/message/v2/send
Method Type: POST
Content-Type: application/json
Request Body:
{ 
  "groupId": "group Unique Identifier", 
  "message":"Hi John"
}

```



