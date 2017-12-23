/**
 * @global 
 * @typedef {Object} User user model represents the user table in db
 * @property {Number} id auto incremented primary key
 * @property {String} name display name of a user
 * @property {String} userName unique for an application.
 * @property {String} email email of the User
 * @property {String} password 
 * @property {String} apzToken Base64 encoded 
 * @property {String} authorization base64 encoder
 * @property {String} accessToken  plain text password for user
 * @property {Number} customerId  primary key in customer table
 * @property {String} role user's within orgnization
 * @property {String} contactNo 
 * @property {String} companyName
 * @property {String} companySize
 * @property {Number} type  1: AGENT, 2:BOT ,3: ADMIN 
 * @property {String} userKey mqtt topic Id for user. its primary key in applozic user table. 
 * @author <a href="mailto:suraj@applozic.com">Suraj</a>
 */

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
    contactNo: {
      type: DataTypes.STRING(20),
      field: 'contact_no'
    },
    industry: {
      type: DataTypes.STRING(20)
    },
    companyName: {
      type: DataTypes.STRING(50),
      field: 'company_name'
    },
    companySize: {
      type: DataTypes.STRING(15),
      field: 'company_size'
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
    },
    availabilty_status: {
      type: DataTypes.INTEGER(),
      field: 'availability_status',
      defaultValue: 1
    }
  }, {
    underscored: true,
    paranoid: true,
    setterMethods: {},
    getterMethods: {

    }
  });
}
