const expect = require('chai').expect;
const nock = require('nock');
const userService = require('../../src/users/userService')
const user = require('./user');

describe('Get applozic User', () => {
  beforeEach(() => {
    nock('https://aps-test.applozic.com')
      .get('/rest/ws/user/')
      .reply(200, response);
  });

  it('Get a user by username', () => {
    return userService.getUserByName(user.userName)
      .then(response => {
        expect(typeof response).to.equal('object');
        expect(response.userName).to.equal('anand@applozic.com')

      });
  });

  it('create user', () => {
    return userService.createUser(user)
      .then(response => {
        //expect an object back
        expect(typeof response).to.equal('object');

        //Test result of name, company and location for the response
        expect(response.userName).to.equal('anand@applozic.com')

      });
  });
});