const logger = require('../../utils/logger');
const chatPopupMessageModel = require("../../models").ChatPopupMessage;
const appSettingService = require("./appSettingService");

/**
 * This Function is to add chat popup message data.
 * @param {applicationId : string}
 * @param {message : string, url : string, delay : number} data
 */
const createChatPopupMessage = (appId, data) => {
    logger.info("Request Received to create : ", data, appId);
    return Promise.resolve(appSettingService.getAppSettingIdByApplicationId(appId)).then(appSettingId => {
        data.appSettingId = appSettingId;
        logger.info("Processing: ", data);
        return chatPopupMessageModel.create(data).then(res => {
            logger.info("Inserted data in chat popup message table");
        })
    }).catch(err => {
        logger.info('error while creating chat popup message data : ' + data);
        logger.error(err);
        throw err;
    });
};

/**
 * This Function is to delete chat popup message data.
 * @param {applicationId : string} appId
 * @param {url : string} data 
 */
const deleteChatPopupMessage = (appId, data) => {
    logger.info("request received to delete : ", data);
    return Promise.resolve(appSettingService.getAppSettingIdByApplicationId(appId)).then(appSettingId => {
        let criteria = {
            appSettingId: appSettingId,
            url: data.url
        };
        return chatPopupMessageModel.destroy({
            where: criteria
        }).then(data => {
            logger.info("Deleted data in db : ", data);
            return data;
        })
    }).catch(err => {
        logger.info('error while deleting chat popup message data : ' + data, err);
        throw err;
    });
};

/**
 * This Function is to update chat popup message data.
 * @param {applicationId : string} appId
 * @param {message : string, url : string, delay : number} data 
 */
const updateChatPopupMessage = (appId, data) => {
    logger.info("request received to update : ", data);
    return Promise.resolve(appSettingService.getAppSettingIdByApplicationId(appId)).then(appSettingId => {
        let criteria = {
            appSettingId: appSettingId,
            url: data.url
        }
        data.appSettingId = appSettingId;
        return Promise.resolve(chatPopupMessageModel.findOne({where:criteria}, {raw:true})).then(res => {
            if(res == null){
                return chatPopupMessageModel.create(data);
              }
            else{
                return chatPopupMessageModel.update(data, { where: criteria })
            }
        }).then(result => {
            logger.info("Data updated in chatPopupTemplate : ", data);
            return result;
        })
    }).catch(err => {
        logger.info('error while deleting chat popup message data : ' + data, err);
        throw err;
    });
};

/**
 * This Function is to get user's preference.
 * @param {applicationId : string} appId 
 * @returns {applicationId : string, [appSettingId : string, message : string, url : string, delay : number]} appId and list of all the chat Popup Data
 */
const getChatPopupMessage = (appId) => {
    logger.info("request received to get chat popup message : ", appId);
    return Promise.resolve(appSettingService.getAppSettingIdByApplicationId(appId)).then(appSettingId => {
        let criteria = {
            appSettingId: appSettingId
        }
        logger.info("appSettingId received : ", appSettingId);
        return Promise.resolve(chatPopupMessageModel.findAll({
            where: criteria
        }), {
            raw: true
        }).then(chatPopupData => {
            chatPopupData.applicationId = appId;
            return chatPopupData;
        })
    }).catch(err => {
        logger.info('error while retrieving Chat Popup Message data : ' + criteria, err);
        throw err;
    });
};


module.exports = {
    createChatPopupMessage: createChatPopupMessage,
    deleteChatPopupMessage: deleteChatPopupMessage,
    updateChatPopupMessage: updateChatPopupMessage,
    getChatPopupMessage: getChatPopupMessage
}