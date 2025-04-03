class MailProcessor {
    async processMail(msg, group, emlMessage) {
        if (!this.checkIfMsgFromMail(msg, emlMessage)) return;

        await this.loadPostalMimeLib();
        this.appendEmailWrapper(msg, group);

        if (this.checkIfMsgInEmlFormat(msg)) {
            await kmEmlToHtml.getEmlToHtml(msg, group, emlMessage);
            return;
        }
        // Process old flow
        EmailDOMService.appendEmailRichMsg(msg, group);
    }

    async loadPostalMimeLib() {
        return new Promise((resolve, reject) => {
            const sc = document.createElement('script');
            sc.src = 'https://cdn.kommunicate.io/kommunicate/eml/eml-parser-2.4.3.js';
            sc.onload = () => {
                console.log('Postal Mime Lib Loaded');
                resolve();
            };
            sc.onerror = () => {
                console.error('Failed to load Postal Mime Lib');
                reject();
            };
            document.head.appendChild(sc);
        });
    }
    checkIfMsgFromMail(msg, emlMessage) {
        if (emlMessage) return true;

        const richText =
            Kommunicate.isRichTextMessage(msg.metadata) || msg.contentType == 3 || emlMessage;

        return richText && msg.source === 7 && msg.message;
    }

    checkIfMsgInEmlFormat(msg) {
        return msg?.fileMeta?.url.endsWith('.eml');
    }

    appendEmailWrapper(message, group) {
        const mailElement = EmailDOMService.createEmailContainer(message, group);
        return mailElement;
    }

    getCcToBccUsers(headers = []) {
        const filterHeaders = (headerKey) => {
            return headers
                .filter((header) => header.key.toLowerCase() === headerKey)
                .map((header) => header.value)
                .join(', ')
                .replaceAll('"', '');
        };

        return {
            toUsers: 'test',
            bccUsers: 'Test',
            ccUsers: 'Test',
        };
    }

    getToUsersFromGroup = function (group, msgFrom) {
        return Object.keys(group.users)
            .filter((user) => group.users[user].role !== 2 && user != msgFrom)
            .map((user) => ({ key: 'to', value: user }));
    };
}

window.kmMailProcessor = new MailProcessor();
