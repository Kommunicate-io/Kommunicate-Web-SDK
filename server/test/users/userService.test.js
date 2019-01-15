const expect = require('chai').expect;
const app = require('../../app');
const nock = require('nock');
const userService = require('../../src/users/userService');
const {user} = require('./user');

describe('Get applozic User', () => {
  it('Get a user by username', () => {
    return userService.getUserByName(user.userName)
      .then(response => {
        expect(typeof response).to.equal('object');
        expect(response.userName).to.equal('anand@applozic.com')

      });
  });
});
