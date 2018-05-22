const userService =require("../users/userService");
const bcrypt = require('bcrypt');
const config = require("../../conf/config");
const applozicClient = require("../utils/applozicClient");
const registrationService = require("../register/registrationService");
const integrationSettingService = require('../../src/thirdPartyIntegration/integrationSettingService');
const CLEARBIT = require('../application/utils').INTEGRATION_PLATFORMS.CLEARBIT;
exports.login = (userDetail) => {
  const userName= userDetail.userName;
  const password = userDetail.password;
  var applicationId = userDetail.applicationId;

  if (applicationId) {
    return this.processLogin(userDetail);
  }

  return applozicClient.findApplications(userName,'APPLICATION_WEB_ADMIN', false).then(response => {

    if (Object.keys(response).length == 0) {
      return applozicClient.findApplications(userName, 'APPLICATION_ADMIN', true).then(result => {
        response = result;
        if (Object.keys(response).length == 0) {
          let err = {};
          err.code = "INVALID_CREDENTIALS";
          throw err;
        } else {
          applicationId = Object.keys(response)[0];
          userDetail.applicationId = applicationId;
          return registrationService.signUpWithApplozic(userDetail, false).then(result=>{
            // for (var key in response) {
            //   if(key!=applicationId){
            //   userDetail.applicationId = key;
            //   registrationService.signUpWithApplozic(userDetail);
            //   }
            // }
            return this.processLogin(userDetail);
          })
        }
      });
    }
    if (Object.keys(response).length > 1) {
      return response;
    }

    applicationId = Object.keys(response)[0];
    userDetail.applicationId = applicationId;

    return this.processLogin(userDetail);
  });
};

exports.processLogin = (userDetail) => {
  var userName = userDetail.userName;
  var applicationId = userDetail.applicationId;
  var password = userDetail.password;
  return Promise.all([applozicClient.getApplication({userName: userName,applicationId:applicationId,accessToken:password}, true),
    userService.getByUserNameAndAppId(userName,applicationId),
    applozicClient.applozicLogin(userDetail)]).then(([application,user,applozicUser])=>{
      if(user && bcrypt.compareSync(password, user.password)) {
        // valid user credentials
          return Promise.resolve(userService.getCustomerInfoByApplicationId(applicationId)).then(customer=>{
            return integrationSettingService.getIntegrationSetting(customer.id,CLEARBIT).then(key=>{ 
              user.isAdmin = customer.userName==user.userName;
              user.adminUserName=customer.userName;
              user.adminDisplayName = customer.name;
              user.routingState = customer.agentRouting;
              user.applozicUser=applozicUser;
              user.subscription = customer.subscription;
              user.billingCustomerId = customer.billingCustomerId;
              user.clearbitKey =key.length > 0 ? key[0].accessKey:"";
              return prepareResponse(user,application);
            })
          });
      }else{
        console.log("invalid login credential");
        let err= {};
        err.code= "INVALID_CREDENTIALS";
        throw err;
      }
    }).catch(err=>{
      console.log("err while login",err);
      throw err;
    });
};


// prepare respone
function prepareResponse(user,application) {
  let response = JSON.parse(JSON.stringify(user));
  response.application=JSON.parse(JSON.stringify(application));
  return response;
}
