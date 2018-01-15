import axios from 'axios';
import {getConfig} from '../config/config';

const ApplozicClient ={

    getUserInfoByEmail: (options)=>{
        let url = getConfig().applozicPlugin.applozicHosturl+"rest/ws/user/data?email="+encodeURIComponent(options.email)+"&applicationId="+options.applicationId;
        return Promise.resolve(axios.get(url,{headers:{"Apz-AppId":options.applicationId,"Apz-Product-App":true,"Apz-Token":options.apzToken}}))
        .then(response=>{
            let status = response.data&&response.data.status;
            if(status=="success"){
             return response.data;
            }else if(status=="error" && response.data.errorResponse[0].errorCode=="AL-U-01"){
                return null;
            }else{
                console.log("error",response);
                throw new Error("error while fetching user deatil by email");
            }
        })

    }
}

export default ApplozicClient;