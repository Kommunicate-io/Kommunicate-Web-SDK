---
id: web-troubleshooting
title: Web Troubleshooting
sidebar_label: Troubleshooting
---


## Bot or agent responses are not updating real time on chat widget

If you are not receiving replies from the bot or the agent in the chat widget, then it might due to one of the following reasons:

1. HTML file is opened on the browser from the file system directly. Real time updates require websocket, due to cross origin security policy, websocket doesn't work when html file is opened directly from the file system.

This error can be verified by looking into the browser's console. Check if there are any errors similar to the following:

```
Access to XMLHttpRequest at 'https://apps.applozic.com:15675/stomp/info?t=1547050628459' from origin 'null' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

To resolve it, serve the html page through the web server such as Apache, Jekyll, Tomcat, etc.


2. Verify if you are running it within a firewall network. Kommunicate uses port 15675 for establing a websocket connection. If your network have blocked port 15675 then Kommunicate web plugin will not be able to establish websocket connection with  Kommunicate's MQTT based real time update service.

This error can be verified by looking into the browser's consle. Check if there are any errors similar to the following:

```
https://apps.applozic.com:15675/stomp/info?t=1547037843186 net::ERR_CONNECTION_REFUSED

Error in channel notification. Whoops! Lost connection to https://apps.applozic.com:15675/stomp
```

To resolve it, check with your network team for allowing port 15675.

3. If bot configured through dialogflow is not responding, then verify if the service account private key file uploaded to Kommunicate is correct.


If none of the above helps, drop us a mail at support@kommunicate.io
