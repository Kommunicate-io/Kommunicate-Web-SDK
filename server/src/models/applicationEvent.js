module.exports = function(sequelize, DataTypes) {
  return sequelize.define("applicationEvent", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    event_name: {
      type: DataTypes.STRING(50)
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
