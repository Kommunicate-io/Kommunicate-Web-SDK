<img src="https://applozic.appspot.com/rest/ws/aws/file/AMIfv97t6Kire0C1eUeb9tazW-OuVWbjAgCLPPAOVdASD_Mh_7J_jWNemm94UzF8gH33cI1Lm51EIeZCSIXm9gRlrH6YgORiFRctRpPeiHSrR3NKaTJZU8MJ3WzPKxX4wJD-apEGqzHY3Q5Uq6zjr2bPXyKr6gqp6nEGn9ag55sBTXBYVNFgDi9IV6CXU3DxVM4nwgFD9VUXudYAHZL1o6Y7AvepIOJLa8kpD_9W8jbzbUKcKko5izS3i_EoSJdxMVY5Fcx0XSEStb_ILSzCIwoQv5O_cmreT_i5nkPQ_NdB0WqPU9Gksng" />

# [Kommunicate ](https://www.kommunicate.io/?utm_source=github&utm_medium=readme&utm_campaign=web)Live Chat Plugin For Web


### Overview :
Kommunicate provides open source live chat Plugin. The Kommunicate plugin is flexible, lightweight and easily integrable. 
It lets you easily add real time live chat and in-app messaging in your mobile applications and websites for customer support.
The live chat plugin is equipped with advance messaging options such as sending attachments, sharing location and rich messaging.
<img src="https://github.com/Kommunicate-io/Kommunicate-Live-Chat-Plugin/blob/master/images/KM%20Plugin.gif" />


### Features:

Live chat widget:  Make it easier for your visitors and users to reach you with an instant website and in-app support through chat. 

Chatbots: Automate and speed up your customer service by integrating AI-powered chatbots. Build your chatbots and deploy them using Kommunicate and seamlessly add them in the live chat.

Conversations: Manage all your customer queries coming from the live chat plugin. Easily manage and assign agents to cater to user conversations.

Dashboard: A powerful dashboard to see, analyze and act upon your customer conversation data. Helps you analyze the performance of support agents as well.

FAQs: Create Frequently Asked Questions (FAQs) to cater to generic and recurring customer queries. Your customers will be able to directly access FAQs in chat.

Mailbox: A simple and powerful team inbox for managing, receiving and replying to all your customer support emails. 

Integrations: Easily move data between Kommunicate and your other favorite apps. Integrate your favorite CRM, knowledge base software and other apps.

Conversation Routing: Select routing rules for incoming conversations for both your agents and bots. Choose between a round robin assignment or to notify all.

Smart Actionable Rich Messaging: Leverage actionable rich messages using buttons, cards or lists to provide an exquisite support chat experience to your customers.

Quick Replies: Quickly respond to generic user queries using Quick Replies. Easily create and manage templated messages from your dashboard.

Welcome Messages: Create custom and conditional welcome messages based on whether your customer support agents are online or offline. 

### Example :

https://jsfiddle.net/Kommunicate/wgLuLLbu/

### Getting Started :

Create your account by [signing](https://www.kommunicate.io/?utm_source=github&utm_medium=readme&utm_campaign=web) up for Kommunicate. If you already have a Kommunicate account, log in to your account and go to Settings -> Install section and copy the script.

Or

You can copy the below script and replace required parameters manually.

Script

```
<script type="text/javascript">
    (function(d, m){

    /*---------------- Kommunicate settings start ----------------*/

     var kommunicateSettings = {"appId": appId,"conversationTitle":conversationTitle,"botIds":["bot1","bot2"],"onInit":callback};

    /*----------------- Kommunicate settings end ------------------*/

     var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>
```

### Docs:

Please check out the detailed [Documentation](https://docs.kommunicate.io/docs/web-installation.html) for more features, implementation, and customizations.
