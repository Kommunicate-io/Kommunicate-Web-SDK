module.exports = function(sequelize, DataTypes) {
    return sequelize.define("app_subscriptions", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      platform:{
        type:DataTypes.STRING(20),
        allowNull: false,
        field: 'platform',
        unique: "PLATFORM_INTEGRATION_IDX"
      },integrationName :{
        type:DataTypes.STRING(20),
        allowNull: false,
        field: 'integration_name',
        unique: "PLATFORM_INTEGRATION_IDX"
      },
      eventType:{
        type:DataTypes.STRING(20),
        allowNull: false,
        field: 'event_type',
        unique: "PLATFORM_INTEGRATION_IDX"
      },
      triggerUrl:{
        type:DataTypes.STRING(100),
        allowNull: false,
        field: 'trigger_url'
      }
    }, {
      underscored: true,
      paranoid: true
    });
  }
  