const ThirdPartyIntegrationSettings= require('../models').ThirdPartyIntegrationSettings;

 const updateOrCreate = (where, setting)=> {
    return Promise.resolve(ThirdPartyIntegrationSettings.find({where: where})).then(existingSetting=> {
        if (!existingSetting) {
            // Item not found, create a new one
            return Promise.resolve(ThirdPartyIntegrationSettings.create(setting))
                .then(item =>{ return  {data: item, created: true}; })
        }
         // Found an item, update it
        return Promise.resolve(ThirdPartyIntegrationSettings
            .update(setting, {where: where}))
            .then(item=> { return {data: item, created: false} }) ;
    });
}

module.exports={
    updateOrCreate:updateOrCreate
}