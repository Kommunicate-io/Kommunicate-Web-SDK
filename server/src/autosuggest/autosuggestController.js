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

exports.getSuggestionsByAppKey = (req, res) => {

	autosuggestService.getSuggestionsByAppKey(req.params.applicationKey)
		.then(suggestions => {
			if(!suggestions){
				res.status(404).json({code:"NO_SUGGESTIONS_FOUND"});
			}else{
				res.status(200).json({code:"GOT_ALL_SUGGESTIONS_BY_APPLICATION_KEY", data:suggestions});
			}
		})
		.catch(err => {res.status(500).json({code:"INTERNAL_SERVER_ERROR", message:"Something in auto suggest went wrong!"})});
}

exports.createSuggestion = (req, res) => {

	console.log('Request received ', req.body);

	const suggestion = {
		applicationKey: req.body.applicationKey,
		userName:req.body.userName,
		category: req.body.category,
		name:req.body.name,
		content: req.body.content
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

