const axios = require("axios");
const AgileCRMManager = require('./agileCrmClient');
const AGILE_CRM = require('../application/utils').INTEGRATION_PLATFORMS.AGILE_CRM;
const logger = require('../utils/logger.js');
const customerService = require('../customer/customerService');
const integrationSettingService = require('../setting/thirdPartyIntegration/integrationSettingService');

const createContact = async function(settings, userInfo){
    if(!settings){
        settings =  await getSettings(userInfo.applicationId);
        if(!settings){
            return;
        }
    }
    return new Promise(function (resolve, reject) {
        let response = {};
        var obj = new AgileCRMManager(settings.domain, settings.accessToken, settings.accessKey);
        var contact = {
            "properties": []
        };
        if (userInfo.tags) {
            let tags = [];
            for (var i = 0; i < userInfo.tags.length; i++) {
                tags.push(userInfo.tags[i])
            }
            contact["tags"] = tags
        }
        if (userInfo.lead_score) {
            contact["lead_score"] = userInfo.lead_score;
        }
        if (userInfo.star_value) {
            contact["star_value"] = userInfo.star_value;
        }
    (userInfo.displayName ||userInfo.userId) && contact.properties.push({
            "type": "SYSTEM",
            "name": "first_name",
            "value": userInfo.displayName || userInfo.userId
        })


        userInfo.last_name && contact.properties.push({
            "type": "SYSTEM",
            "name": "last_name",
            "value": userInfo.last_name
        })


        userInfo.company_name && contact.properties.push({
            "type": "SYSTEM",
            "name": "company",
            "value": userInfo.company_name
        })


        userInfo.designation && contact.properties.push({
            "type": "SYSTEM",
            "name": "tile",
            "value": userInfo.designation
        })


        userInfo.email && contact.properties.push({
            "type": "SYSTEM",
            "name": "email",
            "value": userInfo.email
        })


        userInfo.address && contact.properties.push({
            "type": "SYSTEM",
            "name": "address",
            "value": JSON.stringify(userInfo.address)
        })


       /* userInfo.customField && userInfo.customField.name && userInfo.customField.value && contact.properties.push({
            "type": "CUSTOM",
            "name": userInfo.customField.name,
            "value": userInfo.customField.value
        })*/
        if(userInfo.metadata){
            for( var i=0; i< Object.keys(userInfo.metadata).length; i++ ) {
               var field = {    "type" : "CUSTOM",
                                "name"   :   Object.keys(userInfo.metadata)[i],
                                "value":  userInfo.metadata[Object.keys(userInfo.metadata)[i]]
                }

                contact.properties.push(field);
            }
        }
    

        obj.contactAPI.add(contact, function (data) {
            // console.log(data);
            response = data;
            return resolve(response);

        }, function (err) {
            // console.log(err);
            response = err;
            return reject(err);
        })


    });

}
const updateContact = async function(settings, contactId, userInfo){
   
    if(!settings){
        settings =  await getSettings(userInfo.applicationId);
        if(!settings){
            return;
        }
    }
    return new Promise(function (resolve, reject) {
        let response = {};
        var obj = new AgileCRMManager(settings.domain, settings.accessToken, settings.accessKey);
        var update_contact = {
            "id": contactId,
            "properties": []
        };
        userInfo.displayName && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "first_name",
            "value": userInfo.displayName
        })
       
        userInfo.last_name && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "last_name",
            "value": userInfo.last_name
        })


        userInfo.company_name && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "company",
            "value": userInfo.company_name
        })


        userInfo.designation && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "title",
            "value": userInfo.designation
        })


        userInfo.email && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "email",
            "value": userInfo.email
        })


        userInfo.address && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "address",
            "value": JSON.stringify(userInfo.address)
        })


        if(userInfo.metadata){
            for( var i=0; i< Object.keys(userInfo.metadata).length; i++ ) {
                if(typeof userInfo.metadata[Object.keys(userInfo.metadata)[i]] == 'string'){
               var field = {    "type" : "CUSTOM",
                                "name"   :   Object.keys(userInfo.metadata)[i],
                                "value":  userInfo.metadata[Object.keys(userInfo.metadata)[i]]
                }

                contact.properties.push(field);
            }
            }
        }

        obj.contactAPI.update(update_contact, function (data) {
            // console.log(data);
            response = data;
            return resolve(response);

        }, function (err) {
            //    console.log(err);
            response = err;
            return reject(err);
        })

    });

}
const updateTag = (settings, contactId, userInfo) => {
    return new Promise(function (resolve, reject) {
        let response = {};
        var obj = new AgileCRMManager(settings.domain, settings.accessToken, settings.accessKey);
        var update_tags = {
            "id": contactId,
        };
        if (userInfo.tags) {
            let tags = [];
            for (var i = 0; i < userInfo.tags.length; i++) {
                tags.push(userInfo.tags[i])
            }
            update_tags["tags"] = tags
        }
        obj.contactAPI.updateTagsById(update_tags, function (data) {
            // console.log(data);
            response = data;
            return resolve(response);

        }, function (err) {
            // console.log(err);
            response = err;
            return reject(err);
        })

    });

}

const getSettings = async function(applicationId){
    let customer = await  customerService.getCustomerByApplicationId(applicationId);
    let settings = await integrationSettingService.getIntegrationSetting(customer.id,AGILE_CRM);
    if(settings.length == 0){
        logger.info("agile crm is not integrated for Application Id",appId);
        return null;
    }else{
       return settings[0];  
    }
       
}



module.exports = {
    createContact,
    updateContact,
    updateTag
}