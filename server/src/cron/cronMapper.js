const weeklyReport = require('../cron/crons/weeklyReport');
const trialExpire = require('../cron/crons/trialExpire');
const conversationAutoClose =require('../cron/crons/conversationAutoClose')
/**
 * add all cron job (function) mapping here.
 */

exports.cronMapper = {
    "sendWeeklyReportsToCustomers": weeklyReport.sendWeeklyReportsToCustomer,/* weekly report cron*/
    "trialExpireCron": trialExpire.trialExpireCron,
    "conversationAutoCloseCron":conversationAutoClose.closeConversationCron
}