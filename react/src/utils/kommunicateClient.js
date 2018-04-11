import validator from 'validator';
import axios from 'axios';
import {getConfig} from '../config/config';
import isEmail from 'validator/lib/isEmail';
import {getJsCode} from './customerSetUp';
import Notification from '../views/model/Notification'
import FormData from 'form-data'
import CommonUtils from '../utils/CommonUtils';


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
const createCustomerOrAgent = (userInfo, userType)=>{
  switch(userType){
    case "AGENT":
    case "BOT":
      return createAgent(userInfo);
    default:
    return createCustomer(userInfo.email,userInfo.password,userInfo.name,userInfo.userName);
  }
}
const createCustomer = function(email,password,name,userName) {
  let signUpUrl = getConfig().kommunicateApi.signup;

  if(localStorage.getItem('Google_OAuth') === 'true'){
    signUpUrl += '?OAuthSignUp=true'
  }

  return Promise.resolve(axios.post(signUpUrl, { userName: userName, password:password, name:name,email:email}))
    .then((response) => {
        console.debug(response.data.data);
        if(response.status==200){
          if(response.data.code=="SUCCESS"){
            console.log(" successfully signed up");
            return response;
          }else if(response.data.code==="USER_ALREADY_EXISTS"){
               //alert("a user already exists with this name.. ");
               throw {code:"USER_ALREADY_EXISTS",message:"user already exists.."};
           }
         } else  {
           //alert("Internal server error..");
           throw {code:response.data&&response.data.code?response.data.code:"INTERNAL_SERVER_ERROR",message:"Retry again after some time!!"};
         }
    });
}

const saveToLocalStorage = (email, password, name,response) => {
  if(typeof(Storage) === "undefined"){
    throw  {code:"BROWSER_ERROR",message:"Your browser does not support web storage. please upgrade you browser."};
  }
  if(response !== undefined){
    response.data.data.password = password;
    if(response.data.data.application){
    } else {
        throw {code:"APP_NOT_RECEIVED",message:"Successuflly Registered !! We are having some trouble to log u in, please retry login."}
    }
    CommonUtils.setUserSession(response.data.data);
    return {code:"SUCCESS"};
  } else{
    throw {code:"NULL_RESPONSE",message:"received null response"};
  }
}

const getCustomerInfo = (customer) => {

  const getCustomerUrl =getConfig().kommunicateApi.signup + '/' + customer;

  return Promise.resolve(axios.get(getCustomerUrl))
    .then(response => {
      if(response.status === 200 && response.data !== undefined){
        // console.log(response);
        return response;
      }
    })
}

const getUserInfo = (user, appId) => {
  // different from getCustomerInfo

  const getUserInfoUrl = getConfig().kommunicateApi.createUser + '/' + user + '/'+ appId;

  return Promise.resolve(axios.get(getUserInfoUrl))
    .then(response => {
      console.log(response)
      if(response.status === 200 && response.data !== undefined){
        return response
      }
    });
}

const patchCustomerInfo = (customerInfo, customer) => {

  const patchCustomerUrl =getConfig().kommunicateApi.signup + '/' + customer;

  return Promise.resolve(axios({
    method: 'patch',
    url: patchCustomerUrl,
    data:JSON.stringify(customerInfo),
    headers: {
     'Content-Type': 'application/json'
    }
  })).then(function(response){
     if(response.status === 200 && response.data !== undefined){
       console.log(response);
       let user = {'email': customerInfo.email, 'displayName': customerInfo.name};
       window.$applozic.fn.applozic('updateUser', {data: user, success: function(response) {
          console.log(response);
        }, error: function(error) {
          console.log(error);
        }
      });
       return response;
     }

     if(response.status === 404 && response.data !== undefined){
       console.log(response)
       return response;
     }
  });
}

const patchUserInfo = (userInfo, userId, appId) => {

  const patchUserUrl =getConfig().kommunicateApi.createUser + '/' + userId + '/'+ appId;

  return Promise.resolve(axios({
    method: 'patch',
    url: patchUserUrl,
    data:JSON.stringify(userInfo),
    headers: {
     'Content-Type': 'application/json'
    }
  })).then(function(response){
     if(response.status === 200 && response.data !== undefined){
       console.log(response)
       return response;
     }

     if(response.status === 404 && response.data !== undefined){
       console.log(response)
       return response;
     }
  });
}

const getEmailTemplate = (userName, applicationId,activateAccountUrl,logoUrl) => {
  return '<div style="height:100%;width:100%;background-color:#4D7CA8;margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif"> <center style="width:100%;height:100%"> <table style="border-spacing: 0;border-collapse: collapse;vertical-align: top;text-align: left;width: 100%;background: #f4f8fc;padding: 0px;"> <tbody> <tr> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;text-align: center;color: #222222;font-family: "Helvetica Neue","Helvetica","Arial",sans-serif;font-weight: normal;line-height: 19px;font-size: 14px;margin: 0;padding: 15px 0 20px;"> <center style="width:100%;min-width:580px"> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align: center;margin:0 auto;padding:0"><tbody> <tr style="vertical-align:top;text-align:left;padding:0" align="left"> <td style="border-collapse:collapse !important;vertical-align:top;text-align:left;" align="left" valign="top"> <a style="color: #FFFFFF;text-decoration: none;font-size: 40px;" href="https://www.kommunicate.io" target="_blank"> <img src="'+logoUrl+'" style="height: 100px;width: 300px;"> </a> </td> </tr> <tr> <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;width:0px;font-family:"Helvetica Neue","Helvetica","Arial",sans-serif;font-weight:normal;line-height:30px;font-size:18px;margin:0;padding:0" align="left" valign="top"> <p style="margin: 0;"><strong>Communicate with leads, even when you sleep</strong></p> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:left;width:100%;padding:0px; background-color: #f4f8fc;"> <tbody> <tr style="vertical-align:top;text-align:left;padding:0" align="left"> <td align="center" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#222222;font- family:"Helvetica Neue","Helvetica","Arial",sans-serif;font-weight:normal;line-height:19px;font-size:14px;margin:0;padding-bottom:30px" valign="top"> <center style="width:100%;min-width:580px"> <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:inherit;width:580px;margin:0 auto;padding:0"> <tbody> <tr> <td align="center" valign="top"> <table style="background-color: #FFFFFF;border: 1px solid #F0F0F0; border-bottom: 1px solid #C0C0C0;" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td valign="top"> <div style="min-height:30px;font:17px Georgia,serif;text-align: center;"> <span style="">Howdy, You"ve been invited!</span> </div> </td> </tr> <tr> <td valign="top" style="padding:0;border-collapse:collapse;text-align:left"> <div style="font-family:"Helvetica Neue",Arial,Helvetica,sans-serif;padding: 15px;"> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:0;"> <tbody> <tr> <td> <br> <div style="font-family:"Helvetica Neue",Arial,Helvetica,sans-serif;f"> <p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans- serif;font-weight:normal;font-size:15px;line-height:24px;text-align:left"> ' + userName + ' has added you as Application Admin for Application: ' + applicationId + '. </p> </div> </td> </tr> <tr> <td valign="top" style="padding:10px 0;border-collapse:collapse"><a href='+activateAccountUrl+' "style="color:#4d7ca8;word-break:break-word;font-size:15px;text-align:left" target="_blank">Activate my account</a></td> </tr> <tr> <td valign="top" style="padding:10px 0 0;border-collapse:collapse;text-align:left"><p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;font-weight:normal;font-size:15px;line-height:24px;text- align:left">If you have any question or feedback, feel free to email us at <a href="hello@kommunicate.io" style="color:#4d7ca8;word-break:break-word;font-size:15px;text-align:left" target="_blank">hello@kommunicate.io</a></p> </td> </tr><tr><td valign="top" style="padding:10px 0 0;border-collapse:collapse;text-align:left"> <p style="margin:0;padding:0;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;font-weight:normal;font-size:15px;line-height:24px;text- align:left">Team Kommunicate </p> </tr> <tr> <td valign="top" style="padding:10px 0;border-collapse:collapse;text-align:left"> <a href="http://www.facebook.com/applozic" style="margin:0;padding:0;min-height:24px;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;color:#4d7ca8;font-size:12px;font-weight:bold;text-decoration:none;line-height:24px;display:inline-block;float:left" target="_blank"> <img src="https://api-test.kommunicate.io/img/facebook-round32.png" style="margin:0;padding:0;width:32px;min-height:32px;margin-right:10px;border-style:none;display:inline-block;float:left" class="CToWUd"> <span style="min-height:24px;line-height:24px;display:inline-block;color:#4d7ca8">Like us on Facebook</span> </a> <a href="http://www.twitter.com/applozic" style="margin:0;padding:0;min-height:24px;font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;color:#4d7ca8;font-size:12px;font-weight:bold;text-decoration:none;line-height:24px;display:inline-block;float:right" target="_blank"> <img src="https://api-test.kommunicate.io/img/twitter-round32.png" style="margin:0;padding:0;width:32px;min-height:32px;margin-right:10px;border-style:none;display:inline-block;float:left" class="CToWUd"> <span style="min-height:24px;line-height:24px;display:inline-block;color:#4d7ca8">Follow us on twitter</span> </a> </td> <tr> </tbody> </table> </div> </td> </tr> </tbody> </table> <table align="center" style="background-color:#F4F8FC;width: 100%; text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 5px 0 0;"> This message is a service email related to your use of <a style="color: #666666;" href="https://www.applozic.com" target="_blank">Applozic</a> </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;"> &#0169; 2015 Applozic Inc., Stanford Financial Square, 2600 El Camino Real, Suite 415,Palo Alto, CA 94306. </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;">For general inquiries or to request support with your AppLozic account, please contact us at <a style="color:#666666;text-decoration:none" href="mailto:hello@kommunicate.io" target="_blank">hello@kommunicate.io</a> <br> <a style="color:#666666" href="https://www.kommunicate.io" target="_blank">Website</a> | <a style="color:#666666" href="https://www.facebook.com/applozic" target="_blank">Facebook</a> | <a style="color:#666666" href="https://twitter.com/applozic" target="_blank">Twitter</a> </td> </tr> <tr> <td style="font-family:Helvetica,Arial,sans-serif;font-size: 12px;color:#999999;padding: 0;"> Click to <a href="https://www.applozic.com/unsubscribe?id=[ID]" style="color:#434343;text-decoration:underline" target="_blank"></a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> </center> </div>'
}

const callSendEmailAPI = (options) => {
  let emailAddress =options.to;
  const logoUrl  = getConfig().kommunicateApi.logo;
  //let activateAccountUrl= getConfig().kommunicateApi.activateAccountUrl.replace(":applicationId",localStorage.applicationId);
  //const emailTemplate = getEmailTemplate(localStorage.getItem('loggedinUser'),localStorage.getItem('applicationId'),activateAccountUrl,logoUrl);

  const emails = [].concat(...[emailAddress])
  let userSession = CommonUtils.getUserSession();
  let userId = userSession.userName;
  let data = {}

  if(options.templateName === "BOT_USE_CASE_EMAIL"){
    data = {
      to: [userSession.email],
      from:"hello@kommunicate.io",
      cc: [],
      userName:userSession.name || userId,
      ...options
    }
  }else{
    data = {
      "to":[...emails],
      "templateName":options.templateName,
      "from":userSession.name || userId +"<"+userId+">",
      "kommunicateScript":getJsCode(),
      "applicationId":userSession.application.applicationId,
      "agentName":userSession.name || userSession.name || userId,
      "agentId": userId
    }
  }

  return Promise.resolve(axios({
    method: 'post',
    url: getConfig().kommunicateApi.sendMail,
    data: {...data}
  }))
  .then( (response) => {
    if(response.status === 200 && response.data.code === 'SUCCESS'){
      return response;
    }
  });
}

const notifyThatEmailIsSent = (options) => {
    return callSendEmailAPI(options)
      .then((response) => { 
        if(response.data.code === 'SUCCESS')
        {
          Notification.success('Email Sent successfully');
          return "SUCCESS";
        } 
      }).catch(err => { Notification.error(err.response.data.code || "Something went wrong!") });
  }

const postAutoReply = (formData) => {
  
  if (formData.workingHours.length === 0){
    Notification.success('please select date');
    return;
  }

  const autoreplyUrl = getConfig().applozicPlugin.autoreplyUrl;
  const username = CommonUtils.getUserSession().userName;

  axios({
    method: 'post',
    url:autoreplyUrl+username+'/business-hours',
    data:formData
  }).then((response) => {
    Notification.success('submitted successfully');
  });
}

const createAgent =(agent)=>{
  try{
  if(!(agent&&agent.userName&&agent.applicationId&&agent.password&&agent.type)){
    throw new Error("missing mendatory fields");
  }
  const url = getConfig().kommunicateApi.createUser;
  console.debug("creating agent :",agent, "url: ",url);
  return axios.post(url,agent).then(agent=>{
    console.debug("agent created successfully",agent);
    return agent;
  }).catch(err=>{
    let error = err.response&&err.response.data?err.response.data:err;
    return Promise.reject(error);
  });
}catch(err){
  let error = err.response&&err.reponse.data?err.reponse.data:err;
    return Promise.reject(error);
  };

}

const updatePassword =(options)=>{
  console.log("reset password",options);
  try{
    if(!options || !options.newPassword || !options.code){
      throw new Error("mandetory fields are missing");
    }
    const url = getConfig().kommunicateApi.passwordUpdateUrl;
    return axios.post(url,{newPassword:options.newPassword,code:options.code});
  }catch(err){
    return Promise.reject(err);
  }
}

const resetPassword= (options)=>{
  console.log("reset password",options);
  try{
    if(!options || !options.userName || !options.applicationId){
      throw new Error("mandetory fields are missing");
    }
    const url = getConfig().kommunicateApi.passwordResetUrl;
    return axios.post(url,{userName:options.userName,applicationId:options.applicationId});
  }catch(err){
    return Promise.reject(err);
  }
}

const checkUserInApplozic = ({header, data}) => {
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
        prev.push({category:curr.category, name:curr.name, content:curr.content})
        return prev;
      }, [])
      return autoSuggestions
    })
    .catch(err => {console.log("Error in getting auto suggestions")});
}

const getSuggestionsByAppId = (applicationId, type) => {

  const autoSuggestUrl = getConfig().kommunicateApi.autoSuggest + '/' + applicationId+'?type='+type

  return Promise.resolve(axios.get(autoSuggestUrl))
    .then(response => response.data.data)
    .then(autoSuggestions_data => {
      const autoSuggestions = autoSuggestions_data.reduce((prev, curr) => {
        prev.push({applicationId: curr.applicationId,id:curr.id, category:curr.category, name:curr.name, content:curr.content})
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

const signUpWithApplozic = (data)=>{
  const url = getConfig().kommunicateBaseUrl+"/customers/applozic";
  let user = {userId:data.userName,password:data.password,applicationId:data.applicationId};
  return axios.post(url,{userName:data.userName,password:data.password,applicationId:data.applicationId}).then(response=>{
    return response;
  });
}

const sendProfileImage = (imageFile, imageFileName) => {

  const profileImageUrl = getConfig().kommunicateApi.profileImage;

  console.log(imageFile)
  console.log(imageFileName)

  let data = new FormData()

  data.append('file', imageFile, imageFileName)

  return Promise.resolve(axios.post(profileImageUrl, data, {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  }))
  .then(response => {
        
    window.$applozic.fn.applozic('updateUser', {data: {'imageLink': response.data.profileImageUrl}, success: function(response) {
        console.log(response);
      }, error: function(error) {
        console.log(error);
      }
    });
    return response;
  });
}

const updateApplozicUser = (userInfo) => {
  let userSession = CommonUtils.getUserSession();
  const headers = {
    'Content-Type':'application/json',
    'Apz-AppId':userSession.application.applicationId,
    'Apz-Token': 'Basic ' + new Buffer(userSession.userName+':'+userSession.password).toString('base64'),
    'Apz-Product-App':'true',
    'Of-User-Id':   userSession.userName 
  }
  console.log(headers)

  console.log(userInfo)

  const updateApplozicUserUrl = getConfig().applozicPlugin.updateApplozicUser;

  return Promise.resolve(axios.post(updateApplozicUserUrl, userInfo, {
    headers: headers
  })).then(response => {console.log(response); 
    return response})

}

const getWelcomeMessge = (applicationId)=>{
  if (!applicationId){
    throw new Error("application Id is missing");
  }
  const url= getConfig().kommunicateBaseUrl+"/applications/"+applicationId+"/welcomemessage";
  return axios.get(url).then(response=>{
    if (response.data.code=='success'){
      return response.data.data.message;
    }
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
const getUsersByType = (applicationId,userType)=>{
  let url = getConfig().kommunicateBaseUrl+"/users?appId="+applicationId;
  if(userType){
    url+= "&type="+userType;
  }
  return axios.get(url).then(result=>{
    //loggo.info("got data from db",result!=null);
    return result.data?result.data.data:[];
  });
}

/*** 
 * this method will update the password
 * @param {Object} option
 * @param {Object} option.applicationId this is application id
 * 
*/
const changePassword =(option)=>{

  const patchClientUrl = getConfig().kommunicateBaseUrl+"/users/password/update";
  let userSession = CommonUtils.getUserSession();
  return Promise.resolve(axios({
    method: 'post',
    url: patchClientUrl,
    data: {
      "userName": userSession.userName,
      "applicationId": userSession.application.applicationId,
      "oldPassword": option.oldPassword,
      "newPassword": option.newPassword
    }

  })).then((response) => { 
    if(response.data.code === 'SUCCESS')
    {
      Notification.success('Password Changed Successfully');
      let userSession = CommonUtils.getUserSession();
      userSession.password = option.newPassword;
      CommonUtils.setUserSession(userSession);
      return "SUCCESS";
    } 
    else {
      Notification.success('Wrong current password');
    }
  })
  //.catch(err => { Notification.error(err.response.data.code || "Something went wrong!") });
  .catch(err => {console.log("Error in updating password")});

}

const goAway = (userId, appId) => {
  let url = getConfig().kommunicateBaseUrl+"/users/goAway/"+userId+"/"+appId;
  return Promise.resolve(axios.patch(url)).then(result => {
    console.log(result);
    CommonUtils.updateAvailabilityStatus(0);
  })
}

const goOnline = (userId, appId) => {
  let url = getConfig().kommunicateBaseUrl+"/users/goOnline/"+userId+"/"+appId;
  return Promise.resolve(axios.patch(url)).then(result => {
    console.log(result);
    CommonUtils.updateAvailabilityStatus(1);
  })
}

const createIssueType = (data) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl+"/issuetype/"+ userSession.userName+"/"+ userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: data
  })).then((response) => {
    return response
  }).catch(err => {console.log("Error in creating issue")})
}

const getIssueTypes = (data) => {

  let url = getConfig().kommunicateBaseUrl+"/issuetype";

  return axios.get(url).then(response => {
    console.log(response)
    if(response.data.code === 'GOT_ALL_ISSUE_TYPE'){
      return response.data.data
    }
  })
}

const getIssueTypeByCustIdAndCreatedBy = () => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl+"/issuetype/"+userSession.userName+"/"+ userSession.application.applicationId;

  return axios.get(url).then(response => {
    // console.log(response)
    if(response.data.code === 'GOT_ALL_ISSUE_TYPE'){
      return response.data.data
    }
  }).catch(err => {console.log("Error in getIssueTypeByCustIdAndCreatedBy", err)})
}

const addInAppMsg = (data) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/applications/"+userSession.userName+"/"+userSession.application.applicationId+"/createinappmsg";

  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: data
  })).then((response) => {
    return response
  }).catch(err => {console.log("Error in creating in app msg")})

}

const disableInAppMsgs = (obj) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl+"/applications/disableInAppMsgs/"+ userSession.userName+"/"+userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      category: obj.category
    }
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error in disableInAppMsgs", err)})

}

const enableInAppMsgs = (obj) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/applications/enableInAppMsgs/"+CommonUtils.getUserSession().userName+"/"+userSession.application.applicationId;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      category: obj.category
    }
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error in enableInAppMsgs", err)})

}

const getInAppMessages = () => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/applications/"+CommonUtils.getUserSession().userName+"/"+userSession.application.applicationId+"/getInAppMessages";

  return axios.get(url).then(response => {
    if(response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success"){
      if(response.data.data instanceof Array){
        return response.data.data
      }
    }
  }).catch(err => {console.log("Error in getInAppMessages", err)})
}

const getInAppMessagesByEventId = (eventIds) => {
  let userSession = CommonUtils.getUserSession();
  let userInfo = {
    userName: userSession.userName,
    customerId: userSession.customerId,
    appId: userSession.application.applicationId,
    eventIds: eventIds
  }
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

const deleteInAppMsg = (id) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/applications/"+id+"/deleteInAppMsg";

  return Promise.resolve(axios.patch(url)).then(response => {
    console.log(response)
    if(response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success"){
      if(response.data.data instanceof Array){
        return response.data.data
      }
    }
  }).catch(err => {console.log("Error in deleteInAppMsg", err)})
}

const editInAppMsg = (id, message) => {
  let url = getConfig().kommunicateBaseUrl+"/applications/editInAppMsg";

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
    data: {
      id: id,
      message: message
    }
  })).then(response => {
    console.log(response)
    if(response !== undefined && response.data !== undefined && response.status === 200 && response.data.code.toLowerCase() === "success"){
      if(response.data.data instanceof Array){
        return response.data.data
      }
    }
  }).catch(err => {console.log("Error editInAppMsg", err)})
}

const getIntegratedBots = () => {

  let userSession = CommonUtils.getUserSession();
  let appId = userSession.application.applicationId;

  // let url = "http://localhost:5454/bot/" + appId;
  let url = getConfig().applozicPlugin.addBotUrl + "/" + appId;

  return Promise.all([axios.get(url), getUsersByType(appId, 2)])
    .then( ([mongoBots, sqlBots])=> {
      let bots = []
      let dialogFlowBots = mongoBots.data.filter(bot=>{
        return (bot.aiPlatform && bot.aiPlatform.toLowerCase() === 'dialogflow');
      });
      for(let i= 0; i < sqlBots.length; i++){
        for(let j = 0; j < mongoBots.data.length; j++ ){
          if(sqlBots[i].name !== "bot" && sqlBots[i].name.toLowerCase() == mongoBots.data[j].name.toLowerCase()){
            let bot1 = sqlBots[i];
            let bot2 = mongoBots.data[j];
            bots[i] = {...bot1, ...bot2};
          }
        }
      }


      return {'allBots': bots, 'dialogFlowBots': dialogFlowBots};

    }).catch(err => {console.log(err)})

}
const enableNotifyEveryBody = (data) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/customers/"+userSession.application.applicationId+"/routing/"+data.routingState;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error while enable notify everybody", err)})
}
const enableAutomaticAssignment = (data) => {
  let userSession = CommonUtils.getUserSession();

  let url = getConfig().kommunicateBaseUrl+"/customers/"+userSession.application.applicationId+"/routing/"+data.routingState;

  return Promise.resolve(axios({
    method: 'patch',
    url: url,
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error while enable automatic assignemnt", err)})
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
  let url = getConfig().kommunicateBaseUrl+"/customers?applicationId="+userSession.application.applicationId;
  return Promise.resolve(axios({
    method: 'get',
    url: url,
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error while fetching customer by applicationId", err)})

}

const createAndUpdateThirdPArtyIntegration = (data,integrationType) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/integration/settings/" + userSession.application.applicationId + "/insert/" +integrationType;
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: data
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => { console.log("Error while submiting third party integration keys", err) })

}
const getThirdPartyListByApplicationId = () => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/integration/settings/" + userSession.application.applicationId
   return Promise.resolve(axios({
    method: 'get',
    url: url,
  })).then(result => {
    console.log(result);
    return result;
  }).catch(err => {console.log("Error while fetching third party integration by applicationId", err)})

}
const deleteThirdPartyByIntegrationType = (integrationType) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl +"/integration/settings/"+ userSession.application.applicationId + "/" +integrationType;
  return Promise.resolve(axios.delete(url))
    .then(response => response)
    .catch(err => err);
}
const getZendeskIntegrationTicket = (groupId) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/zendesk/" + userSession.application.applicationId + "/ticket/"+groupId
  return Promise.resolve(axios({
    method: 'GET',
    url: url,
    
  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while fetching zendesk ticket", err) })
}
const createZendeskIntegrationTicket = (data,groupId) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/zendesk/" + userSession.application.applicationId + "/ticket/"+groupId+"/create"
  return Promise.resolve(axios({
    method: 'POST',
    url: url,
    data: data
  })).then(result => {
    return result;
  }).catch(err => { console.log("Error while creating zendesk ticket", err) })
}

const updateConversation = (conversation) => {
  let userSession = CommonUtils.getUserSession();
  conversation.appId = userSession.application.applicationId
  let url = getConfig().kommunicateBaseUrl + "/conversations/update";
  return Promise.resolve(axios.patch(url, conversation)).then(response => {
    console.log(response);
    return response;
  }).catch(err => { console.log(err) });

}
const updateZendeskIntegrationTicket = (data,groupId) => {
  let userSession = CommonUtils.getUserSession();
  let url = getConfig().kommunicateBaseUrl + "/zendesk/"+ userSession.application.applicationId +"/ticket/"+ groupId +"/update"
  return Promise.resolve(axios({
    method: 'PUT',
    url: url,
    data: data
  })).then(result => {

    return result;
  }).catch(err => { console.log("Error while creating zendesk ticket", err) })


}

const getConversationStats = (isCustomer) => {
  let userSession = CommonUtils.getUserSession();
  let query = isCustomer ? 'customerId=' + userSession.customerId : 'agentId' + userSession.id;
  let url = getConfig().kommunicateBaseUrl + "/conversations?" + query;
  return Promise.resolve(axios.get(url)).then(response => {
    console.log('filter: ', response);
    return response;
  }).catch(err => {
    return;
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
  enableNotifyEveryBody,
  enableAutomaticAssignment,
  getSuggestionsByCriteria,
  getCustomerByApplicationId,
  createAndUpdateThirdPArtyIntegration,
  getThirdPartyListByApplicationId,
  deleteThirdPartyByIntegrationType,
  updateConversation,
  getZendeskIntegrationTicket,
  createZendeskIntegrationTicket,
  updateZendeskIntegrationTicket,
}
