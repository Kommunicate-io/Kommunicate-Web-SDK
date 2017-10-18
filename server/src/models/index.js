const Sequelize= require("sequelize");
const config = require("../../conf/config.js");
const path = require("path");
var sequelize = new Sequelize(config.getProperties().db.url,config.getProperties().db.options);

sequelize.authenticate().then(function() {
 console.log("Connected with db");
}).catch(function(err){
  console.log("error while connecting to db");
})
var db = {};

const models = ['user','customer','BusinessHour','PasswordResetRequest', 'AutoSuggest'];
models.forEach(function(model) {
db[model]= sequelize.import(path.join(__dirname, model));
});
//dont use foreign keys
//db.OffBusinessHoursConfig.belongsTo(db.BusinessHour,{constraints:false});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
