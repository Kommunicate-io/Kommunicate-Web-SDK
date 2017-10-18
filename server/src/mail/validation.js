const joi = require("joi");
exports.sendMail ={
    body:{
    to: joi.array().items(joi.string().email()).required(),
    cc: joi.array().items(joi.string().email()),
    bcc:joi.array().items(joi.string().email()),
    subject:joi.string(),
    text:joi.string(),
    html:joi.string(),
    from:joi.string().required()
    }
}
