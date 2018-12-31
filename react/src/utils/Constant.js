import { getEnvironmentId } from "../config/config";

export const FALLBACK_TYPE = {
    MESSAGE_FORWARDING: 0,
    UNDELIVERED_MESSAGE: 1,
    UNREAD_MESSAGE: 2,
    UNANSWERED_MESSAGE: 3
}

export const NOTIFY_VIA = {
    NONE: -1, 
    MAIL: 0, 
    SMS: 1, 
    BOTH: 2
}

export const USER_TYPE = {
    AGENT: 1,
    BOT: 2,
    ADMIN: 3
}
export const USER_STATUS = {
    AWAY:0,
    ONLINE:1,
    EXPIRED:2,
    DELETED:3
}
export const ROLE_TYPE = {
    SUPER_ADMIN : "0",
    ADMIN : "1",
    AGENT : "2",
    BOT : "3"
}
export const GROUP_ROLE = { 
    ADMIN: "1", 
    MODERATOR: "2", 
    MEMBER: "3" 
};
export const DEFAULT_BOT={
    userName:"bot"
}
export const LIZ={
    userName:"liz"
}
export const INVITED_USER_STATUS = {
    INVITED:0,
    SIGNED_UP:1
}
export const ROUTING_RULES_FOR_AGENTS = {
    NOTIFY_EVERYBODY : 0 ,
    AUTOMATIC_ASSIGNMENT : 1
}

export let  getLoggedInCookieName =function(){
    return getEnvironmentId()+"_km_l_u_id";
}
export const COOKIES = {
    "KM_ID": "kommunicate-id",
    "KM_LOGGEDIN_USER_ID": getLoggedInCookieName()
}

export const CONVERSATION_STATS_FILTER_KEY = {
    HOUR_WISE_DISTRIBUTION : 1,
    DAY_WISE_DISTRIBUTION : 2
   
}
export const SUPPORTED_PLATFORM = {
    DIALOGFLOW:"dialogflow",
    CUSTOM:"custom"
}
export const  DEFAULT_BOT_IMAGE_URL = "https://applozicbucket.s3.amazonaws.com/APPLOZIC/APP/prod_website/kommunicate-support/_Attachment/6aebebe0a00f9fe634e3df9ac0f8a7448b0513ad_Bot%20DP.png";

export const MEMORY_CACHING_TIME_DURATION = 120000  //2 mins in Millisec


