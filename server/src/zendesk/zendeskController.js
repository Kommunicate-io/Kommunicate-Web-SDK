const zendeskService = require('./zendeskService');
const registrationService = require('../register/registrationService');
const integrationSettingService = require('../thirdPartyIntegration/integrationSettingService');
const ZENDESK = require('../application/utils').INTEGRATION_PLATFORMS.ZENDESK;



exports.createZendeskTicket = (req, res) => {
    let ticket = req.body;
    let appId = req.params.appId;
    registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        integrationSettingService.getZendeskIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (!settings) {
                res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            zendeskService.createZendeskTicket(ticket, settings).then(response => {
                console.log("response from zendesk", response);
                res.status(200).json({ code: "SUCCESS", data: response.data });
            });
        });

    }).catch(err => {
        console.log('error while creating ticket', err);
        res.status(500).json({ code: "ERROR", message: "ticket creation error" });
    });
}

exports.updateZendeskTicket = (req, res) => {
    let id = req.params.id;
    let ticket = req.body;
    let appId = req.params.appId;
    registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        integrationSettingService.getZendeskIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (!settings) {
                res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            zendeskService.updateTicket(id, ticket, settings).then(response => {
                console.log("response from zendesk", response);
                if (response.statusText && response.statusText == "OK") {
                    res.status(200).json({ code: "SUCCESS", data: response.data });
                } else {
                    res.status(response.status).json({ code: "ERROR", message: response })
                }
            });
        });
    }).catch(err => {
        console.log('error while updating ticket', err);
        res.status(err.response.status).json({ code: "ERROR", message: err.message });
    })

}