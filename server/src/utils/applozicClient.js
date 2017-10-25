const config = require("../../conf/config");
const axios =require("axios");
const adminUserId = config.getProperties().kommunicateAdminId;
const adminPassword=config.getProperties().kommunicateAdminPassword;
const apzToken = config.getProperties().kommunicateAdminApzToken;

/*
this method register a user in applozic db with given parameters.
*/
exports.createApplozicClient = (userId,password,applicationId,gcmKey,role)=>{
  console.log("creating applozic user..url :",config.getProperties().urls.createApplozicClient,"with userId: ",userId,", password :",password,"applicationId",applicationId,"role",role);

  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, {
    "userId": userId,
    "applicationId": applicationId,
    "password": password,
    "roleName": role,
    "authenticationTypeId": 1,
  })).then(response=>{
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
      } else {
        console.log("user already exists in db userName : ", userId, "applicationId : ", applicationId);
        err.code = "USER_ALREADY_EXISTS";
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
};


/*
this method create an application in applozic db.
*/
exports.createApplication = (adminUserId,adminPassword,applicationName)=>{
  console.log("going to call applozic url: ", config.getProperties().urls.createApplication, "applicationName:", applicationName);
  const apzToken = "Basic " + new Buffer(adminUserId + ":" + adminPassword).toString('base64');

  return Promise.resolve(axios.post(config.getProperties().urls.createApplication, {
        name: applicationName,
      }, {
        headers: {
          "Apz-Token": apzToken,
          "Content-Type": "application/json",
        },
      })).then(response=>{
        let err = {};
        if (response.status == 200) {
          if (response.data.status != "error") {
            console.log("applicationCreated SuccessFully..");
            return response.data;
          } else {
            console.error("application already exists with name : ", applicationName);
            err.code = "APPLICATION_ALREADY_EXISTS";
            throw err;
          }
        } else {
          console.error("received error code: ", response.status, " while creating application");
          err.code = "APPLOZIC_ERROR";
          throw err;
        }
      }).catch(err => {
        console.error("Exception : ", err);
        err.code = "INTERNAL_SERVER_ERROR";
        throw err;
      });
    };
/*
this method get the application detail for given applicationId
*/
exports.getApplication=(customer)=>{
  const applicationId = customer.applicationId;
  const getApplicationUrl = config.getProperties().urls.getApplicationDetail.replace(":applicationId", applicationId);
  const apzToken = customer.apzToken?customer.apzToken: new Buffer(customer.userName+":"+customer.accessToken).toString('base64');
  console.log("calling applozic.. url: ", getApplicationUrl, " apzToken: ", apzToken);
  let err = {};
  return Promise.resolve(axios.get(getApplicationUrl, {
      headers: {
        "Apz-Token": "Basic " + apzToken,
        "Content-Type": "application/json",
        "Apz-AppId": applicationId,
        "Apz-Product-App": true,
      },
    })).then(response=>{
      if (response.status == 200) {
        if (response.data != "error") {
          console.log("got application detail..status code :", response.status);
          return response.data;
        } else {
          console.log("application not exists with Id :", applicationId);
          err.code = "APPLICATION_NOT_EXISTS";
          throw err;
        }
      } else{
        err.code = "APPLOZIC_ERROR";
        throw err;
      }
    }).catch(err=>{
      if (err.response&&err.response.status==401) {
        console.log("INVALID UserName or password : response received from server :", err.response.status);
        err.code = "INVALID_CREDENTIALS";
      }
        throw err;
    });
  };

exports.applozicLogin =(userName,password,applicationId,role)=>{
  let data ={"userId": userName, "applicationId": applicationId,"password": password,"authenticationTypeId": 1};
  if (role){
    data.role= role;
  }
  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, data))
  .then(response=>{
    let err={};
    if(response.status==200) {
      if(response.data.message =="INVALID_PARAMETER") {
        console.log("INVALID_PARAMETER received from applozic Server");
        err.code="INVALID_PARAMETER";
        err.data=response.data;
        throw err;
      }else if(response.data.message=="REGISTERED.WITHOUTREGISTRATIONID" || response.data.message=="UPDATED") {
        console.log("user logged Insuccessfully ");
        return response.data;
      }else if(response.data.message=="INVALID_APPLICATIONID") {
        console.log("invalid application Id");
         err.code = "INVALID_APPLICATION_ID";
         err.data =response.data;
         throw err;
      }else if(response.data.message=="PASSWORD_INVALID") {
        console.log("invalid Password ",response.data);
        err.code="INVALID_CREDENTIALS";
        err.data=response.data;
        throw err;
      }
    }else{
      console.log("received error code  : ",response.status,"from applozic serevr");
       err.code = "APPLOZIC_ERROR";
       err.httpStatus = response.status;
      throw err;
    }
  }).catch(err=>{
    console.log("errror innside catch: ",err.response);
    throw err;
  });
};

exports.getGroupInfo= (groupId,applicationId,apzToken)=>{
  let url = config.getProperties().urls.groupInfoUrl.replace(":groupId",groupId);
  console.log("getting group info from applozic url : ",url);
  console.log("applicationId", applicationId);
  return Promise.resolve(axios.get(url,{headers: {"Apz-AppId": applicationId,"Apz-Token": "Basic "+apzToken,"Apz-Product-App": true}})).then(response=>{
    console.log("got response from Applozic group Api. code :", response.status);
    if(response&&response.status==200&&response.data.status=="success") {
      return response.data.response;
    }else if(response&&response.status==200&&response.data.status=="error") {
      console.log("ERROR FROM APPLOZIC: ",esponse.data.errorResponse.description);
      return null;
    }
  }).catch(err=>{
    console.log("error while getting group info from Applozic" ,err);
    throw err;
  });
};

exports.sendGroupMessage = (groupId,message,apzToken,applicationId,user_name,metadata)=>{
  console.log("sending message to group ",groupId);
  console.log("calling send Message API with info , groupId: ",groupId,"message :",message,":apz-token:",apzToken,"applicationId",applicationId,"metadata",metadata );
  let url = config.getProperties().urls.sendMessageUrl;
  return Promise.resolve(axios.post(url,{"groupId": groupId,"message": message,"metadata": metadata},
  {headers: {"Apz-AppId": applicationId,"Apz-Token": "Basic "+apzToken,"Apz-Product-App": true}})).then(response=>{
    console.log("received response from applozic", response.status);
    if(response.status==200) {
      return response;
    }else{
      throw new Error("ERROR: received response from applozic" +response.status);
    }
  }).catch(err=>{
    console.log("error while sending message ",err);
    throw err;
  });
};

exports.updatePassword = (options)=>{
  console.log("calling Applozic for update password with options: ",options);
  const url =config.getProperties().urls.passwordResetUrl.replace(":oldPassword",options.oldPassword).replace(":newPassword",options.newPassword);
  const  apzToken = "Basic "+new Buffer(options.userName+":"+options.oldPassword).toString('base64');
  return axios.get(url,{headers:{"Apz-AppId":options.applicationId,"Apz-Product-App":true,"Apz-Token":apzToken}}).then(response=>{
    if(response.data&&response.data.status=="success"){
      console.log("password upadted for user :",options.userName);
      return{code:"success"}
    }else{
      throw {code:"APPLOZIC_ERROR"}
    }
  });
}

// update user 
exports.updateApplozicClient = (userName, accessToken,applicationId,user)=>{
  return axios.post(config.getProperties().urls.applozicHostUrl+"/rest/ws/user/v2/update",user,{headers:{
    "Apz-Token":"Basic "+ new Buffer(userName+":"+accessToken).toString('base64'),
    "Content-Type":"application/json",
    "Apz-AppId":applicationId,
    "Apz-Product-App":true
   }})
   .then(response=>{
    if(response.data&&response.data.status ==="success"){
      return {code:"success"};
    }else {
      throw {code:APPLOZIC_ERROR,data:response}
    }
   })
   .catch(err=>{
    console.log("error while updating user",err);
    throw err;
   })
}