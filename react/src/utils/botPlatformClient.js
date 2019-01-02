
import axios from 'axios';
import {getBaseUrl} from '../config/config';
import { getConfig } from '../config/config';

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
const createBot = (data) => {
    let url = getConfig().applozicPlugin.addBotUrl+"/"+data.id+'/configure'
    return axios({
        method: 'post',
        url: url,
        data:JSON.stringify(data.botInfo),
        headers: {"Content-Type": "application/json",}
    }).then(response => {
        if (response.status == 200) {
            return response
        }
    }).catch(err=>{
        console.log("bot create error", err)
        throw { message: err };
    })
}
export {
    botPlatformClient,
    createBot
}