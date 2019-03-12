const expect = require('chai').expect;
const preferenceService = require('../../src/users/userPreferenceService');
const { preference } = require('./mockPreference');

describe('preference service test', () => {
  /*  it('should create/update feedback  ', () => {
        return preferenceService.createOrUpdateFeedBack(feedback)
            .then(result => {
                expect(typeof result).to.equal('object');
                expect(result.data.groupId).to.equal(feedback.groupId);
                expect(result.data.rating).to.equal(feedback.rating);
            })
    })*/
   it('should return preference by applicationId and userName', () => {
        return preferenceService.getUserPreference(preference.applicationId, preference.userName)
            .then(response => {
                expect(typeof response).to.equal('object');
                expect(typeof response.preference).to.equal('object');
                expect(response.applicationId).to.equal(preference.applicationId);
                expect(response.userName).to.equal(preference.userName);
                expect(response.preference.timeZone).to.equal(preference.preference.timeZone);

            });
    });
});
