import { getEnvironmentId } from "../config/config";

export const KM_RELEASE_VERSION = "3.5"
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
    BOT : "3",
    DEVELOPER: "11"
}
export const ROLE_NAME = {
    //Todo: figure out why role is coming as null in some cases, below is a temp fix to avoid UI side issue due to server returning null for role
    null: {
        name: '',
        description: ''
    },
    0: {
        name: "Super Admin",
        description: "Have full access"
    },
    1: {
        name: "Admin",
        description: "Have full access to edit all the settings and features in the dashboard"
    },
    2: {
        name: "Agent",
        description: "Have access to only key features and information in the dashboard"
    },
    3: {
        name: "Bot",
        description: "Have access to read and respond to chats"
    },
    11: {
        name: "Developer",
        description: "Have access to edit all the settings and features in the dashboard"
    }
}
export const GROUP_ROLE = { 
    ADMIN: "1", 
    MODERATOR: "2", // Bot is MODERATOR in Group
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
    "KM_ID": "km_id",
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

export const CONVERSATION_STATUS = window.KOMMUNICATE_CONSTANTS.CONVERSATION_STATE
export const ACTIONABLE_MESSAGE_TEMPLATE = window.KOMMUNICATE_CONSTANTS.ACTIONABLE_MESSAGE_TEMPLATE

export const LOGIN_VIA = {
    GOOGLE: "google",
    DEFAULT: "email"
}
/* 
At the moment the only social service we're using for login is google, in future if we add 
other services please add below.
*/
export const THIRD_PARTY_LOGIN = [
    "google"
];

export const GROUP_TYPE = {
    VIRTUAL: 0, //1-1 Chat
    PRIVATE: 1,
    PUBLIC: 2,
    SELLER: 3,
    SELF: 4,
    BROADCAST: 5,
    OPEN: 6,
    GROUPOFTWO: 7,
    APPLOZIC_INTERNAL: 8,
    APPLICATION_LEVEL: 9,
    SUPPORT: 10,
    SKIP_DELIVERED_READ: 11,
    ANNOUNCEMENT_GROUP: 12
};

export const NOTICEABLE_CREDENTIALS = {
    /*
    // Below credentials are for kommunicate account
    // ACCESS_TOKEN: "nSoxbruxKBWyRDraIQND",
    // PROJECT_ID: "lwxQBJuL2eWfCJkZ6py0"
    */

    // Remove below code and uncomment above lines when noticeable widget implementation is completed.
    ACCESS_TOKEN: "HZtim7bdyESbHo1opoc4",
    PROJECT_ID: "9e7IrkNtr4EfHhBkp6Hg"
};
