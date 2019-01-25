/**
 * @global 
 * @typedef {Object}  ChatPopupMessage model represents the chat_popup_message table in db
 * @property {Number} id auto incremented primary key
 * @property {Number} appSettingId id from appSetting Model
 * @property {String} message
 * @property {String} url
 * @property {Number} delay in milliseconds
 */
let ChatPopupMessage = function (sequelize, DataTypes) {
    return sequelize.define("chat_popup_messages", {
      id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        field: 'id',
        primaryKey: true,
        allowNull: false
      },
      appSettingId: {
        type: DataTypes.INTEGER,
        field: 'app_setting_id',
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        field: 'message',
        allowNull: false
      },
      url: {
        type: DataTypes.TEXT,
        field: 'url',
        allowNull: false
      },
      delay: {
        type: DataTypes.INTEGER,
        field: 'delay',
        allowNull: false,
        defaultValue:0
      }
    }, {
        underscored: true,
        timestamps: false,
        setterMethods: {},
        getterMethods: {}
      });
  }
  module.exports = ChatPopupMessage;