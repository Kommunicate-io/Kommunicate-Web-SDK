module.exports = function(sequelize, DataTypes) {
    return sequelize.define("in_app_events", {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING(500),
      },
      category:{
          type:DataTypes.INTEGER
      }
    }, {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {
  
      }
    });
  }
  