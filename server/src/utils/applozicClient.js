const config = require("../../conf/config");
const axios = require("axios");
const adminUserId = config.getProperties().kommunicateAdminId;
const adminPassword = config.getProperties().kommunicateAdminPassword;
const apzToken = config.getProperties().kommunicateAdminApzToken;
const constant = require('./constant');
const logger = require('./logger.js');
const APP_LIST_URL = config.getProperties().urls.baseUrl + "/rest/ws/user/getlist/v2.1?";
const utils = require("./utils");
const { EMAIL_NOTIFY } = require('../users/constants');
const { APPLOZIC_USER_ROLE_TYPE } = require("../users/constants.js");

/*
this method register a user in applozic db with given parameters.
*/
const createApplozicClient = (userId, password, applicationId, gcmKey, role, email, displayName, notifyState, imageLink) => {
  console.log("creating applozic user..url :", config.getProperties().urls.createApplozicClient, "with userId: ", userId, ", password :", password, "applicationId", applicationId, "role", role, "email", email);
  notifyState = typeof notifyState != "undefined" ? notifyState : EMAIL_NOTIFY.ONLY_ASSIGNED_CONVERSATION;
  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, {
    "userId": userId ? userId.toLowerCase() : "",
    "applicationId": applicationId,
    "password": password,
    "roleName": role,
    "authenticationTypeId": 1,
    "email": email,
    "displayName": displayName,
    "gcmKey": gcmKey,
    "state": notifyState,
    "imageLink": imageLink
  })).then(response => {
    let err = {};
    console.log("Applozic server returned : ", response.status);
    if (response.status == 200) {
      if (response.data.message == "INVALID_PARAMETER") {
        console.log("INVALID_PARAMETER received from applozic Server");
        err.code = "INVALID_PARAMETER";
        throw err;
      } else if (response.data.message == "REGISTERED.WITHOUTREGISTRATIONID") {
        console.log("received status 200, user created successfully ");
        return response.data;
      } else if (response.data.message == "INVALID_APPLICATIONID") {
        console.log("invalid application Id ", applicationId);
        err.code = "NVALID_APPLICATIONID";
        throw err;
      } else if (response.data.message == "UPDATED") {
        console.log("user already exists in db userName : ", userId, "applicationId : ", applicationId);
        err.code = "USER_ALREADY_EXISTS";
        err.data = response.data;
        throw err;
      } else if (response.data.message == "PASSWORD_INVALID") {
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
  }).catch(err => {
    console.log(err);
    throw err;
  });
};
const createApplozicClientV1 = (options) => {
  console.log("creating applozic user..url :", config.getProperties().urls.createApplozicClient, "with userId: ", options.userId, "applicationId", options.applicationId, "role", "email", options.email);
  options.authenticationTypeId = options.authenticationTypeId ? options.authenticationTypeId : 1;
  options.roleName = options.roleName ? options.roleName : options.role;
  options.chatNotificationMailSent = true;
  options.userId = options.userName ? options.userName.toLowerCase() : "";
  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, options)).then(response => {
    let err = {};
    console.log("Applozic server returned : ", response.status);
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
      } else if (response.data.message == "UPDATED") {
        console.log("user already exists in db userName : ", options.userId, "applicationId : ", options.applicationId);
        err.code = "USER_ALREADY_EXISTS";
        err.data = response.data;
        throw err;
      } else if (response.data.message == "PASSWORD_INVALID") {
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
  }).catch(err => {
    console.log(err);
    throw err;
  });

}
exports.createApplozicClient = createApplozicClient;

exports.createUserInApplozic = (options) => {

  return Promise.resolve(createApplozicClientV1(options));

}

exports.register = (userId, password, captcha) => {
 return Promise.resolve(axios({
      method: 'post',
      url: config.getProperties().urls.applozicHostUrl + "/rest/ws/register/v2/admin",
      data: "userName=" + encodeURIComponent(userId) + "&email=" + encodeURIComponent(userId) + "&password=" + encodeURIComponent(password) + "&companyName=", // + "&g-recaptcha-response=" + captcha,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded' 
      }
  })).then(function (response) {
      if (response.status === 200 && response.data !== undefined) {
          return response;
      }

      if (response.status === 404 && response.data !== undefined) {
          return response;
      }
  }).catch(err => {
    console.error("Exception : ", err);
    err.code = "INTERNAL_SERVER_ERROR";
    throw err;
  });;
},

exports.getApplications = (userName, password) => {
  console.log("calling applicatin/list api");
  const apzToken = "Basic " + new Buffer(userName + ":" + password).toString('base64');
  return Promise.resolve(axios({
       method: 'get',
       url: config.getProperties().urls.applozicHostUrl + "/rest/ws/application/list",
       data: "&emailId=" + encodeURIComponent(userName),
       headers: {
        "Apz-Token": apzToken
      }
   })).then(function (response) {
       if (response.status === 200 && response.data !== undefined) {
           return response.data;
       }
 
       if (response.status === 404 && response.data !== undefined) {
           console.log(response)
           return response.data;
       }
   }).catch(err => {
     console.log(err);
     console.error("Exception : ", err);
     err.code = "INTERNAL_SERVER_ERROR";
     throw err;
   });;
 },


/*
this method create an application in applozic db.
*/
exports.createApplication = (adminUserId, adminPassword, applicationName, pricingPackage) => {
  console.log("going to call applozic url: ", config.getProperties().urls.createApplication, "applicationName:", applicationName);
  const apzToken = "Basic " + new Buffer(adminUserId + ":" + adminPassword).toString('base64');
  console.log("apzToken: " + apzToken);
  let applicationPxy = {
    name: applicationName,
    companyLogo: config.getCommonProperties().companyDetail.companyLogo,
    companyAddress: config.getCommonProperties().companyDetail.companyAddress,
    mailProviderPxy: config.getProperties().mailProvider,
    applicationWebhookPxys: config.getCommonProperties().applicationWebhooks,
    websiteUrl: config.getCommonProperties().companyDetail.websiteUrl,
    pricingPackage: pricingPackage || 101
  }

  return Promise.resolve(axios.post(config.getProperties().urls.createApplication, applicationPxy, {
    headers: {
      "Apz-Token": apzToken,
      "Content-Type": "application/json",
    },
  })).then(response => {
    let err = {};
    if (response.status == 200) {
      console.log(" applozic response :", response.data);
      if (response.data.status != "error") {
        if(response.data.pricingPackage == 0 || response.data.pricingPackage == -1) {
          updateApplication({applicationId: response.data.applicationId, pricingPackage: 101})
          response.data.pricingPackage=101;
        }
        return response.data;
      } else {
        console.error("applozic error response : ", applicationName);
        err.code = "APPLICATION_ALREADY_EXISTS";
        throw err;
      }
    } else {
      console.error("received error code: ", response);
      err.code = "APPLOZIC_ERROR";
      throw err;
    }
  }).catch(err => {
    console.error("Exception : ", err);
    err.code = "INTERNAL_SERVER_ERROR";
    throw err;
  });
};

exports.findApplications = (email) => {
  let param = utils.isValidEmail(email) ? "emailId" : "userId";
  let GET_APP_LIST_URL = APP_LIST_URL + param + "=" + encodeURIComponent(email)
  return axios.get(GET_APP_LIST_URL)
    .then(function (response) {
      if (response.status = 200 && response.data !== "Invalid userId or EmailId") {
        return response.data;
      }
      return "error";
    }
    ).catch(err => {
      logger.info(err);
      return "error";
    });
}

/*
this method get the application detail for given applicationId
*/
exports.getApplication = (customer, isApplicationWebAdmin) => {
  const applicationId = customer.applicationId;
  const getApplicationUrl = config.getProperties().urls.getApplicationDetail.replace(":applicationId", applicationId);
  const apzToken = new Buffer(customer.userName + ":" + customer.accessToken).toString('base64');
  console.log("calling applozic.. url: ", getApplicationUrl, " apzToken: ", apzToken);
  isApplicationWebAdmin =isApplicationWebAdmin||false;
  let err = {};
  return Promise.resolve(axios.get(getApplicationUrl, {
    headers: {
      "Apz-Token": "Basic " + apzToken,
      "Content-Type": "application/json",
      "Apz-AppId": applicationId,
      "Apz-Product-App": isApplicationWebAdmin,
    },
  })).then(response => {
    if (response.status == 200) {
      if (response.data != "error") {
        console.log("got application detail..status code :", response.status);
        return response.data;
      } else {
        console.log("get application API response :", response.data);
        err.code = "APPLICATION_NOT_EXISTS";
        throw err;
      }
    } else {
      err.code = "APPLOZIC_ERROR";
      throw err;
    }
  }).catch(err => {
    if (err.response && err.response.status == 401) {
      console.log("INVALID UserName or password : response received from server :", err.response.status);
      err.code = "INVALID_CREDENTIALS";
    }
    throw err;
  });
};

exports.applozicLogin = (userDetail) => {
  //userName,password,applicationId,role,email
  //let data ={"userId": userDetail.userName, "applicationId": userDetail.applicationId,"password": userDetail.password,"authenticationTypeId": 1,"email":userDetail.email};
  userDetail.userId = userDetail.userName ? userDetail.userName.toLowerCase() : "";
  userDetail.authenticationTypeId = userDetail.authenticationTypeId ? userDetail.authenticationTypeId : 1;
  if (userDetail.role) {
    userDetail.roleName = userDetail.role;
  }
  return Promise.resolve(axios.post(config.getProperties().urls.createApplozicClient, userDetail))
    .then(response => {
      let err = {};
      if (response.status == 200) {
        if (response.data.message == "INVALID_PARAMETER") {
          console.log("INVALID_PARAMETER received from applozic Server");
          err.code = "INVALID_PARAMETER";
          err.data = response.data;
          throw err;
        } else if (response.data.message == "REGISTERED.WITHOUTREGISTRATIONID" || response.data.message == "UPDATED") {
          console.log("user logged Insuccessfully ");
          return response.data;
        } else if (response.data.message == "INVALID_APPLICATIONID") {
          console.log("invalid application Id");
          err.code = "INVALID_APPLICATION_ID";
          err.data = response.data;
          throw err;
        } else if (response.data.message == "PASSWORD_INVALID") {
          console.log("invalid Password ", response.data);
          err.code = "INVALID_CREDENTIALS";
          err.data = response.data;
          throw err;
        }
      } else {
        console.log("received error code  : ", response.status, "from applozic serevr");
        err.code = "APPLOZIC_ERROR";
        err.httpStatus = response.status;
        throw err;
      }
    }).catch(err => {
      console.log("errror inside catch: ", err.response);
      throw err;
    });
};
/**
 * pass isBot = true if using bot headers.
 */
exports.getGroupInfo = (groupId, applicationId, apzToken, isBot) => {
  let url = config.getProperties().urls.groupInfoUrl.replace(":groupId", groupId);
  console.log("getting group info from applozic url : ", url);
  console.log("applicationId", applicationId);
  let header = {};
  if (isBot) {
    header = { "Application-Key": applicationId, "Authorization": "Basic " + apzToken, "Content-Type": "application/json" }
  } else {
    header = { "Apz-AppId": applicationId, "Apz-Token": "Basic " + apzToken, "Apz-Product-App": true, "Content-Type": "application/json" }
  }
  return Promise.resolve(axios.get(url, { headers: header })).then(response => {
    console.log("got response from Applozic group Api. code :", response.status);
    if (response && response.status == 200 && response.data.status == "success") {
      return response.data.response;
    } else if (response && response.status == 200 && response.data.status == "error") {
      console.log("ERROR FROM APPLOZIC: ", response.data.errorResponse[0].description);
      return null;
    }
  }).catch(err => {
    console.log("error while getting group info from Applozic", err);
    throw err;
  });
}

const sendGroupMessage = (groupId, message, apzToken, applicationId, metadata, headers) => {
  message = typeof message == "object" ? message : { "groupId": groupId, "message": message, "metadata": metadata }
  headers = headers ? headers : { "Apz-AppId": applicationId, "Apz-Token": "Basic " + apzToken, "Apz-Product-App": true }
  console.log("calling send Message API with info message", message, "headerd: ", headers);
  return sendGroupMessagePxy(message, headers).catch(err=>{
    throw err;
  })
};

const sendGroupMessagePxy = (messagePxy, headers) => {
  let url = config.getProperties().urls.sendMessageUrl;
  return Promise.resolve(axios.post(url, messagePxy,
    { headers: headers })).then(response => {
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

exports.updatePassword = (options) => {
  //Todo: check if the same email is registered as Admin in Applozic for the same applicationId then update Applozic password for it.

  console.log("calling Applozic for update password with options: ", options);
  const url = config.getProperties().urls.passwordResetUrl;
  const apzToken = "Basic " + new Buffer(options.userName + ":" + options.oldPassword).toString('base64');
  const params = {
    "oldPassword": options.oldPassword,
    "newPassword": options.newPassword
  };
  let headers = { 
    "Apz-AppId": options.applicationId, 
    "Apz-Product-App": true, 
    "Apz-Token": apzToken ,
    "Content-Type":"application/x-www-form-urlencoded"
  };
  return axios.get(url, { params: params, headers: headers}).then(response => {
    if (response.data && response.data.status == "success") {
      console.log("password upadted for user :", options.userName);
      return { code: "success" }
    } else {
      throw { code: "APPLOZIC_ERROR" }
    }
  }).catch(err => {
    console.log("error while updating password ", err);
    throw err;
  });
};

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
exports.updateApplozicClient = (userName, accessToken, applicationId, user, options, isBot, isApplicationWebAdmin) => {
  let apzToken = options && options.apzToken ? options.apzToken : new Buffer(userName + ":" + accessToken).toString('base64');
  isApplicationWebAdmin = isApplicationWebAdmin || true;
  let headers = isBot ? {
    "Access-Token": accessToken,
    "Application-Key": applicationId,
    "Authorization": "Basic " + apzToken
  } : {
      "Apz-Token": "Basic " + apzToken,
      "Content-Type": "application/json",
      "Apz-AppId": applicationId,
      'Of-User-Id': user.userId,
      'Apz-Product-App': isApplicationWebAdmin
    };
  return axios.patch(config.getProperties().urls.applozicHostUrl + "/rest/ws/user/update?userId=" + encodeURIComponent(user.userId), user, { headers: headers })
    .then(response => {
      if (response.data && response.data.status === "success") {
        return { code: "success" };
      } else {
        throw { code: "APPLOZIC_ERROR", data: response.data }
      }
    })
    .catch(err => {
      console.log("error while updating user", err);
      throw err;
    })
}

exports.createSupportGroup = (groupInfo, headers) => {
  console.log("calling applozic client to create group");
  let url = config.getProperties().urls.createGroup;
  return Promise.resolve(axios.post(url, groupInfo, { headers: headers })).then(result => {
    if (result.data && result.data.status === "success") {
      return result.data;
    } else {
      return { status: "APPLOZIC_ERROR", data: result.data }
    }
  })
    .catch(err => {
      console.log("error while updating user", err);
      throw err;
    });
}


exports.sendGroupMessageByBot = (groupId, message, authorization, applicationId, metadata) => {
  let additionalMetadata = { skipBot: true };
  metadata = Object.assign(metadata, additionalMetadata);
  console.log("sending message to group ", groupId);
  console.log("calling send Message API with info , groupId: ", groupId, "message :", message, "applicationId", applicationId, "metadata", metadata);
  let url = config.getProperties().urls.sendMessageUrl;
  return Promise.resolve(axios.post(url, { "groupId": groupId, "message": message, "metadata": metadata },
    { headers: { "Application-Key": applicationId, "Authorization": "Basic " + authorization, "Content-Type": "application/json" } })).then(response => {
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

exports.addMemberIntoConversation = (groupInfo, applicationId, apzToken, ofUserId) => {
  let url = config.getProperties().urls.addMemberIntoConversation.replace(":role", constant.GROUP_ROLE.ADMIN);;
  return Promise.resolve(axios.post(url, groupInfo, {
    headers: {
      "Content-Type": "application/json",
      "Application-Key": applicationId,
      'Authorization': "Basic " + apzToken,
      'Of-User-Id': ofUserId,
      'Apz-Product-App': 'true'
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

const updateApplication = (data) => {
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
exports.updateApplication = updateApplication;
/**
 *
 * @param {List} userNameList
 * @param {String} applicationId
 * @param {String} apzToken
 * @param {List} emailIds
 * it accept either userName list or email list
 */
exports.getUserDetails = (userNameList, applicationId, apzToken, emailIds, apiKey) => {
  let url = config.getProperties().urls.getUserInfo;
  url = apiKey?url+"?ofUserId="+userNameList[0]:url;
  logger.info("getting user info from applozic url : ", url);
  let data = emailIds ? { emailIds: emailIds } : { "userIdList": userNameList }
  let headers = apiKey ? {"Api-Key":apiKey}:{ "Apz-AppId": applicationId, "Apz-Token": "Basic " + apzToken, "Apz-Product-App": true };
  return Promise.resolve(axios.get(url, { data: data, headers: headers })).then(response => {
    logger.info("got response from Applozic user info api :", response.status);
    if (response && response.status == 200 && response.data.status == "success") {
      return response.data.response;
    } else if (response && response.status == 200 && response.data.status == "error") {
      logger.error("ERROR FROM APPLOZIC while fetching user Detail: ", response.data.errorResponse[0].description);
      return null;
    }
  }).catch(err => {
    console.log("error while getting user detail from Applozic", err);
    throw err;
  });
}

exports.updateGroup = (groupInfo, applicationId, apzToken, ofUserId, headers) => {
  let url =
    config.getProperties().urls.applozicHostUrl + "/rest/ws/group/update";
  let header = headers && headers != null ? headers : {
    "Content-Type": "application/json",
    "Application-Key": applicationId,
    "Authorization": "Basic " + apzToken,
    "Of-User-Id": ofUserId,
    "Apz-Product-App": "true"
  }
  return Promise.resolve(axios.post(url, groupInfo, { headers: header })).then(response => {
    console.log("received response from applozic", response.status);
    if (response.status == 200) {
      return response;
    }
  })
    .catch(err => {
      console.log("error while assign to user", err);
    });
};
/**
 *
 * @param {String} userName
 * @param {String} applicationId
 * @param {Boolean} activate
 */
exports.activateOrDeactivateUser = (userName, applicationId, deactivate) => {
  let url = config.getProperties().urls.applozicHostUrl + "/rest/ws/user/delete?reset=false";
  let headers = {
    "Content-Type": "application/json",
    "Apz-AppId": applicationId,
    "Apz-Token": "Basic " + new Buffer(adminUserId + ":" + adminPassword).toString('base64'),
    "Of-User-Id": userName
  }
  return Promise.resolve(axios.post(url, {"reset":false}, { headers: headers })).then(response => {
    if (response.status == 200 && response.data.response == "success") {
      return response.data;
    }
    return { response: "error" };
  }).catch(err => {
    return err;
  })
}

exports.updateApplozicUser = (user, headers) => {
  let url = config.getProperties().urls.applozicHostUrl + "/rest/ws/user/update?ofUserId="+ encodeURIComponent(user.userId);
  return axios.post(url, user, { headers: headers })
    .then(response => {
      if (response.data && response.data.status === "success") {
        return { code: "success" };
      } else {
        throw { code: "APPLOZIC_ERROR", data: response }
      }
    })
    .catch(err => {
      console.log("error while updating user", err);
      throw err;
    })
}

exports.getConversationStats = (params, headers) => {
  let url = config.getProperties().urls.applozicHostUrl + "/rest/ws/group/stats?applicationId=" + params.applicationId;
  // url = params.days ? url + "&days=" + params.days : url;
  url = url + "&timestamp=" + params.startTimestamp;
  url = url + "&toTimestamp=" + params.endTimestamp;
  url = params.groupBy ? url + "&groupBy=" + params.groupBy : url;
  return axios.get(url, { headers: headers }).then(result => {
    return result.data.response.response;
  }).catch(err => {
    console.log("err", err);
    return;
  });
}
/**
 *
 * @param {object} params  { params.userIds:["userId1","userId2","userId3"],
                            params.clientGroupIds:["groupId1","groupId2"]}
 * @param {object} headers
 */
exports.removeGroupMembers = (params, applicationId, apzToken, ofUserId) => {
  let headers = {
    "Content-Type": "application/json",
    "Application-Key": applicationId,
    'Authorization': "Basic " + apzToken,
    'Of-User-Id': ofUserId
  }
  let url = config.getProperties().urls.applozicHostUrl + "/rest/ws/group/remove/users";
  return axios.post(url, params, { headers: headers }).then(result => {
    return result.data.response;
  }).catch(err => {
    console.log("err", err);
    return;
  });
}

const sendMessageListRecursively = (msgList, groupId, headers) => {

  if (msgList && msgList.length < 1) {
    return Promise.resolve("success");
  }
  let msg = msgList.splice(0, 1);
  let message={"groupId":groupId};
  message= Object.assign(message, msg[0])
  return Promise.resolve(sendGroupMessage(null, message, null, null, {}, headers)).then(resp => {
    console.log('send ', resp);
    return resp.data
  }).then(response => {
    return sendMessageListRecursively(msgList, groupId, headers).catch(err => {
      logger.error("error while sending messages", err);
      return;
    })

  })
}

exports.closeConversation = (interval, headers) => {
  let url = config.getProperties().urls.applozicHostUrl + `/rest/ws/group/close/${interval}/assigneeRole=${APPLOZIC_USER_ROLE_TYPE.BOT.name}`;
  return axios.post(url, {}, { headers: headers }).then(response => {
    return response;
  }).catch(error => {
    console.log("Auto close conversation error: ", error)
    return
  })
}
exports.sendMessageListRecursively =sendMessageListRecursively
exports.sendGroupMessage=sendGroupMessage;
exports.sendGroupMessagePxy = sendGroupMessagePxy;
