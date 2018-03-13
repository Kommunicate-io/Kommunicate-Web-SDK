const integrationSettingService = require('./integrationSettingService');
const registrationService= require('../register/registrationService'); 


exports.updateOrCreate = (req, res)=>{
    let appId=req.params.appId;
    let settings = req.body;
    let type = req.params.type;
    return Promise.resolve(registrationService.getCustomerByApplicationId(appId)).then(customer=>{
        if(!customer){
            res.status(200).json({code:"SUCCESS", message:"no user found"})
        }
        settings.customerId=customer.id;
        settings.type=type;
        return integrationSettingService.updateOrCreate({customerId:customer.id,type:type}, settings).then( response=>{
            console.log('response of creating settings', response);
            res.status(200).json({code:"SUCCESS", message:response})
        });

    }).catch(err=>{
        console.log('error while inserting thirdparty setting', err)
        res.status(500).json({code:"ERROR", message:"creation error"});
    })

}


