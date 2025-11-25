const path = require('path');
const buildDir = path.resolve(__dirname, 'build');
const version = new Date().getTime();
exports.version = version;
exports.KM_RELEASE_BRANCH = getCurrentBranch();

const STORAGE_FILES = [
    path.resolve(__dirname, 'js/app/storage/storage-service.js'),
    path.resolve(__dirname, 'js/app/storage/cookie-service.js'),
    path.resolve(__dirname, 'js/app/storage/session-service.js'),
    path.resolve(__dirname, 'js/app/storage/local-service.js'),
];
const MAIL_PARSER_FILES = [
    path.resolve(__dirname, 'js/app/conversation/mail-parser/index.js'),
    path.resolve(__dirname, 'js/app/conversation/mail-parser/attachment-service.js'),
    path.resolve(__dirname, 'js/app/conversation/mail-parser/eml-parser.js'),
    path.resolve(__dirname, 'js/app/conversation/mail-parser/style.js'),
    path.resolve(__dirname, 'js/app/conversation/mail-parser/dom-service.js'),
];

exports.SENTRY_SCRIPT = [path.resolve(__dirname, 'lib/js/sentry-error-tracker.js')];

exports.THIRD_PARTY_SCRIPTS = [
    path.resolve(__dirname, 'lib/js/mck-ui-widget.min.js'),
    path.resolve(__dirname, 'lib/js/howler-2.1.2.min.js'),
    path.resolve(__dirname, 'lib/js/tiny-slider-2.9.2.js'),
    path.resolve(__dirname, 'lib/js/mustache.js'),
    // path.resolve(__dirname, 'lib/js/sentry-error-tracker.js'),
    // path.resolve(__dirname, 'lib/js/intl-tel-lib.js'),
    path.resolve(__dirname, 'lib/js/dom-purify-3.1.4.min.js'),
    path.resolve(__dirname, 'lib/js/moment-js.2.29.4.min.js'),
    path.resolve(__dirname, 'lib/js/moment-timezone.0.5.23.min.js'),
    path.resolve(__dirname, 'lib/js/marked.min.js'),
];

exports.PLUGIN_JS_FILES = [
    path.resolve(__dirname, 'template/mck-icons.js'),
    path.resolve(__dirname, 'js/app/components/custom-element.js'),
    path.resolve(__dirname, 'lib/js/jquery.linkify.js'),
    path.resolve(__dirname, 'js/app/constants/km-allowed-tags.js'),
    path.resolve(__dirname, 'js/app/km-utils.js'),
    ...STORAGE_FILES,
    ...MAIL_PARSER_FILES,
    path.resolve(__dirname, 'js/app/applozic.jquery.js'),
    path.resolve(__dirname, 'knowledgebase/common.js'),
    path.resolve(__dirname, 'knowledgebase/kb.js'),
    path.resolve(__dirname, 'js/app/labels/default-labels.js'),
    path.resolve(__dirname, 'js/app/kommunicate-client.js'),
    path.resolve(__dirname, 'js/app/conversation/km-conversation-helper.js'),
    path.resolve(__dirname, 'js/app/conversation/km-conversation-service.js'),
    path.resolve(__dirname, 'js/app/kommunicate.js'),
    path.resolve(__dirname, 'js/app/km-richtext-markup-1.0.js'),
    path.resolve(__dirname, 'js/app/km-message-markup-1.0.js'),
    path.resolve(__dirname, 'js/app/km-event-listner.js'),
    path.resolve(__dirname, 'js/app/km-widget-custom-events.js'),
    path.resolve(__dirname, 'js/app/km-attachment-service.js'),
    // path.resolve(__dirname, 'js/app/zendesk-chat-service.js'),
    path.resolve(__dirname, 'js/app/km-nav-bar.js'),
    path.resolve(__dirname, 'js/app/km-top-bar.js'),
    path.resolve(__dirname, 'js/app/km-bottom-tabs.js'),
    path.resolve(__dirname, 'js/app/components/answer-feedback-service.js'),
    path.resolve(__dirname, 'js/app/components/typing-service.js'),
    path.resolve(__dirname, 'js/app/components/rating-service.js'),
    path.resolve(__dirname, 'js/app/conversation/gen-ai-service.js'),
    path.resolve(__dirname, 'js/app/map/mck-map-integration.js'),
    path.resolve(__dirname, 'js/app/km-whats-new.js'),
    path.resolve(__dirname, 'js/app/mck-sidebox-1.0.js'),
    path.resolve(__dirname, 'js/app/kommunicate.custom.theme.js'),
    path.resolve(__dirname, 'js/app/kommunicateCommons.js'),
    path.resolve(__dirname, 'js/app/km-rich-text-event-handler.js'),
    path.resolve(__dirname, 'js/app/kommunicate-ui.js'),
    path.resolve(__dirname, 'js/app/events/applozic-event-handler.js'),
    path.resolve(__dirname, 'js/app/km-post-initialization.js'),
    path.resolve(__dirname, 'js/app/mck-ringtone-service.js'),
    path.resolve(__dirname, 'js/app/media/typing-area-dom-service.js'),
    path.resolve(__dirname, 'js/app/media/media-service.js'),
    path.resolve(__dirname, 'js/app/media/media-dom-event-listener.js'),
];

exports.PLUGIN_CSS_FILES = [
    path.resolve(__dirname, 'lib/css/font-import.css'),
    path.resolve(__dirname, 'lib/css/mck-combined.min.css'),
    path.resolve(__dirname, 'css/app/mck-sidebox-1.0.css'),
    path.resolve(__dirname, 'css/app/km-voice-note.css'),
    path.resolve(__dirname, 'css/app/km-rich-message.css'),
    path.resolve(__dirname, 'lib/css/tiny-slider-2.9.2.css'),
    path.resolve(__dirname, 'css/app/km-sidebox.css'),
    // path.resolve(__dirname, 'lib/css/intl-tel-lib.css'),
    path.resolve(__dirname, 'css/app/style/style.css'),
];

exports.PLUGIN_BUNDLE_FILES = [
    path.resolve(__dirname, `${buildDir}/mck-app.min.js`),
    path.resolve(__dirname, `${buildDir}/kommunicateThirdParty.min.js`),
    path.resolve(__dirname, `${buildDir}/kommunicate-plugin.min.js`),
];

exports.THIRD_PARTY_FILE_INFO = [
    {
        source: path.join(__dirname, 'js/app/zendesk-chat-service.js'),
        outputName: `zendesk-chat-service-${version}.min.js`, // code is our and it can be changed that's why added the versioning
        type: 'js',
        shouldMinify: true,
    },
    {
        source: path.join(__dirname, 'lib/js/intl-tel-lib.js'),
        outputName: `intl-tel-lib.min.js`,
        type: 'js',
    },
    {
        source: path.join(__dirname, 'lib/css/intl-tel-lib.css'),
        outputName: `intl-tel-lib-${version}.min.css`,
        type: 'css',
        shouldMinify: true,
    },
    {
        source: [
            path.join(__dirname, 'lib/js/Fr.voice.js'),
            path.join(__dirname, 'lib/js/recorder.js'),
        ],
        outputName: `voice-note.min.js`,
        type: 'js',
        shouldMinify: true,
    },
    {
        source: [
            path.join(__dirname, 'js/app/voice/index.js'),
            path.join(__dirname, 'js/app/voice/mck-voice.js'),
        ],
        outputName: `voice-chat-${version}.min.js`,
        type: 'js',
        shouldMinify: true,
    },
    {
        source: path.join(__dirname, 'lib/js/crypto-js.4.0.min.js'),
        outputName: `crypto.min.js`,
        type: 'js',
    },
    {
        source: path.join(__dirname, 'js/app/sentry-8.39.0.js'),
        outputName: `sentry-${version}.min.js`,
        type: 'js',
        shouldMinify: true,
    },
    {
        source: path.join(__dirname, 'lib/js/marked.min.js'),
        outputName: `marked.min.js`,
        type: 'js',
    },
];

exports.getDynamicLoadFiles = function (dir) {
    return JSON.stringify({
        zendesk: {
            js: `${dir}/zendesk-chat-service-${version}.min.js`,
        },
        intlForPreChat: {
            js: `${dir}/intl-tel-lib.min.js`,
            css: `${dir}/intl-tel-lib-${version}.min.css`,
        },
        // for voice note
        voiceNote: {
            js: `${dir}/voice-note.min.js`,
        },
        crypto: {
            js: `${dir}/crypto.min.js`,
        },
        sentry: {
            js: `${dir}/sentry-${version}.min.js`,
        },
        voiceChat: {
            js: `${dir}/voice-chat-${version}.min.js`,
        },
    });
};

function getCurrentBranch() {
    try {
        const envBranch =
            process.env._BRANCH ||
            process.env.BRANCH ||
            process.env.AWS_BRANCH ||
            process.env.BRANCH_NAME ||
            process.env.FIREBASE_CI_BRANCH;
        if (envBranch) {
            return envBranch;
        }

        const branch = require('child_process')
            .execSync('git rev-parse --abbrev-ref HEAD', {
                cwd: __dirname,
                encoding: 'utf8',
            })
            .toString()
            .trim();

        return branch;
    } catch (error) {
        console.error('Error getting current branch:', error);

        return version; // Fallback if there's an error
    }
}
