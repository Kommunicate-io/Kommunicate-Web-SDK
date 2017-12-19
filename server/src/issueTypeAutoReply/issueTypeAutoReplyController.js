const issueTypeAutoReplyService = require('./issueTypeAutoReplyService.js')




exports.createIssueTypeAutoReply = (req, res) => {
    let issueTypeAutoReply = req.body
    console.log("issueTypeAutoReply  ==", issueTypeAutoReply)
    return Promise.resolve(issueTypeAutoReplyService.createIssueTypeAutoReply(issueTypeAutoReply)).then(response => {
        return res.status(200).json({ code: 'ISSUE_TYPE_AUTOREPLY_CREATED', data: response });
    }).catch(err => {
        return res.status(500).json({ code: 'ISSUE_TYPE_AUTOREPLY_CREATION_ERROR', message: 'something went wrong' });
    })
}