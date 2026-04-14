(function (w) {
    function KmWhatsNew(params) {
        params = params || {};
        var kommunicateCommons = params.kommunicateCommons;
        var appOptions = params.appOptions || {};
        var documentRef = params.document || document;
        var WHATS_NEW_LIST = [];

        function getSafeLink(item) {
            var rawLink = '';
            if (item && typeof item === 'object') {
                if (typeof item.link === 'string') {
                    rawLink = item.link;
                } else if (typeof item.url === 'string') {
                    rawLink = item.url;
                }
            }
            var trimmedLink = rawLink && rawLink.trim();
            if (!trimmedLink) {
                return '';
            }
            var lower = trimmedLink.toLowerCase();
            var isAllowed =
                lower.startsWith('http:') ||
                lower.startsWith('https:') ||
                lower.startsWith('mailto:');
            if (!isAllowed) {
                return '';
            }
            var escapeAttr =
                kommunicateCommons &&
                typeof kommunicateCommons.escapeAttributeValue === 'function' &&
                kommunicateCommons.escapeAttributeValue;
            return escapeAttr ? escapeAttr(trimmedLink) : trimmedLink;
        }

        function renderWhatsNewList(items) {
            var dataSource = Array.isArray(items) && items.length ? items : [];
            var placeholder = documentRef.getElementById('km-whats-new-placeholder');
            if (!placeholder) {
                return;
            }
            var listContainer = placeholder.querySelector('.km-whats-new-list');
            var emptyState = placeholder.querySelector('.km-whats-new-empty');
            var emptyLabel =
                (typeof MCK_LABELS !== 'undefined' && MCK_LABELS['modern.whatsnew.staytuned']) ||
                "What's New coming soon.";
            if (emptyState) {
                emptyState.textContent = emptyLabel;
            }
            if (!Array.isArray(dataSource) || !dataSource.length) {
                emptyState && emptyState.classList.remove('n-vis');
                listContainer && (listContainer.innerHTML = '');
                return;
            }
            emptyState && emptyState.classList.add('n-vis');
            if (!listContainer) {
                listContainer = documentRef.createElement('ul');
                listContainer.className = 'km-whats-new-list';
                placeholder.appendChild(listContainer);
            }
            var learnMoreLabel =
                (typeof MCK_LABELS !== 'undefined' && MCK_LABELS['modern.whatsnew.readmore']) ||
                'Learn more';
            listContainer.innerHTML = dataSource
                .map(function (item) {
                    if (!item || typeof item !== 'object') {
                        return '';
                    }
                    var title = item.title && kommunicateCommons.formatHtmlTag(item.title.trim());
                    var description =
                        item.description &&
                        kommunicateCommons.formatHtmlTag(item.description.trim());
                    var meta = item.meta && kommunicateCommons.formatHtmlTag(item.meta.trim());
                    var link = getSafeLink(item);
                    var linkText = item.linkText
                        ? kommunicateCommons.formatHtmlTag(item.linkText)
                        : learnMoreLabel;
                    var card = '<li class="km-whats-new-card">';
                    title && (card += '<h4>' + title + '</h4>');
                    meta && (card += '<span class="km-whats-new-meta">' + meta + '</span>');
                    description && (card += '<p>' + description + '</p>');
                    if (link) {
                        card +=
                            '<a class="km-whats-new-link" href="' +
                            link +
                            '" target="_blank" rel="noopener noreferrer">' +
                            linkText +
                            '</a>';
                    }
                    card += '</li>';
                    return card;
                })
                .join('');
        }

        function getConfiguredWhatsNewList() {
            var sources = [
                appOptions && Array.isArray(appOptions.whatsNewList) && appOptions.whatsNewList,
                w.kommunicate &&
                    w.kommunicate._globals &&
                    Array.isArray(w.kommunicate._globals.whatsNewList) &&
                    w.kommunicate._globals.whatsNewList,
                w.applozic &&
                    w.applozic._globals &&
                    Array.isArray(w.applozic._globals.whatsNewList) &&
                    w.applozic._globals.whatsNewList,
                Array.isArray(WHATS_NEW_LIST) && WHATS_NEW_LIST,
            ].filter(function (list) {
                return Array.isArray(list);
            });
            var resolvedList =
                sources.find(function (list) {
                    return list.length;
                }) || [];
            WHATS_NEW_LIST = resolvedList;
            return WHATS_NEW_LIST;
        }

        function toggleTabVisibility() {
            var selector = '.km-bottom-tab[data-tab="whats-new"]';
            var tabEl = documentRef.querySelector(selector);
            if (!tabEl || !kommunicateCommons) {
                return;
            }
            if (WHATS_NEW_LIST.length) {
                kommunicateCommons.show(selector);
                tabEl.removeAttribute('tabindex');
            } else {
                kommunicateCommons.hide(selector);
                tabEl.setAttribute('tabindex', '-1');
            }
        }

        function updateWhatsNewView() {
            WHATS_NEW_LIST = getConfiguredWhatsNewList();
            renderWhatsNewList(WHATS_NEW_LIST);
            toggleTabVisibility();
        }

        return {
            init: updateWhatsNewView,
            refresh: updateWhatsNewView,
            hasItems: function () {
                return WHATS_NEW_LIST.length > 0;
            },
            getList: function () {
                return WHATS_NEW_LIST.slice();
            },
        };
    }

    w.KmWhatsNew = KmWhatsNew;
})(window);
