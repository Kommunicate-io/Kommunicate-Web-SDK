const joi = require("joi");
module.exports.getFeedValidation ={
  params:{
    groupId: joi.number().required()
	}
}
module.exports.createFeedValidation ={
  body:{
    groupId: joi.number().required(),
    comment:joi.string(),
    rating:joi.number().required().min(0).max(10)
  }
}
