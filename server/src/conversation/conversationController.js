

const conversationService = require('./conversationService');
const dbUtils =require("../utils/dbUtils.js");
const logger = require('../utils/logger');
/**
 * returns conversation list of given participent_user_Id
 * 
 */
exports.getConversationList=(req, res)=>{
    const participentUserId = req.params.participentId;
    conversationService.getConversationList(participentUserId)
    .then(dbUtils.getDataArrayFromResultSet)
    .then(conversationList=>{
        console.log("got data from db",conversationList);
        res.status(200).json({"code":"SUCCESS",data:conversationList});
    }).catch(err=>{
        console.log("err while fetching ConversationList", err);
        res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"something went wrong!"});
    })

}


exports.createConversation= (req,res)=>{
    console.log("request received to create conversation");
    return Promise.resolve(conversationService.createConversation(req.body)).then(result=>{
        console.log("conversation created successfully", result.dataValues);
        res.status(201).json({code:"SUCCESS",data:result.dataValues});
    }).catch(err=>{
        console.log("error while creating conversation ", err);
        if(err.original&& err.original.code==="ER_DUP_ENTRY"){
            res.status(409).json({code:"CONFLICT",message:err.original.message}); 
        }else{
            res.status(500).json({code:"INTERNAL_SERVER_ERROR",message:"Something went wrong"});  
        }

    })

}

exports.addMemberIntoConversation = (req, res) => {
    conversationService.addMemberIntoConversation(req.body).then(response=>{
        res.status(201).json(response);
    }).catch(err => {
        logger.info("error while adding member into conversation ", err);
        res.status(204).json(response);
    });

}