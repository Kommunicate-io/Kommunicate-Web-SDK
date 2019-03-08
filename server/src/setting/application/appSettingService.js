const applicationSettingModel = require("../../models").AppSetting;
const chatPopupMessageService = require("./chatPopupMessageService");
const logger = require('../../utils/logger');
const deepmerge = require('deepmerge');

exports.getAppSettingsByApplicationId = (criteria) => {
    return Promise.resolve(applicationSettingModel.findAll({ where: criteria , raw:true})).then(res => {
        let result = res[0];
        if (!result) { return { message: "SUCCESS", data: "Invalid query" } }
        if(result.popupTemplateKey == null){
            return { message: "SUCCESS", data: result };
        }
        else{
            return Promise.resolve(chatPopupMessageService.getChatPopupMessage(result.applicationId)).then(data =>{
                result.chatPopupMessage = data;
                return { message: "SUCCESS", data: result };
            })
        }
    }).catch(err =>{
        logger.info("Application settings get error");
        throw err;
    });
}

exports.insertAppSettings = (settings) => {
    return Promise.resolve(applicationSettingModel.create(settings)).then(res => {    
        if(settings.popupTemplateKey == null){
            return { message: "application settings inserted successfully" };
        }
        else{
            return Promise.resolve(chatPopupMessageService.createChatPopupMessage(settings.applicationId, settings.chatPopupMessage)).then(data => {
                logger.info("success data inserted into db ");
                return { message: "application settings inserted successfully" };
            })
        }
    }).catch(err => {
            logger.info("application settings insert error ")
            throw err;
        });
    }

exports.updateAppSettings = async (settings, appId) => {
   let appSetting = await applicationSettingModel.find({ where: { applicationId: appId }});
    if (!appSetting) { throw new Error("APPLICATION_NOT_FOUND") }
    if(settings.helpCenter && appSetting.helpCenter){
        settings = deepmerge(appSetting.helpCenter, settings);
    }
    if(settings.supportMails && appSetting.supportMails){
        settings = deepmerge(appSetting.supportMails, settings);
        settings.supportMails = [...new Set(settings.supportMails)]; 
    }
    return Promise.resolve(applicationSettingModel.update(settings, { where: { applicationId: appId } })).then(res => {
        if(settings.popupTemplateKey == null){
            return { message: "application settings updated successfully" };
        }
        else{
            return Promise.resolve(chatPopupMessageService.updateChatPopupMessage(appId, settings.chatPopupMessage)).then(data => {
                logger.info("success, sending response ");
                return { message: "application settings updated successfully" };
            });
        }
    }).catch(function (err) {
        logger.info("application settings update error in transaction");
        throw err;
    });
}

exports.getAppSettingByCriteria = (criteria) => {
    return Promise.resolve(applicationSettingModel.findAll(criteria )).then(result=>{
        return result;
    });
}

exports.getAppSettingIdByApplicationId = (appId) => {
    return Promise.resolve(applicationSettingModel.findAll({where: {applicationId:appId} }, {raw:true})).then(result=>{
        // logger.info(result);
        return result[0].id;
    });
}