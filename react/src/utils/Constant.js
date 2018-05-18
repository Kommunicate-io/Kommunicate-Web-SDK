import { getEnvironmentId } from "../config/config";

export{
    USER_TYPE,
    COOKIES
}

const USER_TYPE = {
    AGENT: 1,
    BOT: 2,
    ADMIN: 3
}
let  getLoggedInCookieName =function(){
    return getEnvironmentId()+"_km_l_u_id";
}
const COOKIES = {
    "KM_ID": "kommunicate-id",
    "KM_LOGGEDIN_USER_ID": getLoggedInCookieName()
}
