(function (w) {
    function KmBottomTabs(params) {
        params = params || {};
        var kommunicateCommons = params.kommunicateCommons || w.kommunicateCommons || {};
        var documentRef = params.document || w.document;
        var whatsNewManager = params.whatsNewManager;
        var baseEventHistory = params.eventHistory || w.MCK_EVENT_HISTORY || [];
        var eventHistory = Array.isArray(baseEventHistory) ? baseEventHistory.slice() : [];

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
        function getTopBarManager() {
            return params.topBarManager;
        }

        var TAB_ACTIVE_CLASS_PREFIX = 'active-tab-';
        var SUBSECTION_ACTIVE_CLASS_PREFIX = 'active-subsection-';
        var COLLAPSE_TAB_TYPE = 'collapse';

        function normalizeSubsection(subsection) {
            if (!subsection) {
                return 'conversation-list';
            }
            var value =
                typeof subsection.toString === 'function'
                    ? subsection.toString().trim()
                    : String(subsection).trim();
            return value.length ? value : 'conversation-list';
        }

        function getDefaultSubsectionForTab(tabType) {
            switch (tabType) {
                case 'faqs': {
                    var hasFaqCategory =
                        w.kommunicate &&
                        w.kommunicate._globals &&
                        w.kommunicate._globals.faqCategory;
                    return hasFaqCategory ? 'faq-list' : 'faq-category';
                }
                case 'whats-new':
                    return 'whats-new';
                case 'no-conversations':
                    return 'welcome';
                case 'conversations':
                default:
                    return 'conversation-list';
            }
        }

        function normalizeTabType(tabType) {
            if (!tabType) {
                return 'conversations';
            }
            var value =
                typeof tabType.toString === 'function'
                    ? tabType.toString().trim()
                    : String(tabType).trim();
            return value.length ? value : 'conversations';
        }

        function updateActiveTabClass(tabType) {
            if (!documentRef) {
                return;
            }
            var container = documentRef.getElementById('mck-sidebox-content');
            if (!container || !container.classList) {
                return;
            }
            var normalizedTabType = normalizeTabType(tabType);
            Array.prototype.slice
                .call(container.classList)
                .filter(function (className) {
                    return className.indexOf(TAB_ACTIVE_CLASS_PREFIX) === 0;
                })
                .forEach(function (activeClass) {
                    container.classList.remove(activeClass);
                });
            container.classList.add(TAB_ACTIVE_CLASS_PREFIX + normalizedTabType);
        }

        function updateActiveSubsectionClass(subsection) {
            if (!documentRef) {
                return;
            }
            var normalizedSubsection = normalizeSubsection(subsection);
            var container = documentRef.getElementById('mck-sidebox-content');
            if (!container || !container.classList) {
                return;
            }
            Array.prototype.slice
                .call(container.classList)
                .filter(function (className) {
                    return className.indexOf(SUBSECTION_ACTIVE_CLASS_PREFIX) === 0;
                })
                .forEach(function (activeClass) {
                    container.classList.remove(activeClass);
                });
            container.classList.add(SUBSECTION_ACTIVE_CLASS_PREFIX + normalizedSubsection);
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
            var tabArray = Array.prototype.slice.call(tabs);
            var targetTab = null;
            for (var i = 0; i < tabArray.length; i++) {
                if (tabArray[i].getAttribute('data-tab') === tabType) {
                    targetTab = tabArray[i];
                    break;
                }
            }
            if (!targetTab) {
                for (var j = 0; j < tabArray.length; j++) {
                    if (tabArray[j].getAttribute('data-tab') === 'conversations') {
                        targetTab = tabArray[j];
                        break;
                    }
                }
            }
            targetTab = targetTab || tabArray[0];
            tabArray.forEach(function (tab) {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                var icon = tab.querySelector('.km-bottom-tab-icon');
                icon && icon.classList.remove(themeBgClass);
            });
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

        function getEmptyTabButton() {
            if (!documentRef) {
                return null;
            }
            return documentRef.querySelector('.km-bottom-tab[data-tab="no-conversations"]');
        }

        function getConversationTabButton() {
            if (!documentRef) {
                return null;
            }
            return documentRef.querySelector('.km-bottom-tab[data-tab="conversations"]');
        }

        function handleCollapseAction() {
            if (!documentRef || typeof documentRef.getElementById !== 'function') {
                return false;
            }
            var closeButton = documentRef.getElementById('km-chat-widget-close-button');
            if (closeButton && typeof closeButton.click === 'function') {
                closeButton.click();
                return true;
            }
            return false;
        }

        function toggleEmptyTabVisibility(show) {
            var emptyTab = getEmptyTabButton();
            var conversationTab = getConversationTabButton();
            if (!emptyTab) {
                return;
            }
            if (show) {
                emptyTab.setAttribute('aria-hidden', 'false');
                if (conversationTab) {
                    conversationTab.classList.remove('active');
                    conversationTab.setAttribute('aria-selected', 'false');
                }
            } else {
                emptyTab.classList.remove('active');
                emptyTab.setAttribute('aria-selected', 'false');
                emptyTab.setAttribute('aria-hidden', 'true');
                if (conversationTab) {
                    conversationTab.setAttribute('aria-hidden', 'false');
                }
            }
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

        function getActiveConversationId() {
            var messageInner =
                documentRef && documentRef.querySelector('#mck-message-cell .mck-message-inner');
            return (
                messageInner &&
                (messageInner.getAttribute('data-mck-id') ||
                    (messageInner.dataset && messageInner.dataset.mckId))
            );
        }

        function isConversationTabActive() {
            return getActiveTabFromDom() === 'conversations';
        }

        function showNoConversationsTab() {
            toggleEmptyTabVisibility(true);
            handleBottomTabChange('no-conversations', {
                skipFaqTrigger: true,
                fromEmptyState: true,
            });
        }

        function hideNoConversationsTab() {
            toggleEmptyTabVisibility(false);
            var kmUi = getKommunicateUI();
            kmUi && kmUi.setHasConversationHistory(true);
            if (getActiveTabFromDom() === 'no-conversations') {
                handleBottomTabChange('conversations', {
                    skipFaqTrigger: true,
                    fromEmptyState: true,
                });
            }
            kommunicateCommons.hide('#mck-no-conversations');
        }

        function showBottomTabs() {
            if (!isModernLayoutEnabled()) {
                toggleBottomTabsDisplay(false);
                return;
            }
            toggleBottomTabsDisplay(true);
        }

        function hideBottomTabs() {
            kommunicateCommons.hide('.km-bottom-tab-wrapper');
        }

        function toggleBottomTabsDisplay(show) {
            if (!documentRef || typeof documentRef.querySelectorAll !== 'function') {
                return;
            }
            var wrappers = documentRef.querySelectorAll('.km-bottom-tab-wrapper');
            for (var i = 0; i < wrappers.length; i++) {
                wrappers[i].style.display = show ? '' : 'none';
            }
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
            return kommunicateCommons && kommunicateCommons.isModernLayoutEnabled();
        }

        function handleBottomTabChange(tabType, options) {
            options = options || {};
            var resolvedTabType = normalizeTabType(tabType);
            var activeConversationId = getActiveConversationId();

            // If a conversation is already active, avoid forcing the welcome tab and keep the thread view.
            if (resolvedTabType === 'no-conversations' && activeConversationId) {
                resolvedTabType = 'conversations';
            }
            if (resolvedTabType === COLLAPSE_TAB_TYPE) {
                handleCollapseAction();
                return;
            }
            setBottomTabState(resolvedTabType);
            showBottomTabs();
            updateActiveTabClass(resolvedTabType);

            var ui = getKommunicateUI();
            var isModernLayout = isModernLayoutEnabled();
            var isListView =
                ui && typeof ui.isConversationListView === 'boolean'
                    ? ui.isConversationListView
                    : !isModernLayout; // default layout starts in list view
            var hasActiveConversation = !!activeConversationId;

            var subsectionToApply = getDefaultSubsectionForTab(resolvedTabType);
            if (resolvedTabType === 'conversations') {
                subsectionToApply =
                    hasActiveConversation && !isListView
                        ? 'conversation-individual'
                        : 'conversation-list';
            }
            updateActiveSubsectionClass(subsectionToApply);

            if (resolvedTabType === 'conversations') {
                // Preserve individual view when a conversation is active.
                ui.showConversationList();
                ui.setConversationTitle();
                if (Array.isArray(eventHistory)) {
                    eventHistory.length = 0; // local copy only
                }

                if (isModernLayout && !isListView) {
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
                            updateActiveSubsectionClass('conversation-individual');
                        }
                    }, 0);
                }
            }

            if (resolvedTabType === 'no-conversations') {
                var emptyTitle =
                    (typeof MCK_LABELS === 'object' &&
                        MCK_LABELS &&
                        MCK_LABELS['modern.nav.empty']) ||
                    'Welcome';
                ui.setConversationTitle(emptyTitle);
                if (ui && ui.hasConversationHistory === false && ui.toggleConversationsEmptyState) {
                    ui.toggleConversationsEmptyState(true);
                }
                ui.updateWelcomeCtaLabel();
                var topBarManager = getTopBarManager();
                if (topBarManager) {
                    try {
                        topBarManager.showConversationHeader();
                        topBarManager.toggleAvatar(false);
                        topBarManager.toggleBackButton(false);
                    } catch (e) {}
                }
                return;
            }

            if (resolvedTabType === 'faqs') {
                var faqButton = documentRef && documentRef.getElementById('km-faq');
                faqButton && faqButton.click();
                return;
            }

            if (resolvedTabType === 'whats-new') {
                whatsNewManager.refresh();
                ui.toggleModernFaqBackButton(false);
                if (documentRef && typeof documentRef.getElementById === 'function') {
                    var tabTitle = documentRef.getElementById('mck-tab-title');
                    var conversationTitle = documentRef.getElementById('mck-conversation-title');
                    var whatsNewLabel = getLabel('modern.nav.whatsnew', "What's New");
                    tabTitle && (tabTitle.textContent = whatsNewLabel);
                    conversationTitle && (conversationTitle.textContent = whatsNewLabel);
                }
                return;
            }

            ui.toggleModernFaqBackButton(false);
            if (documentRef && typeof documentRef.getElementById === 'function') {
                var tabTitleElement = documentRef.getElementById('mck-tab-title');
                tabTitleElement &&
                    (tabTitleElement.textContent = getLabel(
                        'conversations.title',
                        'Conversations'
                    ));
            }

            var keepConversationHeader =
                resolvedTabType === 'conversations' && isModernLayout && !hasActiveConversation;
            ui.showChat({ keepConversationHeader: keepConversationHeader });
        }

        return {
            init: function () {
                var ui = getKommunicateUI();
                var initialTab = normalizeTabType(getActiveTabFromDom());
                var hasLastTab = !!getLastBottomTab();
                var activeConversationId = getActiveConversationId();

                // If a conversation is already active (e.g., auto-open settings), prefer the conversations tab.
                if (ui && activeConversationId) {
                    ui.setHasConversationHistory && ui.setHasConversationHistory(true);
                    initialTab = 'conversations';
                } else if (ui && ui.hasConversationHistory === false) {
                    if (!isModernLayoutEnabled()) {
                        // In default layout, keep the list view and skip the welcome tab to avoid flicker.
                        initialTab = 'conversations';
                        ui.toggleConversationsEmptyState && ui.toggleConversationsEmptyState(false);
                    } else {
                        // Modern layout shows the welcome tab when there's no history.
                        initialTab = 'no-conversations';
                        ui.toggleConversationsEmptyState && ui.toggleConversationsEmptyState(true);
                    }
                }
                setBottomTabState(initialTab);
                updateActiveTabClass(initialTab);
                updateActiveSubsectionClass(getDefaultSubsectionForTab(initialTab));
                if (isModernLayoutEnabled()) {
                    showBottomTabs();
                } else {
                    toggleBottomTabsDisplay(false);
                }
            },
            handleChange: handleBottomTabChange,
            setActiveSubsection: updateActiveSubsectionClass,
            restoreLastTab: restoreLastBottomTab,
            show: showBottomTabs,
            hide: hideBottomTabs,
            showEmptyStateTab: showNoConversationsTab,
            hideEmptyStateTab: hideNoConversationsTab,
            isConversationTabActive: isConversationTabActive,
            setActiveTab: updateActiveTabClass,
        };
    }

    w.KmBottomTabs = KmBottomTabs;
})(window);
