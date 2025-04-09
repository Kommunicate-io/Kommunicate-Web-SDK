class EmlToHTML {
    setLoadingSpinner(emlMainContainer) {
        emlMainContainer.insertAdjacentHTML('afterbegin', EmailDOMService.getLoadingSpinner());
    }
    getFormattedMessage(message = '') {
        // replace all new line characters with <br> tag
        // some emails contain the [image: image.png] in the message so we need to remove it
        return message.replaceAll('\n', '<br>').replace(/\[\s*([a-zA-Z0-9]+):[^\]]*\s*\]/g, '');
    }

    async getEmlToHtml(msg, group, emlMessage) {
        const mainEmlContainer = document
            .getElementById('km-email-' + msg.groupId + '-' + msg.key)
            .shadowRoot.querySelector('.km-email-rich-msg-container');

        try {
            this.setLoadingSpinner(mainEmlContainer);

            const emailContainer = document.createElement('div');
            const subject = document.createElement('h4');

            emailContainer.append(subject);

            const data = await KommunicateUtils.getAndParseEml(msg.fileMeta.url, msg);
            // const fromMarkup = EmailDOMService.getFromMarkup(data.from);
            // const ccToBccMarkup = EmailDOMService.getToAndCCMarkup(data.headers || []);

            // emailContainer.insertAdjacentHTML('afterbegin', fromMarkup);
            // emailContainer.insertAdjacentHTML('afterbegin', `<div><svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11"><path fill="#BCBABA" fill-rule="nonzero" d="M12 3.64244378L7.82144281 0v2.08065889h-.0112584c-1.2252898.0458706-2.30872368.23590597-3.23022417.58877205-1.03614858.39436807-1.89047392.92952513-2.56710409 1.60169828-.53552482.53356847-.95771502 1.14100649-1.27501442 1.8173497-.08349984.17792235-.16437271.35624185-.23304899.54349718-.32987128.89954044-.56029331 1.87632619-.49311816 2.87991943C.02781163 9.76011309.1572833 10.5.30795828 10.5c0 0 .18801538-1.03695368.94795775-2.22482365.23267371-.36259621.50437656-.70533502.81698495-1.02186205l.0350887.03038182v-.06533086c.19420749-.19301397.40079923-.37828356.63497407-.54588006.63272238-.45433742 1.40748832-.8141536 2.32279668-1.0796471.74962217-.21763716 1.60432278-.34412883 2.54909064-.39019801h.20809286l-.00150112 2.08085746L12 3.64244378z"></path></svg> via email</div>`);
            // emailContainer.insertAdjacentHTML('beforeend', ccToBccMarkup);
            /**
             * If the email contain the content-type: multipart/alternative header then it will always have the html content
             * However, some emails might not have this header, and in those cases, the data.html will be undefined
             * So in that case we'll use data.text or msg.message as the email content.
             */
            if (data.html || data.text) {
                subject.setAttribute('class', 'km-email-heading');
                subject.append(
                    data.subject || window.Aside.props.t('companyPage.mailbox.noSubject')
                );
            }

            if (!data.html) {
                console.debug(
                    `Email message:${msg.key} doesn't have the content-type: multipart/alternative header`,
                    msg.groupId
                );
            }

            emailContainer.insertAdjacentHTML(
                'beforeend',
                window.DOMPurify.sanitize(
                    data.html || this.getFormattedMessage(data.text || msg.message)
                )
            );
            this.handleInlineAttachment(emailContainer, data.attachments);

            this.loadAttachmentAsync(this.excludeInlineAttachments(data.attachments), msg);

            EmailDOMService.appendEmailRichMsg(
                {
                    ...msg,
                    ...(emlMessage && {
                        emlContent: emailContainer.outerHTML,
                    }),
                },
                group,
                emlMessage
            );
        } catch (e) {
            console.error('Not able to parse eml data', e);
            kmUtils.sendLogEventInSentry('Not able to parse eml to html');
            return msg.message;
        }
    }

    loadAttachmentAsync(attachments, msg) {
        const wrapper = document.createElement('div');
        const attachmentWrapper = document.createElement('div');

        const emailContainer = document
            .getElementById('km-email-' + msg.groupId + '-' + msg.key)
            .shadowRoot.querySelector('.km-email-rich-msg-container');

        wrapper.insertAdjacentHTML(
            'beforeend',
            `<div class='km-email-attachment-heading'><strong>${attachments.length} ${
                attachments.length == 1 ? 'attachment' : 'attachments'
            }</strong></div>`
        );

        attachmentWrapper.setAttribute('class', 'km-email-attachment-container');
        wrapper.append(attachmentWrapper);

        const attachMentService = new AttachmentService();

        //Creating new instance here because if we define the instance inside the constructor it will hold the memory and will not be garbage collected
        const imageService = new ImageAttachmentService(attachMentService);
        const videoService = new VideoAttachmentService(attachMentService);
        const otherService = new OtherAttachmentService(attachMentService);

        wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
        `;

        attachments.map(async (attachment) => {
            switch (true) {
                case attachment.mimeType?.includes('image/'):
                    attachMentService.setAttachmentType(imageService);
                    break;
                case attachment.mimeType?.includes('video/'):
                    attachMentService.setAttachmentType(videoService);
                    break;
                default:
                    attachMentService.setAttachmentType(otherService);
                    break;
            }

            const htmlString = await attachMentService.getAttachment(attachment);
            attachmentWrapper.insertAdjacentHTML('beforeend', htmlString);

            emailContainer.append(wrapper);
        });
    }

    excludeInlineAttachments(attachments = []) {
        return attachments.filter((attachment) => attachment.disposition !== 'inline');
    }

    checkIfAttachmentIsInline = (url) => /^cid:/.test(url);

    handleInlineAttachment(kmEmailMainContainer, attachments) {
        kmEmailMainContainer.querySelectorAll('img').forEach((img) => {
            if (this.checkIfAttachmentIsInline(img.src)) {
                const cid = img.src.slice(4).trim();

                const attachment = attachments.find(
                    (attachment) => attachment.contentId && attachment.contentId === `<${cid}>`
                );
                if (attachment) {
                    img.src = URL.createObjectURL(
                        new Blob([attachment.content], {
                            type: attachment.mimeType,
                        })
                    );
                }
            }
        });
    }
}
const kmEmlToHtml = new EmlToHTML();
