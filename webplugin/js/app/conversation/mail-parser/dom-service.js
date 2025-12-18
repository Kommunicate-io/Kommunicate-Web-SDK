class EmailDOMService {
    static createEmailContainer(message, group) {
        const containerId = `km-email-${message.groupId}-${message.key}`;
        let container = document.getElementById(containerId);

        if (!container) {
            const messageElem = document.querySelector(`[data-msgkey="${message.key}"]`);
            const richTextContainer = messageElem
                ? messageElem.querySelector('.km-msg-box-rich-text-container')
                : null;
            if (!richTextContainer) {
                throw new Error(`Email container not found: ${containerId}`);
            }
            const supportsShadowDom =
                typeof window !== 'undefined' &&
                window.customElements &&
                Element.prototype.attachShadow;
            container = supportsShadowDom
                ? document.createElement('mck-email-rich-message')
                : document.createElement('div');
            container.id = containerId;
            container.className = `km-mail-fixed-view ${containerId} mck-eml-container`;
            richTextContainer.appendChild(container);
        }

        const root = container.shadowRoot || container;
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = kmMailProcessor.getEmailRichMsgStyle();

        const mailElement = document.createElement('div');
        mailElement.setAttribute(
            'class',
            `km-email-rich-msg-container ${
                group.metadata?.source == 'MAIL_INTERCEPTOR'
                    ? 'km-email-source-mail-interceptor'
                    : ''
            }`
        );

        root.append(style, mailElement);
        return mailElement;
    }

    static getToAndCCMarkup(headers = []) {
        const { toUsers, ccUsers, bccUsers } = kmMailProcessor.getCcToBccUsers(headers);

        const isCcUserVisible = ccUsers ? 'vis' : 'n-vis';
        const isBccUserVisible = bccUsers ? 'vis' : 'n-vis';
        return `<div class="km-email-to-cc-container">
        <div class="km-email-to-heading km-email-headers" title="${toUsers}"><strong>${'to'}:</strong> <span>${toUsers} </span></div>
       <div class="km-email-cc-heading km-email-headers ${isCcUserVisible}" title="${ccUsers}"><strong>${'cc'}:</strong> <span>${ccUsers}</span></div>
       <div class="km-email-bcc-heading ${isBccUserVisible}" title="${bccUsers}"><strong>${'bcc'}:</strong> <span>${bccUsers}</span></div> 
        </div>`;
    }

    static appendEmailRichMsg(message, group, emlToHtml) {
        const richText =
            Kommunicate.isRichTextMessage(message.metadata) ||
            message.contentType == 3 ||
            emlToHtml;

        if ((richText && message.source === 7 && message.message) || emlToHtml) {
            const kmEmailRichMsg = document.getElementById(
                'km-email-' + message.groupId + '-' + message.key
            );
            if (!kmEmailRichMsg) {
                return;
            }
            const kmEmailRoot = kmEmailRichMsg.shadowRoot || kmEmailRichMsg;
            const kmEmailMainContainer = kmEmailRoot.querySelector('.km-email-rich-msg-container');

            kmEmailMainContainer.innerHTML = emlToHtml ? message.emlContent : message.message;

            // if (!emlToHtml) {
            // const users = kmMailProcessor.getToUsersFromGroup(group, message.to);
            // const fromAddress = group.members.find((mem) => mem.includes(message.to));
            // const fromMarkup = EmailDOMService.getFromMarkup({
            //     name: message.to,
            //     address: fromAddress || '',
            // });
            // const toAndCcMarkup = EmailDOMService.getToAndCCMarkup(users);
            // kmEmailMainContainer.insertAdjacentHTML('afterbegin', toAndCcMarkup);
            // kmEmailMainContainer.insertAdjacentHTML('afterbegin', fromMarkup);
            // }

            const anchors = kmEmailMainContainer.querySelectorAll('a');

            anchors.forEach((anchor) => {
                anchor.setAttribute('target', '_blank');
            });
        }
    }

    static getLoadingSpinner() {
        return `<div class="km-eml-loading">Loading...</div>`;
    }

    static getFromMarkup(from = {}) {
        return `<div class="km-email-from-heading" title="${from.address}"><strong class="km-email-from">${from.name}</strong> <p>&lt;${from.address}&gt;</p></div>`;
    }
}
