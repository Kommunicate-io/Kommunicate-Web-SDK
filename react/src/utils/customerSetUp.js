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
  options.email = '';
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