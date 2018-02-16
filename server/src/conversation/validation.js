const joi = require("joi");


module.exports.getConversationList= {
    query:{
     userId:joi.string().required()
      }
  }

  module.exports.createConversation= {
    body:{
        groupId:joi.number().integer().required(),
        participentUserId:joi.string().required(),
        createdBy:joi.string().required(),
        defaultAgentId:joi.string().required()
    }
  }

  module.exports.getConversationListOfParticipent= {
      param:{
          participentUserId:joi.string().required()
      },
      
      query:{
        // TODO type : user or agent. single API will work for bot user and agent  
        type:joi.string()
      }
  }

  module.exports.addMemberIntoConversation= {
    body:{
        groupId:joi.string().required(),
        userId:joi.string().required()
    }
  }