class AnswerFeedback {
    constructor(options) {
        /**
         * end user widget configuration options.
         * @type {Object.<string, Object>}
         */

        this.options = options;

        /**
         * Map to store messages for traversing to the end user message.
         * @type {Object.<string, {
         *   msg: Object,
         *   floatWhere: string,
         *   previousSibling: (Object|null)
         * }>}
         */

        this.msgMap = {};

        /**
         * Array to maintain the order of message keys.
         * @type {Array.<string>}
         */
        this.msgKeyMap = [];
    }

    /**
     * @param {Object} data - The message data to set.
     * @param {Object} data.msg - The message object.
     * @param {string} data.msg.key - The unique key for the message.
     * @returns {void}
     */

    set msgMapData(data) {
        if (!CURRENT_GROUP_DATA.isConversationAssigneeBot) {
            return;
        }
        const msgKey = data.msg.key;
        const alreadyPresent = this.msgMap[msgKey];

        this.msgMap[msgKey] = data;

        // msg Key will be not changed that's why we are not updating the msgKeyMap
        !alreadyPresent && this.msgKeyMap.push(msgKey);
    }

    handleOnFeedbackClick = (feedback, data) => {
        const { payload, method = 'POST' } = this.getPayload(feedback, data);
        kmWidgetEvents.eventTracking(eventMapping.onFeedbackClick);

        window.Applozic.ALSocket.events.onFeedbackClick({
            message: data.msg,
            feedback: feedback,
        });

        mckUtils.ajax({
            type: method,
            url: `${Kommunicate.getBaseUrl()}/rest/ws/answer-feedback`,
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            data: JSON.stringify({ payload }),
            global: false,
            contentType: 'application/json',
            success: (result) => {
                if (result.code == 'SUCCESS') {
                    const msgMeta = this.msgMap[data.msg.key]?.msg?.metadata || {};
                    msgMeta.KM_ANSWER_FEEDBACK = feedback;
                } else {
                    console.error('Failed to submit feedback');
                }
            },
            error: function (data) {
                console.error(data);
            },
        });
    };

    getPayload = (feedback, data) => {
        const {
            msg: { metadata, key },
            assigneeKey,
        } = data;

        const answer = this.msgMap[key];
        let question = answer;

        // find the user message
        while (!metadata.KM_CONTEXT_QUESTION && question?.floatWhere !== 'mck-msg-right') {
            question = question.previousSibling;
        }

        const answerText = answer.msg.message;
        const questionText = question.msg.message;

        const payload = { feedback, messageKey: key };

        const isFeedbackAlreadyGiven = metadata.hasOwnProperty('KM_ANSWER_FEEDBACK');

        if (!isFeedbackAlreadyGiven) {
            Object.assign(payload, {
                source: metadata.KM_ANSWER_SOURCE || 'intent',
                botKey: assigneeKey,
                applicationKey: this.options.appId,
                answer: answerText,
                question: metadata.KM_CONTEXT_QUESTION || questionText,
                groupId: CURRENT_GROUP_DATA.tabId,
                userKey: this.options.userId,
            });
        }

        return {
            payload,
            method: isFeedbackAlreadyGiven ? 'PATCH' : 'POST',
        };
    };

    getActiveClass = (msg, feedback) => {
        const { KM_ANSWER_FEEDBACK } = msg.metadata;

        return KM_ANSWER_FEEDBACK == feedback ? 'active-feedback' : '';
    };

    helpFulOnClick = (data) =>
        this.handleOnFeedbackClick(KommunicateConstants.ANSWER_FEEDBACK.HELPFUL, data);

    notHelpFulOnClick = (data) =>
        this.handleOnFeedbackClick(KommunicateConstants.ANSWER_FEEDBACK.NOT_HELPFUL, data);

    handleFeedbackBtnVisible = (msg, floatWhere, group) => {
        if (!CURRENT_GROUP_DATA.answerFeedback) return false;
        // only visible if the message is from the bot
        // needed later contact(group.removedUsers || [])
        let currentUser = group.users;
        currentUser = currentUser[msg.to];

        if (!currentUser) return false;

        // If valid(0 | 1) feedback is already given then don't show the feedback buttons
        const validFeedback =
            msg.metadata.hasOwnProperty('KM_ANSWER_FEEDBACK') &&
            msg.metadata.KM_ANSWER_FEEDBACK != KommunicateConstants.ANSWER_FEEDBACK.DISCARD;

        if (
            currentUser.role !== KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT ||
            validFeedback ||
            !msg.metadata.hasOwnProperty('KM_ANSWER_SOURCE') // From where bot fetched the answer like the webpages, document urls
        ) {
            return false;
        }

        return (
            floatWhere === 'mck-msg-left' && !msg.metadata.obsolete && !msg.metadata.WELCOME_EVENT
        );
    };

    putIconInsideSticker = (stickySticker, iconToPut) => {
        stickySticker.innerHTML = iconToPut;
    };

    handleFeedbackPositioning = (msgKey) => {
        const msgContainer = document.querySelector(`[data-msgKey='${msgKey}']`);
        const feedbackContainerSelector = `[data-msgKey="${msgKey}"] .km-answer-feedback`;
        kommunicateCommons.show(feedbackContainerSelector);
        if (!msgContainer) return;

        const msgBox = msgContainer.querySelector('.mck-msg-box');
        const feedbackElement = msgContainer.querySelector('.km-answer-feedback');

        if (!msgBox || !feedbackElement) return;
        const msgBoxWidth = msgBox.offsetWidth;

        const feedbackWidth = msgBoxWidth + 40;
        if (feedbackWidth > 120) {
            feedbackElement.style.left = `${feedbackWidth}px`;
        }
    };

    attachEventListeners = (data) => {
        const { msg } = data;

        const feedbackContainerSelector = `[data-msgKey="${msg.key}"] .km-answer-feedback`;
        const stickyStickerSelector = `[data-msgKey="${msg.key}"] .mck-msg-feedback-sticker`;

        const msgContainer = document.querySelector(`[data-msgKey='${msg.key}']`);

        const stickySticker = msgContainer.querySelector('.mck-msg-feedback-sticker');
        const helpfulButton = msgContainer.querySelector('.answer-feedback-helpful');
        const notHelpfulButton = msgContainer.querySelector('.answer-feedback-not-helpful');

        // Initially hide the feedback container
        kommunicateCommons.hide(feedbackContainerSelector);

        // Handle feedback positioning after the element is rendered and then show the container
        setTimeout(() => {
            this.handleFeedbackPositioning(msg.key);
        }, 500);

        const setFeedback = (feedback) => {
            const iconToAdd = KommunicateConstants.ANSWER_FEEDBACK_ICONS[feedback];

            this.putIconInsideSticker(stickySticker, iconToAdd);

            kommunicateCommons.hide(feedbackContainerSelector);
            kommunicateCommons.show(stickyStickerSelector);

            feedback ? this.helpFulOnClick(data) : this.notHelpFulOnClick(data);
        };

        helpfulButton.addEventListener('click', setFeedback.bind(null, 1));
        notHelpfulButton.addEventListener('click', setFeedback.bind(null, 0));

        stickySticker.addEventListener('click', (e) => {
            kommunicateCommons.show(feedbackContainerSelector);
            kommunicateCommons.hide(stickyStickerSelector);

            this.handleOnFeedbackClick(KommunicateConstants.ANSWER_FEEDBACK.DISCARD, data);
        });
    };

    getFeedbackTemplate = (data) => {
        return `<div class="answer-feedback-helpful">
                   ${
                       KommunicateConstants.ANSWER_FEEDBACK_ICONS[
                           KommunicateConstants.ANSWER_FEEDBACK.HELPFUL
                       ]
                   }
                </div>
                <div class="answer-feedback-not-helpful">
                    ${
                        KommunicateConstants.ANSWER_FEEDBACK_ICONS[
                            KommunicateConstants.ANSWER_FEEDBACK.NOT_HELPFUL
                        ]
                    }
                </div>`;
    };
}
