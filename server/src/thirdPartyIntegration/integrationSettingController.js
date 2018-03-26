const integrationSettingService = require('./integrationSettingService');
const registrationService = require('../register/registrationService');


exports.updateOrCreate = (req, res) => {
    let appId = req.params.appId;
    let settings = req.body;
    let type = req.params.type;
    return Promise.resolve(registrationService.getCustomerByApplicationId(appId)).then(customer => {
        if (!customer) {
          return  res.status(200).json({ code: "SUCCESS", message: "no user found" })
        }
        settings.customerId = customer.id;
        settings.type = type;
        return integrationSettingService.updateOrCreate(customer.id, type, settings).then(response => {
            console.log('response of creating settings', response);
           return res.status(200).json({ code: "SUCCESS", message: response })
        });

    }).catch(err => {
        console.log('error while inserting thirdparty setting', err)
        return res.status(500).json({ code: "ERROR", message: "creation error" });
    })

}

exports.getZendeskIntegrationSetting = (req, res) => {
    let appId = req.params.appId;
    let type = req.params.type;
    return Promise.resolve(registrationService.getCustomerByApplicationId(appId)).then(customer => {
        if (!customer) {
          return res.status(200).json({ code: "SUCCESS", message: "no user found" })
        }
       return integrationSettingService.getZendeskIntegrationSetting(customer.id, type).then(response => {
            console.log('response', response);
          return res.status(200).json({ code: "SUCCESS", message: response })
        })
    }).catch(err => {
        console.log('error thirdparty setting', err)
        return res.status(500).json({ code: "ERROR", message: "error" });
    })

}

exports.deleteIntegrationSetting = (req, res) => {
    let appId = req.params.appId;
    let type = req.params.type;
    return Promise.resolve(registrationService.getCustomerByApplicationId(appId)).then(customer => {
        if (!customer) {
          return res.status(200).json({ code: "SUCCESS", message: "no user found" })
        }
       return integrationSettingService.deleteIntegrationSetting(customer.id, type).then(response => {
            console.log('response', response);
          return res.status(200).json({ code: "SUCCESS", message: response })
        })
    }).catch(err => {
        console.log('error thirdparty setting', err)
        return res.status(500).json({ code: "ERROR", message: "error" });
    })

}


