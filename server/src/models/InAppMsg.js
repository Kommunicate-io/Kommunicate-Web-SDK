let InAppMsg = function (sequelize, DataTypes) {
  return sequelize.define("in_app_msg", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    applicationId: {
      type: DataTypes.STRING,
      field: "application_id"
    },
    eventId: {
      type: DataTypes.INTEGER,
      field: "event_id"
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "message"
    },
    status: {
      type: DataTypes.INTEGER,
    },
    sequence: {
      type: DataTypes.INTEGER
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by',
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    languageCode: {
      type: DataTypes.STRING,
      field: 'language_code',
      allowNull: true
    }
  }, {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {

      }
    });
}
module.exports = InAppMsg;