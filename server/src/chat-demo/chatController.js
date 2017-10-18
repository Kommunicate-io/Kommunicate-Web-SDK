const path = require('path');
exports.visitorChat= (req,res)=>{

    res.sendFile(path.join(__dirname,'./chat.html'));
}