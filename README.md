<img src="https://s3.amazonaws.com/kommunicate.io/Header.jpg" />

# [Kommunicate ](https://www.kommunicate.io/?utm_source=github&utm_medium=readme&utm_campaign=web)Live Chat Plugin and Chatbot Integration For Web


## Overview

Kommunicate provides open source live chat Plugin. The Kommunicate plugin is flexible, lightweight and easily integrable. 
It lets you easily add real-time live chat and in-app messaging in your websites and web apps for customer support. The live chat plugin is equipped with advance messaging options such as real-time chat, sending attachments, sharing location and rich messaging.

Kommunicate has a powerful human + chatbot hybrid platform, where you can integrate Dialogflow and Amazon Lex chatbot without using any code. You can also integrate any third-party or custom chatbot in Kommunciate as well. The automatic bot to human handoff enabled, customizable and rich-messaging equipped chat-widget gives you ample options to make your chatbot more powerful. 

## Dialogflow Chatbot Integration

Dialogflow is a Google-owned NLP platform to facilitate human-computer interactions such as chatbots, voice bots, etc. 

Kommunicate's Dialogflow integration provides a more versatile, customizable and better chatting experience. Kommunicate chat widget supports all of Dialogflow's features such as Google Assistant, Rich Messaging, etc. On top of that, it is equipped with advanced features such as bot-human handoff, conversation managing dashboard, reporting, and others. 

You can connect your Dialogflow chatbot with Kommunicate in the following 4 simple steps. [Here](https://www.youtube.com/watch?v=ZlrFYRwJxS8) is a video for the same. 

### Step 1: Get your API credentials from Dialogflow
- Login to Dialogflow console and select your agent from the dropdown in the left panel.
- Click on the settings button. It will open a setting page for the agent.
- Inside the general tab search for GOOGLE PROJECTS and click on your service account.
- After getting redirected to your SERVICE ACCOUNT, create a key in JSON format for your project from the actions section and it will get automatically downloaded.

### Step 2: Create a free Kommunicate account
Create a free account on [Kommunicate](https://dashboard.kommunicate.io/signup) and navigate to the [Bots section](https://dashboard.kommunicate.io/bots/bot-integrations).

### Step 3: Integrate your Dialogflow chatbot with Kommunicate
- In the Bot integrations section, choose Dialogflow. A popup window will open.
- Upload your Key file here and proceed.
- Give a name and image to your chatbot. It will be visible to the users chatting with your chatbot.
- Enable/Disable chatbot to human handoff. If enabled, it will automatically assign conversations to humans in case the chatbot is not able to answer.

### Step 4: Install the chat widget on your website
You can install the Kommunicate chat widget on your website by adding a code snippet to your website. More information on how to integrate with your website [here](https://docs.kommunicate.io/docs/web-installation.html). 

> Note: Here's a [sample chatbot](https://docs.kommunicate.io/docs/bot-samples) for you to get started with Dialogflow. 


## Other Features

**Live chat widget:**  Make it easier for your visitors and users to reach you with an instant website and in-app support through chat. The widget is highly customizable. 

**Chatbots:** Automate and speed up your customer service by integrating AI-powered chatbots. Build your chatbots and deploy them using Kommunicate and seamlessly add them in the live chat.

**Conversations:** Manage all your customer queries coming from the live chat plugin. Easily manage and assign agents to cater to user conversations.

**Dashboard:** A powerful dashboard to see, analyze and act upon your customer conversation data. Helps you analyze the performance of support agents as well.

**Helpcenter:** Create your knowledge base and deploy on a dedicated page to cater to generic and recurring customer queries. Your customers will also be able to directly access FAQs in chat.

**Mailbox:** A simple and powerful team inbox for ticketing, managing, receiving and replying to all your customer support emails. 

**Integrations:** Easily move data between Kommunicate and your other favorite apps. Integrate your favorite CRM, knowledge base software and other apps.

**Conversation Routing:** Select routing rules for incoming conversations for both your agents and bots. Choose between automatic assignments or to notify all.

**Smart Rich Messaging:** Leverage rich messages using buttons, cards, carousels, forms or lists to provide an exquisite support chat experience to your customers.

**Quick Replies:** Quickly respond to generic user queries using Quick Replies. Easily create and manage templated messages from your dashboard.

### Example :

https://jsfiddle.net/Kommunicate/wgLuLLbu/

## Getting Started :

Create your account by [signing](https://www.kommunicate.io/?utm_source=github&utm_medium=readme&utm_campaign=web) up for Kommunicate. If you already have a Kommunicate account, log in to your account and go to [Settings -> Install](https://dashboard.kommunicate.io/settings/install) section and copy the script.

Or

You can copy the below script and replace the required parameters manually. Note: You will get your <APP_ID> in the [Install](https://dashboard.kommunicate.io/settings/install) section. 


```
<script type="text/javascript">
    (function(d, m){

    /*---------------- Kommunicate settings start ----------------*/

     var kommunicateSettings = {
      "appId": "<APP_ID>",  
      "automaticChatOpenOnNavigation": true,
      "popupWidget": true
      /*
      "onInit": function (){
        // paste your code here
      },
        "botIds":["<BOT_ID_1>","<BOT_ID_2>"]
      */
      };

    /*----------------- Kommunicate settings end ------------------*/

     var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>
```

## Technical Documentation:

Please check out the detailed [documentation](https://docs.kommunicate.io/docs/web-installation.html) for more features, implementation and customizations.
