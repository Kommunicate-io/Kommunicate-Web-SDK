let AppSetting= function(sequelize, DataTypes) {
    return sequelize.define("app_settings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      applicationId:{
        type:DataTypes.STRING(150),
        allowNull: false,
        field: 'application_id'
      }, agentRouting: {
        type: DataTypes.INTEGER,
        field: "agent_routing"
      },
      botRouting: {
        type: DataTypes.BOOLEAN,
        field: "bot_routing"
      },
      widgetTheme:{
        type:DataTypes.JSON,
        allowNull: true,
        field: "widget_theme"
      },
      collectEmailOnAwayMessage:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        field: 'collect_email_away',
        defaultValue: 0
      },  
      collectEmailOnWelcomeMessage:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        field: 'collect_email_welcome',
        defaultValue: 0
      },
      removeBotOnAgentHandOff: { 
        // if set to 1 it will remove the bot from conversation when conversation assigned to agent.
        type:DataTypes.BOOLEAN,
        allowNull: false,
        field: 'remove_bot_on_agent_handoff',
        defaultValue: 0
      },
      defaultConversationAssignee:{
        type: DataTypes.JSON,
        allowNull:false,
        field:'default_conversation_assignee',
      }
    },
    
    {
      underscored: true,
      paranoid: true
    });
  }
  module.exports = AppSetting
  