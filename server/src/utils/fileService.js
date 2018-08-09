const fs = require("fs");
exports.readFile = (path,encoding)=>{
    return new Promise(function(resolve,reject){
        console.log("reading file from path: ",path,"encoding: ",encoding);
        fs.readFile(path, 'utf8', function (err,data) {
            if (err) {
                return reject(err);
            }else{
                return resolve(data);
            };
        });
    });
}

exports.deleteFile = (path) => {
    return new Promise(function (resolve, reject) {
        console.log("deleting file from path: ", path);
        fs.unlink(path, function (err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            };
        });
    });
}
