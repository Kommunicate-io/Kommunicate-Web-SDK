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

const models = ['user', 'customer', 'BusinessHour', 'PasswordResetRequest', 'AutoSuggest', "InAppMsg", "IssueType", "IssueTypeAutoReply", 'InAppEvent', 'ThirdPartyIntegrationSettings', "AppSetting", "application","cronLastRun","AppSubscription"];
models.forEach(function (model) {
  db[model] = sequelize.import(path.join(__dirname, model));
});

db['customer'].hasMany(db['application'], { targetKey: 'customerId' });
db['application'].belongsTo(db['customer'], { sourceKey: 'customerId' });
//dont use foreign keys
//db.OffBusinessHoursConfig.belongsTo(db.BusinessHour,{constraints:false});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
