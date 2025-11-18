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

        function setText(id, text) {
            if (typeof doc === 'undefined') {
                return;
            }
            var target = doc.getElementById(id);
            target && (target.textContent = text || '');
        }

        function toggleElements(show) {
            var selectorsArr = Array.prototype.slice.call(arguments, 1);
            if (!selectorsArr.length) {
                return;
            }
            if (
                !kommunicateCommons ||
                typeof kommunicateCommons[show ? 'show' : 'hide'] !== 'function'
            ) {
                selectorsArr.forEach(function (selector) {
                    var nodes = doc.querySelectorAll(selector);
                    nodes.forEach(function (node) {
                        node.style.display = show ? '' : 'none';
                    });
                });
                return;
            }
            kommunicateCommons[show ? 'show' : 'hide'].apply(null, selectorsArr);
        }

        return {
            setIndividualTitle: function (text) {
                setText(selectors.individualTitle, text || defaults.individualTitle);
            },
            setConversationTitle: function (text) {
                setText(selectors.conversationTitle, text || defaults.conversationTitle);
            },
            setFaqTitle: function () {
                this.setIndividualTitle(defaults.faqTitle);
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
                var methodSelectors = [
                    selectors.avatar,
                    selectors.statusText,
                    selectors.statusIndicator,
                ];
                toggleElements(show, methodSelectors[0], methodSelectors[1], methodSelectors[2]);
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
        };
    }

    w.KmTopBar = KmTopBar;
})(window);
