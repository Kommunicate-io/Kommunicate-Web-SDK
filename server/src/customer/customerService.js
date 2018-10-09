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


const createCustomer = (customer, application, transaction) => {
    return Promise.resolve(customerModel.findOrCreate({ where: { userName: customer.userName }, defaults: customer })).then((customer) => {
        //logger.info('customer created :', 'created');
        application.customerId = customer[0].id;
        return applicationService.createApplication(application, transaction).then(application => {
            return appSettingService.insertAppSettings({ applicationId: application.applicationId }).then(ersult => {
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
                users[i].type == 2 && botClientService.updateBot({ 'key': users[i].userKey, 'status': 1 })
            } catch (error) {
                console.log("bot updation error", error)
            }
        }
    }
    return "success";
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
    createApplication: createApplication
}