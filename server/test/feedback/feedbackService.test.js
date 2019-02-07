const expect = require('chai').expect;
const feedbackService = require('../../src/feedback/feedbackService');
const { feedback } = require('./mockFeedback');

describe('feedback service test', () => {
    it('should create/update feedback  ', () => {
        return feedbackService.createOrUpdateFeedBack(feedback)
            .then(result => {
                expect(typeof result).to.equal('object');
                expect(result.data.groupId).to.equal(feedback.groupId);
                expect(result.data.rating).to.equal(feedback.rating);
            })
    })
    it('should return feedback by groupId ', () => {
        return feedbackService.getFeedback(feedback.groupId)
            .then(response => {
                expect(typeof response).to.equal('object');
                expect(typeof response.comments).to.equal('object');
                expect(response.groupId).to.equal(feedback.groupId);
                expect(response.rating).to.equal(feedback.rating);
            });
    });
});
