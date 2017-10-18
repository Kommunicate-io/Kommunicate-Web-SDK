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

