const logger = require("../utils/logger");
const axios = require("axios");
var request = require("request");
const config = require("../../conf/config");
const apiKey = config.getProperties().activeCampaignApiKey;
exports.addContact = (options) => {
    return new Promise(function (resolve, reject) {
        var option = {
            method: 'POST',
            url: 'https://applozic.api-us1.com/admin/api.php?api_action=contact_add',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                api_action: 'contact_add',
                api_key: apiKey,
                api_output: 'json',
                email: options.email,
                'p[1]': '7',
                'status[1]': '1'
            }
        };
        request(option, function (error, response, data) {
            //if (error) throw new Error(error);

            if (error) {
                logger.error("error ", error);
                return reject(error);
            } else {
                logger.info("response received for the entry of email to Active Campaign", data);
                var activeCampaignResponse = JSON.parse(data);
                subscriberId = activeCampaignResponse.subscriber_id;
                console.log(subscriberId);
                return resolve(subscriberId)
            }

        });

    });

}

exports.updateActiveCampaign = (options) => {

    return new Promise(function (resolve, reject) {
        var option = {
            method: 'POST',
            url: 'https://applozic.api-us1.com/admin/api.php?api_action=contact_edit',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                api_action: 'contact_edit',
                api_key: apiKey,
                api_output: 'json',
                id: options.subscriberId,
                email: options.email,
                orgname: options.companyUrl,
                name: options.name,
                phone: options.contactNo,
                'field[%role%,0]': options.role,
                'field[%industry%,0]': options.industry,
                'field[%company_size%,0]': options.companySize,
                'p[1]': '7',
                'status[1]': '1'
            }
        };
        request(option, function (error, response, data) {
            //if (error) throw new Error(error);

            if (error) {
                logger.error("error while updating Active campaign", error);
                return reject(error);
            } else {
                logger.info("response received for updating Active Campaign", data);
                return resolve(data)
            }

        });

    });

}


