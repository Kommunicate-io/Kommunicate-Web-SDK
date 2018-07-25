const applicationService = require('../customer/applicationService');
const userService = require('../users/userService');
const customerService = require('../customer/customerService');
const applozicClient = require('../utils/applozicClient');
const mailService = require('../utils/mailService');
const path = require('path');
const dateformat = require('dateformat');
const config = require('../../conf/config');
const dashboardUrl = config.getProperties().urls.dashboardHostUrl;
const kmWebsiteLogoIconUrl = config.getCommonProperties().companyDetail.companyLogo;
const weeklyReportIcon = "https://s3.amazonaws.com/kommunicate.io/weekly-report-icon.png";


exports.sendWeeklyReportsToCustomer = () => {
    console.log("sendWeeklyReportsToCustomer cron started at: ", new Date());
    getApplicationRecursively();
}


const getApplicationRecursively = (criteria) => {
    if (typeof criteria == "undefined") {
        var order = [['id', 'ASC']];
        criteria = { where: { id: { $gt: 0 } }, order, limit: 5 }
    }
    return applicationService.getAllApplications(criteria).then(applications => {
        if (applications.length < 1) {
            console.log("sendWeeklyReportsToCustomer : all application processed")
            return;
        }
        let apps = applications.map((app, index) => {
            console.log("weekly report processing for application: ", app.applicationId);
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
        return customerService.getCustomerByApplicationId(app.applicationId).then(customer => {
            let adminAgent = users.filter(user => {
                return user.type == 3
            });
            if (adminAgent.length < 1) {
                return "No admin ";
            }
            let headers = { "Apz-Token": "Basic " + adminAgent[0].apzToken, "Apz-AppId": adminAgent[0].applicationId, "Content-Type": "application/json", "Apz-Product-App": true };
            let params = { "applicationId": adminAgent[0].applicationId, "days": 7, "groupBy": "assignee_key" }
            return applozicClient.getConversationStats(params, headers).then(stats => {
                if (!stats) {
                    return "no stats for this app"
                }
                return generateReport(stats, users).then(report => {
                    console.log("sending weekly report for application: ", app.applicationId);
                    return sendWelcomeMail(report, customer);
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
 */
const generateReport = (stats, users) => {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    let indivisualReportArray = [];
    let overAllReport = { "newConversationCount": 0, "closedCount": 0, "avgResolutionTime": 0, "startTime": new Date(), "endTime": date }
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

            let resolutionTime = stats.avgResolutionTime.filter(data => {
                return user.userKey == data.assignee_key;
            });
            report["avgResolutionTime"] = resolutionTime.length > 0 ? resolutionTime[0].average ? resolutionTime[0].average : 0 : 0;
            overAllReport.avgResolutionTime += report.avgResolutionTime
            if (indivisualReportArray.length < 5 && user.type != 2) {
                indivisualReportArray.push(report)
            }
        })
        return resolve({ "overAllReport": overAllReport, "indivisualReports": indivisualReportArray });
    })
}

const generatTemplate = (report) => {
    let templatePath = path.join(__dirname, "../mail/weeklyReportList.html");
    let templateArray = report.indivisualReports.map(agentReport => {
        return mailService.generateHTMLTemplate({ "templatePath": templatePath, "templateReplacement": agentReport });

    })
    return Promise.all(templateArray).then(templates => {
        let htmlTemplate = "";
        templates.map(template => {
            htmlTemplate += template;
        })
        return htmlTemplate;
    })
}

const sendWelcomeMail = (report, customer) => {
    let templatePath = '';
    let templateReplacement = '';
    let subject = '';
    let organization = customer.companyName !== undefined && customer.companyName != null ? customer.companyName : '';
    subject = "Kommunicate: Your weekly conversations report for " + dateformat(report.overAllReport.endTime, "longDate") + " - " + dateformat(report.overAllReport.startTime, "longDate");
    generatTemplate(report).then(templateList => {
        templatePath = path.join(__dirname, "../mail/weeklyReport.html");
        let resolutionTime = convertSecondsToHour(report.overAllReport.avgResolutionTime);
        templateReplacement = {
            "REPORTLIST": templateList,
            "TOTALNEWCONVERSATIONSCOUNT": report.overAllReport.newConversationCount,
            "CLOSEDCONVERSATIONSCOUNT": report.overAllReport.closedCount,
            "ORGANIZATION": organization,
            "STARTDATE": dateformat(report.overAllReport.startTime, "longDate"),
            "ENDDATE": dateformat(report.overAllReport.endTime, "longDate"),
            "kmWebsiteLogoIconUrl": kmWebsiteLogoIconUrl,
            "dashboardUrl": dashboardUrl,
            "weeklyReportIcon": weeklyReportIcon
        }
        Object.assign(templateReplacement, resolutionTime);


        let mailOptions = {
            to: customer.email,
            from: "Devashish From Kommunicate <support@kommunicate.io>",
            subject: subject,
            templatePath: templatePath,
            templateReplacement: templateReplacement
        }
        return mailService.sendMail(mailOptions);
    })
}

const convertSecondsToHour = (seconds) => {
    return {
        "HOURS": Math.floor(seconds / 3600),
        "MINUTES": Math.floor((seconds % 3600) / 60),
        "SECONDS": Math.floor(seconds % 60)
    };
}