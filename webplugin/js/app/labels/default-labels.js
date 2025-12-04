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
        var setPlaceholderForSelector = function (selector, path) {
            var value = resolveLabel(path);
            if (value === null || typeof value === 'undefined') {
                return;
            }
            getNodes(selector).forEach(function (node) {
                node.setAttribute('placeholder', value);
            });
        };

        [
            { selector: '#mck-conversation-title', path: 'conversations.title' },
            { selector: '#mck-msg-new, #mck-sidebox-search .mck-box-title', path: 'start.new' },
        ].forEach(function (binding) {
            setHtmlAndTitleForSelector(binding.selector, binding.path);
        });
        var resolvedTag = resolveLabel('filter.conversation.list.RESOLVED_TAG');
        if (resolvedTag) {
            getNodes('.mck-conversation-status-badge.vis').forEach(function (node) {
                node.setAttribute('title', resolvedTag);
                node.setAttribute('aria-label', resolvedTag);
            });
        }
        [
            { selector: '#mck-contact-search-tab strong', path: 'search.contacts' },
            { selector: '#mck-group-search-tab strong', path: 'search.groups' },
            {
                selector:
                    '#mck-new-group, #mck-group-create-tab .mck-box-title, #mck-btn-group-create',
                path: 'create.group.title',
            },
            {
                selector: '#mck-group-info-btn, #mck-group-info-tab .mck-box-title',
                path: 'group.info.title',
            },
            { selector: '#mck-group-member-title', path: 'members.title' },
            {
                selector: '#mck-group-add-member .blk-lg-9, #mck-gm-search-box .mck-box-title',
                path: 'add.members.title',
            },
            { selector: '#mck-btn-group-update', path: 'group.info.update' },
            { selector: '#mck-btn-leave-group, #mck-btn-group-exit', path: 'exit.group' },
            { selector: '#mck-btn-clear-messages', path: 'clear.messages' },
            { selector: '#mck-block-button', path: 'block.user' },
            {
                selector: '#mck-loc-box .mck-box-title, #mck-share-loc-label',
                path: 'location.share.title',
            },
            { selector: '#mck-my-loc', path: 'my.location' },
            { selector: '#mck-btn-close-loc-box', path: 'close' },
            { selector: '#mck-loc-submit', path: 'send' },
        ].forEach(function (binding) {
            setHtmlAndTitleForSelector(binding.selector, binding.path);
        });

        [
            { selector: '#mck-gc-overlay-label', path: 'add.group.icon' },
            { selector: '#mck-msg-error', path: 'group.deleted' },
            { selector: '#mck-gc-title-label', path: 'group.title' },
            { selector: '#mck-gc-type-label', path: 'group.type' },
            { selector: '#mck-typing-label', path: 'typing' },
            { selector: '#mck-no-search-contacts', path: 'empty.contacts' },
            { selector: '#mck-no-search-groups', path: 'empty.groups' },
            { selector: '#mck-file-up-label', path: 'file.attachment' },
        ].forEach(function (binding) {
            setHtmlOnlyForSelector(binding.selector, binding.path);
        });

        [
            { selector: '#mck-btn-loc', path: 'location.share.title' },
            { selector: '#mck-file-up', path: 'file.attachment' },
            { selector: '.mck-file-attach-label', path: 'file.attach.title' },
            { selector: '#mck-msg-sbmt', path: 'send.message' },
            { selector: '#mck-btn-smiley', path: 'smiley' },
            { selector: '#mck-group-name-save', path: 'save' },
            { selector: '#mck-btn-group-icon-save', path: 'save' },
            { selector: '#mck-group-name-edit', path: 'edit' },
        ].forEach(function (binding) {
            setTitleOnlyForSelector(binding.selector, binding.path);
        });

        setPlaceholderForSelector(
            '#mck-contact-search-input, #mck-group-search-input, #mck-group-member-search',
            'search.placeholder'
        );
        setPlaceholderForSelector('#mck-loc-address', 'location.placeholder');
        document.getElementById('mck-text-box').dataset.text = MCK_LABELS['input.message'];
        document.getElementById('mck-char-warning-text').innerHTML = MCK_LABELS['char.limit.warn'];
        document
            .getElementById('km-faq-search-input')
            .setAttribute('placeholder', MCK_LABELS['search.faq']);
        var faqBackButton = document.getElementById('km-faq-back-btn');
        if (faqBackButton) {
            faqBackButton.setAttribute('aria-label', MCK_LABELS['faq.back.to.categories']);
            faqBackButton.setAttribute('title', MCK_LABELS['faq.back.to.categories']);
        }
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
            'waiting-queue-number': 'waiting.queue.message.waiting.queue.number',
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
            'km-conversations-empty-title': 'empty.conversations',
            'km-conversations-empty-subtitle': 'mck.empty.welcome.subtitle',
            'km-conversations-empty-cta': 'mck.empty.welcome.cta',
            'km-empty-conversation-eyebrow': 'mck.empty.welcome.eyebrow',
            'km-empty-conversation-title': 'mck.empty.welcome.title',
            'km-empty-conversation-subtitle': 'mck.empty.welcome.subtitle',
            'km-empty-conversation-cta': 'mck.empty.welcome.cta',
            'km-empty-conversation-continue': 'mck.empty.welcome.cta.continue',
            'km-empty-conversation-section-meta': 'mck.empty.welcome.section.meta',
        };
        Object.keys(htmlBindings).forEach(function (id) {
            setLabel(id, htmlBindings[id], 'html');
        });
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
            'mck-voice-speak-btn': 'voiceInterface.speak',
            'mck-voice-chat-btn': 'voiceInterface.chat',
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
        KommunicateUI.updateWelcomeCtaLabel && KommunicateUI.updateWelcomeCtaLabel();
    }
}

const kmLabel = new KMLabel();
