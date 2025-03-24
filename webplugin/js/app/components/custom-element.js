class ShadowDomComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
    }
}

// Define the custom element
if ('customElements' in window) {
    if (!window.customElements.get('mck-html-rich-message')) {
        window.customElements.define('mck-html-rich-message', ShadowDomComponent);
    }
}
