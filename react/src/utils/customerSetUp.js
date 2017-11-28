import  {getConfig, getEnvironmentId} from '../config/config.js';

const fs = require('fs');
const path = require('path');

function getJsCode (){
  let options  = {};
  options.appId =localStorage.getItem("applicationId");
  options.isAnonymousChat=true;
  options.agentId =localStorage.getItem("loggedinUser")||localStorage.getItem("agentId");
  if(localStorage.getItem("name")&& localStorage.getItem("name")!="undefined"&& localStorage.getItem("name")!="null"){
  options.agentName = localStorage.getItem("name");
  }else if(localStorage.getItem("agentName")&& localStorage.getItem("agentName")!="undefined"&& localStorage.getItem("agentName")!="null"){
    options.agentName = localStorage.getItem("agentName");
  }
  options.groupName=options.agentName||options.agentId;
  var env = getEnvironmentId();
  
  if(env=="test"||env=="development"){
    options.baseUrl=getConfig().applozicPlugin.applozicHosturl;
  }
  console.log(options);

var jsScript= `<script type="text/javascript">
    (function(d, m){
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
  return `<!—Example—>
  !DOCTYPE html>
  <html lang=“en”>
    <head>
      --- insert_Kommunicate_code_here ---
    </head>`
}


export {getJsCode, getJsInstructions}