const logger = require("../utils/logger");
const axios = require("axios");
var request = require("request");
const config = require("../../conf/config");
const activeCampaignEnabled = config.getProperties().activeCampaignEnabled;

exports.addContact = (options) => {
    return new Promise(function (resolve, reject) {
        if (!activeCampaignEnabled) {
            console.log("active campaign is disabled");
            return resolve(null);
        }
        
        var option = {
            method: 'POST',
            url: 'https://applozic.api-us1.com/admin/api.php?api_action=contact_add',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                api_action: 'contact_add',
                api_key: getActiveCampaignKey(options.product),
                api_output: 'json',
                email: options.email,
                name: options.name,
                tags: options.tags,
                orgname: options.orgname,
                'field[20,0]': options.appId,
                'p[1]': (options.product == "applozic" ? "1":"7"),
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
                return resolve(subscriberId);
            }

        });

    });

}

exports.updateActiveCampaign = (options) => {
    return new Promise(function (resolve, reject) {
        if (!activeCampaignEnabled) {
            console.log("active campaign is disabled");
            return resolve(null);
        }
        var option = {
            method: 'POST',
            url: 'https://applozic.api-us1.com/admin/api.php?api_action=contact_edit',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                api_action: 'contact_edit',
                api_key: getActiveCampaignKey(options.product),
                api_output: 'json',
                id: options.subscriberId,
                email: options.email,
                orgname: options.companyUrl,
                name: options.name,
                tags: options.tags,
                phone: options.contactNo,
                'field[%role%,0]': options.role,
                'field[%industry%,0]': options.industry,
                'field[%company_size%,0]': options.companySize,
                'field[21,0]': options.subscription,
                'p[1]': (options.product == "applozic" ? "1":"7"),
                'status[1]': '1'
            }
        };
        if(options.tags){
            addTags(option)
        }
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

const getActiveCampaignKey = (product) => {
    return config.getProperties().activeCampaignApiKey[product || "kommunicate"];
}

const addTags = (options) => {
    return new Promise(function (resolve, reject) {
        var data = {
            method: 'POST',
            url: "https://applozic.api-us1.com/admin/api.php?api_action=contact_tag_add",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                api_action: 'contact_tag_add',
                api_key: getActiveCampaignKey(options.product),
                api_output: 'json',
                id: options.subscriberId,
                email: options.email,
                tags: options.tags
            }
        };
        request(data, function (error, responseData, response) {
            if (error) {
                logger.error("error while add tags", error);
                return reject(error);
            } else {
                logger.info("response received for updating Active Campaign", response);
                return resolve(response)
            }
        });
    }).catch(err=>{
        return;
    })
}


