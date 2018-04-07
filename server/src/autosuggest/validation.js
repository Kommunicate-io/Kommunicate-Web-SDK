const joi = require('joi');

module.exports.createSuggestion = {
	body:{
		applicationId: joi.string().required(),
		userName: joi.string().required(),
		category: joi.string().required(),
		content: joi.string().required(),
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
	}
}

module.exports.searchFAQ = {
	query:{
		appId:joi.string().required(),
		query:joi.string().required()
		
	}
}