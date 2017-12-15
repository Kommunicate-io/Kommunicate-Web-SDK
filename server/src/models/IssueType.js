/**
 * @global
 * @typedef {Object} IssueType model represents the issue_type table in db
 * @property {Number} id auto incremented primary key
 * @property {String} name display name of a issue
 * @property {String} description description of issue.
 * @property {Number} createdBy agent name who created this issue
 * @property {Number} customerId  customer id of agent
 * @property {Enum} status published or other status
 * @author <a href="mailto:anand@applozic.com">Anand</a>
 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define("issue_type", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    issueName: {
      type: DataTypes.STRING(100),
      field: 'issue_name',
      unique: "IDX_ISSUE_NAME_CUSTOMER_ID"
    },
    description: {
      type: DataTypes.STRING(500),
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'deleted'],
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER(),
      field: 'customer_id',
      unique: "IDX_ISSUE_NAME_CUSTOMER_ID"
    },
  }, {
      underscored: true,
      paranoid: true,
      setterMethods: {},
      getterMethods: {}
    });
}