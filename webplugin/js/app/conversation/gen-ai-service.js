class GenAiService {
    constructor() {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
        this.currentMessage = '';
        this.currentMessageParts = {};
        this.currentStreamKey = '';
    }

    prepareTokenizedMessage = (msg) => {
        if (this.currentStreamKey !== msg.key) {
            this.clearActiveStream();
            this.currentStreamKey = msg.key;
        }
    };

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
        const tokenIndex = Number(msg.index);
        this.currentMessageParts[tokenIndex] = msg.message;
        this.currentIndex = Math.max(this.currentIndex, tokenIndex);
        this.currentMessage =
            Object.keys(this.currentMessageParts)
                .map(Number)
                .sort((firstIndex, secondIndex) => firstIndex - secondIndex)
                .map((index) => this.currentMessageParts[index])
                .join(' ') + ' ';
        const targetElement = this.currentElement || this.textMsgDiv;
        targetElement.innerHTML = KommunicateUtils.getSanitizedMarkdownMessage(this.currentMessage);
        $applozic(targetElement).linkify({
            target: '_blank',
        });

        if (!this.currentElement) {
            $textMessage.append(this.textMsgDiv);
        }
    };

    clearActiveStream = () => {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
        this.currentMessage = '';
        this.currentMessageParts = {};
        this.currentStreamKey = '';
    };

    completeCurrentStream = (streamKey) => {
        if (!streamKey || streamKey === this.currentStreamKey) {
            this.clearActiveStream();
        }
    };

    getNextTokenizedStreamElement = () => {
        return document.querySelector('div[data-msgkey^="tokenized_response"]');
    };

    removeTokenizedStreamElement = (element, messageKey) => {
        if (!element) {
            return false;
        }

        const messageElement = document.querySelector(`div[data-msgkey="${messageKey}"]`);
        if (messageElement) {
            ['km-clubbing-first', 'km-clubbing-last'].forEach((className) => {
                messageElement.classList.remove(className);
                if (element.classList.contains(className)) {
                    messageElement.classList.add(className);
                }
            });
        }

        element.remove();
        return true;
    };

    hasActiveStream = () => {
        return Boolean(this.currentStreamKey);
    };

    resetState = () => {
        this.clearActiveStream();
    };

    enableTextArea = (bool) => {
        if (CURRENT_GROUP_DATA.TOKENIZE_RESPONSE) {
            document.getElementById('mck-text-box').setAttribute('contenteditable', bool);
        }
    };
}
const genAiService = new GenAiService();
