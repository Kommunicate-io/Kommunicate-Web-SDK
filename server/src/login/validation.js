const joi = require("joi");
module.exports.login= {
  body:{
    userName :joi.string().required(),
    password: joi.string().required(),
    applicationId : joi.string().required()
	}
}
