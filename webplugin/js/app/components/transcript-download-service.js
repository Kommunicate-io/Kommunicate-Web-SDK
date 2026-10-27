class TranscriptDownloadService {
    constructor() {
        this.appOptions = {};
        this.PAGE_SIZE = 50;
        // Safety cap so a runaway conversation can't loop forever (50 * 200 = 10k messages)
        this.MAX_PAGES = 200;
        this.MESSAGE_LIST_URL = '/rest/ws/message/v3/list';
        this.RECEIVED_MESSAGE_TYPES = [0, 4, 6];
        this.FORMAT = { TEXT: 'txt', PDF: 'pdf' };
        this.isDownloading = false;
    }

    init(appOptions = {}) {
        this.appOptions = appOptions;
    }

    // Locale overrides are stored under flat keys ('a.b.KEY'), English defaults are nested.
    getLabel = (key) =>
        MCK_LABELS['conversation.header.dropdown.' + key] ||
        MCK_LABELS['conversation.header.dropdown'][key];

    fetchPage = (groupId, endTime) =>
        new Promise((resolve, reject) => {
            window.Applozic.ALApiService.ajax({
                url:
                    this.appOptions.baseUrl +
                    this.MESSAGE_LIST_URL +
                    '?startIndex=0&groupId=' +
                    groupId +
                    '&pageSize=' +
                    this.PAGE_SIZE +
                    (endTime ? '&endTime=' + endTime : ''),
                type: 'get',
                global: false,
                success: resolve,
                error: reject,
            });
        });

    // The list API is paginated (newest first), so walk back until the first message.
    fetchConversationMessages = async (groupId) => {
        const messagesByKey = new Map();
        const userDetails = new Map();
        let endTime;

        for (let page = 0; page < this.MAX_PAGES; page++) {
            const data = await this.fetchPage(groupId, endTime);
            const messages = (data && data.message) || [];
            ((data && data.userDetails) || []).forEach((user) =>
                userDetails.set(user.userId, user)
            );
            messages.forEach((msg) => messagesByKey.set(msg.key, msg));

            if (messages.length < this.PAGE_SIZE) break;
            endTime = messages[messages.length - 1].createdAtTime;
        }

        return {
            messages: [...messagesByKey.values()].sort((a, b) => a.createdAtTime - b.createdAtTime),
            userDetails,
        };
    };

    isVisibleMessage = ({ contentType, metadata = {} }) => {
        const {
            DEFAULT,
            ATTACHMENT,
            LOCATION,
            TEXT_HTML,
        } = KommunicateConstants.MESSAGE_CONTENT_TYPE;
        return (
            [DEFAULT, ATTACHMENT, LOCATION, TEXT_HTML].includes(contentType) &&
            metadata.category !== 'HIDDEN' &&
            metadata.hide !== 'true' &&
            metadata.show !== 'false' &&
            !metadata.KM_ASSIGN &&
            !metadata.KM_STATUS
        );
    };

    getRichMessageOptions = (metadata) => {
        if (!metadata.templateId || !metadata.payload) return '';
        try {
            const payload = JSON.parse(metadata.payload);
            const options = Array.isArray(payload)
                ? payload.map((item) => item.name || item.title).filter(Boolean)
                : [];
            return options.length ? '[Options: ' + options.join(', ') + ']' : '';
        } catch (e) {
            return '';
        }
    };

    getMessageText = (message) => {
        const { ATTACHMENT, LOCATION, TEXT_HTML } = KommunicateConstants.MESSAGE_CONTENT_TYPE;
        const { contentType, fileMeta, metadata = {} } = message;
        const text = message.message || '';

        if (contentType === ATTACHMENT) {
            const name = (fileMeta && fileMeta.name) || 'file';
            const url = fileMeta && fileMeta.url ? ' ' + fileMeta.url : '';
            return [text, '[Attachment: ' + name + ']' + url].filter(Boolean).join('\n');
        }
        if (contentType === LOCATION) {
            try {
                const { lat, lon } = JSON.parse(text);
                return '[Location] https://maps.google.com/?q=' + lat + ',' + lon;
            } catch (e) {
                return '[Location]';
            }
        }
        const body =
            contentType === TEXT_HTML
                ? (new DOMParser().parseFromString(text, 'text/html').body.textContent || '').trim()
                : text;
        return [body, this.getRichMessageOptions(metadata)].filter(Boolean).join('\n');
    };

    buildEntries = ({ messages, userDetails }) =>
        messages.filter(this.isVisibleMessage).reduce((entries, message) => {
            const text = this.getMessageText(message);
            if (!text) return entries;

            const isReceived = this.RECEIVED_MESSAGE_TYPES.includes(message.type);
            const user = isReceived && userDetails.get(message.to);
            entries.push({
                sender: isReceived
                    ? (user && (user.displayName || user.userId)) || 'Agent'
                    : this.getLabel('TRANSCRIPT_SENDER_YOU'),
                time: new Date(message.createdAtTime).toLocaleString(),
                text,
            });
            return entries;
        }, []);

    toText = ({ title, entries }) =>
        [
            title,
            '='.repeat(title.length),
            '',
            ...entries.map(
                ({ sender, time, text }) => '[' + time + '] ' + sender + ':\n' + text + '\n'
            ),
        ].join('\n');

    escapeHtml = (value) =>
        String(value).replace(
            /[&<>"']/g,
            (char) =>
                ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])
        );

    toHtml = ({ title, entries }) =>
        '<!doctype html><html><head><meta charset="utf-8"><title>' +
        this.escapeHtml(title) +
        '</title><style>' +
        'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#1f2937;margin:32px;font-size:13px}' +
        'h1{font-size:18px;margin:0 0 24px;padding-bottom:12px;border-bottom:1px solid #e5e7eb}' +
        '.msg{margin:0 0 16px;page-break-inside:avoid}' +
        '.meta{color:#6b7280;font-size:11px;margin-bottom:4px}' +
        '.meta b{color:#111827;font-size:13px;margin-right:8px}' +
        '.text{white-space:pre-wrap;word-break:break-word}' +
        '</style></head><body><h1>' +
        this.escapeHtml(title) +
        '</h1>' +
        entries
            .map(
                ({ sender, time, text }) =>
                    '<div class="msg"><div class="meta"><b>' +
                    this.escapeHtml(sender) +
                    '</b>' +
                    this.escapeHtml(time) +
                    '</div><div class="text">' +
                    this.escapeHtml(text) +
                    '</div></div>'
            )
            .join('') +
        '</body></html>';

    downloadTextFile = (fileName, text) => {
        const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    // Uses the browser's "Save as PDF" print target: no PDF library in the widget bundle
    // and correct rendering for every script/language the conversation may contain.
    printAsPdf = (html) => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
        document.body.appendChild(iframe);
        const frameWindow = iframe.contentWindow;
        frameWindow.document.open();
        frameWindow.document.write(html);
        frameWindow.document.close();
        frameWindow.addEventListener('afterprint', () => iframe.remove());
        frameWindow.focus();
        frameWindow.print();
    };

    download = async (format) => {
        const groupId = CURRENT_GROUP_DATA.tabId;
        if (!groupId || this.isDownloading) return;
        this.isDownloading = true;
        try {
            const { messages, userDetails } = await this.fetchConversationMessages(groupId);
            const transcript = {
                title: this.getLabel('TRANSCRIPT_TITLE') + ' #' + groupId,
                entries: this.buildEntries({ messages, userDetails }),
            };
            if (format === this.FORMAT.PDF) {
                this.printAsPdf(this.toHtml(transcript));
            } else {
                this.downloadTextFile('conversation_' + groupId + '.txt', this.toText(transcript));
            }
        } catch (error) {
            console.error('Error while downloading the conversation transcript', error);
        } finally {
            this.isDownloading = false;
        }
    };
}

const transcriptDownloadService = new TranscriptDownloadService();
