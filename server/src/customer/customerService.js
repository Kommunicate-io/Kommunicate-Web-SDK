const customerModel = require("../models").customer;
const applicationModel = require('../models').application;
const user = require("../models").user;
const applicationService = require('./applicationService');
const appSettingService = require('../setting/application/appSettingService');
const logger = require('../utils/logger');
const { SUBSCRIPTION_PLAN } = require('../utils/utils');
const chargebeeService = require('../chargebee/chargebeeService');
const userService = require('../users/userService');
const botClientService = require('../utils/botPlatformClient');
const utils = require("../register/utils");
const applozicClient = require("../utils/applozicClient");
const {ROUTING_RULES_FOR_AGENTS} = require("../utils/constant")


const createCustomer = (customer, application, transaction) => {
    return Promise.resolve(customerModel.findOrCreate({ where: { userName: customer.userName }, defaults: customer })).then((customer) => {
        let userId = customer[0].userName;
        let conversationAssignee = {};
        conversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY] = userId;
        conversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT] = userId;
        //logger.info('customer created :', 'created');
        application.customerId = customer[0].id;
        return applicationService.createApplication(application, transaction).then(application => {
            return appSettingService.insertAppSettings({ applicationId: application.applicationId,"defaultConversationAssignee": conversationAssignee}).then(result => {
                return getCustomerByApplicationId(application.applicationId);
            }); 
        });

    })
}

const getCustomerByApplicationId = (appId) => {
    let settings = { applicationId: appId };
    return Promise.resolve(customerModel.findOne({ include: [{ model: applicationModel, attributes: ['applicationId', 'created_at'], where: { 'applicationId': appId } }] })).then(customer => {
        if (customer) {
            return appSettingService.getAppSettingsByApplicationId(settings).then(response => {
                customer.agentRouting = response.data.agentRouting;
                customer.botRouting = response.data.botRouting;
                return customer;
            })
        }
        return null;
    })
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

const reactivateAgents = async function (appId) {
    let customer = await getCustomerByApplicationId(appId);
    if (customer.subscription && customer.subscription != SUBSCRIPTION_PLAN.initialPlan) {
        let users = [];
        let result = await chargebeeService.getSubscriptionDetail(customer.billingCustomerId);
        let dbUsers = await userService.getUsersByAppIdAndTypes(appId, null, [['type', 'DESC']])
        let admin = dbUsers.filter(user => { return user.type == 3 });
        let agents = dbUsers.filter(user => { return user.type == 1 });
        let bots = dbUsers.filter(user => { return user.type == 2 && user.userName != 'bot' });
        users.push(...admin, ...agents, ...bots);
        for (var i = 0; i < result.subscription.plan_quantity; i++) {
            let dataToBeUpdated = { status: 1 };
            users[i].type == 2 && (dataToBeUpdated["bot_availability_status"] = 1)
            userService.updateOnlyKommunicateUser(users[i].userName, appId, dataToBeUpdated);
            applicationService.updateApplication(appId, { status: applicationService.STATUS.ACTIVE })
            try {
                users[i].type == 2 && botClientService.updateBot({ 'key': users[i].userKey, 'status': 'enabled' })
            } catch (error) {
                console.log("bot updation error", error)
            }
        }
    }
    return "success";
}

const updateApplicationInApplozic = async (customer) => {
    let application = {};
    if (typeof customer == 'object') {
        let applozicPackage = utils.APPLOZIC_PRICING_PACKAGE[customer.subscription];
        customer.websiteUrl && (application.websiteUrl = customer.websiteUrl);
        customer.companyName && (application.name = customer.companyName);
        applozicPackage && (application.pricingPackage = applozicPackage);
    } else {
        logger.info("received empty customer object to update");
    }
    if (Object.keys(application).length > 0) {
        application.applicationId = customer.applicationId;
        applozicClient.updateApplication(application).catch(err => {
            console.log('error while updating application', err);
        });
    }
}

module.exports = {
    reactivateAgents: reactivateAgents,
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