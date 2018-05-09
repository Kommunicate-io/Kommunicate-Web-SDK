const routes = require("../routers/routes.js");
const userModel = require("../models").user;
const db = require("../models");
const Op = db.Sequelize.Op;
const stringUtils = require("underscore.string");
const applozicClient = require("../utils/applozicClient");
const config = require("../../conf/config");
const registrationService = require("../register/registrationService");
const bcrypt = require("bcrypt");
let moment = require('moment-timezone');
const KOMMUNICATE_APPLICATION_KEY = config.getProperties().kommunicateParentKey;
const KOMMUNICATE_ADMIN_ID =config.getProperties().kommunicateAdminId;
const KOMMUNICATE_ADMIN_PASSWORD =config.getProperties().kommunicateAdminPassword;
const cacheClient = require("../cache/hazelCacheClient");
const logger = require('../utils/logger');
const botPlatformClient = require("../utils/botPlatformClient");
const CONST = require("./constants.js");
/*
this method returns a promise which resolves to the user instance, rejects the promise if user not found in db.
*/
const getUserByName = userName=>{
  if(stringUtils.isBlank(userName)) {
    console.log("empty userName received");
    throw new Error("userName is Empty");
  }
  return new Promise((resolve,reject)=>{
    console.log("fetching data for userName : ",userName);
    userModel.findOne({where: {userName: userName}}).then(user => {
      console.log("found data for user : ",user==null?null:user.dataValues);
       return  user!==null? resolve(user.dataValues):resolve(null);
    },err=>{
      console.log("err",err);
      return reject(err);
    }).catch(err=>{
      console.log("error while fetching data from db : ",err);
      throw(err);
    });
  });
};

/**
 * This method will catch USER_ALREADY_EXIST error, and update the role of that user to APPLICATION_WEB_ADMIN.
 * @param {User} user newuser object
 * @param {Object} customer customer object
 * @param {Objetc} err - error returned by applozic login/register API.
 */
let handleCreateUserError =(user,customer,err)=>{
  console.log("catching the user Already exists. error", err);
  if(err&&err.code=="USER_ALREADY_EXISTS" && err.data){
    console.log("updating role to application web admin");
    const data = err.data; 
    return Promise.resolve(applozicClient.updateApplozicClient(user.userName,user.password,customer.applicationId,{userId:user.userName,roleName:"APPLICATION_WEB_ADMIN"},{apzToken: new Buffer(KOMMUNICATE_ADMIN_ID+":"+KOMMUNICATE_ADMIN_PASSWORD).toString("base64")})).then(response=>{
      return err.data;
    })
  }else{
    logger.error(" error :",err);
    throw err;
  }
}

/**
 * creates a user. If a user already exists in Applozic db with same application_id, update the role of user to APPLICATION_WEB_ADMIN
 * so User can behave as kommunicate Agent. @see userService.handleCreateUserError
 * @param {Object} user to be created
 * 
 * @return {Object} userModel @see models/user.js
 */
const createUser =user=>{
  let aiPlatform = user.aiPlatform;
  return Promise.resolve(getCustomerInfoByApplicationId(user.applicationId)).then(customer=>{
    let role =user.type==2?"BOT":"APPLICATION_WEB_ADMIN";
    return Promise.resolve(applozicClient.createApplozicClient(user.userName,user.password,customer.applicationId,null,role,user.email,user.name)
    .catch(err=>{
      if(user.type===registrationService.USER_TYPE.AGENT){
      return handleCreateUserError(user,customer,err);
      }else{
        logger.error("error while creating user in applozic : ",err);
        throw err;
      }
    }))
    .then(applozicUser=>{
      console.log("created user in applozic db",applozicUser.userId);
      user.customerId=customer.id;
      user.apzToken=new Buffer(user.userName+":"+user.password).toString('base64');
      user.authorization = new Buffer(user.userName+":"+applozicUser.deviceKey).toString('base64');
      user.accessToken = user.password;
      user.userKey = applozicUser.userKey;
      user.password=bcrypt.hashSync(user.password, 10);
      return userModel.create(user).catch(err=>{
        logger.error("error while creating bot",err);
      }).then(user=>{
        if(user.type==registrationService.USER_TYPE.BOT){
          // keeping it async for now. 
          botPlatformClient.createBot({
            "name": user.userName,
            "key": user.userKey,
            "brokerUrl": applozicUser.brokerUrl,
            "accessToken": user.accessToken,
            "applicationKey": customer.applicationId,
            "authorization": user.authorization,
            "type": "KOMMUNICATE_SUPPORT",
            "handlerModule":aiPlatform=="dialogflow"?"DEFAULT_THIRD_PARTY_BOT_HANDLER":"DEFAULT_KOMMUNICATE_SUPPORT_BOT"
          }).catch(err=>{
            logger.error("error while creating bot platform",err);
          })
        }
        return user?user.dataValues:null;
      });
    }).catch(err=>{
      console.log("err while creating a user", err);
      throw err;
    });
  });
};
function businessHoursInGMT(newValue,timezone) {
    try{
    const openTime = moment.tz(newValue.openTime,"HH:mm:ss",timezone);
    openTime.day(newValue.day);
    // const inGMT = moment(openTime.toISOString(),"HH:mm:ss");
    const openingMomentGMT = moment.utc(openTime);
    newValue.openingDay = openingMomentGMT.format("dddd");
    newValue.openTime=openingMomentGMT.format("HH:mm:ss");

    const closeTime = moment.tz(newValue.closeTime,"HH:mm:ss",timezone);
    closeTime.day(newValue.day);
    const closingMomentGMT = moment.utc(closeTime);
    newValue.closingDay = closingMomentGMT.format("dddd");
    newValue.closeTime=closingMomentGMT.format("HH:mm:ss");
    return newValue;
    // console.log("opening day : ",inGMT.format("dddd"));
    // console.log("opening time : ",inGMT.format("HH:mm:ss"));
  }catch(err) {
    console.log("error while converting into GMT",err);
    throw err;
  }
}

const updateBusinessHoursOfUser = (userName,applicationId,businessHours,timezone,offHoursMessage)=>{
    // get the business hours from db and update.

    return db.sequelize.transaction(t=> {
      return db.BusinessHour.findAll({where: {user_name: userName,application_id: applicationId},transaction: t}).then(result=>{
        // console.log("got business hours from db ",result);
        // var updatePromiseArray = createUpdatePromiseArray(c,businessHours);
        // console.log("got business hours fromdb ", result);
          return Promise.all(businessHours.map(newValue=>{
            let isUpdated=false;

            let valuesInGMT = businessHoursInGMT(newValue,timezone);
              // console.log(" values in gmt :",valuesInGMT);
            if(result.length>=1) {
              for(let i=0; i<result.length; i++) {
                let fields ={};
                // console.log("old dtata",result[i].dataValues);
                const oldWorkingDay= result[i].dataValues.day?result[i].dataValues.day.toUpperCase():"";
                console.log("oldWorkingDay ",oldWorkingDay);
                console.log("new Openng day ",valuesInGMT.openingDay.toUpperCase());
                // check if day in local timezone matches
                if(newValue.day.toUpperCase()===oldWorkingDay) {
                  console.log("matched for day ",oldWorkingDay);
                  fields.offHoursMessage=offHoursMessage?offHoursMessage:result[i].dataValues.offHoursMessage;
                  fields.timezone = timezone?timezone:result[i].dataValues.timezone;
                  let valueToBeUpdated = Object.assign(result[i].dataValues,valuesInGMT,fields);
                  delete valueToBeUpdated.id;
                  console.log("returning from loop");
                  return updateBusinessHoursInDb(valueToBeUpdated,{userName: userName,applicationId: applicationId,day: result[i].dataValues.day},t);
                }else if(i===result.length-1&&!isUpdated) {
              // if we are here, means business hours for new day. persisting in db
                  var ohMessage = offHoursMessage?offHoursMessage:config.getProperties().defaultOffhoursMessage;
                  var bHobject = Object.assign(valuesInGMT,{userName: userName,applicationId: applicationId, timezone: timezone,offHoursMessage: ohMessage});
                  console.log("storing in db: new record for day", bHobject);
                  return insertBusinessHoursIntoDb(bHobject,t);
                }
              }
            }else{
              var ohMessage = offHoursMessage?offHoursMessage:config.getProperties().defaultOffhoursMessage;
              var bHobject = Object.assign(valuesInGMT,{userName: userName,applicationId: applicationId, timezone: timezone,offHoursMessage: ohMessage});
              console.log("storing in db: no record exists ", bHobject);
              return insertBusinessHoursIntoDb(bHobject,t);
            }
          console.log("out side for loop");
        }));
      }).catch(err=>{
        console.log("error while fetching business hours from db",err);
        throw err;
      });
    });
    // })
    // return db.BusinessHour.upsert({"day": "sunday","openTime":"9:00","closeTime":"9:00"},{where:{user_name:"engineering@applozic.com"}});
};

const updateBusinessHoursInDb=(data,criteria,t)=>{
  console.log("updating : data",data,"criteria :",criteria );
  return db.BusinessHour.update(data,{where: criteria,transaction: t});
};
/**
 * Returns the customer object for given applicationId @see models/customer.js
 * Ruturns null if no customer found
 * @param {String} applicationId
 * @return {Object} customer 
 */
const getCustomerInfoByApplicationId = applicationId=>{
  console.log("getting customer information from applicationId",applicationId);
  return db.customer.find({where: {applicationId: applicationId}}).then(customer=>{
    return customer?customer.dataValues:null;
  });
};

const insertBusinessHoursIntoDb=(businessHours, transaction)=>{
  return db.BusinessHour.create(businessHours,{transaction: transaction});
};

const getAdminUserByAppId = (appId)=> {
  if(stringUtils.isBlank(appId)) {
    console.log("empty appid received");
    throw new Error("application id is empty");
  }
  return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
    if(!customer) {
      return null;
    }
    return userModel.findOne({where: {customerId: customer.id, type: 3}}).then(user => {
      console.log("found data for user : ",user==null?null:user.dataValues);
      return user!==null?user.dataValues:null;
    });
  });
};

const getByUserNameAndAppId= (userName,appId)=>{
  if(stringUtils.isBlank(userName)||stringUtils.isBlank(appId)) {
    console.log("empty userName received");
    throw new Error("userName or application id is empty");
  }else if(stringUtils.isBlank(userName)) {
    console.log("empty userName received");
    throw new Error("userName or application id is empty");
  }else if(stringUtils.isBlank(appId)) {
    console.log("empty appId received");
    throw new Error("userName or application id is empty");
  }
  return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
    if(!customer) {
      return null;
    }
    return userModel.findOne({where: {userName: userName,customerId: customer.id}}).then(user => {
      console.log("found data for user : ",user==null?null:user.dataValues);
      return user!==null?user.dataValues:null;
    });
  });
};

const processOffBusinessHours = (message, todaysBusinessHours)=>{
  const groupId = message.groupId;
  const applicatioId = message.applicationKey;
  if(!message || !todaysBusinessHours) {
    throw new Error("messsage or userBusinessHoursConfig cant be empty");
  }
  let metadata = {from: "KOMMUNICATE_AGENT"};
  return Promise.resolve(applozicClient.sendGroupMessage(groupId,todaysBusinessHours.off_hours_message,todaysBusinessHours.apz_token,todaysBusinessHours.application_id,metadata)).then(message=>{
        if(message.status==200) {
          console.log("message sent..");
          return;
        }
  }).catch(err=>{
    throw err;
  });
};

const getByUserKey=userKey=>{
  if(!userKey) {
    throw new Error("userKey is Empty");
  }
  console.log("getting user information for key :",userKey);
  return Promise.resolve(db.user.findOne({where: {userKey: userKey}}));
};

const getUserBusinessHoursByUserKey=userKey=>{
  console.log("getting user's bussiness hours by userKey");
  return Promise.resolve(db.sequelize.query("SELECT c.application_id,u.*,bh.* FROM users u JOIN business_hours bh ON  u.user_name = bh.user_name JOIN customers c ON u.customer_id = c.id  WHERE u.user_key = :userKey",{replacements: {"userKey": userKey},type: db.sequelize.QueryTypes.SELECT}));
};
const getUserBusinessHoursByUserNameAndAppId = (userName,applicationId)=>{
  console.log("getting user's bussiness hours by userName and appId", userName,applicationId);
  return Promise.resolve(db.sequelize.query("SELECT c.application_id,u.*,bh.* FROM business_hours bh JOIN customers c ON  bh.application_id = c.application_id AND  bh.application_id= :applicationId AND bh.user_name =:userName JOIN users  u ON u.customer_id =c.id and u.user_name=:userName",{replacements: {"userName": userName,"applicationId": applicationId},type: db.sequelize.QueryTypes.SELECT}));
};

const getConfigIfCurrentTimeOutOfBusinessHours = userBusinessHours=>{
  if(!userBusinessHours)return false;
    const today = moment().format("dddd").toUpperCase();
    console.log("today ",today);
    console.log("businessHours",userBusinessHours);

    for(let i=0; i<userBusinessHours.length; i++) {
      if(userBusinessHours[i].opening_day==today || userBusinessHours[i].closing_day ==today) {
        const openTime = moment(userBusinessHours[i].open_time,"HH:mm:ss");
        openTime.day(userBusinessHours[i].opening_day);
        const closeTime = moment(userBusinessHours[i].close_time,"HH:mm:ss");
        closeTime.day(userBusinessHours[i].closing_day);
        let currentTime = moment();
        if(currentTime.isBefore(openTime) || currentTime.isAfter(closeTime)) {
          console.log("I am out of business hours. send automated message to user");
          return userBusinessHours[i];
        }
        // console.log("today", today, "currentTime",currentTime,"openTime",openTime,"closeTime",closeTime,"openingDay",openingDay,"closingDay",closingDay);
      }
    }

return null;
};

const isIntervalExceeds= (userBusinessHours) => {
  const interval = config.getProperties().offBussinessHoursMessageInterval;
  const key = userBusinessHours[0].user_name+"-"+userBusinessHours[0].application_id;
  const mapPrifix = config.getEnvId()+"-businessHoursMessageSentMap";
  return Promise.resolve(cacheClient.getDataFromMap(mapPrifix,key)).then(value=>{
    return new Date().getTime()>(value+(interval*60*1000));
  });
};
const getAdminUserNameFromGroupInfo = response=>{
if(!response) {
  throw new Error("group Info is empty");
}
  groupUsers = response.groupUsers;
  console.log("group users",groupUsers);
  for(let i= 0; i<Object.keys(groupUsers).length; i++) {
    if((Object.values(groupUsers)[i]).role ===1) {
      return (Object.values(groupUsers)[i]).userId;
      // console.log("groupName",displayName);
    }
  }
  return null;
};

exports.updateUser = (userId, appId, userInfo) => {
  return Promise.all([getByUserNameAndAppId(userId, appId),emailValidation(userInfo.email)])
    .then(([user,isvalid]) => {
      if (user == null) {
        throw new Error("No customer in customer table with appId", appId);
      }
      if(user.email!=userInfo.email && isvalid){
        var error = new Error("user already exist for this email");
        error.code='DUPLICATE_EMAIL';
        throw error;
      }
      let userDetail={userId:userId, displayName:userInfo.name, email:userInfo.email,phoneNumber:userInfo.contactNo};
      applozicClient
        .updateApplozicClient(user.userName, user.accessToken, appId, userDetail)
        .then(response => {
          console.log("Applozic update user response: " + response);
        });
      return userModel.update(userInfo, {
        where: { userName: userId, customerId: user.customerId }
      });
    })
    .catch(err => {
      console.log("error while updating user", err);
      throw err;
    });
};

exports.goAway = (userId, appId)=>{
    return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
      if(!customer) {
        console.log("No customer in customer table with appId", appId);
        return null;
      }else {
        return Promise.resolve(userModel.update({ availabilityStatus: 0 }, {where: {"userName": userId, customerId: customer.id}})).then(result=>{
          console.log("successfully updated user status to offline",result[0]);
          return result[0];
        }).catch(err=>{
          console.log("error while updating user",err);
          throw err;
        });
      }
    });
};

exports.goOnline = (userId, appId)=>{
    return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
      if(!customer) {
        console.log("No customer in customer table with appId", appId);
        return null;
      }else {
        return Promise.resolve(userModel.update({ availabilityStatus: 1 }, {where: {"userName": userId, customerId: customer.id}})).then(result=>{
          console.log("successfully updated user status to online",result[0]);
          return result[0];
        }).catch(err=>{
          console.log("error while updating user",err);
          throw err;
        });
      }
    });
};
/**
 * Get list of all users if type is not specified.
 * Specify type to filter users  1:Agents, 2: Bots
 * @param {Object} customer
 * @param {number} customer.id 
 * @param {Array} type 
 * @return {Object} 
 */
const getAllUsersOfCustomer = (customer,type)=>{
  logger.info("fetching Users for customer, ",customer.id);
  let criteria={customerId:customer.id};
  var a = Op.or;
  if(type){
    criteria.type= {[Op.or]:type};
  }
  return Promise.resolve(userModel.findAll({where:criteria}));
}
/**
 * update a new password for user
 * @param {String} newPassword 
 * @param {Object} user
 * @param {Number} user.id
 * @param {Number} user.customerId
 * @param {String} user.userName
 */
exports.updatePassword=(newPassword,user)=>{
  logger.info("updating password for user Id: ",user.id);
  return db.sequelize.transaction(t=> {
    let apzToken = new Buffer(user.userName+":"+newPassword).toString('base64');
    return Promise.all([registrationService.getCustomerById (user.customerId),bcrypt.hash(newPassword,10)])
    .then(([customer,hash])=>{
      return Promise.all([applozicClient.updatePassword({newPassword:newPassword,oldPassword:user.accessToken,applicationId:customer.applicationId,userName:user.userName}),
        db.user.update({accessToken :newPassword, password : hash,apzToken:apzToken },{where:{id:user.id},transaction:t}), 
        db.customer.update({accessToken :newPassword, password : hash,apzToken:apzToken },{where:{userName:user.id},transaction:t})])
        .then(([res1,res2,res3])=>{
            console.log("password updated successfully in all dbs for agent", user.userName);
            return {"code":"SUCCESS"}
        });
      })
  });
}
const getUserDisplayName=(user)=>{
  if(user.name){
    return user.name;
  } else if (user.userName){
    return userInfo.userName;
  }else {
    return user.email;
  }
}
/**
 * returns list of the all agents whos avaibility status is 1.
 * 
 * @param {Object} customer 
 * @param {Number} customer.id
 */
const getAvailableAgents = (customer)=>{
  logger.info("fetching list of available agents for customer",customer.id);
  let criteria={customerId:customer.id,
                type:{[Op.or]:[registrationService.USER_TYPE.ADMIN,registrationService.USER_TYPE.AGENT]},
                availabilityStatus:CONST.AVAIBILITY_STATUS.AVAILABLE};
  return Promise.resolve(userModel.findAll({where:criteria}));

}

const emailValidation = (email) => {
  return Promise.resolve(userModel.findAll({ where: { email: email } })).then(users => {
    return users.length > 0;
  });
}

const getUsersByCustomerId = (customerId) => {
  let criteria = {
    customerId: customerId,
    type: { [Op.or]: [registrationService.USER_TYPE.ADMIN, registrationService.USER_TYPE.AGENT] }
  };
  return Promise.resolve(userModel.findAll({ where: criteria })).then(users => {
    return users;
  });
}
const changeBotStatus =(botId, appId, status)=>{
  return getByUserNameAndAppId(botId, appId).then(bot=>{
    return Promise.resolve(userModel.update({allConversations:status},{where:{id:bot.id}}));
  })
}

exports.changeBotStatus = changeBotStatus;
exports.getUserDisplayName = getUserDisplayName;
exports.getUserByName = getUserByName;
exports.updateBusinessHoursOfUser=updateBusinessHoursOfUser;
exports.createUser=createUser;
exports.getCustomerInfoByApplicationId=getCustomerInfoByApplicationId;
exports.getAdminUserByAppId = getAdminUserByAppId;
exports.getByUserNameAndAppId = getByUserNameAndAppId;
exports.processOffBusinessHours = processOffBusinessHours;
exports.getByUserKey = getByUserKey;
exports.getUserBusinessHoursByUserKey=getUserBusinessHoursByUserKey;
exports.getConfigIfCurrentTimeOutOfBusinessHours=getConfigIfCurrentTimeOutOfBusinessHours;
exports.isIntervalExceeds= isIntervalExceeds;
exports.getAdminUserNameFromGroupInfo = getAdminUserNameFromGroupInfo;
exports.getUserBusinessHoursByUserNameAndAppId=getUserBusinessHoursByUserNameAndAppId;
exports.getAllUsersOfCustomer= getAllUsersOfCustomer;
exports.getAvailableAgents= getAvailableAgents;
exports.getUsersByCustomerId=getUsersByCustomerId;