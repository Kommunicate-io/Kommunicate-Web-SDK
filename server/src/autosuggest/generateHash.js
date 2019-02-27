const autoSuggestionService = require('./autosuggestService');
var crypto = require('crypto');
const stringUtils = require("underscore.string");

/**
 * will remove this script
 * its only for generating hash for existing faqs
 */
const generateHash = () => {
    autoSuggestionService.getAllSuggestions().then(suggestions => {
        suggestions.map(async suggestion => {
            let question = suggestion.name ? suggestion.name.trim() : null;
            if (!stringUtils.isBlank(question)) {
                question = question.replace(/\?/g, '');
                var hash = crypto.createHash('md5').update(question).digest('hex');
                suggestion.key = hash
                await autoSuggestionService.updateSuggestion(suggestion);
            }
        })
    }).catch(err => {
        console.log(" error on hash generation", err)
    });
}
generateHash();