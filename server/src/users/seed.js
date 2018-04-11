const bcrypt= require("bcrypt");
const customerModel = require("../models").customer;
const db = require("../models");
const config= require("../../conf/config");

const applozicClient = require("../utils/applozicClient");
const botPlatformClient = require("../utils/botPlatformClient");
const userService = require('../users/userService');
const LIZ = require("../register/bots.js").LIZ;
const USER_TYPE={"AGENT": 1,"BOT": 2,"ADMIN": 3};

module.exports.seedLiz=()=>{

    console.log("fetching customer detail");
    db.customer.findAll().then(data=>{
        console.log("got customer data, count: ", data.length);
       // data.forEach(function(c) {
            //let customer =c.dataValues;
            let customer =data[0].dataValues;
            return userService.getByUserNameAndAppId('liz',customer.applicationId).then(data=>{
                if(!data){
                    // create liz
                    return Promise.resolve(applozicClient.createApplozicClient(LIZ.userName,LIZ.password,customer.applicationId,null,"BOT",null,LIZ.name).catch(e=>{
                        if(e.code=="USER_ALREADY_EXISTS"){
                            console.log("user already exists in applozic db");
                            return e.data;
                            
                        }else{
                            throw e;
                        }
                    })).then(applozicUser=>{
                        let lizObj = getFromApplozicUser(applozicUser,customer,USER_TYPE.BOT,LIZ.password);
                        return Promise.resolve(botPlatformClient.createBot({
                            "name": applozicUser.userId,
                            "key": applozicUser.userKey,
                            "brokerUrl": applozicUser.brokerUrl,
                            "accessToken": applozicUser.accessToken,
                            "applicationKey": customer.applicationId,
                            "authorization": lizObj.authorization,
                            "type": "KOMMUNICATE_SUPPORT",
                            "handlerModule":"SUPPORT_BOT_HANDLER"
                          })).then(result=>{
                             db.user.create(lizObj).then(user=>{
                                 console.log("success");
                             })
                          });
                    })

                }else{
                    console.log("liz already exist for customerId :",customer.id)
                }
            })

       // }, this);
    })
}


const getFromApplozicUser= (applozicUser,customer,type,pwd)=>{
    let userObject = {};
    let password =pwd||applozicUser.userId;
    userObject.userName= applozicUser.userId;
    console.log("data",applozicUser);
    userObject.password= bcrypt.hashSync(password, 10);
    userObject.apzToken= new Buffer(applozicUser.userId+":"+password).toString('base64');
    userObject.customerId= customer.id;
    userObject.authorization= new Buffer(applozicUser.userId+":"+applozicUser.deviceKey).toString('base64');
    userObject.accessToken= password,
    userObject.type= type;
    userObject.name=applozicUser.displayName;
    userObject.brokerUrl=applozicUser.brokerUrl;
    userObject.userKey=applozicUser.userKey;
  
    return userObject;
  };