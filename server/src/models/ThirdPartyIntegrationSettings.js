module.exports = function(sequelize, DataTypes) {
    return sequelize.define("third_party_settings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      customerId: {
        type: DataTypes.INTEGER(),
        field: 'customer_id',
      },
      type:{
        type:DataTypes.INTEGER()
      },
      accessKey: {
        type: DataTypes.STRING(500),
        field: 'access_key',
        allowNull: false
      },
      accessToken: {
        type: DataTypes.STRING(50),
        field: 'access_token'
      },
      domain: {
        type: DataTypes.STRING(50)
      }    
    }, {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {}
    });
  }
  