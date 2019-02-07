const deepmerge = require('deepmerge');
const Feedback = require("../models").Feedback;

const createOrUpdateFeedBack = async (feedback) => {
    try {
        let feedbackResult = await Feedback.findOne({where:{ groupId: feedback.groupId }});

        if (feedbackResult) {
            feedbackResult = deepmerge(JSON.parse(JSON.stringify(feedbackResult)), feedback);
            if (feedbackResult.comments) { 
                feedbackResult.comments = [...new Set(feedbackResult.comments)]; 
            }
            await Feedback.update(feedbackResult, {where:{ groupId: feedbackResult.groupId }});
            return { created: false, data: feedbackResult };
        }
        feedbackResult = await Feedback.create(feedback);
        return { created: true, data: JSON.parse(JSON.stringify(feedbackResult)) };
    } catch (error) {
        return "CREATION_ERROR"
    }
}

const getFeedback = async (groupId) => {
    let feedbackResult = await Feedback.findOne({where:{ groupId: groupId }});
    return feedbackResult;
}

exports.deleteFeedback = groupId => {
    return Feedback.destroy({ where: { groupId: groupId } });
}


exports.createOrUpdateFeedBack = createOrUpdateFeedBack;
exports.getFeedback = getFeedback;