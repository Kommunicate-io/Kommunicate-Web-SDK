const registrationService = require("./registrationService");
const customerService = require('../customer/customerService')
const userService = require('../users/userService');
const joi = require("joi");
const randomString = require('randomstring');
const inAppMessageService = require("../application/inAppMsgService");
const applozicClient = require("../utils/applozicClient");
const activeCampaignClient = require("../activeCampaign/activeCampaignClient")
const config = require("../../conf/config");
const pipeDrive = require('../pipedrive/pipedrive');
const pipeDriveEnable = config.getProperties().pipeDriveEnable;
const activeCampaignEnable = config.getProperties().activeCampaignEnabled;
const logger = require('../utils/logger');
const subscriptionPlan = require('../utils/utils').SUBSCRIPTION_PLAN;
//const logger =require("../utils/logger");
exports.createCustomer = (req, res) => {
  // userName is the primary parameter. user Id was replaced by userName.
  const userName = req.body.userName ? req.body.userName : req.body.userId;
  //const userId =  userName;
  const isPreSignUp = req.query.preSignUp;
  const isOAuthSignUp = req.query.OAuthSignUp;
  const password = isPreSignUp ? randomString.generate(6) : req.body.password;
  const name = req.body.name;
  const email = req.body.email || userName;
  const subscription = req.body.subscription || subscriptionPlan.initialPlan;
  let response = {};
  let userDetail = Object.assign({}, req.body);
  userDetail.email = email;
  userDetail.password = password;
  userDetail.userName = userName;
  userDetail.subscription = subscription;
  logger.info("userName:", userName, password, isPreSignUp, isOAuthSignUp);
  /*
  * When login is done via 'Sign in with Google' make password = 'mi8&zG#0rLyE^$1&MXSe' and loginType = 'oauth'.
  * Making sure that passoword is null for 'Sign in with Google'
  */
  if (isOAuthSignUp && req.body.loginType === 'oauth') {
    userDetail.password = 'mi8&zG#0rLyE^$1&MXSe'
  }
  if (userName && (isPreSignUp || password || isOAuthSignUp)) {
    console.log("request received for pre sign up, EmailId : ", userName);
    //TODO : check the if user exist form communicate Db;
    Promise.all([customerService.getCustomerByUserName(userName), userService.getUserByName(userName)]).then(([customer, user]) => {
      console.log("got the user from db", user);
      if (customer || user) {
        response.code = "USER_ALREADY_EXISTS";
        response.message = "User Already Exists";
        res.status(200).json(response);
        return;
      } else {
        return registrationService.createCustomer(userDetail)
          .then(result => {
            /* inAppMessageService.postWelcomeMsg({customer:{id:result.id},message:inAppMessageService.defaultMessage})
             .catch(err=>{
               console.log("err while storing welcome message in db");
             });*/
            /* registrationService.sendWelcomeMail(email, name||email).catch(err=>{
               console.log("Error while sending welcom mail to user",err)
             });*/
            if (activeCampaignEnable) {
              activeCampaignClient.addContact({ "email": email })
                .then(subscriberId => {
                  return customerService.updateCustomer(userName, { activeCampaignId: subscriberId });
                })
                .catch(error => {
                  console.log("Error while sending Email to activeCampaign", error);
                });
            }

            response.code = "SUCCESS";
            // replacing user Id with user name. can't delete userId from system for backward compatibility.
            delete result.userId;
            result.isAdmin = true;
            result.adminUserName = userName;
            result.adminDisplayName = name;
            response.data = result;
            res.status(200).json(response);
          }).catch(err => {
            console.log("error while creating a customer", err);
            switch (err.code) {
              case "USER_ALREADY_EXISTS":
                response.code = "USER_ALREADY_EXISTS";
                response.message = "user Already Exists";
                res.status(200).json(response);
                break;
              default:
                response.code = "INTERNAL_SERVER_ERROR";
                response.message = "something is broken";
                res.status(500).json(response);
                break;
            }
          });
      }
    })
  } else {
    response.code = "BAD_REQUEST";
    response.message = "some params are missing";
    res.status(400).json(response);
  }
}

exports.patchCustomer = (req, res) => {
  let response = {};
  let status;
  const customer = req.body;
  const userId = req.params.userId;
  console.log("request recieved to update customer: ", userId, "body", customer);
  if (customer.websiteUrl) {
    let appName = (customer.companyName) ? customer.companyName : "";
    applozicClient.updateApplication({ applicationId: customer.applicationId, websiteUrl: customer.websiteUrl, pricingPackage: config.getCommonProperties().kommunicatePricingPackage, name: appName }).catch(err => {
      console.log('error while updating application')
    })
  }

  customerService.getCustomerByUserName(userId).then(dbCostomer => {
    console.log("got the user from db", dbCostomer);
    if (activeCampaignEnable) {
      activeCampaignClient.updateActiveCampaign({
        "email": userId,
        "subscriberId": dbCostomer.dataValues.activeCampaignId,
        "name": customer.name,
        "role": customer.role,
        "companyUrl": customer.websiteUrl,
        "contactNo": customer.contactNo,
        "industry": customer.industry,
        "companySize": customer.companySize
      }).catch(error => {
        console.log("Error while updating company URL to activeCampaign", error);
      });
    }
    if (pipeDriveEnable) {
      applozicClient.getUserDetails([dbCostomer.userName], dbCostomer.applications[0].applicationId, dbCostomer.apzToken).then(users => {
        let integration = users[0].metadata && users[0].metadata.KM_INTEGRATION ? JSON.parse(users[0].metadata.KM_INTEGRATION) : {};
        if (integration.pipeDriveId) {
          pipeDrive.updateDeal({ id: integration.pipeDriveId, title: customer.companyName, name: customer.name, email: userId, phone: customer.contactNo });
        } else {
          let organization = { name: customer.companyName };
          let person = { name: customer.name, email: userId, phone: customer.contactNo, }
          pipeDrive.createDealInPipeDrive(organization, person).then(result => {
            integration['pipeDriveId'] = result.data.data.id;
            let user = { userId: dbCostomer.userName, metadata: { KM_INTEGRATION: JSON.stringify(integration) } }
            applozicClient.updateApplozicClient(dbCostomer.userName, dbCostomer.accessToken, dbCostomer.applications[0].applicationId, user, { apzToken: dbCostomer.apzToken }, false);
          });
        }
      }).catch(error => {
        console.log("Error while updating pipedrive ", error);
      });
    }
  }).catch(error => {
    console.log("Error while getting customer by userId", error);
  });
  registrationService.updateCustomer(userId, customer).then(isUpdated => {
    // userService.getAdminUserByAppId(customer.applicationId).then(user=>{
    //   let userobj =  {};
    //   userId?userobj.userId=userId:"";
    //   customer.name? userobj.displayName = customer.name:"";
    //   customer.email?userobj.email =customer.email:"";
    // applozicClient.updateApplozicClient(user.userName,user.accessToken,customer.applicationId,userobj).then(response=>{
    //     console.log("Applozic update user response: " + response);
    //   }).catch(err=>{
    //     console.log("error while updating Applozic user");
    //   })
    // });
    if (isUpdated) {
      response.code = "SUCCESS";
      response.message = "Updated";
      res.status(200).json(response);
    } else {
      response.code = "NOT_FOUND";
      response.message = "resource not found by userId " + userId;
      res.status(404).json(response);
    }

  }).catch((err) => {
    response.code = err.code == "DUPLICATE_EMAIL" ? err.code : "INTERNAL_SERVER_ERROR";
    response.message = err.message ? err.message : "something went wrong!";
    res.status(500).json(response);
  });
}
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.getCustomerInformation = (req, res) => {
  const userName = req.params.userName;
  console.log("request received to get customer information: ", userName);
  if (!userName) {
    res.status(400).json({ code: "BAD_REQUEST", message: "user name is empty" });
    return;
  }
  customerService.getCustomerByUserName(userName).then(customer => {
    if (!customer) {
      console.log("customer not found in db :", userName);
      res.status(404).json({ code: "NOT_FOUND", message: "no customer exists with user name: " + userName });
    } else {
      let custInfo = customer.dataValues;
      delete custInfo.password;
      res.status(200).json({ code: "SUCCESS", data: custInfo });
    }
  }).catch(err => {
    console.log("err while fetching data for customer", err);
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "something went wrong" });
    return;
  })


}

exports.signUpWithAplozic = (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const applicationId = req.body.applicationId;
  const email = req.body.email || userName;
  let response = {};

  console.log("userName:", userName, password);
  if (userName && password) {
    console.log("request received to sign up with Applozic, EmailId : ", userName);
    Promise.all([customerService.getCustomerByUserName(userName), userService.getUserByName(userName)]).then(([customer, user]) => {
      console.log("got the user from db", user);
      if (customer || user) {
        response.code = "USER_ALREADY_EXISTS";
        response.message = "User Already Exists";
        res.status(200).json(response);
        return;
      } else {
        return registrationService.signUpWithApplozic(req.body).then(result => {
          try {
            /*inAppMessageService.postWelcomeMsg({customer:{id:result.id},message:inAppMessageService.defaultMessage})
            .catch(err=>{
              console.log("err while storing welcome message in db");
            });*/
            //registrationService.sendWelcomeMail(email, userName, false,'');
          } catch (err) {
            console.log("Error while sending welcom mail to user  ", err);
          }
          response.code = "SUCCESS";
          // replacing user Id with user name. can't delete userId from system for backward compatibility.
          delete result.userId;
          result.isAdmin = true;
          result.adminUserName = userName;
          result.adminDisplayName = userName;
          response.data = result;
          res.status(200).json(response);
        }).catch(err => {
          console.log("error while creating a customer", err);
          switch (err.code) {
            case "USER_ALREADY_EXISTS":
              response.code = "USER_ALREADY_EXISTS";
              response.message = "user Already Exists";
              res.status(200).json(response);
              break;
            case "APPLICATION_NOT_EXISTS":
              response.code = "APPLICATION_NOT_EXISTS";
              response.message = "application Not exists";
              res.status(200).json(response);
              break;
            default:
              response.code = "INTERNAL_SERVER_ERROR";
              response.message = "something is broken";
              res.status(500).json(response);
              break;
          }
        });
      }
    })
  } else {
    response.code = "BAD_REQUEST";
    response.message = "some params are missing";
    res.status(400).json(response);
  }



}
/**
 *
 * @param {*} req
 * @param {*} res
 * will check this one
 * let user = req.params.user+"Routing"
 */
exports.updateRoutingState = (req, res) => {
  let appId = req.params.appId;
  let routingState = req.params.routingState;
  let user = req.params.user + "Routing"
  let routingInfo = {};
  routingInfo[user] = routingState;

  return customerService.updateRoutingState(appId, routingInfo).then(response => {
    return res.status(200).json({ code: "SUCCESS", message: response.message });
  }).catch(err => {
    console.log("error while updating routing state", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })
}

/**
 *
 */
exports.getCustomerByApplicationId = (req, res) => {
  let appId = req.query.applicationId;
  return customerService.getCustomerByApplicationId(appId).then(customer => {
    if (!customer) {
      res.status(200).json({ code: "SUCCESS", message: "customer not found for this application id" });
    }
    res.status(200).json({ code: "SUCCESS", message: 'success', data: customer });

  }).catch(err => {
    console.log("error while getting customer", err);
    res.status(500).json({ code: "ERROR", message: "internal server error" });
  });
}
