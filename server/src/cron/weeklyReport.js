const applicationService = require('../customer/applicationService');
const userService = require('../users/userService');
const customerService = require('../customer/customerService');
const applozicClient = require('../utils/applozicClient');
const mailService = require('../utils/mailService');
const path = require('path');

exports.sendWeeklyReportsToCustomer = () => {
    getApplicationRecursively();
}


const getApplicationRecursively = (criteria) => {
    if (typeof criteria == "undefined") {
        var order = [['id', 'ASC']];
        criteria = { where: { id: { $gt: 0 } }, order, limit: 1 }
    }
    return applicationService.getAllApplications(criteria).then(applications => {
        if (applications.length < 1) {
            console.log("message", "all application processed")
            return;
        }
        let apps = applications.map((app, index) => {
            console.log("application: ", app.id, index);
            return processOneApp(app);
        })
        return Promise.all(apps).then(result => {
            let lastApp = applications[applications.length - 1]
            criteria.where = { id: { $gt: lastApp.id } }
            return getApplicationRecursively(criteria).catch(err => {
                console.log("error in weekly report cron")
            })
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
                    return sendWelcomeMail(report, customer);
                })

            })
        });
    }).catch(err => {
        console.log("err :", err)
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
        users.map(user => {
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

            indivisualReportArray.push(report)
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
    subject = "Your weekly conversations report for " + report.overAllReport.startTime + " - " + report.overAllReport.endTime;
    generatTemplate(report).then(templateList => {
        templatePath = path.join(__dirname, "../mail/weeklyReport.html");
        templateReplacement = {
            "REPORTLIST": templateList,
            "TOTALNEWCONVERSATIONSCOUNT": report.overAllReport.newConversationCount,
            "CLOSEDCONVERSATIONSCOUNT": report.overAllReport.closedCount,
            "AVGRESOLUTIONTIME": convertSecondsToHour(report.overAllReport.avgResolutionTime),
            "ORGANIZATION": organization,
            "STARTDATE": report.overAllReport.startTime,
            "ENDDATE": report.overAllReport.endTime,
        }


        let mailOptions = {
            to: customer.email,
            from: "Devashish From Kommunicate <support@kommunicate.io>",
            subject: subject,
            //bcc: "techdisrupt@applozic.com",
            templatePath: templatePath,
            templateReplacement: templateReplacement
        }
        return mailService.sendMail(mailOptions);
    })
}

const convertSecondsToHour = (seconds) => {
    return Math.floor(seconds / 3600) + " hrs " + Math.floor((seconds % 3600) / 60) + " min " + Math.floor(seconds % 60) + " sec"

    // {
    //     "HH": Math.floor(seconds / 3600),
    //     "MM": Math.floor((seconds % 3600) / 60),
    //     "SS": Math.floor(seconds % 60)
    // }
}