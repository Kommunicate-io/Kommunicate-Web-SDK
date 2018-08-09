const  axios = require('axios');
const request = require('request');
const customerservice = require('../customer/customerService');
const config = require('../../conf/index.js');
const logger = require("../utils/logger");

exports.insertFaq = (data) =>
    {
    var questions = data['name'].split(",")
    data['name'] = questions
    logger.info(data);
    logger.info(config.getProperties().urls.rasaUrl + 'faq/add');
    
    return new Promise(function(resolve, reject){
        request.post(
            config.getProperties().urls.rasaUrl + 'faq/add',
            { json:data },
            function (error, response, body) {
                if (!error) {
                    logger.info(response.statusCode)
                    return resolve(response.statusCode)
                }
                return reject(error)
            }
        );
    });
}


exports.updateFaq = (data) =>
    {
    var questions = data['name'].split(",")
    data['name'] = questions
    return new Promise(function(resolve, reject){
        request.post(
            config.getProperties().urls.rasaUrl + 'faq/update',
            { json:data },
            function (error, response, body) {
                if (!error) {
                    logger.info(response.statusCode)
                    return resolve(response.statusCode)
                }
                return reject(error)
            }
        );

    });
    
}


exports.deleteFaq = (data) =>
    {
    logger.log(data)

    return new Promise(function(resolve, reject){
        request.post(
            config.getProperties().urls.rasaUrl + 'faq/delete',
            { json:data },
            function (error, response, body) {
                if (!error) {
                    logger.info(response.statusCode)
                    return resolve(response.statusCode)
                }
                return reject(error)
            }
        );

    });

}
