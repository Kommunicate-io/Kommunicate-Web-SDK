module.exports = function(sequelize, DataTypes) {
  return sequelize.define("inAppMsg", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field : customer_id
    },
    eventId: {
      type: DataTypes.INTEGER
    },
    message: {
      type: DataTypes.TEXT(LONG),
      allowNull: false,
      field: event_id
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
