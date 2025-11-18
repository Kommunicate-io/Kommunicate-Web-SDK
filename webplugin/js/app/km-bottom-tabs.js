(function (w) {
    function KmBottomTabs(params) {
        params = params || {};
        var kommunicateCommons = params.kommunicateCommons || w.kommunicateCommons || {};
        var documentRef = params.document || w.document;
        var whatsNewManager = params.whatsNewManager;
        var eventHistory = params.eventHistory || w.MCK_EVENT_HISTORY || [];

        function getLabels() {
            return (typeof w.MCK_LABELS === 'object' && w.MCK_LABELS) || {};
        }

        function getLabel(key, fallback) {
            var labels = getLabels();
            return (labels && labels[key]) || fallback;
        }

        function getKommunicateUI() {
            return params.KommunicateUI || w.KommunicateUI;
        }

        function getLastBottomTab() {
            return (
                (w.Kommunicate && w.Kommunicate._globals && w.Kommunicate._globals.lastBottomTab) ||
                null
            );
        }

        function setBottomTabState(tabType) {
            if (!documentRef) {
                return;
            }
            var tabs = documentRef.querySelectorAll('.km-bottom-tab');
            if (!tabs || !tabs.length) {
                return;
            }
            var themeBgClass = 'km-custom-widget-background-color';
            var targetTab = null;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].getAttribute('data-tab') === tabType) {
                    targetTab = tabs[i];
                    break;
                }
            }
            if (!targetTab) {
                for (var j = 0; j < tabs.length; j++) {
                    if (tabs[j].getAttribute('data-tab') === 'conversations') {
                        targetTab = tabs[j];
                        break;
                    }
                }
            }
            targetTab = targetTab || tabs[0];
            for (var k = 0; k < tabs.length; k++) {
                tabs[k].classList.remove('active');
                tabs[k].setAttribute('aria-selected', 'false');
                var icon = tabs[k].querySelector('.km-bottom-tab-icon');
                icon && icon.classList.remove(themeBgClass);
            }
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.setAttribute('aria-selected', 'true');
                var targetIcon = targetTab.querySelector('.km-bottom-tab-icon');
                targetIcon && targetIcon.classList.add(themeBgClass);
                w.Kommunicate = w.Kommunicate || {};
                w.Kommunicate._globals = w.Kommunicate._globals || {};
                w.Kommunicate._globals.lastBottomTab =
                    targetTab.getAttribute('data-tab') || 'conversations';
            }
        }

        function showBottomTabs() {
            if (
                kommunicateCommons &&
                typeof kommunicateCommons.show === 'function' &&
                typeof kommunicateCommons.hide === 'function'
            ) {
                kommunicateCommons.show('.km-bottom-tab-wrapper');
                return;
            }
            toggleBottomTabsDisplay(true);
        }

        function hideBottomTabs() {
            if (kommunicateCommons && typeof kommunicateCommons.hide === 'function') {
                kommunicateCommons.hide('.km-bottom-tab-wrapper');
                return;
            }
            toggleBottomTabsDisplay(false);
        }

        function toggleBottomTabsDisplay(show) {
            if (!documentRef || typeof documentRef.querySelectorAll !== 'function') {
                return;
            }
            var wrappers = documentRef.querySelectorAll('.km-bottom-tab-wrapper');
            wrappers.forEach(function (wrapper) {
                wrapper.style.display = show ? '' : 'none';
            });
        }

        function restoreLastBottomTab() {
            var lastTab = getLastBottomTab();
            if (!lastTab || lastTab === 'conversations') {
                return;
            }
            setTimeout(function () {
                handleBottomTabChange(lastTab);
            }, 0);
        }

        function isModernLayoutEnabled() {
            return (
                kommunicateCommons &&
                typeof kommunicateCommons.isModernLayoutEnabled === 'function' &&
                kommunicateCommons.isModernLayoutEnabled()
            );
        }

        function handleBottomTabChange(tabType, options) {
            options = options || {};
            setBottomTabState(tabType);
            showBottomTabs();

            var isModernLayout = isModernLayoutEnabled();
            var ui = getKommunicateUI();
            var messageInner =
                documentRef && documentRef.querySelector('#mck-message-cell .mck-message-inner');
            var activeConversationId =
                messageInner &&
                (messageInner.getAttribute('data-mck-id') ||
                    (messageInner.dataset && messageInner.dataset.mckId));
            var hasActiveConversation = isModernLayout && !!activeConversationId;

            if (tabType === 'conversations') {
                ui && typeof ui.setConversationTitle === 'function' && ui.setConversationTitle();
                if (Array.isArray(eventHistory)) {
                    eventHistory.length = 0;
                }
                kommunicateCommons.show('#mck-tab-conversation');
                kommunicateCommons.hide('#mck-tab-individual');
                kommunicateCommons.show('#mck-contacts-content');
                if (isModernLayout) {
                    setTimeout(function () {
                        var latestMessageInner =
                            documentRef &&
                            documentRef.querySelector('#mck-message-cell .mck-message-inner');
                        var lastTabId =
                            latestMessageInner &&
                            (latestMessageInner.getAttribute('data-mck-id') ||
                                (latestMessageInner.dataset && latestMessageInner.dataset.mckId));
                        if (lastTabId) {
                            kommunicateCommons.show('#mck-tab-individual');
                            kommunicateCommons.hide('#mck-tab-conversation');
                        }
                    }, 0);
                }
            }

            if (tabType === 'faqs') {
                ui &&
                    typeof ui.showFaqListHeaderState === 'function' &&
                    ui.showFaqListHeaderState();
                kommunicateCommons.hide('#km-whats-new-placeholder');
                ui &&
                    typeof ui.toggleModernFaqBackButton === 'function' &&
                    ui.toggleModernFaqBackButton(false);
                if (!options.skipFaqTrigger) {
                    var faqButton = documentRef && documentRef.getElementById('km-faq');
                    faqButton && faqButton.click();
                }
                kommunicateCommons.show('#mck-tab-conversation');
                kommunicateCommons.hide('.mck-conversation');
                kommunicateCommons.show('#faq-common');
                kommunicateCommons.hide('#mck-tab-individual');
                return;
            }

            if (tabType === 'whats-new') {
                whatsNewManager &&
                    typeof whatsNewManager.refresh === 'function' &&
                    whatsNewManager.refresh();
                kommunicateCommons.show('#mck-tab-conversation');
                kommunicateCommons.hide('#mck-tab-individual');
                kommunicateCommons.hide('#faq-common');
                kommunicateCommons.hide('.mck-conversation');
                kommunicateCommons.show('#km-whats-new-placeholder');
                ui &&
                    typeof ui.toggleModernFaqBackButton === 'function' &&
                    ui.toggleModernFaqBackButton(false);
                if (documentRef && typeof documentRef.getElementById === 'function') {
                    var tabTitle = documentRef.getElementById('mck-tab-title');
                    tabTitle &&
                        (tabTitle.textContent = getLabel('modern.nav.whatsnew', "What's New"));
                }
                kommunicateCommons.hide('#mck-tab-individual .mck-tab-link.mck-back-btn-container');
                kommunicateCommons.hide('#mck-tab-individual .mck-name-status-container');
                kommunicateCommons.hide('#mck-tab-individual');
                return;
            }

            ui &&
                typeof ui.toggleModernFaqBackButton === 'function' &&
                ui.toggleModernFaqBackButton(false);
            kommunicateCommons.hide('#km-whats-new-placeholder');
            kommunicateCommons.hide('#faq-common');
            kommunicateCommons.show('.mck-conversation');
            kommunicateCommons.show('#mck-contacts-content');
            if (documentRef && typeof documentRef.getElementById === 'function') {
                var tabTitleElement = documentRef.getElementById('mck-tab-title');
                tabTitleElement &&
                    (tabTitleElement.textContent = getLabel(
                        'conversations.title',
                        'Conversations'
                    ));
            }
            kommunicateCommons.hide('#mck-tab-individual .mck-tab-link.mck-back-btn-container');
            kommunicateCommons.hide('#mck-tab-individual .mck-name-status-container');
            kommunicateCommons.show('#mck-tab-conversation');
            var keepConversationHeader =
                tabType === 'conversations' && isModernLayout && !hasActiveConversation;
            ui &&
                typeof ui.showChat === 'function' &&
                ui.showChat({ keepConversationHeader: keepConversationHeader });
        }

        function getActiveTabFromDom() {
            if (!documentRef) {
                return 'conversations';
            }
            var activeTab = documentRef.querySelector('.km-bottom-tab.active');
            var tabType =
                (activeTab &&
                    (activeTab.getAttribute('data-tab') ||
                        (activeTab.dataset && activeTab.dataset.tab))) ||
                'conversations';
            return tabType.toString();
        }

        return {
            init: function () {
                setBottomTabState(getActiveTabFromDom());
            },
            handleChange: handleBottomTabChange,
            restoreLastTab: restoreLastBottomTab,
            show: showBottomTabs,
            hide: hideBottomTabs,
        };
    }

    w.KmBottomTabs = KmBottomTabs;
})(window);
