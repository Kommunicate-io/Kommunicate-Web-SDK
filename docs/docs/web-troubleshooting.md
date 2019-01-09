---
id: web-troubleshooting
title: Web Troubleshooting
sidebar_label: Troubleshooting
---


## Bot or agent responses are not updating real time on chat widget

Below are the possible reasons for this:

1. HTML file is opened on the browser from the file system directly. Real time updates require websocket, due to cross origin security policy, websocket doesn't work when html file is opened directly from the file system.
Try serving the html page through the web server like Apache, Jekyll, Tomcat or any other webserver.

2. Verify if you are running it within a firewall network. If yes, verify whether port 15675 is open in the network.

3. If bot configured through dialogflow is not responding, then verify if the service account private key file uploaded to Kommunicate is correct.

