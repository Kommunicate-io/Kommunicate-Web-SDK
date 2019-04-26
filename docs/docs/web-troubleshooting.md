---
id: web-troubleshooting
title: Web Troubleshooting
sidebar_label: Troubleshooting
---


## Bot or agent responses are not updating real time on chat widget

If you are not receiving replies from the bot or the agent in the chat widget, then it might be due to one of the following reasons:

1. HTML file is opened on the browser from the file system directly. Real time updates require websocket, due to cross origin security policy, websocket doesn't work when html file is opened directly from the file system.

This error can be verified by looking into the browser's console. Check if there are any errors similar to the following:

```
Access to XMLHttpRequest at 'https://socket.applozic.com/stomp/info?t=1547050628459' from origin 'null' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.

```

To resolve it, serve the html page through the web server such as Apache, Jekyll, Tomcat, Python, Node etc.

``` html
Example : How to serve the html file via web server ?

Solution :

Step-1 Open Terminal.

Step-2 Change the current working directory to the directory where HTML file is prsent.

Step-3 If you are using Python 2 type command python -m SimpleHTTPServer 8000 
for Python 3 python -m http.server 8000.

Open your web browser and enter http://localhost:8000 to run the demo.

```
2. Verify if you are running it within a firewall network. Kommunicate uses port 443 for establing a websocket connection. If your network have blocked websocket protocol or port 443, then Kommunicate web plugin will not be able to establish websocket connection with  Kommunicate's MQTT based real time update service.

This error can be verified by looking into the browser's consle. Check if there are any errors similar to the following:

```
https://socket.applozic.com/stomp/info?t=1547037843186 net::ERR_CONNECTION_REFUSED

Error in channel notification. Whoops! Lost connection to https://socket.applozic.com/stomp
```

To resolve it, check with your network team for allowing websocket protocol and port 443.

3. If bot configured through dialogflow is not responding, then verify if the service account private key file uploaded to Kommunicate is correct.


## Conversations are getting assigned to human agent instead of bot

- Verify if you have configured 'Bot Routing Rules' from [Settings -> Conversation Rules](https://dashboard.kommunicate.io/settings/conversation-rules)
- Select the respective bot to answer queries under "Routing rules for bots".
- If you have recently modified the 'Bot Routing Rules' then test the new behaviour initiating new conversations. Please note that new changes will not be reflected on already created conversations.

## Chat widget is not scaling according the screen size

- Check if you have added the viewport `<meta>` tag to your website.
- The tag sets the width of the page to follow the screen-width of the device (which will vary on every device)

You can copy the following snippet and paste it in the `<head>` tag of your website.

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

If none of the above helps, drop us a mail at support@kommunicate.io
