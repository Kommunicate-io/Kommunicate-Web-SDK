
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

exports.getAllUsers = function(req, res) {
  logger.info("request received to get all users");
  var applicationId = req.query.appId;
  var type = req.query.type;
  return userService.getCustomerInfoByApplicationId(applicationId)
  .then(customer=>{
    if(customer){
      userService.getAllUsersOfCustomer(customer,type)
      .then(dbUtils.getDataArrayFromResultSet)
      .then(data=>{
        logger.info("sending response success ")
        data= data?data:[];
        res.status(200).json({code:"SUCCESS",data:data});
      })
    }else{
      logger.info("no customer found for given applicationId",applicationId);
      res.status(400).json({code:"BAD_REQUEST",messsage:"Invalid Application Id"});
      return;
    }
  })
  .catch(err=>{
    logger.error("error while fetching users :", err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",messsage:"Something went wrong"});

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

exports.createUser = function(req,res) {
  logger.info("request received to create a user: ",req.body);
  if(!req.body.applicationId) {
    res.status(400).json({code: "BAD_REQUEST",message: "ApplicationId can't be Empty"});
    return;
  }
  Promise.all([userService.getCustomerInfoByApplicationId(req.body.applicationId),userService.getByUserNameAndAppId(req.body.userName,req.body.applicationId)]).then(([customer,user])=>{
    if(!customer) {
      logger.info("no customer registered with applicationId",req.body.applicationId);
      res.status(400).json({code: "BAD_REQUEST",message: "Invalid ApplicationId"});
      return;
    }else if(user) {
      logger.info("user already registerd with userName and applicationId",req.body.userName,req.body.applicationId);
      res.status(409).json({code: "USER_ALREADY_EXISTS",message: "user Already exists with user and applicationId"});
      return;
    }else{
      return Promise.all([userService.createUser(req.body),applozicClient.getApplication(customer)]).then(([user,application])=>{
          logger.info("user created successfully.. ",user);
          user.application = application;
          res.status(201).json({code:"SUCCESS",data:user}).end();
          return;
        });
    }
  }).catch(err=>{
    if(err.code==="USER_ALREADY_EXISTS") {
      logger.error("CONFLICTS!",err);
      delete err.data;
      res.status(409).json(err).end();
    }else{
    logger.error("error while creating user",err);
    res.status(500).json(err).end();
    }
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
                  console.debug("last message sent time updated in cache");
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
    response.code="INTERNAL_SERVER_ERROR";
    response.message="something went wrong!";
    res.status(500).json(response);
  });

};
