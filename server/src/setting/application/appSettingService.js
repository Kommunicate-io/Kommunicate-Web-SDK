const applicationSettingModel = require("../../models").AppSetting;
exports.getAppSettingsByApplicationId = (criteria) => {
    return applicationSettingModel.findAll({ where: criteria }).then(res => {
        return { message: "SUCCESS", data: res[0] };
    }).catch(err => {
        return { message: "applcation settings fetch error " }
    });
}
exports.insertAppSettings = (settings) => {
    return applicationSettingModel.create(settings).then(res => {
        return { message: "applcation settings inserted successfully" };
    }).catch(err => {
        return { message: "applcation settings insert error " }
    });
}

exports.updateAppSettings = (settings, appId) => {
    return applicationSettingModel.update(settings, { where: { applicationId: appId } }).then(res => {
        return { message: "applcation settings updated successfully" };
    }).catch(err => {
        return { message: "application settings updation error " }
    });
}
