const joi = require('joi');

module.exports.createIssueType = {
	body:{
		issueName: joi.string(),
		description:joi.string(),
		createdBy:joi.number().integer(),
		customerId:joi.number().integer(),
		status:joi.string().required().valid('active', 'pending', 'deleted')
	}
}