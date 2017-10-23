const bcrypt= require("bcrypt");
const customerModel = require("../models").customer;
const userModel = require("../models").user;
const config= require("../../conf/config");
const db = require("../models");
const applozicClient = require("../utils/applozicClient");
const botPlatformClient = require("../utils/botPlatformClient");
const userService = require('../users/userService');
const fileService = require('../utils/fileService');
const mailService = require('../utils/mailService');
const path = require('path');
const KOMMUNICATE_APPLICATION_KEY = config.getProperties().kommunicateParentKey;
const KOMMUNICATE_ADMIN_ID =config.getProperties().kommunicateAdminId;
const KOMMUNICATE_ADMIN_PASSWORD =config.getProperties().kommunicateAdminPassword;
const USER_TYPE={"AGENT": 1,"BOT": 2,"ADMIN": 3};

exports.USER_TYPE = USER_TYPE;

exports.createCustomer = customer=>{
  // console.log("creating customer",customer);
  // default application name : a unique name
  return Promise.resolve(applozicClient.createApplication(KOMMUNICATE_ADMIN_ID,KOMMUNICATE_ADMIN_PASSWORD,"km-"+customer.userName+"-"+Math.floor(new Date().valueOf() * Math.random()))).then(application=>{
    console.log("successfully created ApplicationId: ",application.applicationId," creating applozic client");

    return Promise.all([applozicClient.createApplozicClient(customer.userName,customer.password,application.applicationId,null,"APPLICATION_WEB_ADMIN"),
                   /*applozicClient.createApplozicClient("agent","agent",application.applicationId,null,"APPLICATION_WEB_ADMIN"),*/
                   applozicClient.createApplozicClient("bot","bot",application.applicationId,null,"APPLICATION_WEB_ADMIN"),
    ]).then(([applozicCustomer,/*agent,*/bot])=>{
      customer.apzToken = new Buffer(customer.userName+":"+customer.password).toString('base64');
      let user = getUserObject(customer,applozicCustomer,application);
      customer.password= bcrypt.hashSync(customer.password, 10);
      customer.applicationId= application.applicationId;
      user.password=customer.password;
      return customerModel.create(customer).then(customer=>{
        console.log("persited in db",customer?customer.dataValues:null);
        user.customerId=customer?customer.dataValues.id:null;
        //let agentobj= getFromApplozicUser(agent,customer,USER_TYPE.ADMIN);
        let botObj = getFromApplozicUser(bot,customer,USER_TYPE.BOT);
        // update bot plateform
        Promise.resolve(botPlatformClient.createBot({
          "name": bot.userId,
          "key": bot.userKey,
          "brokerUrl": bot.brokerUrl,
          "accessToken": botObj.accessToken,
          "applicationKey": application.applicationId,
          "authorization": botObj.authorization,
          "type": "KOMMUNICATE_SUPPORT",
        })).then(result=>{
            console.log("bot platform updated....",result);
            return result;
        }).catch(err=>{
          console.log("err while updating bot plateform..",err);
        });
        return userModel.bulkCreate([user,/*agentobj,*/botObj]).spread((user,/*agent,*/bot)=>{
          console.log("user created",user?user.dataValues:null);
         // console.log("created agent",agent.dataValues);
          console.log("created bot ",bot.dataValues);
          return getResponse(user.dataValues,application);
        });
      });
    });
  }).catch(err=>{
    console.log("err while creating Customer ",err);
    throw err;
  });
};
const getUserObject = (customer,applozicCustomer,application)=>{
  let user = JSON.parse(JSON.stringify(customer));
  user.customerId=customer.id;
  // user.apzToken=new Buffer(customer.userName+":"+customer.password).toString('base64');
  user.authorization = new Buffer(customer.userName+":"+applozicCustomer.deviceKey).toString('base64');
  user.accessToken = customer.password;
  user.type = USER_TYPE.ADMIN;
  user.userKey= applozicCustomer.userKey;
  return user;
};

const getResponse = (customer,application)=>{
    let response=JSON.parse(JSON.stringify(customer));
    response.application=JSON.parse(JSON.stringify(application));
    return response;
};

exports.updateCustomer = (userId,customer)=>{
  return Promise.resolve(customerModel.update(customer,{where: {"userName": userId}})).then(result=>{
    console.log("successfully updated user",result[0]);
    return result[0];
  }).catch(err=>{
    console.log("error while updating user",err);
    throw err;
  });
};

  exports.getCustomerByApplicationId = appId=>{
    console.log("getting application by application Id",appId);
    return Promise.resolve(customerModel.findOne({where: {applicationId: appId}}))
     .then(customer => {
        console.log("found data for customer : ",customer==null?null:customer.dataValues);
          return customer!==null?customer.dataValues:null;
      }).catch(err=>{
        console.log("err while getting customer by application Id",err);
        throw err;
      });
    };

const getFromApplozicUser= (applozicUser,customer,type)=>{
  let userObject = {};
  userObject.userName= applozicUser.userId;
  console.log("data",applozicUser);
  userObject.password= bcrypt.hashSync(applozicUser.userId, 10);
  userObject.apzToken= new Buffer(applozicUser.userId+":"+applozicUser.userId).toString('base64');
  userObject.customerId= customer.id;
  userObject.authorization= new Buffer(applozicUser.userId+":"+applozicUser.deviceKey).toString('base64');
  userObject.accessToken= applozicUser.userId,
  userObject.type= type;
  userObject.name=applozicUser.displayName;
  userObject.brokerUrl=applozicUser.brokerUrl;
  userObject.userKey=applozicUser.userKey;

  return userObject;
};

exports.getCustomerByUserName = userName=>{
  console.log("getting customer by UserName",userName);
  return Promise.resolve(db.customer.findOne({where: {userName: userName}}));
};

exports.isAdmin = (userName)=>{
  console.log("checkig if user is an admin", userName);
  return db.customer.findOne({where: {userName: userName}}).then(customer=>{
    return customer?true:false;
  });
}

exports.sendWelcomeMail= (email)=>{
  console.log("sending welcome mail to ",email);
  let mailOptions = {
    to:email,
    from:"Devashish From Kommunicate <support@kommunicate.io>",
    subject:"Welcome to Kommunicate!",
    templatePath: path.join(__dirname,"../mail/welcomeMailTemplate.html")
  }
  return mailService.sendMail(mailOptions);
}




