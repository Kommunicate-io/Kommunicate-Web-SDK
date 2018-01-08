const logger = require("../utils/logger");
const  axios =require("axios"); 
var request = require("request");
exports. addContact = (options) => {
    return new Promise(function(resolve,reject){
        var options = {
            method : 'POST',
            url:'https://applozic.api-us1.com/admin/api.php?api_action=contact_add',
            headers:{'content-type': 'application/x-www-form-urlencoded'},
            form:{
                api_action:'contact_add',
                api_key :'79c8255584cf52a2e8c91f9ef92b7afdbde9c4cd97288797e300659032e14aa3247a638e',
                api_output:'json',
                email :options.email,
                'p[1]':'7',
                'status[1]':'1'
    
            }
        };
        request(options, function (error, response) {
            //if (error) throw new Error(error);
            //response.send(body);
            if (error) {
                console.log("error ",error);
                return reject(error);
            }else{
                console.log("response received",response);
                return resolve(response);
            };
          });
    });
    
}


 