module.exports = function(sequelize, DataTypes) {
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
      collectEmail:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        field: 'collect_email',
        defaultValue: 0
      }  
    },
    {
      underscored: true,
      paranoid: true
    });
  }
  