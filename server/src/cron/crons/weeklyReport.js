const applicationService = require('../../customer/applicationService');
const userService = require('../../users/userService');
const customerService = require('../../customer/customerService');
const applozicClient = require('../../utils/applozicClient');
const mailService = require('../../utils/mailService');
const path = require('path');
const dateformat = require('dateformat');
const config = require('../../../conf/config');
const dashboardUrl = config.getProperties().urls.dashboardHostUrl;
const kmWebsiteLogoIconUrl = config.getCommonProperties().companyDetail.companyLogo;
const weeklyReportIcon = "https://s3.amazonaws.com/kommunicate.io/weekly-report-icon.png";
const subscription = require('../../utils/utils').SUBSCRIPTION_PLAN;
const moment = require('moment-timezone');
const userPreferenceService = require('../../users/userPreferenceService');
var fs = require('fs');
var util = require('util');
var filePath = path.join(__dirname, "../../../logs/debug.log");
var logFile = fs.createWriteStream(filePath, {flags : 'a'});
console.report = function(d) { 
    logFile.write(util.format(d) + '\n');
};
const sendCronCompletionReport=()=>{
    try {
        mailService.sendMail({            
            to: "anand@applozic.com",
            from: "Devashish From Kommunicate <support@kommunicate.io>",
            subject: "Weekly cron processed",
            templatePath: filePath,
            sendAsText:true
        }).then(result=>{
                fs.writeFile(filePath," ", function(err) {
                    if (err) console.log("err: ", err);
                })
            })
    } catch (error) {
       console.log("report sending error: ", err) 
    }
}

exports.sendWeeklyReportsToCustomer = () => {
    console.report(`sendWeeklyReportsToCustomer cron started at: ${new Date()}`);
    getApplicationRecursively();
}


const getApplicationRecursively = (criteria) => {
    if (typeof criteria == "undefined") {
        var order = [['id', 'ASC']];
        criteria = { where: { id: { $gt: 0 } }, order, limit: 5 }
    }
    return applicationService.getAllApplications(criteria).then(applications => {
        if (applications.length < 1) {
            console.report(`sendWeeklyReportsToCustomer : all application processed ${new Date()}`)
            sendCronCompletionReport();
            return;
        }
        let apps = applications.map((app, index) => {
            return processOneApp(app);
        })
        return Promise.all(apps).then(result => {
            let lastApp = applications[applications.length - 1]
            criteria.where = { id: { $gt: lastApp.id } }
            return getApplicationRecursively(criteria).catch(err => {
                console.log("error in weekly report cron")
            });
        })
    })
}


const processOneApp = (app) => {
    return userService.getUsersByAppIdAndTypes(app.applicationId).then(users => {
        let adminAgent = users.filter(user => {
            return user.type == 3
        });
        if (adminAgent.length < 1) {
            console.log("admin not found for app: ", app.applicationId)
            return "No admin";
        }
        if (!adminAgent[0].emailSubscription) {
            console.log("unsubscribed for user: ", adminAgent[0].userName)
            return;
        }
        return customerService.getCustomerByApplicationId(app.applicationId).then(customer => {
            if (!customer.email) return "customer email is empty";
            let headers = { "Apz-Token": "Basic " + new Buffer(adminAgent[0].userName + ":" + adminAgent[0].accessToken).toString('base64'), "Apz-AppId": adminAgent[0].applicationId, "Content-Type": "application/json", "Apz-Product-App": true };
            return userPreferenceService.getUserPreference({applicationId:adminAgent[0].applicationId, userName:adminAgent[0].userName}).then(userPreferences => {
                let timeZone = userPreferences.preferences.timeZone;
                let fromDate = new Date();
                let toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() - 7);
                fromDate = moment.tz(fromDate, timeZone);
                toDate = moment.tz(toDate, timeZone);

                let dates = {
                    from: fromDate,
                    to: toDate,
                    timeZone: timeZone
                };
                
                let params = { "applicationId": adminAgent[0].applicationId, "days": 7, "groupBy": "assignee_key",
                                "startTimestamp": fromDate.format('x'), "endTimestamp": toDate.format('x')}
                return applozicClient.getConversationStats(params, headers).then(stats => {
                    if (!stats) {
                        return "no stats for this app"
                    }
                    return generateReport(stats, users, dates).then(report => {
                        report.growthPlanTemplate = (report.overAllReport.newConversationCount >= 25 && customer.subscription == subscription.initialPlan) ? "block" : "none";
                        return sendWeeklyReport(report, customer, app.applicationId);
                    })
                })
            })
        });
    }).catch(err => {
        console.log("err :", err)
        return;
    });
}

/**
 * 
 * @param {Object} stats 
 * @param {Array} users 
 * @param {from: date, to: date, timeZone: string} dates
 */
const generateReport = (stats, users, dates) => {
    let individualReportArray = [];
    let overAllReport = { "newConversationCount": 0, "closedCount": 0, "avgResolutionTime": 0, "avgResponseTime": 0, "startTime": dates.from, "endTime": dates.to , "timeZone": dates.timeZone}
    return new Promise((resolve, reject) => {
        users.map((user) => {
            let report = {};
            report["userName"] = userService.getUserDisplayName(user);

            let newConversation = stats.newConversation.filter(data => {
                return user.userKey == data.assignee_key;
            })
            report["newConversationCount"] = newConversation.length > 0 ? newConversation[0].count : 0;
            overAllReport.newConversationCount += report.newConversationCount;

            let closedConv = stats.closedConversation.filter(data => {
                return user.userKey == data.assignee_key;
            })
            report["closedCount"] = closedConv.length > 0 ? closedConv[0].count : 0;
            overAllReport.closedCount += report.closedCount
            if (user.type != 2) {
                individualReportArray.push(report)
            }
        })
        stats.avgResponseTime && stats.avgResponseTime.map(data => {
            if (data.average) {
                overAllReport.avgResponseTime += data.average
            }
        })
        stats.avgResolutionTime && stats.avgResolutionTime.map(data => {
            if (data.average) {
                overAllReport.avgResolutionTime += data.average
            }
        })
        individualReportArray = individualReportArray.sort(compare).splice(0, 5)
        return resolve({ "overAllReport": overAllReport, "individualReports": individualReportArray });
    })
}

const generateTemplate = (report) => {
    let templatePath = path.join(__dirname, "../../mail/weeklyReportList.html");
    let templateArray = report.individualReports.map(agentReport => {
        return mailService.generateHTMLTemplate({ "templatePath": templatePath, "templateReplacement": agentReport });

    })
    return Promise.all(templateArray).then(templates => {
        let htmlTemplate = "";
        templates.map(template => {
            htmlTemplate += template;
        })
        return htmlTemplate;
    }).catch(err=>{
        console.log("Template generation error: ", err);
        return;
    })
}

const sendWeeklyReport = (report, customer, appId) => {
    let templatePath = '';
    let templateReplacement = '';
    let subject = '';
    let organization = customer.companyName !== undefined && customer.companyName != null ? customer.companyName : '';
    subject = "Kommunicate: Your weekly conversations report for " + dateformat(report.overAllReport.endTime, "longDate") + " - " + dateformat(report.overAllReport.startTime, "longDate");
    generateTemplate(report).then(templateList => {
        templatePath = path.join(__dirname, "../../mail/weeklyReport.html");
        let resolutionTime = convertSecondsToHour(report.overAllReport.avgResolutionTime);
        let responseTime = convertSecondsToHour(report.overAllReport.avgResponseTime)
        templateReplacement = {
            "REPORTLIST": templateList,
            "TOTALNEWCONVERSATIONSCOUNT": report.overAllReport.newConversationCount,
            "CLOSEDCONVERSATIONSCOUNT": report.overAllReport.closedCount,
            "ORGANIZATION": organization,
            "STARTDATE": dateformat(report.overAllReport.startTime, "longDate"),
            "ENDDATE": dateformat(report.overAllReport.endTime, "longDate"),
            "TIMEZONE":report.overAllReport.timeZone,
            "kmWebsiteLogoIconUrl": kmWebsiteLogoIconUrl,
            "dashboardUrl": dashboardUrl,
            "weeklyReportIcon": weeklyReportIcon,
            "BILLINGURL": dashboardUrl + "/settings/billing",
            "DISPLAYGROWTHPLAN": report.growthPlanTemplate,
            "UNSUBSCRIBEURL": dashboardUrl + "/unsubscribe?appId=" + appId + "&email=" + encodeURIComponent(customer.email)
        }
        Object.assign(templateReplacement, resolutionTime, { "RESPONSE_HOUR": responseTime.HOURS, "RESPONSE_MINUTE": responseTime.MINUTES, "RESPONSE_SECOND": responseTime.SECONDS });
        
        console.report(`sending weekly report mail to: ${customer.email} for app ${appId}`);
        let mailOptions = {
            to: customer.email,
            from: "Devashish From Kommunicate <support@kommunicate.io>",
            subject: subject,
            templatePath: templatePath,
            templateReplacement: templateReplacement
        }
        return mailService.sendMail(mailOptions);
    }).catch(error => {
        console.log("weekly report sending error: ", error);
        return;
    })
}

const convertSecondsToHour = (seconds) => {
    return {
        "HOURS": Math.floor(seconds / 3600),
        "MINUTES": Math.floor((seconds % 3600) / 60),
        "SECONDS": Math.floor(seconds % 60)
    };
}
const compare = (object1, object2) => {
    const count1 = object1.newConversationCount;
    const count2 = object2.newConversationCount;
    let comparison = 0;
    if (count1 > count2) {
        comparison = -1;
    } else if (count1 < count2) {
        comparison = 1;
    }
    return comparison;
}