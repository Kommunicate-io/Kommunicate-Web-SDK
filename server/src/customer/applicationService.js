const application = require("../models").application;

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
        let err = new Error('No pplication found');
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

module.exports = {
    getApplication: getApplication,
    getApplicationListByCustomerId: getApplicationListByCustomerId,
    createApplication: createApplication,
    isApplicationExist: isApplicationExist
}