const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const issueTypeModel = require("../models").IssueType;

exports.getById = (issueTypeId) => {
    return Promise.resolve(issueTypeModel.findAll({ where: { id: issueTypeId } }));
}

exports.getIssueType = (issueType) => {
    let criteria = {}
    if (issueType.id) {
        criteria.id = issueType.id
    }
    if (issueType.issueName) {
        criteria.issueName = issueType.issueName
    }
    if (issueType.customerId) {
        criteria.customerId = issueType.customerId
    }
    if (issueType.createdBy) {
        criteria.createdBy = issueType.createdBy
    }
    if (issueType.status) {
        criteria.status = issueType.status
    }
    return Promise.resolve(issueTypeModel.findAll({ where: criteria }));
}


exports.createIssueType = (IssueType) => {
    return Promise.resolve(issueTypeModel.create(IssueType)).catch(err => {
        return { code: err.parent.code, message: err.parent.sqlMessage }
    });
}

exports.updateIssueType = (issueId, issueType) => {
    return issueTypeModel.update(issueType, {
        where: {
            id: issueId
        }
    });

}

exports.deleteIssueTypeById = (issueTypeId) => {
    return issueTypeModel.destroy({
        where: {
            id: issueTypeId
        }
    });

}