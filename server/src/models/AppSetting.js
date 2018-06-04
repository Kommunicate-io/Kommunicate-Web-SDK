module.exports = function(sequelize, DataTypes) {
    return sequelize.define("application_settings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      applicationId:{
        type:DataTypes.STRING(150),
        allowNull: false,
        field: 'application_id'
      },
      collectEmail:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        field: 'collect_email',
        defaultValue: 1
      }  
    }, {
      underscored: true,
      paranoid: true
    });
  }
  