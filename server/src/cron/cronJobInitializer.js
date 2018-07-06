const {CronJob} = require('cron');
const cronMapper = require('../cron/cronMapper').cronMapper;
const crons = require('../../conf/config').getProperties().crons;


/**
 * Initialize all enable cron
 */

exports.initiatAllCron = () => {
    crons.map((cron, index) => {
        if (cron.enable && typeof cronMapper[cron.job] == "function") {
            const cronJob = new CronJob(cron.time, cronMapper[cron.job], null, false, 'America/Los_Angeles');
            cronJob.start();
            console.log( cron.job, 'cron started')
        }
    });
}
