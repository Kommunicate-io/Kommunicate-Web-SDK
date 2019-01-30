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

// validators for chat pop message routes 
module.exports.createChatPopupMessage= {
  params: {
    appId: joi.string().required(),
  },
  body:{
    url: joi.string().required(),
    message: joi.string().required(),
    delay: joi.number().integer().required()
	}
}

module.exports.updateChatPopupMessage= {
  params: {
    appId: joi.string().required(),
  },
  body:{
    url: joi.string().required()
	}
}

module.exports.deleteChatPopupMessage= {
  params: {
    appId: joi.string().required(),
  },
  body:{
    url: joi.string().required()
	}
}

module.exports.getChatPopupMessage= {
  params: {
    appId: joi.string().required(),
  }
}
