
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("issue_type_auto_repies", {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      issueTypeId: {
        type: DataTypes.INTEGER,
        field:'issue_type_id',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      metadata:{
        type:DataTypes.JSON,
        allowNull: true
      },
      sequence: {
        type: DataTypes.INTEGER
      },
      createdBy: {
        type: DataTypes.INTEGER,
        field: 'created_by',
      }
    },
    {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {}
    });
  }