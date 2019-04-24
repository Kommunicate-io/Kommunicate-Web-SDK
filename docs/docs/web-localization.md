---
id: web-localization
title: Localization
sidebar_label: Localization
---
## Chat Localization Setup

Modify the labels like "Start Conversation",etc by adding following labels in kommunicateSettings variable which is present in installation script of chat widget:

``` JSON
"labels": {
    'input.message':'Type your message...',
    'conversations.title': 'Conversations',
    'start.new': 'Start New Conversation',
    'empty.messages': 'No messages yet!',
    'no.more.messages': 'No more messages!',
    'empty.conversations': 'No conversations yet!',
    'no.more.conversations': 'No more conversations!',
    'search.placeholder': 'Search...',
    'location.placeholder': 'Enter a location',
    'members.title': 'Members',
    'typing': 'typing...',
    'is.typing': 'is typing...',
    'online': 'Online',
    'offline': 'Offline',
    'clear.messages': 'Clear Messages',
    'delete': 'Delete',
    'reply': 'Reply',
    'location.share.title': 'Location Sharing',
    'my.location': 'My Location',
    'send': 'Send',
    'send.message': 'Send Message',
    'smiley': 'Smiley',
    'close': 'Close',
    'edit': 'Edit',
    'save': 'Save',
    'file.attachment': 'Files & Photos',
    'file.attach.title': 'Attach File',
    'last.seen': 'Last seen',
    'last.seen.on': 'Last seen on',
    'time.format.AM':'AM',
    'time.format.PM':'PM',
    'hour':' hour',
    'min':' min',
    'yesterday':'yesterday',
    'hours':' hours',
    'mins':' mins',
    'ago': 'ago',
    'admin':'Admin',
    'user':'User',
    'member':'Member',
    'you':'You',
    'closed.conversation.message':'This conversation has been marked as resolved. If you have other queries, just send a message here or start a new conversation.',
    'search.faq':'Search in FAQs...',
    'looking.for.something.else':'Looking for something else?',
    'talk.to.agent': 'Talk to an agent',
    'how.to.reachout': 'How may we reach you?',
    'email.error.alert': 'It seems you have entered an invalid email',
    'lead.collection': {
        'email':'Email',
        'name':'Name',
        'contactNumber':'Contact Number',
        'heading':'Before starting, we just need a few details so that we may serve you better',
        'submit':'Start Conversation',
    }
}
```
### Example
This example will change the text for pre chat lead collection screen :- 

```javascript
<script type="text/javascript">
    (function(d, m){
    /*---------------- Kommunicate settings start ----------------*/
     var kommunicateSettings = {
        "appId": "<APP_ID>", // add your application id here 
        "askUserDetails": ["name", "email", "phone"],
        "labels": {
            'lead.collection': {
                'email':'Email',
                'name':'Name',
                'contactNumber':'Contact Number',
                'heading':'Before starting, we just need a few details so that we may serve you better',
                'submit':'Start Conversation',
            }
        }
      };
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