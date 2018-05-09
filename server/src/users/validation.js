const joi = require("joi");

const businessHours=joi.object().keys({
    day: joi.string().regex(/((mon|tues|wednes|thurs|fri|satur|sun)(day))/,"-i").required(),
    openTime: joi.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    closeTime:joi.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required()
    //day: joi.string()
});
const getBusinessHours ={
  params:{
    userName:joi.string().required()
  },
  query:{
    applicationId:joi.string().required()
  }
}
module.exports.createUser= {
  body:{
    name: joi.string(),
    userName: joi.string().required(),
    type: joi.number().min(1).max(2).integer().required(),
    applicationId : joi.string().required(),
    email : joi.string(),
    password: joi.string().required(),
    role: joi.string(),
    company_name :joi.string(),
    company_size : joi.string()
	}
}
module.exports.updateBusinessHours = {
  body:{
    workingHours: joi.array().items(businessHours).required(),
    applicationId: joi.string().required(),
    timezone : joi.string(),
    offHoursMessage : joi.string()
  },
  params:{
    userName:joi.string().required()
  }
}

module.exports.getAllUser = {
  query:{
    appId:joi.string().required(),
    //type:joi.number().min(1).max(2).integer()
  }
}

module.exports.updatePassword = {
  body:{
    userName:joi.string().required(),
    applicationId:joi.string().required(),
    oldPassword:joi.string().required(),
    newPassword:joi.string().required()
  }
}
module.exports.botStatus = {
  params: {
    botId: joi.string().required(),
    appId: joi.string().required(),
    status: joi.number().integer().only([0, 1])
  }
}

exports.getBusinessHours= getBusinessHours;
exports.businessHoursInAday=businessHours;
