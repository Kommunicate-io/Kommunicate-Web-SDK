const db = require("../models");
const CONVERSATION_STATUS = require('./conversationUtils').CONVERSATION_STATUS;
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
    let conversation = {groupId:options.groupId,participentUserId:options.participentUserId,status:CONVERSATION_STATUS.OPEN,agentId:options.defaultAgentId,createdBy:options.createdBy}
    return Promise.resolve(db.Conversation.create(conversation)).then(result=>{
        console.log("conversation created successfully",result);
        return result;
    });

}

