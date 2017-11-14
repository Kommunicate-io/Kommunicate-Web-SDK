const registrationService = require("./registrationService");
const userService = require('../users/userService');
const joi = require("joi");

exports.createCustomer = (req,res)=>{
  // userName is the primary parameter. user Id was replaced by userName.
  const userName = req.body.userName?req.body.userName:req.body.userId;
  //const userId =  userName; 
  const isPreSignUp = req.query.preSignUp;
  const password = isPreSignUp?userName:req.body.password;
  const name = req.body.name;
  const email=req.body.email||userName;

  let response={};

  console.log("userName:", userName, password,isPreSignUp);
  if(userName&&(isPreSignUp||password)){
    console.log("request received for pre sign up, EmailId : ",userName);
    //TODO : check the if user exist form communicate Db;
    Promise.all([registrationService.getCustomerByUserName(userName),userService.getUserByName(userName)]).then(([customer,user])=>{
      console.log("got the user from db",user);
      if(customer || user){
        response.code ="USER_ALREADY_EXISTS";
        response.message="User Already Exists";
        res.status(200).json(response);
        return;
      }else{
        return registrationService.createCustomer({"userName":userName,"password":password,"email":email,"name":name}).then(result=>{
          try{
          registrationService.sendWelcomeMail(email, name);
          }catch(err){
            console.log("Error while sending welcom mail to user  ",err);
          }
            response.code="SUCCESS";
              // replacing user Id with user name. can't delete userId from system for backward compatibility.
              delete result.userId;
              result.isAdmin=true;
              response.data=result;
              res.status(200).json(response);
            }).catch(err=>{
            console.log("error while creating a customer",err);
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
      })
    }else{
      response.code = "BAD_REQUEST";
      response.message="some params are missing";
      res.status(400).json(response);
    }
}

exports.patchCustomer = (req,res)=>{
  let response ={};
  let status;
  const customer = req.body;
  const userId = req.params.userId;
  console.log("request recieved to update customer: ",userId, "body",customer);
  registrationService.updateCustomer(userId,customer).then(isUpdated=>{
    if(isUpdated){
      response.code="SUCCESS";
      response.message="updation successfull";
      res.status(200).json(response);
    }else{
      response.code="NOT_FOUND";
      response.message="resource not found by userId "+userId;
      res.status(404).json(response);
    }

  }).catch((err)=>{
    response.code="INTERNAL_SERVER_ERROR";
    response.message="something went wrong!";
    res.status(500).json(response);
  });

}

exports.getCustomerInformation = (req,res)=>{
  const userName = req.params.userName;
  console.log("request received to get customer information: ",userName);
  if(!userName){
    res.status(400).json({code:"BAD_REQUEST",message:"user name is empty"});
    return;
  }
  registrationService.getCustomerByUserName(userName).then(customer=>{
    if(!customer){
      console.log("customer not found in db :",userName);
      res.status(404).json({code:"NOT_FOUND",message:"no customer exists with user name: "+userName});
    }else{
      let custInfo =  customer.dataValues;
      delete custInfo.password;
      res.status(200).json({code:"SUCCESS",data:custInfo});
    }
  }).catch(err=>{
    console.log("err while fetching data for customer",err);
    res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong"});
    return;
  })


} 

exports.signUpWithAplozic= (req,res)=>{
  const userName = req.body.userName;
  const password = req.body.password;
  const applicationId = req.body.applicationId;
  const email = req.body.email || userName;
  let response={};

  console.log("userName:", userName, password);
  if(userName&&password){
    console.log("request received to sign up with Applozic, EmailId : ",userName);
    Promise.all([registrationService.getCustomerByUserName(userName),userService.getUserByName(userName)]).then(([customer,user])=>{
      console.log("got the user from db",user);
      if(customer || user){
        response.code ="USER_ALREADY_EXISTS";
        response.message="User Already Exists";
        res.status(200).json(response);
        return;
      }else{
        return registrationService.signUpWithApplozic({"userName":userName,"password":password,"email":email,"applicationId":applicationId}).then(result=>{
          try{
           registrationService.sendWelcomeMail(email, name);
          }catch(err){
            console.log("Error while sending welcom mail to user  ",err);
          }
            response.code="SUCCESS";
              // replacing user Id with user name. can't delete userId from system for backward compatibility.
              delete result.userId;
              result.isAdmin=true;
              response.data=result;
              res.status(200).json(response);
            }).catch(err=>{
            console.log("error while creating a customer",err);
            switch(err.code){
              case "USER_ALREADY_EXISTS":
                response.code ="USER_ALREADY_EXISTS";
                response.message="user Already Exists";
                res.status(200).json(response);
                break;
              case "APPLICATION_NOT_EXISTS":
                response.code ="APPLICATION_NOT_EXISTS";
                response.message="application Not exists";
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
      })
    }else{
      response.code = "BAD_REQUEST";
      response.message="some params are missing";
      res.status(400).json(response);
    }



}
