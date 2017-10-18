const fs = require("fs");
exports.readFile = (path,encoding)=>{
    return new Promise(function(resolve,reject){
        console.debug("reading file from path: ",path,"encoding: ",encoding);
        fs.readFile(path, 'utf8', function (err,data) {
            if (err) {
                return reject(err);
            }else{
                return resolve(data);
            };
        });
    });
}