const inAppMsgService = require('./inAppMsgService');
const registrationService =require('../register/registrationService');
const userService = require("../users/userService");
const applicationUtils = require('./utils');
const logger = require('../utils/logger');

exports.saveWelcomeMessage=(req,res)=>{
    logger.info("request received to post weelcome message");
    const appId= req.params.appId;
    const message = req.body.message;
    registrationService.getCustomerByApplicationId(appId).then(customer=>{
        if(!customer){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.postWelcomeMsg({customer:customer,message:message}).then(response=>{
            logger.info("welcome message is saved successfully");
            res.status(200).json({code:"SUCCESS",message:"created"});
        }).catch(err=>{
            logger.info("err while persisting welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.createInAppMsg = (req, res)=>{

    logger.info("request received to create in app message");
    const userName = req.params.userName;
    const appId = req.params.appId;

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.createInAppMsg(user.id, user.customerId, req.body).then(response=>{
            logger.info("in app message is saved successfully");
            res.status(200).json({code:"SUCCESS",message:response.message, data: response});
        }).catch(err=>{
            logger.info("err while persisting welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })
    })
}


exports.sendWelcomeMessage=(message,bot)=>{
    if(message&&message.contentType==201 && message.metadata.event==applicationUtils.EVENTS.CONVERSATION_STARTED){
        return inAppMsgService.sendWelcomeMessage(message,bot).then(status=>{
            logger.info("welcome message sent successfully to group Id",message.groupId);
            return;
        })
    }else{
        logger.info("skiping send welcome message");
        return;
    }

}

exports.getInAppMessages=(req,res)=>{
    const appId = req.params.appId;
    logger.info("request received to get welcome message for appId: ",appId);
    registrationService.getCustomerByApplicationId(appId).then(customer=>{
        if(!customer){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
    inAppMsgService.getInAppMessage(customer.id).then(inAppMessages=>{
        res.status(200).json({code:'success',data:{message:(inAppMessages.length>0) ? inAppMessages[0].message : ""}});
    }).catch(err=>{
        logger.info('error while getting welcome message', err)
        res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
    });
});
}

exports.processEvents=(req, res)=>{
    const eventType = req.query.type;
    const groupId = req.body.conversationId;
    const applicationId = req.body.applicationId;
    const agentName = req.body.agentId;
    logger.info(req.body)
    if(eventType == applicationUtils.EVENTS.CONVERSATION_STARTED){
        return registrationService.getCustomerByApplicationId(applicationId).then(customer=>{
            return inAppMsgService.processConversationStartedEvent(groupId,customer, agentName).then(response=>{
                logger.info("message sent successfuly!");
                res.status(200).json({code:"SUCCESS"});
            })
        }).catch(err=>{
            logger.info("err while sending welcome messgae",err);
            res.status(500).json({code:"INTERNAL_SERVER_ERROR"});
        })
    }else{
        res.status(200).json({code:"EVENT_NOT_SUPPORTED"});
    }

}

exports.processEvents2=(req, res)=>{
    const eventType = req.query.type;
    const groupId = req.body.conversationId;
    const applicationId = req.body.applicationId;
    const agentName = req.body.agentId;

    return registrationService.getCustomerByApplicationId(applicationId).then(customer=>{
        return userService.getAdminUserByAppId(applicationId).then(adminUser=>{
            return inAppMsgService.processEventWrapper(eventType, groupId, customer,adminUser, agentName).then(response=>{
                logger.info(response);
                if(response =="success"){
                    res.status(200).json({code:"SUCCESS"});
                }else if(response =="no_message"){
                    res.status(200).json({code:"SUCCESS",message:"Welcome message not configured"});
                }
            })
        })
       
    }).catch(err=>{
        logger.info("err while sending welcome messgae",err);
        res.status(500).json({code:"INTERNAL_SERVER_ERROR"});
    })

}

exports.disableInAppMessages=(req, res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;
    const category = req.body.category

    logger.info(req.params.userName)
    logger.info(userName)
    logger.info(req.body.category)

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.disableInAppMessages(user.id, user.customerId, category).then(response=>{
            logger.info("in app messages is disabled successfully");
            res.status(200).json({code:"SUCCESS", message:"disabled", data: response});
        }).catch(err=>{
            logger.info("err while diabling welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.enableInAppMessages=(req, res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;
    const category = req.body.category

    userService.getByUserNameAndAppId(userName, appId).then(user=>{
        if(!user){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id"});
            return;
        }
        return inAppMsgService.enableInAppMessages(user.id, user.customerId, category).then(response=>{
            logger.info("in app messages is enabled successfully");
            res.status(200).json({code:"SUCCESS", message:"enabled", data: response});
        }).catch(err=>{
            logger.info("err while diabling welcome message in db",err);
            res.status(500).json({code:"ERROR",message:"created"});
        })

    })
}

exports.getInAppMessages2 =(req,res)=>{
    const appId = req.params.appId;
    const userName = req.params.userName;
    logger.info("request received to get in app messages for appId and userName: ", appId, userName);
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
    logger.info("request received to get in app messages for appId and userName: ", appId, userName);
    userService.getByUserNameAndAppId(userName, appId)
        .then(user=>{
            if(!user){
                res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id or user Name"});
                return;
            }
        inAppMsgService.getInAppMessagesByEventId(user.id, user.customerId, user.type, eventId)
            .then(inAppMessages=>{
                let message = "Not able to get in app messages"
                if(inAppMessages instanceof Array && inAppMessages.length > 1){
                    message = "Got in app messages by event id"
                }else if(inAppMessages instanceof Array && inAppMessages.length < 1){
                    message = "No in app messages"
                }
                res.status(200).json({code:'SUCCESS', message:message, data:inAppMessages});
            })
        }).catch(err=>{
            res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
        });
}

exports.softDeleteInAppMsg=(req, res)=>{
    logger.info("request received to soft delete in app messages for id", req.params.id);
    return inAppMsgService.softDeleteInAppMsg(req.params.id)
            .then(inAppMessage=>{
                res.status(200).json({code:'SUCCESS', message:"Soft deleted the message", data:inAppMessage});
            }).catch(err=>{
                res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong!"});
            });
}

exports.editInAppMsg = (req, res)=>{

    logger.info("request received to edit in app message");
    logger.info(req.body);
    return inAppMsgService.editInAppMsg(req.body)
    .then(response=>{
        logger.info("response is...", response);
        logger.info("in app message is edited successfully");
        res.status(200).json({code:"SUCCESS",message:response.message, data: response});
    }).catch(err=>{
        logger.info("err while editing in app message",err);
        res.status(500).json({code:"ERROR",message:"created"});
    })
}

