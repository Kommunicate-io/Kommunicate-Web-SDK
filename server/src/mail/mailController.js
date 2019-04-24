const mailService = require('../utils/mailService');
const config = require("../../conf/config");
const path = require("path");
const userService = require("../users/userService");
const logger = require('../utils/logger');
const kommunicateLogoUrl = config.getProperties().urls.hostUrl + "/img/logo1.png";
const kmWebsiteLogoUrl = config.getProperties().urls.kmWebsiteUrl + "/assets/resources/images/km-logo-new.png";
let joinKommunicateUrl = config.getProperties().urls.dashboardHostUrl + "/signup?invite=true&token=:token&referer=:referer&product=kommunicate"
let joinApplozicUrl = config.getProperties().urls.applozicDashboardHostUrl + "/signup?invite=true&token=:token&referer=:referer&product=applozic"

exports.sendMail = (req, res) => {
    console.log("received request to send mail", req.body.to);
    if (!req.body.text && !req.body.html && !req.body.templateName) {
        res.status(400).json({ code: "BAD_REQUEST", message: "please provide text or html or templateName" });
    }
    let options = req.body;
    return sendEmail(options).then(response => {
        return res.status(200).json({ code: "SUCCESS", "message": "mail sent successfully to user " + req.body.to });
    }).catch(err => {
        console.log("error while sending Email", err);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", "message": "something went wrong" });
    });
}

exports.sendInvitationMail = (req, res) => {
    if (!req.body.text && !req.body.html && !req.body.templateName) {
        res.status(400).json({ code: "BAD_REQUEST", message: "please provide text or html or templateName" });
    }
    var options = req.body;
    var userName = req.body.agentId;
    var roleType = req.body.roleType;
    return userService.isDeletedUser(options.to[0], options.applicationId).then(isDeleted => {
        console.log("user is deleted: ", isDeleted)
        if (isDeleted) {
            userService.activateOrDeactivateUser(options.to[0], options.applicationId, false);
        }
        return isDeleted;
    }).then(isDeleted => {
        if (isDeleted) {
            return res.status(200).json({ "code": "USER_ALREADY_EXIST", "message": "activated existing user" });
        }
      return Promise.resolve(userService.inviteTeam(options)).then(data => {
            logger.info("Updated UserList", data);
            return data;
        }).then(data => {
            let options = req.body;
            for (var i = 0; i < data.length; i++) {
                options.token = data[i].id;
                sendEmail(options);
            }
            return res.status(200).json({ code: "SUCCESS", "message": "mail sent successfully to user " });
        });
    }).catch(err => {
        console.log("error while sending Email", err);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", "message": "something went wrong" });
    });
}

const sendEmail = (options) => {
    return Promise.resolve(
        options.templateName === 'INVITE_TEAM_MAIL' ? userService.getByUserNameAndAppId(options.agentId, options.applicationId) : '').then(agent => {
            options = getEmailFormat(options, agent);
            return mailService.sendMail(options);
        }).catch(err => {
            console.log(err);
            throw err;
        });
}

const getEmailFormat = (options, custInfo) => {
    try {
        if (typeof options.product === "undefined" || options.product == null) {
            options.product = "kommunicate";
        } 
        let html = options.html;
        let templateReplacement = {};
        let productName = options.product == "applozic" ? "Applozic":"Kommunicate";
        if (!html) {
            switch (options.templateName) {
                case "INSTALLATION_INSTRUCTIONS":
                    let installationInstruction = (options.product == "applozic" ? config.getProperties().urls.applozicDashboardHostUrl : config.getProperties().urls.dashboardHostUrl) + "/installation?product=" + options.product + "&applicationId=" + options.applicationId + "&agentId=" + options.agentId + "&agentName=" + options.agentName;
                    options.templatePath = path.join(__dirname, "/" + options.product + "-emailInstructionTemplate.html");
                    templateReplacement[":kommunicateLogoUrl"] = kommunicateLogoUrl;
                    templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl;
                    templateReplacement[":adminName"] = options.from;
                    templateReplacement[":kommunicateScript"] = options.kommunicateScript;
                    templateReplacement[":installationInstructions"] = installationInstruction;
                    options.cc = [options.product == "applozic" ? "support@applozic.com": "support@kommunicate.io"];
                    options.templateReplacement = templateReplacement;
                    options.subject = "Let's start with " + productName + "!";
                    break;

                case "INVITE_TEAM_MAIL":
                    var dashboardUrl = options.product == "applozic" ? joinApplozicUrl:joinKommunicateUrl
                    options.templatePath  = path.join(__dirname, "/" + options.product + "-inviteTeamTemplate.html"),
                        templateReplacement[":adminName"] = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? options.agentName + " from " + custInfo.companyName : options.agentName,
                        templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl,
                        templateReplacement[":joinKommunicateUrl"] = dashboardUrl.replace(":token", options.token).replace(":referer", options.agentId),
                        templateReplacement[":ORGANIZATION"] = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? "from " + custInfo.companyName : "";
                    options.templateReplacement = templateReplacement;
                    options.subject = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? "Join " + custInfo.companyName + " on " + productName : "Invitation to Join " + productName;
                    options.bcc = options.product == "applozic" ? "support@applozic.com": "support@kommunicate.io";
                    break;

                case "BOT_USE_CASE_EMAIL":
                    logger.info("BOT_USE_CASE_EMAIL");
                    options.templatePath  = path.join(__dirname, "/botUseCaseTemplate.html");
                    options.templateReplacement = { 
                        ":PRODUCT_NAME": productName,
                        ":USER_NAME": options.userName, ":BOT_USE_CASE": options.botUseCase };
                    options.to = [...options.to];
                    options.cc = [...options.cc, options.product == "applozic" ? "support@applozic.com": "support@kommunicate.io"];
                    options.bcc = "techdisrupt@applozic.com";
                    break;
                
                case "CUSTOM_REPORTS_REQUIREMENT":
                    logger.info("CUSTOM_REPORTS_REQUIREMENT");
                    options.templatePath  = path.join(__dirname, "/customReportRequirementTemplate.html");
                    options.templateReplacement = { 
                        ":PRODUCT_NAME": productName,
                        ":USER_NAME": options.userName, ":CUSTOM_REPORT_REQUIREMENT_DESCRIPTION": options.customReportsDescription,
                        ":CUSTOM_REPORT_REQUIREMENT_DURATION": options.customReportsDuration };
                    options.to = [...options.to];
                    options.cc = [...options.cc, options.product == "applozic" ? "support@applozic.com": "support@kommunicate.io"];
                    options.bcc = "techdisrupt@applozic.com";
                    break;

                case "APPLOZIC_SUPPORT_QUERY":
                    logger.info("APPLOZIC_SUPPORT_QUERY");
                    options.templatePath  = path.join(__dirname, "/applozicSupportQueryTemplate.html");
                    options.templateReplacement = {  
                    ":QUERY_PLATFORM": options.queryPlatform,
                    ":QUERY_SDK":options.querySdk,":QUERY_APP_KEY":options.appKey,
                    ":QUERY_DESC":options.desc,":QUERY_ATTACHMENTS":options.attach,
                    ":QUERY_ISSUE":options.issue,
                    ":CUSTOM_REPORT_REQUIREMENT_DURATION": options.customReportsDuration };
                    options.to = [...options.to];
                    options.cc = [...options.cc, "support@applozic.com"]
                    break;

                case "CUSTOM_DOMAIN_SETUP_INSTRUCTION":
                    logger.info("CUSTOM_DOMAIN_SETUP_INSTRUCTION");
                    options.templatePath  = path.join(__dirname, "/customDomainSetupTemplate.html");
                    options.templateReplacement = {  
                        ":ADMIN_NAME": custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? options.agentName + " from " + custInfo.companyName : options.agentName
                    };
                    options.to = [...options.to];
                    options.cc = ["support@kommunicate.io"];
                    options.subject = options.agentName + " has invited you to set up Helpcenter for your company";
                    break;
            }
        }
        if (!options.templatePath ) {
            res.status(400).json({ code: "BAD_REQUEST", message: "Invalid template" });
            return;
        }
        return options;
    } catch (err) {
        throw { code: "INTERNAL_SERVER_ERROR", "message": "something went wrong", err };
    };
}