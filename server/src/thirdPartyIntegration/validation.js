const joi = require('joi');

module.exports.settings = {
    params: {
        appId: joi.string().required(),
        type: joi.number().integer().required()
    }
}

module.exports.getSettings = {
    params: {
        appId: joi.string().required(),
    },
    query: {
        type: joi.number().integer(),
    }
}