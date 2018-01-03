const inAppMsgService = require('./inAppMsgService');
const registrationService =require('../register/registrationService');
const userService = require("../users/userService");
const applicationUtils = require('./utils');

exports.saveWelcomeMessage=(req,res)=>{
    console.log("request received to post weelcome message");
    const appId= req.params.appId;
    const message = req.body.message;
    registrationService.getCustomerByApplicationId(appId).then(customer=>{
        if(!customer){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.postWelcomeMsg({customer:customer,message:message}).then(response=>{
            console.log("welcome message is saved successfully");
            res.status(200).json({code:"SUCCESS",message:"created"});
        }).catch(err=>{
            console.log("err while persisting welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.createInAppMsg = (req, res)=>{

    console.log("request received to create in app message");
    const userName = req.params.userName;
    const appId = req.params.appId;

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.createInAppMsg(user.id, user.customerId, req.body).then(response=>{
            console.log("in app message is saved successfully");
            res.status(200).json({code:"SUCCESS",message:response.message, data: response});
        }).catch(err=>{
            console.log("err while persisting welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })
    })
}


exports.sendWelcomeMessage=(message,bot)=>{
    if(message&&message.contentType==201 && message.metadata.event==applicationUtils.EVENTS.CONVERSATION_STARTED){
        return inAppMsgService.sendWelcomeMessage(message,bot).then(status=>{
            console.log("welcome message sent successfully to group Id",message.groupId);
            return;
        })
    }else{
        console.log("skiping send welcome message");
        return;
    }

}

exports.getInAppMessages=(req,res)=>{
    const appId = req.params.appId;
    console.log("request received to get welcome message for appId: ",appId);
    registrationService.getCustomerByApplicationId(appId).then(customer=>{
        if(!customer){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
    inAppMsgService.getInAppMessage(customer.id).then(inAppMessages=>{
        res.status(200).json({code:'success',data:{message:inAppMessages&&inAppMessages.dataValues?inAppMessages.dataValues.message:""}});
    }).catch(err=>{
        res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
    });
});
}

exports.processEvents=(req, res)=>{
    const eventType = req.query.type;
    const groupId = req.body.conversationId;
    const applicationId = req.body.applicationId;
    const agentName = req.body.agentId;
    if(eventType == applicationUtils.EVENTS.CONVERSATION_STARTED){
        return registrationService.getCustomerByApplicationId(applicationId).then(customer=>{
            return inAppMsgService.processConversationStartedEvent(groupId,customer, agentName).then(response=>{
                console.log("message sent successfuly!");
                res.status(200).json({code:"SUCCESS"});
            })
        }).catch(err=>{
            console.log("err while sending welcome messgae");
            res.status(500).json({code:"INTERNAL_SERVER_ERROR"});
        })
    }else{
        res.status(200).json({code:"EVENT_NOT_SUPPORTED"});
    }

}

exports.disableInAppMessages=(req, res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;

    console.log(req.params.userName)
    console.log(userName)

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.disableInAppMessages(user.id, user.customerId).then(response=>{
            console.log("in app messages is disabled successfully");
            res.status(200).json({code:"SUCCESS", message:"disabled", data: response});
        }).catch(err=>{
            console.log("err while diabling welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.enableInAppMessages=(req, res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.enableInAppMessages(user.id, user.customerId).then(response=>{
            console.log("in app messages is enabled successfully");
            res.status(200).json({code:"SUCCESS", message:"enabled", data: response});
        }).catch(err=>{
            console.log("err while diabling welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.getInAppMessages2 =(req,res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;
    console.log("request received to get in app messages for appId and userName: ", appId, userName);
    userService.getByUserNameAndAppId(userName, appId)
        .then(user=>{
            if(!user){
                res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id or user Name"});
                return;
            }
        inAppMsgService.getInAppMessages2(user.id, user.customerId)
            .then(inAppMessages=>{
                res.status(200).json({code:'SUCCESS', message:"Got in app messages", data:inAppMessages});
            })
        }).catch(err=>{
            res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
        });
}

exports.getInAppMessagesByEventId =(req,res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;
    const eventId = req.params.eventId;
    console.log("request received to get in app messages for appId and userName: ", appId, userName);
    userService.getByUserNameAndAppId(userName, appId)
        .then(user=>{
            if(!user){
                res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id or user Name"});
                return;
            }
        inAppMsgService.getInAppMessagesByEventId(user.id, user.customerId, eventId)
            .then(inAppMessages=>{
                res.status(200).json({code:'SUCCESS', message:"Got in app messages by event id", data:inAppMessages});
            })
        }).catch(err=>{
            res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
        });
}

exports.softDeleteInAppMsg=(req, res)=>{
    console.log("request received to soft delete in app messages for id", id);
    return inAppMsgService.softDeleteInAppMsg(req.params.id)
            .then(inAppMessage=>{
                res.status(200).json({code:'SUCCESS', message:"Soft deleted the message", data:inAppMessage});
            }).catch(err=>{
                res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
            });
}

