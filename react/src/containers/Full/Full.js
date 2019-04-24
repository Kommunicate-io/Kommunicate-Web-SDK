import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import CommonUtils from '../../utils/CommonUtils';
import AgentAssignemnt from '../../views/Routing/AgentAssignment';
import { COOKIES, ONBOARDING_STATUS } from '../../utils/Constant';
import config from '../../config/index';
import { getConfig, getEnvironmentId } from '../../config/config';
import {initilizeIntegry}  from '../../views/Integrations/Integry';
import ApplozicClient from '../../utils/applozicClient';
import {getSuggestionsByCriteria, submitOnboardingStatus} from '../../utils/kommunicateClient';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import { connect } from 'react-redux';
import * as Actions from '../../actions/applicationAction';
import TrialExpired from '../../views/TrialExpired/TrialExpired';
import Dashboard from '../../views/Dashboard/';
import Conversations from '../../views/Conversations/';

const EmptyLoading = ()=>(
  <div></div>
);

const ChatWigetCustomization = Loadable({
  loader: () => import('../../views/ChatWidgetCustomization/ChatWidgetCustomization'),
  loading: EmptyLoading
});

const MessageLogs = Loadable({
  loader: () => import('../../ALDashboard/views/Groups/MessageLogs'),
  loading: EmptyLoading
});

const Users = Loadable({
  loader: () => import('../../views/Users/'),
  loading: EmptyLoading
});

const Reports = Loadable({
  loader: () => import('../../views/Reports/'),
  loading: EmptyLoading
});

const Bot = Loadable({
  loader: () => import('../../views/Bot/'),
  loading: EmptyLoading
});

const Install = Loadable({
  loader: () => import('../../views/Settings/Installation'),
  loading: EmptyLoading
});

const Admin = Loadable({
  loader: () => import('../../views/Admin/'),
  loading: EmptyLoading
});

const Team = Loadable({
  loader: () => import('../../views/Team/'),
  loading: EmptyLoading
});

const Welcome = Loadable({
  loader: () => import('../../views/Autoreply/Welcome/Welcome.js'),
  loading: EmptyLoading
});

const Company = Loadable({
  loader: () => import('../../views/Company/Company'),
  loading: EmptyLoading
});

const AwayMessage = Loadable({
  loader: () => import('../../views/Autoreply/AwayMessage/AwayMessage.js'),
  loading: EmptyLoading
});

const AutoSuggest = Loadable({
  loader: () => import('../../views/Autoreply/AutoSuggest.js'),
  loading: EmptyLoading
});

const Download = Loadable({
  loader: () => import('../../views/Download/Download.js'),
  loading: EmptyLoading
});

const Faq = Loadable({
  loader: () => import('../../views/Faq/'),
  loading: EmptyLoading
});

const Billing = Loadable({
  loader: () => import('../../views/Billing/'),
  loading: EmptyLoading
});

const PushNotification = Loadable({
  loader: () => import('../../views/PushNotification/PushNotification.js'),
  loading: EmptyLoading
});

const Integrations = Loadable({
  loader: () => import('../../views/Integrations/Integrations.js'),
  loading: EmptyLoading
});

const IncomingEmailForward = Loadable({
  loader: () => import('../../views/IncomingEmailForward/IncomingEmailForward.js'),
  loading: EmptyLoading
});

const EmailNotifications = Loadable({
  loader: () => import('../../views/EmailNotifications/EmailNotifications.js'),
  loading: EmptyLoading
});

const Conversation404 = Loadable({
  loader: () => import('../../views/Pages/Page404/Conversation404'),
  loading: EmptyLoading
});

const EmailFallback = Loadable({
  loader: () => import('../../views/EmailFallback/EmailFallback.js'),
  loading: EmptyLoading
});

const WebhooksAndSecurity = Loadable({
  loader: () => import('../../views/WebhooksAndSecurity/WebhooksAndSecurity'),
  loading: EmptyLoading
});

const CSATRatings = Loadable({
  loader: () => import('../../views/CSATRatings/CSATRatings'),
  loading: EmptyLoading
});
const ConversationAutoClosing = Loadable({
  loader: () => import('../../views/ConversationAutoClosing/ConversationAutoClosing'),
  loading: EmptyLoading
});

const HelpCenterCustomization = Loadable({
  loader: () => import('../../views/HelpCenter/Customization/HelpCenterCustomization'),
  loading: EmptyLoading
});

const enableIntegry = config.thirdPartyIntegration.integry.enabled;
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
      displayName: '',
      isIntegrationStarted: true,
      isApplozicTrialExpired: CommonUtils.isProductApplozic() && CommonUtils.isExpiredPlan()
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
    enableIntegry && this.initIntegryScript()
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
      account_token: getConfig().products[CommonUtils.getProduct()].wootric
    };

    this.initWootricScript();

  }
  initIntegryScript = () => {
    const integryScript = document.createElement("script");
    integryScript.src = "https://app.integry.io/w/assets/sdk-1.1.js?q=4";
    integryScript.async = true;
    document.getElementsByTagName('head')[0].appendChild(integryScript);
    integryScript.onload = function () {
      let userSession = CommonUtils.getUserSession();
      userSession && initilizeIntegry({
              applicationId:userSession.application.applicationId, 
              apiKey:userSession.apiKey
            });
      };
    
  } 
  initWootricScript() {
    let env = getEnvironmentId();
    if(env.includes('prod')) {
      let head = document.getElementsByTagName('head')[0];
      let wootricScript = document.createElement('script');
      wootricScript.src = "https://cdn.wootric.com/wootric-sdk.js";
      head.appendChild(wootricScript);
      wootricScript.onload = function () {
          window.wootric('run');
      }
      return false;
    }
  } 


  isIntegrationStarted= (options)=>{
    let userSession = CommonUtils.getUserSession();
    let criteria ={
      applicationId : userSession.application.applicationId,
      userName : userSession.userName,
      accessToken : userSession.accessToken,
      isAdmin: userSession.roleName=='APPLICATION_ADMIN',
      params:{
        roleNameList : "USER",
        pageSize:15
      }
      }
   Promise.resolve(ApplozicClient.getUserListByCriteria(criteria)).then(response=>{
   let userList = (response && response.response&& response.response.users)?response.response.users:[];
   let appUsers = userList.filter(user=>!(user.metadata&&user.metadata['KM_SOURCE']=="KOMMUNICATE_DASHBOARD"));
   options && typeof options.callback == 'function' ? options.callback(appUsers.length?true:false):"";
   appUsers.length && submitOnboardingStatus({stepId:ONBOARDING_STATUS.SCRIPT_INSTALLED, completed:true})
   })
}

  populateIntegrationDetailInSession= (isIntegrationStarted)=>{
    CommonUtils.updateUserSession({isIntegrationStarted:isIntegrationStarted});
    this.setState({
      isIntegrationStarted: isIntegrationStarted
    });
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
    this.getFaqList();
    if(CommonUtils.getUserSession()){
      AnalyticsTracking.identify(CommonUtils.getUserSession().userName);

      let userSession = CommonUtils.getUserSession();
      let userProperties = {
        "email": userSession.userName, 
        "subscription": userSession.subscription,
        "billing": userSession.billingCustomerId !== null ? userSession.billingCustomerId : ""  ,
        "signup": userSession.created_at !== null ? userSession.created_at: "",
        "industry": userSession.industry !== null ? userSession.industry : "",
        "integration": (userSession.isIntegrationStarted !== null && userSession.isIntegrationStarted )? "Done" : "Pending",
        "product": CommonUtils.getProduct()
      };

      AnalyticsTracking.addUserProperties(userProperties);
      AnalyticsTracking.addPeopleProfile(userSession, userProperties);

      if (userSession.isIntegrationStarted !== null && userSession.isIntegrationStarted) {
        AnalyticsTracking.acEventTrigger("integrated");
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

  getFaqList = () => {
    let userSession = CommonUtils.getUserSession();
    getSuggestionsByCriteria(userSession.applicationId, 'type', 'faq').then(response => {
      if(response && response.data && response.code === 'GOT_ALL_SUGGESTIONS_BY_CRITERIA_type'){
        var faqList = response.data || [];
        this.props.updateFaqListInAppSettings(faqList);
      }
    }).catch(err => {console.log(err)});
  }

  render() {

    const currentPath = window.location.pathname;
    let analyticsEvent = currentPath;
    if (currentPath.startsWith("/conversations/")) {
      analyticsEvent = "/conversations/thread";
    }
    
    AnalyticsTracking.acEventTrigger(analyticsEvent);
    const settingStyle={'marginLeft': '280px'}
   
    return (
      <div className="app" suppressContentEditableWarning={true}>
        <div className="app-body">
          <Sidebar {...this.props} profilePicUrl={this.state.imageLink} displayName={this.state.displayName} isIntegrationStarted={this.state.isIntegrationStarted}/>
          <main className="main">
            <div className="integration-invited-team-div text-center" hidden={this.state.hideInvitedMemberBar}>
              <p>You were invited by <span>{this.state.invitedBy}</span>. You may start with <Link to="/settings/install">{CommonUtils.getProductName()} Installation</Link> or set up your <Link to="/settings/profile">Profile</Link></p>
              <div className="dismiss-icon" onClick={this.closeInvitedMemberBar}>&#xd7;</div>
            </div>
            <Breadcrumb />
            <div className="container-fluid">
              { this.state.isApplozicTrialExpired ? 
              <Switch>
                <Route exact path="/settings/billing" name="Billing" render={() => <Billing {...this.props} />} />
                <Route exact path="/trial-expired" name="TrialExpired" render={() => <TrialExpired {...this.props} />} />
                <Redirect from="/" to="/trial-expired" />   
              </Switch> :
              <Switch >
                <Route exact path="/conversations/oops" name="" render={() => <Conversation404 {...this.props} />} />
                <Route path="/dashboard" name="Dashboard" render={() => <Dashboard {...this.props} />} />
                <Route exact path="/users" name="Tables" render={() => <Users {...this.props} />} />
                <Route exact={false} path="/conversations" name="Conversations" render={() => <Conversations {...this.props} />} />
                <Route exact path="/message-logs" name="Groups" render={() => <MessageLogs {...this.props} /> } />
                <Route exact path="/reports" name="Reports" render={() => <Reports {...this.props} />} />
                <Route exact path="/bot" name="Bot" render={() => <Bot {...this.props} />} />
                <Route exact path="/settings/profile" name="Admin" render={() => {
                  return <Admin updateProfilePicUrl={this.updateProfilePic} profilePicUrl={this.state.imageLink} updateUserDisplay={this.updateUserDisplay} />
                }} />
                <Redirect from="/settings/agent-assignment" to="/settings/conversation-rules" />
                {/* <Route exact path="/faq" name="Faq" render={() => <Faq {...this.props} />} /> */}
                <Route exact path="/settings/team" name="Team" render={() => <Team {...this.props} />} />
                <Route exact path="/settings/welcome-message" name="Welcome" render={() => <Welcome {...this.props} />} />
                <Route exact path="/settings/company" name="Company" render={() => <Company {...this.props} />} />
                <Route exact path="/settings/away-message" name="AwayMessage" render={() => <AwayMessage {...this.props} />} />
                <Route exact path="/settings/quick-replies" name="AutoSuggest" render={() => <AutoSuggest {...this.props} />} />
                <Route exact path="/settings/install" name="Install" render={() => <Install {...this.props} />} />
                <Route exact path="/settings/agent-app" name="Download" render={() => <Download {...this.props} />} />
                <Route exact path="/settings/conversation-rules" name="ConversationRules" render={() => <AgentAssignemnt {...this.props} />} />
                <Route exact path="/settings/billing" name="Billing" render={() => <Billing {...this.props} />} />
                <Route exact path="/integrations" name="Integrations" render={() => <Integrations {...this.props} />} />
                <Route exact path="/settings/pushnotification" name="PushNotification" render={() => <PushNotification {...this.props} />} />
                <Route exact path="/settings/mailbox" name="IncomingEmailForward" render={() => <IncomingEmailForward {...this.props} />} />
                <Route exact path="/settings/email-notifications" name="EmailNotifications" render={() => <EmailNotifications {...this.props} />} />
                <Route exact path="/settings/chat-widget-customization" name="ChatWidgetCustomization" render={() => <ChatWigetCustomization {...this.props} />} />
                <Route exact path="/settings/email-fallback" name="EmailFallback" render={() => <EmailFallback {...this.props} />} />
                <Route exact path="/settings/webhooks-security" name="WebhooksAndSecurity" render={() => <WebhooksAndSecurity {...this.props} />} />
                <Route exact path="/settings/csat-ratings" name="ConversationRatings" render={() => <CSATRatings {...this.props} />} />
                <Route exact path="/helpcenter/content" name="HelpCenterContent" render={() => <Faq {...this.props} />} />} />
                <Route exact path="/helpcenter/customization" name="HelpCenterCustomization" render={() => <HelpCenterCustomization {...this.props} />} />
                <Route exact path="/settings/conversation-auto-resolving" name="ConversationAutoResolving" render={() => <ConversationAutoClosing {...this.props} />} />

                <Redirect from="/faq" to="/helpcenter/content" />      
                <Redirect from="/" to="/dashboard" />      

              </Switch>
            }
            </div>
          </main>
          <Aside updateProfilePicUrl={this.updateProfilePic}/>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateFaqListInAppSettings: payload => dispatch(Actions.updateApplicationData('FAQ_LIST', payload))
}) ;

export default connect(null, mapDispatchToProps)(Full); 