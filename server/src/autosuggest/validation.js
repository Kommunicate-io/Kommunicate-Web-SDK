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

module.exports.deleteSuggestion = {
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
module.exports.searchFAQv2= {
	params:{
		appId: joi.string().required()
	},
	query:{
		query:joi.string(),
		articleId:joi.string(),
		referenceId:joi.number()
	}
}
module.exports.fetchSuggestion = {
	params:{
		appId: joi.string().required()
	}
}

module.exports.insertFaqCategory = {
	body: {
		applicationId: joi.string().required()
	}
}

module.exports.updateFaqCategory = {
	body: {
		type: joi.number().required()
	}
}

module.exports.getFaqCategory = {
	query: {
		appId: joi.string().required()
	}
}

module.exports.deleteFaqCategory = {
	query: {	
		type: joi.number().required(),
		applicationId: joi.string().required()
	}
}