const CONVERSATION_STATUS_ARRAY = require('../conversation/conversationUtils').CONVERSATION_STATUS_ARRAY;
module.exports = (sequalize, DataTypes) => {
  return sequalize.define(
    "conversations",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      /**
       * applozic group_id. fetch the group detail from applozic db using this Id 
       */
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "group_id",
        unique:true
      },
      /***
       *  this is the user who is involved in this conversation.
       * this is the user_name in applozic user table.
       */
     participentUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "participent_user_id"
      },
      //applozic user_name(participentUserId) if user creates conversation. agentId if agent creates
      createdBy:{
        type: DataTypes.STRING, 
        allowNull:false,
        field: "created_by"
      },
      // conversation status
      status: {
        type: DataTypes.ENUM,
        values: CONVERSATION_STATUS_ARRAY,
        field: "status"
      },
      // assignee agent Id. user Id from users table 
      agentId: {
        type: DataTypes.INTEGER,
        field: "agent_id"
      },
      metadata:{
        type:DataTypes.JSON,
        allowNull: true
      },
      closeAt:{
        type:DataTypes.DATE,
        field:'close_at'
      }

    },

    {
      underscored: true,
      paranoid: true
    }
  );
};
