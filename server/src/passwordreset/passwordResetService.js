const PASSWORD_RESET_REQUEST_STATUS = {PENDING:"PENDING",PROCESSED:"PROCESSED"}
const uuid = require('uuid/v1');
const db = require("../models");
const fs=require('fs');
const config = require("../../conf/config");
const path = require("path");
const mailService = require("../utils/mailService");
const fileService = require("../utils/fileService");
const applozicClient = require("../utils/applozicClient");
const registrationService = require('../register/registrationService');
const userService = require("../users/userService");
const kommunicateLogoUrl =config.getProperties().urls.hostUrl+"/img/logo1.png";
const passwordResetUrl =config.getProperties().urls.updatePasswordPage;
const bcrypt = require('bcrypt');
const logger = require("../utils/logger");
const facebookLogoUrl = config.getProperties().urls.hostUrl+"/img/facebook-round32.png";
const twitterLogourl = config.getProperties().urls.hostUrl + "/img/twitter-round32.png";
const kmWebsiteLogoUrl = config.getProperties().urls.kmWebsiteUrl+"/assets/resources/images/km-logo-new.png";
const kmWebsiteLogoIconUrl = config.getProperties().urls.kmWebsiteUrl+"/assets/resources/images/km-logo-icon.png";
exports.processPasswordResetRequest = (user, applicationId)=>{
  console.log("processing password reset request of user",user.userName);
  return Promise.resolve(getPendingRequestOfUser(user,applicationId)).then(passwordResetRequest=>{
    if(passwordResetRequest){
      return passwordResetRequest;
    }else{
      console.log("creating new password reset request for user",user.userName);
      return db.PasswordResetRequest.create(createPasswordResetRequest(user,applicationId));
    }
  }).then(passwordResetRequest=>{
    return sendPasswordResetRequestInMail(passwordResetRequest,user)
  })
}

const sendPasswordResetRequestInMail = (passwordResetRequest,user)=>{
  let template= "";
  var prUrl = passwordResetUrl.replace(":code",passwordResetRequest.authenticationCode);
  console.log("&&&url",prUrl);
  let templateValues = {
    ":KommunicateLogoUrl": kommunicateLogoUrl, 
    ":passwordResetUrl":prUrl,
    ":facebookLogoUrl":facebookLogoUrl,
    ":twitterLogourl":twitterLogourl,
    ":kmWebsiteLogoUrl":kmWebsiteLogoUrl,
    ":kmWebsiteLogoIconUrl":kmWebsiteLogoIconUrl,
    ":kmUserName": userService.getUserDisplayName(user),
  }
  return fileService.readFile(path.join(__dirname,"/passwordResetTemplate.html"),"utf8").then(data=>{
    template= data.replace(new RegExp(Object.keys(templateValues).join("|"),"gi"),function(matched){
      logger.info("matched: ",matched, "replaced with: ",templateValues[matched]);
      return templateValues[matched];
    });
    //console.log(template);

   let mailOptions = {
    from: '"Kommunicate" <support@kommunicate.io>', // sender address
    to: user.email, // list of receivers
    subject: "Reset Your Password", // Subject line
    text: template, // plain text body
    html: template // html body
    };
    return mailService.sendPasswordResetMail(mailOptions);
  });
}

const createPasswordResetRequest = (user,applicationId)=>{
let passwordResetRequest = {};
passwordResetRequest.userName = user.userName;
passwordResetRequest.applicationId = applicationId;
passwordResetRequest.authenticationCode= uuid();
passwordResetRequest.status= PASSWORD_RESET_REQUEST_STATUS.PENDING;
passwordResetRequest.email =user.email;
return passwordResetRequest;
}

const getPendingRequestOfUser = (user,applicationId)=>{
  return db.PasswordResetRequest.findOne({where:{userName:user.userName,applicationId:applicationId,status:PASSWORD_RESET_REQUEST_STATUS.PENDING}}).then(pwResetrequest=>{
    return pwResetrequest? pwResetrequest.dataValues:null;
  });
}
exports.getPasswordResetRequestByCodeAndStatus= (code,status)=>{
  console.log("getting Password Reset RequestByCode",code);
  if(!code){
    throw err("code can not be null");
  }else{
    return db.PasswordResetRequest.findOne({where:{authenticationCode:code,status:status}}).then(pwResetrequest=>{
      return pwResetrequest? pwResetrequest.dataValues:null;
    });
  }
}

exports.updatePassword = (newPassword,prRequest)=>{
  return db.sequelize.transaction(t=> {
    let apzToken = new Buffer(prRequest.userName+":"+newPassword).toString('base64');
    return Promise.all([registrationService.isAdmin(prRequest.userName),
      bcrypt.hash(newPassword,10),
      userService.getByUserNameAndAppId(prRequest.userName,prRequest.applicationId)
    ]).then(([isadmin,hash,user])=>{
          return Promise.all([applozicClient.updatePassword({newPassword:newPassword,oldPassword:user.accessToken,applicationId:prRequest.applicationId,userName:prRequest.userName}),
            db.user.update({accessToken :newPassword, password : hash,apzToken:apzToken },{where:{id:user.id},transaction:t})
          ]).then(([res1,res2])=>{
            console.log("password updated successfully in all dbs for agent", user.userName);
            return {"code":"SUCCESS"}
          });
    }).then(response=>{
        return db.PasswordResetRequest.update({status:PASSWORD_RESET_REQUEST_STATUS.PROCESSED},{where:{id:prRequest.id},transaction:t}).then(response=>{
          console.log("password reset request updated ", prRequest.id);
          return {"code":"SUCCESS"};
      });
    });
  });
}


  exports.PASSWORD_RESET_REQUEST_STATUS =PASSWORD_RESET_REQUEST_STATUS;