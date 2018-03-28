const zendeskService = require('./zendeskService');
const registrationService = require('../register/registrationService');
const integrationSettingService = require('../thirdPartyIntegration/integrationSettingService');
const ZENDESK = require('../application/utils').INTEGRATION_PLATFORMS.ZENDESK;



exports.createZendeskTicket = (req, res) => {
    let ticket = req.body;
    let appId = req.params.appId;
    return registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (!settings) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            return zendeskService.createZendeskTicket(ticket, settings).then(response => {
                console.log("response from zendesk", response);
                return res.status(200).json({ code: "SUCCESS", data: response.data });
            });
        });

    }).catch(err => {
        console.log('error while creating ticket', err);
        return res.status(500).json({ code: "ERROR", message: "ticket creation error" });
    });
}

exports.updateZendeskTicket = (req, res) => {
    let id = req.params.id;
    let ticket = req.body;
    let appId = req.params.appId;
    return registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (!settings) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            return zendeskService.updateTicket(id, ticket, settings).then(response => {
                console.log("response from zendesk", response);
                if (response.statusText && response.statusText == "OK") {
                    return res.status(200).json({ code: "SUCCESS", data: response.data });
                } else {
                    return res.status(response.status).json({ code: "ERROR", message: response })
                }
            });
        });
    }).catch(err => {
        console.log('error while updating ticket', err);
        return res.status(err.response.status).json({ code: "ERROR", message: err.message });
    })

}