module.exports = (sequelize,DataTypes)=>{
  return sequelize.define('business_hours',{
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
   },day:{
     type:DataTypes.ENUM,
     values: ['SUNDAY', 'MONDAY', 'TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY'],
     field: 'day_local_tz'
   },
    openingDay : {
      type:DataTypes.ENUM,
      values: ['SUNDAY', 'MONDAY', 'TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY'],
      field: 'opening_day'
    },
    openTime: {
      type:DataTypes.TIME,
      allowNull: false,
      field: 'open_time'
    },
    closingDay : {
      type:DataTypes.ENUM,
      values: ['SUNDAY', 'MONDAY', 'TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY'],
      field: 'closing_day'
    },
    closeTime : {
      type:DataTypes.TIME,
      allowNull: false,
      field: 'close_time'
    },
    timezone:{
      type:DataTypes.STRING,
      field: 'timezone'
    },
  offHoursMessage:{
    type:DataTypes.STRING,
    field: 'off_hours_message'
  }
  },

  {
    underscored: true,
    paranoid: true
  });
}
