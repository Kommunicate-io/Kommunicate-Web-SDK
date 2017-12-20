const issueTypeService = require('./issueTypeService.js')


exports.getAllIssueType = (req, res) => {

    issueTypeService.getByCustomerId(req.param.customerID).then(issueTypes => {
        if (!issueTypes) {
            res.status(404).json({ code: "NO_ISSUE_FOUND" });
        } else {
            res.status(200).json({ code: "GOT_ALL_ISSUE_TYPE", data: issueTypes });
        }
    }).catch(err => {
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    });
}

exports.createIssueType = (req, res) => {
    return Promise.resolve(issueTypeService.createIssueType(req.body)).then(response => {
        if(response.code && response.code==='ER_DUP_ENTRY'){
            return res.status(200).json(response) 
        }
        return res.status(200).json({ code: 'CREATED_SUCCESSFULLY', data: response })
    }).catch(err => {
        console.log('error while creating issue', err)
        return res.status(501).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    })
}