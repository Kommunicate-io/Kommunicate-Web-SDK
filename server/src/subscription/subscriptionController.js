const logger = require("../utils/logger");
const subscriptionService = require("./subscriptionService");
const Boom = require('boom');
exports.createSubscription = async function (req,res) {
    logger.info("request received to create Subscription from : ",req.body);
    let response={};
    let subscriptionData = req.body;
    let isAuthenticated =  await subscriptionService.isAPIKeyValid();
    if(!isAuthenticated){
        logger.info("request received with invalid API key : ",req.param.apiKey);
        return res.status(401,Boom.unAuthorized("Invalid API Key"));
    }
    if(!subscriptionData.applicationId){
        //ToDo: for now applicationId is mendatory field. figure out a way to get applicationId from application Key
        // populate ApplicationId in subscriptionData. 
    }
    return subscriptionService.createOrUpdateSubscription(req.body).then((data)=>{
        return res.status(201).json(data);
    }).catch((err)=>{
        let code,response, httpCode;
        switch(err.name){
            case "SequelizeUniqueConstraintError": 
            code = "CONFLICT"; response = "subscription already exists for event "+req.body.eventType ;httpCode= 409;
            break;

            default:
            code = "SERVER_ERROR"; response = "Internal server error";httpCode= 500;
            break;
        }
            logger.error("err while creating subscription : ",err);
            return res.status(httpCode).json({"code":code,"response":response});
    });
    
}

exports.deleteSubscription = async function (req, res) {
    try {
        logger.info("request received to delete Subscription by Id : ", req.params.subscriptionId);
        let isAuthenticated =  await subscriptionService.isAPIKeyValid();
        if(!isAuthenticated){
        logger.info("request received with invalid API key : ",req.param.apiKey);
        return res.status(401,Boom.unAuthorized("Invalid API Key"));
    }
        let rowDeleted = await subscriptionService.deleteSubscriptionById(req.params.subscriptionId);
        if (rowDeleted) {
            return res.status(200).json({
                code: "SUCCESS",
                response: "subscription deleted sucessfully"
            });
        } else {
            return res.status(404).json({
                code: "NOT_FOUND",
                response: "no subscription found with Id"
            })
        }
    } catch (e) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            response: "something went wrong"
        });
    }


}
exports.getAllSubscriptionByApiKey = async (req,res)=>{
    try{
    logger.info("request received to get all Subscriptions : ");
    let isAuthenticated =  await subscriptionService.isAPIKeyValid(req.query);
    if(!isAuthenticated){
        logger.info("request received with invalid API key : ",req.param.apiKey);
        return res.status(401,Boom.unAuthorized("Invalid API Key"));
    }
    let applicationId  = getAppIdByAppKey();
    let subscriptions = await subscriptionService.getAllSubscriptionByApiKey(applicationId);
    return res.status(200).json({
        code: "SUCCESS",
        response:subscriptions
    });
}catch(e){
    logger.info("error while fetching data", e);
    return res.status(500).json({
        code: "SERVER_ERROR",
        response: "something went wrong"
    });

}
    
}

const getAppIdByAppKey =()=>{
    // todo : create authentication service. get Authentication object from request and return AppId 
    return "";
}


