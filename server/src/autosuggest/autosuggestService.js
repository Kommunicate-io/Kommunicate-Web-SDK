const routes = require("../routers/routes.js");
const autoSuggestModel = require("../models").AutoSuggest;
const db = require("../models");
const stringUtils = require("underscore.string");
const config = require("../../conf/config");
const Sequelize= require("sequelize");
const Op = Sequelize.Op;

const getAllSuggestions = () => {
	return autoSuggestModel.findAll()
		.then(suggestions => {
			return suggestions
		})
		.catch(err => err);
}

const getSuggestionsByUser = (userName) => {
	return autoSuggestModel.findAll({
		where: {
			userName: userName
		}})
		.then(suggestions => {
			return suggestions
		})
		.catch(err => err);
}

const getSuggestionsByAppId = (applicationId, type) => {
	let criteria = { applicationId: applicationId }
	if (type) {
		criteria.type = type
	}
	return autoSuggestModel.findAll({ where: criteria }).then(suggestions => {
		return suggestions
	}).catch(err => {
		throw err;
	});
}

const getSuggestionsByCriteria = (criteria, value, applicationId) => {

	let criteriaObj = {};

	criteriaObj[criteria] = value;

	if(criteria == 'id'){
		criteriaObj[criteria] = parseInt(value, 10);
	}

	criteriaObj.applicationId = applicationId;

	return autoSuggestModel.findAll({
		where: criteriaObj
	}).then(suggestions => {
		return suggestions
	}).catch(err => err);
}

const createSuggestion = (suggestion) => {
	return autoSuggestModel.create(suggestion)
}

const updateSuggetion = (suggestion) => {
	return autoSuggestModel.update(suggestion, {
		where: {
			id: suggestion.id
		}
	});
}

const deleteSuggetion = (suggestion) => {
	return autoSuggestModel.destroy( {
		where: {
			id: suggestion.id
		}
	});
}

exports.getAllSuggestions = getAllSuggestions
exports.createSuggestion = createSuggestion
exports.getSuggestionsByAppId = getSuggestionsByAppId
exports.updateSuggetion = updateSuggetion
exports.deleteSuggetion = deleteSuggetion
exports.getSuggestionsByCriteria = getSuggestionsByCriteria