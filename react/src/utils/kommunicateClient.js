//import validator from 'validator';
import axios from 'axios';
import { getConfig } from '../config/config';
import config from '../config/index';
//import isEmail from 'validator/lib/isEmail';
import { getJsCode } from './customerSetUp';
import Notification from '../views/model/Notification'
import FormData from 'form-data'
import CommonUtils from '../utils/CommonUtils';
import cache from 'memory-cache';
import { USER_TYPE, MEMORY_CACHING_TIME_DURATION, ROLE_TYPE, INVITED_USER_STATUS} from '../utils/Constant'
import AnalyticsTracking from './AnalyticsTracking';
import dateFormat from 'dateformat';

/**
 * Creates Customer /Bot/ Agent
 * @param {Object} userInfo
 * @param {Object} userInfo.userName
 * @param {Object} userInfo.email
 * @param {Object} userInfo.type
 * @param {Object} userInfo.applicationId
 * @param {Object} userInfo.password
 * @param {Object} userInfo.name
 * @param {String} userType
 */

const createCustomerOrAgent = (userInfo, userType, signUpVia, recaptchaValue, product) => {
  // signUpVia is the source from where you were redirected eg: google
  switch (userType) {
    case "AGENT":
    case "ADMIN":
    case "BOT":
      return createAgent(userInfo,userType);
    default:
      return createCustomer(userInfo.email, userInfo.password, userInfo.name, userInfo.userName, signUpVia, recaptchaValue, product);
  }
}
const createCustomer = function (email, password, name, userName, signUpVia, recaptchaValue, product) {
  // signUpVia is the source from where you were redirected eg: google
  let signUpUrl = getConfig().kommunicateApi.signup;
  let loginType = 'email';
  let roleType = ROLE_TYPE.SUPER_ADMIN ;

  /*
  * When login is done via 'Sign in with Google' make password = 'VERY SECURE' and loginType = 'oauth'.
  * Adding a query param OAuthSignUp as a backend flag
  */
  if (signUpVia === "GOOGLE") {
    signUpUrl += '?OAuthSignUp=true'
    password = "VERY SECURE"
    loginType = 'oauth'
  }
  const signUrlBodyParameters = {
    userName,
    password,
    name,
    email,
    loginType,
    roleType,
    product
  }

  return Promise.resolve(axios.post(signUpUrl, signUrlBodyParameters))
    .then((response) => {
      if (response.status == 200) {
        if (response.data.code == "SUCCESS") {
          console.log(" successfully signed up");
          return response;
        } else if (response.data.code === "USER_ALREADY_EXISTS") {
          //alert("a user already exists with this name.. ");
          throw { code: "USER_ALREADY_EXISTS", message: "user already exists.." };
        }
      } else {
        //alert("Internal server error..");
        throw { code: response.data && response.data.code ? response.data.code : "INTERNAL_SERVER_ERROR", message: "Retry again after some time!!" };
      }
    });
}

const saveToLocalStorage = (email, password, name, response) => {
  var userDeatils = response.data.data;
  if (typeof (Storage) === "undefined") {
    throw { code: "BROWSER_ERROR", message: "Your browser does not support web storage. please upgrade you browser." };
  }
  if (response !== undefined) {
    userDeatils.apzToken = new Buffer(userDeatils.userName + ':' + userDeatils.accessToken).toString('base64')
    userDeatils.password = password;
    if (userDeatils.application) {
    } else {
      throw { code: "APP_NOT_RECEIVED", message: "Successuflly Registered !! We are having some trouble to log u in, please retry login." }
    }
    CommonUtils.setUserSession(userDeatils);
    return { code: "SUCCESS" };
  } else {
    throw { code: "NULL_RESPONSE", message: "received null response" };
  }
}

const getCustomerInfo = (customer) => {

  const getCustomerUrl = getConfig().kommunicateApi.signup + '/' + customer;

  return Promise.resolve(axios.get(getCustomerUrl))
    .then(response => {
      if (response.status === 200 && response.data !== undefined) {
        // console.log(response);
        return response;
      }
    })
}

const getUserInfo = (user, appId) => {
  // different from getCustomerInfo

  const getUserInfoUrl = getConfig().kommunicateApi.createUser + '/' + user + '/' + appId;

  return Promise.resolve(axios.get(getUserInfoUrl))
    .then(response => {
      // console.log(response)
      if (response.status === 200 && response.data !== undefined) {
        return response
      }
    });
}

const patchCustomerInfo = (customerInfo, customer) => {

  const patchCustomerUrl = getConfig().kommunicateApi.signup + '/' + customer;

  return Promise.resolve(axios({
    method: 'patch',
    url: patchCustomerUrl,
    data: JSON.stringify(customerInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  })).then(function (response) {
    if (response.status === 200 && response.data !== undefined) {
      //  console.log(response);
      let user = { 'email': customerInfo.email, 'displayName': customerInfo.name };
      window.$kmApplozic.fn.applozic('updateUser', {
        data: user, success: function (response) {
          // console.log(response);
        }, error: function (error) {
          console.log(error);
        }
      });
      return response;
    }

    if (response.status === 404 && response.data !== undefined) {
      console.log(response)
      return response;
    }
  });
}

const patchUserInfo = (userInfo, userId, appId) => {

  const patchUserUrl = getConfig().kommunicateApi.createUser + '/' + encodeURIComponent(userId) + '/' + appId;

  return Promise.resolve(axios({
    method: 'patch',
    url: patchUserUrl,
    data: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  })).then(function (response) {
    if (response.status === 200 && response.data !== undefined) {
      //  console.log(response)
      return response;
    }

    if (response.status === 404 && response.data !== undefined) {
      //  console.log(response)
      return response;
    }
  });
}

const getEmailTemplate = (userName, applicationId, activateAccountUrl, logoUrl) => {
  return '<div style="height:100%;width:100%;background-color:#4D7CA8;margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif"> <center style="width:100%;height:100%"> <table style="border-spacing: 0;border-collapse: collapse;vertical-align: top;text-align: left;width: 100%;background: #f4f8fc;padding: 0px;"> <tbody> <tr> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;text-align: center;color: #222222;font-family: "Helvetica Neue","Helvetica","Arial",sans-serif;font-weight: normal;line-height: 19px;font-size: 14px;margin: 0;padding: 15px 0 20px;"> <center style="width:100%;min-width:580px"> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align: center;margin:0 auto;padding:0"><tbody> <tr style="vertical-align:top;text-align:left;padding:0" align="left"> <td style="border-collapse:collapse !important;vertical-align:top;text-align:left;" align="left" valign="top"> <a style="color: #FFFFFF;text-decoration: none;font-size: 40px;" href="https://www.kommunicate.io" target="_blank"> <img src="' + logoUrl + '" style="height: 100px;width: 300px;"> </a> </td> </tr> <tr> <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;width:0px;font-family:"Helvetica Neue","Helvetica","Arial",sans-serif;font-weight:normal;line-height:30px;font-size:18px;margin:0;padding:0" align="left" valign="top"> <p style="margin: 0;"><strong>Communicate with leads, even when you sleep</strong></p> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:left;width:100%;padding:0px; background-color: #f4f8fc;"> <tbody> <tr style="vertical-align:top;text-align:left;padding:0" align="left"> <td align="center" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#222222;font- family:"Helvetica Neue","Helvetica","Arial",sans-serif;font-weight:normal;line-height:19px;font-size:14px;margin:0;padding-bottom:30px" valign="top"> <center style="width:100%;min-width:580px"> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:inherit;width:580px;margin:0 auto;padding:0"> <tbody> <tr> <td align="center" valign="top"> <table style="background-color: #FFFFFF;border: 1px solid #F0F0F0; border-bottom: 1px solid #C0C0C0;" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td valign="top"> <div style="min-height:30px;font:17px Georgia,serif;text-align: center;"> <span style="">Howdy, You"ve been invited!</span> </div> </td> </tr> <tr> <td valign="top" style="padding:0;border-collapse:collapse;text-align:left"> <div style="font-family:"Helvetica Neue",Arial,Helvetica,sans-serif;padding: 15px;"> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:0;"> <tbody> <tr> <td> <br> <div style="font-family:"Helvetica Neue",Arial,Helvetica,sans-serif;f"> <p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans- serif;font-weight:normal;font-size:15px;line-height:24px;text-align:left"> ' + userName + ' has added you as Application Admin for Application: ' + applicationId + '. </p> </div> </td> </tr> <tr> <td valign="top" style="padding:10px 0;border-collapse:collapse"><a href=' + activateAccountUrl + ' "style="color:#4d7ca8;word-break:break-word;font-size:15px;text-align:left" target="_blank">Activate my account</a></td> </tr> <tr> <td valign="top" style="padding:10px 0 0;border-collapse:collapse;text-align:left"><p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;font-weight:normal;font-size:15px;line-height:24px;text- align:left">If you have any question or feedback, feel free to email us at <a href="hello@kommunicate.io" style="color:#4d7ca8;word-break:break-word;font-size:15px;text-align:left" target="_blank">hello@kommunicate.io</a></p> </td> </tr><tr><td valign="top" style="padding:10px 0 0;border-collapse:collapse;text-align:left"> <p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;font-weight:normal;font-size:15px;line-height:24px;text- align:left">Team Kommunicate </p> </tr> <tr> <td valign="top" style="padding:10px 0;border-collapse:collapse;text-align:left"> <a href="http://www.facebook.com/applozic" style="margin:0;padding:0;min-height:24px;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;color:#4d7ca8;font-size:12px;font-weight:bold;text-decoration:none;line-height:24px;display:inline-block;float:left" target="_blank"> <img src="https://api-test.kommunicate.io/img/facebook-round32.png" style="margin:0;padding:0;width:32px;min-height:32px;margin-right:10px;border-style:none;display:inline-block;float:left" class="CToWUd"> <span style="min-height:24px;line-height:24px;display:inline-block;color:#4d7ca8">Like us on Facebook</span> </a> <a href="http://www.twitter.com/applozic" style="margin:0;padding:0;min-height:24px;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;color:#4d7ca8;font-size:12px;font-weight:bold;text-decoration:none;line-height:24px;display:inline-block;float:right" target="_blank"> <img src="https://api-test.kommunicate.io/img/twitter-round32.png" style="margin:0;padding:0;width:32px;min-height:32px;margin-right:10px;border-style:none;display:inline-block;float:left" class="CToWUd"> <span style="min-height:24px;line-height:24px;display:inline-block;color:#4d7ca8">Follow us on twitter</span> </a> </td> <tr> </tbody> </table> </div> </td> </tr> </tbody> </table> <table align="center" style="background-color:#F4F8FC;width: 100%; text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 5px 0 0;"> This message is a service email related to your use of <a style="color: #666666;" href="https://www.applozic.com" target="_blank">Applozic</a> </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;"> &#0169; 2015 Applozic Inc., Stanford Financial Square, 2600 El Camino Real, Suite 415,Palo Alto, CA 94306. </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;">For general inquiries or to request support with your AppLozic account, please contact us at <a style="color:#666666;text-decoration:none" href="mailto:hello@kommunicate.io" target="_blank">hello@kommunicate.io</a> <br> <a style="color:#666666" href="https://www.kommunicate.io" target="_blank">Website</a> | <a style="color:#666666" href="https://www.facebook.com/applozic" target="_blank">Facebook</a> | <a style="color:#666666" href="https://twitter.com/applozic" target="_blank">Twitter</a> </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;"> Click to <a href="https://www.applozic.com/unsubscribe?id=[ID]" style="color:#434343;text-decoration:underline" target="_blank"></a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> </center> </div>'
}

const callSendEmailAPI = (options) => {
  let emailAddress = options.to;
  const logoUrl = getConfig().kommunicateApi.logo;
  //let activateAccountUrl= getConfig().kommunicateApi.activateAccountUrl.replace(":applicationId",localStorage.applicationId);
  //const emailTemplate = getEmailTemplate(localStorage.getItem('loggedinUser'),localStorage.getItem('applicationId'),activateAccountUrl,logoUrl);

  const emails = [].concat(...[emailAddress])
  let userSession = CommonUtils.getUserSession();
  let userId = userSession.userName;
  let roleType = options.roleType;
  let data = {};

  if (options.templateName == "INSTALLATION_INSTRUCTIONS") {
    AnalyticsTracking.acEventTrigger("integration.instructions.mail.sent");
  } else {
    AnalyticsTracking.acEventTrigger("mail." + options.templateName);
  }
let url = config.baseurl.kommunicateAPI+"/misc/mail";
if(options.templateName == "INVITE_TEAM_MAIL"){
  url=  getConfig().kommunicateApi.sendMail;
  };
  if (options.templateName === "BOT_USE_CASE_EMAIL" || options.templateName === "CUSTOM_REPORTS_REQUIREMENT") {
    data = {
      "product": CommonUtils.getProduct(),
      to: [userSession.email],
      from: "hello@kommunicate.io",
      cc: [],
      userName: userSession.name || userId,
      ...options
    }
  } else {
    data = {
      "to": [...emails],
      "templateName": options.templateName,
      "from": userSession.name || userId + "<" + userId + ">",
      "kommunicateScript": getJsCode(),
      "applicationId": userSession.application.applicationId,
      "agentName": userSession.name || userSession.name || userId,
      "agentId": userId,
      "roleType":roleType,
      "resendMail":options.resendMail ?options.resendMail :false,
      "product": CommonUtils.getProduct()
    }
  }
  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: { ...data }
  }))
    .then((response) => {
      if (response.status === 200) {
        return response;
      }
    }).catch(err=>{
      throw err;
    });
}

const notifyThatEmailIsSent = (options) => {
  return callSendEmailAPI(options).then(response => {
    return response;
  }).catch(err => {
    Notification.error(err.response.data.code || "Something went wrong!")
  });
}

const postAutoReply = (formData) => {

  if (formData.workingHours.length === 0) {
    Notification.success('please select date');
    return;
  }

  const autoreplyUrl = getConfig().applozicPlugin.autoreplyUrl;
  const username = CommonUtils.getUserSession().userName;

  axios({
    method: 'post',
    url: autoreplyUrl + username + '/business-hours',
    data: formData
  }).then((response) => {
    Notification.success('submitted successfully');
  });
}

const createAgent = (userInfo, userType) => {
  try {
    if (!(userInfo && userInfo.userName && userInfo.applicationId && userInfo.password && userInfo.type && userInfo.roleType)) {
      throw new Error("missing mendatory fields");
    }
    const url = getConfig().kommunicateApi.createUser;
    console.debug("creating agent :", userInfo, "url: ", url);
    return axios.post(url, userInfo).then(user => {
      console.debug("user created successfully", user);
      userType != "BOT" && updateInvitedUserStatus(userInfo.token, INVITED_USER_STATUS.SIGNED_UP);
      return user;
    }).catch(err => {
      let error = err.response && err.response.data ? err.response.data : err;
      return Promise.reject(error);
    });
  } catch (err) {
    let error = err.response && err.reponse.data ? err.reponse.data : err;
    return Promise.reject(error);
  };

}

const updatePassword = (options) => {
  // console.log("reset password",options);
  try {
    if (!options || !options.newPassword || !options.code) {
      throw new Error("mandetory fields are missing");
    }
    const url = getConfig().kommunicateApi.passwordUpdateUrl;
    return axios.post(url, { newPassword: options.newPassword, code: options.code });
  } catch (err) {
    return Promise.reject(err);
  }
}

const resetPassword = (options) => {
  // console.log("reset password",options);
  try {
    if (!options || !options.userName || !options.applicationId) {
      throw new Error("mandetory fields are missing");
    }
    const url = getConfig().kommunicateApi.passwordResetUrl;
    return axios.post(url, { userName: options.userName, applicationId: options.applicationId, product: CommonUtils.getProduct()});
  } catch (err) {
    return Promise.reject(err);
  }
}

const checkUserInApplozic = ({ header, data }) => {
  return Promise.resolve(axios({
    method: 'post',
    url: getConfig().applozicPlugin.createApplozicUser,
    headers: header,
    data: data
  }))
    .then(response => {
      // console.log("in response")
      // console.log(response)
      return response;
    })
}

const getAllSuggestions = () => { 

  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest

  return Promise.resolve(axios.get(autoSuggestUrl))
    .then(response => response.data.data)
    .then(autoSuggestions_data => {
      const autoSuggestions = autoSuggestions_data.reduce((prev, curr) => {
        prev.push({ category: curr.category, name: curr.name, content: curr.content })
        return prev;
      }, [])
      return autoSuggestions
    })
    .catch(err => { console.log("Error in getting auto suggestions") });
}

const getSuggestionsByAppId = (applicationId, type) => {

  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + applicationId + '?type=' + type

  return Promise.resolve(axios.get(autoSuggestUrl))
    .then(response => response.data.data)
    .then(autoSuggestions_data => {
      const autoSuggestions = autoSuggestions_data.reduce((prev, curr) => {
        prev.push({ applicationId: curr.applicationId, id: curr.id, category: curr.category, name: curr.name, content: curr.content })
        return prev;
      }, [])
      return autoSuggestions
    })
    .catch(err => err);
}

const createSuggestions = (suggestion) => {
  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest
  return Promise.resolve(axios.post(autoSuggestUrl, suggestion))
    .then(response => response)
}

const deleteSuggestionsById = (suggestionId) => {
  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest;
  return Promise.resolve(axios.delete(autoSuggestUrl, suggestionId))
    .then(response => response)
    .catch(err => err);
}
const updateSuggestionsById = (updatedSuggestion) => {
  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest;
  return Promise.resolve(axios.patch(autoSuggestUrl, updatedSuggestion))
    .then(response => response)
    .catch(err => err);
}

const signUpWithApplozic = (data) => {
  const url = getConfig().kommunicateBaseUrl + "/customers/applozic";
  let user = { userId: data.userName, password: data.password, applicationId: data.applicationId };
  return axios.post(url, { userName: data.userName, password: data.password, applicationId: data.applicationId }).then(response => {
    return response;
  });
}

const sendProfileImage = (imageFile, imageFileName) => {

  const profileImageUrl = getConfig().kommunicateApi.profileImage;

  let data = new FormData()

  data.append('file', imageFile, imageFileName)

  return Promise.resolve(axios.post(profileImageUrl, data, {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  }))
    .then(response => {

      window.$kmApplozic.fn.applozic('updateUser', {
        data: { 'imageLink': response.data.profileImageUrl }, success: function (response) {
        }, error: function (error) {
          console.log(error);
        }
      });
      return response;
    });
}

const updateApplozicUser = (userInfo) => {
  let userSession = CommonUtils.getUserSession();
  let ofUserId = (userInfo && userInfo.userId) || userSession.userName;
  const headers = {
    'Content-Type': 'application/json',
    'Apz-AppId': userSession.application.applicationId,
    'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
    'Apz-Product-App': 'true',
    'Of-User-Id': ofUserId
  }

  const updateApplozicUserUrl = getConfig().applozicPlugin.updateApplozicUser;

  return Promise.resolve(axios.post(updateApplozicUserUrl, userInfo, {
    headers: headers
  })).then(response => {
    // console.log(response);
    return response
  })

}

const getWelcomeMessge = (applicationId) => {
  if (!applicationId) {
    throw new Error("application Id is missing");
  }
  const url = getConfig().kommunicateBaseUrl + "/applications/" + applicationId + "/welcomemessage";
  return axios.get(url).then(response => {
    if (response.data.code == 'success') {
      return response.data.data.message;
    }
  });
}
/**
 * this method fetch the all users(agents and Bots) for applicationId.
 * pass userType to filter result: 1 for Agent, 2 for Bot
 * @param {String} applicationId
 * @return {Object} Json of agent and bots
 * @throws {Object} Error
 */
const getAgentAndUsers = (applicationId) => {
  // this method also populating BOT_AGENT_MAP in localStorage
  let agentFilterOption = [];
  let agentBotMap ={};
  return Promise.resolve(getUsersByType(applicationId, [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT])).then(data => {
    data.map((user, index) => {
     user && (agentBotMap[user.userName] = user);
      // remove below "if" to show bot  in agent filter option
      if(user && user.type !=USER_TYPE.BOT ){
      let name = user.name ? user.name :  user.email
      agentFilterOption.push({ label: name, value: user.userName })
    }
    });
    return {agents: agentFilterOption, users: agentBotMap};
  }).catch(err => {
    // console.log("err while fetching users list ", err);
  });
}
/**
 * this method fetch the all users(agents and Bots) for applicationId.
 * pass userType to filter result: 1 for Agent, 2 for Bot
 * @param {String} applicationId
 * @param {Number} userType 1 for Agent, 2 for Bot
 * @return {Object} List of bot/agents
 * @throws {Object} Error
 */
const getUsersByType = (applicationId, userType) => {
  let url = getConfig().kommunicateBaseUrl + "/users?appId=" + applicationId;
  if (userType) {
    url += "&type=" + userType;
  }
  return axios.get(url).then(result => {
    //loggo.info("got data from db",result!=null);
    return result.data ? result.data.data : [];
  });
}

/***
 * this method will update the password
 * @param {Object} option
 * @param {Object} option.applicationId this is application id
 *
*/
const changePassword = (option) => {
  var data = {};
  let userSession = CommonUtils.getUserSession();
  data.userName = userSession.userName;
  data.applicationId = userSession.application.applicationId;
  option.oldPassword && (data.oldPassword = option.oldPassword);
  data.newPassword = option.newPassword;
  option.loginVia && (data.loginVia = option.loginVia);

  const patchClientUrl = getConfig().kommunicateBaseUrl + "/users/password/update";
  return Promise.resolve(axios({
    method: 'post',
    url: patchClientUrl,
    data: data
  })).then((response) => {
    if (response.data.code === 'SUCCESS') {
      Notification.success('Password Changed Successfully');
      let userSession = CommonUtils.getUserSession();
      userSession.password = option.newPassword;
      CommonUtils.setUserSession(userSession);
      return "SUCCESS";
    }
    else {
      Notification.error('Wrong current password');
    }
  })
    //.catch(err => { Notification.error(err.response.data.code || "Something went wrong!") });
    .catch(err => { console.log("Error in updating password") });

}

const goAway = (userId, appId) => {
  let url = getConfig().kommunicateBaseUrl + "/users/goAway/" + userId + "/" + appId;
  return Promise.resolve(axios.patch(url)).then(result => {
    CommonUtils.updateAvailabilityStatus(0);
  })
}

const goOnline = (userId, appId) => {
  let url = getConfig().kommunicateBaseUrl + "/users/goOnline/" + userId + "/" + appId;
  return Promise.resolve(axios.patch(url)).then(result => {
    CommonUtils.updateAvailabilityStatus(1);
  })
}

const createIssueType = (data) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/issuetype/" + userSession.userName + "/" + userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: data
  })).then((response) => {
    return response
  }).catch(err => { console.log("Error in creating issue") })
}

const getIssueTypes = (data) => {

  let url = getConfig().kommunicateBaseUrl + "/issuetype";

  return axios.get(url).then(response => {
    // console.log(response)
    if (response.data.code === 'GOT_ALL_ISSUE_TYPE') {
      return response.data.data
    }
  })
}

const getIssueTypeByCustIdAndCreatedBy = () => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/issuetype/" + userSession.userName + "/" + userSession.application.applicationId;

  return axios.get(url).then(response => {
    // console.log(response)
    if (response.data.code === 'GOT_ALL_ISSUE_TYPE') {
      return response.data.data
    }
  }).catch(err => { console.log("Error in getIssueTypeByCustIdAndCreatedBy", err) })
}

const addInAppMsg = (data) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl + "/applications/" + userSession.userName + "/" + userSession.application.applicationId + "/createinappmsg";

  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: data
  })).then((response) => {
    return response
  }).catch(err => { console.log("Error in creating in app msg") })

}

const disableInAppMsgs = (obj) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/applications/disableInAppMsgs/" + userSession.userName + "/" + userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      category: obj.category
    }
  })).then(result => {
    // console.log(result);
    return result;
  }).catch(err => { console.log("Error in disableInAppMsgs", err) })

}

const enableInAppMsgs = (obj) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl + "/applications/enableInAppMsgs/" + CommonUtils.getUserSession().userName + "/" + userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      category: obj.category
    }
  })).then(result => {
    // console.log(result);
    return result;
  }).catch(err => { console.log("Error in enableInAppMsgs", err) })

}

const getInAppMessages = () => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl + "/applications/" + CommonUtils.getUserSession().userName + "/" + userSession.application.applicationId + "/getInAppMessages";

  return axios.get(url).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
      if (response.data.data instanceof Array) {
        return response.data.data
      }
    }
  }).catch(err => { console.log("Error in getInAppMessages", err) })
}

const getInAppMessagesByEventId = (eventIds) => {
  let userSession = CommonUtils.getUserSession();
  let userInfo = {
    userName: userSession.userName,
    customerId: userSession.customerId,
    appId: userSession.application.applicationId,
    eventIds: eventIds
  }
  if (userInfo.userName && userInfo.appId) {
    let url = getConfig().kommunicateBaseUrl + "/applications/events"
    return Promise.resolve(axios.get(url, { params: userInfo })).then(response => {
      if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
        if (response.data.data instanceof Object) {
          return response.data.data
        }
      } else if (response === undefined) {
        return [];
      }
    }).catch(err => {
      console.log("Error in getInAppMessagesByEventId", err)
      return [];
    })
  }

}

const deleteInAppMsg = (id) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl + "/applications/" + id + "/deleteInAppMsg";

  return Promise.resolve(axios.patch(url)).then(response => {
    // console.log(response)
    if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
      if (response.data.data instanceof Array) {
        return response.data.data
      }
    }
  }).catch(err => { console.log("Error in deleteInAppMsg", err) })
}

const editInAppMsg = (id, message) => {
  let url = getConfig().kommunicateBaseUrl + "/applications/editInAppMsg";

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      id: id,
      message: message
    }
  })).then(response => {
    // console.log(response)
    if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
      if (response.data.data instanceof Array) {
        return response.data.data
      }
    }
  }).catch(err => { console.log("Error editInAppMsg", err) })
}

const getIntegratedBots = () => {

  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;

  // let url = "http://localhost:5454/bot/" + appId;
  let url = getConfig().applozicPlugin.addBotUrl + "/" + appId;

  return Promise.all([axios.get(url), getUsersByType(appId, 2)])
    .then(([mongoBots, sqlBots]) => {
      let bots = []
      let dialogFlowBots = mongoBots.data.filter(bot => {
        return (bot.aiPlatform && bot.aiPlatform.toLowerCase() === 'dialogflow');
      });
      for (let i = 0; i < sqlBots.length; i++) {
        if (sqlBots[i].userName !== "bot") {
          let mbot = mongoBots.data.filter(bot => { return bot.name === sqlBots[i].userName });
          bots.push({ ...mbot[0], ...sqlBots[i] });
        }
      }

      return { 'allBots': bots, 'dialogFlowBots': dialogFlowBots };

    }).catch(err => { console.log(err) })

}

const updateAgentAndBotRouting = (data) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/settings/application/" + userSession.application.applicationId;
  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: data
  })).then(result => {
    return result;
  }).catch(err => { console.log(err) })
}


const getSuggestionsByCriteria = (applicationId, criteria, value) => {

  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + applicationId

  return Promise.resolve(axios.get(autoSuggestUrl, {
    params: {
      criteria: criteria,
      value: value
    }
  }))
    .then(response => response.data)
    .catch(err => err);
}

const getCustomerByApplicationId = () => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/customers?applicationId=" + userSession.application.applicationId;
  return Promise.resolve(axios({
    method: 'get',
    url: url,
  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while fetching customer by applicationId", err) })

}

const getAgentandBotRouting =() =>{
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/settings/application/" + userSession.application.applicationId;
  return Promise.resolve(axios({
    method: 'get',
    url: url,
  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while fetching customer by applicationId", err) })

}

const createAndUpdateThirdPArtyIntegration = (data, integrationType) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/integration/settings/" + userSession.application.applicationId + "/insert/" + integrationType;
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: data
  })).then(result => {
    // console.log(result);
    return result;
  }).catch(err => { console.log("Error while submiting third party integration keys", err) })

}
const getThirdPartyListByApplicationId = (type) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/integration/settings/" + userSession.application.applicationId;
  type && (url = url.concat("/?type="+type))
  return Promise.resolve(axios({
    method: 'get',
    url: url,
  })).then(result => {
    if(result.data && result.data.code == "SUCCESS" ) {
      return result;
    }
  }).catch(err => { 
    console.log("Error while fetching third party integration by applicationId", err) 
    throw err
  })

}
const deleteThirdPartyByIntegrationType = (integrationType) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/integration/settings/" + userSession.application.applicationId + "/" + integrationType;
  return Promise.resolve(axios.delete(url))
    .then(response => response)
    .catch(err => err);
}
const getZendeskIntegrationTicket = (ticketId) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/zendesk/" + userSession.application.applicationId + "/ticket/" + ticketId
  return Promise.resolve(axios({
    method: 'GET',
    url: url,

  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while fetching zendesk ticket", err) })
}
const createZendeskIntegrationTicket = (data, groupId) => {
  let userSession = CommonUtils.getUserSession();
  const headers = {
    'Content-Type': 'application/json',
    'Apz-AppId': userSession.application.applicationId,
    'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
    'Apz-Product-App': 'true',
    'Of-User-Id': userSession.userName
  }
  let url = getConfig().kommunicateBaseUrl + "/zendesk/" + userSession.application.applicationId + "/ticket/" + groupId + "/create"
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: data,
    headers: headers
  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while creating zendesk ticket", err) })
}

const createAgileCrmContact = (data) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/agilecrm/"+ userSession.application.applicationId+"/contact";
  return Promise.resolve(axios.post(url, data)).then(response => {
    if(response.data && response.data.code == "SUCCESS" ) {
      return response;
    }
  }).catch(err => {
        console.log("Error while creating Agile CRM contact", err);
        throw err;
   
  });
  
}
const updateAgileCrmContact = (data) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/agilecrm/"+ userSession.application.applicationId+ "/" +data.contactId+ "/contact";
  return Promise.resolve(axios.patch(url, data)).then(response => {
    if(response.data && response.data.code == "SUCCESS" ) {
      return response;
    }
  }).catch(err => {
        console.log("Error while updating Agile CRM contact", err);
        throw err; 
  });
}
const updateConversation = (conversation) => {
  let userSession = CommonUtils.getUserSession();
  conversation.appId = userSession.application.applicationId
  let url = getConfig().kommunicateBaseUrl + "/conversations/update";
  return Promise.resolve(axios.patch(url, conversation)).then(response => {
    // console.log(response);
    return response;
  }).catch(err => { console.log(err) });

}
const updateZendeskIntegrationTicket = (data, ticketId) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/zendesk/" + userSession.application.applicationId + "/ticket/" + ticketId + "/update"
  return Promise.resolve(axios({
    method: 'PUT',
    url: url,
    data: data
  })).then(result => {

    return result;
  }).catch(err => { console.log("Error while creating zendesk ticket", err) })


}

const conversationHandlingByBot = (botId, status) => {
  let userSession = CommonUtils.getUserSession();
  const converstaionHandlingByBotUrl = getConfig().kommunicateApi.createUser + '/' + encodeURIComponent(botId) + '/' + userSession.application.applicationId + '/' + status;
  return Promise.resolve(axios({
    method: 'patch',
    url: converstaionHandlingByBotUrl,
  }))

}

/**
 * @param {Int} days 
 * get timestamp between current date and past date
 * ex. current date and 7 days back 
 */
const getTimestamps = days => {
    days = parseInt(days, 10);
    let toDate = new Date(dateFormat(new Date(), "yyyy-mm-dd 00:00:00"));
    toDate.setDate(toDate.getDate() - days);
    // days==1 ->only yesterday 24hrs data
    let currentDate =
        days !== 1
            ? new Date()
            : new Date(dateFormat(new Date(), "yyyy-mm-dd 00:00:00"));
    return [currentDate.getTime(), toDate.getTime()];
};

const getConversationStatsByDayAndMonth = (days, agentId, hoursWiseDistribution) => {
  let userSession = CommonUtils.getUserSession();
  let applicationId = userSession.application.applicationId;
  let query = { applicationId: applicationId, days: days, daily: true };
  let timestamps = getTimestamps(days)
  const header = {
    'Content-Type': 'application/json',
    'Apz-AppId': applicationId,
    'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
    'Apz-Product-App': userSession.roleName != 'APPLICATION_ADMIN'

  }
  agentId = encodeURIComponent(agentId)
  if (days == 0 || days == 1) {
    query.daily = "false"
  }
  else {
    query.daily = !hoursWiseDistribution;
  }
  let url = getConfig().homeUrl + "/rest/ws/group/stats?timestamp="+timestamps[0] + "&toTimestamp="+timestamps[1] +"&applicationId=" + query.applicationId + "&daily=" + query.daily + "&agentId=";

  if (agentId && agentId != "allagents") {
    url = url.replace("&agentId=", '&agentId=' + agentId);

  }

  return new Promise((resolve, reject) => {
    let cachedResponse = cache.get(url);

    if (cachedResponse) {
      resolve(cachedResponse);
    } else {
      Promise.resolve(axios({
        method: 'GET',
        url: url,
        headers: header
      }).then(response => {
        if (response.status !== 200) {
          reject({ 'statusCode': response.status });
        }
        else {
          cache.put(url, response.data, MEMORY_CACHING_TIME_DURATION);
          resolve(response.data);
        }
      })

      );
    }

  });
}
const updateAppSetting = (data) => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  const url = getConfig().kommunicateBaseUrl + '/settings/application/' + appId;
  return Promise.resolve(axios({
    method: 'PATCH',
    url: url,
    data: data
  })).then(result => {
    if(typeof result !== "undefined" && result.data.code == "SUCCESS") {
      return result;
    }   
  }).catch(err => {
    throw { message: err };
  })

}
const getAppSetting = (applicationId) => {
  let userSession = CommonUtils.getUserSession();
  let appId = applicationId || userSession.application.applicationId;
  const url = getConfig().kommunicateBaseUrl + '/settings/application/' + appId;
  return Promise.resolve(axios({
    method: 'GET',
    url: url,
  })).then(result => {
    if(typeof result !== "undefined" && result.data.code == "SUCCESS") {
    userSession.loadInitialStateConversation = result && result.data && result.data.response.loadInitialStateConversation;
    CommonUtils.setUserSession(userSession);
      return result;
    }
  }).catch(err => {
    console.log("Error while fetching application settings", err)
    throw { message: err };
  })
}

const getApplication = () => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  let apzToken = "Basic " + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64')
  const url = getConfig().homeUrl + '/rest/ws/application/get?applicationId=' + appId;
  let headers = {
    "Apz-Token": apzToken,
    "Content-Type": "application/json",
    "Apz-AppId": appId,
    "Apz-Product-App": true,
  }
  return Promise.resolve(axios({
    method: 'GET',
    url: url,
    headers: headers,
  })).then(result => {
    userSession.application = result.data;
    CommonUtils.setUserSession(userSession);
    return result;
  }).catch(err => {
    throw { message: err };
    console.log("Error while fetching application", err)
  })

}
const deleteUserByUserId = (userNames) => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  // userNames = encodeURIComponent(userNames);
  let postData = {
    "userNames": userNames
  };
  const headers = {
    'Content-Type': 'application/json',
  }
  let url = getConfig().kommunicateBaseUrl + '/users/?applicationId=' + appId + '&deactivate=' + true;
  return Promise.resolve(axios({
    method: 'PATCH',
    url: url,
    data: postData,
    headers: headers
  })).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
      return response.data;
    }
  }).catch(err => {
    throw { message: err };
  })
}
const deleteInvitationByUserId = (params) => {

  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  let data = {};
  let url =getConfig().kommunicateBaseUrl + "/users/invitation";
  data.applicationId = appId;
  data.invitedUser = params.invitedUser;
  return Promise.resolve(axios({
    method: 'delete',
    url: url,
    data: data
  })).then(response => {
    if (typeof response !== "undefined") {
      return response;
    }
  }).catch(err => {
    throw { message: err };
  })
}
const getInvitedUserByApplicationId = () => {
  
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  let url = getConfig().kommunicateBaseUrl + '/users/invite/list?appId=' + appId 
  return Promise.resolve(axios.get(url)).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success") {
      return response.data.data;
    }
  }).catch(err => {
    throw { message: err };
  })
}
const getUserDetailsByToken = (token) => {
  let url = getConfig().kommunicateBaseUrl + '/users/invite/detail?token='+token;
  return Promise.resolve(axios.get(url)).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 &&   response.data.code.toLowerCase() === "success") {
      return response.data.data;
    }
  }).catch(err => {
    throw { message: err };
  })

}
const updateInvitedUserStatus = (token,status) => {
  let url = getConfig().kommunicateBaseUrl + '/users/invite/status?reqId='+token +'&status='+status;
  return Promise.resolve(axios.patch(url)).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 &&   response.data.code.toLowerCase() === "success") {
      return true;
    }
  }).catch(err => {
    console.log("There is a problem while updating the invited user status", err);
  })
}
const updateUserStatus = (status) => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  let userName = userSession.userName
  let url = getConfig().kommunicateBaseUrl + '/users/status';
  let data = {
    "status": status,
    "applicationId": appId,
    "userName": userName
  }
  return Promise.resolve(axios({
    method: 'PATCH',
    url: url,
    data: data
  })).then(response => {
    if(response && response.data.code == "SUCCESS") {
      return response;
    }   
  }).catch(err => { throw { message: err }; })
}

const getSubscriptionDetail = (userId) => {
  let url = getConfig().kommunicateBaseUrl + '/subscription/detail/'+ userId;
  return Promise.resolve(axios.get(url)).then(response => {
    if (response !== undefined && response.data !== undefined && response.status === 200 &&   response.data.code.toLowerCase() === "success") {
      return response.data.response;
    }
  }).catch(err => {
    throw { message: err };
  })
}

const editApplicationDetails = (data) => {
  let url = getConfig().applozicPlugin.editApplication;
  let userSession = CommonUtils.getUserSession();
  let axiosConfig = {
    headers: {
      "Apz-Token": CommonUtils.isApplicationAdmin(userSession)? "Basic "+new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64') :"Basic " + getConfig().adminDetails.kommunicateAdminApzToken,
      "Content-Type": "application/json",
      "Apz-AppId": CommonUtils.isApplicationAdmin(userSession)? userSession.application.applicationId : getConfig().adminDetails.kommunicateParentKey
    }
  };
  data.appModulePxys = data.appModulePxys && data.appModulePxys.map(({createdAt, ...appModulePxy}) => appModulePxy)
  return Promise.resolve(axios.post(url, data, axiosConfig)).then(response => {
    if(response !== undefined) {
      return response;
    } 
  }).catch(err=>{
    console.log('application update error: ',err)
    return err;
  })
}

const createIntegrySubscription = (subscriptionData) => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  subscriptionData.applicationId = appId;
  let url = getConfig().kommunicateBaseUrl + '/subscription?apiKey='+ subscriptionData.apiKey;
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: subscriptionData
  })).then(response => {
    if (response !== undefined) {
      return response
    }
  }).catch(err => {
    throw { message: err };
  })
}

const updateKommunicateCustomerSubscription = (data) => {
  let url = getConfig().kommunicateBaseUrl + '/subscription/detail';
  return Promise.resolve(axios({
    method: 'PATCH',
    url: url,
    data: data
  })).then(response => {
    if(typeof response !== "undefined" && response.data.code == "SUCCESS") {
      return response;
    }   
  }).catch(err => { throw { message: err }; })
}
const submitOnboardingStatus = (data) => {
  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;
  let url = getConfig().kommunicateBaseUrl +'/onboarding/'+appId;
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: data
  })).then(response => {
    if(typeof response !== "undefined" && response.data.code == "SUCCESS") {
      return response;
    }   
  }).catch(err => { 
    console.log("error while submitting on-boarding status" )
    throw err  
  })
}

const updateUserPreference =(appId,userName,currentTimeZone)=>{
  var data = {};
  data.applicationId =appId;
  data.preference = "timeZone";
  data.value = currentTimeZone;
  data.userName = userName; 
  let url = getConfig().kommunicateBaseUrl +'/users/preference';
  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data:data
  })).then(response => {
    if(typeof response !== "undefined" && response.data.message == "SUCCESS") {
      return response;
    }   
  }).catch(err => { 
    console.log("error while updating user preference" );
    throw err  
  })
}

const uploadImageToS3 = (fileObject, fileName) => {
  const profileImageUrl = getConfig().kommunicateApi.profileImage;
  let data = new FormData();
  data.append('file', fileObject, fileName);

  return Promise.resolve(axios.post(profileImageUrl, data, {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  })).then(response => {
    if(response && response.status === 200) return response;
  }).catch(err => {
    throw err;
  });
}

export {
  createCustomer,
  getCustomerInfo,
  getUserInfo,
  saveToLocalStorage,
  patchCustomerInfo,
  patchUserInfo,
  notifyThatEmailIsSent,
  callSendEmailAPI,
  postAutoReply,
  createCustomerOrAgent,
  updatePassword,
  resetPassword,
  checkUserInApplozic,
  getAllSuggestions,
  createSuggestions,
  deleteSuggestionsById,
  getSuggestionsByAppId,
  updateSuggestionsById,
  signUpWithApplozic,
  sendProfileImage,
  updateApplozicUser,
  getWelcomeMessge,
  getAgentAndUsers,
  getUsersByType,
  changePassword,
  goAway,
  goOnline,
  createIssueType,
  getIssueTypes,
  getIssueTypeByCustIdAndCreatedBy,
  addInAppMsg,
  disableInAppMsgs,
  enableInAppMsgs,
  getInAppMessages,
  getInAppMessagesByEventId,
  deleteInAppMsg,
  editInAppMsg,
  getIntegratedBots,
  getSuggestionsByCriteria,
  getCustomerByApplicationId,
  getAgentandBotRouting,
  updateAgentAndBotRouting,
  createAndUpdateThirdPArtyIntegration,
  getThirdPartyListByApplicationId,
  deleteThirdPartyByIntegrationType,
  updateConversation,
  getZendeskIntegrationTicket,
  createZendeskIntegrationTicket,
  updateZendeskIntegrationTicket,
  conversationHandlingByBot,
  getConversationStatsByDayAndMonth,
  updateAppSetting,
  getAppSetting,
  getApplication,
  deleteUserByUserId,
  getInvitedUserByApplicationId,
  getUserDetailsByToken,
  updateInvitedUserStatus,
  updateUserStatus,
  getSubscriptionDetail,
  createIntegrySubscription,
  editApplicationDetails,
  updateKommunicateCustomerSubscription,
  deleteInvitationByUserId,
  createAgileCrmContact,
  updateAgileCrmContact,
  submitOnboardingStatus,
  updateUserPreference,
  uploadImageToS3
}
