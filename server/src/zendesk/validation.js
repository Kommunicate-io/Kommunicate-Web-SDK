const joi = require("joi");

module.exports.updateTicket = {
    params: {
        id: joi.number().integer().required()
    },
    body: {
        ticket: {
            status: joi.string().only(['open', 'pending', 'hold', 'solved', 'closed']).required(),
            comment: { body: joi.string() }
        }
    }
}