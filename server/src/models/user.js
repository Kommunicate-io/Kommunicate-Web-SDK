module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50)
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "IDX_USER_CUSTOMER",
      field: 'user_name'
    },
    email: {
      type: DataTypes.STRING(50)
    },
    password: {
      type: DataTypes.STRING(200)
    },
    apzToken: {
      type: DataTypes.STRING(200),
      field: 'apz_token'
    },
    authorization: {
      type: DataTypes.STRING(200)
    },
    accessToken: {
      type: DataTypes.STRING(50),
      field: 'access_token'
    },
    customerId: {
      type: DataTypes.INTEGER(),
      field: 'customer_id',
      unique: "IDX_USER_CUSTOMER"
    },
    role: {
      type: DataTypes.STRING(20)
    },
    // user is bot or agent. 1:Agent, 2:bot, 3: admin
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    //it is primary key in applozic db. used as mqtt topic for user. 
    userKey:{
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'user_key'
    }
  }, {
    underscored: true,
    paranoid: true,
    setterMethods: {},
    getterMethods: {

    }
  });
}
