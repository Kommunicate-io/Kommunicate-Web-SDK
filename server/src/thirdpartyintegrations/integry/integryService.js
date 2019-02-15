const logger = require('../../utils/logger');
const subscriptionService = require('../../subscription/subscriptionService');
const axios =require('axios');
const platform ={INTEGRY:"integry"} 

/** notify integry that a user has been created into kommunicate.
 * @param {string} eventName
 * @param {object} data to be sent to Integry
 */
exports.sendUserEventToIntegry = async function(eventName, data){
    logger.info('sending event to integry', eventName );
    let subscription = await subscriptionService.getSubscription({platform:platform.INTEGRY,eventType:eventName,applicationId:data.applicationId});
    if(!subscription || ! subscription.triggerUrl){
        logger.info('No subscription found for event ', eventName ,"applicationId :",data.applicationId);
        return;
    }
    return axios.post(subscription.triggerUrl,getFormatedData(data,eventName)).then(response=>{
        logger.info("respose received from Integry ", response.status, response.data);
    }).catch(e=>{
        logger.error("error while creating user in integry", e);
    })
}

const getFormatedData=(data,eventName)=>{
    let formatedInfo = {};
    formatedInfo.eventType = eventName;
    formatedInfo.id = data.id;
    formatedInfo.userId  = data.userId;
    formatedInfo.applicationId = data.applicationId;
    formatedInfo.displayName = data.displayName || data.email || data.userId;
    data.companyName && (formatedInfo.companyName = data.companyName);
    data.email && (formatedInfo.email = data.email);
    (data.phoneNumber || data.contactNumber)&& (formatedInfo.phoneNumber = data.phoneNumber || data.contactNumber);

    if(data.metadata){
        let formatedMetadata ={};
        for( var i=0; i< Object.keys(data.metadata).length; i++ ) {
            let key = Object.keys(data.metadata)[i];
            let value = data.metadata[Object.keys(data.metadata)[i]] 
            try{
               JSON.parse(value) 
            }catch(e){
               // if exception comes means its string;
               // alowing only string values.
               formatedMetadata[key]= value;
            }  
        }
        formatedInfo.metadata = formatedMetadata;
    }
    //logger.info("formatted data", JSON.stringify(formatedInfo));
    return formatedInfo;
}
