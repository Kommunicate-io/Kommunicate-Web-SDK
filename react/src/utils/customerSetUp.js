import  {getConfig, getEnvironmentId} from '../config/config.js';

const fs = require('fs');
const path = require('path');

const getJsCode = () => {
  let options  = {};
  options.appId =localStorage.getItem("applicationId");
  options.isAnonymousChat=true;
  var env = getEnvironmentId();
  
  if(env=="test"||env=="development"){
    options.baseUrl=getConfig().applozicPlugin.applozicHosturl;
  }
  console.log(options);
  return (
`<script type="text/javascript">
    (function(d, m){
      let o = ${JSON.stringify(options)};
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "${getConfig().kommunicateApi.pluginUrl}";
      let h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.applozic = m;
      m._globals = o;
    })(document, window.kommunicate || {});
</script>`
);
}

const getJsInstructions = () => {
  return `Insert the following code in your web application to install Kommunicate. It can go in the <head/> or <body/>.`
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