const joi= require('joi');

exports.createIssueTypeAutoReply={
    body:{
        issueTypeId:joi.number().integer().required(),
        message:joi.string(),
        createdBy:joi.string(),
        sequence:joi.number().integer(), 
    }
}