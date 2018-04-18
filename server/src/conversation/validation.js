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
  module.exports.updateConversation= {
    body:{
        groupId:joi.number().integer().required(),
        appId:joi.string().required(),
        participentUserId:joi.string(),
        createdBy:joi.string(),
        status:joi.string().only(["0","1","2","3","4"])
    }
  }
  module.exports.getConversationStats= {
    query:{
        customerId:joi.number().integer().required(),
    }
  }

module.exports.createConversationV2 = {
    body: {
        type: joi.number().integer().required(),
        admin: joi.string().required(),
        groupName: joi.string().required(),
    },
    headers:{
        'application-key': joi.string().required(),
        'authorization': joi.string().required()
    }
}