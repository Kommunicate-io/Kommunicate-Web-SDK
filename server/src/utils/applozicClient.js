const config = require("../../conf/config");
const axios =require("axios");
const adminUserId = config.getProperties().kommunicateAdminId;
const adminPassword=config.getProperties().kommunicateAdminPassword;
const apzToken = config.getProperties().kommunicateAdminApzToken;
const constant =require('./constant');
const logger = require('./logger.js')

/*
this method register a user in applozic db with given parameters.
*/
const createApplozicClient = (userId,password,applicationId,gcmKey,role,email,displayName)=>{
  console.log("creating applozic user..url :",config.getProperties().urls.createApplozicClient,"with userId: ",userId,", password :",password,"applicationId",applicationId,"role",role,"email",email);

  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, {
    "userId": userId,
    "applicationId": applicationId,
    "password": password,
    "roleName": role,
    "authenticationTypeId": 1,
    "email":email,
    "displayName":displayName,
    "gcmKey":gcmKey,
    "chatNotificationMailSent":true,
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
      } else if(response.data.message == "UPDATED"){
        console.log("user already exists in db userName : ", userId, "applicationId : ", applicationId);
        err.code = "USER_ALREADY_EXISTS";
        err.data = response.data;
        throw err;
      }else if(response.data.message == "PASSWORD_INVALID"){
        console.log("user already exists in db userName : ", userId, "applicationId : ", applicationId);
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
};
const createApplozicClientV1 = (options)=>{
  console.log("creating applozic user..url :",config.getProperties().urls.createApplozicClient,"with userId: ",options.userId,"applicationId",options.applicationId,"role","email",options.email);
  options.authenticationTypeId = options.authenticationTypeId?options.authenticationTypeId:1;
  options.roleName = options.roleName?options.roleName:options.role;
  options.chatNotificationMailSent=true;
  options.userId =options.userName;
    return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient,options)).then(response=>{
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
          console.log("user already exists in db userName : ", options.userId, "applicationId : ", options.applicationId);
          err.code = "USER_ALREADY_EXISTS";
          err.data = response.data;
          throw err;
        }else if(response.data.message == "PASSWORD_INVALID"){
          console.log("user already exists in db userName : ", options.userId, "applicationId : ", options.applicationId);
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
exports.createApplozicClient =createApplozicClient;

exports.createUserInApplozic = (options)=>{

  return  Promise.resolve(createApplozicClientV1(options));

}


/*
this method create an application in applozic db.
*/
exports.createApplication = (adminUserId,adminPassword,applicationName)=>{
  console.log("going to call applozic url: ", config.getProperties().urls.createApplication, "applicationName:", applicationName);
  const apzToken = "Basic " + new Buffer(adminUserId + ":" + adminPassword).toString('base64');
  let applicationPxy = {
    name: applicationName,
    companyLogo: config.getCommonProperties().companyDetail.companyLogo,
    companyAddress: config.getCommonProperties().companyDetail.companyAddress,
    mailProviderPxy: config.getProperties().mailProvider,
    applicationWebhookPxys: config.getCommonProperties().applicationWebhooks,
    websiteUrl:config.getCommonProperties().companyDetail.websiteUrl,
  }
  
  return Promise.resolve(axios.post(config.getProperties().urls.createApplication, applicationPxy, {
        headers: {
          "Apz-Token": apzToken,
          "Content-Type": "application/json",
        },
      })).then(response=>{
        let err = {};
        if (response.status == 200) {
          console.log(" applozic response :",response.data);
          if (response.data.status != "error") {
            return response.data;
          } else {
            console.error("applozic error response : ", applicationName);
            err.code = "APPLICATION_ALREADY_EXISTS";
            throw err;
          }
        } else {
          console.error("received error code: ",response );
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
  const apzToken =  new Buffer(customer.userName+":"+customer.accessToken).toString('base64');
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
          console.log("get application API response :", response.data);
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

exports.applozicLogin =(userDetail)=>{
      //userName,password,applicationId,role,email
  //let data ={"userId": userDetail.userName, "applicationId": userDetail.applicationId,"password": userDetail.password,"authenticationTypeId": 1,"email":userDetail.email};
  userDetail.userId=userDetail.userName;
  userDetail.authenticationTypeId=userDetail.authenticationTypeId?userDetail.authenticationTypeId:1;

  if (userDetail.role){
    userDetail.roleName= userDetail.role;
  }
  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, userDetail))
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
/**
 * pass isBot = true if using bot headers.
 */
exports.getGroupInfo= (groupId,applicationId,apzToken, isBot)=>{
  let url = config.getProperties().urls.groupInfoUrl.replace(":groupId",groupId);
  console.log("getting group info from applozic url : ",url);
  console.log("applicationId", applicationId);
  let header ={};
  if(isBot){
    header ={"Application-Key": applicationId,    "Authorization":"Basic "+apzToken,   "Content-Type":"application/json"}
  }else{
    header = {"Apz-AppId": applicationId,"Apz-Token": "Basic "+apzToken,"Apz-Product-App": true, "Content-Type": "application/json"}
  }
  return Promise.resolve(axios.get(url,{headers: header})).then(response=>{
    console.log("got response from Applozic group Api. code :", response.status);
    if(response&&response.status==200&&response.data.status=="success") {
      return response.data.response;
    }else if(response&&response.status==200&&response.data.status=="error") {
      console.log("ERROR FROM APPLOZIC: ",response.data.errorResponse[0].description);
      return null;
    }
  }).catch(err=>{
    console.log("error while getting group info from Applozic" ,err);
    throw err;
  });
}

exports.sendGroupMessage = (groupId,message,apzToken,applicationId,metadata)=>{
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

/**
 * update the user in applozic.
 * @example applozicClient.updateApplozicClient("testUser","abcd","kommunicate-support",{"role:USER","name:"newUser"})
 * @param {String} userName - userName of user to be updated, used to generate the access token
 * @param {String} accessToken - access token of user, used to generate the access token 
 * @param {String}applicationId - application Id 
 * @param {Object}user - userObject you want to update
 * @param {String} user.userId
 * @param {Object} user.roleName
 * @param {Object} options extra parameters
 * @param {Object} options.apzToken has higher priority over userName and password.
 * @return {Object} object having property code.
 * @throws {Object} applozic err, network error
 */
exports.updateApplozicClient = (userName, accessToken,applicationId,user,options)=>{
  let apzToken = options&&options.apzToken?options.apzToken:new Buffer(userName+":"+accessToken).toString('base64');
  return axios.patch(config.getProperties().urls.applozicHostUrl+"/rest/ws/user/update?userId="+user.userId, user, {headers:{
    "Apz-Token":"Basic "+ apzToken,
    "Content-Type":"application/json",
    "Apz-AppId":applicationId,
    'Of-User-Id':user.userId,
    'Apz-Product-App': 'true'
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

exports.createSupportGroup = (groupInfo, headers)=>{
  console.log("calling applozic client to create group");
  let url = config.getProperties().urls.createGroup;
  return Promise.resolve(axios.post(url,groupInfo,{headers:headers})).then(result=>{
    if(result.data&&result.data.status ==="success"){
      return result.data.response;
    }else {
      throw {code:APPLOZIC_ERROR,data:response}
    }
   })
   .catch(err=>{
    console.log("error while updating user",err);
    throw err;
   });
}


exports.sendGroupMessageByBot = (groupId,message,authorization,applicationId,metadata)=>{
  let additionalMetadata = {skipBot:true};
  metadata = Object.assign(metadata,additionalMetadata);
  console.log("sending message to group ",groupId);
  console.log("calling send Message API with info , groupId: ",groupId,"message :",message,"applicationId",applicationId,"metadata",metadata );
  let url = config.getProperties().urls.sendMessageUrl;
  return Promise.resolve(axios.post(url,{"groupId": groupId,"message": message,"metadata": metadata},
  {headers: {"Application-Key": applicationId,"Authorization": "Basic "+authorization,"Content-Type":"application/json"}})).then(response=>{
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

exports.createGroup = (groupInfo, applicationId, appzToken) => {
  let url = config.getProperties().urls.createGroup;
  return Promise.resolve(axios.post(url, groupInfo, {
    headers: {
      "Content-Type": "application/json",
      "Apz-AppId": applicationId,
      'Apz-Token': "Basic " + apzToken
    }
  })).then(response => {
    console.log("received response from applozic", response.status);
    if (response.status == 200) {
      return response;
    } else {
      throw new Error("ERROR: received response from applozic" + response.status);
    }
  }).catch(err => {
    console.log("error while sending message ", err);
    throw err;
  });
}

exports.addMemberIntoConversation=(groupInfo, applicationId, apzToken, ofUserId)=>{
  let url = config.getProperties().urls.addMemberIntoConversation.replace(":role", constant.GROUP_ROLE.ADMIN);;
  return Promise.resolve(axios.post(url, groupInfo, {
    headers: {
      "Content-Type": "application/json",
      "Application-Key": applicationId,
      'Authorization': "Basic " + apzToken,
      'Of-User-Id':ofUserId,
      'Apz-Product-App':'true'
    }
  })).then(response => {
    console.log("received response from applozic", response.status);
    if (response.status == 200) {
      return response;
    } else {
      throw new Error("ERROR: received response from applozic" + response.status);
    }
  }).catch(err => {
    console.log("error while adding user into group", err);
    throw err;
  });
}

exports.updateApplication = (data) => {
  let apzToken = config.getProperties().kommunicateAdminApzToken
  let applicationId = config.getProperties().kommunicateParentKey
  let url = config.getProperties().urls.applozicHostUrl + '/rest/ws/application/update'
  return Promise.resolve(axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      "Apz-AppId": applicationId,
      'Apz-Token': "Basic " + apzToken
    }
  })).then(response => {
    console.log("received response from applozic", response.status);
  }).catch(err => {
    console.log('error  ', err)
  })
}

exports.getUserDetails = (userNameList,applicationId,apzToken) => {
  let url = config.getProperties().urls.getUserInfo
  logger.info("getting user info from applozic url : ", url);
  return Promise.resolve(axios.get(url,{data: {"userIdList" : userNameList}, headers: {"Apz-AppId": applicationId,"Apz-Token": "Basic "+apzToken,"Apz-Product-App": true}})).then(response=>{
    logger.info("got response from Applozic user info api :", response.status);
    if(response&&response.status==200&&response.data.status=="success") {
      return response.data.response;
    }else if(response&&response.status==200&&response.data.status=="error") {
      logger.error("ERROR FROM APPLOZIC while fetching user Detail: ",response.data.errorResponse[0].description);
      return null;
    }
  }).catch(err=>{
    console.log("error while getting user detail from Applozic" ,err);
    throw err;
  });

}

exports.updateGroup = (groupInfo, applicationId, apzToken, ofUserId) => {
  let url =
    config.getProperties().urls.applozicHostUrl + "/rest/ws/group/update";
  return Promise.resolve(
    axios.post(url, groupInfo, {
      headers: {
        "Content-Type": "application/json",
        "Application-Key": applicationId,
        "Authorization": "Basic " + apzToken,
        "Of-User-Id": ofUserId,
        "Apz-Product-App": "true"
      }
    })
  )
    .then(response => {
      console.log("received response from applozic", response.status);
      if (response.status == 200) {
        return response;
      }
    })
    .catch(err => {
      console.log("error while assign to user", err);
    });
};
