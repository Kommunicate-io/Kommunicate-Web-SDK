var baseurl ={
  prod : {
   baseUrl: "https://chat.kommunicate.io",
   kommunicateAPI: "https://api.kommunicate.io"
  },
  dashboard : {
   baseUrl: "https://dashboard.applozic.com",
   kommunicateAPI: "https://api.kommunicate.io"
  },
  test:{
   baseUrl: "https://apps-test.applozic.com",
   kommunicateAPI: "https://api-test.kommunicate.io"
  },
  default:{
   baseUrl: "https://apps-test.applozic.com",
   // kommunicateAPI: "http://localhost:3999"
   kommunicateAPI: "https://api-test.kommunicate.io"
  }
}
var config = {
  prod: {
      homeUrl:baseurl.prod.baseUrl,
      kommunicateBaseUrl : baseurl.prod.kommunicateAPI,
      applozicPlugin:{
      applozicHosturl:baseurl.prod.baseUrl,
      baseUrl:baseurl.prod.baseUrl+"/kommunicate.app",
      sendMessageUrl:baseurl.prod.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.prod.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.prod.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.prod.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'http://dashboard-test.applozic.com:5454/bot',
      applicationList:baseurl.prod.baseUrl+'/rest/ws/user/getlist?userId=:userId&roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:baseurl.prod.baseUrl+"/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.prod.baseUrl+"/rest/ws/invite/dev",
      statsUrl:baseurl.prod.baseUrl+'/rest/ws/stats/get?appKey=:appKey',
      autoreplyUrl:'https://api.kommunicate.io/users/',
      getTimeZoneUrl:'https://api.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.prod.baseUrl+"/rest/ws/user/v2/create",
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },kommunicateApi:{
      login:baseurl.prod.kommunicateAPI+"/login",
      signup:baseurl.prod.kommunicateAPI+"/customers",
      passwordResetUrl:baseurl.prod.kommunicateAPI+"/users/password-reset",
      passwordUpdateUrl:baseurl.prod.kommunicateAPI+"/users/password-update",
      pluginUrl:baseurl.prod.kommunicateAPI+"/kommunicate.app",
      createUser:baseurl.prod.kommunicateAPI+"/users",
      logo:baseurl.prod.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.prod.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.prod.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.prod.kommunicateAPI+"/autoSuggest",
      profileImage:baseurl.prod.kommunicateAPI+"/profileImage"
    },
    port:5454
  },
  dashboard:{
    homeUrl:baseurl.dashboard.baseUrl,
    kommunicateBaseUrl : baseurl.dashboard.kommunicateAPI,
     applozicPlugin:{
      applozicHosturl:baseurl.dashboard.baseUrl,
      baseUrl:baseurl.dashboard.baseUrl+"/kommunicate.app",
      sendMessageUrl:baseurl.dashboard.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.dashboard.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.dashboard.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.dashboard.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots-test.applozic.com/bot',
      applicationList:baseurl.dashboard.baseUrl+'/rest/ws/user/getlist?userId=:userId&roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:baseurl.dashboard.baseUrl+"/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.dashboard.baseUrl+"/rest/ws/invite/dev",
      statsUrl:baseurl.dashboard.baseUrl+'/rest/ws/stats/get?appKey=:appKey',
      autoreplyUrl:'http://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'http://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.dashboard.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },kommunicateApi:{
      login:"https://api.kommunicate.io/login",
      signup:"https://api.kommunicate.io/customers",
      passwordResetUrl:"https://api.kommunicate.io/users/password-reset",
      passwordUpdateUrl:"https://api.kommunicate.io/users/password-update",
      pluginUrl:"https://api.kommunicate.io/kommunicate.app",
      createUser:baseurl.dashboard.kommunicateAPI+"/users",
      logo:baseurl.dashboard.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.dashboard.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.dashboard.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.dashboard.kommunicateAPI+"/autoSuggest",
      profileImage:baseurl.dashboard.kommunicateAPI+"/profileImage"
    },
    port:5454
  },
  test:{
     homeUrl:baseurl.test.baseUrl,
     kommunicateBaseUrl : baseurl.test.kommunicateAPI,
     applozicPlugin:{
      applozicHosturl:"https://apps-test.applozic.com/",
      baseUrl:"https://apps-test.applozic.com/kommunicate.app",
      sendMessageUrl:baseurl.test.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.test.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.test.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.test.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots-test.applozic.com/bot',
      statsUrl:'https://apps-test.applozic.com/rest/ws/stats/get?appKey=:appKey',
      applicationList:baseurl.test.baseUrl+'/rest/ws/user/getlist?userId=:userId&roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:"https://apps-test.applozic.com/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.test.baseUrl+"/rest/ws/v2/invite/dev",
      autoreplyUrl:'https://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'https://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.test.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },kommunicateApi:{
      login:"https://api-test.kommunicate.io/login",
      signup:"https://api-test.kommunicate.io/customers",
      passwordResetUrl:"https://api-test.kommunicate.io/users/password-reset",
      passwordUpdateUrl:"https://api-test.kommunicate.io/users/password-update",
      pluginUrl:"https://api-test.kommunicate.io/kommunicate.app",
      createUser:baseurl.test.kommunicateAPI+"/users",
      logo:baseurl.test.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard-test.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.test.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.test.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.test.kommunicateAPI+"/autoSuggest",
      profileImage:baseurl.test.kommunicateAPI+"/profileImage"
    },
    port:5454

  },
  development: {
    homeUrl:baseurl.default.baseUrl,
    kommunicateBaseUrl : baseurl.default.kommunicateAPI,
    applozicPlugin:{
      applozicHosturl:"https://apps-test.applozic.com/",
      baseUrl:"http://api-test.kommunicate.io/kommunicate.app",
      sendMessageUrl:baseurl.default.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl: "https://apps-test.applozic.com/applozic/rest/ws/mail/send",
      userDetailUrl:baseurl.default.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.default.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'http://dashboard-test.applozic.com:5454/bot',
      statsUrl:'https://apps-test.applozic.com/rest/ws/stats/get?appKey=:appKey',
      applicationList:baseurl.default.baseUrl+'/rest/ws/user/getlist?userId=:userId&roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:"https://apps-test.applozic.com/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.default.baseUrl+"/rest/ws/v2/invite/dev",
      autoreplyUrl:'https://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'https://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },
    kommunicateApi:{
      login:baseurl.default.kommunicateAPI+"/login",
      signup:baseurl.default.kommunicateAPI+"/customers",
      passwordResetUrl:baseurl.default.kommunicateAPI+"/users/password-reset",
      passwordUpdateUrl:baseurl.default.kommunicateAPI+"/users/password-update",
      pluginUrl:baseurl.default.kommunicateAPI+"/kommunicate.app",
      signUpWithApplozic:baseurl.default.kommunicateAPI+"/signUpWithApplozic",
      createUser:baseurl.default.kommunicateAPI+"/users",
      logo:baseurl.default.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:baseurl.default.kommunicateAPI+"/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.default.kommunicateAPI+"/misc/mail",
      autoSuggest :baseurl.default.kommunicateAPI+"/autoSuggest",
      profileImage:baseurl.default.kommunicateAPI+"/profileImage"
    },
    port:5454
  }
}

export function get(env) {
  return config[env] || config.development;
}
  export function getEnvironmentId() {
return process.env.REACT_APP_NODE_ENV || "development";
}
export function getConfig() {
  var env =process.env.REACT_APP_NODE_ENV;
 return config[env] || config.development;
}

export {baseurl};
