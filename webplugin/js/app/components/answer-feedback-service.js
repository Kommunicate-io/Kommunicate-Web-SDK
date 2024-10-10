class AnswerFeedback {
    constructor(options) {
        this.options = options;
        this.msgMap = {};
        this.msgKeyMap = [];
    }

    /**
     * @param {{ key: string | number; }} data
     */
    set msgMapData(data) {
        const msgKey = data.msg.key;

        this.msgMap[msgKey] = data;
        this.msgKeyMap.push(msgKey);
    }

    handleOnFeedbackClick = (feedback, data) => {
        const { payload, method = 'POST' } = this.getPayload(feedback, data);

        mckUtils.ajax({
            type: method,
            url: `${Kommunicate.getBaseUrl()}/rest/ws/answer-feedback`,
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            data: JSON.stringify({ payload }),
            global: false,
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                if (result.status == 'success') {
                } else {
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
        while (
            !metadata.KM_CONTEXT_QUESTION &&
            question?.floatWhere !== 'mck-msg-right'
        ) {
            question = question.previousSibling;
        }

        const answerText = answer.msg.message;
        const questionText = question.msg.message;

        return {
            payload: {
                source: metadata.KM_ANSWER_SOURC || 'intent',
                botKey: assigneeKey,
                applicationKey: this.options.appId,
                answer: answerText,
                question: metadata.KM_CONTEXT_QUESTION || questionText,
                feedback,
                messageKey: key,
                groupId: CURRENT_GROUP_DATA.tabId,
                userKey: this.options.userId,
            },
            method: metadata.KM_ANSWER_FEEDBACK ? 'PATCH' : 'POST',
        };
    };

    getActiveClass = (msg, feedback) => {
        const { KM_ANSWER_FEEDBACK } = msg.metadata;

        return KM_ANSWER_FEEDBACK === feedback ? 'active-feedback' : '';
    };

    helpFullOnClick = (data) => {
        kmWidgetEvents.eventTracking(eventMapping.onHelpFulClick);
        window.Applozic.ALSocket.events.onHelpFulClick({ message: data.msg });

        this.handleOnFeedbackClick(
            KommunicateConstants.ANSWER_FEEDBACK.HELPFUL,
            data
        );
    };

    notHelpFullOnClick = (data, btn) => {
        kmWidgetEvents.eventTracking(eventMapping.onNotHelpFulClick);
        window.Applozic.ALSocket.events.onNotHelpFulClick({
            message: data.msg,
        });

        this.handleOnFeedbackClick(
            KommunicateConstants.ANSWER_FEEDBACK.NOT_HELPFUL,
            data
        );
    };

    handleFeedbackBtnVisible = (msg, floatWhere) => {
        return (
            floatWhere === 'mck-msg-left' &&
            !msg.metadata.obsolete &&
            !msg.metadata.WELCOME_EVENT &&
            CURRENT_GROUP_DATA.isConversationAssigneeBot
        );
    };

    attachEventListeners = (data) => {
        const { msg } = data;

        const msgContainer = document.querySelector(
            `[data-msgKey='${msg.key}']`
        );

        const helpfulButton = msgContainer.querySelector(
            '.answer-feedback-helpful'
        );
        const notHelpfulButton = msgContainer.querySelector(
            '.answer-feedback-not-helpful'
        );

        helpfulButton.addEventListener('click', () => {
            helpfulButton.classList.add('active-feedback');
            notHelpfulButton.classList.remove('active-feedback');
            this.helpFullOnClick(data);
        });
        notHelpfulButton.addEventListener('click', () => {
            helpfulButton.classList.remove('active-feedback');
            notHelpfulButton.classList.add('active-feedback');
            this.notHelpFullOnClick(data);
        });
    };
    getFeedbackTemplate = (data) => {
        const { msg } = data;

        return `<div class="answer-feedback-helpful ${this.getActiveClass(
            msg,
            KommunicateConstants.ANSWER_FEEDBACK.HELPFUL
        )}">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0.25 12.125H1.5C1.84375 12.125 2.125 11.8438 2.125 11.5V5.875C2.125 5.53125 1.84375 5.25 1.5 5.25H0.25V12.125ZM12.6438 7.675C12.7125 7.51875 12.75 7.35 12.75 7.175V6.5C12.75 5.8125 12.1875 5.25 11.5 5.25H8.0625L8.6375 2.34375C8.66875 2.20625 8.65 2.05625 8.5875 1.93125C8.44375 1.65 8.2625 1.39375 8.0375 1.16875L7.75 0.875L3.74375 4.88125C3.50625 5.11875 3.375 5.4375 3.375 5.76875V10.6687C3.375 11.4688 4.03125 12.125 4.8375 12.125H9.90625C10.3438 12.125 10.7563 11.8938 10.9812 11.5188L12.6438 7.675Z" fill="black"/>
                    </svg>
                </div>
                <div class="answer-feedback-not-helpful ${this.getActiveClass(
                    msg,
                    KommunicateConstants.ANSWER_FEEDBACK.NOT_HELPFUL
                )}">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M12.75 0.875L11.5 0.875C11.1563 0.875 10.875 1.15625 10.875 1.5L10.875 7.125C10.875 7.46875 11.1563 7.75 11.5 7.75L12.75 7.75L12.75 0.875ZM0.35625 5.325C0.287501 5.48125 0.250001 5.65 0.250001 5.825L0.25 6.5C0.25 7.1875 0.8125 7.75 1.5 7.75L4.9375 7.75L4.3625 10.6562C4.33125 10.7937 4.35 10.9437 4.4125 11.0687C4.55625 11.35 4.7375 11.6062 4.9625 11.8312L5.25 12.125L9.25625 8.11875C9.49375 7.88125 9.625 7.5625 9.625 7.23125L9.625 2.33125C9.625 1.53125 8.96875 0.875 8.1625 0.875L3.09375 0.874999C2.65625 0.874999 2.24375 1.10625 2.01875 1.48125L0.35625 5.325Z" fill="#1C1C1C"/>
                    </svg>
                </div>`;
    };
}
