const zendeskService = require('./zendeskService');
const registrationService = require('../register/registrationService');
const integrationSettingService = require('../thirdPartyIntegration/integrationSettingService');
const ZENDESK = require('../application/utils').INTEGRATION_PLATFORMS.ZENDESK;
const conversationService = require('../conversation/conversationService');
const applozicClient = require('../utils/applozicClient');
const customerService = require('../customer/CustomerService')



exports.createZendeskTicket = (req, res) => {
    let conversationId = req.params.groupId;
    let ticket = req.body;
    let appId = req.params.appId;
    let headers = req.headers;
    delete headers['host'];
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            return zendeskService.createZendeskTicket(ticket, settings[0]).then(response => {
                console.log("response from zendesk", response);
                let groupInfo = {groupId:conversationId, metadata:{KM_ZENDESK_TICKET_ID: response.data.ticket.id }}
                applozicClient.updateGroup(groupInfo, appId, '', '', headers);
                //conversationService.updateTicketIntoConversation(conversationId, zendeskTicket);
                return res.status(200).json({ code: "SUCCESS", data: response.data });
            });
        });

    }).catch(err => {
        console.log('error while creating ticket', err);
        return res.status(500).json({ code: "ERROR", message: "ticket creation error" });
    });
}

exports.updateZendeskTicket = (req, res) => {
    let ticketId = req.params.ticketId;
    let ticket = req.body;
    let appId = req.params.appId;
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return Promise.all([integrationSettingService.getIntegrationSetting(customer.id, ZENDESK)]).then(([settings]) => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
                return zendeskService.updateTicket(ticketId, ticket, settings[0]).then(response => {
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

exports.getTicket = (req, res) => {
    let ticketId = req.params.ticketId;
    let appId = req.params.appId;
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return Promise.all([integrationSettingService.getIntegrationSetting(customer.id, ZENDESK)]).then(([settings]) => {
            return zendeskService.getTicket(ticketId, settings[0]).then(result => {
                return res.status(200).json({ code: "SUCCESS", data: result.data });
            })

        })
    }).catch(err => {
        console.log('error while getting ticket', err);
        return res.status(500).json({ code: "ERROR", message: err.message });
    })

}