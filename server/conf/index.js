const getEnvId= function() {
    return process.env.NODE_ENV || "default";
  };

const configPath = "./config-"+getEnvId()+".json"

module.exports = require(configPath);


  
