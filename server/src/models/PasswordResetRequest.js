module.exports = (sequelize,DataTypes)=>{
  return sequelize.define('password_reset_request',{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userName: {
      type:DataTypes.STRING,
      allowNull: false,
      field: 'user_name'

   },
   applicationId:{
     type:DataTypes.STRING,
     allowNull: false,
     field: 'application_id'
   },
   authenticationCode:{
     type:DataTypes.STRING(36),
     allowNull: false,
     field: 'authentication_code',
     unique:true
   },
   status:{
     type:DataTypes.ENUM,
     values: ['PENDING','PROCESSED'],
   }
  },

  {
    underscored: true,
    paranoid: true
  });
}
