const bcrypt = require("bcrypt");
const userModel = require("../models").user;
const config = require("../../conf/config");
const db = require("../models");
const applozicClient = require("../utils/applozicClient");
const botPlatformClient = require("../utils/botPlatformClient");
const userService = require('../users/userService');
const fileService = require('../utils/fileService');
const mailService = require('../utils/mailService');
const path = require('path');
const KOMMUNICATE_APPLICATION_KEY = config.getProperties().kommunicateParentKey;
const KOMMUNICATE_ADMIN_ID = config.getProperties().kommunicateAdminId;
const KOMMUNICATE_ADMIN_PASSWORD = config.getProperties().kommunicateAdminPassword;
const USER_TYPE = { "AGENT": 1, "BOT": 2, "ADMIN": 3 };
const ROLE_TYPE ={"SUPER_ADMIN": 0,"ADMIN":1,"AGENT":2,"BOT":3};
const logger = require("../utils/logger");
const LIZ = require("./bots.js").LIZ;
const appSetting = require("../setting/application/appSettingService")
const customerService = require('../customer/customerService.js');
const subscriptionPlan = require('../utils/utils').SUBSCRIPTION_PLAN;

exports.USER_TYPE = USER_TYPE;

exports.createCustomer = customer => {
  return Promise.resolve(applozicClient.createApplication(KOMMUNICATE_ADMIN_ID, KOMMUNICATE_ADMIN_PASSWORD, "km-" + customer.userName + "-" + Math.floor(new Date().valueOf() * Math.random()))).then(application => {
    console.log("successfully created ApplicationId: ", application.applicationId, " creating applozic client");
    customer.applicationId = application.applicationId;
    //
    customer.role = "APPLICATION_WEB_ADMIN";
    return Promise.all([applozicClient.createUserInApplozic(customer),
    applozicClient.createApplozicClient(LIZ.userName, LIZ.password, application.applicationId, null, "BOT", null, LIZ.name, undefined, LIZ.imageLink),
    applozicClient.createApplozicClient("bot", "bot", application.applicationId, null, "BOT")
    ]).then(([applozicCustomer, liz, bot]) => {

      let kmUser = getUserObject(customer, applozicCustomer, application);
      if (customer.password !== null) {
        kmUser.password  = bcrypt.hashSync(customer.password, 10);
      }
      customer.subscription = customer.subscription || subscriptionPlan.initialPlan;
      return db.sequelize.transaction(t => {
        return customerService.createCustomer(customer, { applicationId: application.applicationId }, { transaction: t }).then(customer => {
          console.log("persited in db", customer ? customer.dataValues : null);
          let botObj = getFromApplozicUser(bot, customer, USER_TYPE.BOT);
          let lizObj = getFromApplozicUser(liz, customer, USER_TYPE.BOT, LIZ.password);
          // create default bot plateform

          Promise.all([botPlatformClient.createBot({
            "name": bot.userId,
            "key": bot.userKey,
            "brokerUrl": bot.brokerUrl,
            "accessToken": botObj.accessToken,
            "applicationKey": application.applicationId,
            "authorization": botObj.authorization,
            "type": "KOMMUNICATE_SUPPORT",
            "handlerModule": "DEFAULT_KOMMUNICATE_SUPPORT_BOT"
          }), botPlatformClient.createBot({
            "name": liz.userId,
            "key": liz.userKey,
            "brokerUrl": liz.brokerUrl,
            "accessToken": lizObj.accessToken,
            "applicationKey": application.applicationId,
            "authorization": lizObj.authorization,
            "type": "KOMMUNICATE_SUPPORT",
            "handlerModule": "SUPPORT_BOT_HANDLER"
          })]).then(([liz, result]) => {
            console.log("bot platform updated....", result);
            return result;
          }).catch(err => {
            console.log("err while updating bot plateform..", err);
          });
          //insert appId in to application_settings table
          return userModel.bulkCreate([kmUser, botObj, lizObj], { transaction: t }).spread((user, bot, lizObj) => {
            console.log("user created", user ? user.dataValues : null);
            console.log("created bot ", bot.dataValues);
            let signupUser = Object.assign(user.dataValues, { subscription: customer.subscription, applicationCreatedAt: customer.applications[0].created_at })
            return getResponse(signupUser, applozicCustomer, application);
          });
        });
      });
    }).catch(err => {
      console.log("err while creating customer ", err);
      throw err;
    });
  });
};
const getUserObject = (customer, applozicCustomer, application) => {
  let user = JSON.parse(JSON.stringify(customer));
  user.apzToken=new Buffer(customer.userName+":"+customer.password).toString('base64');
  user.authorization = new Buffer(customer.userName + ":" + applozicCustomer.deviceKey).toString('base64');
  user.accessToken = customer.password;
  user.type = USER_TYPE.ADMIN;
  user.userKey = applozicCustomer.userKey;
  user.applicationId = application.applicationId;
  return user;
};

const getResponse = (customer, applozicCustomer, application) => {
  let response = customer;
  response.application = application;
  response.applozicUser = applozicCustomer
  return response;
};

exports.updateCustomer = (userId, customer) => {
  return userService.updateUser(userId, customer.applicationId, { name: customer.name, email: customer.email, companyName: customer.companyName }).then(result => {
    return customerService.updateCustomer(userId, customer).then(result=>{
      return result[0];
    });
  }).catch(err => {
    console.log("error while updating user", err);
    throw err;
  })
}

const getFromApplozicUser = (applozicUser, customer, type, pwd) => {
  let userObject = {};
  let password = pwd || applozicUser.userId;
  userObject.userName = applozicUser.userId;
  userObject.password = bcrypt.hashSync(password, 10);
  userObject.apzToken = new Buffer(applozicUser.userId + ":" + password).toString('base64');
  userObject.applicationId = customer.applications[0].applicationId;
  userObject.authorization = new Buffer(applozicUser.userId + ":" + applozicUser.deviceKey).toString('base64');
  userObject.accessToken = password;
  userObject.type = type;
  userObject.name = applozicUser.displayName;
  userObject.brokerUrl = applozicUser.brokerUrl;
  userObject.userKey = applozicUser.userKey;
  type === 2? userObject.roleType = ROLE_TYPE.BOT :"";

  return userObject;
};

exports.sendWelcomeMail = (email, userName, agent, companyName) => {
  console.log("sending welcome mail to ", email, companyName);
  let tamplatePath = '';
  let templateReplacement = '';
  let subject = "Welcome to Kommunicate";
  if (agent) {
    let organization = companyName !== undefined && companyName != null ? companyName : '';
    templatePath = path.join(__dirname, "../mail/agentWelcomeMailTamplate.html"),
      templateReplacement = { ":USER_NAME": userName, ":ORGANIZATION": organization, ":DASHBOARDURL":config.getProperties().urls.dashboardHostUrl }
  } else {
    templatePath = path.join(__dirname, "../mail/welcomeMailTemplate.html"),
      templateReplacement = { ":USER_NAME": userName }
  }
  let mailOptions = {
    to: email,
    from: "Devashish From Kommunicate <support@kommunicate.io>",
    subject: subject,
    bcc: "techdisrupt@applozic.com",
    templatePath: templatePath,
    templateReplacement: templateReplacement
  }
  return mailService.sendMail(mailOptions);
}

const populateDataInKommunicateDb = (options, application, applozicCustomer, applozicBot, liz) => {
  let kmCustomer = {
    name: applozicCustomer.displayName, userName: options.userName, email: options.email,
    contactNo: applozicCustomer.contactNumber, applicationId: application.applicationId
  };
  kmCustomer.password = bcrypt.hashSync(options.password, 10);
  kmCustomer.apzToken = new Buffer(options.userName + ":" + options.password).toString('base64');

  let kmUser = { name: applozicCustomer.displayName, userName: options.userName, email: options.email, accessToken: options.password, role: options.role, type: USER_TYPE.ADMIN, userKey: applozicCustomer.userKey, applicationId: application.applicationId,roleType:options.roleType }
  kmUser.password = bcrypt.hashSync(options.password, 10);
  kmUser.authorization = new Buffer(options.userName + ":" + applozicCustomer.deviceKey).toString('base64');
  kmUser.apzToken = new Buffer(options.userName + ":" + options.password).toString('base64');

  return db.sequelize.transaction(t => {
    return customerService.createCustomer(kmCustomer, { applicationId: application.applicationId }, { transaction: t }).then(customer => {
      console.log("persited in db", customer ? customer.dataValues : null);
      // update bot plateform
      let botObj = getFromApplozicUser(applozicBot, customer, USER_TYPE.BOT);
      let lizObj = getFromApplozicUser(liz, customer, USER_TYPE.BOT, LIZ.password)
      Promise.all([botPlatformClient.createBot({
        "name": applozicBot.userId,
        "key": applozicBot.userKey,
        "brokerUrl": applozicBot.brokerUrl,
        "accessToken": applozicBot.userId,
        "applicationKey": application.applicationId,
        "authorization": new Buffer(applozicBot.userId + ":" + applozicBot.deviceKey).toString('base64'),
        "type": "KOMMUNICATE_SUPPORT",
        "handlerModule": "DEFAULT_KOMMUNICATE_SUPPORT_BOT"
      }), botPlatformClient.createBot({
        "name": liz.userId,
        "key": liz.userKey,
        "brokerUrl": liz.brokerUrl,
        "accessToken": lizObj.userId,
        "applicationKey": application.applicationId,
        "authorization": new Buffer(liz.userId + ":" + liz.deviceKey).toString('base64'),
        "type": "KOMMUNICATE_SUPPORT",
        "handlerModule": "SUPPORT_BOT_HANDLER"
      })]).then(result => {
        console.log("bot platform updated....", result);
        return result;
      }).catch(err => {
        console.log("err while updating bot plateform..", err);
      });
      return userModel.bulkCreate([kmUser, botObj, lizObj], { transaction: t }).spread((user, bot, liz) => {
        console.log("user created", user ? user.dataValues : null);
        console.log("created bot ", bot.dataValues);
        return getResponse(user.dataValues, applozicCustomer, application);
      });
    });
  })
}

exports.signUpWithApplozic = (options, isApplicationWebAdmin) => {
  options.email = options.email || options.userName;
  return applozicClient.getApplication({ "applicationId": options.applicationId, "userName": options.userName, "accessToken": options.password }, isApplicationWebAdmin).then(application => {
    return Promise.all([applozicClient.applozicLogin({ "userName": options.userName, "password": options.password, "applicationId": options.applicationId, "roleName": "APPLICATION_WEB_ADMIN", "email": options.email }),
    applozicClient.applozicLogin({ "userName": "bot", "password": "bot", "applicationId": options.applicationId, "roleName": "BOT" }),
    applozicClient.applozicLogin({ "userName": LIZ.userName, "password": LIZ.password, "applicationId": application.applicationId, "roleName": "BOT", displayName: LIZ.name,imageLink: LIZ.imageLink })])
      .then(([customer, bot, liz]) => {
        return applozicClient.updateApplozicClient(options.userName, options.password, options.applicationId, { userId: options.userName, roleName: "APPLICATION_WEB_ADMIN" }, null, false, isApplicationWebAdmin + '')
          .then(updatedUser => {
            options.role = "APPLICATION_WEB_ADMIN";
            if(application.pricingPackage == 0 || application.pricingPackage == -1) {
              applozicClient.updateApplication({applicationId: application.applicationId, pricingPackage: 101})
            }
            return populateDataInKommunicateDb(options, application, customer, bot, liz);
          }).catch(e => {
            throw e;
          })
      })

  }).catch(e => {
    console.log("err", e);
    throw e;
  })
}
