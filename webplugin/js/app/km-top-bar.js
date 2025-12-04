(function (w) {
    function KmTopBar(params) {
        params = params || {};
        var kommunicateCommons = params.kommunicateCommons;
        var doc = params.document || document;
        var labels = params.labels || {};
        var selectors = {
            conversationHeader: '#mck-tab-conversation',
            individualHeader: '#mck-tab-individual',
            individualTitle: 'mck-tab-title',
            conversationTitle: 'mck-conversation-title',
            backButton: '#mck-tab-individual .mck-tab-link.mck-back-btn-container',
            avatar: '.mck-agent-image-container',
            statusText: '.mck-agent-status-text',
            statusIndicator: '.mck-agent-status-indicator',
        };
        var defaults = {
            conversationTitle: labels['conversations.title'] || 'Conversations',
            individualTitle: labels['conversations.title'] || 'Conversations',
            faqTitle: labels['faq'] || 'FAQ',
        };
        var agentSelectors = [selectors.avatar, selectors.statusText, selectors.statusIndicator];

        function setText(id, text, updateTooltip) {
            if (!doc) {
                return;
            }
            var target = doc.getElementById(id);
            if (target) {
                target.textContent = text || '';
                if (updateTooltip !== false) {
                    target.setAttribute('title', text || '');
                }
            }
        }

        function toggleElements(show) {
            var selectorsArr = Array.prototype.slice.call(arguments, 1).filter(Boolean);
            if (!selectorsArr.length) {
                return;
            }
            var method = show ? 'show' : 'hide';
            if (!kommunicateCommons || typeof kommunicateCommons[method] !== 'function') {
                selectorsArr.forEach(function (selector) {
                    var nodes = doc.querySelectorAll(selector);
                    nodes.forEach(function (node) {
                        node.style.display = show ? '' : 'none';
                    });
                });
                return;
            }
            kommunicateCommons[method].apply(kommunicateCommons, selectorsArr);
        }

        return {
            setIndividualTitle: function (text, updateTooltip) {
                setText(selectors.individualTitle, text || defaults.individualTitle, updateTooltip);
            },
            setConversationTitle: function (text) {
                setText(selectors.conversationTitle, text || defaults.conversationTitle);
            },
            setFaqTitle: function () {
                this.setIndividualTitle(defaults.faqTitle);
            },
            setWhatsNewTitle: function (text) {
                var title = text || labels['modern.nav.whatsnew'] || "What's New";
                this.setIndividualTitle(title);
                this.setConversationTitle(title);
            },
            resetTitle: function () {
                this.setConversationTitle(defaults.conversationTitle);
                this.setIndividualTitle(defaults.individualTitle);
            },
            showConversationHeader: function () {
                toggleElements(true, selectors.conversationHeader);
                toggleElements(false, selectors.individualHeader);
            },
            showIndividualHeader: function (options) {
                options = options || {};
                toggleElements(true, selectors.individualHeader);
                if (options.keepConversationVisible) {
                    toggleElements(true, selectors.conversationHeader);
                } else {
                    toggleElements(false, selectors.conversationHeader);
                }
                this.toggleBackButton(!!options.showBackButton);
                this.toggleAvatar(options.showAvatar !== false);
            },
            showDualHeader: function () {
                toggleElements(true, selectors.conversationHeader, selectors.individualHeader);
            },
            toggleAvatar: function (show) {
                toggleElements.apply(null, [show].concat(agentSelectors));
            },
            toggleBackButton: function (show) {
                var backBtn = doc.querySelector(selectors.backButton);
                if (!backBtn) {
                    return;
                }
                if (show) {
                    backBtn.classList.remove('n-vis');
                    backBtn.classList.add('vis-table');
                } else {
                    backBtn.classList.add('n-vis');
                    backBtn.classList.remove('vis-table');
                }
            },
            addIndividualTitleClass: function (className) {
                var element = doc.getElementById(selectors.individualTitle);
                element && element.classList.add(className);
            },
            removeIndividualTitleClass: function (className) {
                var element = doc.getElementById(selectors.individualTitle);
                element && element.classList.remove(className);
            },
            getIndividualTitleAttribute: function () {
                var element = doc.getElementById(selectors.individualTitle);
                return element && element.getAttribute('title');
            },
        };
    }

    w.KmTopBar = KmTopBar;
})(window);
