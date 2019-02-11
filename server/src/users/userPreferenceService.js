const stringUtils = require("underscore.string");
const logger = require('../utils/logger');
const UserPreferencesModel = require("../models").UserPreferences;
const PreferenceModel = require("../models").Preference;
const userService =  require("./userService");
const {ERROR} = require('../Error/error');
UserPreferencesModel.belongsTo(PreferenceModel, {onDelete: 'cascade', hooks:true}, {foreignKey:"preference_id"} );
/**
 * This Function is to add user's preference.
 * @param {applicationId : string, userName : string, preference : string, value : string} data
 */
const createUserPreference = data => {
  logger.info("request received to create : ", data, typeof(data));
  return Promise.resolve(preferenceId(data["preference"])).then(prefId => {
    return Promise.resolve(userService.getByUserNameAndAppId(data.userName, data.applicationId)).then(user =>{
      if(!user) throw ERROR.USER_NOT_FOUND;
      let criteria = {
        userId : user.id,
        preferenceId : prefId
      }
      let preferenceData = {
        userId : user.id,
        preferenceId : prefId,
        value : data["value"]
      };
      return Promise.resolve(UserPreferencesModel.findOne({where:criteria, paranoid:false})).then(foundData => {
        if(foundData == null){
          logger.info("processing", preferenceData);
          return Promise.resolve(UserPreferencesModel.create(preferenceData)).then(data => {
            logger.info("Inserted data in db");
            return;
          })
        }
        else{
          logger.info("Updating soft deleted data : ", preferenceData);
          preferenceData["deleted_at"] = null;
          return Promise.resolve(UserPreferencesModel.update(preferenceData, {where:criteria, paranoid:false})).then(data => {
            logger.info("Updated deleted data in db");
            return;
          })
        }
      })
    })
  }).catch(err => {
    logger.info('error while creating preference data : ', data);
    throw err;
  });
};

/**
 * This Function is to delete user's preference.
 * @param {applicationId : string, userName : string, preference : string} application 
 */
const deleteUserPreference = data => {
  logger.info("request received to delete : ", data);
  return Promise.resolve(preferenceId(data["preference"])).then(prefId => {
    return Promise.resolve(userService.getByUserNameAndAppId(data.userName, data.applicationId)).then(user =>{
      let userPreferences = {
        userId : user.id,
        preferenceId : prefId
      };
      UserPreferencesModel.destroy({where : userPreferences}).then(data => {
        logger.info("Deleted data in db : ", userPreferences);
        logger.info(data);
      })
    })
  }).catch(err => {
    logger.info('error while deleting preference data : ' + userPreferences, err);
    throw err;
  });
};

/**
 * This Function is to update user's preference.
 * @param {applicationId : string, userName : string, preference : string, value : string} data 
 */
const updateUserPreference = data => {
  logger.info("request received to update : ", data);
  return Promise.resolve(preferenceId(data["preference"])).then(prefId => {
    return Promise.resolve(userService.getByUserNameAndAppId(data.userName, data.applicationId)).then(user =>{
      let userPreferences = {
        userId : user.id,
        preferenceId : prefId,
        value : data["value"]
      };
      let criteria = {
        userId : user.id,
        preferenceId : prefId
      }
      return UserPreferencesModel.findOne({where:criteria, paranoid:false}).then(data => {
        if(data == null){
          UserPreferencesModel.create(userPreferences);
        }
        else{
          userPreferences["deleted_at"] = null;
          UserPreferencesModel.update(userPreferences, {where:criteria, paranoid:false});
        }  
      })
    })
  }).catch(err => {
    logger.info('error while deleting preference data : ' + userPreferences, err);
    throw err;
  });
};

/**
 * This Function is to get user's preference.
 * @param {applicationId : string, userName : string} data 
 * @returns {applicationId : string, userName : string, preference : { name : value } }
 */
const getUserPreference = data => {
  logger.info("request received to get preference : ", data);
  return Promise.resolve(userService.getByUserNameAndAppId(data.userName, data.applicationId)).then(user =>{
    let criteria = {
      userId : user.id,
    }
    logger.info("user id received : ", user.id);
    return Promise.resolve(UserPreferencesModel.findAll({include:[{model:PreferenceModel}], where:criteria})).then(userPreferenceData => {
      preferences = {};
      for(var i=0; i<userPreferenceData.length; i++){
        preferences[userPreferenceData[i].preference.name] = userPreferenceData[i].value;
      }
      userPreference = {
        applicationid : data.applicationId,
        userName : data.userName,
        preferences : preferences
      };
      logger.info(userPreference);
      return userPreference;
    })
  }).catch(err => {
    logger.info('error while retrieving preference data : ' + criteria, err);
    throw err;
  });
};


/**
 * This Function is to find/create and return preferenceId of preference.
 * @param {string} preference 
 * @returns {number} id of preference
 */
const preferenceId = preference =>{
  logger.info("Request received at preferenceId for preference : ", preference)
  let criteria = {name:preference};
  logger.info("criteria : ", criteria);
  return PreferenceModel.findOrCreate({where:criteria}).spread(function(item, created){
    let prefId = item.get({plain:true})["id"];
    logger.info("preference id found : ", prefId);
    return prefId;
  }).catch(err => {
    logger.info('error while getting preference id for preference:' + preference, err);
    throw err;
  });
};


module.exports = {
  createUserPreference : createUserPreference,
  deleteUserPreference : deleteUserPreference,
  updateUserPreference : updateUserPreference,
  getUserPreference : getUserPreference
}