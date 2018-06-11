/**
 * This file is deprecated in favour of index.js. use  index.js instead of this.
 * created for backward compatibility
 * 
 */
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

//  This file is deprecated in favour of index.js. don't add new methods here..
// use  index.js instead of this.
//created for backward compatibility.