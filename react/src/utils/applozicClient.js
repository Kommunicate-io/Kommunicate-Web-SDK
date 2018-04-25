import axios from 'axios';
import {getConfig} from '../config/config';

const ApplozicClient ={

    getUserInfoByEmail: (options)=>{
        let url = getConfig().applozicPlugin.applozicHosturl+"/rest/ws/user/data?email="+encodeURIComponent(options.email)+"&applicationId="+options.applicationId;
        return Promise.resolve(axios.get(url))
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

    },
   createKommunicateSupportUser:function(user){
    return Promise.resolve(axios.post(getConfig().applozicPlugin.applozicHosturl+"/rest/ws/register/client",user )).then(response=>{
        let err = {};
        console.log("Applozic server returned : ",response.status);
        if (response.status == 200) {
          if (response.data.message == "INVALID_PARAMETER") {
            console.log("INVALID_PARAMETER received from applozic Server");
            err.code = "INVALID_PARAMETER";
            throw err;
          } else if (response.data.message == "REGISTERED.WITHOUTREGISTRATIONID") {
            console.log("received status 200, user created successfully ");
            return response.data;
          } else if (response.data.message == "INVALID_APPLICATIONID") {
            console.log("invalid application Id");
            err.code = "NVALID_APPLICATIONID";
            throw err;
          } else if(response.data.message == "UPDATED"){
            console.log("user already exists in db userName : ", user.userName, "applicationId : ", user.applicationId);
            err.code = "USER_ALREADY_EXISTS";
            err.data = response.data;
            throw err;
          }else if(response.data.message == "PASSWORD_INVALID"){
            console.log("user already exists in db userName : ", user.userName, "applicationId : ", user.applicationId);
            err.code = "USER_ALREADY_EXISTS_PWD_INVALID";
            err.data = response.data;
            throw err;
          }
        } else {
          console.log("received error code  : ", response.status, "from applozic serevr");
          err.code = "APPLOZIC_ERROR";
          throw err;
        }
      }).catch(err=>{
        console.log(err);
        throw err;
      });
   }
}

export default ApplozicClient;