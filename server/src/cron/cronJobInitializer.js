const { CronJob } = require('cron');
const cronMapper = require('../cron/cronMapper').cronMapper;
const crons = require('../../conf/config').getProperties().crons;
var cronState = process.argv.indexOf('--cron') !== -1 ? process.argv[process.argv.indexOf('--cron') + 1] : "disable";
cronState === 'enable' ? console.log("\x1b[41m ------Warning: cron is enabled -----\x1b[0m") :
    console.log("\x1b[41m ------Warning: cron is not enabled -----\x1b[0m");


/**
 * Initialize all enable cron
 */

exports.initiateAllCron = () => {
    crons.map((cron, index) => {
        if (cronState === 'enable' && typeof cronMapper[cron.job] == "function") {
            const cronJob = new CronJob(cron.time, cronMapper[cron.job], null, false);
            cronJob.start();
            console.log(cron.job, 'cron started')
        }
    });
}
