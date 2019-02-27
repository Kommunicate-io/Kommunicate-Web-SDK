const logger = require("../utils/logger");
const mongoClient = require("../mongodb/client");
const collections = require("../mongodb/collections").COLLECTIONS;
const crypto = require('crypto');

const generateHash = (message) => {
	if (stringUtils.isBlank(message)) { return null; }
	message = message.trim()
	message = message.replace(/\?/g, '');
	return crypto.createHash('md5').update(message).digest('hex');
}

const getAllSuggestions = () => {
		return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE});
}

const getSuggestionsByAppId = (applicationId, type) => {
	let criteria = { applicationId: applicationId, deleted:false ,status:{'$nin':['un_answered']}}
	if (type) {
		criteria.type = type
	}
	return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE,query:criteria});
}

const getSuggestionsByCriteria = (criteria, value, applicationId) => {
	let criteriaObj = {deleted:false, status:{'$nin':['un_answered']}};
	criteriaObj[criteria] = value;
	if(criteria == 'id'){
		criteriaObj[criteria] = parseInt(value, 10);
	}
	criteriaObj.applicationId = applicationId;
	return mongoClient.find({"collectionName":collections.KNOWLEDGE_BASE,query:criteriaObj});
}

const createSuggestion = (suggestion) => {
	return mongoClient.getNextSequence(collections.KNOWLEDGE_BASE,"id").then(value=>{
		suggestion.id = value;
		suggestion.key = suggestion.name ?  generateHash(suggestion.name): null;
		 return mongoClient.insertOne(collections.KNOWLEDGE_BASE,suggestion).then(mongoResult=>{
			return mongoResult;
		}).catch(e=>{
			logger.error("error while creating auto suggestion/faq",e);
			throw e;
		});
	})
}

const updateSuggestion = (suggestion) => {
	if(suggestion.name ){
		suggestion.key = generateHash(suggestion.name)
	}
	return mongoClient.updateOne({collectionName:collections.KNOWLEDGE_BASE,criteria:{"id":suggestion.id},update:suggestion}).then(mongoResult=>{
		return mongoResult;
	})
}

const deleteSuggestion = (suggestion) => {
	return mongoClient.updateOne({collectionName:collections.KNOWLEDGE_BASE,criteria:{"id":suggestion.id},update:{'deleted':true}}).then(mongoResult=>{
		return mongoResult;
	})
}
exports.searchFAQ = async (options)=>{
	options.collectionName = collections.KNOWLEDGE_BASE;
	var data;
	if(options.id){
		options.id=parseInt(options.id);
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{id:options.id,type:"faq",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	} else if (options.referenceId) {
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{referenceId:parseInt(options.referenceId),type:"learning",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	}else if(options.text){
		data = await mongoClient.searchFAQ(options);
	}else if(options.key){
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{key:options.key,type:"faq",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	} else{
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{type:"faq",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	}

	for(var i = 0; i < data.length; i += 1) {
		var knowledge = data[i];
		if (knowledge.referenceId != null && (knowledge.content == null || knowledge.content == "")) {
			var result = mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{id:knowledge.referenceId, deleted:false, status:{'$nin':['un_answered']}},options:{projection:{name:1,content:1,id:1,_id:0}}});
			data[i].content = result[0].content;
		}
	}

	return data;
}

const fetchFAQs = (pageNumber, pageSize, criteria) => {
	let query = {
		'collectionName': collections.KNOWLEDGE_BASE,
		'pageNumber': pageNumber,
		'pageSize': pageSize,
		'criteria': criteria,
		'order': { id: 1 } // order by id ASC
	}
	return mongoClient.fetchPages(query).catch(error => {
		throw error;
	});
}

exports.fetchFAQs = fetchFAQs;
exports.getAllSuggestions = getAllSuggestions
exports.createSuggestion = createSuggestion
exports.getSuggestionsByAppId = getSuggestionsByAppId
exports.updateSuggestion = updateSuggestion
exports.deleteSuggestion = deleteSuggestion
exports.getSuggestionsByCriteria = getSuggestionsByCriteria
exports.generateHash = generateHash;