const applicationSettingModel = require("../../models").AppSetting;
exports.getAppSettingsByApplicationId = (criteria) => {
    return applicationSettingModel.findAll({ where: criteria }).then(res => {
        return { message: "SUCCESS", data: res[0] };
    });
}
exports.insertAppSettings = (settings) => {
    return applicationSettingModel.create(settings).then(res => {
        return { message: "application settings inserted successfully" };
    }).catch(err => {
        return { message: "application settings insert error " }
    });
}

exports.updateAppSettings = (settings, appId) => {
    return applicationSettingModel.update(settings, { where: { applicationId: appId } }).then(res => {
        return { message: "application settings updated successfully" };
    }).catch(err => {
        return { message: "application settings updation error " }
    });
}

exports.getAppSettingByCriteria = (criteria) => {
    return Promise.resolve(applicationSettingModel.findAll(criteria )).then(result=>{
        return result;
    });
}