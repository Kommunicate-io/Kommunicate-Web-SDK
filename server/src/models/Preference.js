/**
 * @global 
 * @typedef {Object} Preference Preference model represents the preference table in db
 * @property {Number} id auto incremented primary key
 * @property {String} name name of the preference. 
 */
let Preference = function (sequelize, DataTypes) {
    return sequelize.define("preference", {
      id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        field: 'id',
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        field: 'name',
        allowNull: false,
        unique: true
      }
    }, {
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        setterMethods: {},
        getterMethods: {}
      });
  }
  module.exports = Preference;