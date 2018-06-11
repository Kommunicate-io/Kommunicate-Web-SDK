const getEnvId= function() {
    return process.env.NODE_ENV || "default";
  };

const configPath = "./config-"+getEnvId()+".json"

const config = require(configPath);

module.exports =  config;
module.exports.getEnvId = getEnvId;

module.exports.getProperties = function() {
    
    return config;
  };
  module.exports.getCommonProperties = function() {
    return config["commonProperties"];
  };

//  console.log("property :",config);