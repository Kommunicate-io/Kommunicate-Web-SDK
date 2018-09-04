const logger = require("../utils/logger");
const kongClient = require("./kongClient");
const config = require("../../conf");
exports.getApplicationIdByApplicationkey = async function (application) {}

exports.createConsumerAndGenerateKey = async (applicationId) => {
    if (!config.kong || !config.kong.enabled) {
        return "";
    }
    if (!applicationId) {
        logger.info("empty application id received");
        return null;
    }
    logger.info("creating consumer for application :", applicationId);
    let consumer = await kongClient.createConsumer(applicationId);
    // TODO : check for CONFLICT status
    if (consumer && consumer.code != "CONFLICT") {
        let consumerId = consumer.username;
        let creds = await kongClient.generateAPIKey(consumerId);
        return creds ? creds.key : "";
    }
    return "";

}

exports.getAPIKey = async (applicationId) => {
    try {
        if (!config.kong || !config.kong.enabled) {
            return "";
        }
        if (!applicationId) {
            logger.info("can not get APIKey,  empty application id received :");
            return null;
        }
        let consumer = await kongClient.getConsumer(applicationId);
        let creds = consumer && await kongClient.getAPIKey(consumer.id, 1);
        let apiKeyObj = creds.data && creds.data[0]
        return apiKeyObj ? apiKeyObj.key : "";
    } catch (e) {
        logger.info("error while fetching API key ", e);
        return null;
    }

}