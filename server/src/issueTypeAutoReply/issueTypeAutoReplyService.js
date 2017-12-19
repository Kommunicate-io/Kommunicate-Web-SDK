const config = require('../../conf/config.js')
const issueTypeAutoReplyModel = require("../models").IssueTypeAutoReply;


exports.createIssueTypeAutoReply = (issueTypeAutoReply) => {

    return Promise.resolve(issueTypeAutoReplyModel.create(issueTypeAutoReply)).then(result => {
        return result;
    })
}