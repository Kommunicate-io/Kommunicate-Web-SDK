const logger = require("../utils/logger");
const db = require("../models");
exports.isAPIKeyValid = async function(key){
    // todo validate API key
    return true;
} 

exports.createSubscription= async function(data){
    logger.info("creating sucscription..");
    return Promise.resolve(db.AppSubscription.create(data));
}

/**
 * 
 * @param {AppSubscription} criteria 
 */
exports.getSubscription= async function(criteria){
      logger.info("geting subscription by criteria", criteria);
      return Promise.resolve(db.AppSubscription.find({where: criteria}));
  }
exports.deleteSubscriptionById= async function(subscriptionId){
    let subscription =  await Promise.resolve(db.AppSubscription.find({where:{id:subscriptionId}}));
    if(subscription){
        return subscription.destroy({ force: true });
    }
    return 0;
}

exports.getAllSubscriptionByApiKey = async (applicationId)=>{
    let criteria ={}
    applicationId && (criteria.applicationId = applicationId);
    return Promise.resolve(db.AppSubscription.findAll({where:criteria}));
}

