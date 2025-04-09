class ShadowDomComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
    }
}

class MckEmailComponent extends ShadowDomComponent {}

// Define the custom elements
if ('customElements' in window) {
    if (!window.customElements.get('mck-html-rich-message')) {
        window.customElements.define('mck-html-rich-message', ShadowDomComponent);
    }
    if (!window.customElements.get('mck-email-rich-message')) {
        window.customElements.define('mck-email-rich-message', MckEmailComponent);
    }
}
