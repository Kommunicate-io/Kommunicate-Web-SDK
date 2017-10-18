
// global object to store the last off business hours  message sent time.
global.lastOBHMessageSentTime=0;
const applozicClient = require("../utils/applozicClient");
const user = require("../models").user;
const config= require("../../conf/config");
const userService= require("./userService");
const registrationService = require("../register/registrationService");
let moment = require('moment-timezone');
const cacheClient = require("../cache/hazelCacheClient");

exports.getAllUsers = function(req, res) {
  console.log("request received to get all users");
  res.status(405).json({"message": "Method not supported"});
};
exports.getUserByName = function(req,res) {
  const userName = req.params.userName;
  console.log("request received to get a users : ",userName);
  userService.getUserByName(userName).then(user=>{
    if(!user){
      res.status(404).json({code:"NOT_FOUND",message:"No user exists with user name: " + userName});
    }else{
      console.log("User from db",user);
      const userInfo = user;
      delete userInfo.password
      res.status(200).json({code:"SUCCESS",data:userInfo});
    }
  }).catch(err=>{
    console.log("error : ",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
  });
};

exports.getByUserNameAndAppId = function(req, res) {
  // get the user by userNam and appId
  const userName = req.params.userName
  const appId = req.params.appId

  console.log("request received to get a users : ",userName, appId);
  userService.getByUserNameAndAppId(userName, appId).then(user=>{
    if(!user){
      res.status(404).json({code:"NOT_FOUND",message:"No user exists with user name: " + userName});
    }else{
      console.log("User from db", user);
      const userInfo = user;
      delete userInfo.password
      res.status(200).json({code:"SUCCESS",data:userInfo});
    }
  }).catch(err=>{
    console.log("error : ",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
  });
}

exports.createUser = function(req,res) {
  console.log("request received to create a user: ",req.body);
  if(!req.body.applicationId) {
    res.status(400).json({code: "BAD_REQUEST",message: "ApplicationId can't be Empty"});
    return;
  }
  Promise.all([userService.getCustomerInfoByApplicationId(req.body.applicationId),userService.getByUserNameAndAppId(req.body.userName,req.body.applicationId)]).then(([customer,user])=>{
    if(!customer) {
      console.log("no customer registered with applicationId",req.body.applicationId);
      res.status(400).json({code: "BAD_REQUEST",message: "Invalid ApplicationId"});
      return;
    }else if(user) {
      console.log("user already registerd with userName and applicationId",req.body.userName,req.body.applicationId);
      res.status(409).json({code: "USER_ALREADY_EXISTS",message: "user Already exists with user and applicationId"});
      return;
    }else{
      return Promise.all([userService.createUser(req.body),applozicClient.getApplication(customer)]).then(([user,application])=>{
          console.log("user created successfully.. ",user);
          user.application = application;
          res.status(201).json({code:"SUCCESS",data:user}).end();
          return;
        });
    }
  }).catch(err=>{
    if(err.code==="USER_ALREADY_EXISTS") {
      console.log("CONFLICTS!",err);
      delete err.data;
      res.status(409).json(err).end();
    }else{
    console.log("error while creating user",err);
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
  console.log("processing post request to configure working hours: hours ",workingHours, "username:",userName,"applicationId ",applicationId);
  Promise.resolve(userService.getByUserNameAndAppId(userName,applicationId)).then(user=>{
    if(user===null)
      {res.status(404).json({"code":"USER_NOT_EXISTS","message":"no user found with username "+userName +" for applicationId "+applicationId});}
      else{
        if(user.type===registrationService.USER_TYPE.ADMIN) {
          userName="agent";
        }
       return userService.updateBusinessHoursOfUser(userName,applicationId,workingHours,timezone,offHoursMessage).then(result=>{
         console.log("result in controller : success");
          res.json({"code": "SUCCESS","message": "business hours updated"});
          return;
        });
      }
  }).catch(err=>{
    console.log("exceptions",err);
    res.status(500).json({"code": "INTERNAL_SERVER_ERROR","message": "something went wrong"});
  });
};
exports.getTimezone =(req,res)=>{
  console.log("request received to get time zone");
  // console.log(moment().tz("Etc/GMT+5").format());
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
  console.log("request received to subscribeOffHoursNotification");
  userService.subscribeOffHoursNotification(applicationId,userName).then(response=>{
    console.log("success",response);
  }).catch(err=>{
    console.log("error",err);
  });
};
// this method is being called from bot platform
// it will process every message and notify user if agent is out of businesshours
exports.processOffBusinessHours=(req,res)=>{
  console.log("proccessing business hours");
  let message = req.body.message;
  console.log(message);
  if(!message) {
    console.log("no message to process, hence returning");
    res.status(400).json({"code": "BAD_REQUEST","message": "message body is empty"});
  }else if(message.metadata.from=="KOMMUNICATE_AGENT"||message.contentType!==0) {
    res.status(200).json({"code": "Success","message": "nothing"});
    return;
  }else{
    // userService.processOffBusinessHours(message).then(result=>{
    // get the admin user of group
    Promise.resolve(userService.getByUserKey(message.botId)).then(bot=>{
      if(!bot) {
        console.log("no Bot exists in db with UserKey",message.botId);
        return;
      }
      return Promise.resolve(applozicClient.getGroupInfo(message.groupId,message.applicationId,bot.apzToken)).then(groupInfo=>{
        // console.log("groupInfo",groupInfo);
        return Promise.resolve(userService.getUserBusinessHoursByUserNameAndAppId(userService.getAdminUserNameFromGroupInfo(groupInfo),message.applicationId)).then(userBusinessHours=>{
          if(userBusinessHours.length<1) {
            console.log("business hours not configured for User");
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
                  console.log("err while updating last message sent time in cache",err);
                });
                console.log("message sent to user successfully");
                res.status(200).json({"code": "Success","message": "OK"});
                return 0;
              });
            }else{
              console.log(" NOT sending message,waiting for time interval");
              res.status(200).json({"code": "WAITING_FOR_TIME_INTERVAL","message": "waiting for time interval"});
              return 0;
            }
            });
            }else{
              console.log(" NOT sending message, Business Hours not configured for user for the day",moment().format("dddd").toUpperCase());
              res.status(200).json({"code": "BUSINESS_HOURS_NOT_CONFIGURED","message": "Business Hours not configured."});
              return 0;
            }
          }
        });
      });
    }).catch(err=>{
      console.log("err while processing off business hours", err);
      res.status(500).json({"code": "INTERNAL_SERVER_ERROR","message": "something went wrong"});
    });
  }
};
