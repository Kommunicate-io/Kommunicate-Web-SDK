const joi = require("joi");


module.exports.createCustomer= {
    body:{
      name: joi.string(),
      userName: joi.string().email().required(),
      email : joi.string().email(),
      password: joi.string(),
      companyName :joi.string(),
      companySize : joi.string()
      }
  }
module.exports.patchCustomer={
  body:{
        applicationId:joi.string().required()
  }
}