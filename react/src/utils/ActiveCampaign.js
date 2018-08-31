import CommonUtils from './CommonUtils';
import axios from 'axios';

export function acEventTrigger(link) {
    var event;
    // Changing the event name 
    switch(link){
      case 'ac-faq':
        event = "createdFAQ";
        break;
      case 'ac-integrations':
        event = "integratedBot" 
        break;
      case 'ac-away-message':
        event = "configuredAwayMessage"
        break;
      case 'ac-welcome-message':
        event = "configuredWelcomeMessage"
        break;
      case 'ac-quick-replies':
        event = "createdQuickReply"
        break;
  
    }
  
    console.log(event);
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
  
    axios.post("https://trackcmp.net/event", eventString, axiosConfig)
      .then((res) => {
        // console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
        // console.log("AXIOS ERROR: ", err);
      })
  
  }

