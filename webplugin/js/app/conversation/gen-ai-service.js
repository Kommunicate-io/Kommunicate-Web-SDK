class GenAiService {
    constructor() {
        this.currentElement = null;
        this.textMsgDiv = null;
    }

    addTokenizeMsg = (...args) => {
        const [msg, className, $textMessage] = args;

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

        const textNode = document.createTextNode(msg.message);
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
            document
                .getElementById('mck-text-box')
                .setAttribute('contenteditable', bool);
        }
    };
    openLink = (url) => {
        window.open(url, '_blank');
    };
    addSourceInMsg = (sources) => {
        if (sources.length === 0) {
            return '';
        }

        return `<ul>${sources
            .map((source) => {
                return `<li>
                <a href="${source}" target="_blank">${source}</a>
                <div onClick="genAiService.openLink('${source}')">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5V8.33333C10 9.25239 9.25239 10 8.33333 10H1.66667C0.747611 10 0 9.25239 0 8.33333V1.66667C0 0.747611 0.747611 0 1.66667 0H5C5.30707 0 5.55556 0.24875 5.55556 0.555556C5.55556 0.862361 5.30707 1.11111 5 1.11111H1.66667C1.36013 1.11111 1.11111 1.36041 1.11111 1.66667V8.33333C1.11111 8.6396 1.36013 8.88889 1.66667 8.88889H8.33333C8.63987 8.88889 8.88889 8.6396 8.88889 8.33333V5C8.88889 4.69319 9.13737 4.44444 9.44444 4.44444C9.75152 4.44444 10 4.69319 10 5ZM9.44444 0H7.22222C6.91515 0 6.66667 0.24875 6.66667 0.555556C6.66667 0.862361 6.91515 1.11111 7.22222 1.11111H8.1033L2.94054 6.27387C2.72353 6.49088 2.72353 6.84245 2.94054 7.05946C3.04904 7.16797 3.19119 7.22222 3.33333 7.22222C3.47548 7.22222 3.61762 7.16797 3.72613 7.05946L8.88889 1.8967V2.77778C8.88889 3.08458 9.13737 3.33333 9.44444 3.33333C9.75152 3.33333 10 3.08458 10 2.77778V0.555556C10 0.24875 9.75152 0 9.44444 0Z" fill="#313131"/></svg>
                </div>
            </li>`;
            })
            .join('')}</ul>`;
    };
}
const genAiService = new GenAiService();
