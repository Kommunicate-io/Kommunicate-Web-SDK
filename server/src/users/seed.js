const bcrypt = require("bcrypt");
const customerModel = require("../models").customer;
const db = require("../models");
const config = require("../../conf/config");

const applozicClient = require("../utils/applozicClient");
const botPlatformClient = require("../utils/botPlatformClient");
const userService = require('../users/userService');
const LIZ = require("../register/bots.js").LIZ;
const USER_TYPE = { "AGENT": 1, "BOT": 2, "ADMIN": 3 };
const applicationService = require('../customer/applicationService');
const USER_CONSTANTS = require("../users/constants.js");


exports.seedLiz = () => {
    getApplicationRecursively();
}
const getApplicationRecursively = (criteria) => {
    if (typeof criteria == "undefined") {
        var order = [['id', 'ASC']];
        criteria = { where: { id: { $gt: 0 } }, order, limit: 5 }
    }
    return applicationService.getAllApplications(criteria).then(applications => {
        if (applications.length < 1) {
            console.log("message", "all application processed")
            return;
        }
        let apps = applications.map((app, index) => {
            console.log("application: ", app.id, app.applicationId);
            return createLiz(app);
        })
        return Promise.all(apps).then(result => {
            let lastApp = applications[applications.length - 1]
            criteria.where = { id: { $gt: lastApp.id } }
            return getApplicationRecursively(criteria).catch(err => {
                console.log("error while fetching all app: ", lastApp.applicationId )
            });

        })
    })
}
const createLiz = (application) => {
    return userService.getByUserNameAndAppId('liz', application.applicationId).then(existingliz => {
        if (!existingliz) {
            // create liz
            return Promise.resolve(applozicClient.createApplozicClient(LIZ.userName, LIZ.password, application.applicationId, null, USER_CONSTANTS.BOT.name, null, LIZ.name, undefined, LIZ.imageLink).catch(e => {
                if (e.code == "USER_ALREADY_EXISTS") {
                    console.log("user already exists in applozic db");
                    return e.data;
                } else {
                    throw e;
                }
            })).then(applozicUser => {
                let lizObj = getFromApplozicUser(applozicUser, application, USER_TYPE.BOT, LIZ.password);
                return Promise.resolve(botPlatformClient.createBot({
                    "name": applozicUser.userId,
                    "key": applozicUser.userKey,
                    "brokerUrl": applozicUser.brokerUrl,
                    "accessToken": LIZ.password,
                    "applicationKey": application.applicationId,
                    "authorization": lizObj.authorization,
                    "type": "KOMMUNICATE_SUPPORT",
                    "handlerModule": "SUPPORT_BOT_HANDLER"
                })).then(result => {
                    return db.user.create(lizObj).then(user => {
                        console.log("success");
                        return user;
                    })
                })
            }).catch(err=>{
                console.log("error: ", application.applicationId, err);
                return;
            });

        } else {
            console.log("liz already exist for application :", application.applicationId)
            return;
        }
    })
}

const getFromApplozicUser = (applozicUser, application, type, pwd) => {
    let userObject = {};
    let password = pwd || applozicUser.userId;
    userObject.userName = applozicUser.userId;
    console.log("data", applozicUser);
    userObject.password = bcrypt.hashSync(password, 10);
    userObject.apzToken = new Buffer(applozicUser.userId + ":" + password).toString('base64');
    userObject.authorization = new Buffer(applozicUser.userId + ":" + applozicUser.deviceKey).toString('base64');
    userObject.accessToken = password;
    userObject.applicationId = application.applicationId;
    userObject.type = type;
    userObject.name = applozicUser.displayName;
    userObject.brokerUrl = applozicUser.brokerUrl;
    userObject.userKey = applozicUser.userKey;

    return userObject;
};
