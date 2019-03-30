import CommonUtils from './CommonUtils';
import axios from 'axios';
import  { getConfig }  from '../config/config';

const AnalyticsTracking = {

  isEnabled: function() {
    return getConfig().thirdPartyIntegration.analytics.enable;
  },

  identify: function(identity) {
    if(!AnalyticsTracking.isEnabled()) {
      return;
    }
    window.heap && window.heap.identify(identity);
    window.mixpanel && window.mixpanel.identify(identity);
  },

  trackMixpanel: function(event) {
    if(!AnalyticsTracking.isEnabled()) {
      return;
    }
    window.mixpanel && window.mixpanel.track(event);
  },

  addUserProperties: function(userProperties) {
    if(!AnalyticsTracking.isEnabled()) {
      return;
    }
    window.heap && window.heap.addUserProperties(userProperties);
    window.mixpanel && window.mixpanel.register(userProperties);
  },

  addPeopleProfile: function(userSession, userProperties) {
    if(!AnalyticsTracking.isEnabled()) {
      return;
    }
    window.mixpanel && window.mixpanel.people.set({
      "$distinct_id": userSession.userName,
      "$name": userSession.name,
      "$created": userProperties.signup,
      "$email": userProperties.email,
      "$product": userProperties.product
    });
  },

  acEventTrigger: function(trigger) {
    if(!AnalyticsTracking.isEnabled() || CommonUtils.getUserSession() == null) {
      return;
    }

    var event = trigger;

    // Changing the event name 
    switch(trigger){
      case 'ac-away-message':
        event = "configuredAwayMessage"
        break;
      case 'ac-welcome-message':
        event = "configuredWelcomeMessage"
        break;
      case 'ac-created-faq':
        event = "createdFAQ"
        break;
      case 'ac-created-quickreply':
        event = "createdQuickReply"
        break;
      case 'ac-integrated-bot':
        event = "integratedBot"
        break;
      case 'ac-configure-mailbox':
        event = "configuredMailbox"
        break;
      case 'ac-integrated-zendesk':
        event = "integratedZendesk"
        break;
      case 'ac-integrated-helpdocs':
        event = "integratedHelpdocs"
        break;
      case 'ac-integrated-clearbit':
        event = "integratedClearbit"
        break;
      case 'ac-integrated-agilecrm':
        event = "integratedAgileCRM"
        break;
      case 'ac-added-agent':
        event = "addedAgent"
        break;
      case 'ac-configured-routing':
        event = "configuredBotRouting"
        break;
      case 'ac-choose-plan':
        event ="clickedChangePlan"
        break;
      case 'ac-android-push':
        event ="setupAndroidPush"
        break;
      case 'ac-ios-dist':
        event ="setupApplePushDis"
        break;
     
      case 'ac-ios-dev':
        event ="setupApplePushDis"
        break;
    }

    window.mixpanel && window.mixpanel.track(event);
  
    //  ActiveCampaign id. 
    var actid = "66105982";
    //  event key,
    var eventKey = "6fcd6450068b76b0eb4e03c32f22cedbd7c5b545";
    // get the url of the page and send it as event data
    var eventData = "kommunicate";
  
    // build the eventString based on the variables you just edited above 
    var eventString = "actid=" + actid +
      "&key=" + eventKey +
      "&event=" + event +
      "&eventdata=" + eventData;
      
    this.sendEventToActiveCampaign(eventString, CommonUtils.getUserSession().email);

    if (CommonUtils.getUserSession().email != CommonUtils.getUserSession().adminUserName) {
      this.sendEventToActiveCampaign(eventString, CommonUtils.getUserSession().adminUserName);
    }
  },

  sendEventToActiveCampaign: function(eventString, email) {
    let visit = {
      email: email
    };
    eventString +="&visit=" + encodeURIComponent(JSON.stringify(visit));
    let axiosConfig = {
      headers: {
        "crossDomain": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    axios.post(getConfig().serviceUrl+"/track?", eventString, axiosConfig)
      .then((res) => {
         //console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
         //console.log("AXIOS ERROR: ", err);
      });
  }

};

export default AnalyticsTracking;