const joi = require("joi");

module.exports.addMemberIntoConversation = {
    body: {
        groupId: joi.string().required(),
        userId: joi.string().required()
    }
}