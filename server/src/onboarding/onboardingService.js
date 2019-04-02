const onboardingModel = require("../models").Onboarding;
const logger = require('../utils/logger');

exports.insertOnboardingStatus = (data) => {
    return Promise.resolve(onboardingModel.create(data)).then(res => {    
        return { message: "onboarding status inserted successfully" };
    }).catch(err => {
        logger.info("onboarding status insert error ")
        throw err;
    });
}