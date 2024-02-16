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
    }

    init(appOptions = {}) {
        const { widgetSettings = {} } = appOptions;

        this.appOptions = appOptions;
        this.MCK_BOT_MESSAGE_DELAY = widgetSettings.botMessageDelayInterval
            ? widgetSettings.botMessageDelayInterval
            : 0;
    }
    processMessageInQueue = (message) => {
        message?.key && this.MCK_BOT_MESSAGE_QUEUE.push(message.key);
        this.MCK_BOT_MESSAGE_QUEUE.length == 1 &&
            this.processMessageTimerDelay();
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
        this.clearTimeoutIds();
        if (document.querySelector('.km-typing-wrapper')) {
            this.typingIndicatorStartTime = null;
            $applozic('.km-typing-wrapper').remove();
        }
    };

    getTypingIndicatorElapsedTime = () => {
        if (this.typingIndicatorStartTime === null) return -1;

        return new Date() - this.typingIndicatorStartTime;
    };
    showTypingIndicator = () => {
        this.clearTimeoutIds(); // remove old timers if those are active.
        if (!document.querySelector('.km-typing-wrapper')) {
            const $mck_msg_inner = $applozic(
                '#mck-message-cell .mck-message-inner'
            );
            this.typingIndicatorStartTime = new Date();
            $mck_msg_inner.append(
                '<div class="km-typing-wrapper"><div class="km-typing-indicator"></div><div class="km-typing-indicator"></div><div class="km-typing-indicator"></div></div>'
            );
            $mck_msg_inner.animate(
                {
                    scrollTop: $mck_msg_inner.prop('scrollHeight'),
                },
                0
            );
            const id = setTimeout(() => {
                if (document.querySelector('.km-typing-wrapper')) {
                    this.typingIndicatorStartTime = null;
                    $applozic('.km-typing-wrapper').remove();
                }
            }, 15000);
            this.addTimeoutIds(id);
        }
    };

    processMessageTimerDelay = () => {
        const showMessage = () => {
            let message = messageContainer.querySelector(
                'div[data-msgkey="' + this.MCK_BOT_MESSAGE_QUEUE[0] + '"]'
            );
            this.hideTypingIndicator();

            if (message) {
                this.scrollToTheCurrentMsg(message, messageContainer);
            }
            this.MCK_BOT_MESSAGE_QUEUE.shift();
            this.MCK_BOT_MESSAGE_QUEUE.length != 0 &&
                this.processMessageTimerDelay();
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

    scrollToTheCurrentMsg = (message, messageContainer) => {
        const $mck_msg_inner = $applozic(
            '#mck-message-cell .mck-message-inner'
        );
        message.classList.remove('n-vis');

        const firstMsg = messageContainer.querySelector(
            `div[data-msgkey="${this.FIRST_MESSAGE_KEY}"]`
        );

        let scrollTop;

        if (
            this.appOptions.showMsgFromStart &&
            firstMsg &&
            !this.alreadyScrolledFirstMsg
        )
            scrollTop = firstMsg.offsetTop - 30;
        else scrollTop = $mck_msg_inner.prop('scrollHeight');

        // const scrollTop =
        //     this.appOptions.showMsgFromStart && firstMsg
        //         ? firstMsg.offsetTop
        //         : $mck_msg_inner.prop('scrollHeight');
        console.log(
            $mck_msg_inner.prop('scrollHeight'),
            'running on the processmessagedelay',
            MCK_BOT_MESSAGE_QUEUE
        );
        // firstMsg.scrollIntoView();
        $mck_msg_inner.animate(
            {
                scrollTop,
            },
            0
        );
    };

    resetState = () => {
        this.typingIndicatorStartTime = null;
        this.MCK_BOT_MESSAGE_QUEUE = [];
        this.TYPING_INDICATOR_TIMEOUT_IDS = [];
        this.FIRST_MESSAGE_KEY = '';
        this.IS_FIRST_BOT_MSG = true;
        this.alreadyScrolledFirstMsg = false;
    };
}

const typingService = new TypingService();
