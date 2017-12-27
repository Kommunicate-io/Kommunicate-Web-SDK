const db = require('../models');


exports.getInAppEvents = () => {
    return Promise.resolve(db.InAppEvent.findAll()).then(result=>{
        return result
    }).catch(err=>{
        console.log('error',err)
    });
}