const app = require('../app');
const chai = require('chai');
const request = require('supertest');

describe('server running check', function () {
    this.timeout(50000);
    describe('server up ', function () {
        it('server running', function (done) {
            request(app).get('/')
                .end(function (err, res) {
                    if (res) {
                        chai.expect(res.statusCode).to.equal(200);
                        chai.expect(res.body.message).to.equal("Welcome to kommunicate");
                        done();
                    }
                });
        });
    });
});