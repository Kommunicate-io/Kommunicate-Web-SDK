const onboardingModel = require("../models").Onboarding;
const logger = require('../utils/logger');

exports.insertOnboardingStatus = (data) => {
    return Promise.resolve(onboardingModel.create(data)).then(res => {    
        return { message: "onboarding status inserted successfully" };
    }).catch(err => {
        throw err;
    });
}

exports.getOnboardingStatus = (criteria) => {
    let onboardingInfo = [];
    return Promise.resolve(onboardingModel.findAll({ where: criteria})).then(response => {
        if (!response) { return { message: "SUCCESS", data: { message: "Invalid query" } } }
        for (item of response) {
            onboardingInfo.push({"stepId": item.stepId, "completed": item.completed})
          }
        return {data: onboardingInfo };
    }).catch(err =>{
        throw err;
    });
}

exports.updateOnboardingStatus = async (data, appId) => {
    let onboardingStatus = await onboardingModel.find({ where: { applicationId: appId } });
    if (!onboardingStatus) { throw new Error("APPLICATION_NOT_FOUND") }
    return Promise.resolve(onboardingModel.update(data, { where: { applicationId: appId, stepId: data.stepId } })).then(res => {
        return {
            message: "onboarding status updated successfully"
        };
    }).catch(function (err) {
        throw err;
    });
}