const logger = require("../utils/logger");
const { KnowledgeBaseModel } = require('./knowledgeBase')
const crypto = require('crypto');
const stringUtils = require("underscore.string");
const knowledgeBaseESClient = require("./faqSearchService");
const { getNextCount } = require('./counter');


const generateHash = (message) => {
    if (stringUtils.isBlank(message)) { return null; }
    message = message.trim()
    message = message.replace(/\?/g, '');
    return crypto.createHash('md5').update(message).digest('hex');
}

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

const createSuggestion = async (suggestion) => {
    suggestion.id = await getNextCount(KnowledgeBaseModel.modelName, "id")
    return KnowledgeBaseModel.create(suggestion).then(result => {
        return result;
    }).catch(error => {
        logger.error("error while creating auto suggestion/faq", error);
        throw error;
    });
}

const updateSuggestion = (suggestion) => {
    return KnowledgeBaseModel.updateOne({ "id": suggestion.id }, suggestion).then(result => {
        return result;
    })
}
const deleteSuggestion = (suggestion) => {
    return KnowledgeBaseModel.updateOne({ "id": suggestion.id }, { 'deleted': true }).then(result => {
        return result;
    })
}

const searchFAQ = async (options) => {
    var data;
    if (options.text) {
        data = await searchQuery(options);
    } else if (options.id) {
        options.id = parseInt(options.id);
        data =  KnowledgeBaseModel.find({
            id: options.id,
            type: "faq",
            status: "published",
            applicationId: options.appId,
            deleted: false
        }).select({ name: 1, content: 1, referenceId: 1, id: 1, _id: 0 });
    } else if (options.referenceId) {
        data =  KnowledgeBaseModel.find({
            referenceId: parseInt(options.referenceId),
            type: "learning",
            status: "published",
            applicationId: options.appId,
            deleted: false
        }).select({ name: 1, content: 1, referenceId: 1, id: 1, _id: 0 })
    } else if (options.key) {
        data =  KnowledgeBaseModel.find({
            key: options.key,
            type: "faq",
            status: "published",
            applicationId: options.appId,
            deleted: false
        }).select({ name: 1, content: 1, referenceId: 1, id: 1, _id: 0 });
    } else {
        data =  KnowledgeBaseModel.find({
            type: "faq",
            status: "published",
            applicationId: options.appId,
            deleted: false
        }).select({ name: 1, content: 1, referenceId: 1, id: 1, _id: 0 });
    }

    for (var i = 0; i < data.length; i += 1) {
        var knowledge = data[i];
        if (knowledge.referenceId != null && (knowledge.content == null || knowledge.content == "")) {
            var result = KnowledgeBaseModel.find({
                id: knowledge.referenceId,
                deleted: false,
                status: { '$nin': ['un_answered'] }
            }).select({ name: 1, content: 1, referenceId: 1, id: 1, _id: 0 });
            data[i].content = result[0].content;
        }
    }

    return data;
}
/**
 * @param {Number} pageNumber 
 * @param {Number} pageSize 
 * @param {Object} criteria 
 * pagination API
 */
const fetchFAQs = (pageNumber, pageSize, criteria) => {
    return KnowledgeBaseModel.find(criteria)
        .skip((pageNumber - 1) * pageSize)
        .size(pageSize)
        .sort({ id: 1 })
        .catch(error => {
            throw error;
        });
}

/**
 * @param {*} options 
 * search text into content and name
 */
const searchQuery = (options) => {
    return knowledgeBaseESClient.searchRawQuery({
        "query": {
            "bool": {
                "must": {
                    "match": {
                        "content": options.text
                    }
                },
                "filter": {
                    "bool": {
                        "must": [
                            { "term": { "applicationId.keyword": options.appId } },
                            { "term": { "type.keyword": "faq" } },
                            { "term": { "deleted.keyword": false } },
                            { "term": { "status.keyword": "published" } },
                        ]
                    }
                }
            }
        }
    }).catch(error => {
        throw error;
    });
}
/**
 * search raw query into esClient
 */
const searchESQueryByCriteria = (query)=>{
    return knowledgeBaseESClient.searchRawQuery(query).catch(error=>{
        throw error;
    });
}


module.exports = {
    getAllSuggestions,
    createSuggestion,
    updateSuggestion,
    deleteSuggestion,
    searchFAQ,
    fetchFAQs,
    getSuggestionsByCriteria,
    getSuggestionsByAppId,
    generateHash,
    searchESQueryByCriteria
}