const faqCategoryService = require("./faqCategoryService");
const logger = require("../utils/logger");

 exports.getFaqCategory = (req, res) => {
    var appId = req.query.appId;
    return faqCategoryService.getFaqCategory(appId).then(result => {
        return res.status(200).json({ code: "SUCCESS",data: result});
    }).catch(err => {
         logger.info("error while fetching faq category", err);
         return res.status(500).json({ code: "ERROR", message: "error" });
    })

 }

 exports.insertFaqCategory = (req, res) => {
    var faqCategory = req.body;
    return faqCategoryService.insertFaqCategory(faqCategory).then(result => {
        return res.status(200).json({code: "SUCCESS", data: result});
    }).catch(err => {
        logger.info("error while creating faq category", err);
        return res.status(500).json({ code: "ERROR", message: "error" });
    })

 } 

 exports.updateFaqCategory = (req, res) => {
    var faqCategory = {};
    var criteria = {};
    if(req.body.type){
        criteria.type = req.body.type;
    }
    if(req.body.applicationId){
        criteria.applicationId = req.body.applicationId;
    }
    if(req.body.name){
        faqCategory.name =req.body.name;
    }
    if(req.body.articleCount){
        faqCategory.articleCount =req.body.articleCount;
    }
    if(req.body.deleted){
        faqCategory.deleted = req.body.deleted;
    }
    faqCategoryService.updateFaqCategory(criteria,faqCategory).then(result => {
        return res.status(200).json({code: "SUCCESS"});
    }).catch(err => {
         logger.info("error while updating faq category", err);
         return res.status(500).json({ code: "ERROR", message: "error" });
    })
 }  
 exports.deleteFaqCategory = (req, res) => {
    var type = req.query.type;
    var applicationId =req.query.applicationId;
    return faqCategoryService.deleteFaqCategory(applicationId,type).then(result => {
        return res.status(200).json({ code: result});
    }).catch(err => {
         logger.info("error while deleting faq category", err);
         return res.status(500).json({ code: "ERROR", message: "error" });
    })

 }