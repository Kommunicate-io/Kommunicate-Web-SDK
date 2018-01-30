---
id: installation
title: Install Javascript Chat Plugin on Website
sidebar_label: Sample App
---


## Download the Applozic Javascript sample

Clone repository: git clone https://github.com/AppLozic/Applozic-Web-Plugin.git
or download from https://github.com/AppLozic/Applozic-Web-Plugin by clicking on the Download button under the repository name.

## Steps to run the Demo

```
Open Terminal.

Change the current working directory to the directory where our repository has been cloned or downloaded.

Go to demo folder by using cd Applozic-Web-Plugin/demo command.

If you are using Python 2 type command python -m SimpleHTTPServer 8000
for Python 3 python -m http.server 8000.

Open your web browser and enter http://localhost:8000 to run the demo.
```

## How to try it out

Enter your credentials
You're ready to roll.

## Drop in UI

This section will guide you in using our ready-made UI. If you are looking to build your own UI using our features, you can refer to Custom UI section.

## Add Plugin

Add the Applozic Chat plugin script before closing of </body> into your web page

JavaScript
<script type="text/javascript">
   (function(d, m){var s, h;       
   s = document.createElement("script");
   s.type = "text/javascript";
   s.async=true;
   s.src="https://apps.applozic.com/sidebox.app";
   h=document.getElementsByTagName('head')[0];
   h.appendChild(s);
   window.applozic=m;
   m.init=function(t){m._globals=t;}})(document, window.applozic || {});
</script>

## Custom UI

For custom ui clone project from https://github.com/AppLozic/Applozic-Web-Plugin/tree/javascript
Import below files in your main file.
<script type="text/javascript" src="Applozic-Web-Plugin/src/js/app/modules/applozic.utils.js"></script>
<script type="text/javascript" src="Applozic-Web-Plugin/src/js/app/modules/applozic.chat.js"></script>
<script type="text/javascript" src="Applozic-Web-Plugin/src/js/app/modules/storage/applozic.storage.js"></script>
<script type="text/javascript" src="Applozic-Web-Plugin/src/js/app/modules/api/applozic.api.js"></script>
<script type="text/javascript" src="Applozic-Web-Plugin/src/js/app/modules/socket/applozic.socket.js"></script>

