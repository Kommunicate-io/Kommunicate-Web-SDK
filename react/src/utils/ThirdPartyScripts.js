import React, { Component } from 'react';
import { getConfig } from '../config/config';
import CommonUtils from './CommonUtils';

class ThirdPartyScripts extends Component {
    
      componentDidMount(){
          // support chat widget
          var userId = CommonUtils.getUserSession()?CommonUtils.getUserSession().userName:"";
          var currentPath = window.location.pathname;

          /*if(currentPath.includes('/signup') || currentPath.includes('/setUpPage')) {
            null
          } else {*/
            console.log("component did mount called from third party script");
            (function(d, m){ 
              let  o = {"appId":"kommunicate-support","isAnonymousChat":true,"agentId":"devashish@kommunicate.io",
              "groupName":"Kommunicate Support","baseUrl":getConfig().homeUrl,"googleApiKey":"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI", googleMapScriptLoaded : true}
              if(userId){
                o.userId = userId;
                o.password =CommonUtils.getUserSession().password;
              }
              o.onInit=function(response) {    
                if (typeof window.$applozic !== "undefined" && typeof window.$applozic.template === "undefined" && typeof window.$kmApplozic !== "undefined" && typeof window.$kmApplozic.kmtemplate !== "undefined") {
                  console.log("template not loaded"); 
                  window.$applozic.template = window.$kmApplozic.kmtemplate;
                  window.$applozic.tmpl = window.$kmApplozic.kmtmpl;
                 }
                 
                if(currentPath.includes('/signup') || currentPath.includes('/setUpPage') || currentPath.includes('/installation') || currentPath.includes('/login')) {
                  null
                } else {

                  if(document.getElementById('sidebar-sidebox-help-icon')) {
                    document.getElementById('sidebar-sidebox-help-icon').classList.add('vis'); 
                    document.getElementById('sidebar-sidebox-help-icon').classList.remove('n-vis'); 
                  } else {
                    console.log("Sidebox chat not loaded");
                  }
                  
                }

                if (currentPath.includes('/login') && document.getElementById('mck-sidebox-launcher')) {
                  document.getElementById('mck-sidebox-launcher').classList.add('vis'); 
                  document.getElementById('mck-sidebox-launcher').classList.remove('n-vis');
                }
                 
                document.querySelector(".mck-close-sidebox").onclick = function() {
                  document.getElementById('mck-sidebox-launcher').classList.add('n-vis');
                  document.getElementById('mck-sidebox-launcher').classList.add('force-hide');
                  document.getElementById('mck-sidebox-launcher').classList.remove('vis');
                };

              };
              var s = document.createElement("script");
              s.type = "text/javascript";
              s.async = true;
              s.src = getConfig().kommunicateApi.pluginUrl;
              var h = document.getElementsByTagName("head")[0];
              h.appendChild(s);
              window.kommunicate = m;
              m._globals = o;
            })(document, window.kommunicate || {});
          /*}*/

            

          // hot jar script
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:677144,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
           
           
           // Google Remarketing Tags

            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-828526638');
            
           //facebook pixel
           !function(f,b,e,v,n,t,s)
           {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
           if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
           n.queue=[];t=b.createElement(e);t.async=!0;
           t.src=v;s=b.getElementsByTagName(e)[0];
           s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            window.fbq('init', '282023555639912'); 
            window.fbq('track', 'PageView');

            //Active Campaign script
            var trackcmp_email = '';
            var trackcmp = document.createElement("script");
            trackcmp.async = true;
            trackcmp.type = 'text/javascript';
            trackcmp.src = '//trackcmp.net/visit?actid=66105982&e='+encodeURIComponent(trackcmp_email)+'&r='+encodeURIComponent(document.referrer)+'&u='+encodeURIComponent(window.location.href);
            var trackcmp_s = document.getElementsByTagName("script");
            if (trackcmp_s.length) {
              trackcmp_s[0].parentNode.appendChild(trackcmp);
            } else {
              var trackcmp_h = document.getElementsByTagName("head");
              trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
            }
      }

      componentWillMount(){
        // Google Remarketing Tags
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=AW-828526638";
        script.async = true;
        document.body.appendChild(script);


        //Start of HubSpot Embed Code 
         const hubSpotScript = document.createElement("script");
         hubSpotScript.src = "//js.hs-scripts.com/4025922.js";
         hubSpotScript.async = true;
         hubSpotScript.defer =true;
        document.body.appendChild(hubSpotScript);
    }

    render(){
        return (
          <div>
            <noscript>
                <img height="1" width="1" 
                    src="https://www.facebook.com/tr?id=282023555639912&ev=PageView&noscript=1"/>
            </noscript>
          </div>
        );
      }
    }
    
    export default ThirdPartyScripts;