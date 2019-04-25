const Sequelize = require("sequelize");
const config = require("../../conf/config.js");
const Op = Sequelize.Op;
let options = config.getProperties().db.options;
options.operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};
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
  require('./Onboarding'),
  require('./UserAuthentication')
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