const issueTypeService = require('./issueTypeService.js')


exports.getAllIssueType = (req, res) => {

    issueTypeService.getByCustomerId(req.param.customerID).then(issueTypes => {
            if (!issueTypes) {
                res.status(404).json({ code: "NO_ISSUE_FOUND" });
            } else {
                res.status(200).json({ code: "GOT_ALL_ISSUE_TYPE", data: issueTypes });
            }
        }).catch(err => { 
            res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" }
        )
    });
}