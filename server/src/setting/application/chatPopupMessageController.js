const chatPopupMessageService = require("./chatPopupMessageService");
const logger = require('../../utils/logger');

exports.createChatPopupMessage = (req, res) => {
    appId = req.params.appId;
    data = req.body;
    logger.info("request received to create chat popup : ", appId, data);
    return Promise.resolve(chatPopupMessageService.createChatPopupMessage(appId, data)).then(data => {
        logger.info("Sending response");
        return res.status(200).json({
            message: "SUCCESS"
        });
    }).catch(err => {
        logger.error("error while creating chat popup data :", err);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    })
};

exports.deleteChatPopupMessage = (req, res) => {
    appId = req.params.appId;
    data = req.body;
    logger.info("request received to delte user preference : ", req.body);
    return Promise.resolve(chatPopupMessageService.deleteChatPopupMessage(appId, data)).then(data => {
        logger.info("Sending response");
        return res.status(200).json({
            message: "SUCCESS"
        });
    }).catch(err => {
        logger.error("error while deleting chat popup data :", err);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    })
};

exports.updateChatPopupMessage = (req, res) => {
    appId = req.params.appId;
    data = req.body;
    logger.info("request received to update chat popup data : ", req.body);
    return Promise.resolve(chatPopupMessageService.updateChatPopupMessage(appId, data)).then(data => {
        logger.info("Sending response");
        return res.status(200).json({
            message: "SUCCESS"
        });
    }).catch(err => {
        logger.error("error while creating chat popup data :", err);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    })
};


exports.getChatPopupMessage = (req, res) => {
    appId = req.params.appId;
    logger.info("request received to update chat popup data : ", req.body);
    return Promise.resolve(chatPopupMessageService.getChatPopupMessage(appId)).then(data => {
        logger.info("Sending response");
        return res.status(200).json({
            message: "SUCCESS",
            data: data
        });
    }).catch(err => {
        logger.error("error while creating chat popup data :", err);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    })
};