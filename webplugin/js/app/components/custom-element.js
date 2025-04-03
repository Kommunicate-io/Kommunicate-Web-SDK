class ShadowDomComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (this.tagName.toLowerCase() === 'mck-html-rich-message') {
            const style = document.createElement('style');
            style.textContent = `
                table {
                    border-collapse: separate;
                    border-spacing: 0;
                    background-color: #FFF3DA;
                    overflow: hidden;
                    border: 1px solid #FFDC59;
                    border-radius: 15px;
                    font-weight: 400;
                    color: #535862;
                }
                td {
                    padding: 15px;
                    border: 0.5px solid #FFDC59;
                    text-align: center;
                }
            `;
            this._shadow.appendChild(style);
        }
    }
}

class MckEmailComponent extends ShadowDomComponent {}
// Define the custom element
if ('customElements' in window) {
    if (!window.customElements.get('mck-html-rich-message')) {
        window.customElements.define('mck-html-rich-message', ShadowDomComponent);
    }
    if (!window.customElements.get('mck-email-rich-message')) {
        window.customElements.define('mck-email-rich-message', MckEmailComponent);
    }
}
