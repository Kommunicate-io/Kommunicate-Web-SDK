import { getEnvironmentId } from "../config/config";

export{
    USER_TYPE,
    COOKIES,
    GROUP_ROLE,
    DEFAULT_BOT,
    LIZ,
    ROLE_TYPE,
    INVITED_USER_STATUS,
    USER_STATUS,
}

const USER_TYPE = {
    AGENT: 1,
    BOT: 2,
    ADMIN: 3
}
const USER_STATUS = {
    AWAY:0,
    ONLINE:1,
    EXPIRED:2,
    DELETED:3
}
const ROLE_TYPE = {
    SUPER_ADMIN : "0",
    ADMIN : "1",
    AGENT : "2",
    BOT : "3"
}
const GROUP_ROLE = { 
    ADMIN: "1", 
    MODERATOR: "2", 
    MEMBER: "3" 
};
const DEFAULT_BOT={
    userName:"bot"
}
const LIZ={
    userName:"liz"
}
const INVITED_USER_STATUS = {
    INVITED:0,
    SIGNED_UP:1
}
let  getLoggedInCookieName =function(){
    return getEnvironmentId()+"_km_l_u_id";
}
const COOKIES = {
    "KM_ID": "kommunicate-id",
    "KM_LOGGEDIN_USER_ID": getLoggedInCookieName()
}

export const CONVERSATION_STATS_FILTER_KEY = {
    HOUR_WISE_DISTRIBUTION : 1,
    DAY_WISE_DISTRIBUTION : 2
   
}

export const MEMORY_CACHING_TIME_DURATION = 120000  //2 mins in Millisec


