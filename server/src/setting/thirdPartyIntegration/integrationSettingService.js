const ThirdPartyIntegrationSettings = require('../../models').ThirdPartyIntegrationSettings;
const customerService = require('../../customer/customerService')
const LIZ = require("../../register/bots.js").LIZ;
const INTEGRATION_PLATFORMS = require('../../application/utils').INTEGRATION_PLATFORMS;

const updateOrCreate = (customerId, type, setting) => {


    return Promise.resolve(ThirdPartyIntegrationSettings.find({ where: { customerId: customerId, type: type } })).then(existingSetting => {
        if (!existingSetting) {
            // Item not found, create a new one
            return Promise.resolve(ThirdPartyIntegrationSettings.create(setting))
                .then(item => { 
                    if (type == INTEGRATION_PLATFORMS.HELPDOCS) {
                        customerService.getCustomerById(customerId).then(customer => {
                            console.log("got the user from db", customer);
                            botPlatformClient.updateBot({
                                "name": LIZ.userName,
                                "applicationKey": customer.applicationId,
                                "handlerModule": "HELP_DOCS_HANDLER"
                              }).catch(err => {
                                logger.error("error while updating bot platform for liz", err);
                              });  

                          }).catch(error => {
                            console.log("Error while getting customer by userId", error);
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

const deleteIntegrationSetting = (customerId, type) => {

    return Promise.resolve(ThirdPartyIntegrationSettings.destroy({ where: { customerId: customerId, type: type } })).then(response => {
         if (type == INTEGRATION_PLATFORMS) {
            customerService.getCustomerById(customerId).then(customer => {
                console.log("got the user from db", customer);
                botPlatformClient.updateBot({
                    "name": LIZ.userName,
                    "applicationKey": customer.applicationId,
                    "handlerModule": "SUPPORT_BOT_HANDLER"
                  }).catch(err => {
                    logger.error("error while updating bot platform for liz", err);
                  });  

              }).catch(error => {
                console.log("Error while getting customer by userId", error);
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