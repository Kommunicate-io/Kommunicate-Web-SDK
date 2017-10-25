const joi = require('joi');

module.exports.createSuggestion = {
	body:{
		applicationKey: joi.string().required(),
		userName: joi.string().required(),
		category: joi.string().required(),
		name: joi.string().required(),
		content: joi.string().required(),
	}
}