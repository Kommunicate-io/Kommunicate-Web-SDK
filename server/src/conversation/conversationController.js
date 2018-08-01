

const conversationService = require('./conversationService');
const dbUtils = require("../utils/dbUtils.js");
const logger = require('../utils/logger');

exports.addMemberIntoConversation = (req, res) => {
    conversationService.addMemberIntoConversation(req.body).then(response => {
        res.status(201).json(response);
    }).catch(err => {
        logger.info("error while adding member into conversation ", err);
        res.status(204).json(response);
    });

}

exports.createConversationFromMail = (req, res) => {
    return Promise.resolve(conversationService.createConversationFromMail(req)).then(resp => {
        return res.status(200).json({ message: 'SUCCESS', response: resp })
    }).catch(err => {
        return res.status(500).json({ message: 'ERROR', response: err })
    })
}

exports.switchConversationAssignee = (req, res) => {
    let appId = req.body.applicationId;
    let groupId = req.body.groupId;
    let assignTo = req.body.userId;
    return conversationService
        .switchConversationAssignee(appId, groupId, assignTo)
        .then(response => {
            return res.status(200).json({ code: "success", message: response });
        })
        .catch(err => {
            return res.status(500).json({ code: "error", message: err });
        });
};