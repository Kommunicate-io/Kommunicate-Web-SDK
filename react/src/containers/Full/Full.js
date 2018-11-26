import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import moment from 'moment';
import Dashboard from '../../views/Dashboard/'
import Users from '../../views/Users/'
import Conversations from '../../views/Conversations/'
import Reports from '../../views/Reports/'
import Bot from '../../views/Bot/'
import Install from '../../views/Settings/Installation'
import Admin from '../../views/Admin/'
import Team from '../../views/Team/'
import Autoreply from '../../views/Autoreply/'
import Welcome from '../../views/Autoreply/Welcome/Welcome.js'
import AwayMessage from '../../views/Autoreply/AwayMessage/AwayMessage.js'
import AutoSuggest from '../../views/Autoreply/AutoSuggest.js'
import Download from '../../views/Download/Download.js'
import Faq from '../../views/Faq/'
import Billing from '../../views/Billing/'
import PushNotification from '../../views/PushNotification/PushNotification.js'
import Integrations from '../../views/Integrations/Integrations.js'
import IncomingEmailForward from '../../views/IncomingEmailForward/IncomingEmailForward.js'
import EmailNotifications from '../../views/EmailNotifications/EmailNotifications.js'
import Conversation404 from '../../views/Pages/Page404/Conversation404'
import EmailFallback from '../../views/EmailFallback/EmailFallback.js'
import WebhooksAndSecurity from '../../views/WebhooksAndSecurity/WebhooksAndSecurity'

import LoggedInAuthentication from  '../../views/Pages/Login/LoggedInAuthentication'
import CommonUtils from '../../utils/CommonUtils';
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar';
import AgentAssignemnt from '../../views/Routing/AgentAssignment';
import { COOKIES } from '../../utils/Constant';
import config from '../../config/index';
import {initilizeIntegry}  from '../../views/Integrations/Integry';
import ApplozicClient from '../../utils/applozicClient';
import ChatWigetCustomization from  '../../views/ChatWidgetCustomization/ChatWidgetCustomization';
import {acEventTrigger} from '../../utils/AnalyticsEventTracking';


const enableIntegry = false;
const chatUrl = config.baseurl.applozicAPI;
class Full extends Component {
  constructor (props) {
    super(props)
     //_this =this;
    let imageLink = CommonUtils.getUserSession().imageLink;
    this.state = {
      imageLink: imageLink,
      hideInvitedMemberBar: true,
      invitedBy: '',
      displayName: ''
    }
    this.updateProfilePic  = this.updateProfilePic.bind(this);
    this.updateUserDisplay  = this.updateUserDisplay.bind(this);
  }

  updateProfilePic(url) {
    this.setState({
      imageLink: url==null ? "/img/avatars/default.png": url
    });
   }
  componentWillMount(){
       // integry SDK
       new Promise(function(resolve,reject){
        const integryScript = document.createElement("script");

        integryScript.src = "https://app.integry.io/w/assets/sdk-1.1.js?q=4";
        integryScript.async = true;
    
        document.getElementsByTagName('head')[0].appendChild(integryScript);
      return resolve({})
       }).then((data)=>{
          let userSession = CommonUtils.getUserSession();
         //TODO: load integry SDK synchronously, remove setTimeout 
          userSession && setTimeout(function(){
            initilizeIntegry({applicationId:userSession.applicationId});
         }, 5000)
       });
       
       
    
   // enableIntegry && initilizeIntegry({});
    
    window.appHistory = this.props.history;
    const search = window.location.href;
    let invitedBy = CommonUtils.getUrlParameter(search, 'referer');
    if (invitedBy && invitedBy !== "" && invitedBy !== "undefined") {
      this.setState({
        hideInvitedMemberBar: false,
        invitedBy: invitedBy
      })
    }
    let userSession = CommonUtils.getUserSession()
    if(userSession){
      this.setState(
        {displayName:(userSession.name !=="undefined") ? userSession.name:userSession.userName}
      )
    }
    this.isIntegrationStarted({callback : this.populateIntegrationDetailInSession});

    // Wootric Script
    // window.wootric_survey_immediately = true; // Shows survey immediately for testing purposes. TODO: Comment out for production.
    window.wootricSettings = {
      email: userSession.email,
      created_at: (new Date(userSession.created_at).getTime()) / 1000,
      account_token: 'NPS-954f150b'
    };
    // console.log(window.wootricSettings)

    this.initWootricScript();

  }

  initWootricScript() {
    let head = document.getElementsByTagName('head')[0];
    let wootricScript = document.createElement('script');
    wootricScript.src = "https://cdn.wootric.com/wootric-sdk.js";
    head.appendChild(wootricScript);

    wootricScript.onload = function () {
        window.wootric('run');
    }
    return false;
  } 


  isIntegrationStarted= (options)=>{
    let userSession = CommonUtils.getUserSession();
    let criteria ={
      applicationId : userSession.applicationId,
      userName : userSession.userName,
      accessToken : userSession.accessToken,
      params:{
        roleNameList : "USER",
        pageSize:15
      }
      }
   Promise.resolve(ApplozicClient.getUserListByCriteria(criteria)).then(response=>{
   let userList = (response && response.response&& response.response.users)?response.response.users:[];
   let appUsers = userList.filter(user=>!(user.metadata&&user.metadata['KM_SOURCE']=="KOMMUNICATE_DASHBOARD"));
   options && typeof options.callback == 'function' ? options.callback(appUsers.length?true:false):"";
   })
}

  populateIntegrationDetailInSession= (isIntegrationStarted)=>{
    CommonUtils.updateUserSession({isIntegrationStarted:isIntegrationStarted});
  }
  /*initiateIntegry = () => {
    window.appKey = "a85c28bb-40c5-4d6c-b8e5-3e8c4fe4a32f";
    window.userId = "suraj@integry-demoapp.com";
    window.hash = "e407c3f9d2520874607e2379a2b2c0e891e2e37e3a2f81c1ef3c5944a528aa27";
    window.bundleId = "8";
    window.bundleInstanceId = "";
    window.callback = function (data) { };
    window.callback_render_integration_row = callbackFunc_Render_Integration_Row;
    window.callback_render_template_row = callbackFunc_Render_Template_Row;
    window.render_templates_container = 'templates'; // id of container where you want to render list of templates 
    window.render_integrations_container = 'integrations'; // id of container where you want to render list integrations 
    window.x_integry_configs = {
        view_container: 'intcontainer',
        view_url: './integrations/'
    };
    window.demo_app_user_api_key = "0c57e8e79e27cd965e75512079f6a6cc"
   /* const script = document.createElement("script");

    script.src = "https://app.integry.io/w/assets/sdk.js";
    script.async = true;

    document.body.appendChild(script);
}*/

  initilizeSupportChatUser (){
    let userSession = CommonUtils.getUserSession();
    // if loggedIn user not present then logout the kommunciate support chat user.
    if(window.$applozic && !CommonUtils.getCookie(COOKIES.KM_LOGGEDIN_USER_ID) && userSession){
      let dashboardLoggedInUserId = userSession.userName;
      console.log("logging out the anonymous user  from chat.")
      window.$applozic.fn.applozic('logout');
      var options = window.applozic._globals;
      options.userId = CommonUtils.getUserSession().userName;
      options.accessToken = CommonUtils.getUserSession().accessToken;
      window.$applozic.fn.applozic(options);
      CommonUtils.setCookie(COOKIES.KM_LOGGEDIN_USER_ID,dashboardLoggedInUserId,"",CommonUtils.getDomain());
    }else{
      console.log("user already logged in or user session is empty");
    }
  }

  componentDidMount() {
    if(CommonUtils.getUserSession()){
      CommonUtils.analyticsIdentify(CommonUtils.getUserSession().userName);

      let userSession = CommonUtils.getUserSession();
      let userProperties = {
        "email": userSession.userName, 
        "subscription": userSession.subscription,
        "billing": userSession.billingCustomerId !== null ? userSession.billingCustomerId : ""  ,
        "signup": userSession.created_at !== null ? userSession.created_at: "",
        "industry": userSession.industry !== null ? userSession.industry : "",
        "integration": (userSession.isIntegrationStarted !== null && userSession.isIntegrationStarted )? "Done" : "Pending"
      };

      if (window.heap) {
        window.heap.addUserProperties(userProperties);
      }
      if (window.mixpanel) {
        window.mixpanel.register(userProperties);
        if (userSession.isIntegrationStarted !== null && userSession.isIntegrationStarted) {
          acEventTrigger("integrated");
        }
      }
      
      // initilizing full view plugin for dashboard user
      window.chatLogin(chatUrl);
        //listen for kommunicate plugin initilized event. initilized support chat user.
      window.addEventListener("kmInitilized",this.initilizeSupportChatUser,true);

      if(window.$applozic && !CommonUtils.getCookie(COOKIES.KM_LOGGEDIN_USER_ID)){
        // when user logs in this will get called.
        this.initilizeSupportChatUser();
      }
    }
  }
  componentWillUnmount(){
    window.removeEventListener("kmInitilized",function(){});
  }
  updateUserDisplay(name){
    this.setState(
      {displayName:name}
    )
  }

  closeInvitedMemberBar = e => {
    this.setState({hideInvitedMemberBar:true});
  }


  render() {

    const currentPath = window.location.pathname;
    let analyticsEvent = currentPath;
    if (currentPath.startsWith("/conversations/")) {
      analyticsEvent = "/conversations/thread";
    }
    acEventTrigger(analyticsEvent);
   
    return (
      <div className="app" suppressContentEditableWarning={true}>
        {/* <Header
        // profilePicUrl={this.state.imageLink} displayName={this.state.displayName}
        /> */}

        <div className="app-body">
          <Sidebar {...this.props} profilePicUrl={this.state.imageLink} displayName={this.state.displayName}/>
          {currentPath.includes('/settings') ? <SettingsSidebar {...this.props}/> : null}

          <main className="main">
            <div className="integration-invited-team-div text-center" hidden={this.state.hideInvitedMemberBar}>
              <p>You were invited by <span>{this.state.invitedBy}</span>. You may start with <Link to="/settings/install">Kommunicate Installation</Link> or set up your <Link to="/settings/profile">Profile</Link></p>
              <div className="dismiss-icon" onClick={this.closeInvitedMemberBar}>&#xd7;</div>
            </div>
            <Breadcrumb />
            <div className="container-fluid">
              <Switch >
                <Route exact path="/conversations/oops" name="" component={Conversation404}/>
                <Route path="/dashboard" name="Dashboard"  component={Dashboard}/>
                <Route exact path="/users" name="Tables" component={Users}/>
                <Route exact ={false} path="/conversations" name="Conversations" component={Conversations}/>  
                <Route exact path="/reports" name="Reports" component={Reports}/>
                <Route exact path="/bot" name="Bot" component={Bot}/>
                <Route exact path="/settings/profile" name="Admin" render={()=>{
                   return <Admin updateProfilePicUrl={this.updateProfilePic} profilePicUrl={this.state.imageLink} updateUserDisplay={this.updateUserDisplay} />
                }}/>
                <Route exact path="/faq" name="Faq" component={Faq}/>
                <Route exact path="/settings/team" name="Team" component={Team}/>
                <Route exact path="/settings/autoreply" name="Autoreply" component={Autoreply}/>
                <Route exact path="/settings/welcome-message" name="Welcome" component={Welcome}/>
                <Route exact path="/settings/away-message" name="AwayMessage" component={AwayMessage}/>
                <Route exact path="/settings/message-shortcuts" name="AutoSuggest" component={AutoSuggest}/>
                <Route exact path="/settings/install" name="Install" component={Install}/>
                <Route exact path="/settings/agent-app" name="Download" component={Download}/>
                <Route exact path="/settings/agent-assignment" name="AgentAssignment" component={AgentAssignemnt}/>
                <Route exact path="/settings/billing" name="Billing" component={Billing}/>
                <Route exact path="/integrations" name="Integrations" component={Integrations}/>
                <Route exact path="/settings/pushnotification" name="PushNotification" component={PushNotification}/>
                <Route exact path="/settings/mailbox" name="IncomingEmailForward" component={IncomingEmailForward}/>
                <Route exact path="/settings/email-notifications" name="EmailNotifications" component={EmailNotifications}/>
                <Route exact path="/settings/chat-widget-customization" name="ChatWidgetCustomization" component={ChatWigetCustomization}/>
                <Route exact path="/settings/email-fallback" name="EmailFallback" component={EmailFallback}/>
                <Route exact path="/settings/webhooks-security" name="WebhooksAndSecurity" component={WebhooksAndSecurity}/>
                

                <Redirect from="/" to="/dashboard"/>

              </Switch>
            </div>
          </main>
          <Aside updateProfilePicUrl={this.updateProfilePic}/>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Full;
