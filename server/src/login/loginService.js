const userService = require("../users/userService");
const bcrypt = require('bcrypt');
const config = require("../../conf/config");
const applozicClient = require("../utils/applozicClient");
const registrationService = require("../register/registrationService");
const integrationSettingService = require('../setting/thirdPartyIntegration/integrationSettingService');
const CLEARBIT = require('../application/utils').INTEGRATION_PLATFORMS.CLEARBIT;
const customeService = require('../customer/customerService');
const applicationService = require('../customer/applicationService');

exports.login = (userDetail) => {
  userDetail.userName ? (userDetail.userName = userDetail.userName.toLowerCase()) : "";
  const userName = userDetail.userName;
  const password = userDetail.password;
  var applicationId = userDetail.applicationId;

  if (applicationId) {
    return kommunicateCustomerAndApplicationValidate(userDetail);
    // return this.processLogin(userDetail);
  }

  return applozicClient.findApplications(userName).then(response => {
    let applicationWebAdminApp = response.APPLICATION_WEB_ADMIN;
    let applicationAdminApp = response.APPLICATION_ADMIN;
    let applications = Object.assign({}, applicationWebAdminApp, applicationAdminApp);

    if (Object.keys(applications).length > 1) {
      return applications;
    }

    if (Object.keys(applicationWebAdminApp).length == 1) {
      userDetail.applicationId = Object.keys(applicationWebAdminApp)[0];
      return this.processLogin(userDetail);
    }
    else if (Object.keys(applicationAdminApp).length == 1) {
      userDetail.applicationId = Object.keys(applicationAdminApp)[0];
      return kommunicateCustomerAndApplicationValidate(userDetail);
    } else {
      let err = {};
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
  });
}

exports.processLogin = (userDetail) => {
  var userName = userDetail.userName;
  var applicationId = userDetail.applicationId;
  var password = userDetail.password;
  return Promise.all([applozicClient.getApplication({ userName: userName, applicationId: applicationId, accessToken: password }, true),
  userService.getByUserNameAndAppId(userName, applicationId),
  applozicClient.applozicLogin(userDetail)]).then(([application, user, applozicUser]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      // valid user credentials
      return Promise.resolve(customeService.getCustomerByApplicationId(applicationId)).then(customer => {
        return integrationSettingService.getIntegrationSetting(customer.id, CLEARBIT).then(key => {
          user.isAdmin = customer.userName == user.userName;
          user.adminUserName = customer.userName;
          user.adminDisplayName = customer.name;
          user.applozicUser = applozicUser;
          user.subscription = customer.subscription;
          user.billingCustomerId = customer.billingCustomerId;
          user.clearbitKey = key.length > 0 ? key[0].accessKey : "";
          user.applicationCreatedAt=customer.applications[0].created_at
          return prepareResponse(user, application);
        })
      });
    } else {
      console.log("invalid login credential");
      let err = {};
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
  }).catch(err => {
    console.log("err while login", err);
    throw err;
  });
};


// prepare respone
function prepareResponse(user, application) {
  let response = JSON.parse(JSON.stringify(user));
  response.application = JSON.parse(JSON.stringify(application));
  return response;
}

const kommunicateCustomerAndApplicationValidate = (userDetail) => {
  return Promise.all([customeService.isAdmin(userDetail.userName), applicationService.isApplicationExist(userDetail.applicationId)]).then(([isAdminExist, isApplicationExist]) => {
    if (isApplicationExist) {
      return this.processLogin(userDetail);
    }
    if (!isAdminExist || !isApplicationExist) {
      return registrationService.signUpWithApplozic(userDetail, false).then(result => {
        return this.processLogin(userDetail);
      }).catch(err => {
        throw err;
      });
    }
  }).catch(err => {
    throw err;
  });
}

