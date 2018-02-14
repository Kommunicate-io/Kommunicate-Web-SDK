---
id: web-authentication
title: Authentication
sidebar_label: Authentication
---
## To initate chat with particular user add below parameter in script

userId - Unique Id for user.

userName - Display name of the user. Agents will know users by Display name

email - email id of logged in user

### Example:
```
<script type="text/javascript">
    (function(d, m){ 
      let o = {"appId":"applozic-sample-app","isAnonymousChat":true,"userId":"uniqueId id","agentId":null,"userName":"userName","groupName":null,"email":""};
      let s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://api.kommunicate.io/kommunicate.app";
      let h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = o;
    })(document, window.kommunicate || {});
</script>

```
