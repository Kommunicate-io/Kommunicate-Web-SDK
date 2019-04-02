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

exports.getOnboardingStatusByApplicationId = (req, res) => {
  let settings = { applicationId: req.params.appId };
  return onboardingService.getOnboardingStatus(settings).then(response => {
    return res.status(200).json({ code: "SUCCESS", response: response.data });
  }).catch(err => {
    logger.info("onboarding status fetch error", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })

}

exports.updateOnboardingStatus = (req, res) => {
  let appId = req.params.appId;
  let data = req.body;
  return onboardingService.updateOnboardingStatus(data, appId).then(response => {
    return res.status(200).json({ code: "SUCCESS", message: response.message });
  }).catch(err => {
    logger.info("onboarding status update error", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })
}