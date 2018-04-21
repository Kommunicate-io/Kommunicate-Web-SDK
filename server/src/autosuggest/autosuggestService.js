const routes = require("../routers/routes.js");
const autoSuggestModel = require("../models").AutoSuggest;
const db = require("../models");
const stringUtils = require("underscore.string");
const config = require("../../conf/config");
const Sequelize= require("sequelize");
const Op = Sequelize.Op;
const logger = require("../utils/logger");
const mongoClient = require("../mongodb/client");
const collections = require("../mongodb/collections").COLLECTIONS;

const getAllSuggestions = () => {
		return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE});
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
	return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE,query:criteria});
}

const getSuggestionsByCriteria = (criteria, value, applicationId) => {
	let criteriaObj = {};
	criteriaObj[criteria] = value;
	if(criteria == 'id'){
		criteriaObj[criteria] = parseInt(value, 10);
	}
	criteriaObj.applicationId = applicationId;
	return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE,query:criteriaObj});
}

const createSuggestion = (suggestion) => {
	suggestion.created_at = new Date().getTime();
	return mongoClient.getNextSequence(collections.KNOWLEDGE_BASE,"id").then(value=>{
		suggestion.id= value;
		 return mongoClient.insertOne(collections.KNOWLEDGE_BASE,suggestion).then(mongoResult=>{
			//return data;
			return mongoResult;
		}).catch(e=>{
			logger.error("error while creating auto suggestion/faq",e);
			throw e;
		});
	})
}

const updateSuggetion = (suggestion) => {
	return mongoClient.updateOne({collectionName:collections.KNOWLEDGE_BASE,criteria:{"id":suggestion.id},update:suggestion}).then(mongoResult=>{
		return mongoResult;
	})
}

const deleteSuggetion = (suggestion) => {
	// todo needto restrict delete on customer basic
	 return mongoClient.deleteOne({collectionName:collections.KNOWLEDGE_BASE,criteria:{"id":suggestion.id,applicationId:suggestion.applicationId}})
	.then(deleteResult=>{
		logger.info("dataDeleted successfully");
	   return deleteResult;
	});
	
}
exports.searchFAQ =(options)=>{
	options.collectionName = collections.KNOWLEDGE_BASE;
	var data;
	if(options.id){
		options.id=parseInt(options.id);
		data = mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{id:options.id,type:"faq",status:"published",applicationId:options.appId},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	} else if (options.referenceId) {
		data = mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{referenceId:parseInt(options.referenceId),type:"learning",status:"published",applicationId:options.appId},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	}else if(options.text){
		data = mongoClient.searchFAQ(options);
	}else{
		data = mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{type:"faq",status:"published",applicationId:options.appId},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	}

	for(var i = 0; i < data.length; i += 1) {
		var knowledge = data[i];
		if (knowledge.referenceId != null && (knowledge.content == null || knowledge.content == "")) {
			var result = mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{id:knowledge.referenceId},options:{projection:{name:1,content:1,id:1,_id:0}}});
			data[i].content = result[0].content;
		}
	}

	return data;
}

exports.getAllSuggestions = getAllSuggestions
exports.createSuggestion = createSuggestion
exports.getSuggestionsByAppId = getSuggestionsByAppId
exports.updateSuggetion = updateSuggetion
exports.deleteSuggetion = deleteSuggetion
exports.getSuggestionsByCriteria = getSuggestionsByCriteria