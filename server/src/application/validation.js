const joi = require("joi");
exports.postWelcomeMessage ={
    param:{
        appId:joi.string().required()
    },
    body:{
        message:joi.string().required()
    }
}