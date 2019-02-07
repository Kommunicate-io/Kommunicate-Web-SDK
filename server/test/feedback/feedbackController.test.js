const app = require('../../app');
const chai = require('chai');
const request = require('supertest');
const {feedback} = require('./mockFeedback');

//integration test for feedback APIs
describe('feedback', function () {
    this.timeout(50000);
    describe('#GET feedback by groupId', function () {
        it('should get feedback', function (done) {
            request(app).get('/feedback/'+feedback.groupId)
                .end(function (err, res) {
                    if (res) {
                        console.log("response:", res);
                        chai.expect(res.statusCode).to.equal(200);
                        chai.expect(res.body.data).to.be.an('object');
                        chai.expect(res.body.data.groupId).to.equals(feedback.groupId)
                        done();
                    }
                });
        });
    });

    describe('#POST  create feedback', function () {
        it('should get feedback', function (done) {
            request(app).post('/feedback')
                .send(feedback)
                .end(function (err, res) {
                    if (res) {
                        console.log("response:", res);
                        chai.expect(res.statusCode).to.equal(200);
                        chai.expect(res.body.data).to.be.an('object');
                        chai.expect(res.body.data.data.groupId).to.equals(feedback.groupId)
                        done();
                    }
                });
        });
    });
});