const joi = require('joi');

module.exports.createSuggestion = {
	body:{
		customerId: joi.string().required(),
	}
}