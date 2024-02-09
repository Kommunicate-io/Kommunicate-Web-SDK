function TypingService(appOptions) {
    const $mck_msg_inner = $applozic('#mck-message-cell .mck-message-inner');
    const MCK_BOT_MESSAGE_DELAY =
        appOptions.widgetSettings &&
        appOptions.widgetSettings.botMessageDelayInterval
            ? appOptions.widgetSettings.botMessageDelayInterval
            : 0;
    let typingIndicatorStartTime = null;

    this.MCK_BOT_MESSAGE_QUEUE = [];
    this.TYPING_INDICATOR_TIMEOUT_IDS = [];

    this.clearTimeoutIds = function () {
        this.TYPING_INDICATOR_TIMEOUT_IDS.length &&
            this.TYPING_INDICATOR_TIMEOUT_IDS.forEach((id) => clearTimeout(id));
    };

    this.addTimeoutIds = function (id) {
        this.TYPING_INDICATOR_TIMEOUT_IDS.push(id);
    };

    this.processMessageInQueue = function (message) {
        message && message.key && this.MCK_BOT_MESSAGE_QUEUE.push(message.key);
        this.MCK_BOT_MESSAGE_QUEUE.length == 1 &&
            this.processMessageTimerDelay();
    };

    this.showTypingIndicator = function () {
        this.clearTimeoutIds(); // remove old timers if those are active.
        if (!document.querySelector('.km-typing-wrapper')) {
            typingIndicatorStartTime = new Date();
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
                    typingIndicatorStartTime = null;
                    $applozic('.km-typing-wrapper').remove();
                }
            }, 15000);
            this.addTimeoutIds(id);
        }
    };

    this.hideTypingIndicator = function () {
        this.clearTimeoutIds();
        if (document.querySelector('.km-typing-wrapper')) {
            typingIndicatorStartTime = null;
            $applozic('.km-typing-wrapper').remove();
        }
    };

    this.getTypingIndicatorElapsedTime = function () {
        if (typingIndicatorStartTime === null) return -1;

        return new Date() - typingIndicatorStartTime;
    };

    this.processMessageTimerDelay = function () {
        const showMessage = () => {
            let message = messageContainer.querySelector(
                'div[data-msgkey="' + this.MCK_BOT_MESSAGE_QUEUE[0] + '"]'
            );
            this.hideTypingIndicator();

            if (message) {
                message.classList.remove('n-vis');
                $mck_msg_inner.animate(
                    {
                        scrollTop: $mck_msg_inner.prop('scrollHeight'),
                    },
                    0
                );
            }
            this.MCK_BOT_MESSAGE_QUEUE.shift();
            this.MCK_BOT_MESSAGE_QUEUE.length != 0 &&
                this.processMessageTimerDelay();
        };
        let messageContainer = document.getElementById('mck-message-cell');

        // delay in response from bot
        let responseDelay = this.getTypingIndicatorElapsedTime();
        let configuredDelay = MCK_BOT_MESSAGE_DELAY;

        if (responseDelay == -1) {
            this.showTypingIndicator();
        }
        if (configuredDelay <= responseDelay) {
            showMessage();
            return;
        }
        setTimeout(showMessage, configuredDelay - responseDelay);
    };
}
