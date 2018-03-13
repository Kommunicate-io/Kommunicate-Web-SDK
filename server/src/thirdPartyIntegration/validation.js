const joi = require('joi');

module.exports.settings = {
    params: {
        appId: joi.string().required(),
        type: joi.number().integer().required()
    },
    body: {
        accessKey: joi.string(),
        accessToken: joi.string(),
        domain: joi.string(),
    }
}