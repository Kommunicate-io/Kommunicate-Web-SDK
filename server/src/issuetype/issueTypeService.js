const applozicClient = require("../utils/applozicClient");
const userService= require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const issueTypeModel = require("../models").IssueType;

exports.getById = (issueTypeId) => {
    return Promise.resolve(issueTypeModel.findAll({where:{id:issueTypeId}}));
}

exports.getByCustomerId=(customerId)=>{
    return Promise.resolve(issueTypeModel.findAll({where:{customerId:customerId}}));
}


exports.createIssue = (options) => {
    console.log("creating new issue, options:", options);
    let IssueType = {
        issueName: options.issueName,
        description: options.description,
        createdBy: options.createdBy,
        status: options.status,
        customerId: options.customerId
    }

    return Promise.resolve(issueTypeModel.create(IssueType)).then(result => {
        console.log("issue created successfully", result);
        return result;
    });

}

exports.updateIssueType=(issueType)=>{
    return issueTypeModel.update(IssueType, {
		where: {
			id: issueType.id
		}
	});

}

exports.deleteIssueTypeById = (issueTypeId)=>{
    return issueTypeModel.destroy( {
		where: {
			id: issueTypeId
		}
	});

}