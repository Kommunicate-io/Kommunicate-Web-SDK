import  {getConfig, getEnvironmentId} from '../config/config.js';
import CommonUtils from '../utils/CommonUtils';

const fs = require('fs');
const path = require('path');

function getJsCode (){
  let options  = {};
  let userSession = CommonUtils.getUserSession();

  if (userSession) {
    options.appId = userSession.application.applicationId;
    options.isAnonymousChat=true;
    //options.agentId = userSession.adminUserName||localStorage.getItem("agentId");

    if (userSession.adminDisplayName && userSession.adminDisplayName!="undefined"&& userSession.adminDisplayName!="null"){
      options.conversationTitle = userSession.adminDisplayName;
    } else if(localStorage.getItem("agentName")&& localStorage.getItem("agentName")!="undefined"&& localStorage.getItem("agentName")!="null"){
      options.conversationTitle = localStorage.getItem("agentName");
    }
  } else {
    const search = window.location.href;
    options.appId = CommonUtils.getUrlParameter(search, "applicationId");
    options.conversationTitle=CommonUtils.getUrlParameter(search, "displayName")||CommonUtils.getUrlParameter(search, "agentId");
    // options.agentId = CommonUtils.getUrlParameter(search, "agentId");
    // options.agentName = CommonUtils.getUrlParameter(search, "displayName");
  }


  var env = getEnvironmentId();

  if(env=="test"||env=="development"){
    options.baseUrl=getConfig().applozicPlugin.applozicHosturl;
  }
  options.email = '';
  console.log(options);

var jsScript= `<script type="text/javascript">
    (function(d, m){
      var o = ${JSON.stringify(options)};
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "${getConfig().kommunicateApi.pluginUrl}";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = o;
    })(document, window.kommunicate || {});
</script>`;

var yourAppId = options.appId;

console.log(jsScript);
console.log(yourAppId);
return [jsScript, yourAppId];
}

const getJsInstructions = () => {
  return `
  <div  class="instruction-display-area">
  <div class="script-text-area">
  &lt;!—Example—&gt;<br>
  !DOCTYPE html&gt;<br>
  &lt;html lang=“en”&gt;<br>
  &lt;head&gt;<br>
  &nbsp;&nbsp;<b>insert_Kommunicate_code_here</b><br>
      &lt;/head&gt;</div></div>`
}


export {getJsCode, getJsInstructions}
