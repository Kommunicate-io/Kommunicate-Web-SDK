---
id: web-installation
title: Installation
sidebar_label: Installation
---
Replace appId with your applicationId
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
