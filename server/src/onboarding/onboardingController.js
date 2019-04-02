const onboardingService = require("./onboardingService");
const logger = require('../utils/logger');

exports.insertOnboardingStatus = (req, res) => {
    var data = {
        applicationId: req.params.appId,
        stepId: req.body.stepId,
        completed: req.body.completed
    }
    return onboardingService.insertOnboardingStatus(data).then(response => {
      return res.status(200).json({ code: "SUCCESS", message: response.message });
    }).catch(err => {
      logger.info("error while inserting onboarding status", err);
      return res.status(500).json({ code: "ERROR", message: "internal server error" });
    })
  
  }