const UserAuthenticationModel = require("../models").UserAuthentication
exports.createUserAuthentication = async (data,transaction) => {
    let authentication = await UserAuthenticationModel.find({ where: { userName: data.userName } });
    if (authentication) { 
        return { message: "RECORD EXIST FOR THIS USER NAME"};
    }
    return Promise.resolve(UserAuthenticationModel.create(data, transaction)).then(res => {    
        return { message: "user credential inserted" , response: res};
    }).catch(err => {
        logger.error("error while inserting authentication details", err)
        throw err;
    });
}