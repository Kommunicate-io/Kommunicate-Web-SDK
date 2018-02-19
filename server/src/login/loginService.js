const userService =require("../users/userService");
const bcrypt = require('bcrypt');
const config = require("../../conf/config");
const applozicClient = require("../utils/applozicClient");
const registrationService = require("../register/registrationService");
exports.login = (userDetail) => {
  const userName= userDetail.userName;
  const password = userDetail.password;
  const applicationId =userDetail.applicationId;

  return Promise.all([applozicClient.getApplication({userName: userName,applicationId:applicationId,accessToken:password}),
    userService.getByUserNameAndAppId(userName,applicationId),
    applozicClient.applozicLogin(userDetail)]).then(([application,user,applozicUser])=>{

      if(user && bcrypt.compareSync(password, user.password)) {
        // valid user credentials
          return Promise.resolve(userService.getCustomerInfoByApplicationId(applicationId)).then(customer=>{
            user.isAdmin = customer.userName==user.userName;
            user.adminUserName=customer.userName;
            user.adminDisplayName = customer.name;
            user.applozicUser=applozicUser;
            return prepareResponse(user,application);
          });
      }else{
        console.log("invalid login credential");
        let err= {};
        err.code= "INVALID_CREDENTIALS";
        throw err;
      }/*else{
        console.log("user not belongs to kommunicate..login by applozic");
        return applozicClient.applozicLogin(userName,password,applicationId).then(user=>{
          user.userName=user.userId;
          user.accessToken=password;
          user.authorization = new Buffer(user.userId+":"+user.deviceKey).toString('base64');
          return prepareResponse(user,application);
        });
      }*/
    }).catch(err=>{
      console.log("err while login",err);
      throw err;
    });
  };

/*
exports.signUpWithApplozic = (userName, password, applicationName, applicationId, callback) => {

  console.log("userId from controller", userName);

  return applozicClient.applozicLogin(userName,password,applicationId)
    .then(user=>{
        console.log("applozicClient.applozicLogin", user)
        if(user.message === 'UPDATED'){
          // userName is the primary parameter. user Id was replaced by userName.
          const userName = user.userId;
          const isPreSignUp = true;
          const name = user.userId;
          const email= user.userId;
          let response={};

          console.log("UserName:", userName, password, isPreSignUp);

          if(userName&&(isPreSignUp||password)){
            console.log("Request received for pre sign up, EmailId : ", userName);
            //TODO : check the if user exist form communicate Db;
            return Promise.resolve(registrationService.getCustomerByUserName(userName))
              .then(_user=>{
                console.log("Got the user from db",user);
                if(_user!=null){
                  console.log("registrationService.getCustomerByUserName....if");
                  response.code ="USER_ALREADY_EXISTS";
                  response.message="User Already Exists in KM DB";
                  console.log(response);
                  return response;
                }else{
                  console.log("registrationService.getCustomerByUserName....else");
                  return Promise.resolve(registrationService.createCustomer({"userName":userName,"password":password,"email":email,"name":name}))
                    .then(result=>{
                        console.log("registrationService.createCustomer");
                        response.code="USER_CREATED_IN_KM_DB";
                        response.message="User created in km db";
                        // replacing user Id with user name. can't delete userId from system for backward compatibility.
                        delete result.userId;
                        result.isAdmin=true;
                        response.data=result;
                        return response;
                      }).catch(err=>{
                      console.log("error while creating a customer", err);
                      switch(err.code){
                        case "USER_ALREADY_EXISTS":
                          response.code ="USER_ALREADY_EXISTS";
                          response.message="user Already Exists";
                          res.status(200).json(response);
                          break;
                        default:
                          response.code ="INTERNAL_SERVER_ERROR";
                          response.message="something is broken";
                          res.status(500).json(response);
                          break;
                      }
                    });
                  }
                }).catch(err => {
                          response.code ="INTERNAL_SERVER_ERROR";
                          response.message="something is broken";
                })
            }else{
              response.code = "BAD_REQUEST";
              response.message="some params are missing";
            }
        }else{
          let response = {};
          reposne.code = user.message;
          return response;
        }
    }).catch(err=>{
      console.log("err while login",err);
      throw err;
    });
};*/

// prepare respone
function prepareResponse(user,application) {
  let response = JSON.parse(JSON.stringify(user));
  response.application=JSON.parse(JSON.stringify(application));
  return response;
}
