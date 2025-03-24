class ShadowDomComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            table {
                border-collapse: separate;
                border-spacing: 0;
                background-color: #EFEFEF;
                overflow: hidden;
                border: 1px solid #D0D5DD;
                border-radius: 15px;
                font-weight: 300;
                color: #535862;
            }
            td {
                padding: 15px;
                border: 1px solid #D0D5DD;
                text-align: center;
            }
        `;
        this._shadow.appendChild(style);
    }
}

// Define the custom element
if ('customElements' in window) {
    if (!window.customElements.get('mck-html-rich-message')) {
        window.customElements.define('mck-html-rich-message', ShadowDomComponent);
    }
}
