
var config ={
  prod:{
      hostUrl:"smtp.gmail.com",
      port:587,
      auth:{
      //userName:"support@applozic.com",
      //password:"knowledge1234"
      userName : "support@kommunicate.io",
      password:"knowledge123"
    }
  },
  test:{

    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
    //userName:"support@applozic.com",
    //password:"knowledge1234"
    userName : "support@kommunicate.io",
    password:"knowledge123"
  }
  },
  default:{
    hostUrl:"smtp.gmail.com",
    port:587,
    auth:{
    //userName:"support@applozic.com",
    //password:"knowledge1234"
    userName : "support@kommunicate.io",
    password:"knowledge123"
  }
  },
  dashboard:{

      hostUrl:"smtp.gmail.com",
      port:587,
      auth:{
      //userName:"support@applozic.com",
      //password:"knowledge1234"
      userName : "support@kommunicate.io",
      password:"knowledge123"
    }
  }
}
exports.getProperties = function(){
  var envId = getEnvId()?getEnvId():"default";
  return config[envId];
}
var getEnvId= function(){
  return process.env.NODE_ENV;
}
