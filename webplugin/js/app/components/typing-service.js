class TypingService {
    constructor() {
        this.appOptions = {};
        this.MCK_BOT_MESSAGE_DELAY = 0;
        this.typingIndicatorStartTime = null;
        this.MCK_BOT_MESSAGE_QUEUE = [];
        this.TYPING_INDICATOR_TIMEOUT_IDS = [];
        this.FIRST_MESSAGE_KEY = ''; // resetting when user send the message
        this.IS_FIRST_BOT_MSG = true;
        this.alreadyScrolledFirstMsg = false;
        this.cumulativeHeight = 0;
        this.isKmTalkToHumanMsg = false;
        this.TYPING_TIMEOUT_MILLISEC = 20000; // 20 seconds
    }

    init(appOptions = {}) {
        const { widgetSettings = {} } = appOptions;

        this.appOptions = appOptions;
        this.MCK_BOT_MESSAGE_DELAY = widgetSettings.botMessageDelayInterval
            ? widgetSettings.botMessageDelayInterval
            : 0;
    }

    setTalkToHumanMsg = (bool) => {
        this.isKmTalkToHumanMsg = bool;
    };

    processMessageInQueue = (message) => {
        if (
            message?.key === 'tokenized_response' &&
            this.MCK_BOT_MESSAGE_QUEUE.indexOf(message.key) >= 0
        )
            return;
        message?.key && this.MCK_BOT_MESSAGE_QUEUE.push(message.key);
        this.MCK_BOT_MESSAGE_QUEUE.length == 1 && this.processMessageTimerDelay();
    };

    clearTimeoutIds = () => {
        if (this.TYPING_INDICATOR_TIMEOUT_IDS.length) {
            this.TYPING_INDICATOR_TIMEOUT_IDS.forEach((id) => clearTimeout(id));
            this.TYPING_INDICATOR_TIMEOUT_IDS = [];
        }
    };

    addTimeoutIds = (id) => {
        this.TYPING_INDICATOR_TIMEOUT_IDS.push(id);
    };

    hideTypingIndicator = () => {
        this.typingIndicatorStartTime = null;
        this.clearTimeoutIds();
        if (document.querySelector('.km-typing-wrapper')) {
            $applozic('.km-typing-wrapper').remove();
        }
    };

    getTypingIndicatorElapsedTime = () => {
        if (this.typingIndicatorStartTime === null) return -1;

        return new Date() - this.typingIndicatorStartTime;
    };
    showTypingIndicator = () => {
        this.clearTimeoutIds(); // remove old timers if those are active.
        if (this.isKmTalkToHumanMsg || CURRENT_GROUP_DATA.isWaitingQueue) return; // don't show loader when user clicking on the talk to human button

        if (!document.querySelector('.km-typing-wrapper')) {
            const $mck_msg_inner = $applozic('#mck-message-cell .mck-message-inner');
            $mck_msg_inner.append(
                '<div class="km-typing-wrapper"><div class="km-typing-indicator"></div><div class="km-typing-indicator"></div><div class="km-typing-indicator"></div></div>'
            );
            if (!this.alreadyScrolledFirstMsg) {
                $mck_msg_inner.animate(
                    {
                        scrollTop: $mck_msg_inner.prop('scrollHeight'),
                    },
                    0
                );
            }
        }

        this.typingIndicatorStartTime = new Date();
        const id = setTimeout(() => {
            this.hideTypingIndicator();
            console.warn('Hiding typing indicator due to timeout');
        }, this.TYPING_TIMEOUT_MILLISEC);
        this.addTimeoutIds(id);
    };

    processMessageTimerDelay = () => {
        const showMessage = () => {
            let message = messageContainer.querySelector(
                'div[data-msgkey="' + this.MCK_BOT_MESSAGE_QUEUE[0] + '"]'
            );
            this.hideTypingIndicator();

            if (message) {
                this.scrollToTheCurrentMsg(message, this.MCK_BOT_MESSAGE_QUEUE[0]);
            }
            this.MCK_BOT_MESSAGE_QUEUE.shift();
            this.MCK_BOT_MESSAGE_QUEUE.length != 0 && this.processMessageTimerDelay();
        };
        let messageContainer = document.getElementById('mck-message-cell');

        // delay in response from bot
        let responseDelay = this.getTypingIndicatorElapsedTime();
        let configuredDelay = this.MCK_BOT_MESSAGE_DELAY;

        if (responseDelay == -1) {
            this.showTypingIndicator();
        }
        if (configuredDelay <= responseDelay) {
            showMessage();
            return;
        }
        setTimeout(showMessage, configuredDelay - responseDelay);
    };

    scrollToView = (showMsgFromStart, msgKey) => {
        const $mck_msg_inner = $applozic('#mck-message-cell .mck-message-inner');
        const currentMessage = document.querySelector(`div[data-msgkey="${msgKey}"]`);
        const container = document.querySelector('.mck-box-body');
        const firstMsg = document
            .querySelector('#mck-message-cell')
            .querySelector(`div[data-msgkey="${this.FIRST_MESSAGE_KEY}"]`);

        if (currentMessage?.scrollHeight) {
            this.cumulativeHeight += currentMessage.scrollHeight;
        }

        if (showMsgFromStart) {
            // custom case
            if (this.cumulativeHeight > container.scrollHeight && firstMsg) {
                $mck_msg_inner.animate(
                    {
                        scrollTop: firstMsg.offsetTop - 15,
                    },
                    0
                );
                this.alreadyScrolledFirstMsg = true;
            } else if (!this.alreadyScrolledFirstMsg) {
                $mck_msg_inner.animate(
                    {
                        scrollTop: $mck_msg_inner.prop('scrollHeight'),
                    },
                    0
                );

                if (this.cumulativeHeight + 30 > container.offsetHeight) {
                    this.alreadyScrolledFirstMsg = true;
                }
            }
        } else {
            // Default case for all users
            $mck_msg_inner.animate(
                {
                    scrollTop: $mck_msg_inner.prop('scrollHeight'),
                },
                0
            );
        }
    };

    scrollToTheCurrentMsg = (msgElement, msgKey) => {
        msgElement.classList.remove('n-vis');
        this.scrollToView(this.appOptions.showMsgFromStart, msgKey);
    };

    resetState = () => {
        this.typingIndicatorStartTime = null;
        this.MCK_BOT_MESSAGE_QUEUE = [];
        this.TYPING_INDICATOR_TIMEOUT_IDS = [];
        this.FIRST_MESSAGE_KEY = '';
        this.IS_FIRST_BOT_MSG = true;
        this.alreadyScrolledFirstMsg = false;
        this.cumulativeHeight = 0;
    };
}

const typingService = new TypingService();
