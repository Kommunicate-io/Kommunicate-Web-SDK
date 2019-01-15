const expect = require('chai').expect;
const userService = require('../../src/users/userService');
const {user} = require('./user');

describe('should return user by userName', () => {
  it('Get a user by username', () => {
    return userService.getUserByName(user.userName)
      .then(response => {
        expect(typeof response).to.equal('object');
        expect(response.userName).to.equal(user.userName)

      });
  });
  
  it('should return admin user', ()=>{
    return userService.getAdminUserByAppId(user.applicationId)
    .then(result=>{
        expect(typeof result).to.equal('object');
        expect(result.type).to.equal(3)
    })
  })

  it('should return application user', ()=>{
    return userService.getByUserNameAndAppId(user.userName, user.applicationId)
    .then(result=>{
        expect(typeof result).to.equal('object');
        expect(result.userName).to.equal(user.userName)
        expect(result.applicationId).to.equal(user.applicationId)
    })

  })
});
