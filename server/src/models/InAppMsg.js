module.exports = function(sequelize, DataTypes) {
  return sequelize.define("in_app_msg", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field : "customer_id"
    },
    eventId: {
      type: DataTypes.INTEGER,
      field: "event_id"
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "message"
    },
    status: {
      type: DataTypes.INTEGER,
    },
    sequence: {
      type: DataTypes.INTEGER
    }
  }, {
    underscored: true,
    paranoid: true,
    setterMethods: {},
    getterMethods: {

    }
  });
}
