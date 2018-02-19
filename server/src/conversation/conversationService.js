const db = require("../models");
const CONVERSATION_STATUS = require('./conversationUtils').CONVERSATION_STATUS;
const applozicClient = require("../utils/applozicClient");
const userService= require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const logger = require('../utils/logger');

/**
 * returns conversation list of given participent_user_Id
 * @userId
 */
exports.getConversationList =(participentUserId)=>{

    console.log("request received to get conversation list of participent user: ",participentUserId);
    return Promise.resolve(db.Conversation.findAll({where:{participentUserId:participentUserId}}));

}
/**
 * create a new conversation
 *@param options
 {
 *      groupId: applozic gruop Id
 *      participentUserId : user who is involved in this conversation
 *      createdBy: Applozic userId if comming from plugin. AgentId if comming from dashboard;
 *      status : "OPEN","ASIGNED","CLOSED","SPAM","REOPENED",
 *      defaultAgentId: assignee agent Id
 * }
 */
exports.createConversation= (options)=>{
    console.log("creating new converation, options:",options);
    //return Promise.resolve().then().catch();
    let conversation = {groupId:options.groupId,
        participentUserId:options.participentUserId,
        status:CONVERSATION_STATUS.OPEN,
        agentId:options.defaultAgentId,
        createdBy:options.createdBy,
    }
    return Promise.resolve(db.Conversation.create(conversation)).then(result=>{
        console.log("conversation created successfully",result);
        return result;
    });

}

exports.addMemberIntoConversation = (data) => {
    //note: getting clientGroupId in data.groupId
    let groupInfo = { userIds: [], clientGroupIds:[data.groupId] }
    let header={}
    return Promise.resolve(registrationService.getCustomerByUserName(data.userId)).then(customer => {
        if (customer) {
            return Promise.resolve(userService.getAllUsersOfCustomer(customer,undefined)).then(users => {
                if (users) {
                    users.forEach(function (user) {
                        if(user.type===2){
                            if (user.userName === 'bot') { 
                                header.apzToken = user.apzToken 
                            }if(user.allConversations==1){
                                groupInfo.userIds.push(user.userName);
                            }
                        }
                         else{
                            groupInfo.userIds.push(user.userName);
                        } 
                        if(user.type===3){
                            header.ofUserId=user.userName
                        }
                        
                    });
                    logger.info('addMemberIntoConversation - group info:',groupInfo, 'applicationId: ',customer.applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                    return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applicationId, header.apzToken, header.ofUserId)).then(response => {
                        logger.info('response', response.data)
                        return {code:"SUCCESS", data:'success'};
                    });
                }
            })
        }else{
            return {code:"SUCCESS", data:'customer not found'};
        }
    }).catch(err => {
        logger.info("error during creating group", err)
        return {code:"ERROR", data:'error during adding member into conversation'};
    });
}
