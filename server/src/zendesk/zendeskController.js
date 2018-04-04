const zendeskService = require('./zendeskService');
const registrationService = require('../register/registrationService');
const integrationSettingService = require('../thirdPartyIntegration/integrationSettingService');
const ZENDESK = require('../application/utils').INTEGRATION_PLATFORMS.ZENDESK;
const conversationService = require('../conversation/conversationService');



exports.createZendeskTicket = (req, res) => {
    let conversationId = req.params.groupId;
    let ticket = req.body;
    let appId = req.params.appId;
    return registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return integrationSettingService.getIntegrationSetting(customer.id, ZENDESK).then(settings => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            return zendeskService.createZendeskTicket(ticket, settings[0]).then(response => {
                console.log("response from zendesk", response);
                let zendeskTicket = { type: ZENDESK, ticketId: response.data.ticket.id }
                conversationService.updateTicketIntoConversation(conversationId, zendeskTicket);
                return res.status(200).json({ code: "SUCCESS", data: response.data });
            });
        });

    }).catch(err => {
        console.log('error while creating ticket', err);
        return res.status(500).json({ code: "ERROR", message: "ticket creation error" });
    });
}

exports.updateZendeskTicket = (req, res) => {
    let conversationId = req.params.groupId;
    let ticket = req.body;
    let appId = req.params.appId;
    return registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return Promise.all([conversationService.getConversationByGroupId(conversationId), integrationSettingService.getIntegrationSetting(customer.id, ZENDESK)]).then(([conversation, settings]) => {
            if (settings.length == 0) {
                return res.status(200).json({ code: "SUCCESS", message: 'no configuration found for zendesk' });
            }
            let zendeskDetail = conversation.metadata.integration.map(item => {
                if (item.type == ZENDESK) {
                    return item;
                }
            });
            if (zendeskDetail.length > 0) {
                return zendeskService.updateTicket(zendeskDetail[0].ticketId, ticket, settings[0]).then(response => {
                    console.log("response from zendesk", response);
                    if (response.statusText && response.statusText == "OK") {
                        return res.status(200).json({ code: "SUCCESS", data: response.data });
                    } else {
                        return res.status(response.status).json({ code: "ERROR", message: response })
                    }
                });
            } else {
                return res.status(200).json({ code: "SUCCESS", message: 'no ticket for this' });
            }

        });
    }).catch(err => {
        console.log('error while updating ticket', err);
        return res.status(err.response.status).json({ code: "ERROR", message: err.message });
    })

}

exports.getTicket = (req, res) => {
    let conversationId = req.params.groupId;
    let appId = req.params.appId;
    return registrationService.getCustomerByApplicationId(appId).then(customer => {
        if (!customer) {
            return res.status(200).json({ code: "SUCCESS", message: 'no customer found for this applicationId' });
        }
        return Promise.all([conversationService.getConversationByGroupId(conversationId), integrationSettingService.getIntegrationSetting(customer.id, ZENDESK)]).then(([conversation, settings]) => {
            let zendeskDetail = conversation.metadata.integration.map(item => {
                if (item.type == ZENDESK) {
                    return item;
                }
            });
            if (zendeskDetail.length > 0 && settings.length > 0) {
                return zendeskService.getTicket(zendeskDetail[0].ticketId, settings[0]).then(result => {

                    return res.status(200).json({ code: "SUCCESS", data: result.data });
                })
            } else {
                return res.status(200).json({ code: "SUCCESS", message: 'no ticket for this' });
            }
        })
    }).catch(err => {
        console.log('error while getting ticket', err);
        return res.status(500).json({ code: "ERROR", message: err.message });
    })

}