const config = require("../../conf/config");
const axios =require("axios");

exports.createBot = (bot)=>{
  //TODO: call applozic platform
  console.log("calling create bot API....",bot);
  var url = config.getProperties().urls.createBotUrl;
  return Promise.resolve(axios.post(url,bot)).then(response=>{
    console.log("received response from applozic", response.status);
    if(response.status==201){
        console.log("bot created successfully");
        return response.data;
    }else {
      console.log("err while calling bot platform",response.status);
      throw new Error("error from Bot plateform: "+response.status);
    }
}).catch(err=>{
  console.log("err while calling bot platform",err);
  throw new Error("error from Bot plateform: "+err.response.status);
})
}
