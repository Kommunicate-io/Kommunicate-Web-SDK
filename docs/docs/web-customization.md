---
id: web-customization
title: Customization
sidebar_label: Customization
---

## Chat icon:
customize the chat icon by passing html into 'chatLauncherHtml' parameter.

```
<script type="text/javascript">
 (function(d, m){ 
     let o = {"appId": "your application Id",
            "isAnonymousChat": true,
            "chatLauncherHtml": "<img src='https://api.kommunicate.io/img/logo02.svg' width='70px' height='70px'/>", 
            "agentId": "your agent Id",
            "groupName": "Your group Name",
            "email":"logged in user email"
            };
     let s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
     s.src = "https://api-test.kommunicate.io/kommunicate.app";
     let h = document.getElementsByTagName("head")[0]; h.appendChild(s);
     window.kommunicate = m; m._globals = o;
   })(document, window.kommunicate || {});
</script>
```