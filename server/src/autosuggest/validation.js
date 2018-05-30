const joi = require('joi');

module.exports.createSuggestion = {
	body:{
		applicationId: joi.string().required(),
		userName: joi.string().required(),
		category: joi.string().required()
	}
}

module.exports.updateSuggestion = {
	body:{
		id:joi.number().required(),
	}
}

module.exports.deleteSuggetion = {
	body:{
		id:joi.number().required(),
		applicationId: joi.string().required()
	}
}

module.exports.searchFAQ = {
	query:{
		appId:joi.string().required(),
		query:joi.string(),
		articleId:joi.string(),
		referenceId:joi.number()
	}
}