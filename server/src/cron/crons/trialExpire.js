const applicationService = require('../../customer/applicationService')
const userService = require('../../users/userService');
const botPlatform = require('../../utils/botPlatformClient');
const BOT_STATUS = require('../../users/constants').USER_STATUS
const exec = require('child_process').exec;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "test"


exports.trialExpireCron = async function () {
    var freePlan = exec('sh ' + __basedir + '/scripts/freeplan.sh ' + env,
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });

    let applications = await applicationService.getExpiredApplication();
    for (var i = 0; i < applications.length; i++) {
        let res = await markBotAsExpire(applications[i].applicationId);
        applicationService.updateApplication(applications[i].applicationId, { status: applicationService.STATUS.EXPIRED });
    }
}
const markBotAsExpire = async function (appId) {
    let bots = await userService.getUsersByAppIdAndTypes(appId, [2]);
    for (var i = 0; i < bots.length; i++) {
        if (bots[i].userName != 'bot') {
            let botObj = { 'key': bots[i].userKey, 'status': BOT_STATUS.EXPIRED }
            try {
                let res = await botPlatform.updateBot(botObj)
            } catch (err) {
                console.log("bot updation error", err)
            }
        }
    }
    return "success";
}
