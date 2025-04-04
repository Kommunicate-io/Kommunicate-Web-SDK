class EmailDOMService {
    static createEmailContainer(message, group) {
        const containerId = `km-email-${message.groupId}-${message.key}`;
        const container = document.getElementById(containerId);

        if (!container) {
            throw new Error(`Email container not found: ${containerId}`);
        }

        const shadowRoot = container.shadowRoot;
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

        shadowRoot.append(style, mailElement);
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
            const kmEmailMainContainer = kmEmailRichMsg.shadowRoot.querySelector(
                '.km-email-rich-msg-container'
            );

            kmEmailMainContainer.innerHTML = emlToHtml ? message.emlContent : message.message;

            if (!emlToHtml) {
                // const users = kmMailProcessor.getToUsersFromGroup(group, message.to);
                // const fromAddress = group.members.find((mem) => mem.includes(message.to));
                // const fromMarkup = EmailDOMService.getFromMarkup({
                //     name: message.to,
                //     address: fromAddress || '',
                // });
                // const toAndCcMarkup = EmailDOMService.getToAndCCMarkup(users);
                // kmEmailMainContainer.insertAdjacentHTML('afterbegin', toAndCcMarkup);
                // kmEmailMainContainer.insertAdjacentHTML('afterbegin', fromMarkup);
            }

            // const anchors = kmEmailMainContainer.querySelectorAll('a');

            // anchors.forEach((anchor) => {
            //     anchor.addEventListener('click', (event) => {
            //         window.Aside.handleSanitizedExternalLink(event, event.target);
            //     });
            //     anchor.setAttribute('target', '_blank');
            // });
        }
    }

    static getLoadingSpinner() {
        return `<div class="km-eml-loading">Loading...</div>`;
    }

    static getFromMarkup(from = {}) {
        return `<div class="km-email-from-heading" title="${from.address}"><strong class="km-email-from">${from.name}</strong> <p>&lt;${from.address}&gt;</p></div>`;
    }
}
