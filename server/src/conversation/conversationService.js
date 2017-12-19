const db = require("../models");
const CONVERSATION_STATUS = require('./conversationUtils').CONVERSATION_STATUS;
const applozicClient = require("../utils/applozicClient");
const userService= require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')

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
    let groupInfo = { userIds: [], clientGroupIds:[data.groupId] }
    let header={}
    return Promise.resolve(registrationService.getCustomerByUserName(data.userId)).then(customer => {
        if (customer) {
            return Promise.resolve(userService.getAllUsersOfCustomer(customer,undefined)).then(users => {
                if (users) {
                    users.forEach(function (user) {
                        if(user.type===2){
                            header.apzToken=user.apzToken
                        }
                        if(user.type===3){
                            header.ofUserId=user.userName
                        }
                            groupInfo.userIds.push(user.userName);
                        
                    });
    
                    return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applicationId, header.apzToken, header.ofUserId)).then(response => {
                        return response.data;
                    });
                }
            })
        }else{
            return 0;
        }
    }).catch(err => {
        console.log("error during creating group", err)
        return 0;
    });
}
