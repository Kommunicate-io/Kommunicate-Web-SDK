let application = function (sequelize, DataTypes) {
  return sequelize.define("applications", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      field: 'customer_id',
      allowNull: false
    },
    applicationId: {
      type: DataTypes.STRING(150),
      field: 'application_id',
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      field: 'status',
      allowNull: false
    }
  }, {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {}
    });
}
module.exports = application