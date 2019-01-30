/**
 * @global 
 * @typedef {Object} UserPreferences UserPreferences model represents the user_preferences table in db
 * @property {Number} userId  primary key
 * @property {Number} preferenceId primary key preference id representing preference code
 * @property {String} value value of preference
 */

 let UserPreferences = function (sequelize, DataTypes) {
    return sequelize.define("user_preferences", {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false 
        // uid <= appid + username
      },
      preferenceId: {
        type: DataTypes.INTEGER,
        field: 'preference_id',
        allowNull: false
      },
      value: {
        type: DataTypes.STRING(200),
        field: 'value',
        allowNull: false
      }
    }, {
      indexes: [
        { fields: ['user_id', 'preference_id'], unique: true }
       ],
        underscored: true,
        paranoid: true,
        setterMethods: {},
        getterMethods: {}
      });
  }
module.exports = UserPreferences;