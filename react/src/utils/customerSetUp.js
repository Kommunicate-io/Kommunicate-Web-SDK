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
  return `Insert the following code in your web application to install Kommunicate.
  Default parameters are pre populated. You can change them as you need.
  Parameters:-
    appId - your application Id.
    isAnonymousChat - allow your users to chat in Anonymous mode.
    groupName - Conversation Title.  
    agentId -  Support agent Id(registered in Kommunicate) who will reply to the support queries
    agentName - Display name for agent(agentId is default display name).
    
  You can paste the script in the <head/> or <body/> tag.`
}

/* TODO : move Invite Email Template into file and replace fields dynamically.

const getInviteTeamEmailTemplate = (params)=>{

  return new Promise(function(resolve,reject){
    fs.readFile(path.join(__dirname,"/inviteTeamTemplate.html"), 'utf8', function (err,data) {
      if (err) {
       return reject(err);
      }else{
        return resolve(data.replace(new RegExp(Object.keys(params).join("|"),"gi"), function(matched){
          return params[matched];
        }));
      }
    });
  });
}*/

export {getJsCode, getJsInstructions}