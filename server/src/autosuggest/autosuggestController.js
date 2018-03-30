const autosuggestService = require("./autosuggestService");

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

// exports.getSuggestionsByUser = (req, res) => {

// 	autosuggestService.getSuggestionsByUser(req.params.userName)
// 		.then(suggestions => {
// 			if(!suggestions){
// 				res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
// 			}else{
// 				res.status(200).json({code:"GOT_ALL_SUGGESTIONS_BY_USER", data:suggestions});
// 			}
// 		})
// 		.catch(err => {res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
// }

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

	console.log('Request received ', req.body);

	const suggestion = {
		applicationId: req.body.applicationId,
		userName:req.body.userName,
		category: req.body.category,
		name:req.body.name,
		content: req.body.content,
		type: req.body.type ? req.body.type:null,
		status: req.body.status ? req.body.status:null,
	}

	autosuggestService.createSuggestion(suggestion)
		.then(response => {
			console.log(response)
			res.status(200).json({code:"SUGESSTION_CREATED", data:response})
		})
		.catch(err => {
			res.status(500).json({
				code:"INTERNAL_SERVER_ERROR",
				message:"Something in auto suggest went wrong!",
				error: err
			})
		})
}

exports.updateSuggestion = (req, res) => {
	console.log('Request received ', req.body);

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
	autosuggestService.updateSuggetion(suggestion).then(response => {
		res.status(200).json({ code: "SUGESSTION_UPDATED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}

exports.deleteSuggetion = (req, res) => {
	console.log("delete req: ",req)
	const suggestion = { id: req.body.id };
	autosuggestService.deleteSuggetion(suggestion).then(response => {
		res.status(200).json({ code: "SUGESSTION_DELETED_SUCCESSFULLY", data: "success" })
	}).catch(err => {
		console.log("error detail for delete suggetion: ", err)
		res.status(500).json({
			code: "INTERNAL_SERVER_ERROR",
			message: "Something in auto suggest went wrong!",
			error: err
		})
	})
}
