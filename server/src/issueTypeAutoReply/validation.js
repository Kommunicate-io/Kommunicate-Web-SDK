const joi= require('joi');

exports.createIssueTypeAutoReply={
    body:{
        issueTypeId:joi.number().integer().required(),
        message:joi.string(),
        createdBy:joi.string(),
        sequence:joi.number().integer(), 
    }
}

exports.updateIssueTypeAutoReply={
    body:{
        id:joi.number().integer().required(),
        issueTypeId:joi.number().integer(),
        message:joi.string(),
        createdBy:joi.number(),
        sequence:joi.number().integer(), 
    }
}