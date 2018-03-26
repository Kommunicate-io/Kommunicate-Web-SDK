const ThirdPartyIntegrationSettings = require('../models').ThirdPartyIntegrationSettings;

const updateOrCreate = (customerId, type, setting) => {
    return Promise.resolve(ThirdPartyIntegrationSettings.find({ where: { customerId: customerId, type: type } })).then(existingSetting => {
        if (!existingSetting) {
            // Item not found, create a new one
            return Promise.resolve(ThirdPartyIntegrationSettings.create(setting))
                .then(item => { return { data: item, created: true }; })
        }
        // Found an item, update it
        return Promise.resolve(ThirdPartyIntegrationSettings
            .update(setting, { where: { customerId: customerId, type: type } }))
            .then(item => { return { data: item, created: false } });
    });
}

const getZendeskIntegrationSetting = (customerId, type) => {
    return Promise.resolve(ThirdPartyIntegrationSettings.find({ where: { customerId: customerId, type: type } })).then(setting => {
        return setting;
    });
}

const deleteIntegrationSetting = (customerId, type) => {
    return Promise.resolve(ThirdPartyIntegrationSettings.destroy({ where: { customerId: customerId, type: type } })).then(response => {
        return response;
    });
}

module.exports = {
    updateOrCreate: updateOrCreate,
    getZendeskIntegrationSetting: getZendeskIntegrationSetting,
    deleteIntegrationSetting: deleteIntegrationSetting
}