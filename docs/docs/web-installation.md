---
id: web-installation
title: Installation
sidebar_label: Installation
---

Parameters:

appId - your application Id.

agentId - Support agent Id(registered in Kommunicate) who will reply to the support queries.

groupName - Conversation Title.

isAnonymousChat - allow your users to chat in Anonymous mode.

userId - Unique Id for user.

userName - Display name of the user. Agents will know users by Display name

email - allow your users to register email id (optional).
```
<script type="text/javascript">
    (function(d, m){
      let o = {"appId":"applozic-sample-app","isAnonymousChat":true,"agentId":null,"groupName":null,"email":""};
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      let h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = o;
    })(document, window.kommunicate || {});
</script>

```
