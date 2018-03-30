const joi = require("joi");

module.exports.updateTicket = {
    params: {
        groupId: joi.number().integer().required(),
        appId: joi.string().required()
    },
    body: {
        ticket: {
            status: joi.string().only(['open', 'pending', 'hold', 'solved', 'closed']).required(),
            comment: { body: joi.string() }
        }
    }
}

module.exports.createTicket = {
    params: {
        appId: joi.string().required(),
        groupId: joi.number().integer().required(),
    },
    body: {
        ticket: {
            subject: joi.string().required(),
            comment: { body: joi.string().required() }
        }
    }

}

module.exports.getTicket = {
    params: {
        appId: joi.string().required(),
        groupId: joi.number().integer().required(),
    }
}