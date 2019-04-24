
var config ={
  prod:{
      hostUrl:"smtp.gmail.com",
      port:587,
      auth:{
        applozic: {
          userName : "support@applozic.com",
          password:"knowledge1234"
        },
        kommunicate: {
          userName : "support@kommunicate.io",
          password:"knowledge123"
        }
      }
  },
  test:{
    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
      applozic: {
        userName : "support@applozic.com",
        password:"knowledge1234"
      },
      kommunicate: {
        userName : "support@kommunicate.io",
        password:"knowledge123"
      }
    }
  },
  default:{
    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
      applozic: {
        userName : "support@applozic.com",
        password:"knowledge1234"
      },
      kommunicate: {
        userName : "support@kommunicate.io",
        password:"knowledge123"
      }
    }
  },
  development:{
    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
      applozic: {
        userName : "support@applozic.com",
        password:"knowledge1234"
      },
      kommunicate: {
        userName : "support@kommunicate.io",
        password:"knowledge123"
      }
    }
  },
  dashboard:{
      hostUrl:"smtp.gmail.com",
      port:587,
      auth:{
        applozic: {
          userName : "support@applozic.com",
          password:"knowledge1234"
        },
        kommunicate: {
          userName : "support@kommunicate.io",
          password:"knowledge123"
        }
      }
  },
  staging:{
    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
      applozic: {
        userName : "support@applozic.com",
        password : "knowledge1234"
      },
      kommunicate: {
        userName : "support@kommunicate.io",
        password : "knowledge123"
      }
    }
  }
}
config["prod-ca"]= config.prod;
config["prod-mzadqatar"]= config.prod;
config["ep-prod"] = config.prod;
exports.getProperties = function(){
  var envId = process.env.NODE_ENV || "default";
  return config[envId];
}
var getEnvId= function(){
  return process.env.NODE_ENV;
}
