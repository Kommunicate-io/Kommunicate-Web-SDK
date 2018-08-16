const mailService = require('../utils/mailService');
const config = require("../../conf/config");
const path = require("path");
const registrationService = require('../register/registrationService');
const userService = require("../users/userService");
const logger = require('../utils/logger');
const kommunicateLogoUrl = config.getProperties().urls.hostUrl + "/img/logo1.png";
const kmWebsiteLogoUrl = config.getProperties().urls.kmWebsiteUrl + "/assets/resources/images/km-logo-new.png";
let joinKommunicateUrl = config.getProperties().urls.dashboardHostUrl + "/signup?invite=true&token=:token&referer=:referer"

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
        return userService.inviteTeam(options).then(data => {
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
            throw err;
        });
}

const getEmailFormat = (options, custInfo) => {
    try {
        let html = options.html;
        let templatePath = "";
        let templateReplacement = {};
        if (!html) {
            switch (options.templateName) {
                case "SEND_KOMMUNICATE_SCRIPT":
                    let installationInstruction = config.getProperties().urls.dashboardHostUrl + "/installation?applicationId=" + options.applicationId + "&agentId=" + options.agentId + "&agentName=" + options.agentName;
                    templatePath = path.join(__dirname, "/emailInstructionTemplate.html");
                    templateReplacement[":kommunicateLogoUrl"] = kommunicateLogoUrl;
                    templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl;
                    templateReplacement[":adminName"] = options.from;
                    templateReplacement[":kommunicateScript"] = options.kommunicateScript;
                    templateReplacement[":installationInstructions"] = installationInstruction;
                    options.templatePath = templatePath;
                    options.cc = ["support@kommunicate.io"],
                        options.templateReplacement = templateReplacement;
                    options.subject = "Lets start with Kommunicate! ";
                    break;

                case "INVITE_TEAM_MAIL":
                    templatePath = path.join(__dirname, "/inviteTeamTemplate.html"),
                        templateReplacement[":adminName"] = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? options.agentName + " from " + custInfo.companyName : options.agentName,
                        templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl,
                        templateReplacement[":joinKommunicateUrl"] = joinKommunicateUrl.replace(":token", options.token).replace(":referer", options.agentId),
                        templateReplacement[":ORGANIZATION"] = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? "from " + custInfo.companyName : "";
                    options.templatePath = templatePath,
                        options.templateReplacement = templateReplacement;
                    options.subject = custInfo.companyName && custInfo.companyName !== '' && null !== custInfo.companyName ? "Join " + custInfo.companyName + " on Kommunicate" : "Invitation to Join Kommunicate ";
                    options.bcc = "support@kommunicate.io";
                    break;

                case "BOT_USE_CASE_EMAIL":
                    logger.info("BOT_USE_CASE_EMAIL");
                    templatePath = path.join(__dirname, "/botUseCaseTemplate.html");
                    options.templatePath = path.join(__dirname, "/botUseCaseTemplate.html");
                    options.templateReplacement = { ":USER_NAME": options.userName, ":BOT_USE_CASE": options.botUseCase };
                    options.to = [...options.to];
                    options.cc = [...options.cc, "support@kommunicate.io"]
                    options.bcc = "techdisrupt@applozic.com";
                    break;

            }
        }
        if (!templatePath) {
            res.status(400).json({ code: "BAD_REQUEST", message: "Invalid template" });
            return;
        }
        return options;
    } catch (err) {
        throw { code: "INTERNAL_SERVER_ERROR", "message": "something went wrong", err };
    };
}