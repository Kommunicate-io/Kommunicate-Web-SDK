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

const getSuggestionsByAppId = (applicationId) => {
	
	// SELECT * FROM auto_suggest WHERE applicationId=applicationId;

	return autoSuggestModel.findAll({
		where: {
			// SELECT * FROM auto_suggest WHERE  applicationKey='default' OR applicationKey=applicationKey;
			// [Op.or]: [{applicationKey:'default'}, {applicationKey:applicationKey}]
			applicationId: applicationId
		}})
		.then(suggestions => {
			return suggestions
		})
		.catch(err => err);
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