class KMLabel {
    constructor() {
        this.defaultLocale = 'en';
    }

    getLabels(locale) {
        var registry = typeof window !== 'undefined' ? window.KM_LABELS_LANGUAGES || null : null;
        var localeKey = this.resolveLocaleKey(locale);
        if (registry && registry[localeKey]) {
            return this.deepClone(registry[localeKey]);
        }
        var fallback = registry && registry[this.defaultLocale];
        return fallback ? this.deepClone(fallback) : {};
    }

    resolveLocaleKey(locale) {
        var normalized = this.normalizeLocale(locale);
        if (
            normalized &&
            typeof window !== 'undefined' &&
            window.KM_LABELS_LANGUAGES &&
            window.KM_LABELS_LANGUAGES[normalized]
        ) {
            return normalized;
        }
        var detected = this.detectLocaleKey();
        return detected || this.defaultLocale;
    }

    normalizeLocale(value) {
        if (!value || typeof value !== 'string') {
            return null;
        }
        var parts = value.toLowerCase().split(/[-_]/);
        return parts[0] || null;
    }

    detectLocaleKey() {
        if (typeof navigator === 'undefined') {
            return this.defaultLocale;
        }
        var locale =
            (navigator.languages && navigator.languages[0]) ||
            navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage ||
            this.defaultLocale;
        return this.normalizeLocale(locale) || this.defaultLocale;
    }

    deepClone(value) {
        if (value === null || value === undefined) {
            return {};
        }
        return JSON.parse(JSON.stringify(value));
    }

    setLabels(MCK_LABELS = {}) {
        if (typeof document === 'undefined') {
            return;
        }
        var getNodes = function (selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
        };
        var resolveLabel = function (path) {
            if (!path) {
                return null;
            }
            var parts = path.split('.');
            var current = MCK_LABELS;
            var index = 0;
            while (current && index < parts.length) {
                var found = null;
                for (var len = parts.length - index; len > 0; len--) {
                    var candidateKey = parts.slice(index, index + len).join('.');
                    if (
                        Object.prototype.hasOwnProperty.call(current, candidateKey) &&
                        current[candidateKey] !== undefined &&
                        current[candidateKey] !== null
                    ) {
                        found = current[candidateKey];
                        index += len;
                        current = found;
                        break;
                    }
                }
                if (found === null) {
                    return null;
                }
            }
            return current === undefined || current === null ? null : current;
        };
        var setLabel = function (id, path, mode) {
            var node = document.getElementById(id);
            if (!node) {
                return;
            }
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            node[mode === 'text' ? 'innerText' : 'innerHTML'] = value;
        };
        var setHtmlAndTitleForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.innerHTML = value;
                node.setAttribute('title', value);
            });
        };
        var setHtmlOnlyForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.innerHTML = value;
            });
        };
        var setTitleOnlyForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.setAttribute('title', value);
            });
        };
        var setTitleAndAriaForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.setAttribute('title', value);
                node.setAttribute('aria-label', value);
            });
        };
        var setPlaceholderForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.setAttribute('placeholder', value);
            });
        };
        var setPlaceholderAndAriaLabelForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.setAttribute('placeholder', value);
                node.setAttribute('aria-label', value);
            });
        };
        var churnNoticeTemplate = [
            '{{#tokens}}',
            '{{#isHeadline}}<strong class="km-churn-message-highlight">{{text}}</strong>{{/isHeadline}}',
            '{{#isLabel}}<strong class="km-churn-message-label">{{text}}</strong>{{/isLabel}}',
            '{{#isText}}{{text}}{{/isText}}',
            '{{/tokens}}',
        ].join('');
        var renderChurnNotice = function () {
            var node = document.getElementById('km-churn-notice');
            if (!node) {
                return;
            }
            var value = resolveLabel('account.churned.notice');
            var noticeText = (value || node.textContent).trim();
            if (!noticeText) {
                return;
            }
            var sentenceMatch = noticeText.match(/^(.+?[.!?۔。！？])(\s*.*)?$/);
            var firstSentence = sentenceMatch ? sentenceMatch[1] : noticeText;
            var remainingText = sentenceMatch ? sentenceMatch[2] || '' : '';
            var labelRegex = /(^|[.!?۔。！？]\s+)([^.!?۔。！？:：\n][^:：\n]*[:：])/g;
            var cursor = 0;
            var match;
            var tokens = [
                {
                    isHeadline: true,
                    text: firstSentence,
                },
            ];
            var appendToken = function (text, type) {
                if (!text) {
                    return;
                }
                tokens.push({
                    isHeadline: false,
                    isLabel: type === 'label',
                    isText: type === 'text',
                    text: text,
                });
            };

            remainingText = remainingText.replace(/^\s+/, '');
            while ((match = labelRegex.exec(remainingText)) !== null) {
                appendToken(remainingText.slice(cursor, match.index), 'text');
                appendToken(match[1], 'text');
                appendToken(match[2], 'label');
                cursor = match.index + match[0].length;
            }
            appendToken(remainingText.slice(cursor), 'text');
            node.innerHTML = Mustache.to_html(churnNoticeTemplate, {
                tokens: tokens,
            });
        };

        [{ selector: '#mck-conversation-title', path: 'conversations.title' }].forEach(function (
            binding
        ) {
            setHtmlAndTitleForSelector(binding.selector, binding.path);
        });
        var isVoiceChatEnabled = Boolean(
            typeof kommunicate === 'object' &&
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.voiceChat
        );
        var setButtonLabel = function (selector, path) {
            var label = resolveLabel(path);
            if (!label) {
                return;
            }
            getNodes(selector).forEach(function (node) {
                var textNode = node.querySelector('span');
                textNode ? (textNode.innerHTML = label) : (node.innerHTML = label);
                node.setAttribute('title', label);
                node.setAttribute('aria-label', label);
            });
        };
        if (isVoiceChatEnabled) {
            setButtonLabel(
                '#mck-msg-new, #km-conversations-empty-cta, #km-empty-conversation-cta',
                'start.chat'
            );
            setButtonLabel(
                '#km-start-with-voice-cta, #km-conversations-empty-voice-cta, #km-empty-conversation-voice-cta',
                'start.voice'
            );
            getNodes(
                '#mck-msg-new, #km-conversations-empty-cta, #km-empty-conversation-cta'
            ).forEach(function (node) {
                node.classList.remove('km-legacy-cta');
            });
        } else {
            setButtonLabel('#mck-msg-new', 'start.new');
            setButtonLabel(
                '#km-conversations-empty-cta, #km-empty-conversation-cta',
                'mck.empty.welcome.cta'
            );
            getNodes(
                '#mck-msg-new, #km-conversations-empty-cta, #km-empty-conversation-cta'
            ).forEach(function (node) {
                node.classList.add('km-legacy-cta');
            });
        }
        var resolvedTag = resolveLabel('filter.conversation.list.RESOLVED_TAG');
        if (resolvedTag) {
            getNodes('.mck-conversation-status-badge.vis').forEach(function (node) {
                node.setAttribute('title', resolvedTag);
                node.setAttribute('aria-label', resolvedTag);
            });
        }
        [
            {
                selector: '#mck-btn-clear-messages',
                path: 'clear.messages',
            },
            {
                selector: '#mck-loc-box .mck-box-title',
                path: 'location.share.title',
            },
            { selector: '#mck-my-loc', path: 'my.location' },
            { selector: '#mck-btn-close-loc-box', path: 'close' },
            { selector: '#mck-loc-submit', path: 'send' },
        ].forEach(function (binding) {
            setHtmlAndTitleForSelector(binding.selector, binding.path);
        });

        [
            { selector: '#mck-msg-error', path: 'group.deleted' },
            { selector: '#mck-typing-label', path: 'typing' },
        ].forEach(function (binding) {
            setHtmlOnlyForSelector(binding.selector, binding.path);
        });

        [
            { selector: '#mck-btn-loc', path: 'location.share.title' },
            { selector: '#mck-file-up', path: 'file.attachment' },
            { selector: '#mck-msg-sbmt', path: 'send.message' },
            { selector: '#mck-btn-smiley', path: 'smiley' },
            { selector: '#mck-img-file-up', path: 'upload.image' },
            { selector: '#mck-vid-file-up', path: 'upload.video' },
            { selector: '#mck-mic-animation-container', path: 'voice.input' },
            { selector: '#mck-mic-btn-container', path: 'voice.input.options' },
            { selector: '#mck-voice-web', path: 'voice.mode' },
            { selector: '#intent-option', path: 'quick.replies' },
            { selector: '#options', path: 'options' },
            {
                selector: '#mck-tab-option-panel [data-toggle="mckdropdown"]',
                path: 'conversation.options',
            },
            { selector: '#close', path: 'reply.preview.close' },
            { selector: '.km-faqsearch-clear-action', path: 'search.clear' },
            { selector: '#km-empty-faq-search-clear', path: 'search.clear' },
            { selector: '.voiceNote', path: 'micOptions.dropup.VOICE_NOTE_TRIGGER' },
            { selector: '.voiceInput', path: 'micOptions.dropup.VOICE_INPUT_TRIGGER' },
            { selector: '#delete-recording', path: 'recording.delete' },
            { selector: '#pause-btn', path: 'recording.pause' },
            { selector: '#play-btn', path: 'recording.play' },
            { selector: '#send-btn', path: 'recording.send' },
            { selector: '#mck-stop-recording', path: 'recording.stop' },
            { selector: '#mck-voice-repeat-last-msg', path: 'voiceInterface.repeatLastMsg' },
            { selector: '.chat-popup-widget-close-btn-container', path: 'popup.close' },
            { selector: '#km-csat-trigger', path: 'conversation.header.dropdown.CSAT_RATING_TEXT' },
            {
                selector: '#km-restart-conversation',
                path: 'conversation.header.dropdown.RESTART_CONVERSATION',
            },
            {
                selector: '#user-overide-voice-output',
                path: 'conversation.header.dropdown.USER_OVERIDE_VOICE_OUTPUT_ON',
            },
            { selector: '#km-faq-option', path: 'conversation.header.dropdown.FAQ' },
            { selector: '#km-talk-to-human', path: 'conversation.header.dropdown.HANDOFF' },
        ].forEach(function (binding) {
            setTitleAndAriaForSelector(binding.selector, binding.path);
        });
        [{ selector: '.mck-file-attach-label', path: 'file.attach.title' }].forEach(function (
            binding
        ) {
            setTitleOnlyForSelector(binding.selector, binding.path);
        });

        setPlaceholderAndAriaLabelForSelector('#mck-loc-address', 'location.placeholder');
        setPlaceholderAndAriaLabelForSelector(
            '#mck-feedback-comment',
            'csat.rating.CONVERSATION_REVIEW_PLACEHOLDER'
        );
        setPlaceholderAndAriaLabelForSelector('#km-faq-search-input', 'search.faq');
        setPlaceholderAndAriaLabelForSelector('#km-empty-faq-search', 'search.faq');
        document.getElementById('mck-text-box').dataset.text = MCK_LABELS['input.message'];
        document.getElementById('mck-char-warning-text').innerHTML = MCK_LABELS['char.limit.warn'];
        var faqBackButton = document.getElementById('km-faq-back-btn');
        if (faqBackButton) {
            faqBackButton.setAttribute('aria-label', MCK_LABELS['faq.back.to.categories']);
            faqBackButton.setAttribute('title', MCK_LABELS['faq.back.to.categories']);
        }
        ['1', '2', '3', '4', '5'].forEach(function (starValue) {
            var starInput = document.getElementById('star' + starValue);
            if (!starInput) {
                return;
            }
            var label =
                resolveLabel('csat.rating.STAR_' + starValue) ||
                (starValue === '1' ? '1 star' : starValue + ' stars');
            starInput.setAttribute('aria-label', label);
            starInput.setAttribute('title', label);
        });
        var htmlBindings = {
            'mck-no-faq-found': 'looking.for.something.else',
            'km-internet-disconnect-msg': 'offline.msg',
            'km-socket-disconnect-msg': 'socket-disconnect.msg',
            'talk-to-human-link': 'talk.to.agent',
            'mck-collect-email': 'how.to.reachout',
            'mck-email-error-alert': 'email.error.alert',
            'mck-resolved-text': 'csat.rating.CONVERSATION_RESOLVED',
            'mck-rated-text': 'csat.rating.CONVERSATION_RATED',
            'mck-other-queries': 'csat.rating.OTHER_QUERIES',
            'mck-restart-conversation': 'csat.rating.RESTART_CONVERSATION',
            'mck-submit-comment': 'csat.rating.SUBMIT_RATING',
            'wq-msg-first-Part': 'waiting.queue.message.first.Part',
            'wq-msg-last-part': 'waiting.queue.message.last.part',
            'mck-rate-error': 'csat.rating.RATE_ERROR_MSG',
            'km-option-talk-to-human-text': 'conversation.header.dropdown.HANDOFF',
            'km-option-faq-text': 'conversation.header.dropdown.FAQ',
        };
        var textBindings = {
            'km-csat-trigger-text': 'conversation.header.dropdown.CSAT_RATING_TEXT',
            'km-restart-conversation-text': 'conversation.header.dropdown.RESTART_CONVERSATION',
            'km-voice-note-trigger-text': 'micOptions.dropup.VOICE_NOTE_TRIGGER',
            'km-voice-input-trigger-text': 'micOptions.dropup.VOICE_INPUT_TRIGGER',
            'km-bottom-tab-conversations-text': 'modern.nav.conversations',
            'km-bottom-tab-faq-text': 'modern.nav.faqs',
            'km-bottom-tab-whatsnew-text': 'modern.nav.whatsnew',
            'km-bottom-tab-empty-text': 'modern.nav.empty',
            'km-churn-banner-text': 'account.churned.banner',
            'km-conversations-empty-title': 'empty.conversations',
            'km-conversations-empty-subtitle': 'mck.empty.welcome.subtitle',
            'km-empty-conversation-eyebrow': 'mck.empty.welcome.eyebrow',
            'km-empty-conversation-title': 'mck.empty.welcome.title',
            'km-empty-conversation-subtitle': 'mck.empty.welcome.subtitle',
            'km-empty-conversation-continue': 'mck.empty.welcome.cta.continue',
            'km-local-file-system-warning-description': 'local.file.warning.description',
            'km-local-file-system-warning-link': 'local.file.warning.learnMore',
            'mck-offline-message-box': 'offline.message.default',
            'km-text-req-error-label': 'form.error.required',
            'mck-form-field-error-alert': 'form.error.invalidValue',
            'km-no-results-found': 'faq.search.noResults',
            'km-whats-new-empty-text': 'whatsnew.empty',
            'km-csat-feedback-heading': 'csat.rating.FEEDBACK_HEADING',
            'km-label-to': 'form.label.to',
            'km-label-user-id': 'form.label.userId',
            'km-loc-lat-label': 'location.coordinates.lat',
            'km-loc-lon-label': 'location.coordinates.lon',
        };
        Object.keys(htmlBindings).forEach(function (id) {
            setLabel(id, htmlBindings[id], 'html');
        });
        renderChurnNotice();
        Object.keys(textBindings).forEach(function (id) {
            setLabel(id, textBindings[id], 'text');
        });

        var kmCollapseTab = document.getElementById('km-bottom-tab-collapse-text');
        if (kmCollapseTab) {
            kmCollapseTab.innerText = MCK_LABELS['modern.nav.collapse'];
            var collapseButton =
                (typeof kmCollapseTab.closest === 'function' &&
                    kmCollapseTab.closest('.km-bottom-tab')) ||
                null;
            if (collapseButton) {
                collapseButton.setAttribute('aria-label', MCK_LABELS['modern.nav.collapse']);
            }
        }

        var appendHtmlBindings = {
            'mck-voice-speak-btn-label': 'voiceInterface.speak',
            'mck-voice-chat-btn-label': 'voiceInterface.chat',
            'mck-voice-interface-back-btn': 'voiceInterface.back',
            'mck-voice-repeat-last-msg': 'voiceInterface.repeatLastMsg',
        };
        Object.keys(appendHtmlBindings).forEach(function (id) {
            var node = document.getElementById(id);
            if (!node) {
                return;
            }
            if (node.dataset && node.dataset.labelSet === '1') {
                return;
            }
            var value = resolveLabel(appendHtmlBindings[id]);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            node.insertAdjacentHTML('beforeend', value);
            node.dataset && (node.dataset.labelSet = '1');
        });

        var kmWelcomeSearch = document.getElementById('km-empty-faq-search');
        if (kmWelcomeSearch) {
            var searchLabel =
                MCK_LABELS['search.faq'] || kmWelcomeSearch.placeholder || 'Search in FAQs...';
            kmWelcomeSearch.placeholder = searchLabel;
            kmWelcomeSearch.setAttribute('aria-label', searchLabel);
        }
        var kmWelcomeAskAnything = document.getElementById('km-welcome-ask-anything-input');
        if (kmWelcomeAskAnything) {
            var askAnythingLabel =
                MCK_LABELS['search.askAnything'] ||
                kmWelcomeAskAnything.placeholder ||
                'Ask me anything';
            kmWelcomeAskAnything.placeholder = askAnythingLabel;
            kmWelcomeAskAnything.setAttribute('aria-label', askAnythingLabel);
        }
        KommunicateUI.updateWelcomeCtaLabel && KommunicateUI.updateWelcomeCtaLabel();
    }
}

const kmLabel = new KMLabel();
