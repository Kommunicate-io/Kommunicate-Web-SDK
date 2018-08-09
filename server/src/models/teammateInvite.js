/**
 * @global 
 * @typedef {Object}  teammateInvite  model represents the team_invitation table in db
 * @property {Number} id  uuid and primary key
 * @property {String} status status of invite request
 * @property {String} invitedBy userKey of  a person who invited  agent.
 * @property {String} invitedUser userId of a person who got invitation.
 * @property {String} applicationId applicationId of  a person who invited  agent.
 * */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("team_invitation", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
      },
      status: {
        type: DataTypes.INTEGER,
      },
      invitedBy: {
        type: DataTypes.STRING(44),
        field: 'invited_by'
      },
      invitedUser:{
        type: DataTypes.STRING(50),
        field: 'invited_user'
      },
      roleType :{
        type :DataTypes.INTEGER,
        field: 'role_type'
      },
      applicationId:{
          type: DataTypes.STRING(150),
          field: 'application_id'

      }
    }, {
        underscored: true,
        paranoid: true,
        setterMethods: {},
        getterMethods: {}
    
        });
  }