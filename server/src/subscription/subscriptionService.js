const logger = require("../utils/logger");
const db = require("../models");
exports.isAPIKeyValid = async function(){
    // todo validate API key
    return true;
} 

exports.createSubscription= async function(data){
  /*let subscriptionList =   data.events && data.events.map((item)=>{
      return {
        "platform" : data.platform,
        "integrationId":data.integrationId,
        "eventId": item.eventId,
        "triggerUrl":item.triggerUrl
        
      }
  })*/
    logger.info("creating sucscription..");
    return Promise.resolve(db.AppSubscription.create(data));
}

/**
 * 
 * @param {AppSubscription} criteria 
 */
exports.getSubscription= async function(criteria){
      logger.info("geting subscription by criteria", criteria);
      return Promise.resolve(db.AppSubscription.find({$where: criteria}));
  }