const expect = require('chai').expect;
const app = require('../../app');
const registrationService = require('../../src/register/registrationService');
const utils = require("../../src/register/utils");
const config = require("../../conf/config");

const KOMMUNICATE_ADMIN_ID = config.getProperties().kommunicateAdminId;

describe('register admin account', () => {

    it('register applozic admin account', () => {
      let userId = "devashish+altest" + (Math.random() * 100) + "@applozic.com";
      return registrationService.createCustomer({ "userName": userId, "password": "devashish", "product": "applozic"})
        .then(response => {
            console.log(response.application);
          expect(typeof response).to.equal('object');
          expect(typeof response.application).to.equal('object');
          expect(response.application.pricingPackage).to.equal(utils.APPLOZIC_SUBSCRIPTION.BETA);
          expect(response.application.adminUser.userId).to.equal(userId);
        });
    });

    it('register kommunicate admin account', () => {
      let userId = "devashish+kmtest" + (Math.random() * 100) + "@kommunicate.io";
      return registrationService.createCustomer({ "userName": userId, "password": "devashish", "product": "kommunicate"})
        .then(response => {
            console.log(response.application);
          expect(typeof response).to.equal('object');
          expect(typeof response.application).to.equal('object');
          expect(response.application.pricingPackage).to.equal(utils.APPLOZIC_PRICING_PACKAGE[utils.KOMMUNICATE_SUBSCRIPTION.STARTUP]);
          expect(response.application.adminUser.userId).to.equal(KOMMUNICATE_ADMIN_ID);
        });
    });

    it('register admin account without passing product', () => {
      let userId = "devashish+kmtest" + (Math.random() * 100) + "@kommunicate.io";
      return registrationService.createCustomer({ "userName": userId, "password": "devashish"})
        .then(response => {
            console.log(response.application);
          expect(typeof response).to.equal('object');
          expect(typeof response.application).to.equal('object');
          expect(response.application.pricingPackage).to.equal(utils.APPLOZIC_PRICING_PACKAGE[utils.KOMMUNICATE_SUBSCRIPTION.STARTUP]);
          expect(response.application.adminUser.userId).to.equal(KOMMUNICATE_ADMIN_ID);
        });
    });


  });