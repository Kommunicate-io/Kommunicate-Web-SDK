module.exports = function(sequelize, DataTypes) {
  return sequelize.define("inAppMsg", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    c_id: {
      type: DataTypes.INTEGER
    },
    event_id: {
      type: DataTypes.STRING(50)
    },
    message: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
    }
  }, {
    underscored: true,
    paranoid: true,
    setterMethods: {},
    getterMethods: {

    }
  });
}
