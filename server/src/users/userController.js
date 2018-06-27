
// global object to store the last off business hours  message sent time.
global.lastOBHMessageSentTime=0;
const applozicClient = require("../utils/applozicClient");
const user = require("../models").user;
const config= require("../../conf/config");
const userService= require("./userService");
const registrationService = require("../register/registrationService");
let moment = require('moment-timezone');
const cacheClient = require("../cache/hazelCacheClient");
const dbUtils = require('../utils/dbUtils')
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const integrationSettingService = require('../setting/thirdPartyIntegration/integrationSettingService');
const CLEARBIT = require('../application/utils').INTEGRATION_PLATFORMS.CLEARBIT;
const constant =require('../../src/utils/constant');
const customerService = require('../customer/customerService');
/**
 *
 * @param {Http request object} req 
 * @param {Http response object} res 
 * req.query.type  contain string of type by , separated
 */
exports.getAllUsers = function (req, res) {
  logger.info("request received to get all users");
  var applicationId = req.query.appId;
  var type = req.query.type;
  var type2 = type ? type.split(",") : type
  return Promise.resolve(userService.getUsersByAppIdAndTypes(applicationId, type2)).then(data => {
    logger.info("sending response success ")
    data = data ? data : [];
    return res.status(200).json({ code: "SUCCESS", data: data });
  }).catch(err => {
    logger.error("error while fetching users :", err);
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", messsage: "Something went wrong" });
  })
};

exports.getUserByName = function(req,res) {
  const userName = req.params.userName;
  logger.info("request received to get a users : ",userName);
  userService.getUserByName(userName).then(user=>{
    if(!user){
      res.status(404).json({code:"NOT_FOUND",message:"No user exists with user name: " + userName});
    }else{
      logger.info("User from db",user);
      const userInfo = user;
      delete userInfo.password
      res.status(200).json({code:"SUCCESS",data:userInfo});
    }
  }).catch(err=>{
    logger.error("error : ",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
  });
};

exports.getByUserNameAndAppId = function(req, res) {
  // get the user by userNam and appId
  const userName = req.params.userName
  const appId = req.params.appId

  logger.info("request received to get a users : ",userName, appId);
  userService.getByUserNameAndAppId(userName, appId).then(user=>{
    if(!user){
      res.status(404).json({code:"NOT_FOUND",message:"No user exists with user name: " + userName + " and appId: " + appId});
    }else{
      logger.info("User from db", user);
      const userInfo = user;
      delete userInfo.password
      res.status(200).json({code:"SUCCESS",data:userInfo});
    }
  }).catch(err=>{
    logger.error("error : ",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
  });
}
/**
 * 
 * @param {*} req 
 * req.body contain user detail with applicationId
 * @param {*} res 
 */
exports.createUser = function (req, res) {
  logger.info("request received to create a user: ", req.body);
  if (!req.body.applicationId) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "ApplicationId can't be Empty" });
  }
  Promise.all([customerService.getCustomerByApplicationId(req.body.applicationId),
  userService.getByUserNameAndAppId(req.body.userName, req.body.applicationId),
  userService.getAdminUserByAppId(req.body.applicationId)])
    .then(([customer, user, adminUser]) => {
      if (!customer) {
        logger.info("no customer registered with applicationId", req.body.applicationId);
        return res.status(400).json({ code: "BAD_REQUEST", message: "Invalid ApplicationId" });
      } else if (user) {
        logger.info("user already registerd with userName and applicationId", req.body.userName, req.body.applicationId);
        return res.status(409).json({ code: "USER_ALREADY_EXISTS", message: "user Already exists with user and applicationId" });
      } else {
        return Promise.all([userService.createUser(req.body, customer),
        applozicClient.getApplication({ "applicationId": req.body.applicationId, "userName": adminUser.userName, "accessToken": adminUser.accessToken }, true)])
          .then(([user, application]) => {
            return integrationSettingService.getIntegrationSetting(customer.id, CLEARBIT).then(key => {
              logger.info("user created successfully.. ", user);
              if (user.type === 1) {
                registrationService.sendWelcomeMail(user.email, user.name, true, user.companyName);
              }
              user.application = application;
              user.adminUserName = customer.userName;
              user.adminDisplayName = customer.name;
              user.routingState = customer.agentRouting;
              user.subscription = customer.subscription;
              user.billingCustomerId = customer.billingCustomerId;
              user.clearbitKey = key.length > 0 ? key[0].accessKey : "";
              return res.status(201).json({ code: "SUCCESS", data: user }).end();
            });
          });
      }
    }).catch(err => {
      if (err.code === "USER_ALREADY_EXISTS") {
        logger.error("CONFLICTS!", err);
        delete err.data;
        res.status(409).json(err).end();
      } else {
        logger.error("error while creating user", err);
        res.status(500).json(err).end();
      }
    }).catch(err => {
      logger.error('user creation error', error)
    });
};

exports.updateBusinessHours = (req,res)=>{
  // ui will call the get business hours API, populate the data and make post request to server
  let workingHours =req.body.workingHours;
  let userName= req.params.userName;
  let applicationId= req.body.applicationId;
  let offHoursMessage = req.body.offHoursMessage;
  let timezone= req.body.timezone;
  logger.info("processing post request to configure working hours: hours ",workingHours, "username:",userName,"applicationId ",applicationId);
  Promise.resolve(userService.getByUserNameAndAppId(userName,applicationId)).then(user=>{
    if(user===null)
      {res.status(404).json({"code":"USER_NOT_EXISTS","message":"no user found with username "+userName +" for applicationId "+applicationId});}
      else{
        if(user.type===registrationService.USER_TYPE.ADMIN) {
          userName="agent";
        }
       return userService.updateBusinessHoursOfUser(userName,applicationId,workingHours,timezone,offHoursMessage).then(result=>{
         logger.info("result in controller : success");
          res.json({"code": "SUCCESS","message": "business hours updated"});
          return;
        });
      }
  }).catch(err=>{
    logger.error("exceptions",err);
    res.status(500).json({"code": "INTERNAL_SERVER_ERROR","message": "something went wrong"});
  });
};
exports.getTimezone =(req,res)=>{
  logger.info("request received to get time zone");
  // logger.info(moment().tz("Etc/GMT+5").format());
  // moment.tz.names()
  let names = Object.keys(moment.tz._zones)
    .map(function(k) {
return moment.tz._zones[k].split('|')[0];
})
    .filter(function(z) {
return z.indexOf('/') >= 0;
})
    .sort();
    res.json(names).status(200).end();
  };

exports.subscribeOffHoursNotification= (req,res)=>{
  let applicationId = req.body.applicationId;
  let userName = req.params.userName;
  logger.info("request received to subscribeOffHoursNotification");
  userService.subscribeOffHoursNotification(applicationId,userName).then(response=>{
    logger.info("success",response);
  }).catch(err=>{
    logger.error("error",err);
  });
};
// this method is being called from bot platform
// it will process every message and notify user if agent is out of businesshours
exports.processOffBusinessHours=(req,res)=>{
  logger.info("proccessing business hours");
  let message = req.body.message;
  logger.info(message);
  if(!message) {
    logger.info("no message to process, hence returning");
    res.status(400).json({"code": "BAD_REQUEST","message": "message body is empty"});
  }else if(message.metadata.from=="KOMMUNICATE_AGENT"||message.contentType!==0) {
    res.status(200).json({"code": "Success","message": "nothing"});
    return;
  }else{
    // userService.processOffBusinessHours(message).then(result=>{
    // get the admin user of group
    Promise.resolve(userService.getByUserKey(message.botId)).then(bot=>{
      if(!bot) {
        logger.info("no Bot exists in db with UserKey",message.botId);
        return;
      }
      return Promise.resolve(applozicClient.getGroupInfo(message.groupId,message.applicationId,bot.apzToken)).then(groupInfo=>{
        // logger.info("groupInfo",groupInfo);
        return Promise.resolve(userService.getUserBusinessHoursByUserNameAndAppId(userService.getAdminUserNameFromGroupInfo(groupInfo),message.applicationId)).then(userBusinessHours=>{
          if(userBusinessHours.length<1) {
            logger.info("business hours not configured for User");
            res.status(200).json({"code": "Success","message": "OK"});
            return 0;
          }else{
            // process message
            let todaysBusinessHours = userService.getConfigIfCurrentTimeOutOfBusinessHours(userBusinessHours);
            if(todaysBusinessHours) {
              return Promise.resolve(userService.isIntervalExceeds(userBusinessHours)).then(isIntervalExceeds=> {

              if(isIntervalExceeds) {
                           // send message
              return userService.processOffBusinessHours(message,todaysBusinessHours).then(response=> {
                // global.lastOBHMessageSentTime = new Date().getTime();
                const key = userBusinessHours[0].user_name+"-"+userBusinessHours[0].application_id;
                const mapPrifix = config.getEnvId()+"-businessHoursMessageSentMap";
                Promise.resolve(cacheClient.setDataIntoMap(mapPrifix,key,new Date().getTime())).then(oldValue=>{
                  logger.info("last message sent time updated in cache");
                }).catch(err=>{
                  logger.error("err while updating last message sent time in cache",err);
                });
                logger.info("message sent to user successfully");
                res.status(200).json({"code": "Success","message": "OK"});
                return 0;
              });
            }else{
              logger.info(" NOT sending message,waiting for time interval");
              res.status(200).json({"code": "WAITING_FOR_TIME_INTERVAL","message": "waiting for time interval"});
              return 0;
            }
            });
            }else{
              logger.info(" NOT sending message, Business Hours not configured for user for the day",moment().format("dddd").toUpperCase());
              res.status(200).json({"code": "BUSINESS_HOURS_NOT_CONFIGURED","message": "Business Hours not configured."});
              return 0;
            }
          }
        });
      });
    }).catch(err=>{
      logger.error("err while processing off business hours", err);
      res.status(500).json({"code": "INTERNAL_SERVER_ERROR","message": "something went wrong"});
    });
  }
};

exports.patchUser = (req,res)=>{
  let response ={};
  let status;
  const user = req.body;
  const userId = req.params.userName;
  const appId = req.params.appId;
  logger.info("request recieved to patch user: ",userId, "body",user);
  userService.updateUser(userId, appId, user).then(isUpdated=>{
    if(isUpdated){
      response.code="SUCCESS";
      response.message="updation successfull";
      res.status(200).json(response);
    }else{
      response.code="NOT_FOUND";
      response.message="resource not found by userId " + userId + " and appId: " + appId;
      res.status(404).json(response);
    }

  }).catch((err)=>{
    response.code = err.code == "DUPLICATE_EMAIL" ? err.code : "INTERNAL_SERVER_ERROR";
    response.message = err.message ? err.message : "something went wrong!";
    res.status(500).json(response);
  });

};

exports.updatePassword=(req,res)=>{
  logger.info("request received to update password");
  const newPassword = req.body.newPassword;
  const oldPassword =req.body.oldPassword;
  const userName = req.body.userName;
  const applicationId = req.body.applicationId;
    return userService.getByUserNameAndAppId(userName,applicationId).then(user=>{
      if(bcrypt.compareSync(oldPassword, user.password)){
        return userService.updatePassword(newPassword,user).then(result=>{
          return res.status(200).json({code:"SUCCESS",message:"password updated"});
        })
      }else{
        return res.status(200).json({code:"INVALID_CREDENTIALS",message:"wrong old password"});
      }
    })
  .catch(err=>{
    logger.error("error while updating password",err);
    return res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
  })
}

exports.createGroupOfAllAgents = (req, res) => {
  if(req.body.applicationKey===undefined){
    return res.status(500).json({ code: "INVALID_APPLICATION_KEY", message: "invalid application" });
  }
  let groupInfo = { type: 10, users: [], metadata: config.getCommonProperties().groupMetadata }
  return Promise.resolve(customerService.getCustomerByApplicationId(req.body.applicationKey)).then(customer => {
    if (!customer) {
      return res.status(500).json({ code: "CUSTOMER_NOT_FOUND", message: "customer not found" });
    }
    groupInfo.admin = customer.userName;
    groupInfo.groupName = customer.name;
    return Promise.resolve(userService.getUsersByAppIdAndTypes(customer.applications[0].applicationId, undefined)).then(users => {
      if (users) {
        users.forEach(function (user) {
          console.log(user);
          groupInfo.users.push({ userId: user.userName, groupRole: user.type === 3 ? 1 : 2 });
        });
        return Promise.resolve(applozicClient.createGroup(groupInfo, customer.applications[0].applicationId, customer.apzToken)).then(response => {
          return res.status(200).json(response.data);
        }).catch(err => {
          return res.status(500).json({ code: "UNABLE_TO_CREATE_GROUP", message: "unable to create group" });
        });
      }
      return res.status(500).json({ code: "NO_USER_FOUND", message: "user not found" });
    }).catch(err => { });
  }).catch(err => {
    console.log("error during creating group", err)
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "something went wrong" })
  });
}

exports.goAway = (req, res) => {
  let response = {};
  const action = req.params.action;
  const userId = req.params.userName;
  const appId = req.params.appId;
  userService.goAway(userId, appId).then(isUpdated => {
    if(isUpdated){
      response.code="SUCCESS";
      response.message="status changed to away successfully";
      res.status(200).json(response);
    }else{
      response.code="NOT_FOUND";
      response.message="resource not found by userId " + userId + " and appId: " + appId;
      res.status(404).json(response);
    }
  }).catch(err => {
    response.code="INTERNAL_SERVER_ERROR";
    response.message="something went wrong!";
    res.status(500).json(response);
  })
}

exports.goOnline = (req, res) => {
  let response = {};
  const userId = req.params.userName;
  const appId = req.params.appId;
  userService.goOnline(userId, appId).then(isUpdated => {
    if(isUpdated){
      response.code="SUCCESS";
      response.message="status changed to online successfully";
      res.status(200).json(response);
    }else{
      response.code="NOT_FOUND";
      response.message="resource not found by userId " + userId + " and appId: " + appId;
      res.status(404).json(response);
    }
  }).catch(err => {
    response.code="INTERNAL_SERVER_ERROR";
    response.message="something went wrong!";
    res.status(500).json(response);
  })
}

exports.changeBotStatus = (req, res) => {
  return userService.changeBotStatus(req.params.botId, req.params.appId, req.params.status).then(result => {
    return res.status(200).json({ code: 'success', message: 'updated successfully' });
  }).catch(err => {
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'something went wrong!' });
  })
}
exports.getPseudoName = (req,res) => {
  let name = constant.NAME;
  let adjective = constant.ADJECTIVE;
  let randomPositionForName = Math.floor(Math.random()*name.length);
  let randomName = name[randomPositionForName];
  let randomPositionForAdjective = Math.floor(Math.random()*adjective.length);
  let randomAdjective = adjective[randomPositionForAdjective]
  let userName = randomAdjective + " " + randomName ;
  let data = {"userName": userName};
  return res.status(200).json({ code: "SUCCESS", response: data });
}
/**
 * 
 * @param {Http req object} req 
 * @param {Http res object} res 
 */
exports.activateOrDeactivateUser = (req, res) => {
  let deactivate = req.query.deactivate == 'true' ? true : false;
  let appId = req.query.applicationId;
  let userName = req.query.userName;
  return userService
    .activateOrDeactivateUser(userName, appId, deactivate)
    .then(result => {
      return res.status(200).json({
        code: "SUCCESS",
        message: result
      });
    })
    .catch(err => {
      return res.status(500).json({
        code: "ERROR",
        message: "error"
      });
    });
};
