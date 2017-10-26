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

const getSuggestionsByAppKey = (applicationKey) => {
	
	// SELECT * FROM auto_suggest WHERE  applicationKey='default' OR applicationKey=applicationKey;

	return autoSuggestModel.findAll({
		where: {
			[Op.or]: [{applicationKey:'default'}, {applicationKey:applicationKey}]
		}})
		.then(suggestions => {
			return suggestions
		})
		.catch(err => err);
}

const createSuggestion = (suggestion) => {
	return autoSuggestModel.create(suggestion)
}

exports.getAllSuggestions = getAllSuggestions
exports.createSuggestion = createSuggestion
exports.getSuggestionsByAppKey = getSuggestionsByAppKey