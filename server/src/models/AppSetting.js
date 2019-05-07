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
        field: "agent_routing",
        defaultValue: 0
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
        field:'default_conversation_assignee'
      },
      domainUrl:{
        type: DataTypes.STRING,
        field:'domain_url'
      },
      /**
       * automatic conversation close after this time interval.
       * will store time in sec.
       */
      conversationCloseTime:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull:false,
        field:'conversation_close_time',
      },
      popupTemplateKey:{
        type: DataTypes.TINYINT,
        defaultValue: null,
        field:'popup_template_key',
      },
      loadInitialStateConversation:{
        type:DataTypes.TINYINT(1),
        defaultValue: 1,
        field:'load_initial_state_conversation',
      },
      helpCenter:{
        type: DataTypes.JSON,
        allowNull:true,
        field:'help_center'
      },
      supportMails:{
        type: DataTypes.JSON,
        allowNull:true,
        field:'support_mails'
      },
      leadCollection:{
        type: DataTypes.JSON,
        allowNull:true,
        field:'lead_collection' 
      },
      leadType:{
        type: DataTypes.INTEGER,
        allowNull:true,
        field:'lead_type' 
      },
      collectLead:{
        type: DataTypes.BOOLEAN,
        allowNull:true,
        field:'collect_lead' 
      },
      collectFeedback:{
        type: DataTypes.BOOLEAN,
        allowNull:true,
        field:'collect_feedback' 
      },
      transcriptSetting:{
        type: DataTypes.JSON,
        allowNull:true,
        field:'transcript_setting' 
      }
    },

    {
      underscored: true,
      paranoid: true
    });
  }
  module.exports = AppSetting
  