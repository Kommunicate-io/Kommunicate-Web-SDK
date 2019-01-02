/**
 * this is a legacy code.
 * do not add any code here.
 */
import url from "./url";
import configuration from "./config-env";

const  env = process.env.REACT_APP_NODE_ENV || "development";
let config = configuration[env];
config["brand"] =  process.env.BRAND;
const commonResource = configuration['commonResources'];

function getEnvironmentId() {
  return env;
}
  const applozicBaseUrl = config.baseurl.applozicAPI;
  const kommunicateBaseUrl = config.baseurl.kommunicateAPI;
  const botPlatformAPI =config.baseurl.botPlatformAPI;
  const kmWebsiteUrl = config.kommunicateWebsiteUrl;
  const alWebsiteUrl = config.applozicWebsiteUrl;
  const serviceUrl = config.services.baseurl;
  const googleApiBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  config.homeUrl = applozicBaseUrl;
  config.kommunicateBaseUrl = kommunicateBaseUrl;
  config.baseurl.baseUrl = applozicBaseUrl;
  config.serviceUrl = serviceUrl;
  config.applozicPlugin = {
    "applozicHosturl": applozicBaseUrl,
    "baseUrl": kommunicateBaseUrl + url.kommunicateApi.PLUGIN_URL,
    "sendMessageUrl": applozicBaseUrl + url.applozic.SEND_MESSAGE,
    "sendMailUrl": applozicBaseUrl + url.applozic.SEND_MAIL,
    "userDetailUrl": applozicBaseUrl + url.applozic.USER_DETAILS,
    "certificateUpload": applozicBaseUrl + url.applozic.CIRTIFICATE_UPLOAD,
    "editAppModule": applozicBaseUrl + url.applozic.EDIT_APP_MODULE,
    "registerClientUrl": applozicBaseUrl + url.applozic.REGISTER_CLIENT,
    "addBotUrl":  botPlatformAPI+ url.botplateform.ADD_BOT_URL,
    "applicationList": applozicBaseUrl + url.applozic.APPLICATION_LIST,
    "statsFilterUrl": applozicBaseUrl + url.applozic.STATUS_FILTER,
    "devUrl": applozicBaseUrl + url.applozic.DEV_URL,
    "statsUrl": applozicBaseUrl + url.applozic.STATS,
    "autoreplyUrl": kommunicateBaseUrl + url.kommunicateApi.AUTO_REPLY,
    "getTimeZoneUrl": kommunicateBaseUrl + url.kommunicateApi.TIME_ZONE,
    "createApplozicUser": applozicBaseUrl + url.applozic.CREATE_APPLOZIC_USER,
    "updateApplozicUser": applozicBaseUrl + url.applozic.UPDATE_APPLOZIC_USER,
    "fetchContactsUrl": applozicBaseUrl + url.applozic.CONTACT_LIST_URL,
    "groupFeedUrl": applozicBaseUrl + url.applozic.GROUP_FEED_URL,
    "multipleGroupInfo": applozicBaseUrl + url.applozic.MULTIPLE_GROUP_INFO,
    "editApplication": applozicBaseUrl + url.applozic.EDIT_APPLICATION,
    "searchContact": applozicBaseUrl +url.applozic.SEARCH_USER
  };
  config.kommunicateApi = {
    "login": kommunicateBaseUrl + url.kommunicateApi.LOGIN,
    "signup": kommunicateBaseUrl + url.kommunicateApi.SIGN_UP,
    "passwordResetUrl": kommunicateBaseUrl + url.kommunicateApi.PASSWORD_RESET,
    "passwordUpdateUrl": kommunicateBaseUrl + url.kommunicateApi.PASSWORD_UPDATE,
    "pluginUrl": kommunicateBaseUrl + url.kommunicateApi.PLUGIN_URL,
    "pluginUrlV2": kommunicateBaseUrl + url.kommunicateApi.PLUGIN_URL_V2,
    "createUser": kommunicateBaseUrl + url.kommunicateApi.CREATE_USER,
    "logo": kommunicateBaseUrl + url.kommunicateApi.LOGO,
    "activateAccountUrl": config.kommunicateDashboardUrl + url.dashboard.ACTIVATE_ACCOUNT,
    "sendMail": kommunicateBaseUrl + url.kommunicateApi.SEND_MAIL,
    "signUpWithApplozic": kommunicateBaseUrl + url.kommunicateApi.SIGN_UP_APPLOZIC,
    "autoSuggest": kommunicateBaseUrl + url.kommunicateApi.AUTO_SUGGEST,
    "profileImage": kommunicateBaseUrl + url.kommunicateApi.PROFILE_IMAGE,
    "subscriptionCount": kommunicateBaseUrl + url.kommunicateApi.SUBSCRIPTION_COUNT
  };  
  config.kommunicateWebsiteUrls = {
    "kmConversationsTestUrl": kmWebsiteUrl + url.kommunicateWebsite.KM_WEBSITE_CONVERSATIONS_TEST
  }
  config.googleApi = {
    "googleApiUrl": googleApiBaseUrl + "?scope=profile%20email&access_type=offline&redirect_uri=" + kommunicateBaseUrl + "/google/authCode&response_type=code&client_id=660706316085-tt8berusqqdekmo22rdea2mc17bq17kp.apps.googleusercontent.com"
  }
  config.products = {
    kommunicate: {
      profitwell: '71e77c6a8d59f50233d1705120049bf1'
    },
    applozic: {
      profitwell: '5b142e85e62527dc4ac03b209c0223f1'
    }
  }

export function get(env) {
  return config;
}

export function getConfig() {
  return config;
}
export function getResource() {
  return config['resources'];
}
export function getBaseUrl() {
  return config.baseurl;
}

export function getCommonResource(){
  return commonResource;
}
let baseurl = config.baseurl;
export {
  baseurl,getEnvironmentId
};
//this is a legacy code.
// do not add any code here.
// see url.js and index.js