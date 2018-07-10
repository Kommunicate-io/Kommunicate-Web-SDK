const weeklyReport = require('../cron/weeklyReport')
/**
 * add all cron job (function) mapping here.
 */

exports.cronMapper = {
    "sendWeeklyReportsToCustomers": weeklyReport.sendWeeklyReportsToCustomer/* weekly report cron*/
}