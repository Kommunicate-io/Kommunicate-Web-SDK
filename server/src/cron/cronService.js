const cronLastRunTimeModel = require("../models").cronTimeStamp;

exports.getLastRunTime = (req, res) => {
  key = req.params.cronKey;
  console.log("request received to fetch Time Stamp for cron " + key);
  cronLastRunTimeModel.findOrCreate({ where: { cron_key: key }} ).then((user) => {
    console.log(user);
    user = user[0];
    console.log("found data for cron : ", + key);
    // To convert datetime to timestamp
    lastRun = '0';
    if(user["last_run_time"] != null){
      lastRun = new Date(user["last_run_time"]).getTime();
      lastRun = lastRun.toString();
    }
    res.status(200).json({"status": "Success", "cronKey": user["cron_key"], "lastRunTime": lastRun});
    
    
  }).catch(err => {
    console.log('error while getting time stamp for cron ' + key, err);
    res.status(400).json({"status": "Failure","message": "Invalid parameters"});
    throw err;
  });
}



exports.updateLastRunTime = (req, res) => {
  const message = req.body;
  key = message["cronKey"];
  console.log("request received to update Time Stamp for cron_key : ", key);
  console.log("Timestamp in req : ",message["timeStamp"]);

  lastRun = new Date(parseInt(message["timeStamp"])).toISOString();
  console.log("Time Stamp is :", lastRun);

  //Checking whether cron_key exist or not
  cronLastRunTimeModel.findOne({ where: { 'cron_key': key } }).then((user) => {
    if (user == null){
      cronLastRunTimeModel.create({'cron_key':key, 'last_run_time':lastRun})
      console.log("New Cron Created with cron_key : ", key);
    }
    else{
      cronLastRunTimeModel.update({'last_run_time': lastRun}, {where: {'cron_key': key}}).then((result) => {
      console.log("Data updated for cron : ", key);
      });
    }
    res.status(200).json({"status": "Success","message": "Database Updated"});
    console.log('Success in update : ', key);
  }).catch(err => {
    console.log('error while updating time stamp for cron ' + key, err);
    res.status(400).json({"status": "Failure","message": "Invalid parameters"});
  });
}
