const joi = require('joi');
const Boom = require('boom');

/*const events = joi.object().keys({
    eventId: joi.string().max(20).required(),
    triggerUrl: joi.string().max(100).regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required()
});*/

module.exports.createSubscription = {
    query:{
        apiKey: joi.string().required()
    },body:{
      platform:joi.string().max(20).required(),
      integrationName: joi.string().max(20).required(),
      //events: joi.array().items(events).required()
      eventType: joi.string().max(20).required(),
      triggerUrl: joi.string().max(100).regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required()
    }
    
  }