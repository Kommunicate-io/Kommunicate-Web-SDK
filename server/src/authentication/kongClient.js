/** This module is a communication bridge between Kong API gateway and Kommunicate server.
 * It provide wrappers for Kong APIs In async-await style.      
 * @author <a href="mailto:suraj@kommunicate.io">Suraj</a>
 */
const logger = require("../utils/logger");
const axios =require("axios");
const config= require("../../conf");

const endPoints = {
    "CONSUMERS": "/consumers",
    "GENERATE_KEY": "/consumers/{consumerId}/key-auth",
    "KEY_OUTH":"/key-auths"
}

 module.exports.createConsumer= async (applicationId) => {
    logger.info("creating consumer for application, ",applicationId);
    let createConsumerUrl = config.kong.adminUrl+endPoints.CONSUMERS;
    return axios.post(createConsumerUrl,{"username":applicationId}).then(response=>{
        logger.info("consumer created ", response.data);
        return response.data;
    }).catch(e=>{
        logger.info("error while creating consumer : ", e);
        if(e.response&& e.response.statusCode==409){
            logger.info("consumer already exists");
            return {"code":"CONFLICT"}; 
        }
        return null;
    })

 }
/**
 * Genrerate a new API Key for Application.   
 * @param {String} applicationId it can be either application Id or consumerId provided by kong 
 */
 module.exports.generateAPIKey= async (applicationId) => {
    logger.info("generating a  key for application ",applicationId);
    let generateKeyUrl = config.kong.adminUrl+endPoints.GENERATE_KEY.replace("{consumerId}", applicationId);
    return axios.post(generateKeyUrl).then(response=>{
        logger.info("generated Key for application", applicationId);
        return response.data;
    }).catch(e=>{
        logger.info("error while generated Key : ", e);
        return null;
    })

 }
 /**
 * get an API key associated with a consumer.   
 * @param {String} consumerId consumerId provided by kong 
 */
module.exports.getAPIKey= async (consumerId,limit) => {
    limit= limit||1;
    logger.info("fetching API key for consumer ",consumerId);
    let fetchKey = config.kong.adminUrl+endPoints.KEY_OUTH+"?consumer_id="+consumerId+"&size="+limit;
    return axios.get(fetchKey).then(response=>{
        logger.info("fetched Key successfully");
        return response.data;
    }).catch(e=>{
        logger.info("error while fetching Key : ", e);
        return null;
    })

 }

/**
 * fetch consumer detail by Id.
 * @param {*} consumerId applicationId or consumerId provided by Kong 
 */
module.exports.getConsumer= async (consumerId) => {
    logger.info("fetching consumer detail by id ",consumerId);
    let getConsumerUrl = config.kong.adminUrl+endPoints.CONSUMERS+"/"+consumerId;
    return axios.get(getConsumerUrl).then(response=>{
        logger.info("fetched consumer detail successfully");
        return response.data;
    }).catch(e=>{
        logger.info("error while fetching consumer detail  : ", e);
        return null;
    })

 }