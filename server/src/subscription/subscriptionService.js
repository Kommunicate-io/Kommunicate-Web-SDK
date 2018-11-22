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
/***
 *This method find the subscription by (applicationId, platform, eventType) and update it.
 *@param {Object} subscriptionData  
 */
exports.updateSubscription = async (criteria, subscription)=>{
    logger.info("updating  sucscription by criteria..",criteria);
    return Promise.resolve(db.AppSubscription.update(subscription,{where :criteria }));
    }
/***
 *This method find the subscription  by (applicationId, platform, eventType) and update it if found. if not found It will creat ea new subscription.
 *@param {Object} subscriptionData  
 */
exports.createOrUpdateSubscription = async (subscription)=>{
    let criteria ={applicationId:subscription.applicationId,platform:subscription.platform,eventType:subscription.eventType}; 
    let oldSubscription = await this.getSubscription(criteria);
    let data = {};
    if(oldSubscription){
       let noOfRows=  await this.updateSubscription(criteria,subscription)
        data.code = "UPDATED";
        data.affectedRows = noOfRows && noOfRows[0];
        
    }else {
        data.code = "CREATED";
        data.data = await this.createSubscription(subscription);
    };
    return data;
}
