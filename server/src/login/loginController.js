const loginService = require("./loginService");
const kommunicateApplicationName= require('../../conf/config').getProperties().kommunicateParentAppName;
const kommunicateApplicationId = require('../../conf/config').getProperties().kommunicateParentKey;
exports.login = function(req, res) {
  const userName= req.body.userName;
  let password = req.body.password;
  //const applicationName =req.body.applicationName?req.body.applicationName:kommunicateApplicationName;
  const applicationId =req.body.applicationId;
  console.log("request received to login : ", userName, "applicationName : ", applicationId);
  if(req.query.loginType === 'oauth'){
    password = 'mi8&zG#0rLyE^$1&MXSe'
  }
  Promise.resolve(loginService.login(req.body)).then(result=>{
    let response={};
    console.log("status success:" + result);
    if (result.application) {
      response.code="SUCCESS";
    } else {
      response.code="MULTIPLE_APPS";
    }
    response.result = result;
    res.status(200).json(response);
}).catch(err=>{
  console.log("error while log in user",err);
  let status=0;
  let response={};
  switch (err.code) {
    case "INVALID_CREDENTIALS":
      response.code = "INVALID_CREDENTIALS";
      response.message= "wrong userName or password or applicationId";
      status =200;
      break;
    case "INVALID_APPLICATION_ID":
      response.code = "INVALID_APPLICATION_ID";
      response.message= "Invalid application Id or Name";
      status =400;
      break;
    default:
    response.code = "INTERNAL_SERVER_ERROR";
    response.message= "oops! something went wrong";
    status = 500;
    break;
  }
  res.status(status).json(response);
});
};

/* obsolete code. not in use. 
 *
exports.signUpWithApplozic = function(req, res) {
  const userName= req.body.userName;
  const password = req.body.password;
  const applicationName =req.body.applicationName?req.body.applicationName:kommunicateApplicationName;
  const applicationId =req.body.applicationId?req.body.applicationId:kommunicateApplicationId;
  console.log("signUpWithApplozic request received to login : ", userName, "applicationId : ", applicationId);
  Promise.resolve(loginService.signUpWithApplozic(userName, password,applicationName, applicationId)).then(result=>{
    let response = {};
    console.log("loginService.signUpWithApplozic");
    console.log(result);
    response = result;
    res.status(200).json(response);
  }).catch(err=>{
    console.log("error while log in user",err);
    let status=0;
    let response={};
    switch (err.code) {
      case "INVALID_CREDENTIALS":
        response.code = "INVALID_CREDENTIALS";
        response.message= "Wrong userName or password or applicationId";
        status =200;
        break;
      case "INVALID_APPLICATION_ID":
        response.code = "INVALID_APPLICATION_ID";
        response.message= "Invalid application Id or Name";
        status =400;
        break;
      default:
        response.code = "INTERNAL_SERVER_ERROR";
        response.message= "oops! something went wrong";
        status = 500;
        break;
    }
    res.status(status).json(response);
  });
}
*/