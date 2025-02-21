class GenAiService {
    constructor() {
        this.currentElement = null;
        this.textMsgDiv = null;
        this.originMessage =null;
    }

    addTokenizeMsg = (...args) => {
        const [msg, className, $textMessage] = args;
        if(msg.tokenMessage == false){
            this.originMessage = msg.message;
        }
        this.currentElement = null;
        if(msg.metadata.lastToken ){
            const element = document.querySelector(`div[data-msgkey="${msg.key}"]`);
            if (element) {
              element.remove();
            }
          
        }

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
    };

    enableTextArea = (bool) => {
        if (CURRENT_GROUP_DATA.TOKENIZE_RESPONSE) {
            // debugger;
            document
                .getElementById('mck-text-box')
                .setAttribute('contenteditable', bool);
        }
    };
}
const genAiService = new GenAiService();
