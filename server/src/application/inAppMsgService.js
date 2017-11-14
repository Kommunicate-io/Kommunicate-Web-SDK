const db = require('../models');
const registrationService = require('../register/registrationService');
const appUtils = require('./utils');
const applozicClient = require("../utils/applozicClient");
exports.postWelcomeMsg=(options)=>{
    return db.InAppMsg.find({where:{customerId:options.customer.id}}).then(inAppMessage=>{
        if(!inAppMessage){
            inAppMessage = {
                customerId:options.customer.id,
                eventId:appUtils.EVENTS.CONVERSATION_STARTED,
                message:options.message,
                status:appUtils.EVENT_STATUS.ENABLED
            }
            return db.InAppMsg.create(inAppMessage);
        }else{
            return db.InAppMsg.update({message:options.message},{where:{customerId:options.customer.id}});
        }
        
    })
    
}
exports.sendWelcomeMessage=(message,bot)=>{
    return db.InAppMsg.find({where:{customerId:bot.customerId}}).then(inAppMessage=>{
        return applozicClient.
    })
}