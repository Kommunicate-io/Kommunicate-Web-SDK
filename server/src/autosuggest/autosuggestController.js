
const autosuggestService = require("./autoSuggestService2");
const hashGenerator = require("./hashGenerator");
const logger = require("../utils/logger");

/**
 * returns all data in db irrespective to customer
 * dont use this API
 */
exports.getAllSuggestions = (req, res) => {

	autosuggestService.getAllSuggestions()
		.then(suggestions => {
			if(!suggestions){
				res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
			}else{
				res.status(200).json({code:"GOT_ALL_SUGGESTIONS", data:suggestions});
			}
		})
		.catch(err => {res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
}


exports.getSuggestionsByAppId = (req, res) => {

	if(req.query.criteria){
		autosuggestService.getSuggestionsByCriteria(req.query.criteria, req.query.value, req.params.applicationId)
			.then(suggestions => {
				if(!suggestions){
					res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
				}else{
					res.status(200).json({code:"GOT_ALL_SUGGESTIONS_BY_CRITERIA_" + req.query.criteria , data:suggestions});
				}
			})
			.catch(err => {
				logger.info("error while fetching auto suggestion", err);
				res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
	}else{
		autosuggestService.getSuggestionsByAppId(req.params.applicationId, req.query.type)
			.then(suggestions => {
				if(!suggestions){
					res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
				}else{
					res.status(200).json({code:"GOT_ALL_SUGGESTIONS_BY_APPLICATION_ID", data:suggestions});
				}
			})
			.catch(err => {
				logger.info("error",err );
				res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
	}
}

exports.createSuggestion = (req, res) => {

	logger.info('Request received ', req.body);
	presentTime = new Date().getTime()

	const suggestion = {
		applicationId: req.body.applicationId,
		userName:req.body.userName,
		category: req.body.category,
		name: req.body.name,
		content: req.body.content,
		type: req.body.type ? req.body.type:null,
		status: req.body.status ? req.body.status:null,
		referenceId: req.body.referenceId ? req.body.referenceId : null,
		created_at: presentTime,
		updated_at: presentTime,
		categoryType:req.body.categoryType,
		deleted:false
	}

	autosuggestService.createSuggestion(suggestion)
		.then(response => {
			console.log(response)
			res.status(200).json({code:"SUGGESTION_CREATED", data:response})
			logger.log("FAQ added to the bot")
		})
		.catch(err => {
			logger.error("error detail for create suggestion: ", err)
			res.status(500).json({
				code:"INTERNAL_SERVER_ERROR",
				message:"Something in auto suggest went wrong!",
				error: err
			})
		});
}

exports.updateSuggestion = (req, res) => {
	logger.info('Request received ', req.body);

	const suggestion = { id: req.body.id };
	if (null !== req.body.category) {
		suggestion['category'] = req.body.category
	}
	if (null !== req.body.name) {
		suggestion['name'] = req.body.name
	}
	if (null !== req.body.content) {
		suggestion['content'] = req.body.content
	}
	if (null !== req.body.status) {
		suggestion['status'] = req.body.status
	}
	if (null !== req.body.status) {
		suggestion['categoryType'] = req.body.categoryType
	}
	// To update updated_at attribute in Knowledge base
	suggestion['updated_at'] = new Date().getTime()

	autosuggestService.updateSuggestion(suggestion).then(response => {
		logger.info("FAQ updated in db")
		res.status(200).json({ code: "SUGGESTION_UPDATED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		logger.error("error detail for update suggestion: ", err)
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}

exports.deleteSuggestion = (req, res) => {
	logger.info("delete req: ",req)
	const suggestion = req.body;
	
	autosuggestService.deleteSuggestion(suggestion).then(response => {
		logger.info("FAQ deleted from db")
		res.status(200).json({ code: "SUGGESTION_DELETED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		logger.error("error detail for delete suggestion: ", err)
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}

exports.searchFAQv2 = (req, res) => {
	let question = req.params.question;
	if (question) {
		req.query.question = hashGenerator.generateHash(question);
	}
	req.query.appId = req.params.appId
	this.searchFAQ(req, res);
}

exports.searchFAQ=(req,res)=>{
	logger.info("searching for query..")
	return autosuggestService.searchFAQ({
		appId:req.query.appId,
		text:req.query.query,
		id:req.query.articleId, 
		referenceId:req.query.referenceId,
		key:req.query.question,
		categoryType:req.query.categoryType
	}).then(data=>{
		logger.info("got data from db");
		return res.status(200).json({ code: "SUCCESS", data: data });
	}).catch(e=>{
		logger.error("error while fetching data from db",e);
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message:"something went wrong" });
	});
}

exports.fetchFAQs = (req, res) => {
	let pageNumber = parseInt(req.query.page) || 1;
	let pageSize = parseInt(req.query.pageSize) || 100;
	let criteria = { deleted: false, applicationId: req.params.appId };
	if (req.query.referenceId) {
		criteria.referenceId = parseInt(req.query.referenceId);
	}
	if (req.query.id) {
		criteria.id = parseInt(req.query.id);
	}
	if (req.query.type) {
		criteria.type = req.query.type;
	}
	if (req.query.status) {
		criteria.status = req.query.status;
	}
	if (req.query.category) {
		criteria.category = req.query.category;
	}
	if (req.query.userName) {
		criteria.$or = [{ userName: req.query.userName}, {user_name: req.query.userName }]
	}
	return autosuggestService.fetchFAQs(pageNumber, pageSize, criteria).then(result => {
		return res.status(200).json({ code: "SUCCESS", data: result });
	}).catch(error => {
		console.log(`error in fetchFAQs ${error}`)
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "something went wrong" });
	})
}

exports._esSearchQuery = (req, res) => {
	return autosuggestService.searchESQueryByCriteria(req.body).then(data => {
		return res.status(200).json({ code: "SUCCESS", data: data });
	}).catch(error => {
		logger.error("error while fetching data esClient", error);
		return res.status(500).json({ code: "ERROR", message: error.message });
	});
}
