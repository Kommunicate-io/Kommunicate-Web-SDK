const cronTimeModel = require("../models").cronTime;
const db = require("../models");
const Op = db.Sequelize.Op;

exports.getTimeStamp = (req, res) => {
  const key = req.params.cronKey;
  console.log("request received to fetch Time Stamp for cron " + key);
  console.log("Key recieved : ", key);
  cronTimeModel.findOrCreate({ where: { cron_key: key }} ).then((user) => {
    user = user[0];
    console.log("found data for cron : ", + key);
    res.status(200).json({"status": "Success", "cron_key": user["cron_key"], "update_time": user["update_time"]});
    console.log("empty cron created");
    // console.log(user);
  }).catch(err => {
    console.log('error while getting time stamp for cron ' + key, err);
    res.status(400).json({"status": "Failure","message": "Invalid parameters"});
    throw err;
  });
}



exports.updateTimeStamp = (req, res) => {
  const message = req.body;
  console.log("request received to update Time Stamp");
  key = message["cronKey"];
  timeStamp = message["timeStamp"];

  //Checking whether cron_key exist or not
  cronTimeModel.findOne({ where: { cron_key: key } }).then((user) => {
    if (user == null){
      cronTimeModel.create({'cron_key':key, 'update_time':null})
      console.log("Cron with null timestamp created");
    }
    cronTimeModel.update({'update_time': timeStamp}, {where: {'cron_key': key}}).then((result) => {
      console.log("data updated for cron : ", key);
      res.status(200).json({"status": "Success","message": "Database Updated"});
    });
  }).catch(err => {
    console.log('error while updating time stamp for cron ' + key, err);
    res.status(400).json({"status": "Failure","message": "Invalid parameters"});
  });
}
