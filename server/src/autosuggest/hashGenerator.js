const autoSuggestionService = require('./autosuggestService');
var crypto = require('crypto');
const stringUtils = require("underscore.string");


const generateHash = (message) => {
	if (stringUtils.isBlank(message)) { return null; }
	message = message.trim()
	message = message.replace(/[\W_]+/g, '');
	return crypto.createHash('md5').update(message).digest('hex');
}

/**
 * will remove this script
 * its only for generating hash for existing faqs
 */
const generateHashForExistingRecords = () => {
    autoSuggestionService.getAllSuggestions().then(suggestions => {
        suggestions.map(async suggestion => {
            let question = suggestion.name ? suggestion.name.trim() : null;
            if (!stringUtils.isBlank(question)) {
                suggestion.key = generateHash(question);
                await autoSuggestionService.updateSuggestion(suggestion);
            }
        })
    }).catch(err => {
        console.log(" error on hash generation", err)
    });
}

//generateHashForExistingRecords();

exports.generateHash = generateHash;
exports.generateHashForExistingRecords = generateHashForExistingRecords;