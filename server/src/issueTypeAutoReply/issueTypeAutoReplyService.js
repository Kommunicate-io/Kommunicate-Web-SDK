const config = require('../../conf/config.js')
const issueTypeAutoReplyModel = require("../models").IssueTypeAutoReply;


exports.createIssueTypeAutoReply = (issueTypeAutoReply) => {

    return Promise.resolve(issueTypeAutoReplyModel.create(issueTypeAutoReply)).then(result => {
        return result;
    })
}

exports.getIssueTypeAutoReply = (issueTypeAutoReply) => {
    let criteria = {}
    if (issueTypeAutoReply.id) {
        criteria.id = issueTypeAutoReply.id
    }
    if (issueTypeAutoReply.issueTypeId) {
        criteria.issueTypeId = issueTypeAutoReply.issueTypeId
    }
    if (issueTypeAutoReply.sequence) {
        criteria.sequence = issueTypeAutoReply.sequence
    }
    if (issueTypeAutoReply.createdBy) {
        criteria.createdBy = issueTypeAutoReply.createdBy
    }
    console.log('criteria for get issueTypeAutoReply', criteria)
    return Promise.resolve(issueTypeAutoReplyModel.findAll({ where: criteria }));
}

exports.updateIssueTypeAutoReply = (issueTypeAutoReply) => {
    return Promise.resolve(issueTypeAutoReplyModel.update(issueTypeAutoReply, { where: { id: issueTypeAutoReply.id } }));
}