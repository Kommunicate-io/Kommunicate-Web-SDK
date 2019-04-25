const customerModel = require("../models").customer;
const applicationModel = require('../models').application;
const user = require("../models").user;
const applicationService = require('./applicationService');
const appSettingService = require('../setting/application/appSettingService');
const onboardingService = require('../onboarding/onboardingService')
const logger = require('../utils/logger');
const chargebeeService = require('../chargebee/chargebeeService');
const userService = require('../users/userService');
const botClientService = require('../utils/botPlatformClient');
const subscriptionPlans = require("../register/subscriptionPlans");
const applozicClient = require("../utils/applozicClient");
const {ROUTING_RULES_FOR_AGENTS} = require("../utils/constant")
const {appSettings, ONBOARDING_STATUS}= require("../utils/constant");


const createCustomer = (customer, application, transaction) => {
     delete customer["role"];
    return Promise.resolve(customerModel.findOrCreate({ where: { userName: customer.userName }, defaults: customer })).then((customer) => {
        let userId = customer[0].userName;
        let conversationAssignee = {};
        conversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY] = userId;
        conversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT] = userId;
        //logger.info('customer created :', 'created');
        application.customerId = customer[0].id;
        return applicationService.createApplication(application, transaction).then(application => {
            return Promise.all([appSettingService.insertAppSettings({ applicationId: application.applicationId,"defaultConversationAssignee": conversationAssignee,removeBotOnAgentHandOff:appSettings.REMOVE_BOT_ON_AGENT_HANDOFF.ENABLED}), onboardingService.insertOnboardingStatus({applicationId: application.applicationId, stepId:ONBOARDING_STATUS.ACCOUNT_CREATED, completed:true})])
        .then(([appSettingResponse, onboardingResponse]) => {
            return getCustomerByApplicationId(application.applicationId);
        }

        ).catch(err => {
            logger.info("error while inserting application on the app setting or onboarding status")
        })
        });
        
    })
}

const getCustomerByApplicationId = async (appId) => {
    let app = await applicationModel.findOne({ where: { 'applicationId': appId } });
    if (!app) throw new Error("application not found")
    let customer = await customerModel.findOne({ where: { 'id': app.customerId } })
    if (!customer) new Error("customer not found");
    customer.applications = [{ 'applicationId': app.applicationId, 'created_at': app.created_at }]
    let appSettings = await appSettingService.getAppSettingsByApplicationId({ applicationId: appId });
    customer.agentRouting = appSettings.data.agentRouting;
    customer.botRouting = appSettings.data.botRouting;
    customer.defaultConversationAssignee = appSettings.data.defaultConversationAssignee;
    return customer;
}

const getCustomerByEmail = (email) => {
    return Promise.resolve(customerModel.findOne({ where: { email: email }, include: [{ model: applicationModel }] })).then(customer => {
        return customer;
    })
}

const getCustomerByUserName = (userName) => {
    return Promise.resolve(customerModel.findOne({ where: { userName: userName }, include: [{ model: applicationModel }] })).then(customer => {
        return customer;
    })
}

const updateCustomer = (userName, customerDetail) => {
    return customerModel.update(customerDetail, { where: { userName: userName } }).then(result => {
        return result;
    })
}
const getCustomerById = (id) => {
    return Promise.resolve(customerModel.findOne({ include: [{ model: applicationModel }] }, { where: { id: id } })).then(customer => {
        return customer;
    })
}

const updateRoutingState = (applicationId, routingInfo) => {
    return Promise.resolve(appSettingService.update(routingInfo, { where: { applicationId: applicationId } })).then(res => {
        return { message: "routing successfully updated" };
    }).catch(err => {
        return { message: "routing update error   " }
    });
}

const getCustomerByAgentUserKey = (userKey) => {
    logger.info("getting user detail from userKey : ", userKey);
    return Promise.resolve(user.findOne({ where: { userKey: userKey } })).then(user => {
        if (user) {
            return getCustomerByApplicationId(user.applicationId);
        } else {
            throw new Error("User Not found");
        }
    });
}

const isAdmin = (userName) => {
    console.log("checkig if user is an admin", userName);
    return Promise.resolve(customerModel.findOne({ where: { userName: userName } })).then(customer => {
        return customer ? true : false;
    });
}

const createApplication = (application) => {
    return applicationService.createApplication(application);
}

const reactivateAccount = async function (appId,userIds,enableWithoutPayment) {
    let customer = await getCustomerByApplicationId(appId);
    if ((customer.subscription && !customer.isProductApplozic && customer.subscription != subscriptionPlans.KOMMUNICATE_SUBSCRIPTION.STARTUP)||enableWithoutPayment ) {
        let users, liz, dbUsers, result= [];
        if(userIds){
            var criteria ={};
            criteria.applicationId =appId;
            criteria.userName = userIds;
            dbUsers = await userService.getUserListByCriteria(criteria);
            if(userIds.length !== dbUsers.length){
                throw "userId is incorrect";
            }
            users=dbUsers;
        }else{
        result = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        let dbUsers = await userService.getUsersByAppIdAndTypes(appId, null, [['type', 'DESC'], ['id', 'ASC']])
        let admin = dbUsers.filter(user => { return user.type == 3 });
        let agents = dbUsers.filter(user => { return user.type == 1 });
        let bots = dbUsers.filter(user => { 
            return (!(user.userName == 'bot' || user.userName == 'liz')&& user.type == 2);
        });
         liz = dbUsers.find(user => { 
            return  user.userName == 'liz';
        });
        users.push(...admin, ...agents, ...bots);
    }

        for (var i = 0; i < users.length; i++) {
            let userStatus = (i < result && result.subscription.plan_quantity) || enableWithoutPayment? 1 : 2;
            let dataToBeUpdated = { status: userStatus };
            users[i].type == 2 && (dataToBeUpdated["bot_availability_status"] = userStatus);
            userService.updateOnlyKommunicateUser(users[i].userName, appId, dataToBeUpdated);
            try {
                users[i].type == 2 && botClientService.updateBot({ 'key': users[i].userKey, 'status': userStatus == 1 ? 'enabled' :'expired' })
            } catch (error) {
                console.log("bot updation error", error)
            }
        }
        !enableWithoutPayment && userService.updateOnlyKommunicateUser(liz.userName, appId, {"bot_availability_status":1, "status": 1 });
        (enableWithoutPayment && userIds.includes("liz") || !enableWithoutPayment)&& botClientService.updateBot({ 'key': liz.userKey, 'status': 'enabled' })
        applicationService.updateApplication(appId, { status: applicationService.STATUS.ACTIVE });
    }
    return "success";
}



const updateApplicationInApplozic = async (customer) => {
    let application = {};
        if (typeof customer == 'object') {
            let customerApplicationId = customer.applicationId || customer.applications[0].applicationId;
            let applozicPackage = subscriptionPlans.APPLOZIC_PRICING_PACKAGE[customer.subscription];
            customer.websiteUrl && (application.websiteUrl = customer.websiteUrl);
            customer.companyName && (application.name = customer.companyName);
            applozicPackage && (application.pricingPackage = applozicPackage);
            if (Object.keys(application).length > 0) {
                application.applicationId = customerApplicationId;
                return await applozicClient.updateApplication(application).catch(err => {
                    console.log('error while updating application', err);
                    throw err;
                });
            }
        }
        else {
            logger.info("received empty customer object to update");
        }
}

module.exports = {
    reactivateAccount: reactivateAccount,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    getCustomerByUserName: getCustomerByUserName,
    getCustomerByEmail: getCustomerByEmail,
    getCustomerByApplicationId: getCustomerByApplicationId,
    getCustomerById: getCustomerById,
    updateRoutingState: updateRoutingState,
    getCustomerByAgentUserKey: getCustomerByAgentUserKey,
    isAdmin: isAdmin,
    createApplication: createApplication,
    updateApplicationInApplozic:updateApplicationInApplozic
}
