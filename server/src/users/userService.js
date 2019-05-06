/*eslint-disable */
const routes = require("../routers/routes.js");
const userModel = require("../models").user;
const db = require("../models");
const Op = db.Sequelize.Op;
const stringUtils = require("underscore.string");
const applozicClient = require("../utils/applozicClient");
const config = require("../../conf/config");
const registrationService = require("../register/registrationService");
const bcrypt = require("bcrypt");
const teammateInviteModel = require("../models").teammateInvite;
let moment = require('moment-timezone');
const KOMMUNICATE_APPLICATION_KEY = config.getProperties().kommunicateParentKey;
const KOMMUNICATE_ADMIN_ID = config.getProperties().kommunicateAdminId;
const KOMMUNICATE_ADMIN_PASSWORD = config.getProperties().kommunicateAdminPassword;
const cacheClient = require("../cache/hazelCacheClient");
const logger = require('../utils/logger');
const botPlatformClient = require("../utils/botPlatformClient");
const customerService = require('../customer/customerService');
const deepmerge = require('deepmerge');
const chargebeeService = require('../chargebee/chargebeeService');
const activeCampaignClient = require("../activeCampaign/activeCampaignClient");
const subscriptionPlans = require('../register/subscriptionPlans');
const USER_CONSTANTS = require("../users/constants.js");
const FREE_BOTS_COUNT = 2; //'bot' and 'liz' are free
const {ONBOARDING_STATUS}= require('../utils/constant');
const onboardingService = require('../onboarding/onboardingService');
const userAuthenticationService = require('../userAuthentication/userAuthenticationService.js');

/*
this method returns a promise which resolves to the user instance, rejects the promise if user not found in db.
*/
const getUserByName = userName => {
  if (stringUtils.isBlank(userName)) {
    console.log("empty userName received");
    throw new Error("userName is Empty");
  }
  return new Promise((resolve, reject) => {
    console.log("fetching data for userName : ", userName);
    userModel.findOne({ where: { userName: userName } }).then(user => {
      console.log("found data for user, id : ", user == null ? null : user.id);
      return user !== null ? resolve(user.dataValues) : resolve(null);
    }, err => {
      console.log("err", err);
      return reject(err);
    }).catch(err => {
      console.log("error while fetching data from db : ", err);
      throw (err);
    });
  });
};
const getInvitedUser = (appId) => {
let criteria = {
  applicationId: appId
}
    return teammateInviteModel.findAll({ where: criteria, paranoid: false}).then(result => {
      return result;
  }).catch(err => {
    throw err;
  });
};

const getInvitedUserList = (inviteUser,appId) => {
  var  invitedUserList =[];
  for (var i = 0; i < inviteUser.length; i++) {
    invitedUserList[i] =inviteUser[i].invitedUser;
  }
  return teammateInviteModel.findAll({ where: { invitedUser: {$in: invitedUserList },applicationId:appId}, paranoid: false }).then(result => {
     return result;
    }).catch(err => {
      throw err;
    });
  };

const getInvitedAgentDetail = (reqId) => {
  return teammateInviteModel.find({ where: { id: reqId } }).then(result => {
    return result;
  }).catch(err => {
    throw err;
  });
};

const updateDeletedInvitation = (inviteteam) => {
  let criteria = {
    applicationId: inviteteam.applicationId,
      invitedUser: inviteteam.to[0],
      deleted_at: {$ne:null}
  }
  return teammateInviteModel.update({ deleted_at: null }, { where: criteria, paranoid: false
  }).then(result => {
    return result})
  .catch(err => {
    throw err;
  });
}

const inviteTeam = (inviteteam) => {
  return getByUserNameAndAppId(inviteteam.agentId, inviteteam.applicationId).then(user => {
    var invites = [];
    inviteteam.invitedBy = user.userKey;
    inviteteam.status = 0;
    for (var i = 0; i < inviteteam.to.length; i++) {
      inviteteam.invitedUser = inviteteam.to[i];
      invites.push(inviteteam);
    }
    if (inviteteam.resendMail) {
      return Promise.resolve(updateDeletedInvitation(inviteteam)).then(data => {
        return teammateInviteModel.findAll({ where: { applicationId: inviteteam.applicationId, invitedUser: inviteteam.to[0] } });
      });
    } else {
      return Promise.resolve(getInvitedUserList(invites,inviteteam.applicationId)).then(dbResult => {
        dbResult.find(function (item, i) {
            var index = invites.findIndex(invite => (item.invitedUser));
            if (index !== -1) {
              invites.splice(index, 1);
            }
        });
        if (invites.length > 0) {
         return teammateInviteModel.bulkCreate(invites).then(result => {//spread
            onboardingService.insertOnboardingStatus({applicationId:inviteteam.applicationId, stepId:ONBOARDING_STATUS.TEAM_INVITATION_SENT, completed:true});
            logger.info("invitation mail inserted successfully", result);
            return result;
          }).catch(err => {
            logger.error("error while inserting invitation mail", err);
            throw err;
          });
        }
        return dbResult;
      })
   }
  }).catch(err => {
    throw err;
  });
}

const inviteStatusUpdate = (reqId, reqstatus) => {
  if (reqstatus) {
    return teammateInviteModel.update({ status: reqstatus }, { where: { id: reqId } }).catch(err => {
      throw err;
    });
  }
  return "status not found";

}

/**
 * This method will catch USER_ALREADY_EXIST error, and update the role of that user to APPLICATION_WEB_ADMIN.
 * @param {User} user newuser object
 * @param {Object} customer customer object
 * @param {Objetc} err - error returned by applozic login/register API.
 */
let handleCreateUserError = (user, customer, err) => {
  console.log("catching the user Already exists. error", err);
  if (err && err.code == "USER_ALREADY_EXISTS" && err.data) {
    console.log("updating role to application web admin");
    const data = err.data;
    return Promise.resolve(applozicClient.updateApplozicClient(user.userName, user.password, customer.applications[0].applicationId, { userId: user.userName, roleName: USER_CONSTANTS.APPLOZIC_USER_ROLE_TYPE.APPLICATION_WEB_ADMIN.name }, { apzToken: new Buffer(KOMMUNICATE_ADMIN_ID + ":" + KOMMUNICATE_ADMIN_PASSWORD).toString("base64") }, false, "false")).then(response => {
      return err.data;
    })
  } else {
    logger.error(" error :", err);
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
const createUser = (user, customer) => {
  let aiPlatform = user.aiPlatform;
  let botName = user.botName;
  let clientToken = user.clientToken;
  let type = user.type;
  let devToken = user.devToken;
  let userId = user.userId ? user.userId.toLowerCase() : "";
  user.userName ? (user.userName = user.userName.toLowerCase()) : "";
  let role = user.type == 2 ? USER_CONSTANTS.APPLOZIC_USER_ROLE_TYPE.BOT.name : USER_CONSTANTS.APPLOZIC_USER_ROLE_TYPE.APPLICATION_WEB_ADMIN.name;
  let password = bcrypt.hashSync(user.password, 10); 
  return Promise.all([applozicClient.createApplozicClient(user.userName, user.password, user.applicationId, null, role, user.email, user.name, undefined, user.imageLink), userAuthenticationService.createUserAuthentication({"userName": user.userName, "password": password})]).catch(err => {
    if (user.type === registrationService.USER_TYPE.AGENT) {
      return handleCreateUserError(user, customer, err);
    } else {
      logger.error("error while creating user in applozic : ", err);
      throw err;
    }
  }).then(([applozicUser, authentication]) => {
    console.log("created user in applozic db", applozicUser.userId);
    let authorization = new Buffer(applozicUser.userId + ":" + applozicUser.deviceKey).toString('base64');
    user.accessToken = user.password;
    user.userKey = applozicUser.userKey;
    user.password = password;
    user.imageLink = applozicUser.imagelink;
    user.roleType = (user.type === 2)? USER_CONSTANTS.ROLE_TYPE.BOT:user.roleType;
    user.authenticationId = authentication.id;

    let botUser =  {
      "name": user.userName,
      "key": user.userKey,
      "brokerUrl": applozicUser.brokerUrl,
      "accessToken": user.accessToken,
      "applicationKey": customer.applications[0].applicationId,
      "authorization": authorization,
      "clientToken": clientToken,
      "devToken": devToken,
      "aiPlatform": aiPlatform,
      "type": "KOMMUNICATE_SUPPORT",
      "handlerModule":user.handlerModule?user.handlerModule:(aiPlatform ? "DEFAULT_THIRD_PARTY_BOT_HANDLER" : "DEFAULT_KOMMUNICATE_SUPPORT_BOT"),
      "googleClientEmail":user.googleClientEmail,
      "googlePrivateKey":user.googlePrivateKey,
      "projectId":user.projectId
    };
  
    return userModel.create(user).catch(err => {
      logger.error("error while creating bot", err);
    }).then(user => {
      updateSubscriptionQuantity(user, 1);
      if (user.type == registrationService.USER_TYPE.BOT) {
        // keeping it async for now.
        botPlatformClient.createBot(botUser).catch(err => {
          logger.error("error while creating bot platform", err);
        })
      } else {
        activeCampaignClient.addContact({"product": customer.product, "appId": customer.applications[0].applicationId, "email": user.email, "name": user.name, "orgname": customer.userName, "tags": customer.product + "-Team-Member" });
      }
      return user ? user.dataValues : null;
    }).catch(err => {
      console.log("err while creating a user", err);
      throw err;
    });
  })
};

function businessHoursInGMT(newValue, timezone) {
  try {
    const openTime = moment.tz(newValue.openTime, "HH:mm:ss", timezone);
    openTime.day(newValue.day);
    // const inGMT = moment(openTime.toISOString(),"HH:mm:ss");
    const openingMomentGMT = moment.utc(openTime);
    newValue.openingDay = openingMomentGMT.format("dddd");
    newValue.openTime = openingMomentGMT.format("HH:mm:ss");

    const closeTime = moment.tz(newValue.closeTime, "HH:mm:ss", timezone);
    closeTime.day(newValue.day);
    const closingMomentGMT = moment.utc(closeTime);
    newValue.closingDay = closingMomentGMT.format("dddd");
    newValue.closeTime = closingMomentGMT.format("HH:mm:ss");
    return newValue;
    // console.log("opening day : ",inGMT.format("dddd"));
    // console.log("opening time : ",inGMT.format("HH:mm:ss"));
  } catch (err) {
    console.log("error while converting into GMT", err);
    throw err;
  }
}

const updateBusinessHoursOfUser = (userName, applicationId, businessHours, timezone, offHoursMessage) => {
  // get the business hours from db and update.

  return db.sequelize.transaction(t => {
    return db.BusinessHour.findAll({ where: { user_name: userName, application_id: applicationId }, transaction: t }).then(result => {
      // console.log("got business hours from db ",result);
      // var updatePromiseArray = createUpdatePromiseArray(c,businessHours);
      // console.log("got business hours fromdb ", result);
      return Promise.all(businessHours.map(newValue => {
        let isUpdated = false;

        let valuesInGMT = businessHoursInGMT(newValue, timezone);
        // console.log(" values in gmt :",valuesInGMT);
        if (result.length >= 1) {
          for (let i = 0; i < result.length; i++) {
            let fields = {};
            // console.log("old dtata",result[i].dataValues);
            const oldWorkingDay = result[i].dataValues.day ? result[i].dataValues.day.toUpperCase() : "";
            console.log("oldWorkingDay ", oldWorkingDay);
            console.log("new Openng day ", valuesInGMT.openingDay.toUpperCase());
            // check if day in local timezone matches
            if (newValue.day.toUpperCase() === oldWorkingDay) {
              console.log("matched for day ", oldWorkingDay);
              fields.offHoursMessage = offHoursMessage ? offHoursMessage : result[i].dataValues.offHoursMessage;
              fields.timezone = timezone ? timezone : result[i].dataValues.timezone;
              let valueToBeUpdated = Object.assign(result[i].dataValues, valuesInGMT, fields);
              delete valueToBeUpdated.id;
              console.log("returning from loop");
              return updateBusinessHoursInDb(valueToBeUpdated, { userName: userName, applicationId: applicationId, day: result[i].dataValues.day }, t);
            } else if (i === result.length - 1 && !isUpdated) {
              // if we are here, means business hours for new day. persisting in db
              var ohMessage = offHoursMessage ? offHoursMessage : config.getProperties().defaultOffhoursMessage;
              var bHobject = Object.assign(valuesInGMT, { userName: userName, applicationId: applicationId, timezone: timezone, offHoursMessage: ohMessage });
              console.log("storing in db: new record for day", bHobject);
              return insertBusinessHoursIntoDb(bHobject, t);
            }
          }
        } else {
          var ohMessage = offHoursMessage ? offHoursMessage : config.getProperties().defaultOffhoursMessage;
          var bHobject = Object.assign(valuesInGMT, { userName: userName, applicationId: applicationId, timezone: timezone, offHoursMessage: ohMessage });
          console.log("storing in db: no record exists ", bHobject);
          return insertBusinessHoursIntoDb(bHobject, t);
        }
        console.log("out side for loop");
      }));
    }).catch(err => {
      console.log("error while fetching business hours from db", err);
      throw err;
    });
  });
  // })
  // return db.BusinessHour.upsert({"day": "sunday","openTime":"9:00","closeTime":"9:00"},{where:{user_name:"engineering@applozic.com"}});
};

const updateBusinessHoursInDb = (data, criteria, t) => {
  console.log("updating : data", data, "criteria :", criteria);
  return db.BusinessHour.update(data, { where: criteria, transaction: t });
};
/**
 * Returns the customer object for given applicationId @see models/customer.js
 * Ruturns null if no customer found
 * @param {String} applicationId
 * @return {Object} customer

const getCustomerInfoByApplicationId = applicationId=>{
  console.log("getting customer information from applicationId",applicationId);
  return db.customer.find({where: {applicationId: applicationId}}).then(customer=>{
    return customer?customer.dataValues:null;
  });
};
*/

const insertBusinessHoursIntoDb = (businessHours, transaction) => {
  return db.BusinessHour.create(businessHours, { transaction: transaction });
};

const getAdminUserByAppId = (appId) => {
  if (stringUtils.isBlank(appId)) {
    console.log("empty appid received");
    throw new Error("application id is empty");
  }
  return userModel.findOne({ where: { applicationId: appId, type: 3 } }).then(user => {
    console.log("found data for user, id : ", user == null ? null : user.id);
    return user !== null ? user : null;
  });
};

const getByUserNameAndAppId = (userName, appId) => {
  if (stringUtils.isBlank(userName)) {
    console.log("empty userName received");
    throw new Error("userName or application id is empty");
  } else if (stringUtils.isBlank(appId)) {
    console.log("empty appId received");
    throw new Error("userName or application id is empty");
  }
  return userModel.findOne({ where: { userName: userName, applicationId: appId } }).then(user => {
    console.log("found data for user, id : ", user == null ? null : user.id);
    return user !== null ? user.dataValues : null;
  });

};

const processOffBusinessHours = (message, todaysBusinessHours) => {
  const groupId = message.groupId;
  const applicationId = message.applicationKey;
  if (!message || !todaysBusinessHours) {
    throw new Error("messsage or userBusinessHoursConfig cant be empty");
  }
  let metadata = { from: "KOMMUNICATE_AGENT" };
  return Promise.resolve(applozicClient.sendGroupMessage(groupId, todaysBusinessHours.off_hours_message, todaysBusinessHours.apz_token, todaysBusinessHours.application_id, metadata)).then(message => {
    if (message.status == 200) {
      console.log("message sent..");
      return;
    }
  }).catch(err => {
    throw err;
  });
};

const getByUserKey = userKey => {
  if (!userKey) {
    throw new Error("userKey is Empty");
  }
  console.log("getting user information for key :", userKey);
  return Promise.resolve(db.user.findOne({ where: { userKey: userKey } }));
};

const getUserBusinessHoursByUserKey = userKey => {
  console.log("getting user's bussiness hours by userKey");
  return Promise.resolve(db.sequelize.query("SELECT c.application_id,u.*,bh.* FROM users u JOIN business_hours bh ON  u.user_name = bh.user_name JOIN customers c ON u.customer_id = c.id  WHERE u.user_key = :userKey", { replacements: { "userKey": userKey }, type: db.sequelize.QueryTypes.SELECT }));
};
const getUserBusinessHoursByUserNameAndAppId = (userName, applicationId) => {
  console.log("getting user's bussiness hours by userName and appId", userName, applicationId);
  return Promise.resolve(db.sequelize.query("SELECT c.application_id,u.*,bh.* FROM business_hours bh JOIN customers c ON  bh.application_id = c.application_id AND  bh.application_id= :applicationId AND bh.user_name =:userName JOIN users  u ON u.customer_id =c.id and u.user_name=:userName", { replacements: { "userName": userName, "applicationId": applicationId }, type: db.sequelize.QueryTypes.SELECT }));
};

const getConfigIfCurrentTimeOutOfBusinessHours = userBusinessHours => {
  if (!userBusinessHours) return false;
  const today = moment().format("dddd").toUpperCase();
  console.log("today ", today);
  console.log("businessHours", userBusinessHours);

  for (let i = 0; i < userBusinessHours.length; i++) {
    if (userBusinessHours[i].opening_day == today || userBusinessHours[i].closing_day == today) {
      const openTime = moment(userBusinessHours[i].open_time, "HH:mm:ss");
      openTime.day(userBusinessHours[i].opening_day);
      const closeTime = moment(userBusinessHours[i].close_time, "HH:mm:ss");
      closeTime.day(userBusinessHours[i].closing_day);
      let currentTime = moment();
      if (currentTime.isBefore(openTime) || currentTime.isAfter(closeTime)) {
        console.log("I am out of business hours. send automated message to user");
        return userBusinessHours[i];
      }
      // console.log("today", today, "currentTime",currentTime,"openTime",openTime,"closeTime",closeTime,"openingDay",openingDay,"closingDay",closingDay);
    }
  }

  return null;
};

const isIntervalExceeds = (userBusinessHours) => {
  const interval = config.getProperties().offBussinessHoursMessageInterval;
  const key = userBusinessHours[0].user_name + "-" + userBusinessHours[0].application_id;
  const mapPrifix = config.getEnvId() + "-businessHoursMessageSentMap";
  return Promise.resolve(cacheClient.getDataFromMap(mapPrifix, key)).then(value => {
    return new Date().getTime() > (value + (interval * 60 * 1000));
  });
};
const getAdminUserNameFromGroupInfo = response => {
  if (!response) {
    throw new Error("group Info is empty");
  }
  groupUsers = response.groupUsers;
  console.log("group users", groupUsers);
  for (let i = 0; i < Object.keys(groupUsers).length; i++) {
    if ((Object.values(groupUsers)[i]).role === 1) {
      return (Object.values(groupUsers)[i]).userId;
      // console.log("groupName",displayName);
    }
  }
  return null;
};

exports.updateUser = (userId, appId, userInfo) => {
  var email = userInfo.email ? userInfo.email : null;
  return Promise.all([getByUserNameAndAppId(userId, appId)])
    .then(([user]) => {
      if (user == null) {
        throw new Error("No customer found with the application Id "+appId);
      }
      var userKey = user.userKey;
      let userDetail = { userId: userId, displayName: userInfo.name, email: userInfo.email, phoneNumber: userInfo.contactNo };
      applozicClient.updateApplozicClient(user.userName, user.accessToken, appId, userDetail, null, user.type === registrationService.USER_TYPE.BOT)
        .then(response => {
          console.log("Applozic update user response: " + response);
        })
      return userModel.update(userInfo, {
        where: { userName: userId, applicationId: user.applicationId }

      }).then(function (updateResult) {
        if (user.type == registrationService.USER_TYPE.BOT) {
          // keeping it async for now.
          if (userInfo.deleted_at != null) {
            updateSubscriptionQuantity(user, -1);
          }
          botPlatformClient.updateBot({
            "key": userKey,
            "clientToken": userInfo.clientToken,
            "devToken": userInfo.devToken,
            "deleted": userInfo.deleted_at != null
          }).catch(err => {
            logger.error("error while updating bot platform", err);
          });
          return updateResult ? updateResult.length : 0;
        } else {
          return updateResult;
        }
      });
    })
    .catch(err => {
      console.log("error while updating user", err);
      throw err;
    });
};
const updateOnlyKommunicateUser = (userId, appId, userInfo) => {
  return userModel.update(userInfo, { where: { userName: userId, applicationId: appId } }).then(result=>{
    return "success";
  });
}
const updateUserStatus = (userId, appId, status) => {
  return Promise.resolve(userModel.update({status: status }, { where: { "userName": userId, applicationId: appId } })).then(result => {
    console.log("successfully updated user status ", result[0]);
    return result[0];
  }).catch(err => {
    console.log("error while updating user status", err);
    throw err;
  });
}

exports.goAway = (userId, appId) => {
  // return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
  //   if(!customer) {
  //     console.log("No customer in customer table with appId", appId);
  //     return null;
  //   }else {
  return Promise.resolve(userModel.update({ status: 0 }, { where: { "userName": userId, applicationId: appId } })).then(result => {
    console.log("successfully updated user status to offline", result[0]);
    return result[0];
  }).catch(err => {
    console.log("error while updating user", err);
    throw err;
  });
  //   }
  // });
};

exports.goOnline = (userId, appId) => {
  // return Promise.resolve(getCustomerInfoByApplicationId(appId)).then(customer=>{
  //   if(!customer) {
  //     console.log("No customer in customer table with appId", appId);
  //     return null;
  //   }else {
  return Promise.resolve(userModel.update({ status: 1 }, { where: { "userName": userId, applicationId: appId } })).then(result => {
    console.log("successfully updated user status to online", result[0]);
    return result[0];
  }).catch(err => {
    console.log("error while updating user", err);
    throw err;
  });
  //   }
  // });
};
/**
 * Get count of users 
 * Specify type to filter users  1: Agents, 2: Bots
 * @param {String} applicationId
 * @param {Array} type
 * @return {Number}
 */
const getUsersCountByTypes = (applicationId, type) => {
  logger.info("fetching Users count for customer, ", applicationId);
  let criteria = { applicationId: applicationId };
  if (type) {
    criteria.type = { $in: type };
  }
  return Promise.resolve(userModel.count({ where: criteria})).then(result => {
    return result;
  }).catch(err => {
    logger.info('error while getting users count', err);
    throw err;
  });
}
/**
 * Get list of all users if type is not specified.
 * Specify type to filter users  1:Agents, 2: Bots
 * @param {String} applicationId
 * @param {Array} type
 * @return {Object}
 */
const getUsersByAppIdAndTypes = (applicationId, type, order) => {
  logger.info("fetching Users for customer, ", applicationId);
  let criteria = { applicationId: applicationId };
  if (type) {
    criteria.type = { $in: type };
  }
  order =  order ? order : [['name', 'ASC']];
  return Promise.resolve(userModel.findAll({ where: criteria, order})).then(result => {
    return result;
  }).catch(err => {
    logger.info('error while getting all users', err);
    throw err;
  });
}
/**
 * update a new password for user
 * @param {String} newPassword
 * @param {Object} user
 * @param {Number} user.id
 * @param {String} user.userName
 */
exports.updatePassword = (newPassword, user) => {
  logger.info("updating password for user Id: ", user.id);
  return db.sequelize.transaction(t => {
    let apzToken = new Buffer(user.userName + ":" + newPassword).toString('base64');
    return Promise.all([customerService.getCustomerByApplicationId(user.applicationId), bcrypt.hash(newPassword, 10)])
      .then(([customer, hash]) => {
        return Promise.all([applozicClient.updatePassword({ newPassword: newPassword, oldPassword: user.accessToken, applicationId: user.applicationId, userName: user.userName }),
        db.user.update({ accessToken: newPassword, password: hash, apzToken: apzToken }, { where: { id: user.id }, transaction: t }),
        db.customer.update({ accessToken: newPassword, password: hash, apzToken: apzToken }, { where: { userName: user.userName }, transaction: t })])
          .then(([res1, res2, res3]) => {
            console.log("password updated successfully in all dbs for agent", user.userName);
            return { "code": "SUCCESS" }
          });
      })
  });
}
const getUserDisplayName = (user) => {
  if (user.name) {
    return user.name;
  } else if (user.userName) {
    return user.userName;
  } else {
    return user.email;
  }
}

const emailValidation = (email) => {
  if (email == null) {
    return true
  }
  return Promise.resolve(userModel.findAll({ where: { email: email } })).then(users => {
    return users.length > 0;
  });
}

const changeBotStatus = (botId, appId, status) => {
  return Promise.resolve(userModel.update({ allConversations: status }, { where: { userName: botId, applicationId: appId } }));

}

const getAgentByUserKey = (userKey) => {
  logger.info("getting user detail from userKey : ", userKey);
  return Promise.resolve(userModel.findOne({ where: { userKey: userKey } })).then(user => {
    if (user) {
      return getCustomerByApplicationId(user.applicationId);
    } else {
      throw new Error("User Not found");
    }
  });
}
/**
 * 
 * @param {String} userName
 * @param {String} apiKey
 * @param {Object} metadata
 */
const updateThirdPartyData = (userName, apiKey, metadata) => {
  return applozicClient.getUserDetails([userName], null, null, null, apiKey).then(result => {
   let  userDetail = result[0];
    if(userDetail){
    let kmThirdPartyData =
      userDetail.metadata && userDetail.metadata.KM_THIRD_PARTY_DATA ?
        JSON.parse(userDetail.metadata.KM_THIRD_PARTY_DATA) :
        null;
    if (null == kmThirdPartyData) {
      kmThirdPartyData = metadata;
    } else {
      kmThirdPartyData = deepmerge(kmThirdPartyData, metadata);
    }
    return applozicClient.updateApplozicUser({ userId: userName, metadata: { KM_THIRD_PARTY_DATA: JSON.stringify(kmThirdPartyData) } },
      { "Api-Key": apiKey }
    ).then(result => {
        return result;
       });
      }else{
        // user not found
        let err = {"code":"NOT_FOUND"};
        throw err;
      }
  })
    .catch(err => {
      err.code =err.response&& err.response.status;
      throw err;
    });
};
/**
 * 
 * @param {String} userName 
 * @param {String} applicationId 
 * @param {boolean} deactivate 
 */
const activateOrDeactivate = (userNames, applicationId, deactivate) => {
  let func = userNames.map(user => {
    return activateOrDeactivateUser(user, applicationId, deactivate);
  })
  return Promise.all(func).then(data => {
    return { result: 'success', data: data };
  }).catch(err => {
    console.log(err);
    throw err;
  })
}
const activateOrDeactivateUser = (userName, applicationId, deactivate) => {
  if (deactivate) {
    return getByUserNameAndAppId(userName, applicationId).then(user => {
      if (user !== null) {
        return userModel.update({ deleted_at: new Date(), status: USER_CONSTANTS.USER_STATUS.DELETED }, {
          where: {
            userName: userName,
            applicationId: applicationId
          }
        }).then(result => {
          return applozicClient.activateOrDeactivateUser(userName, applicationId, deactivate).then(applozicresult=>{
            updateSubscriptionQuantity(user, -1);
            return { "userId": userName, "result": result[0] = 1 ? "DELETED SUCCESSFULLY" : "ALREADY DELETED" };
          });
          
          
        })
      } else {
        return { "userId": userName, "result": "ALREADY DELETED" };
      }
    })
  } else {
    return userModel.update({deleted_at: null, status:  USER_CONSTANTS.USER_STATUS.ONLINE}, {
        where: {
          userName: userName,
          applicationId: applicationId,
          deleted_at: {$ne:null}
        } ,paranoid: false  
      }).then(result => {
        getByUserNameAndAppId(userName, applicationId).then(user => {
          if(user){
            updateSubscriptionQuantity(user, 1);
            applozicClient.createApplozicClient(user.userName, user.accessToken, user.applicationId).catch(err=>{
              console.log("message: ", err.code)
            });
          }
        })
        return{"userId": userName ,"result":result[0] = 1 ? "ACTIVATED SUCCESSFULLY" : "ALREADY ACTIVATED"};
      })
  }
}

const isDeletedUser= (userName, applicationId) => {
  let criteria = {
    userName: userName,
    applicationId: applicationId,
  }
  return userModel.findOne({ where: criteria, paranoid: false }).then(user => {
    return user && user.deleted_at != null;
  })
}

const updateSubscriptionQuantity = async function (user, count) {
  console.log("processing subscription quantity: " + count);
  if (user && (user.type == registrationService.USER_TYPE.AGENT || user.type == registrationService.USER_TYPE.BOT || user.type == registrationService.USER_TYPE.ADMIN)) {
    return customerService.getCustomerByApplicationId(user.applicationId).then(async customer => {
      if (customer.billingCustomerId) {

        let result = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        let usersCount = await getUsersCountByTypes(user.applicationId, null) - FREE_BOTS_COUNT;

        if ((count < 0 && (result.subscription.plan_quantity <= usersCount)) ||
          (count > 0 && (result.subscription.plan_quantity >= usersCount))) {
          console.log("users count is less than the subscription quantity, skipping subscription update");
          return;
        }
        return chargebeeService.updateSubscriptionQuantity(customer.billingCustomerId, count);
      }
      return;
    }).catch(error => {
      console.log(`error in updateSubscriptionQuantity : ${user} ${count} error: ${error}`)
      return;
    });
  }
  return;
}
const getUserByCriteria = async (criteria)=>{
  logger.info("fetching user by criteria", criteria);
  if(typeof criteria == 'object'){
    return Promise.resolve(userModel.findAll({where:criteria}));
    }else{
    return null;
  }
}
const deleteInvitation = (applicationId, invitedUser) => {
  return teammateInviteModel.destroy({ where: { "applicationId": applicationId, "invitedUser": invitedUser } }).then(res => {
    return res ? 'SUCCESS' : "Record Not found";
  }).catch(err => {
    throw err;
  });
}

const updateApplozicUser = (userInfo, apiKey) => {
  return applozicClient.getUserDetails([userInfo.userId], null, null, null, apiKey).then(result => {
    let userDetail = result[0];
    if (!userDetail) {
      throw "user not found"
    }
    if (userInfo.metadata) {
      var oldMetadata = {};
      for (var key in userDetail.metadata) {
        oldMetadata[key] = JSON.parse(userDetail.metadata[key])
      }
      userInfo.metadata = deepmerge(oldMetadata, userInfo.metadata);
      for (var key in userInfo.metadata) {
        (typeof userInfo.metadata[key] === "object" || typeof userInfo.metadata[key] === "array") && (userInfo.metadata[key] = JSON.stringify(userInfo.metadata[key]))
      }
    }
    return applozicClient.updateApplozicUser(userInfo, { "Api-Key": apiKey }).then(response => {
      return response
    }).catch(error => {
      throw error;
    })
  })
}


const getAgentIdsStatusWise= async (applicationId)=> {
  let awayAgents =[];
  let availableAgentsInKommunicate = [];
  let onlineAgent =[];
  let superAdmin;
  let agentList = []
  try{
  agentList = await this.getUsersByAppIdAndTypes(applicationId,[registrationService.USER_TYPE.AGENT,registrationService.USER_TYPE.ADMIN]);
  agentList && agentList.forEach(element => {
    element.status== USER_CONSTANTS.USER_STATUS.AWAY && awayAgents.push(element.userName);
    element.status== USER_CONSTANTS.USER_STATUS.ONLINE && availableAgentsInKommunicate.push(element.userName);
    element.roleType == USER_CONSTANTS.ROLE_TYPE.SUPER_ADMIN && (superAdmin = element);
  });
  let apzToken = new Buffer( superAdmin.userName+":"+ superAdmin.accessToken).toString('base64');
  let statusFromApplozic = await applozicClient.getUserDetails(availableAgentsInKommunicate,applicationId,apzToken);
  statusFromApplozic&& statusFromApplozic.forEach(element => {
    element.connected && onlineAgent.push(element.userId);
  });
  let response ={}
  response["away"] = awayAgents;
  response["online"] = onlineAgent;
  return response; 
}catch(e){
  logger.info("error while fetching agent list state wise :", e);
  return null;
}
}

const isThirdPartyLogin = (loginVia) => {
 return USER_CONSTANTS.THIRD_PARTY_LOGIN.some(function (el) {
    return el === loginVia;
  });
};

exports.isThirdPartyLogin = isThirdPartyLogin;
exports.getAgentIdsStatusWise = getAgentIdsStatusWise;
exports.updateApplozicUser = updateApplozicUser;
exports.isDeletedUser = isDeletedUser;
exports.updateThirdPartyData = updateThirdPartyData;
exports.activateOrDeactivateUser = activateOrDeactivateUser;
exports.activateOrDeactivate =activateOrDeactivate;
exports.getAgentByUserKey = getAgentByUserKey;
exports.changeBotStatus = changeBotStatus;
exports.getUserDisplayName = getUserDisplayName;
exports.getUserByName = getUserByName;
exports.inviteStatusUpdate =inviteStatusUpdate;
exports.updateBusinessHoursOfUser = updateBusinessHoursOfUser;
exports.createUser = createUser;
exports.getInvitedUser = getInvitedUser;
exports.getInvitedUserList =getInvitedUserList;
exports.inviteTeam = inviteTeam;
exports.getInvitedAgentDetail = getInvitedAgentDetail;
exports.getAdminUserByAppId = getAdminUserByAppId;
exports.getByUserNameAndAppId = getByUserNameAndAppId;
exports.processOffBusinessHours = processOffBusinessHours;
exports.getByUserKey = getByUserKey;
exports.getUserBusinessHoursByUserKey = getUserBusinessHoursByUserKey;
exports.getConfigIfCurrentTimeOutOfBusinessHours = getConfigIfCurrentTimeOutOfBusinessHours;
exports.isIntervalExceeds = isIntervalExceeds;
exports.getAdminUserNameFromGroupInfo = getAdminUserNameFromGroupInfo;
exports.getUserBusinessHoursByUserNameAndAppId = getUserBusinessHoursByUserNameAndAppId;
exports.getUsersByAppIdAndTypes = getUsersByAppIdAndTypes;
exports.getUsersCountByTypes = getUsersCountByTypes;
exports.updateUserStatus = updateUserStatus;
exports.updateOnlyKommunicateUser = updateOnlyKommunicateUser;
exports.getUserListByCriteria = getUserByCriteria;
exports.deleteInvitation =deleteInvitation;
