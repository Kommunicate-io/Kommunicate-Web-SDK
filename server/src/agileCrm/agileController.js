const agileService = require('./agileService')
const registrationService = require('../register/registrationService');
const integrationSettingService = require('../setting/thirdPartyIntegration/integrationSettingService');
const AGILE_CRM = require('../application/utils').INTEGRATION_PLATFORMS.AGILE_CRM;
const customerService= require('../customer/CustomerService')

exports.createContact = (req, res) => {
    let appId = req.params.appId;
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, AGILE_CRM).then(settings => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for Agile CRM' });
            }
            return agileService.createContact(settings[0], req.body).then(response => {
                // console.log("response from agile CRM", response);
                return res.status(200).json({ code: "SUCCESS", response: response });
            })

        });

    }).catch(err => {
        console.log('error while creating agile crm contact', err);
        // return res.status(500).json({ code: "ERROR", message: "contact creation error" });
        return res.status(500).json({ status: "ERROR", code: err.code, message: err.data });
    });
}
exports.updateContact = (req, res) => {
    let appId = req.params.appId;
    let agileContactId = req.params.contactId
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, AGILE_CRM).then(settings => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for Agile CRM' });
            }
            return agileService.updateContact(settings[0], agileContactId, req.body).then(response => {
                console.log("response from agile CRM", response);
                return res.status(200).json({ code: "SUCCESS", response: response });
            })

        });

    }).catch(err => {
        console.log('error while updating agile crm contact', err);
        return res.status(500).json({ status: "ERROR", code: err.code, message: err.data });
    });
}
exports.updateTag = (req, res) => {
    let appId = req.params.appId;
    let agileContactId = req.params.contactId
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, AGILE_CRM).then(settings => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for Agile CRM' });
            }
            return agileService.updateTag(settings[0], agileContactId, req.body).then(response => {
                console.log("response from agile CRM", response);
                return res.status(200).json({ code: "SUCCESS", response: response });
            })

        });

    }).catch(err => {
        console.log('error while updating agile crm tag for a contact ', err);
        return res.status(500).json({ status: "ERROR", code: err.code, message: err.data });
    });
}


