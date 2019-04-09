const logger = require("../utils/logger");
const {faqCategoryModel } = require('./faqCategory')
const { getNextCount } = require('./counter');

const getFaqCategory = (appId) => {
    let criteriaObj = {
        deleted: false,
        applicationId: appId
    };
    return faqCategoryModel.find(criteriaObj).then(res => {
        return res;
    }).catch(err => {
        logger.error("error while fetching faqCategory");
        throw err;
    });
}

 const insertFaqCategory = (faqCategory) => {
     return faqCategoryModel.findOne({
         applicationId: faqCategory.applicationId,
         name: faqCategory.name
     }).then(async result => {
         if (!result) {
             faqCategory.deleted = false;
             faqCategory.type = await getNextCount(faqCategoryModel.modelName, "type")
             return faqCategoryModel.create(faqCategory).then(result => {
                 return result;
             }).catch(error => {
                 logger.error("error while creating faq category", error);
                 throw error;
             });
         } else {
             return result;
         }
     })
 }
const updateFaqCategory = (criteria, faqCategory) => {
    if (!faqCategory.deleted) {
        faqCategory.deleted = false;
    }
    return faqCategoryModel.updateOne(criteria, faqCategory).then(result => {
        return result.nModified ? "Success" : "Record Not found";;
    }).catch(err => {
        logger.err("error while updating FaqCategory", err);
        throw err;
    })
}

const deleteFaqCategory = (applicationId, type) => {
    return faqCategoryModel.updateOne({
        "applicationId": applicationId,
        "type": type
    }, {
        'deleted': true
    }).then(result => {
        return result.nModified ? "Success" : "Record Not found";
    }).catch(err => {
        logger.err("error while deleting faqCategory", err);
        throw err;
    });

}

     module.exports = {
        getFaqCategory,
        insertFaqCategory,
        updateFaqCategory,
        deleteFaqCategory
    } 