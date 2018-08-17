const ThirdPartyIntegrationSettings = require('../../models').ThirdPartyIntegrationSettings;
const customerService = require('../../customer/customerService');
const botPlatformClient = require("../../utils/botPlatformClient");
const LIZ = require("../../register/bots.js").LIZ;
const INTEGRATION_PLATFORMS = require('../../application/utils').INTEGRATION_PLATFORMS;

const updateOrCreate = (customerId, appId, type, setting) => {
    return Promise.resolve(ThirdPartyIntegrationSettings.find({ where: { customerId: customerId, type: type } })).then(existingSetting => {
        if (!existingSetting) {
            // Item not found, create a new one
            return Promise.resolve(ThirdPartyIntegrationSettings.create(setting))
                .then(item => { 
                    if (type == INTEGRATION_PLATFORMS.HELPDOCS) {
                        botPlatformClient.updateBot({
                            "name": LIZ.userName,
                            "applicationKey": appId,
                            "handlerModule": "HELP_DOCS_HANDLER"
                          }).catch(err => {
                            logger.error("error while updating bot platform for liz", err);
                          });
                    }
                    return { data: item, created: true }; 
                })
        }
        // Found an item, update it
        return Promise.resolve(ThirdPartyIntegrationSettings
            .update(setting, { where: { customerId: customerId, type: type } }))
            .then(item => { return { data: item, created: false } });
    });
}

const getIntegrationSetting = (customerId, type) => {
    let criteria={customerId:customerId};
    if(type){
        criteria.type=type;
    }
    return Promise.resolve(ThirdPartyIntegrationSettings.findAll({ where: criteria })).then(setting => {
        return setting;
    });
}

const deleteIntegrationSetting = (customerId, appId, type) => {

    return Promise.resolve(ThirdPartyIntegrationSettings.destroy({ where: { customerId: customerId, type: type } })).then(response => {
         if (type == INTEGRATION_PLATFORMS) {
            botPlatformClient.updateBot({
                "name": LIZ.userName,
                "applicationKey": appId,
                "handlerModule": "SUPPORT_BOT_HANDLER"
              }).catch(err => {
                logger.error("error while updating bot platform for liz", err);
              }); 
        }

        return response;
    });
}

module.exports = {
    updateOrCreate: updateOrCreate,
    getIntegrationSetting: getIntegrationSetting,
    deleteIntegrationSetting: deleteIntegrationSetting
}