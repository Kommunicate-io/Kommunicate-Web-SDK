module.exports = function (sequelize, DataTypes) {
  return sequelize.define("cron_time_stamp", {
    cron_key: {
      type: DataTypes.STRING(50),
      field: 'cron_key',
      primaryKey: true,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE(6),
      field: 'update_time',
      allowNull: true,
      defaultValue: null
    }
  }, {
      underscored: true,
      paranoid: true,
      timestamps: false,
      setterMethods: {},
      getterMethods: {}
    });
}
