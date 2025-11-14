Kommunicate = typeof Kommunicate == 'undefined' ? {} : Kommunicate;

/**
 * Kommunciate.conversation contains all methods to add functionality into conversations.
 * this file has been loaded before mck-sidebox.js. do not add any code dependent to mck sidebox.
 */
Kommunicate.conversation = {
    STATUS: Kommunicate.conversationHelper.status,

    /**
     * this method will be called when click event triggered on a conversation in conversation list.
     * @param {object} data group data received from Applozic
     * @param {object} error  error if any.
     */
    processConversationOpenedFromList: function (data, error) {
        if (error) {
            console.log('Error received. can not post process the conversation ', error);
            return;
        }

        // data.groupFeeds might be undefined or empty (e.g., new/no conversations)
        var conversationDetail =
            data && Array.isArray(data.groupFeeds) && data.groupFeeds.length > 0
                ? data.groupFeeds[0]
                : null;

        if (!conversationDetail) {
            // Nothing to evaluate; ensure banner is hidden and exit gracefully
            KommunicateUI && KommunicateUI.showClosedConversationBanner(false);
            return;
        }

        const feedbackGroups = kmLocalStorage.getItemFromLocalStorage('feedbackGroups') || {};
        const isConversationRated = feedbackGroups[conversationDetail.id];

        KommunicateUI.showClosedConversationBanner(
            isConversationRated
                ? false
                : Kommunicate.conversationHelper.isConversationClosed(conversationDetail)
        );
    },
};
