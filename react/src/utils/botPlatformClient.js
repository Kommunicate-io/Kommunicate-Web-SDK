
import axios from 'axios';
import {getBaseUrl} from '../config/config';

const botPlatformClient = {
    /**
     * call the bot platform and update status = disabled.
     * @param {String} key primary key in applozic user table
     */
    toggleMute: function(key,status){
        if(!key){
           return Promise.resolve({"code":"INVALID_REQUEST"});
        }
        let updateBotUrl = getBaseUrl().botPlatformAPI+"/bot/"+key+"/configure";
        return axios.post(updateBotUrl,{status:status}).then(data=>{
            return {code:"sucess"}
        })
    }
}
export default botPlatformClient;