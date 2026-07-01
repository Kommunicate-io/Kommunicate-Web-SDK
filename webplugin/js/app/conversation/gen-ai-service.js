class GenAiService {
    constructor() {
        this.streams = {};
    }

    prepareTokenizedMessage = (msg) => {
        this.getStreamState(msg.key);
    };

    addTokenizeMsg = (...args) => {
        const [msg, className, $textMessage] = args;
        const stream = this.getStreamState(msg.key);
        stream.currentElement = null;
        stream.groupId = msg.groupId;
        stream.to = msg.to;
        stream.createdAtTime = stream.createdAtTime || msg.createdAtTime;

        if (!stream.currentElement) {
            stream.currentElement = document
                .querySelector(`div[data-msgkey="${msg.key}"]`)
                ?.querySelector(`.${className}`);
        }
        stream.currentStreamElement = document.querySelector(`div[data-msgkey="${msg.key}"]`);
        if (!stream.textMsgDiv) {
            const divElement = document.createElement('div');
            divElement.setAttribute('class', className);
            stream.textMsgDiv = divElement;
        }
        const tokenIndex = Number(msg.index);
        stream.currentMessageParts[tokenIndex] = msg.message;
        if (tokenIndex === stream.currentIndex + 1) {
            stream.currentIndex = tokenIndex;
            stream.currentMessage += `${msg.message} `;
        } else {
            stream.currentIndex = Math.max(stream.currentIndex, tokenIndex);
            stream.currentMessage =
                Object.keys(stream.currentMessageParts)
                    .map(Number)
                    .sort((firstIndex, secondIndex) => firstIndex - secondIndex)
                    .map((index) => stream.currentMessageParts[index])
                    .join(' ') + ' ';
        }
        const targetElement = stream.currentElement || stream.textMsgDiv;
        targetElement.innerHTML = KommunicateUtils.getSanitizedMarkdownMessage(
            stream.currentMessage
        );
        $applozic(targetElement).linkify({
            target: '_blank',
        });

        if (!stream.currentElement) {
            $textMessage.append(stream.textMsgDiv);
        }
    };

    getStreamState = (streamKey) => {
        if (!this.streams[streamKey]) {
            this.streams[streamKey] = {
                streamKey,
                currentElement: null,
                textMsgDiv: null,
                currentIndex: -1,
                currentMessage: '',
                currentMessageParts: {},
                currentStreamElement: null,
                groupId: null,
                to: null,
                createdAtTime: null,
                completed: false,
            };
        }
        return this.streams[streamKey];
    };

    completeCurrentStream = (streamKey) => {
        if (streamKey && this.streams[streamKey]) {
            this.streams[streamKey].completed = true;
        }
    };

    clearActiveStream = () => {
        this.resetState();
    };

    getNextTokenizedStreamElement = (msg) => {
        const completedStreams = Object.keys(this.streams)
            .map((key) => this.streams[key])
            .filter((stream) => stream.completed && stream.currentStreamElement);
        const matchedStream = this.getMatchingCompletedStream(completedStreams, msg);
        return matchedStream
            ? matchedStream.currentStreamElement
            : document.querySelector('div[data-msgkey^="tokenized_response"]');
    };

    getMatchingCompletedStream = (completedStreams, msg) => {
        if (!completedStreams.length) {
            return null;
        }
        const messageKeys = [
            msg.key,
            msg.oldKey,
            msg.pairedMessageKey,
            msg.metadata && msg.metadata.PLATFORM_MESSAGE_ID,
        ].filter(Boolean);
        const keyMatchedStream = completedStreams.find((stream) => {
            const streamElementKey =
                stream.currentStreamElement && stream.currentStreamElement.dataset.msgkey;
            return (
                messageKeys.indexOf(stream.streamKey) !== -1 ||
                messageKeys.indexOf(streamElementKey) !== -1
            );
        });
        if (keyMatchedStream) {
            return keyMatchedStream;
        }
        const sameConversationStreams = completedStreams.filter((stream) => {
            return (
                (msg.groupId && stream.groupId === msg.groupId) ||
                (!msg.groupId && msg.to && stream.to === msg.to)
            );
        });
        const streamsToCompare = sameConversationStreams.length
            ? sameConversationStreams
            : completedStreams;
        if (msg.createdAtTime) {
            return streamsToCompare.sort((firstStream, secondStream) => {
                return (
                    Math.abs(firstStream.createdAtTime - msg.createdAtTime) -
                    Math.abs(secondStream.createdAtTime - msg.createdAtTime)
                );
            })[0];
        }
        return streamsToCompare[0];
    };

    removeTokenizedStreamElement = (element, messageKey) => {
        if (!element) {
            return false;
        }

        const messageElement = document.querySelector(`div[data-msgkey="${messageKey}"]`);
        if (messageElement) {
            ['km-clubbing-first', 'km-clubbing-last'].forEach((className) => {
                messageElement.classList.remove(className);
                if (element.classList.contains(className)) {
                    messageElement.classList.add(className);
                }
            });
        }

        element.remove();
        const streamKey = Object.keys(this.streams).find(
            (key) => this.streams[key].currentStreamElement === element
        );
        delete this.streams[streamKey || messageKey];
        return true;
    };

    hasActiveStream = () => {
        return Boolean(Object.keys(this.streams).length);
    };

    resetState = () => {
        this.streams = {};
    };

    enableTextArea = (bool) => {
        if (CURRENT_GROUP_DATA.TOKENIZE_RESPONSE) {
            document.getElementById('mck-text-box').setAttribute('contenteditable', bool);
        }
    };
}
const genAiService = new GenAiService();
