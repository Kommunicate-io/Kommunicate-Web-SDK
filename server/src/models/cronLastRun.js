let cronLastRun = function(sequelize, DataTypes) {
  return sequelize.define(
    "cron_last_run",
    {
      cron_key: {
        type: DataTypes.STRING(15),
        field: "cron_key",
        primaryKey: true,
        allowNull: false
      },
      last_run_time: {
        type: DataTypes.DATE(6),
        field: "last_run_time",
        allowNull: true,
        defaultValue: null
      }
    },
    {
      underscored: true,
      paranoid: true,
      timestamps: false,
      setterMethods: {},
      getterMethods: {}
    }
  );
};
module.exports = cronLastRun;
