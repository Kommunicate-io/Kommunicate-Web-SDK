const joi = require('joio');

module.exports.createSuggestion = {
	body:{
		category: joi.string().required(),
		name: joi.string().required(),
		content: joi.string().required(),
	}
}