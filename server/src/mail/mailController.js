
const mailService = require('../utils/mailService');
const config = require("../../conf/config");
const path = require("path");
const registrationService = require('../register/registrationService')

const kommunicateLogoUrl = config.getProperties().urls.hostUrl+"/img/logo1.png";
const kmWebsiteLogoUrl = config.getProperties().urls.kmWebsiteUrl+"/assets/resources/images/km-logo-new.png";
let joinKommunicateUrl = config.getProperties().urls.dashboardHostUrl+"/signup?invite=true&applicationId=:applicationId"
/*exports.sendMail =(req,res)=>{
    console.log("received request to send mail", req.body.to);
    if(!req.body.text && !req.body.html && !req.body.templateName){
        res.status(400).json({code:"BAD_REQUEST",message:"please provide text or html or templateName"});
    }
    let options = req.body;
    try{
        let html =options.html;
        let templatePath = "";
        let templateReplacement={};
        if(!html){
            switch(options.templateName){
                case "SEND_KOMMUNICATE_SCRIPT":
                let installationInstruction = config.getProperties().urls.dashboardHostUrl+"/installation?applicationId="+req.body.applicationId+"&agentId="+options.adminId+"&agentName="+options.adminName;
                templatePath = path.join(__dirname,"/emailInstructionTemplate.html");
                templateReplacement[":kommunicateLogoUrl"] = kommunicateLogoUrl;
                templateReplacement[":adminName"] =options.from;
                templateReplacement[":kommunicateScript"] =options.kommunicateScript;
                templateReplacement[":installationInstructions"]=installationInstruction;
                options.templatePath = templatePath;
                options.cc = ["support@kommunicate.io"],
                options.templateReplacement = templateReplacement;
                options.subject = "Lets start with Kommunicate! ";
                break;

                case "INVITE_TEAM_MAIL":
                templatePath = path.join(__dirname,"/inviteTeamTemplate.html");
                
                templateReplacement[":adminName"] =options.adminName;
                templateReplacement[":joinKommunicateUrl"] =joinKommunicateUrl.replace(":applicationId",options.applicationId);
                options.templatePath = templatePath;
                options.templateReplacement = templateReplacement;
                options.subject = "Invitation to Join Kommunicate ";
                options.bcc = "hello@kommunicate.io";
                break;

            }
        }
        if(!templatePath){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid template"});
            return;
        }
    }catch(err){
        throw {code:"INTERNAL_SERVER_ERROR","message": "something went wrong"};
    };
    
    return mailService.sendMail(options).then(response=>{
        res.status(200).json({code:"SUCCESS","message": "mail sent successfully to user "+req.body.to});
    }).catch(err=>{
        console.log("error while sending Email", err);
        res.status(500).json({code:"INTERNAL_SERVER_ERROR","message": "something went wrong"});
    });
}*/
exports.sendMail =(req,res)=>{
    console.log("received request to send mail", req.body.to);
    if(!req.body.text && !req.body.html && !req.body.templateName){
        res.status(400).json({code:"BAD_REQUEST",message:"please provide text or html or templateName"});
    }
    let options = req.body;
    return Promise.resolve(
        options.templateName==='INVITE_TEAM_MAIL'? registrationService.getCustomerByUserName(options.adminId):'').then(customer=>{
            options=getEmailFormat(options, customer);
        return mailService.sendMail(options).then(response=>{
            res.status(200).json({code:"SUCCESS","message": "mail sent successfully to user "+req.body.to});
        })
    }).catch(err=>{
        console.log("error while sending Email", err);
        res.status(500).json({code:"INTERNAL_SERVER_ERROR","message": "something went wrong"});
    });

}

const getEmailFormat=(options,custInfo)=>{
    try{
        let html =options.html;
        let templatePath = "";
        let templateReplacement={};
        if(!html){
            switch(options.templateName){
                case "SEND_KOMMUNICATE_SCRIPT":
                let installationInstruction = config.getProperties().urls.dashboardHostUrl+"/installation?applicationId="+options.applicationId+"&agentId="+options.adminId+"&agentName="+options.adminName;
                templatePath = path.join(__dirname,"/emailInstructionTemplate.html");
                templateReplacement[":kommunicateLogoUrl"] = kommunicateLogoUrl;
                templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl;
                templateReplacement[":adminName"] =options.from;
                templateReplacement[":kommunicateScript"] =options.kommunicateScript;
                templateReplacement[":installationInstructions"]=installationInstruction;
                options.templatePath = templatePath;
                options.cc = ["support@kommunicate.io"],
                options.templateReplacement = templateReplacement;
                options.subject = "Lets start with Kommunicate! ";
                break;

                case "INVITE_TEAM_MAIL":
                templatePath = path.join(__dirname,"/inviteTeamTemplate.html"),
                templateReplacement[":adminName"] = custInfo.companyName&&custInfo.companyName!=='' && null!==custInfo.companyName?options.adminName+" from "+custInfo.companyName:options.adminName,
                templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl,
                templateReplacement[":joinKommunicateUrl"] =joinKommunicateUrl.replace(":applicationId",options.applicationId),
                options.templatePath = templatePath,
                options.templateReplacement = templateReplacement;
                options.subject =  custInfo.companyName && custInfo.companyName!=='' && null!==custInfo.companyName?"Join "+custInfo.companyName+" on Kommunicate": "Invitation to Join Kommunicate ";
                options.bcc = "hello@kommunicate.io";
                break;

            }
        }
        if(!templatePath){
            res.status(400).json({code:"BAD_REQUEST",message:"Invalid template"});
            return;
        }
        return options;
    }catch(err){
        throw {code:"INTERNAL_SERVER_ERROR","message": "something went wrong",err};
    };
}