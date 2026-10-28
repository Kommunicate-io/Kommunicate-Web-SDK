class TranscriptDownloadService {
    constructor() {
        this.appOptions = {};
        this.PAGE_SIZE = 50;
        // Safety cap so a runaway conversation can't loop forever (50 * 200 = 10k messages)
        this.MAX_PAGES = 200;
        this.MESSAGE_LIST_URL = '/rest/ws/message/v3/list';
        this.RECEIVED_MESSAGE_TYPES = [0, 4, 6];
        this.isDownloading = false;
    }

    init(appOptions = {}) {
        this.appOptions = appOptions;
    }

    isEnabled = () => !this.appOptions.disableTranscriptDownload;

    // CURRENT_GROUP_DATA.tabId can be overwritten by events from other conversations,
    // so read the conversation that is actually on screen. Only group conversations
    // are supported by the groupId based list API.
    getDisplayedGroupId = () => {
        const $messageInner = $applozic('#mck-message-cell .mck-message-inner');
        return $messageInner.data('isgroup') ? $messageInner.data('mck-id') : null;
    };

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
            !metadata.KM_STATUS &&
            !Object.prototype.hasOwnProperty.call(metadata, 'KM_SUMMARY')
        );
    };

    stripHtml = (html) =>
        (new DOMParser().parseFromString(html, 'text/html').body.textContent || '').trim();

    // Quick replies/buttons send an array payload; list templates send
    // { headerText, elements: [{ title, description }], buttons: [{ name | action.text }] }.
    getRichMessageText = (metadata) => {
        if (!metadata.templateId || !metadata.payload) return '';
        try {
            const payload = JSON.parse(metadata.payload);
            const isList = !Array.isArray(payload) && payload && typeof payload === 'object';
            const items = isList ? payload.buttons || [] : Array.isArray(payload) ? payload : [];
            const options = items
                .map((item) => item.name || item.title || (item.action && item.action.text))
                .filter(Boolean);
            const elements = isList
                ? (payload.elements || [])
                      .map((item) =>
                          [item.title, item.description && this.stripHtml(item.description)]
                              .filter(Boolean)
                              .join(': ')
                      )
                      .filter(Boolean)
                      .map((line) => '- ' + line)
                : [];
            return [
                isList && payload.headerText && this.stripHtml(payload.headerText),
                ...elements,
                options.length ? '[Options: ' + options.join(', ') + ']' : '',
            ]
                .filter(Boolean)
                .join('\n');
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
        const body = contentType === TEXT_HTML ? this.stripHtml(text) : text;
        return [body, this.getRichMessageText(metadata)].filter(Boolean).join('\n');
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

    // YYYY-MM-DD in local time, independent of browser locale formatting
    getFileDate = () => {
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    };

    download = async () => {
        const groupId = this.getDisplayedGroupId();
        if (!this.isEnabled() || !groupId || this.isDownloading) return;
        this.isDownloading = true;
        try {
            const { messages, userDetails } = await this.fetchConversationMessages(groupId);
            const transcript = {
                title: this.getLabel('TRANSCRIPT_TITLE'),
                entries: this.buildEntries({ messages, userDetails }),
            };
            // The conversation id is internal, so the file is named by date instead
            this.downloadTextFile(
                'conversation_' + this.getFileDate() + '.txt',
                this.toText(transcript)
            );
        } catch (error) {
            console.error('Error while downloading the conversation transcript', error);
        } finally {
            this.isDownloading = false;
        }
    };
}

const transcriptDownloadService = new TranscriptDownloadService();
