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

exports.createSuggestion = (req, res) => {

	console.log('Request received ', req.body);

	autosuggestService.createSuggestion({category: req.body.category, name:req.body.content, content: req.body.content})
		.then(response => {console.log(response)
			res.status(200).json({code:"SUGESSTION_CREATED", data:response})
		})
		.catch(err => {console.log(err)})
}

