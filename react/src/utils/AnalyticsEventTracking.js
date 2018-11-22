import CommonUtils from './CommonUtils';
import axios from 'axios';
import  { getConfig }  from '../config/config';

export function acEventTrigger(trigger) {

    if(!getConfig().thirdPartyIntegration.analytics.enable) {
      return;
    }

    var event;
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
        event = "configuredRouting"
        break;
    }

    if (window.mixpanel) {
      window.mixpanel.track(event);
    }
  
    //  ActiveCampaign id. 
    var actid = "66105982";
  
    //  event key,
    var eventKey = "6fcd6450068b76b0eb4e03c32f22cedbd7c5b545";
  
  
    var visit = {
      email: CommonUtils.getUserSession().email // the user's email address
    }
  
    // get the url of the page and send it as event data
    var eventData = "kommunicate";
  
    // build the eventString based on the variables you just edited above 
    var eventString = "actid=" + actid +
      "&key=" + eventKey +
      "&event=" + event +
      "&visit=" + encodeURIComponent(JSON.stringify(visit)) +
      "&eventdata=" + eventData;
      
    // console.log(eventString)
  
    let axiosConfig = {
      headers: {
        "crossDomain": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    let trackingURL = getConfig().serviceUrl+"/track?";
    axios.post(trackingURL, eventString, axiosConfig)
      .then((res) => {
        // console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
        // console.log("AXIOS ERROR: ", err);
      })
  
  }

