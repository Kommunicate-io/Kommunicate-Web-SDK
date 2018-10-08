const weeklyReport = require('../cron/crons/weeklyReport');
const trialExpire = require('../cron/crons/trialExpire');
/**
 * add all cron job (function) mapping here.
 */

exports.cronMapper = {
    "sendWeeklyReportsToCustomers": weeklyReport.sendWeeklyReportsToCustomer,/* weekly report cron*/
    "trialExpireCron": trialExpire.trialExpireCron
}