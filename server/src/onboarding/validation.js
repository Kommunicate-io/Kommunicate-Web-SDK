const joi = require("joi");
module.exports.getOnboardingStatus = {
  params: {
    appId: joi.string().required()
  }
}
module.exports.updateOnboardingStatus = {
  params: {
    appId: joi.string().required(),
    stepId: joi.number().integer().required(),
    completed: joi.boolean().required()
  }
}
module.exports.insertOnboardingStatus = {
  body: {
    stepId: joi.number().integer().required(),
    completed: joi.boolean().required()
  },
  params: {
    appId: joi.string().required()
  }
}