const userService  = require("../users/userService");
const passwordResetService = require("./passwordResetService");
const config = require("../../conf/config");
exports.processPasswordResetRequest= (req,res)=>{
  const userName = req.body.userName;
  const applicationId = req.body.applicationId;
  console.log("request received to reset password for user : ",userName," applicationId",applicationId);
  if(!userName|| !applicationId){
   res.status(400).json({code:"BAD_REQUEST",message:"userName or applicationId is empty"});
   return;
 }else{
   Promise.resolve(userService.getByUserNameAndAppId(userName,applicationId)).then(user=>{
     if(user){
       if(!user.email){
        res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"email Id not exists for user ",userName});
        return;
       }
       return passwordResetService.processPasswordResetRequest(user,applicationId).then(response=>{
          res.status(200).json({code:"SUCCESS",data:response});
          return;
        })
     }else{
       res.status(404).json({code:"USER_NOT_EXISTS",message:"user not exists for applicationId"});
       return;
     }
   }).catch(err=>{
     console.log("err while sending password reset Email",err);
     res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Somthing went wrong"});
     return;
   })
 }
}


exports.processUpdatePasswordRequest= (req,res)=>{
  console.log("request received to get update password form authorization code",req.query.code);
  if(!req.query.code){
    res.status(400).json({code:"BAD_REQUEST",message:"code is empty"});
    return;
  }else{
    Promise.resolve(passwordResetService.getPasswordResetRequestByCodeAndStatus(code,passwordResetService.PASSWORD_RESET_REQUEST_STATUS.PENDING)).then(prRequest=>{
      //redierct to the form with code
      const updatePasswordPage = config.getProperties().urls.updatePasswordPage+"?code="+code;
      res.redirect(updatePasswordPage);
    })
  }
}

exports.updatePassword= (req,res)=>{
  console.log("request received to update password with authorization code",req.body.code);
  const newPassword = req.body.newPassword;
  if(!req.body.code){
    res.status(400).json({code:"BAD_REQUEST",message:"code is empty"});
    return;
  }else{
    Promise.resolve(passwordResetService.getPasswordResetRequestByCodeAndStatus(req.body.code,passwordResetService.PASSWORD_RESET_REQUEST_STATUS.PENDING)).then(prRequest=>{
      if(!prRequest){
        console.log("password reset code expired.");
        res.status(200).json({code:"CODE_EXPIRED","message":"Password reset code is expired. Please request new one!"});
        return;
      }
      return passwordResetService.updatePassword(newPassword,prRequest).then(result=>{
        if(result){
          console.log("result",result);
          res.status(200).json({code:"SUCCESS"});
        }
    })
  }).catch(err=>{
    console.log("err while updating password",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR"});
  })
}
}
