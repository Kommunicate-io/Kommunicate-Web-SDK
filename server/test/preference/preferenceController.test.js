const app = require('../../app');
const chai = require('chai');
const request = require('supertest');
const {preference} = require('./mockPreference');

//integration test for preference APIs
describe('preference', function () {
    this.timeout(50000);
    describe('#GET preference by userName', function () {
        it('should get preference', function (done) {
            request(app).get('/users/preference/get')
                        .send({ 
                            "applicationId": preference.applicationId,
                            "userName": preference.userName
                            })
                .end(function (err, res) {
                    if (res) {
                        console.log("response:", res);
                        chai.expect(res.statusCode).to.equal(200);
                        chai.expect(res.body.data).to.be.an('object');
                        chai.expect(res.body.data.applicationid).to.equals(preference.applicationId)
                        chai.expect(res.body.data.userName).to.equals(preference.userName)
                        chai.expect(res.body.data.preferences.timeZone).to.equals(preference.preferences.timeZone)

                        done();
                    }
                });
        });
    });


});