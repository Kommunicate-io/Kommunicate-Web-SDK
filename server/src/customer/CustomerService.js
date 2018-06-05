const Customer = require("../models").customer;
const Application = require('../models').Application;
const user= require("../models").user;
const applicationService = require('./ApplicationService')


const createCustomer = (customer, application) => {
    return Promise.resolve(Customer.create(customer)).then(customer => {
        application.customerId = customer.id;
        return applicationService.createApplication(application).then(application => {
            return getCustomerByApplicationId(application.applicationId);
        });

    })
}

const getCustomerByApplicationId = (appId) => {
    return Promise.resolve(Customer.findOne({include: [{model: Application, attributes:['applicationId'], where: {'applicationId': appId }}]})).then(customer => {
        return customer;
    })
}

const getCustomerByEmail = (email) => {
    return Promise.resolve(Customer.findOne({ where: { email: email },  include: [{ model: Application }] })).then(customer => {
        return customer;
    })
}

const getCustomerByUserName = (userName) => {
    return Promise.resolve(Customer.findOne({ where: { userName: userName }, include: [{ model: Application }] })).then(customer => {
        return customer;
    })
}

const updateCustomer = (userName, customerDetail) => {
    return Customer.update(customerDetail, { where: { userName: userName } }).then(result => {
        return result;
    })
}
const getCustomerById = (email) => {
    return Promise.resolve(Customer.findOne({ include: [{ model: Application }] }, { where: { id: id } })).then(customer => {
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
    return Promise.resolve(Customer.findOne({where: {userName: userName}})).then(customer=>{
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
