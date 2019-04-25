const UserAuthenticationModel = require("../models").UserAuthentication;
const logger = require('../utils/logger');
exports.createUserAuthentication = (data,transaction) => {
    return Promise.resolve(UserAuthenticationModel.create(data, transaction))
}