---
id: email-fallback-configuration
title: Email Fallback
sidebar_label: Email Fallback
---
Login to [Kommunicate ](https://www.kommunicate.io)

Go to Dashboard -> Settings -> [Fallback Emails](https://dashboard.kommunicate.io/settings/email-fallback)

Fallback comes for 2 types of messages:
- Undelivered messages
- Unread messages <br>
Configure the "Fallback time" after which the event will be triggered.

**Let's take an example of Undelivered Message:**
Message Fallback Time is the duration in which if a message is not delivered to end user then the message will be delivered through email as a fallback. For message fallback, our API requires receiver user email which needs to pass during registration and also you have to configure message delivery fallback time in the dashboard for your app.  

For example, if you have configured **"Undelivered messages"** with **10 mins** as **"Fallback time"**. Now, if user **A** sends a message to user **B** and user **B** is not connected to internet or don't have app installed on the mobile then after **10 mins**, a mail will be triggered to user **B** with the message text.

> **NOTE:** When the user receives first fallback email, then a separate email is also sent to **SUBSCRIBE** to the email chat notifications. The user needs to subscribe to email alerts in order to get further email notifications from Kommunicate.