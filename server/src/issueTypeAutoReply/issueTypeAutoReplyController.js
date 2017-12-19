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

exports.getIssueTypeAutoReply = (req, res) => {
    console.log(' request parameters ',req.query)
    let ssueTypeAutoReply = req.query 
    return Promise.resolve(issueTypeAutoReplyService.getIssueTypeAutoReply(ssueTypeAutoReply)).then(result => {
        if (!result) {
            return res.status(200).json({ code: 'SUCCESS', message: 'data not found' })
        }
        return res.status(200).json({ code: 'SUCCESS', data: result })
    }).catch(err => {
        return res.status(500).json({ data:'INTERNAL_SERVER-ERROR', message:'something went wrong'})
    })
}