const Sequelize = require("sequelize");
const config = require("../../conf/config.js");
const path = require("path");
var winston = require('winston');
let options = config.getProperties().db.options;
var sequelize = new Sequelize(config.getProperties().db.url, config.getProperties().db.options);

sequelize.authenticate().then(function () {
  console.log("Connected with db");
}).catch(function (err) {
  console.log("error while connecting to db");
})
var db = {};

/**
 * db model include here
 */
const modules = [
  require('./user'),
  require('./customer'),
  require('./BusinessHour'),
  require('./PasswordResetRequest'),
  require('./AutoSuggest'),
  require('./InAppMsg'),
  require('./IssueType'),
  require('./IssueTypeAutoReply'),
  require('./InAppEvent'),
  require('./ThirdPartyIntegrationSettings'),
  require('./AppSetting'),
  require('./application'),
  require('./cronLastRun'),
  require('./AppSubscription'),
  require('./teammateInvite'),
  require('./UserPreferences'),
  require('./Preference'),
  require("./ChatPopupMessage"),
  require("./Feedback"),
  require('./Onboarding')
];

modules.forEach(function (module) {
  // db[model] = sequelize.import(path.join(__dirname, './'+model+".js"));
  db[module.name] = module(sequelize, Sequelize);
});

/**
 * mapping
 */
db.customer.hasMany(db.application, { targetKey: 'customerId' })
db.application.belongsTo(db.customer, { sourceKey: 'customerId' })

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;