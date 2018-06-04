
const applicationService = require("./appSettingService");
exports.getAppSettingsByApplicationId = (req, res) => {
  let settings = { applicationId: req.params.appId };
  return applicationService.getAppSettingsByApplicationId(settings).then(response => {
    return res.status(200).json({ code: "SUCCESS", message: response.message, response: response.data });
  }).catch(err => {
    console.log("error while creating customer on application_settings", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })

}
exports.insertAppSettings = (req, res) => {
  let appId = req.params.appId;
  let settings = req.body;
  return applicationService.insertAppSettings(settings).then(response => {
    return res.status(200).json({ code: "SUCCESS", message: response.message });
  }).catch(err => {
    console.log("error while inserting application id on application_settings", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })

}
exports.updateAppSettings = (req, res) => {
  let appId = req.params.appId;
  let settings = req.body;
  return applicationService.updateAppSettings(settings, appId).then(response => {
    return res.status(200).json({ code: "SUCCESS", message: response.message });
  }).catch(err => {
    console.log("error while updating lead collection", err);
    return res.status(500).json({ code: "ERROR", message: "internal server error" });
  })

}
