const logger = require("../utils/logger");
const {
    KnowledgeBaseModel
} = require('./knowledgeBase')
const {
    faqCategoryModel
} = require('./faqCategory')
const knowledgeBaseESClient = require("./faqSearchService");
const {
    getNextCount
} = require('./counter');


const getAllSuggestions = async () => {
    let arr = await KnowledgeBaseModel.find().sort({
        id: 1
    });
    return arr;
}

const getSuggestionsByAppId = (applicationId, type) => {
    let criteria = {
        applicationId: applicationId,
        deleted: false,
        status: {
            '$nin': ['un_answered']
        }
    }
    if (type) {
        criteria.type = type
    }
    return KnowledgeBaseModel.find(criteria);
}
const getSuggestionsByCriteria = (criteria, value, applicationId) => {
    let criteriaObj = {
        deleted: false,
        status: {
            '$nin': ['un_answered']
        }
    };
    criteriaObj[criteria] = value;
    if (criteria == 'id') {
        criteriaObj[criteria] = parseInt(value, 10);
    }
    criteriaObj.applicationId = applicationId;
    return KnowledgeBaseModel.find(criteriaObj).sort({
        id: 1
    });
}

const createSuggestion = async (suggestion) => {
    suggestion.id = await getNextCount(KnowledgeBaseModel.modelName, "id")
    if (!suggestion.categoryType) {
        suggestion.categoryType = 0;
    }
    return KnowledgeBaseModel.create(suggestion).then(async result => {
        if (suggestion.categoryType) {
            await faqCategoryModel.findOneAndUpdate({
                applicationId: result.applicationId,
                type: result.categoryType
            }, {
                $inc: {
                    articleCount: 1
                }
            });
        }
        return result;
    }).catch(error => {
        logger.error("error while creating auto suggestion/faq", error);
        throw error;
    });
}
/**
 * 
 * @param {*} suggestion 
 */
const createIfNotExist = (suggestion) => {
    KnowledgeBaseModel.findOne({
        id: suggestion.id
    }).then(result => {
        if (!result) {
            KnowledgeBaseModel.create(suggestion).catch(error => {
                logger.error("error while creating auto suggestion/faq", error);
            });
        }
    })
}

const updateSuggestion = (suggestion) => {
    return KnowledgeBaseModel.updateOne({
        "id": suggestion.id
    }, suggestion).then(result => {
        return result;
    })
}
const deleteSuggestion = (suggestion) => {

    return getSuggestionsByCriteria("id", suggestion.id, suggestion.applicationId).then(async dbResult => {
        if (dbResult[0].categoryType) {
            await faqCategoryModel.findOneAndUpdate({
                type: dbResult[0].categoryType
            }, {
                $inc: {
                    articleCount: -1
                }
            });
        }
        return KnowledgeBaseModel.updateOne({"id": suggestion.id }, { 'deleted': true }).then(result => {
            return result;
        })
    })
}

const searchFAQ = async (options) => {
    var data = [];
    let criteria = {
        type: "faq",
        status: "published",
        applicationId: options.appId,
        deleted: false
    }
    if (options.text) {
        data = await searchQuery(options);
    } else {
        if (options.id) {
            criteria.id = parseInt(options.id);
        }
        if (options.referenceId) {
            criteria.referenceId = parseInt(options.referenceId);
            criteria.type = "learning";
        }
        if (options.key) {
            criteria.key = options.key;
        }
        if (options.categoryType) {
            criteria.categoryType = options.categoryType;
        }
        data = KnowledgeBaseModel.find(criteria).select({
            name: 1,
            categoryType: 1,
            content: 1,
            referenceId: 1,
            id: 1
        }).sort({
            id: 1
        });
    }
    for (var i = 0; i < data.length; i += 1) {
        var knowledge = data[i];
        if (knowledge.referenceId != null && (knowledge.content == null || knowledge.content == "")) {
            var result = KnowledgeBaseModel.find({
                id: knowledge.referenceId,
                deleted: false,
                status: {
                    '$nin': ['un_answered']
                }
            }).select({
                name: 1,
                content: 1,
                categoryType: 1,
                referenceId: 1,
                id: 1
            }).sort({
                id: 1
            });
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
        .sort({
            id: 1
        })
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
                        "must": [{
                                "term": {
                                    "applicationId.keyword": options.appId
                                }
                            },
                            {
                                "term": {
                                    "type.keyword": "faq"
                                }
                            },
                            {
                                "term": {
                                    "deleted": false
                                }
                            },
                            {
                                "term": {
                                    "status.keyword": "published"
                                }
                            },
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
const searchESQueryByCriteria = (query) => {
    return knowledgeBaseESClient.searchRawQuery(query).catch(error => {
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
    createIfNotExist,
    searchESQueryByCriteria
}