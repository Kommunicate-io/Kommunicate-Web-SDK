const autosuggestService = require("./autosuggestService");
const logger = require("../utils/logger");
const botchannel = require("./botchannel");
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
			.catch(err => {res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
	}else{
		autosuggestService.getSuggestionsByAppId(req.params.applicationId, req.query.type)
			.then(suggestions => {
				if(!suggestions){
					res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
				}else{
					res.status(200).json({code:"GOT_ALL_SUGGESTIONS_BY_APPLICATION_ID", data:suggestions});
				}
			})
			.catch(err => {res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
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
		deleted:false
	}

	autosuggestService.createSuggestion(suggestion)
		.then(response => {
			console.log(response)
			res.status(200).json({code:"SUGESSTION_CREATED", data:response})
			logger.log("FAQ added to the bot")
		})
		.catch(err => {
			logger.error("error detail for create suggetion: ", err)
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
	// To update updated_at attribute in Knowledgebase
	suggestion['updated_at'] = new Date().getTime()

	autosuggestService.updateSuggetion(suggestion).then(response => {
		logger.info("FAQ updated in db")
		res.status(200).json({ code: "SUGESSTION_UPDATED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		logger.error("error detail for update suggetion: ", err)
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}

exports.deleteSuggetion = (req, res) => {
	logger.info("delete req: ",req)
	const suggestion = req.body;
	
	autosuggestService.deleteSuggetion(suggestion).then(response => {
		logger.info("FAQ deleted from db")
		res.status(200).json({ code: "SUGESSTION_DELETED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		logger.error("error detail for delete suggetion: ", err)
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}

exports.searchFAQ=(req,res)=>{
	logger.info("searching for query..")
	return autosuggestService.searchFAQ({appId:req.query.appId,text:req.query.query,id:req.query.articleId, referenceId:req.query.referenceId}).then(data=>{
		logger.info("got data from db");
		return res.status(200).json({ code: "SUCCESS", data: data });
	}).catch(e=>{
		logger.error("error while fetching data from db",e);
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message:"something went wrong" });
	});
}
