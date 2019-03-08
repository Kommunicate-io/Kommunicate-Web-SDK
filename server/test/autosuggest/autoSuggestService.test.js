const expect = require('chai').expect;
const autoSuggestService = require('../../src/autosuggest/autoSuggestService2');
const { autosuggest } = require('./autoSuggestMock');

describe('Auto Suggest service test', () => {
    it('should create autosuggest/faq  ', () => {
        return autoSuggestService.createSuggestion(autosuggest)
            .then(result => {
                expect(typeof result).to.equal('object');
                expect(result.applicationId).to.equal(autosuggest.applicationId);
                expect(result.content).to.equal(autosuggest.content);
            })
    })
    it('should return autosuggest/faq by applicationId', () => {
        return autoSuggestService.getSuggestionsByAppId(autosuggest.applicationId)
            .then(response => {
                expect(typeof response).to.equal('object');
            });
    });

    it('search autosuggest/faq by query string', () => {
        return autoSuggestService.searchQuery("Mocha has great documentation")
            .then(response => {
                expect(typeof response).to.equal('object');
            });
    });
});