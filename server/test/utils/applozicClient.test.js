const expect = require('chai').expect;
const app = require('../../app');
const nock = require('nock');
const applozicClient = require('../../src/utils/applozicClient');
const { user } = require('../users/mockUser');

describe('register client', () => {
  beforeEach(async () => {
    nock.cleanAll();
    nock.restore();
    nock('https://apps-test.applozic.com/rest/ws/register/client')
    .persist()
      .post('/', {
        "userId": user.userName,
        "applicationId": user.applicationId,
        "password": user.password,
        "roleName": user.role,
        "authenticationTypeId": 1,
        "email": user.email,
        "displayName": user.name,
        "gcmKey": "",
        "state": 4,
        "imageLink": ""
      })
      .reply(200, user)
  });
  afterEach(async () => {
    nock.cleanAll();
    nock.restore();
  })
  it('register client API', () => {
    return applozicClient.createApplozicClient(
      user.userName,
      user.accessToken,
      user.applicationId,
      null,
      user.role,
      user.email,
      user.name,
      4)
      .then(response => {
        expect(typeof response).to.equal('object');
        expect(response.userId).to.equal('anand@applozic.com')

      }).catch(response=>{
        expect(typeof response).to.equal('object');
        expect(response.data.userId).to.equal('anand@applozic.com')
      });
  });
});