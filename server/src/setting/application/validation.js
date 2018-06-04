const joi = require("joi");
module.exports.getAppSettingsByApplicationId = {
  params: {
    appId: joi.string().required(),
  }
}
module.exports.updateAppSettings = {
  params: {
    appId: joi.string().required(),
  }
}
module.exports.insertAppSetting = {
  body: {
    applicationId: joi.string().required(),
  }
}