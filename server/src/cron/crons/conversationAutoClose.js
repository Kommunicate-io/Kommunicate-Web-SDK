const appSettingService = require('../../setting/application/appSettingService');
const userService = require('../../users/userService');
const applozicClient = require('../../utils/applozicClient');
var skipCron = false;

/**
 * fetch app setting and user by application
 * if closing time greater than 5 min
 * and call applozic group/close/{interval} API  , id:{$gt: id}
 */
exports.closeConversationCron = async () => {
    if (skipCron) return;
    skipCron = !skipCron;
    var order = [['id', 'ASC']];
    let criteria = { where: { id: { $gt: 0 }, conversationCloseTime: { $gt: 0 } }, order, limit: 50 }
    let appSettings = [];
    do {
        try {
            appSettings = await appSettingService.getAppSettingByCriteria(criteria);
            if (appSettings.length > 0) {
                let response = await closeConversation(appSettings)
                criteria.where.id.$gt = appSettings[appSettings.length - 1].id
            }
        } catch (error) {
            console.log(`error: ${error}`)
        }
    } while (appSettings && appSettings.length > 0)
    skipCron = !skipCron;
    console.log("conversation auto closing cron completed")
}

const closeConversation = async (appSettings) => {
    try {
        for (var i = 0; i < appSettings.length; i++) {
            let user = await userService.getAdminUserByAppId(appSettings[i].applicationId);
            if (!user) continue;
            let headers = {
                "Apz-Token": "Basic " + user.apzToken,
                "Apz-AppId": user.applicationId,
                "Apz-Product-App": true
            }
            let closeTime = Math.ceil(appSettings[i].conversationCloseTime/60);
            applozicClient.closeConversation(closeTime, headers);
        }
        return "success";
    } catch (error) {
        console.log(error)
        return "error";
    }

}