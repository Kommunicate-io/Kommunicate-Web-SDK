class GenAiService {
    constructor() {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
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
        if (this.currentIndex != msg.index - 1) {
            // if any token is missed then  stop there
            return;
        }
        this.currentIndex = this.currentIndex + 1;
        const textNode = document.createTextNode(`${msg.message} `);
        const targetElement = this.currentElement || this.textMsgDiv;
        targetElement.appendChild(textNode);

        if (!this.currentElement) {
            $textMessage.append(this.textMsgDiv);
        }
    };

    resetState = () => {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.currentIndex = -1;
    };

    enableTextArea = (bool) => {
        if (CURRENT_GROUP_DATA.TOKENIZE_RESPONSE) {
            document
                .getElementById('mck-text-box')
                .setAttribute('contenteditable', bool);
        }
    };
}
const genAiService = new GenAiService();
