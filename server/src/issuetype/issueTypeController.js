const issueTypeService = require('./issueTypeService.js')


exports.getIssueType = (req, res) => {

    return Promise.resolve(issueTypeService.getIssueType(req.query)).then(result => {
        if (result && result.length === 0) {
            return res.status(200).json({ code: "RECORD_NOT_FOUND", message: 'records not found' });
        } else {
            return res.status(200).json({ code: "GOT_ALL_ISSUE_TYPE", data: result });
        }
    }).catch(err => {
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    });
}

exports.getIssueTypeByCustIdAndCreatedBy = (req, res) => {

    const userName = req.params.userName
    const appId = req.params.appId

    return Promise.resolve(issueTypeService.getIssueTypeByCustIdAndCreatedBy(userName, appId)).then(result => {
        if (result && result.length === 0) {
            return res.status(200).json({ code: "RECORD_NOT_FOUND", message: 'records not found' });
        } else {
            return res.status(200).json({ code: "GOT_ALL_ISSUE_TYPE", data: result });
        }
    }).catch(err => {
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    });
}



exports.createIssueType = (req, res) => {

    const userName = req.params.userName
    const appId = req.params.appId

    return Promise.resolve(issueTypeService.createIssueType(userName, appId, req.body)).then(response => {
        console.log(response)
        if (response.code && response.code === 'ER_DUP_ENTRY') {
            return res.status(200).json(response)
        }
        return res.status(200).json({ code: 'CREATED_SUCCESSFULLY', data: response })
    }).catch(err => {
        console.log('error while creating issue', err)
        return res.status(501).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    })
}

exports.updateIssueType = (req, res) => {
    return Promise.resolve(issueTypeService.updateIssueType(req.params.id, req.body)).then(response => {
        if (response[0] === 1) {
            return res.status(200).json({ code: 'UPDATED_SUCCESSFULLY', data: 'updated successfully' })
        }
        return res.status(200).json({ code: 'NO_RECORD FOUND', data: 'no record found with this id' })
    }).catch(err => {
        console.log('error while updating issue', err)
        return res.status(501).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    })
}

exports.deleteIssueType = (req, res) => {
    return Promise.resolve(issueTypeService.deleteIssueTypeById(req.body.id)).then(response => {
        if (response === 1) {
            return res.status(200).json({ code: 'DELETED_SUCCESSFULLY', data: 'deleted successfully' })
        }
        return res.status(200).json({ code: 'NO_RECORD FOUND', data: 'no record found with this id' })
    }).catch(err => {
        console.log('error while deleting issue', err)
        return res.status(501).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong!" })
    })
}
