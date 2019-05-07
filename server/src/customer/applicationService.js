const application = require("../models").application;
const customer = require("../models").customer;
const moment = require('moment');
const STATUS = { ACTIVE: 1, EXPIRED: 2 };

/**
 * 
 * @param {customerId, applicationId} application 
 */
const createApplication = (app) => {

    return Promise.resolve(application.create(app)).then(app => {
        return app;
    }).catch(err => {
        let e = new Error('unable to create application');
        throw err;
    })
}

/**
 * 
 * @param {*} customerId 
 * This method will return list of application of customer  
 */
const getApplicationListByCustomerId = (customerId) => {

    return Promise.resolve(application.findAll({ where: { customerId: customerId } })).then(apps => {
        return apps;
    }).catch(e => {
        let err = new Error('No application found');
        throw err;
    })
}
/**
 * 
 * @param {*} applicationId 
 */
const getApplication = (applicationId) => {

    return Promise.resolve(application.findOne({ where: { applicationId: applicationId } })).then(app => {
        return app;
    }).catch(e => {
        let err = new Error('No application found');
        throw err;
    })
}

/**
 * 
 * @param {String} applicationId 
 */
const isApplicationExist = (applicationId) => {
    return application.findOne({ where: { applicationId: applicationId } }).then(app => {
        return app ? true : false;
    }).catch(e => {
        let err = new Error('No application found');
        return false;
    })
}

/**
 * 
 * @param {Object} criteria 
 */
const getAllApplications = (criteria) => {
    return Promise.resolve(application.findAll(criteria)).then(apps => {
        return apps;
    }).catch(e => {
        let err = new Error('No application found');
        throw err;
    })
}

const getExpiredApplication = (days) => {
    return Promise.resolve(application.findAll({ where: { 'status': {$ne: 2}, 'created_at': { $lt: moment().subtract(days, 'days').toDate() } }, include: [{ model: customer, where: { 'subscription': 'startup' } }] })).then(applications => {
        return applications;
    })
}

const updateApplication = (appId, options) => {
    return application.update(options, { where: { "applicationId": appId } });
}

module.exports = {
    STATUS:STATUS,
    updateApplication: updateApplication,
    getExpiredApplication: getExpiredApplication,
    getApplication: getApplication,
    getAllApplications: getAllApplications,
    getApplicationListByCustomerId: getApplicationListByCustomerId,
    createApplication: createApplication,
    isApplicationExist: isApplicationExist
}