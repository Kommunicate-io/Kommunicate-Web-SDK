import  {getConfig, getCommonResource} from '../config/config.js';
import CommonUtils from '../utils/CommonUtils';

function getJsCode (){
  let options  = {};
  let userSession = CommonUtils.getUserSession();

  if (userSession) {
    options.appId = userSession.application.applicationId;
    options.userId = userSession.userId;
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
    options.userId = CommonUtils.getUrlParameter(search, "referer");
    // options.agentId = CommonUtils.getUrlParameter(search, "agentId");
    // options.agentName = CommonUtils.getUrlParameter(search, "displayName");
  }
  options.automaticChatOpenOnNavigation = true;
  // console.log(options);

var jsScript= `<script type="text/javascript">
    /* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
    (function(d, m){
      var kommunicateSettings = ${JSON.stringify(options)};
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "${getConfig().kommunicateApi.pluginUrlV2}";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
</script>`;

var yourAppId = options.appId;
var yourUserId = options.userId;

// console.log(jsScript);
// console.log(yourAppId);
return [jsScript, yourAppId, yourUserId];
}

const getApplozicScript = () => {
return `<script type="text/javascript">
    (function(d, m){var s, h;
        s = document.createElement("script");
        s.type = "text/javascript";
        s.async=true;
        s.src="${getConfig().applozicPlugin.applozicHosturl}/sidebox.app";
        h=document.getElementsByTagName('head')[0];
        h.appendChild(s);
        window.applozic=m;
        m.init=function(t){m._globals=t;}})(document, window.applozic || {});

        window.applozic.init({
        baseUrl:'${getConfig().applozicPlugin.applozicHosturl}',
        appId: '`+ getJsCode()[1] + `',
        userId: 'applozic-demo-user',   //Logged in user's id, a unique identifier for user
        accessToken: "",              //Enter password here for the userId passed above
        onInit : function(response) {
            //TODO: Handle login response
        }
    });
</script>`;
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


const getDocsLink = (product)=>{
 var resources = getCommonResource();
 return resources.docsLink[product]
}

export {getJsCode, getJsInstructions, getApplozicScript, getDocsLink}
