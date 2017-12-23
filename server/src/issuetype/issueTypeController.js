const issueTypeService = require('./issueTypeService.js')


exports.getIssueType = (req, res) => {

    return Promise.resolve(issueTypeService.getIssueType(req.query)).then(result => {
        if (!result) {
            return res.status(200).json({ code: "NO_ISSUE_TYPE_FOUND" });
        } else {
            return res.status(200).json({ code: "GOT_ALL_ISSUE_TYPE", data: result });
        }
    }).catch(err => {
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
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