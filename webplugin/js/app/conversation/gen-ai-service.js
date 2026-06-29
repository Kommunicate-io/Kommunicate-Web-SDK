class GenAiService {
    constructor() {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
        this.currentMessage = '';
    }

    addTokenizeMsg = (...args) => {
        const [msg, className, $textMessage] = args;
        this.currentElement = null;

        if (!this.currentElement) {
            this.currentElement = document
                .querySelector(`div[data-msgkey="${msg.key}"]`)
                ?.querySelector(`.${className}`);
        }
        if (!this.textMsgDiv) {
            const divElement = document.createElement('div');
            divElement.setAttribute('class', className);
            this.textMsgDiv = divElement;
        }
        this.pendingMessages[Number(msg.index)] = msg.message;
        if (!this.currentElement && !this.textMsgDiv.parentNode) {
            $textMessage.append(this.textMsgDiv);
        }
        if (!this.renderPendingMessages()) {
            return;
        }
    };

    renderPendingMessages = () => {
        let messageUpdated = false;
        let nextIndex = this.currentIndex + 1;
        while (Object.prototype.hasOwnProperty.call(this.pendingMessages, nextIndex)) {
            this.currentMessage += `${this.pendingMessages[nextIndex]} `;
            delete this.pendingMessages[nextIndex];
            this.currentIndex = nextIndex;
            nextIndex = this.currentIndex + 1;
            messageUpdated = true;
        }
        if (messageUpdated) {
            this.renderCurrentMessage();
        }
        return messageUpdated;
    };

    renderRemainingMessages = () => {
        if (!this.currentMessage && !Object.keys(this.pendingMessages).length) {
            return;
        }
        Object.keys(this.pendingMessages)
            .map(Number)
            .sort((firstIndex, secondIndex) => firstIndex - secondIndex)
            .forEach((index) => {
                this.currentMessage += `${this.pendingMessages[index]} `;
            });
        this.pendingMessages = {};
        this.renderCurrentMessage();
    };

    renderCurrentMessage = () => {
        const targetElement = this.currentElement || this.textMsgDiv;
        targetElement.innerHTML = KommunicateUtils.getSanitizedMarkdownMessage(this.currentMessage);
        $applozic(targetElement).linkify({
            target: '_blank',
        });
    };

    resetState = () => {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
        this.currentMessage = '';
    };

    enableTextArea = (bool) => {
        if (CURRENT_GROUP_DATA.TOKENIZE_RESPONSE) {
            document.getElementById('mck-text-box').setAttribute('contenteditable', bool);
        }
    };
}
const genAiService = new GenAiService();
