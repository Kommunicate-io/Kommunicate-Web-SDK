let AppSubscription = function (sequelize, DataTypes) {
  return sequelize.define("app_subscriptions", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'platform',
      unique: "PLATFORM_EVENT_IDX"
    }, integrationName: {
      type: DataTypes.STRING(20),
      field: 'integration_name'
    }, applicationId: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'application_id'
    },
    eventType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'event_type',
      unique: "PLATFORM_EVENT_IDX"
    },
    triggerUrl: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'trigger_url'
    }
  }, {
      underscored: true,
      paranoid: true
    });
}
module.exports = AppSubscription
