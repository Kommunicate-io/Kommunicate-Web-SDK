const joi = require('joi');
const Boom = require('boom');


/* eslint-disable */
module.exports.createSubscription = {
    query: {
        apiKey: joi.string().required()
    }, body: {
        platform: joi.string().max(20).required(),
        integrationName: joi.string().max(20),
        //events: joi.array().items(events).required()
        eventType: joi.string().max(20).required(),
        applicationId: joi.string().max(150).required(),
        triggerUrl: joi.string().max(100).regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required()
    }

}

module.exports.deleteSubscription = {
    query: {
        apiKey: joi.string().required()
    },
    params: {
        subscriptionId: joi.string().required()
    }
}
module.exports.getAllSubscriptionByApiKey = {
    query: {
        apiKey: joi.string().required()
    }
}
module.exports.getSubscription = {
    params: {
        userId: joi.string().required()
    }
}
module.exports.updateSubscription = {
    params: {
        userId: joi.string().required()
    },
    body: {
        planQuantity: joi.number().integer().required()
    }
}