const applicationSettingModel = require("../../models").AppSetting;
const onboardingModel = require("../../models").Onboarding;
const chatPopupMessageService = require("./chatPopupMessageService");
const logger = require('../../utils/logger');
const deepmerge = require('deepmerge');
const {ONBOARDING_STATUS}= require('../../utils/constant');
const onboardingService = require('../../onboarding/onboardingService');
const cacheClient = require("../../cache/hazelCacheClient");
const APPSETTINGMAP ="appSettingMap";
const expiryTime = 86400000;
const Sequelize = require("sequelize");
const { fn, col ,literal} = Sequelize;

exports.getAppSettingsByApplicationId = (criteria) => {
        return Promise.resolve(applicationSettingModel.findAll({ where: criteria})).then(res => {
            let result = res[0];
            if (!result) { return { message: "SUCCESS", data: { message: "Invalid query" } } }
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
exports.getAppSettingsByDomain = criteria => {
    var key = generateKey(criteria.helpCenter.domain);
    return cacheClient.getDataFromMap(APPSETTINGMAP, key).then(res => {
        if (res) {
            logger.info("picking appSetting from cache , key:",key);
            return {
                message: "SUCCESS",
                data: res
            };
        } else {
            return applicationSettingModel.find({
                where: fn('JSON_CONTAINS', literal('help_center->"$.domain"'), '"' + criteria.helpCenter.domain + '"'),
            }).then(result => {
                cacheClient.setDataIntoMap(APPSETTINGMAP, key, result, expiryTime);
                return {
                    message: "SUCCESS",
                    data: result
                };
            }).catch(err => {
                logger.info("error while fetching appSetting");
                throw err;
            });
        }
    });
};

exports.getAppSettingsByApplicationIdFromCache = criteria => {
  var key = generateKey(criteria.applicationId);
  return cacheClient.getDataFromMap(APPSETTINGMAP, key).then(res => {
    if (res) {
      logger.info("picking appsetting data from cache server ");
      return { message: "SUCCESS", data: res };
    } else {
      return Promise.resolve(this.getAppSettingsByApplicationId(criteria))
        .then(res => {
          cacheClient.setDataIntoMap(APPSETTINGMAP, key, res.data, expiryTime);
          return res;
        })
        .catch(err => {
          logger.info("Application settings get error");
          throw err;
        });
    }
  });
};

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
        if(settings.helpCenter.domain && Array.isArray(settings.helpCenter.domain)){
            settings.helpCenter = deepmerge(appSetting.helpCenter.domain, settings.helpCenter);
            settings.helpCenter.domain = [...new Set(settings.helpCenter.domain)];  
        }else{
            settings.helpCenter = deepmerge(appSetting.helpCenter, settings.helpCenter);
        }
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
    return Promise.resolve(applicationSettingModel.update(settings, { where: { applicationId: appId }})).then(res => {
        appSetting.helpCenter && appSetting.helpCenter.domain && appSetting.helpCenter.domain.filter(domain =>{ cacheClient.deleteDataFromMap(APPSETTINGMAP, generateKey(domain));}) ;
        cacheClient.deleteDataFromMap(APPSETTINGMAP, generateKey(appId));
        
        if(settings.popupTemplateKey == null){
            updateOnboardingStatus && onboardingService.insertOnboardingStatus({applicationId: appId, stepId: settings.widgetTheme ? ONBOARDING_STATUS.WIDGET_CUSTOMIZED : ONBOARDING_STATUS.MAILBOX_CONFIGURED, completed:true})
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

const generateKey =(key)=>{
    if(key){
        return "appSetting-"+key;
    }
    return null;
}
