const joi = require('joi');
module.exports.createContact = {
    params: {
        appId: joi.string().required()
    }
}
module.exports.updateContact = {
    params: {
        appId: joi.string().required(),
        contactId: joi.string().required()
    }
}
module.exports.updateTag = {
    params: {
        appId: joi.string().required(),
        contactId: joi.string().required()
    }
}