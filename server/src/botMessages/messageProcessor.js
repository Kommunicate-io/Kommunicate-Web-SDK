
const userService= require("../users/userService");
const userController = require('../users/userController');
const inAppMessageController= require('../application/inAppMsgController');
exports.processMessage = (req,res)=>{
    const message =req.body;
    console.log("message received from Bot platform");
    userController.processOffBusinessHours(message);
    if(!message) {
      console.log("no message to process, hence returning");
      res.status(400).json({"code": "BAD_REQUEST","message": "message body is empty"});
    }else if(message.metadata.from=="KOMMUNICATE_AGENT"||message.contentType!==0) {
      res.status(200).json({"code": "Success","message": "do nothing"});
      return;
    }else{
        Promise.resolve(userService.getByUserKey(message.botId)).then(bot=>{
            if(!bot) {
              console.log("no Bot exists in db with UserKey",message.botId);
              return;
            }else{
                //send welcome message
                inAppMessageController.sendWelcomeMessage(message,bot).then(respons=>{
                    res.status(200).json({code:"success"});
                    return;
                })
            }
        }).catch(err=>{
            console.log("err while processing bot request",err);
        });
    }
}