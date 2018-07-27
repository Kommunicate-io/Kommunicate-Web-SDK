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
    let subscription = await subscriptionService.getSubscription({platform:platform.INTEGRY,eventType:eventName});
    //let subscription ={triggerUrl :"http://requestbin.fullcontact.com/15deda61" };
    if(!subscription || ! subscription.triggerUrl){
        logger.info('No subscription found for event ', eventName );
        return;
    }
    return axios.post(subscription.triggerUrl,getFormatedData(data)).then(response=>{
        logger.info("respose received from Integry ", response.status, response.data);
    }).catch(e=>{
        logger.error("error while creating user in integry", e);
    })
}

const getFormatedData=(data)=>{
    let formatedInfo = {};
    formatedInfo.id = data.userId;
    data.displayName &&  (formatedInfo.name = data.displayName);
    data.companyName && (formatedInfo.companyName = data.companyName);
    data.email && (formatedInfo.email = data.email);
    data.phoneNumber && (formatedInfo.phoneNumber = data.phoneNumber);

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
