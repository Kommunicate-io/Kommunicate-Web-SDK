const getEnvId= function() {
    return process.env.NODE_ENV || "default";
  };

module.exports = require("./config-"+getEnvId()+".json");


  
