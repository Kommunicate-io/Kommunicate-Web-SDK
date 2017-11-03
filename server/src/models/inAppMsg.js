module.exports = function(sequelize, DataTypes) {
  return sequelize.define("inAppMsg", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customer_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id: {
      type: DataTypes.INTEGER
    },
    message: {
      type: DataTypes.TEXT(LONG),
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
