const app = require('../../app'),
  chai = require('chai'),
  request = require('supertest');
const userId= "anand@applozic.com"
/** Behavior-Driven Development */
describe('user get data', function () {
    this.timeout(50000);
    describe('#GET '+ userId, function () {
        it('should get user', function (done) {
            request(app).get('/users/'+userId)
                .end(function (err, res) {
                    if (res) {
                        chai.expect(res.statusCode).to.equal(200);
                        chai.expect(res.body.data).to.be.an('object');
                        chai.expect(res.body.data.userName).to.equals(userId)
                        done();
                    }
                });
        });
    });
});