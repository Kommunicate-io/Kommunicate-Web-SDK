const axios = require("axios");
const AgileCRMManager = require('./agileCrmClient')

const createContact = (settings, userInfo) => {
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
        userInfo.first_name && contact.properties.push({
            "type": "SYSTEM",
            "name": "first_name",
            "value": userInfo.first_name
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


        userInfo.customField && userInfo.customField.name && userInfo.customField.value && contact.properties.push({
            "type": "CUSTOM",
            "name": userInfo.customField.name,
            "value": userInfo.customField.value
        })

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
const updateContact = (settings, contactId, userInfo) => {
    return new Promise(function (resolve, reject) {
        let response = {};
        var obj = new AgileCRMManager(settings.domain, settings.accessToken, settings.accessKey);
        var update_contact = {
            "id": contactId,
            "properties": []
        };
        if (userInfo.tags) {
            let tags = [];
            for (var i = 0; i < userInfo.tags.length; i++) {
                tags.push(userInfo.tags[i])
            }
            update_contact["tags"] = tags
        }

        userInfo.first_name && update_contact.properties.push({
            "type": "SYSTEM",
            "name": "first_name",
            "value": userInfo.first_name
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
            "name": "tile",
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


        userInfo.customField && userInfo.customField.name && userInfo.customField.value && update_contact.properties.push({
            "type": "CUSTOM",
            "name": userInfo.customField.name,
            "value": userInfo.customField.value
        })

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



module.exports = {
    createContact,
    updateContact
}