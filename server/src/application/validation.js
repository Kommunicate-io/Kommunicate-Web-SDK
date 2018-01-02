const joi = require("joi");
exports.postWelcomeMessage ={
    param:{
        appId:joi.string().required()
    },
    body:{
        message:joi.string().required()
    }
}
exports.getWelcomeMessage ={
    param:{
        appId:joi.string().required()
    }
}
exports.getInAppMessages ={
    param:{
    	userName:joi.string().required(),
        appId:joi.string().required()
    }
}
exports.disableInAppMsgs ={
    param:{
    	userName:joi.string().required(),
        appId:joi.string().required()
    }
}
exports.enableInAppMsgs ={
    param:{
    	userName:joi.string().required(),
        appId:joi.string().required()
    }
}
exports.createInAppMsg ={
    param:{
    	userName:joi.string().required(),
        appId:joi.string().required()
    },
    body:{
        eventId:joi.number().required().min(1).max(4),
        message:joi.string().required(),
        status:joi.number().required().min(1).max(3),
        sequence: joi.number().required().min(1).max(3),
    }
}