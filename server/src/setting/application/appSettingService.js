const applicationSettingModel = require("../../models").AppSetting;
const onboardingModel = require("../../models").Onboarding;
const chatPopupMessageService = require("./chatPopupMessageService");
const logger = require('../../utils/logger');
const deepmerge = require('deepmerge');
const {ONBOARDING_STATUS}= require('../../utils/constant');
const onboardingService = require('../../onboarding/onboardingService');
const cacheClient = require("../../cache/hazelCacheClient");
const APPSETTINGMAP ="appSettingMap"

exports.getAppSettingsByApplicationId = (criteria) => {
    var key = generateKey(criteria.applicationId);
    return cacheClient.getDataFromMap(APPSETTINGMAP, key).then(res => {
        if(res !== null){
            logger.info("picking appsetting data from cache server ");
            return { message: "SUCCESS", data: res };
        }else{
            return Promise.resolve(applicationSettingModel.findAll({ where: criteria})).then(res => {
                let result = res[0];
                if (!result) { return { message: "SUCCESS", data: { message: "Invalid query" } } }
                if(result.popupTemplateKey == null){
                    cacheClient.setDataIntoMap(APPSETTINGMAP, key, result,86,400,000);
                    return { message: "SUCCESS", data: result };
                }
                else{
                    return Promise.resolve(chatPopupMessageService.getChatPopupMessage(result.applicationId)).then(data =>{
                        result.chatPopupMessage = data;
                        cacheClient.setDataIntoMap(APPSETTINGMAP, key, result,86,400,000);
                        return { message: "SUCCESS", data: result };
                    })
                }
            }).catch(err =>{
                logger.info("Application settings get error");
                throw err;
            });
        }
    })
     
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
        settings.helpCenter = deepmerge(appSetting.helpCenter, settings.helpCenter);
    }
    if(settings.supportMails && appSetting.supportMails){
        settings = deepmerge(appSetting.supportMails, settings);
        settings.supportMails = [...new Set(settings.supportMails)]; 
    }
    if (settings.preLeadCollection && appSetting.preLeadCollection) {
        settings = deepmerge(appSetting.preLeadCollection, settings);
        settings.preLeadCollection = [...new Set(settings.preLeadCollection)]; 
    }
    let updateOnboardingStatus = settings.widgetTheme || settings.supportMails
    return Promise.resolve(applicationSettingModel.update(settings, { where: { applicationId: appId } })).then(res => {
        cacheClient.deleteDataFromMap(APPSETTINGMAP, generateKey(appId));
        if(settings.popupTemplateKey == null){
            updateOnboardingStatus && onboardingService.insertOnboardingStatus({applicationId: appId, stepId: settings.widgetTheme ? ONBOARDING_STATUS.WIDGET_CUSTOMIZED :MAILBOX_CONFIGURED, completed:true})
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

const generateKey =(appId)=>{
   return "appSetting-"+appId;
}
