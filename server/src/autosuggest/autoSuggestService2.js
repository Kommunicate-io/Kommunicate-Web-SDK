const logger = require("../utils/logger");
const { KnowledgeBaseModel } = require('./knowledgeBase')
const crypto = require('crypto');
const mongoClient = require("../mongodb/client");
const collections = require("../mongodb/collections").COLLECTIONS;


const getAllSuggestions = async () => {
    let arr = await KnowledgeBaseModel.find();
    return arr;
}

const getSuggestionsByAppId = (applicationId, type) => {
    let criteria = { applicationId: applicationId, deleted: false, status: { '$nin': ['un_answered'] } }
    if (type) {
        criteria.type = type
    }
    return KnowledgeBaseModel.find(criteria);
}
const getSuggestionsByCriteria = (criteria, value, applicationId) => {
    let criteriaObj = { deleted: false, status: { '$nin': ['un_answered'] } };
    criteriaObj[criteria] = value;
    if (criteria == 'id') {
        criteriaObj[criteria] = parseInt(value, 10);
    }
    criteriaObj.applicationId = applicationId;
    return KnowledgeBaseModel.find(criteriaObj);
}

const createSuggestion = (suggestion) => {
    return KnowledgeBaseModel.create(suggestion).then(result => {
        return result;
    }).catch(error => {
        logger.error("error while creating auto suggestion/faq", error);
        throw e;
    });
}

const updateSuggestion = (suggestion) => {
	if(suggestion.name ){
		suggestion.key = generateHash(suggestion.name)
	}
	return KnowledgeBaseModel.updateOne({"id":suggestion.id},suggestion).then(result=>{
		return result;
	})
}
const deleteSuggestion = (suggestion) => {
	return KnowledgeBaseModel.updateOne({"id":suggestion.id},{'deleted':true}).then(result=>{
		return result;
	})
}

const searchText = (text)=>{
if(text){
   return mongoClient.searchFAQ(options);
}
return [];
} 

const searchFAQ = async (options)=>{
    var data;
    if(options.text){
        data=await searchText(options.text)
    }else if(options.id){
		options.id=parseInt(options.id);
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{id:options.id,type:"faq",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
	} else if (options.referenceId) {
		data = await mongoClient.find({collectionName:collections.KNOWLEDGE_BASE,query:{referenceId:parseInt(options.referenceId),type:"learning",status:"published",applicationId:options.appId,deleted:false},options:{projection:{name:1,content:1,referenceId:1,id:1,_id:0}}});
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

const searchQuery = (query) => {
    return new Promise((resolve, reject) => {
        KnowledgeBaseModel.search({ query_string: { "query": query } }, { hydrate: true }, function (err, results) {
            if (err) {
                return reject({})
            }
            console.log("res: ", results, "results.hits.hits: ", results.hits.hits)
            return resolve(results.hits.hits);
        });
    })
}
module.exports = {
    getAllSuggestions,
    createSuggestion,
    updateSuggestion,
    deleteSuggestion,
    searchFAQ,
    searchQuery,
    fetchFAQs,
    getSuggestionsByCriteria,
    getSuggestionsByAppId
}

