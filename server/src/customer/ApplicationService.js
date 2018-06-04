const Application = require("../models").Application;

/**
 * 
 * @param {customerId, applicationId} application 
 */
const createApplication = (application) => {

    return Promise.resolve(Application.create(application)).then(appication => {
        return application;
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

    return Promise.resolve(Application.findAll({ customerId: customerId })).then(appications => {
        return applications;
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

    return Promise.resolve(Application.findOne({ applicationId: applicationId })).then(appications => {
        return applications;
    }).catch(e => {
        let err = new Error('No pplication found');
        throw err;
    })
}

module.exports = {
    getApplication: getApplication,
    getApplicationListByCustomerId: getApplicationListByCustomerId,
    createApplication: createApplication
}