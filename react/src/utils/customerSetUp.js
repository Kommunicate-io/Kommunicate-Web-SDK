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
    options.agentId = userSession.adminUserName||localStorage.getItem("agentId");
    
    if (userSession.displayName && userSession.displayName!="undefined"&& userSession.displayName!="null"){
      options.agentName = userSession.adminDisplayName;
    } else if(localStorage.getItem("agentName")&& localStorage.getItem("agentName")!="undefined"&& localStorage.getItem("agentName")!="null"){
      options.agentName = localStorage.getItem("agentName");
    }
  } else {
    const search = this.props.location.search;
    options.appId = CommonUtils.getUrlParameter(search, "applicationId");
    options.agentId = CommonUtils.getUrlParameter(search, "agentId");
  }
  
  options.groupName=options.agentName||options.agentId;
  var env = getEnvironmentId();
  
  if(env=="test"||env=="development"){
    options.baseUrl=getConfig().applozicPlugin.applozicHosturl;
  }
  options.email = '';
  console.log(options);

var jsScript= `<script type="text/javascript">
    (function(d, m){
      // you can change the below values to customize conversations. 
      // see the complete list of options in "More instructions Tab" 
      let o = ${JSON.stringify(options)};
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "${getConfig().kommunicateApi.pluginUrl}";
      let h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = o;
    })(document, window.kommunicate || {});
</script>`;
console.log(jsScript);
return jsScript;
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
