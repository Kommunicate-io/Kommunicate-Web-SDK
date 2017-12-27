const inAppEventService = require('./InAppEventService');

exports.getAllInAppEvents=(req, res)=>{
    return Promise.resolve(inAppEventService.getInAppEvents()).then(result=>{
        return res.status(200).json({code:'success', data:result});
    }).catch(err=>{
        return res.status(500).json({code:'INTERNAL_SERVER_ERROR', message:'something went wrong'});
    })
}