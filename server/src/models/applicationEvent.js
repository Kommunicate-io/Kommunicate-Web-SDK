module.exports = function(sequelize, DataTypes) {
  return sequelize.define("applicationEvent", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    eventName: {
      type: DataTypes.STRING(50),
      field: event_name
    },
    description: {
      type: DataTypes.TEXT(LONG)
    }
  }, {
    underscored: true,
    paranoid: true,
    setterMethods: {},
    getterMethods: {

    }
  });
}
