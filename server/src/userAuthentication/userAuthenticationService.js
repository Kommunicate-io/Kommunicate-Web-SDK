const UserAuthenticationModel = require("../models").UserAuthentication;
exports.createUserAuthentication = (data,transaction) => {
    return Promise.resolve(UserAuthenticationModel.create(data, transaction))
}