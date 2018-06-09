const customer = require("../models").customer;
const application = require('../models').application;
const user= require("../models").user;
const applicationService = require('./applicationService');
const logger = require('../utils/logger')


const createCustomer = (customer, application, transaction) => {
    return Promise.resolve(customer.create(customer, transaction)).then(customer => {
        application.customerId = customer.id;
        return applicationService.createApplication(application, transaction).then(application => {
            return getCustomerByApplicationId(application.applicationId);
        });

    })
}

const getCustomerByApplicationId = (appId) => {
    return Promise.resolve(customer.findOne({include: [{model: application, attributes:['applicationId'], where: {'applicationId': appId }}]})).then(customer => {
        return customer;
    })
}

const getCustomerByEmail = (email) => {
    return Promise.resolve(customer.findOne({ where: { email: email },  include: [{ model: application }] })).then(customer => {
        return customer;
    })
}

const getCustomerByUserName = (userName) => {
    return Promise.resolve(customer.findOne({ where: { userName: userName }, include: [{ model: application }] })).then(customer => {
        return customer;
    })
}

const updateCustomer = (userName, customerDetail) => {
    return customer.update(customerDetail, { where: { userName: userName } }).then(result => {
        return result;
    })
}
const getCustomerById = (email) => {
    return Promise.resolve(customer.findOne({ include: [{ model: application }] }, { where: { id: id } })).then(customer => {
        return customer;
    })
}

const updateRoutingState = (applicationId, routingInfo) => {
    return getCustomerByApplicationId(applicationId).then(customer => {
        return Promise.resolve(customerModel.update(routingInfo, { where: { id: customer.id } })).then(res => {
            return { message: "routing successfully updated" };
        })
    }).catch(err => {
        return { message: "routing update error " }
    });
}

const getCustomerByAgentUserKey= (userKey) =>{
    logger.info("getting user detail from userKey : ",userKey);
    return Promise.resolve(user.findOne({where:{userKey:userKey}})).then(user=>{
      if(user){
        return getCustomerByApplicationId(user.applicationId);
      }else{
       throw new Error("User Not found");
      }
    });
  }

const isAdmin = (userName)=>{
    console.log("checkig if user is an admin", userName);
    return Promise.resolve(customer.findOne({where: {userName: userName}})).then(customer=>{
      return customer?true:false;
    });
  }

  const createApplication=(application)=>{
      return applicationService.createApplication(application);
  }
module.exports = {
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    getCustomerByUserName: getCustomerByUserName,
    getCustomerByEmail: getCustomerByEmail,
    getCustomerByApplicationId: getCustomerByApplicationId,
    getCustomerById: getCustomerById,
    updateRoutingState:updateRoutingState,
    getCustomerByAgentUserKey:getCustomerByAgentUserKey,
    isAdmin:isAdmin,
    createApplication:createApplication
}
