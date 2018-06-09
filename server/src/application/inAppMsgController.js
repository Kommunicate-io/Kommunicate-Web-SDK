const inAppMsgService = require('./inAppMsgService');
const registrationService =require('../register/registrationService');
const userService = require("../users/userService");
const applicationUtils = require('./utils');
const logger = require('../utils/logger');
const constant = require('./utils');
const customerService=require('../customer/customerService');
const appSetting = require("../setting/application/appSettingService")


exports.saveWelcomeMessage=(req,res)=>{
    logger.info("request received to post weelcome message");
    const appId= req.params.appId;
    const message = req.body.message;
    customerService.getCustomerByApplicationId(appId).then(customer=>{
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
    customerService.getCustomerByApplicationId(appId).then(customer=>{
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

    return customerService.getCustomerByApplicationId(applicationId).then(customer=>{
        if(eventType==constant.EVENT_ID.WELCOME_MESSAGE){  
            return  inAppMsgService.sendWelcomeMessage(groupId,customer).then(response=>{
                logger.info(response);
                if(response =="success"){
                    res.status(200).json({code:"SUCCESS"});
                }else if(response =="no_message"){
                    res.status(200).json({code:"SUCCESS",message:"Welcome message not configured"});
                }
            })
        }
        // not needed now. remove this code if every thing works fine.
       /* return userService.getAdminUserByAppId(applicationId).then(adminUser=>{
            return inAppMsgService.processEventWrapper(eventType, groupId, customer,adminUser, agentName).then(response=>{
                logger.info(response);
                if(response =="success"){
                    res.status(200).json({code:"SUCCESS"});
                }else if(response =="no_message"){
                    res.status(200).json({code:"SUCCESS",message:"welcome message not configured"});
                }else{
                    res.status(200).json({code:"SUCCESS",message:response});
                }
            })
        })*/
       
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

/*This API is for getting list of InAppMessage list of customer and user
 *for this required parameters are appId, eventIds
 *
*/

exports.getInAppMessagesByEventIds = (req, res) => {
    var appId = req.query.appId;
    var userName = req.query.userName;
    var eventIds = req.query.eventIds;
    logger.info("request received to get in app messages for appId and userName: ", appId, userName, eventIds);
    return customerService.getCustomerByApplicationId(appId).then(customer => {
        return userService.getByUserNameAndAppId(userName, appId).then(user => {
            if (!user) {
                return res.status(400).json({ code: "BAD_REQUEST", message: "Invalid application Id or user Name" });
            }
            return inAppMsgService.getInAppMessagesByEventIds(user.id, user.customerId, user.type, eventIds).then(inAppMessages => {
                if (inAppMessages instanceof Array && inAppMessages.length > 0) {
                    return res.status(200).json({ code: 'SUCCESS', message: "message list", data: inAppMessages });
                }
                return res.status(200).json({ code: 'SUCCESS', message: "No messege found" });
            });

        })

    }).catch(err => {
        logger.error("error while fatching massges", err)
        return res.status(400).json({ code: "BAD_REQUEST", message: "Invalid application Id or user Name" });
    })
}

exports.getInAppMessagesByEventId =(req,res)=>{
    var params =req.params; 
    var appId = req.query.appId;
    var userName = req.query.userName;
    var eventIds = req.query.eventIds;
    logger.info("request received to get in app messages for appId and userName: ", appId, userName,eventIds);
    userService.getByUserNameAndAppId(userName, appId)
        .then(user=>{
            if(!user){
                res.status(400).json({code:"BAD_REQUEST",message:"Invalid application Id or user Name"});
                return;
            }
        inAppMsgService.getInAppMessagesByEventId(user.id, user.customerId, user.type, eventIds)
            .then(inAppMessages=>{
                let message = "Not able to get in app messages"
                if(inAppMessages instanceof Array && inAppMessages.length > 1){
                    message = "Got in app messages by event id"
                }else if(inAppMessages instanceof Array && inAppMessages.length < 1){
                    message = "No in app messages"
                }
                
                let messages =[];
                inAppMessages.forEach(item => {
                    messages.push(
                        {"eventId":item.eventId,
                        "messages":[{"id":item.id,
                                    "customerId":item.customerId,
                                    "message":item.message,
                                    "metadata":item.metadata,
                                    "status":item.status,
                                    "sequence":item.status,
                                    "category":item.category,
                                    "created_at":item.created_at,
                                    "createdBy":item.createdBy,
                                    "deleted_at":item.deleted_at,
                                    "updated_at":item.updated_at
                                    }]}
                    )
                });
                let eventId1Messages = [];
                let eventId2Messages = [];
                let eventId3Messages = [];
                let eventId4Messages = [];
          
                 eventId1Messages = messages.filter(function (msg) {
                          return msg.eventId == 1;
                     });
                 eventId2Messages = messages.filter(function (msg) {
                          return msg.eventId == 2;
                     });
                 eventId3Messages = messages.filter(function (msg) {
                          return msg.eventId == 3;
                     });
                 eventId4Messages = messages.filter(function (msg) {
                          return msg.eventId == 4;
                     });
                let welcomeMessages = {
                    "eventId1Messages": eventId1Messages,
                    "eventId2Messages": eventId2Messages,
                    "eventId3Messages": eventId3Messages,
                    "eventId4Messages": eventId4Messages
                }
                res.status(200).json({code:'SUCCESS', message:message, data:welcomeMessages});
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


exports.processAwayMessage = function(req,res){
    
    const applicationId = req.params.appId;
    const conversationId = req.query.conversationId;
    logger.info("processing awayMessage for application: ",applicationId);
    return customerService.getCustomerByApplicationId(applicationId).then(customer=>{
        let eventId = 0;
        let collectEmail = false;
        if(customer){
            return Promise.all([inAppMsgService.checkOnlineAgents(customer),
                inAppMsgService.isGroupUserAnonymous(customer,conversationId)])
                .then(([onlineUser,isGroupUserAnonymous])=>{
            
               if(onlineUser){
                // agents are online. skip away message
                logger.info("agents are online. skip away message");
                res.json({"code":"AGENTS_ONLINE","message":"skiping away message. some agents are online"}).status(200);
                return;
               }else if(isGroupUserAnonymous){
                // agents are offline. group user is anonymous
                eventId = constant.EVENT_ID.AWAY_MESSAGE.ANONYMOUS;
                
               }else{
                // agents are offline and user is known.
                eventId = constant.EVENT_ID.AWAY_MESSAGE.KNOWN;
               }
               //get status of collect email
                Promise.resolve(appSetting.getAppSettingsByApplicationId({ applicationId: applicationId }))
                .then(response => {  
                     collectEmail = response.data.collectEmail;
                     return inAppMsgService.getInAppMessage(customer.id,eventId).then(result=>{
                        logger.info("got data from db.. sending response.");
                        let messageList = result.map(data=>data.dataValues);
                        let data = {"messageList":messageList, "collectEmail":collectEmail}
                        res.json({"code":"SUCCESS",data:data}).status(200);
                    })
                })
               
            });
        }else{
            logger.info("no customer found with applicationId :",applicationId);
            res.json({"code":"APPLICATION_NOT_EXISTS","message":"application does not belong to any registerd customer."}).status(404);
        }
    }).catch(err=>{
        logger.info("error while processing away message :",err);
        res.json({"code":"INTERNAL SERVER ERROR","message":"something went wrong"}).status(500);
    })
    

}
