/**
 * Add all Kommunicate UI Manipulation in this file.
 *
 */
var kommunicateCommons = new KommunicateCommons();
var KM_GLOBAL = kommunicate._globals;
var bottomTabsManagerRef = null;
var topBarManagerRef = null;

function getFaqClearButton() {
    if (typeof document === 'undefined') {
        return null;
    }
    return (
        document.querySelector('.km-faqsearch-clear') ||
        document.querySelector('.km-faqsearch-icon__clear')
    );
}
function getBottomTabsManager() {
    return bottomTabsManagerRef;
}
function isIndividualConversationActive() {
    var sideboxContent = document.getElementById('mck-sidebox-content');
    return (
        sideboxContent &&
        sideboxContent.classList &&
        sideboxContent.classList.contains('active-tab-conversations') &&
        sideboxContent.classList.contains('active-subsection-conversation-individual')
    );
}
function setActiveSubsectionState(subsection) {
    var sideboxContent =
        typeof document !== 'undefined' &&
        document.getElementById &&
        document.getElementById('mck-sidebox-content');
    if (
        sideboxContent &&
        sideboxContent.classList &&
        typeof subsection === 'string' &&
        subsection.indexOf('conversation-') === 0 &&
        sideboxContent.classList.contains('active-tab-faqs')
    ) {
        sideboxContent.classList.remove(
            'active-subsection-conversation-individual',
            'active-subsection-conversation-list'
        );
        return;
    }
    var bottomTabsManager = getBottomTabsManager();
    if (bottomTabsManager && typeof bottomTabsManager.setActiveSubsection === 'function') {
        bottomTabsManager.setActiveSubsection(subsection);
    }
    if (
        typeof subsection === 'string' &&
        subsection.indexOf('faq-') === 0 &&
        typeof KommunicateUI !== 'undefined'
    ) {
        KommunicateUI.lastFaqSubsection = subsection;
    }
}
KommunicateUI = {
    awayMessageInfo: {},
    awayMessageScroll: true,
    leadCollectionEnabledOnAwayMessage: false,
    welcomeMessageEnabled: false,
    leadCollectionEnabledOnWelcomeMessage: false,
    skipPopupChatTemplate: false,
    anonymousUser: false,
    isCSATtriggeredByUser: false,
    isConvJustResolved: false,
    isConversationResolvedFromZendesk: false,
    faqEventsInitialized: false,
    faqCategoriesReady: false,
    faqCategoryRequestPending: false,
    faqAppData: null,
    convRatedTabIds: {
        // using for optimize the feedback get api call
        // [tabId]: 1 => init the feedback api
        // [tabId]: 2 => conversations rated
    },
    faqSVGImage:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle class="km-custom-widget-fill" cx="12" cy="12" r="12" fill="#5553B7" fill-rule="nonzero" opacity=".654"/><g transform="translate(6.545 5.818)"><polygon fill="#FFF" points=".033 2.236 .033 12.057 10.732 12.057 10.732 .02 3.324 .02"/><rect class="km-custom-widget-fill" width="6.433" height="1" x="2.144" y="5.468" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><rect class="km-custom-widget-fill" width="4.289" height="1" x="2.144" y="8.095" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><polygon class="km-custom-widget-fill" fill="#5553B7" points="2.656 .563 3.384 2.487 1.162 3.439" opacity=".65" transform="rotate(26 2.273 2.001)"/></g></g></svg>',
    CONSTS: {},
    setBottomTabsManager: function (manager) {
        bottomTabsManagerRef = manager;
    },
    setTopBarManager: function (manager) {
        topBarManagerRef = manager;
    },
    updateScroll: function (element) {
        element.scrollTop = element.scrollHeight;
    },
    updateLeadCollectionStatus: function (err, message, data) {
        KommunicateUI.awayMessageInfo = {};
        if (!err && (message.code == 'SUCCESS' || message.code == 'AGENTS_ONLINE')) {
            KommunicateUI.leadCollectionEnabledOnAwayMessage =
                message.data.collectEmailOnAwayMessage;
            if (message.code != 'AGENTS_ONLINE' && message.data.messageList.length > 0) {
                KommunicateUI.awayMessageInfo['eventId'] = message.data.messageList[0].eventId;
                KommunicateUI.awayMessageInfo['isEnabled'] = true;
            }
            KommunicateUI.leadCollectionEnabledOnWelcomeMessage =
                message.data.collectEmailOnWelcomeMessage;
            KommunicateUI.welcomeMessageEnabled = message.data.welcomeMessageEnabled;
            KommunicateUI.anonymousUser = message.data.anonymousUser;
            KommunicateUI.displayLeadCollectionTemplate(data);
        }
    },
    loadIntentDropdown: function () {
        var intentOptions = document.getElementById('mck-intent-options');
        var replyOption = kommunicate._globals.replyMenu;
        if (replyOption && intentOptions) {
            for (var i = 0; i < replyOption.length; i++) {
                var listElement = document.createElement('li');
                listElement.innerText = replyOption[i];
                listElement.addEventListener('click', function (e) {
                    e.preventDefault();
                });
                intentOptions.appendChild(listElement);
            }
        }
    },
    populateAwayMessage: function (err, message) {
        var isIndividualConversation = isIndividualConversationActive();
        var closedConversation = $applozic('#mck-conversation-status-box').hasClass('vis');
        if (
            !err &&
            message.code == 'SUCCESS' &&
            message.data.messageList.length > 0 &&
            isIndividualConversation &&
            !closedConversation
        ) {
            awayMessage = message.data.messageList[0].message;
            awayMessage = kommunicateCommons.formatHtmlTag(awayMessage);
            $applozic('#mck-away-msg').html(awayMessage);
            $applozic('#mck-away-msg').linkify({
                target: '_blank',
            });
            kommunicateCommons.show('#mck-away-msg-box');
        } else {
            kommunicateCommons.hide('#mck-away-msg-box');
        }
        var messageBody = document.querySelectorAll('.mck-message-inner.mck-group-inner')[0];
        if (KommunicateUI.awayMessageScroll && messageBody) {
            KommunicateUI.updateScroll(messageBody);
            KommunicateUI.awayMessageScroll = false;
        }
    },

    checkSvgHasChildren: function (images) {
        var dataPrefix = 'data:image/svg+xml;base64,';
        var newImages = [];
        var isValidSvg = false;

        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            if (image.startsWith(dataPrefix)) {
                isValidSvg = true;
                var base64Data = image.slice(dataPrefix.length);
                try {
                    var decodedData = atob(base64Data);
                    var parser = new DOMParser();
                    var svgDocument = parser.parseFromString(decodedData, 'image/svg+xml');
                    var svg = svgDocument && svgDocument.documentElement;
                    if (svg && svg.children.length > 0) {
                        newImages.push(image);
                        break;
                    }
                } catch (err) {
                    console.error('Error while decoding ', err);
                }
            }
        }
        return isValidSvg ? newImages : images;
    },

    getLinkDataToPreview: function (url, callback, isMckRightMsg) {
        var previewUtils = window.KommunicatePreviewUtils;

        if (previewUtils.shouldBlockPreview()) {
            if (window.console && window.console.info) {
                window.console.info(
                    'Link preview suppressed because blockUrlPreview flag is enabled.'
                );
            }
            return;
        }
        if (previewUtils.isUrlBlockedForPreview(url)) {
            if (window.console && window.console.warn) {
                window.console.warn(
                    'Preview skipped because URL is blocked for metadata/external fetch.',
                    url
                );
            }
            return;
        }
        var sanitizedUrl =
            typeof url === 'string'
                ? url.trim().replace(/,+$/, '')
                : url
                ? String(url).trim().replace(/,+$/, '')
                : '';
        if (!sanitizedUrl) {
            return;
        }
        mckUtils.ajax({
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            url:
                kommunicate.getBaseUrl() +
                '/rest/ws/extractlink?linkToExtract=' +
                encodeURIComponent(sanitizedUrl),
            type: 'GET',
            global: false,
            success: function (result) {
                const { title, description } = result?.data ? result.data : {};

                if (title && title.includes('Attention Required!')) {
                    console.error('Cloudflare or security block detected. No preview available.');
                    return;
                }

                if (!title || !description) {
                    console.error('Missing metadata for preview. No preview available.');
                    return;
                }
                if (result) {
                    var images = result?.data?.images || [];
                    result.data.images = images.length
                        ? KommunicateUI.checkSvgHasChildren(images)
                        : [];

                    // this happens when the link gets redirected
                    if (result.data.title === 'ERROR: The request could not be satisfied') return;

                    var previewTemplate = kommunicate.markup.getLinkPreviewTemplate(
                        result,
                        isMckRightMsg
                    );
                    callback(previewTemplate);
                }
            },
            error: function (err) {
                console.error(err);
            },
        });
    },
    showAwayMessage: function () {
        var isIndividualConversation = isIndividualConversationActive();
        if (
            KommunicateUI.awayMessageInfo &&
            KommunicateUI.awayMessageInfo.isEnabled &&
            isIndividualConversation
        ) {
            kommunicateCommons.hide('#mck-email-collection-box');
            kommunicateCommons.show('#mck-away-msg-box');
        }
    },
    hideAwayMessage: function () {
        // $applozic("#mck-away-msg").html("");
        kommunicateCommons.hide('#mck-away-msg-box');
    },

    displayLeadCollectionTemplate: function (messageList) {
        var countMsg = 0;
        if (messageList && messageList.length) {
            var countMsg = 0;
            for (var i = 0; i < messageList.length; i++) {
                if (messageList[i].type == 5) {
                    countMsg++;
                    if (countMsg == 2) {
                        break;
                    }
                }
            }
            if (countMsg == 1) {
                if (
                    (KommunicateUI.leadCollectionEnabledOnAwayMessage &&
                        KommunicateUI.awayMessageInfo.isEnabled &&
                        KommunicateUI.awayMessageInfo.eventId == 1) ||
                    (KommunicateUI.welcomeMessageEnabled &&
                        KommunicateUI.leadCollectionEnabledOnWelcomeMessage &&
                        KommunicateUI.anonymousUser)
                ) {
                    this.populateLeadCollectionTemplate();
                    this.hideAwayMessage();
                }
            } else {
                this.hideLeadCollectionTemplate();
            }
        } else if (messageList == null) {
            this.populateLeadCollectionTemplate();
            this.hideAwayMessage();
        }
    },
    displayProgressMeter: function (key, uploadStatus) {
        var $progressMeter = $applozic('.progress-meter-' + key);
        var $attachment = $applozic('.mck-attachment-' + key);
        kommunicateCommons.show($progressMeter, $attachment.next());
        kommunicateCommons.hide($attachment.find('.mck-image-download'));
    },
    deleteProgressMeter: function (key, uploadStatus) {
        $applozic('.progress-meter-' + key).remove();
        uploadStatus &&
            $applozic('.mck-attachment-' + key)
                .next()
                .each(function () {
                    kommunicateCommons.hide(this);
                });
    },
    displayUploadIconForAttachment: function (key, uploadStatus) {
        kommunicateCommons.show('.progress-meter-' + key + ' .km-progress-upload-icon');
        kommunicateCommons.hide('.progress-meter-' + key + ' .km-progress-stop-upload-icon');
        Kommunicate.attachmentEventHandler.progressMeter(100, key);
        !uploadStatus &&
            $applozic('.mck-attachment-' + key)
                .next()
                .each(function () {
                    kommunicateCommons.show(this);
                });
    },
    updateImageAttachmentPreview: function (fileMeta, key) {
        var template = $applozic('.mck-attachment-' + key)[0];
        var thumbnailUrl = template && template.dataset && template.dataset.thumbnailurl;
        thumbnailUrl &&
            $applozic('.mck-attachment-' + key + ' .file-preview-link').attr(
                'data-url',
                thumbnailUrl
            );
    },
    hideFileBox: function (file, fileBoxSelector, $mck_file_upload) {
        var type = file && file.type;
        if (KommunicateUI.isAttachmentV2(type)) {
            kommunicateCommons.hide(fileBoxSelector);
            $mck_file_upload.attr('disabled', false);
        } else {
            kommunicateCommons.show(fileBoxSelector);
        }
    },
    isAttachmentV2: function (mediaType) {
        if (!mediaType) {
            return true;
            // if attachment has no file type or media type considering as v2 attachment. for example java file doesn't have media type.
        }
        var type = mediaType.substring(0, mediaType.indexOf('/'));
        return KM_ATTACHMENT_V2_SUPPORTED_MIME_TYPES.indexOf(type) != -1;
    },
    updateAttachmentTemplate: function (file_meta, key) {
        var attachment;
        var template = document.querySelector('.mck-message-inner.mck-group-inner');
        template && key && (attachment = template.querySelector('.mck-attachment-' + key));
        if (attachment) {
            file_meta.blobKey && attachment.setAttribute('data-filemetakey', file_meta.blobKey);
            file_meta.name && attachment.setAttribute('data-filename', file_meta.name);
            attachment.setAttribute('data-fileurl', file_meta.thumbnailUrl || file_meta.url);
            file_meta.size && attachment.setAttribute('data-filesize', file_meta.size);
            attachment.setAttribute(
                'data-filetype',
                file_meta.contentType || file_meta.fileMeta.contentType
            );
            // need to update blobkey if media is encrypted.
            // Note: All the attachements sent from widget are encrypted
            file_meta.blobKey &&
                $applozic('.km-attachment-preview-href-' + key).attr('blobkey', file_meta.blobKey);
        }
    },
    updateAttachmentStopUploadStatus: function (key, status) {
        var template = document.querySelector('.mck-message-inner.mck-group-inner');
        var attachment = template && template.querySelector('.mck-attachment-' + key);
        attachment && attachment.setAttribute('data-stopupload', status);
    },
    getAttachmentStopUploadStatus: function (key) {
        var stopUpload = $applozic('.mck-attachment-' + key).attr('data-stopupload');
        stopUpload = stopUpload == 'true' ? true : false;
        return stopUpload;
    },
    populateLeadCollectionTemplate: function () {
        KommunicateUI.hideAwayMessage();
        kommunicateCommons.show('#mck-email-collection-box');
        kommunicateCommons.hide('#mck-btn-attach-box');
        $applozic('#mck-text-box').blur();
        $applozic('#mck-text-box').attr('data-text', 'Your email ID');
    },
    hideLeadCollectionTemplate: function () {
        kommunicateCommons.hide('#mck-email-collection-box', '#mck-email-error-alert-box');
        kommunicateCommons.show('#mck-btn-attach-box');
        $applozic('#mck-text-box').attr('data-text', MCK_LABELS['input.message']);
    },
    validateEmail: function (sendMsg) {
        var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (sendMsg.match(mailformat)) {
            kommunicateCommons.hide('#mck-email-error-alert-box');
            this.hideLeadCollectionTemplate();
            window.$applozic.fn.applozic('updateUser', {
                data: { email: sendMsg },
            });
            // KommunicateUI.showAwayMessage();  lead collection feature improvement- [WIP]
            return true;
        } else {
            kommunicateCommons.show('#mck-email-error-alert-box');
            kommunicateCommons.hide('#mck-email-collection-box');
            return false;
        }
    },

    initFaq: function () {
        if (KommunicateUI.faqEventsInitialized) {
            return;
        }
        KommunicateUI.faqEventsInitialized = true;
        var data = {};
        data.appId = kommunicate._globals.appId;

        // On Click of FAQ button the FAQ category List will open.
        $applozic(d).on('click', '#km-faq, #km-faq-option', function () {
            KommunicateUI.ensureFaqCategoriesLoaded(data);
            var isFaqCategoryPresent =
                kommunicate && kommunicate._globals && kommunicate._globals.faqCategory;
            kmWidgetEvents.eventTracking(eventMapping.onFaqClick);
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
            KommunicateUI.showFaqListHeaderState();
            setActiveSubsectionState(isFaqCategoryPresent ? 'faq-list' : 'faq-category');
            KommunicateUI.awayMessageScroll = true;
            if (isFaqCategoryPresent) {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                    MCK_EVENT_HISTORY.push('km-faq-list');
            } else {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-category-list' &&
                    MCK_EVENT_HISTORY.push('km-faq-category-list');
            }

            typingService.resetState();

            if (isFaqCategoryPresent) {
                kommunicateCommons.hide('.km-faq-category-list-container');
            } else {
                kommunicateCommons.hide('#km-faq-list-container');
                kommunicateCommons.show('.km-faq-category-list-container');
            }

            KommunicateUI.checkSingleThreadedConversationSettings(true);
            var searchInput = document.getElementById('km-faq-search-input');
            var hasSearchValue = searchInput && searchInput.value && searchInput.value.trim();
            if (hasSearchValue) {
                kommunicateCommons.hide('.km-faq-category-list-container');
                kommunicateCommons.show('#km-faq-list-container');
            }
        });

        // on click of FAQ category card the FAQ list for that category will open
        $applozic(d).on('click', '.km-faq-category-card', function () {
            KommunicateUI.toggleModernFaqBackButton(true);
            if (kommunicateCommons.isModernLayoutEnabled()) {
                KommunicateUI.setIndividualTitle(KommunicateUI.getFaqTitle());
            }
            MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                MCK_EVENT_HISTORY.push('km-faq-list');
            var searchInput = document.getElementById('km-faq-search-input');
            var hasSearchValue = searchInput && searchInput.value && searchInput.value.trim();
            if (hasSearchValue) {
                kommunicateCommons.hide('.km-faq-category-list-container');
                kommunicateCommons.show('#km-faq-list-container');
            }
            var categoryName = this.getAttribute('data-category-name');
            document.querySelector('#km-faq-list-container').innerHTML = '';
            setActiveSubsectionState('faq-list');
            Kommunicate.getFaqList(data, categoryName);
        });

        $applozic(d).on('click', '.km-faq-back-btn', function (event) {
            var isModernLayout = kommunicateCommons.isModernLayoutEnabled();
            var sideboxContent = document.getElementById('mck-sidebox-content');
            var isInFaqCategory =
                sideboxContent &&
                sideboxContent.classList.contains('active-tab-faqs') &&
                sideboxContent.classList.contains('active-subsection-faq-category');

            if (!isModernLayout && isInFaqCategory) {
                var backToListView = KommunicateUI.isConversationListView === true;
                var bottomTabsManager = getBottomTabsManager();
                if (bottomTabsManager && typeof bottomTabsManager.setActiveTab === 'function') {
                    bottomTabsManager.setActiveTab('conversations');
                } else if (sideboxContent && sideboxContent.classList) {
                    sideboxContent.classList.remove('active-tab-faqs');
                    sideboxContent.classList.add('active-tab-conversations');
                }
                setActiveSubsectionState(
                    backToListView ? 'conversation-list' : 'conversation-individual'
                );
                if (backToListView) {
                    KommunicateUI.showConversationList();
                } else {
                    KommunicateUI.showChat();
                }
                return;
            }
            KommunicateUI.showFaqCategoryScreen();
        });

        // on click of back button previous window should open
        $applozic(d).on('click', '#mck-conversation-back-btn', function (e) {
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
            KommunicateUI.awayMessageScroll = true;
            KommunicateUI.hideAwayMessage();
            KommunicateUI.hideLeadCollectionTemplate();
            kommunicateCommons.hide('#km-widget-options');
            typingService.resetState();
            if (MCK_EVENT_HISTORY.length >= 2) {
                if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == 'km-faq-category-list') {
                    KommunicateUI.showHeader();
                    $applozic('#mck-msg-new').attr('disabled', false);
                    kommunicateCommons.hide('.km-faq-back-btn-wrapper');
                    setActiveSubsectionState('faq-category');
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    KommunicateUI.toggleModernFaqBackButton(false);
                    return;
                } else if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == 'km-faq-list') {
                    KommunicateUI.showHeader();
                    setActiveSubsectionState('faq-list');
                    $applozic('#mck-msg-new').attr('disabled', false);
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    KommunicateUI.toggleModernFaqBackButton(true);
                    return;
                } else if (typeof MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == 'object') {
                    KommunicateUI.showConversationList();
                    KommunicateUI.handleConversationBanner();
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    return;
                } else {
                    KommunicateUI.isFAQPrimaryCTA() && kommunicateCommons.show('#km-faq');
                    $applozic('#mck-msg-new').attr('disabled', false);
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    MCK_EVENT_HISTORY.length = 0;
                    KommunicateUI.showConversationList();
                    return;
                }
            } else {
                // remove n-vis

                KommunicateUI.isFAQPrimaryCTA()
                    ? kommunicateCommons.show('#km-faq')
                    : kommunicateCommons.hide('#km-faq');

                kommunicateCommons.show('#mck-rate-conversation', '.mck-conversation');

                kommunicateCommons.modifyClassList({ class: ['mck-rating-box'] }, '', 'selected');
                KommunicateUI.setIndividualTitle(KommunicateUI.getFaqTitle());
                var faqAnswerContainer = document.getElementById('km-faqanswer');
                faqAnswerContainer && (faqAnswerContainer.innerHTML = '');
                MCK_EVENT_HISTORY.length = 0;
                KommunicateUI.handleConversationBanner();
                var clearBtn = getFaqClearButton();
                document.querySelector('#km-faq-search-input').value &&
                    clearBtn &&
                    clearBtn.click();
                setActiveSubsectionState('faq-category');
                KommunicateUI.showConversationList();
                return;
            }
        });

        $applozic(d).on(
            'click',
            '#mck-msg-preview, #mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text',
            function () {
                KommunicateUI.showChat();
            }
        );

        // On Click of Individual List Items their respective answers will show.
        $applozic(d).on('click', '.km-faq-list', function () {
            var faqAnswerContainer = document.getElementById('km-faqanswer');
            faqAnswerContainer && (faqAnswerContainer.innerHTML = '');
            MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-answer-list' &&
                MCK_EVENT_HISTORY.push('km-faq-answer-list');
            setActiveSubsectionState('faq-article');
            var articleId = $applozic(this).attr('data-articleid');
            var source = $applozic(this).attr('data-source');
            KommunicateUI.showFaqDetailsHeaderState();
            KommunicateKB.getArticle({
                data: {
                    appId: data.appId,
                    articleId: articleId,
                    source: source,
                },
                success: function (response) {
                    var faqDetails = response && response.data;
                    var faqAnswerContainer = document.getElementById('km-faqanswer');
                    if (
                        faqDetails &&
                        faqAnswerContainer &&
                        !faqAnswerContainer.querySelector('.km-faqanswer-list')
                    ) {
                        var faqTitle =
                            faqDetails.title && kommunicateCommons.formatHtmlTag(faqDetails.title);
                        // FAQ description is already coming in formatted way from the dashboard FAQ editor.
                        faqAnswerContainer.insertAdjacentHTML(
                            'beforeend',
                            '<div class="km-faqanswer-list ql-snow"><div class="km-faqquestion">' +
                                faqTitle +
                                '</div> <div class="km-faqanchor km-faqanswer ql-editor">' +
                                faqDetails.body +
                                '</div></div>'
                        );

                        KommunicateUI.toggleModernFaqBackButton(true);
                        $applozic('#km-faqanswer .km-faqanswer').linkify({
                            target: '_blank',
                        });
                    }
                },
                error: function (error) {
                    throw new Error('Error while fetching faq details', error);
                },
            });
        });

        $applozic(d).on('click', '#km-faqanswer a', function (e) {
            e.preventDefault();
            window.open(e.target.href);
        });

        var $faqSearchIcon = $applozic('.km-faqsearch-icon');
        var $faqClearIcon = $applozic('.km-faqsearch-clear');

        function setFaqSearchIconState(hasValue) {
            hasValue
                ? kommunicateCommons.show($faqClearIcon)
                : kommunicateCommons.hide($faqClearIcon);
        }

        var welcomeFaqSearchInput = document.getElementById('km-empty-faq-search');
        var welcomeFaqSearchClear = document.getElementById('km-empty-faq-search-clear');
        function getPrimaryFaqSearchInput() {
            return document.getElementById('km-faq-search-input');
        }

        function openFaqTabIfNeeded() {
            var faqTabButton = document.querySelector('.km-bottom-tab[data-tab="faqs"]');
            if (faqTabButton && !faqTabButton.classList.contains('active')) {
                faqTabButton.click();
            }
        }

        function syncFaqSearchValue(value) {
            var primaryFaqSearch = getPrimaryFaqSearchInput();
            if (primaryFaqSearch) {
                primaryFaqSearch.value = value || '';
            }
        }

        function toggleWelcomeFaqClear(hasValue) {
            if (welcomeFaqSearchClear) {
                hasValue
                    ? kommunicateCommons.show(welcomeFaqSearchClear)
                    : kommunicateCommons.hide(welcomeFaqSearchClear);
            }
        }

        function triggerFaqSearchFromWelcome() {
            var query = (welcomeFaqSearchInput && welcomeFaqSearchInput.value) || '';
            syncFaqSearchValue(query);
            setFaqSearchIconState(query.length > 0);
            var primaryFaqSearch = getPrimaryFaqSearchInput();
            if (!primaryFaqSearch) {
                return;
            }
            var enterEvent = jQuery.Event('keyup');
            enterEvent.which = 13;
            $applozic(primaryFaqSearch).trigger(enterEvent);
        }

        if (welcomeFaqSearchInput) {
            $applozic(welcomeFaqSearchInput).on(
                'input',
                kommunicateCommons.debounce(function (event) {
                    var value = (event && event.target && event.target.value) || '';
                    toggleWelcomeFaqClear(Boolean(value.trim().length));
                    syncFaqSearchValue(value);
                    setFaqSearchIconState(value.length > 0);
                }, 250)
            );

            $applozic(welcomeFaqSearchInput).on('keyup', function (event) {
                if (!event || event.which !== 13) {
                    return;
                }
                openFaqTabIfNeeded();
                triggerFaqSearchFromWelcome();
            });
        }

        welcomeFaqSearchClear &&
            $applozic(welcomeFaqSearchClear).on('click', function (event) {
                event.preventDefault();
                toggleWelcomeFaqClear(false);
                if (welcomeFaqSearchInput) {
                    welcomeFaqSearchInput.value = '';
                    welcomeFaqSearchInput.focus();
                }
                syncFaqSearchValue('');
                setFaqSearchIconState(false);
                triggerFaqSearchFromWelcome();
            });

        $applozic('#km-faq-search-input').keyup(
            kommunicateCommons.debounce(function (e) {
                var searchQuery = e.target.value;

                setFaqSearchIconState(searchQuery.length > 0);
                // Only trigger search on Enter; Space inside queries should not submit
                if (e.which === 13) {
                    if (!document.querySelector('.km-faq-category-list-container.n-vis')) {
                        MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                            MCK_EVENT_HISTORY.push('km-faq-list');
                        kommunicateCommons.hide('.km-faq-category-list-container');
                        kommunicateCommons.show('#km-faq-list-container');
                    }
                    KommunicateUI.searchFaqs(data);
                }
            }, 500)
        );

        $applozic(d).on('click', '.km-faqsearch-clear', function (evt) {
            evt.stopPropagation();
            $applozic('#km-faq-search-input').val('');
            setFaqSearchIconState(false);
            // this is being used to simulate an Enter Key Press on the search input.
            var e = jQuery.Event('keyup');
            e.which = 13;
            $applozic('#km-faq-search-input').trigger(e);
        });

        $applozic(d).on('click', '.km-faqsearch-icon__search', function () {
            var $searchInput = $applozic('#km-faq-search-input');
            if (!$searchInput.length) {
                return;
            }
            $searchInput.focus();
            var searchValue = ($searchInput.val() || '').trim();
            if (!searchValue) {
                return;
            }
            setFaqSearchIconState(true);
            var e = jQuery.Event('keyup');
            e.which = 13;
            $searchInput.trigger(e);
        });
    },
    ensureFaqCategoriesLoaded: function (data) {
        if (data) {
            KommunicateUI.faqAppData = data;
        }
        var requestData = data || KommunicateUI.faqAppData;
        if (
            KommunicateUI.faqCategoriesReady ||
            KommunicateUI.faqCategoryRequestPending ||
            !requestData ||
            !requestData.appId ||
            (kommunicate && kommunicate._globals && kommunicate._globals.faqCategory)
        ) {
            return;
        }
        KommunicateUI.faqCategoryRequestPending = true;
        Kommunicate.getFaqCategories(requestData);
    },
    faqEmptyState: function () {
        kommunicateCommons.show('.km-no-results-found-container');
        document.querySelector('.km-talk-to-human-div p').innerHTML = MCK_LABELS['no-faq-found'];
        document.querySelector('.km-no-results-found p').innerHTML = MCK_LABELS['faq-empty-state'];
    },
    flushFaqsEvents: function () {
        var sideboxContent = document.getElementById('mck-sidebox-content');
        if (sideboxContent && sideboxContent.classList.contains('active-tab-faqs')) {
            MCK_EVENT_HISTORY.length = 0;
            return;
        }
        var lastEvent = MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1];
        var backBtn = $applozic('#mck-conversation-back-btn')[0];
        if (lastEvent && typeof lastEvent == 'string' && lastEvent.includes('faq')) {
            backBtn && backBtn.click();
            KommunicateUI.flushFaqsEvents();
        }
    },
    searchFaqUI: function (response) {
        // If the input is now empty, favor showing categories and hiding results regardless of the response
        var currentQuery = (document.getElementById('km-faq-search-input')?.value || '').trim();
        if (!currentQuery) {
            var listEl = document.getElementById('km-faq-list-container');
            listEl && (listEl.innerHTML = '');
            kommunicateCommons.hide('#km-faq-list-container');
            kommunicateCommons.show('#km-faqdiv', '.km-faq-category-list-container');
            kommunicateCommons.hide('.km-no-results-found-container');
            setActiveSubsectionState('faq-category');
            return;
        }
        if (response.data && response.data.length === 0) {
            kommunicateCommons.show('.km-no-results-found-container');
            document.querySelector('.km-talk-to-human-div p').innerHTML =
                MCK_LABELS['no-faq-found'];
            document.querySelector('.km-no-results-found p').innerHTML =
                MCK_LABELS['faq.no.results'] || 'No results found';
            setActiveSubsectionState('faq-no-results');
        } else {
            kommunicateCommons.hide('.km-no-results-found-container');
            document.querySelector('.km-talk-to-human-div p').innerHTML =
                MCK_LABELS['looking.for.something.else'];
        }
        var faqList = document.getElementById('km-faq-list-container');
        if (!faqList) {
            return;
        }
        if (response.data && response.data.length === 0) {
            faqList.innerHTML = '';
            // No results: hide results list and category list, keep empty state visible via above logic
            kommunicateCommons.hide('#km-faqdiv', '#km-faq-list-container');
            return;
        }
        // Results found: show results list and hide category list to prevent it from flashing back
        setActiveSubsectionState('faq-list');
        faqList.innerHTML = '';
        response.data.forEach(function (faq) {
            var id = faq.id || faq.articleId;
            var title = faq.name || faq.title;
            title = title && kommunicateCommons.formatHtmlTag(title);
            faqList.innerHTML +=
                '<li class="km-faq-list"  data-articleId="' +
                id +
                '"><a class="km-faqdisplay"> <div class="km-faqimage">' +
                KommunicateUI.faqSVGImage +
                '</div><div class="km-faqanchor">' +
                title +
                '</div></a></li>';
        });
    },
    searchFaqs: function (data) {
        var searchFilter = {
            appId: data && data.appId,
            query: document.getElementById('km-faq-search-input').value,
        };
        // Track latest query to avoid updating UI with stale results
        KommunicateUI._lastFaqQuery = (searchFilter.query || '').trim();
        if (kommunicate && kommunicate._globals && kommunicate._globals.faqCategory) {
            searchFilter.categoryName = kommunicate._globals.faqCategory;
        }
        if (!document.getElementById('km-faq-search-input').value) {
            KommunicateKB.getArticles({
                data: searchFilter,
                success: function (response) {
                    // Ignore stale callbacks
                    var current = (
                        document.getElementById('km-faq-search-input')?.value || ''
                    ).trim();
                    if (current !== (KommunicateUI._lastFaqQuery || '')) return;
                    KommunicateUI.searchFaqUI(response);
                },
                error: function (err) {
                    console.log('error while searching faq', err || 'Unknown error');
                },
            });
        } else {
            KommunicateKB.searchFaqs({
                data: searchFilter,
                success: function (response) {
                    // Ignore stale callbacks
                    var current = (
                        document.getElementById('km-faq-search-input')?.value || ''
                    ).trim();
                    if (current !== (KommunicateUI._lastFaqQuery || '')) return;
                    KommunicateUI.searchFaqUI(response);
                },
                error: function (err) {
                    console.log('error while searching faq', err || 'Unknown error');
                },
            });
        }
    },
    hideFaq: function () {
        $applozic('#mck-msg-new').attr('disabled', false);
        KommunicateUI.flushFaqsEvents();
    },
    hideMessagePreview: function () {
        kommunicateCommons.hide('#mck-msg-preview-visual-indicator');
        $applozic('#mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text').html(
            ''
        );
    },
    toggleWelcomeFaqSearch: function (show) {
        var searchShell = document.querySelector('.km-empty-conversation-card__search');
        if (!searchShell) {
            return;
        }
        if (typeof show === 'undefined') {
            show = true;
        }
        searchShell.classList.toggle('n-vis', !show);
    },

    showChat: function (options) {
        var keepConversationHeader = false;
        var skipSubsectionUpdate = false;
        if (typeof options === 'boolean') {
            keepConversationHeader = options;
        } else if (options) {
            if (typeof options.keepConversationHeader !== 'undefined') {
                keepConversationHeader = options.keepConversationHeader;
            }
            skipSubsectionUpdate = Boolean(options.skipSubsectionUpdate);
        }
        var isModernLayout = kommunicateCommons.isModernLayoutEnabled();
        var shouldShowConversationListHeader =
            keepConversationHeader && isModernLayout && KommunicateUI.isConversationListView;
        var shouldShowChatHeader = !shouldShowConversationListHeader;
        kommunicateCommons.setWidgetStateOpen(true);

        // Check if conversations tab is active before setting conversation subsections
        var sideboxContent = document.getElementById('mck-sidebox-content');
        var isConversationsTabActive =
            sideboxContent &&
            sideboxContent.classList &&
            sideboxContent.classList.contains('active-tab-conversations');
        if (skipSubsectionUpdate && sideboxContent && sideboxContent.classList) {
            sideboxContent.classList.remove('active-subsection-conversation-individual');
        }

        if (isModernLayout) {
            if (shouldShowConversationListHeader) {
                topBarManagerRef.toggleBackButton(false);
                KommunicateUI.isConversationListView = true;
                // Only set conversation-list if conversations tab is active
                if (!skipSubsectionUpdate && isConversationsTabActive) {
                    setActiveSubsectionState('conversation-list');
                }
            } else {
                KommunicateUI.isConversationListView = false;
                // Only set conversation-individual if conversations tab is active
                if (!skipSubsectionUpdate && isConversationsTabActive) {
                    setActiveSubsectionState('conversation-individual');
                }
            }
        } else {
            // Default layout: respect the current view flag; default to list if unset.
            var showListView =
                typeof KommunicateUI.isConversationListView === 'boolean'
                    ? KommunicateUI.isConversationListView
                    : true;
            KommunicateUI.isConversationListView = showListView;
            // Only set conversation subsection if conversations tab is active
            if (!skipSubsectionUpdate && isConversationsTabActive) {
                setActiveSubsectionState(
                    showListView ? 'conversation-list' : 'conversation-individual'
                );
            }
        }

        KommunicateUI.isFAQPrimaryCTA() && kommunicateCommons.show('#km-faq');
        $applozic('#mck-msg-new').attr('disabled', false);
        if (
            $applozic("#mck-message-cell .mck-message-inner div[name='message']").length === 0 &&
            isFirstLaunch == true
        ) {
            isFirstLaunch = false;
        } else {
            $applozic('#mck-tab-individual .mck-tab-link.mck-back-btn-container').removeClass(
                'n-vis'
            );
            $applozic('#mck-tab-individual .mck-name-status-container.mck-box-title').removeClass(
                'padding'
            );
        }
        if (!KommunicateUI.isConversationListView) {
            $applozic('#mck-tab-individual .mck-tab-link.mck-back-btn-container').removeClass(
                'n-vis'
            );
        }
    },
    showHeader: function () {
        setActiveSubsectionState('conversation-individual');
        KommunicateUI.resetConversationListTitle();
        $applozic('#mck-msg-new').attr('disabled', false);
        KommunicateUI.isConversationListView = false;
    },
    showConversationList: function (options) {
        options = options || {};
        setActiveSubsectionState('conversation-list');
        if (!kommunicateCommons.isModernLayoutEnabled()) {
            var shouldShowContacts =
                options.skipEmptyStateToggle || KommunicateUI.hasConversationHistory;
            if (shouldShowContacts) {
                kommunicateCommons.show('#mck-contacts-content');
            } else {
                kommunicateCommons.hide('#mck-contacts-content');
            }
        }
        kommunicateCommons.hide('.km-option-faq');
        topBarManagerRef.showConversationHeader();
        topBarManagerRef.toggleAvatar(false);
        topBarManagerRef.toggleBackButton(false);
        KommunicateUI.setIndividualTitle();
        KommunicateUI.resetConversationListTitle();
        KommunicateUI.toggleModernFaqBackButton(false);
        var faqAvailable =
            kommunicate._globals.hasArticles === undefined ||
            kommunicate._globals.hasArticles === true;
        if (!kommunicateCommons.isModernLayoutEnabled() && faqAvailable) {
            kommunicateCommons.show('#km-faq');
        } else if (KommunicateUI.isFAQPrimaryCTA()) {
            kommunicateCommons.show('#km-faq');
        }
        $applozic('#mck-msg-new').attr('disabled', false);
        MCK_EVENT_HISTORY.length = 0;
        KommunicateUI.isConversationListView = true;
        if (!options.skipEmptyStateToggle) {
            KommunicateUI.toggleConversationsEmptyState &&
                KommunicateUI.toggleConversationsEmptyState(!KommunicateUI.hasConversationHistory);
        }
    },
    hasConversationHistory: false,
    hasAutoStartedConversation: false,
    isConversationListView: false,
    setHasConversationHistory: function (value) {
        var boolValue = Boolean(value);
        KommunicateUI.hasConversationHistory = boolValue;
        !boolValue && (KommunicateUI.hasAutoStartedConversation = false);
        KommunicateUI.updateWelcomeCtaLabel && KommunicateUI.updateWelcomeCtaLabel();
        KommunicateUI.toggleConversationsEmptyState &&
            KommunicateUI.toggleConversationsEmptyState(!boolValue);
        if (boolValue) {
            var bottomTabsManager = getBottomTabsManager();
            var sideboxContent = document.getElementById('mck-sidebox-content');
            var sideboxHasNoConversationTab =
                sideboxContent && sideboxContent.classList.contains('active-tab-no-conversations');
            var isConversationTabActive =
                bottomTabsManager &&
                typeof bottomTabsManager.isConversationTabActive === 'function' &&
                bottomTabsManager.isConversationTabActive();
            var shouldForceConversationTab = sideboxHasNoConversationTab || isConversationTabActive;
            if (sideboxHasNoConversationTab) {
                sideboxContent.classList.remove('active-tab-no-conversations');
                sideboxContent.classList.add('active-tab-conversations');
            }
            if (
                bottomTabsManager &&
                typeof bottomTabsManager.setActiveTab === 'function' &&
                typeof bottomTabsManager.setActiveSubsection === 'function'
            ) {
                if (shouldForceConversationTab) {
                    if (!isConversationTabActive) {
                        bottomTabsManager.setActiveTab('conversations');
                    }
                    bottomTabsManager.setActiveSubsection(
                        KommunicateUI.isConversationListView
                            ? 'conversation-list'
                            : 'conversation-individual'
                    );
                }
            } else {
                shouldForceConversationTab &&
                    setActiveSubsectionState(
                        KommunicateUI.isConversationListView
                            ? 'conversation-list'
                            : 'conversation-individual'
                    );
            }
        }
    },
    toggleConversationsEmptyState: function (show) {
        var emptyState = document.getElementById('km-conversations-empty');
        var contactsContent = document.getElementById('mck-contacts-content');
        var messageInner = document.querySelector('#mck-message-cell .mck-message-inner');
        if (!emptyState) {
            return;
        }
        show ? kommunicateCommons.show(emptyState) : kommunicateCommons.hide(emptyState);
        contactsContent &&
            (show
                ? kommunicateCommons.hide(contactsContent)
                : kommunicateCommons.show(contactsContent));
        messageInner &&
            (show ? kommunicateCommons.hide(messageInner) : kommunicateCommons.show(messageInner));
        const sideboxEmptyClass = 'km-empty-conversation-active';
        kommunicateCommons.modifyClassList(
            {
                id: ['mck-sidebox'],
            },
            show ? sideboxEmptyClass : '',
            show ? '' : sideboxEmptyClass
        );
    },
    updateWelcomeCtaLabel: function () {
        var sendCta = document.getElementById('km-empty-conversation-cta');
        var continueCta = document.getElementById('km-empty-conversation-continue');
        if (!sendCta || !continueCta) {
            setTimeout(KommunicateUI.updateWelcomeCtaLabel, 50);
            return;
        }
        var hasContacts =
            Array.isArray(window.MCK_CONTACT_ARRAY) && window.MCK_CONTACT_ARRAY.length > 0;
        if (!KommunicateUI.hasConversationHistory && hasContacts) {
            KommunicateUI.hasConversationHistory = true;
        }
        sendCta.textContent = KommunicateUI.getLabel('mck.empty.welcome.cta', 'Send us a message');
        continueCta.textContent = KommunicateUI.getLabel(
            'mck.empty.welcome.cta.continue',
            'View conversations'
        );
        sendCta.classList.toggle('n-vis', KommunicateUI.hasConversationHistory);
        continueCta.classList.toggle('n-vis', !KommunicateUI.hasConversationHistory);
    },
    getLabel: function (key, fallback) {
        return (typeof MCK_LABELS === 'object' && MCK_LABELS && MCK_LABELS[key]) || fallback;
    },
    getFaqTitle: function () {
        return KommunicateUI.getLabel('faq', 'FAQ');
    },
    showFaqListHeaderState: function () {
        KommunicateUI.toggleModernFaqBackButton(false);
        KommunicateUI.setConversationTitle(KommunicateUI.getFaqTitle());
    },
    showFaqDetailsHeaderState: function () {
        var faqTitle = KommunicateUI.getFaqTitle();
        topBarManagerRef.setFaqTitle();
        topBarManagerRef.showDualHeader();
        topBarManagerRef.toggleAvatar(false);
        topBarManagerRef.toggleBackButton(false);
    },
    setConversationTitle: function (text) {
        var value = text || KommunicateUI.getLabel('conversations.title', 'Conversations');
        topBarManagerRef.setConversationTitle(value);
    },
    setIndividualTitle: function (text) {
        var value = text || KommunicateUI.getLabel('conversations.title', 'Conversations');
        topBarManagerRef.setIndividualTitle(value);
    },
    resetConversationListTitle: function () {
        KommunicateUI.setConversationTitle();
    },
    toggleModernFaqBackButton: function (showButton) {
        if (!kommunicateCommons.isModernLayoutEnabled()) {
            return;
        }
        var backContainer = document.querySelector(
            '#mck-tab-individual .mck-tab-link.mck-back-btn-container'
        );
        if (!backContainer) {
            return;
        }
        showButton ? backContainer.classList.remove('n-vis') : backContainer.classList.add('n-vis');
    },
    showFaqCategoryScreen: function () {
        KommunicateUI.toggleModernFaqBackButton(false);
        setActiveSubsectionState('faq-category');
        if (
            Array.isArray(MCK_EVENT_HISTORY) &&
            MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] === 'km-faq-list'
        ) {
            MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
        }
    },

    isFAQPrimaryCTA: function () {
        var ctaData = KommunicateUI.getHeaderCurrentCTAData();

        return (
            !KM_GLOBAL.primaryCTA ||
            KM_GLOBAL.primaryCTA === HEADER_CTA.FAQ ||
            !ctaData.currentCTAKey //if cta button is not valid then use the FAQ button default
        );
    },

    sendFaqQueryAsMsg: function (groupId) {
        var messageInput = $applozic('#km-faq-search-input').val();
        var msgTemplate =
            MCK_LABELS['faq.query.message'].QUERY_REGARDING +
            ' \n"' +
            messageInput +
            '"\n\n' +
            MCK_LABELS['faq.query.message'].HELP_YOU;
        if (messageInput !== '') {
            var messagePxy = {
                groupId: groupId,
                type: 5,
                contentType: 0,
                message: msgTemplate,
            };
            // Kommunicate.sendMessage(messagePxy);
            $applozic.fn.applozic('sendGroupMessage', messagePxy);
        } else {
            return;
        }
    },
    activateTypingField: function () {
        if (kommunicate._globals.noFocus || kommunicateCommons.checkIfDeviceIsHandheld()) {
            return;
        }
        $applozic('#mck-text-box').focus();
    },
    setAvailabilityStatus: function (status) {
        kommunicateCommons.show('.mck-agent-image-container');
        var $statusIndicator = $applozic('.mck-agent-image-container .mck-agent-status-indicator');
        $statusIndicator
            .removeClass('mck-status--online')
            .removeClass('mck-status--offline')
            .removeClass('mck-status--away')
            .removeClass('n-vis')
            .addClass('mck-status--' + status);
        kommunicateCommons.show($statusIndicator);
        var $statusText = $applozic('#mck-agent-status-text');
        $statusText.text(MCK_LABELS[status]);
        kommunicateCommons.show($statusText);
    },
    toggleVoiceOutputOverride: function (voiceOutput) {
        if (voiceOutput) {
            kommunicateCommons.hide('#user-overide-voice-output-svg-off');
            kommunicateCommons.show('#user-overide-voice-output-svg-on');
            document.getElementById('user-overide-voice-output-text').innerText =
                MCK_LABELS['conversation.header.dropdown'].USER_OVERIDE_VOICE_OUTPUT_OFF;
        } else {
            kommunicateCommons.hide('#user-overide-voice-output-svg-on');
            kommunicateCommons.show('#user-overide-voice-output-svg-off');
            document.getElementById('user-overide-voice-output-text').innerText =
                MCK_LABELS['conversation.header.dropdown'].USER_OVERIDE_VOICE_OUTPUT_ON;
        }
    },
    loadQuickReplies: function (quickReplies) {
        var intentList = document.getElementById('mck-intent-options');
        if (quickReplies.length > 0 && intentList && intentList.childElementCount < 1) {
            kommunicateCommons.show('#mck-quick-replies-box');
            for (var i = 0; i < quickReplies.length; i++) {
                var li = document.createElement('li');
                li.innerText = quickReplies[i];
                intentList.appendChild(li);
                li.onclick = function (e) {
                    e.preventDefault();
                    document.getElementById('mck-text-box').innerText = this.innerText;
                    document.getElementById('mck-msg-sbmt').click();
                };
            }
        }
    },
    triggerCSAT: function (triggeredByBot) {
        ratingService.resetStarsColor();
        var isConvRated = document.getElementsByClassName('mck-rated').length > 0;
        if (kommunicate._globals.oneTimeRating) {
            if (isConvRated && CURRENT_GROUP_DATA.tabId) {
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] =
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED;
            } else if (
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] >
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED ||
                !KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId]
            ) {
                kommunicateCommons.getFeedback(CURRENT_GROUP_DATA.tabId, function (params) {
                    KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] = params.data
                        ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                        : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                });
            }
        }

        var isCSATenabled = kommunicate._globals.oneTimeRating
            ? kommunicate._globals.collectFeedback &&
              KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] !=
                  KommunicateConstants.FEEDBACK_API_STATUS.RATED
            : kommunicate._globals.collectFeedback;

        kmWidgetEvents.eventTracking(eventMapping.onRateConversationClick);
        if (!KommunicateUI.isConvJustResolved) {
            KommunicateUI.isCSATtriggeredByUser = true;
        }
        var messageBody = document.querySelector('.mck-message-inner.mck-group-inner');
        if (isCSATenabled || triggeredByBot) {
            document.getElementById('mck-submit-comment').disabled = false;
            kommunicateCommons.modifyClassList({ class: ['mck-rating-box'] }, '', 'selected');
            kommunicateCommons.hide('.mck-box-form-container');
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'km-mid-conv-csat'
            );

            kommunicateCommons.hide('#mck-conversation-status-box');

            kommunicateCommons.show('#csat-1', '#csat-2', '#mck-feedback-text-wrapper');
            KommunicateUI.isConvJustResolved = false;
            KommunicateUI.updateScroll(messageBody);
        } else if (
            KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] ==
                KommunicateConstants.FEEDBACK_API_STATUS.RATED &&
            kommunicate._globals.oneTimeRating
        ) {
            var messageText = MCK_LABELS['closed.conversation.message'];
            var conversationStatusDiv = document.getElementById('mck-conversation-status-box');
            conversationStatusDiv && (conversationStatusDiv.innerHTML = messageText);
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'km-mid-conv-csat'
            );
            kommunicateCommons.show('#mck-conversation-status-box');
            kommunicateCommons.hide('.mck-box-form-container', '#km-widget-options');
            KommunicateUI.updateScroll(messageBody);
        } else {
            kommunicateCommons.show('.mck-csat-text-1');
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'mck-restart-conv-banner'
            );
        }
    },
    askCSAT: function (triggeredByBot) {
        KommunicateUI.triggerCSAT(triggeredByBot);
    },
    showClosedConversationBanner: function (isConversationClosed) {
        var isConvRated = document.getElementsByClassName('mck-rated').length > 0;
        if (kommunicate._globals.oneTimeRating) {
            if (isConvRated && CURRENT_GROUP_DATA.tabId) {
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] =
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED;
            } else if (
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] >
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED ||
                !KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId]
            ) {
                kommunicateCommons.getFeedback(CURRENT_GROUP_DATA.tabId, function (params) {
                    KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] = params.data
                        ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                        : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                });
            }
        }
        var ratingTitleElement = document.querySelector('.mck-csat-title');
        var messageText = MCK_LABELS['closed.conversation.message'];
        var ratingTitle = MCK_LABELS['csat.rating'].CONVERSATION_RATING_HEADING;

        ratingTitleElement && (ratingTitleElement.innerHTML = ratingTitle);
        var conversationStatusDiv = document.getElementById('mck-conversation-status-box');
        var isCSATtriggeredByUser = KommunicateUI.isCSATtriggeredByUser;
        var isConvJustResolved = KommunicateUI.isConvJustResolved;
        var isCSATenabled = kommunicate._globals.oneTimeRating
            ? kommunicate._globals.collectFeedback &&
              KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] !=
                  KommunicateConstants.FEEDBACK_API_STATUS.RATED
            : kommunicate._globals.collectFeedback;
        var messageBody = document.querySelector('.mck-message-inner.mck-group-inner');
        isConversationClosed && kommunicateCommons.hide('.mck-box-form-container');
        if (KommunicateUI.isConversationResolvedFromZendesk) {
            isCSATenabled && KommunicateUI.triggerCSAT();
            document.getElementById('mck-submit-comment').onclick = function (e) {
                kommunicateCommons.hide('.mck-ratings-smilies', '#csat-1');
            };
            if (!isCSATenabled) {
                kommunicateCommons.hide('#mck-conversation-status-box');
            }

            document.getElementById('mck-submit-comment').disabled = false;
            kommunicateCommons.modifyClassList({ class: ['mck-rating-box'] }, '', 'selected');
            kommunicateCommons.hide('.mck-box-form-container');
            kommunicateCommons.show('.mck-csat-text-1');
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'km-mid-conv-csat'
            );
            return;
        }
        if (
            isCSATenabled &&
            isConversationClosed &&
            !kommunicateCommons.isConversationClosedByBot() &&
            !isCSATtriggeredByUser &&
            !isConvJustResolved
        ) {
            kommunicateCommons.getFeedback(CURRENT_GROUP_DATA.tabId, feedbackResponseCallback);
            function feedbackResponseCallback(data) {
                var feedback = data.data;
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] = feedback
                    ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                    : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                CURRENT_GROUP_DATA.currentGroupFeedback = feedback;
                kommunicateCommons.hide('.mck-box-form-container');
                kommunicateCommons.show('.mck-csat-text-1');
                kommunicateCommons.modifyClassList(
                    {
                        id: ['mck-sidebox-ft'],
                    },
                    'mck-restart-conv-banner'
                );
                kommunicateCommons.hide('#csat-1', '#csat-2', '#csat-3', '#km-widget-options');
                /*
                csat-1 : csat rating first screen where you can rate via emoticons.
                csat-2 : csat rating second screen where you can add comments.
                csat-3 : csat result screen where you show overall feedback.
                */
                if (!feedback) {
                    // no rating given after conversation is resolved
                    kommunicateCommons.hide('#mck-conversation-status-box');
                    kommunicateCommons.show('#csat-1', '#csat-2');
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['mck-sidebox-ft'],
                        },
                        'km-mid-conv-csat',
                        'mck-restart-conv-banner'
                    );
                    document.getElementById('mck-submit-comment').disabled = false;
                }
                KommunicateUI.updateScroll(messageBody);
            }
        } else if (isConversationClosed && KommunicateUI.isCSATtriggeredByUser) {
            KommunicateUI.isCSATtriggeredByUser = false;
            kommunicateCommons.hide('#csat-1', '#csat-2', '#csat-3', '#mck-rated');
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                '',
                'km-mid-conv-csat'
            );
            kommunicateCommons.hide(
                '#mck-conversation-status-box',
                '.mck-box-form-container',
                '.mck-csat-text-1'
            );
        } else if (isConversationClosed && KommunicateUI.isConvJustResolved) {
            KommunicateUI.askCSAT(false);
        } else if (isConversationClosed) {
            conversationStatusDiv && (conversationStatusDiv.innerHTML = messageText);
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'km-mid-conv-csat'
            );
            kommunicateCommons.show('#mck-conversation-status-box');
            kommunicateCommons.hide('.mck-box-form-container', '#km-widget-options');
            KommunicateUI.updateScroll(messageBody);
        } else {
            kommunicateCommons.hide('#csat-1', '#csat-2', '#csat-3', '#mck-rated');
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                '',
                'km-mid-conv-csat'
            );
            kommunicateCommons.hide('#mck-conversation-status-box');
            !KM_GLOBAL.disableTextArea && kommunicateCommons.show('.mck-box-form-container');
            kommunicateCommons.hide('.mck-csat-text-1');
        }
    },
    handleAttachmentIconVisibility: function (enableAttachment, msg, groupReloaded) {
        if (
            !groupReloaded &&
            typeof msg.metadata === 'object' &&
            msg.metadata.KM_ENABLE_ATTACHMENT
        ) {
            msg.metadata.KM_ENABLE_ATTACHMENT == 'true' &&
                kommunicateCommons.show('#mck-attachfile-box', '#mck-file-up');
            msg.metadata.KM_ENABLE_ATTACHMENT == 'false' &&
                kommunicateCommons.hide('#mck-attachfile-box', '#mck-file-up');
        } else if (groupReloaded && enableAttachment) {
            enableAttachment == 'true' &&
                kommunicateCommons.show('#mck-attachfile-box', '#mck-file-up');
            enableAttachment == 'false' &&
                kommunicateCommons.hide('#mck-attachfile-box', '#mck-file-up');
        }
    },
    displayPopupChatTemplate: function (
        popupChatContent,
        chatWidget,
        mckChatPopupNotificationTone
    ) {
        if (KommunicateUI.skipPopupChatTemplate) {
            return;
        }
        console.log('displayPopupChatTemplate', {
            hasContent: Boolean(popupChatContent && popupChatContent.length),
            chatWidgetPopup: chatWidget && chatWidget.popup,
        });
        var enableGreetingMessage =
            kommunicateCommons.isObject(chatWidget) &&
            chatWidget.hasOwnProperty('enableGreetingMessageInMobile')
                ? chatWidget.enableGreetingMessageInMobile
                : true;
        var isPopupEnabled =
            kommunicateCommons.isObject(chatWidget) &&
            (chatWidget.popup === true || chatWidget.popup === 'true') &&
            (kommunicateCommons.checkIfDeviceIsHandheld() ? enableGreetingMessage : true);
        var delay = popupChatContent && popupChatContent.length ? popupChatContent[0].delay : -1;
        var popupTemplateKey =
            (popupChatContent && popupChatContent.length && popupChatContent[0].templateKey) ||
            KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL;
        if (isPopupEnabled && delay > -1) {
            MCK_CHAT_POPUP_TEMPLATE_TIMER = setTimeout(function () {
                console.log('calling togglePopupChatTemplate', {
                    templateKey: popupTemplateKey,
                    delay,
                });
                KommunicateUI.togglePopupChatTemplate(
                    popupTemplateKey,
                    true,
                    mckChatPopupNotificationTone
                );
            }, delay);
        }
    },
    captureGreetingMessageClick: function (e) {
        e.preventDefault();
        kmWidgetEvents.eventTracking(eventMapping.onGreetingMessageNotificationClick);
    },
    togglePopupChatTemplate: function (
        popupTemplateKey,
        showTemplate,
        mckChatPopupNotificationTone
    ) {
        var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
        var playPopupTone = appOptionSession.getPropertyDataFromSession(
            'playPopupNotificationTone'
        );
        if (showTemplate && kommunicateCommons.isWidgetOpen()) {
            return;
        }
        if (showTemplate) {
            if (playPopupTone == null || playPopupTone) {
                mckChatPopupNotificationTone && mckChatPopupNotificationTone.play();
                appOptionSession.setSessionData('playPopupNotificationTone', false);
            }
            var popupTemplateClass =
                KommunicateConstants.CHAT_POPUP_TEMPLATE_CLASS[popupTemplateKey];

            kommunicateIframe.classList.add(popupTemplateClass.replace('-container-', ''));
            var isVerticalPopupTemplate =
                popupTemplateKey === KommunicateConstants.CHAT_POPUP_TEMPLATE.VERTICAL;
            if (!isVerticalPopupTemplate) {
                kommunicateIframe.style.height = '';
                kommunicateIframe.style.minHeight = '';
            }

            popupTemplateKey === KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL &&
                kommunicateCommons.modifyClassList(
                    { id: ['mck-sidebox-launcher', 'launcher-svg-container'] },
                    'km-no-box-shadow',
                    ''
                );
            kommunicateCommons.modifyClassList(
                { id: ['launcher-svg-container'] },
                'km-animate',
                ''
            );
            kommunicateCommons.modifyClassList(
                { id: ['chat-popup-widget-container'] },
                'km-animate',
                'n-vis'
            );
            var el = document.querySelector('.chat-popup-widget-text-wrapper');
            if (el && window.parent && window.parent !== window) {
                var rect = el.getBoundingClientRect();
                if (popupTemplateKey === KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL) {
                    var textEl = el.querySelector('.chat-popup-widget-text');
                    var width = el.getBoundingClientRect().width;

                    if (textEl) {
                        var rect = textEl.getBoundingClientRect();
                        var style = window.getComputedStyle(textEl);
                        var paddingLeft = parseFloat(style.paddingLeft) || 0;
                        var paddingRight = parseFloat(style.paddingRight) || 0;
                        width = rect.width + paddingLeft + paddingRight;
                    }

                    var closeBtnAllowance = 70;
                    window.parent.postMessage(
                        { type: 'km_popup_resize', width: Math.ceil(width + closeBtnAllowance) },
                        '*'
                    );
                } else if (popupTemplateKey === KommunicateConstants.CHAT_POPUP_TEMPLATE.VERTICAL) {
                    window.parent.postMessage(
                        { type: 'km_popup_resize', height: Math.ceil(rect.height + 25) },
                        '*'
                    );
                }
            }
            var greetingMessageContainer = document.getElementById('chat-popup-widget-container');
            greetingMessageContainer &&
                greetingMessageContainer.firstChild &&
                greetingMessageContainer.firstChild.addEventListener(
                    'click',
                    this.captureGreetingMessageClick
                );
            var WIDGET_POSITION =
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.widgetSettings &&
                kommunicate._globals.widgetSettings.hasOwnProperty('position')
                    ? kommunicate._globals.widgetSettings.position
                    : KommunicateConstants.POSITION.RIGHT;
            WIDGET_POSITION === KommunicateConstants.POSITION.LEFT &&
                kommunicateCommons.modifyClassList(
                    {
                        class: [
                            'chat-popup-widget-close-btn-container',
                            'chat-popup-widget-container--vertical',
                            'chat-popup-widget-text-wrapper',
                            'chat-popup-widget-container--horizontal',
                        ],
                    },
                    'align-left'
                );
        } else {
            kommunicateCommons.modifyClassList(
                { id: ['mck-sidebox-launcher', 'launcher-svg-container'] },
                '',
                'km-no-box-shadow'
            );
            kommunicateCommons.modifyClassList(
                { id: ['launcher-svg-container'] },
                '',
                'km-animate'
            );
            kommunicateIframe && kommunicateIframe.classList.remove('chat-popup-widget-horizontal');
            kommunicateIframe && kommunicateIframe.classList.remove('chat-popup-widget-vertical');
            kommunicateIframe && kommunicateIframe.classList.remove('chat-popup-widget-actionable');
            if (kommunicateIframe) {
                kommunicateIframe.style.height = '';
                kommunicateIframe.style.width = '';
                kommunicateIframe.style.minHeight = '';
            }
            kommunicateCommons.modifyClassList(
                { id: ['chat-popup-widget-container'] },
                'n-vis',
                'km-animate'
            );
        }
    },
    handleConversationBanner: function () {
        var conversationFilterBanner = document.getElementById('mck-conversation-filter');
        if (conversationFilterBanner && conversationFilterBanner.parentNode) {
            conversationFilterBanner.parentNode.removeChild(conversationFilterBanner);
        }
    },
    handleResolvedConversationsList: function () {
        var resolvedItems = document.getElementsByClassName('mck-conversation-resolved');
        if (!resolvedItems || !resolvedItems.length) {
            return;
        }
        for (var i = 0; i < resolvedItems.length; i++) {
            resolvedItems[i].classList.remove('mck-show-resolved-conversation');
        }
    },
    adjustConversationTitleHeadingWidth: function (isPopupWidgetEnabled) {
        var titleClassName = 'mck-title-width-wo-faq-with-close-btn';
        topBarManagerRef.removeIndividualTitleClass(titleClassName);
        if (document.querySelector('.km-kb-container').classList.contains('vis')) {
            titleClassName = isPopupWidgetEnabled
                ? 'mck-title-width-with-faq'
                : 'mck-title-width-with-faq-close-btn';
        }
        topBarManagerRef.addIndividualTitleClass(titleClassName);
    },
    setFAQButtonText: function () {
        document.querySelector('#km-faq').textContent = MCK_LABELS['faq'];
    },
    checkSingleThreadedConversationSettings: function (hasMultipleConversations) {
        var isWidgetSingleThreaded =
            kommunicateCommons.isObject(kommunicate._globals.widgetSettings) &&
            kommunicate._globals.widgetSettings.isSingleThreaded;

        if (isWidgetSingleThreaded) {
            var startConversationButton = document.getElementById('mck-contacts-content');
            var backButton = document.querySelector('.mck-back-btn-container');
            startConversationButton.classList.add('force-n-vis');
            hasMultipleConversations
                ? backButton.classList.remove('force-n-vis')
                : backButton.classList.add('force-n-vis');
        }

        var startNewButton = document.getElementById('mck-msg-new');
        if (startNewButton) {
            if (isWidgetSingleThreaded) {
                startNewButton.classList.add('force-n-vis');
            } else {
                startNewButton.classList.remove('force-n-vis');
            }
        }
    },
    updateSingleThreadedClass: function (hasMultipleConversations) {
        var isWidgetSingleThreaded =
            kommunicateCommons.isObject(kommunicate._globals.widgetSettings) &&
            kommunicate._globals.widgetSettings.isSingleThreaded;
        return isWidgetSingleThreaded && !hasMultipleConversations;
    },

    handleWaitingQueueMessage: function () {
        var group = CURRENT_GROUP_DATA;
        var groupId = group && group.tabId;
        var waitingStatus =
            group && group.conversationStatus == Kommunicate.conversationHelper.status.WAITING;
        const teamId = CURRENT_GROUP_DATA?.teamId;
        if (!teamId) return;
        let waitingListEndpoint = `/rest/ws/group/waiting/list?teamId=${teamId}`;
        window.Applozic.ALApiService.ajax({
            type: 'GET',
            url: MCK_BASE_URL + waitingListEndpoint,
            global: false,
            contentType: 'application/json',
            success: function (res) {
                if (res.status === 'success') {
                    WAITING_QUEUE = res.response;
                    var isGroupPresentInWaitingQueue =
                        WAITING_QUEUE.indexOf(parseInt(groupId)) > -1;
                    var waitingQueueNumber = document.getElementById('waiting-queue-number');
                    var headerTabTitle = document.getElementById('mck-tab-title');
                    if (
                        waitingQueueNumber &&
                        waitingStatus &&
                        isGroupPresentInWaitingQueue &&
                        WAITING_QUEUE.length
                    ) {
                        waitingQueueNumber.innerHTML =
                            '#' + parseInt(WAITING_QUEUE.indexOf(parseInt(groupId)) + 1);
                        kommunicateCommons.show('#mck-waiting-queue');
                        kommunicateCommons.hide(
                            '.mck-agent-image-container',
                            '.mck-agent-status-text'
                        );
                        kommunicateCommons.hide(
                            '.km-option-talk-to-human',
                            '#km-talk-to-human',
                            '#km-restart-conversation',
                            '.km-option-restart-conversation'
                        );
                        CURRENT_GROUP_DATA.isWaitingQueue = true;
                        topBarManagerRef.setIndividualTitle(
                            MCK_LABELS['waiting.queue.message']['header.text'],
                            false
                        );
                        var messageBody = document.querySelector(
                            '.mck-message-inner.mck-group-inner'
                        );
                        if (messageBody) {
                            KommunicateUI.updateScroll(messageBody);
                        }
                    } else {
                        kommunicateCommons.hide('#mck-waiting-queue');

                        topBarManagerRef.setIndividualTitle(
                            topBarManagerRef.getIndividualTitleAttribute()
                        );

                        var selectors = ['.mck-agent-image-container', '.mck-agent-status-text'];
                        KommunicateUI.isFAQPrimaryCTA() && selectors.push('#km-faq');
                        kommunicateCommons.show.apply(kommunicateCommons, selectors);
                    }
                }
            },
            error: function (err) {
                throw new Error('Error while fetching waiting list', err);
            },
        });
    },
    getUrlFromBlobKey: function (blobKey, callback) {
        var params = '?key=' + blobKey;
        window.Applozic.ALApiService.ajax({
            type: 'GET',
            global: false,
            url: MCK_BASE_URL + '/rest/ws/file/url' + params,
            success: function (res) {
                callback(null, res);
            },
            error: function (err) {
                callback(err);
            },
            skipEncryption: true,
        });
    },
    isInView: function (element, targetElement) {
        const rect = element.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        return (
            rect.top >= targetRect.top &&
            rect.left >= targetRect.left &&
            rect.bottom <= targetRect.bottom &&
            rect.right <= targetRect.right
        );
    },
    processLazyImage: function (imageElement, thumbnailBlobKey) {
        imageElement.classList.remove('file-enc');
        KommunicateUI.getUrlFromBlobKey(thumbnailBlobKey, function (err, thumbnailUrl) {
            if (err) {
                throw err;
            }
            thumbnailUrl && (imageElement.src = thumbnailUrl);
            setTimeout(function () {
                imageElement.classList.add('file-enc');
            }, KommunicateConstants.AWS_IMAGE_URL_EXPIRY_TIME);
        });
    },
    processEncMedia: function (mediaElement, blobKey) {
        mediaElement.classList.remove('file-enc');
        KommunicateUI.getUrlFromBlobKey(blobKey, function (err, url) {
            if (err) {
                throw err;
            } else if (url) {
                var sourceElement = mediaElement.querySelectorAll('source');
                sourceElement[0].src = url;
                sourceElement[1].src = url;
                mediaElement.load();
                var attachmentWrapper = $applozic(mediaElement).closest(
                    'div.mck-file-text.mck-attachment'
                )[0];
                var mediaURL =
                    attachmentWrapper && attachmentWrapper.querySelector('a.file-preview-link');
                mediaURL && (mediaURL.href = url);
            }
            setTimeout(function () {
                mediaElement.classList.add('file-enc');
            }, KommunicateConstants.AWS_IMAGE_URL_EXPIRY_TIME);
        });
    },
    processEncFile: function (anchorTag, blobKey) {
        anchorTag.classList.remove('file-enc');
        KommunicateUI.getUrlFromBlobKey(blobKey, function (err, url) {
            if (err) {
                throw err;
            } else if (url) {
                anchorTag.href = url;
            }
            setTimeout(function () {
                anchorTag.classList.add('file-enc');
            }, KommunicateConstants.AWS_IMAGE_URL_EXPIRY_TIME);
        });
    },
    toggleVisibilityOfTextArea: function (assignee, groupMembers) {
        var isDisableTextAreaEnabled =
            kommunicate && kommunicate._globals && kommunicate._globals.disableTextArea;
        if (isDisableTextAreaEnabled && assignee && groupMembers) {
            for (var i = 0; i < groupMembers.length; i++) {
                if (
                    groupMembers[i] &&
                    groupMembers[i].userId === assignee &&
                    (groupMembers[i].roleType == KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT ||
                        groupMembers[i].role == KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT)
                ) {
                    kommunicateCommons.hide('.mck-box-form-container');
                    break;
                } else {
                    kommunicateCommons.show('.mck-box-form-container');
                }
            }
        }
    },
    getHeaderCurrentCTAData: function () {
        var currentCTAKey;
        var currentCTA;
        var data = KommunicateConstants.HEADER_PRIMARY_CTA;

        for (var key in data) {
            if (key === KM_GLOBAL.primaryCTA && KM_GLOBAL[data[key].identifier]) {
                currentCTAKey = key;
                currentCTA = data[key];
                break;
            }
        }
        return {
            currentCTAKey,
            currentCTA,
        };
    },
    isShowRestartConversation: function () {
        if (KM_GLOBAL.primaryCTA !== HEADER_CTA.RESTART_CONVERSATION) return false;

        return (
            KM_GLOBAL.primaryCTA === HEADER_CTA.RESTART_CONVERSATION &&
            !KommunicateUtils.isCurrentAssigneeBot()
        );
    },
};

(function () {
    var YOUTUBE_IFRAME_SELECTOR =
        'iframe[src*="youtube.com/embed"], iframe[src*="youtube-nocookie.com/embed"]';
    var ELEMENT_NODE_TYPE = typeof Node !== 'undefined' ? Node.ELEMENT_NODE : 1;
    var originValue = '';
    var youtubeOriginObserver = null;

    try {
        originValue = window.parent && window.parent.location && window.parent.location.origin;
    } catch (error) {
        // ignore cross-origin access errors
    }

    if (!originValue && window.location) {
        originValue = window.location.origin;
        if (!originValue && window.location.protocol && window.location.host) {
            originValue = window.location.protocol + '//' + window.location.host;
        }
    }

    function addOriginAndPermissions(iframe) {
        if (!iframe || iframe.dataset.kmYoutubeOriginApplied) {
            return;
        }

        var src = iframe.getAttribute('src');
        if (!src) {
            return;
        }

        var parsedUrl;
        try {
            parsedUrl = new URL(src, window.location.href);
        } catch (error) {
            return;
        }

        if (originValue && !parsedUrl.searchParams.has('origin')) {
            parsedUrl.searchParams.set('origin', originValue);
        }

        var newSrc = parsedUrl.toString();
        if (newSrc !== src) {
            iframe.setAttribute('src', newSrc);
        }

        iframe.dataset.kmYoutubeOriginApplied = '1';

        if (!iframe.hasAttribute('allowfullscreen') && !iframe.hasAttribute('allowFullScreen')) {
            iframe.setAttribute('allowfullscreen', '');
        }

        var allowAttr = iframe.getAttribute('allow') || '';
        if (!/fullscreen/i.test(allowAttr)) {
            var updatedAllow = allowAttr ? allowAttr + '; fullscreen' : 'fullscreen';
            iframe.setAttribute('allow', updatedAllow);
        }
        applyYoutubeFallback(iframe);
    }

    function applyYoutubeFallback(iframe) {
        if (!iframe || iframe.dataset.kmYoutubeFallbackApplied) {
            return;
        }

        if (!KommunicateUtils.isSafariBrowser()) {
            return;
        }

        var src = iframe.getAttribute('src') || iframe.getAttribute('data-src');
        if (!src || !KommunicateUtils.isYoutubeUrl(src)) {
            return;
        }

        iframe.dataset.kmYoutubeFallbackApplied = '1';
        iframe.style.display = 'none';

        var watchUrl = KommunicateUtils.getYoutubeWatchUrl(src) || src;
        var container =
            iframe.closest && iframe.closest('.mck-rich-video-container')
                ? iframe.closest('.mck-rich-video-container')
                : iframe.parentNode;

        if (container) {
            var anchor = container.querySelector && container.querySelector('a[href]');
            if (anchor) {
                anchor.setAttribute('href', watchUrl);
                anchor.textContent = watchUrl;
            } else {
                var link = document.createElement('a');
                link.href = watchUrl;
                link.target = '_blank';
                link.textContent = watchUrl;
                container.insertBefore(link, container.firstChild);
            }
        }
    }

    function inspectNodeForYoutube(node) {
        if (!node || node.nodeType !== ELEMENT_NODE_TYPE) {
            return;
        }

        if (node.matches && node.matches(YOUTUBE_IFRAME_SELECTOR)) {
            addOriginAndPermissions(node);
            return;
        }

        if (node.querySelectorAll) {
            var youtubeIframes = node.querySelectorAll(YOUTUBE_IFRAME_SELECTOR);
            for (var i = 0; i < youtubeIframes.length; i++) {
                addOriginAndPermissions(youtubeIframes[i]);
            }
        }
    }

    function patchExistingIframes() {
        if (!document || !document.querySelectorAll) {
            return;
        }
        var youtubeIframes = document.querySelectorAll(YOUTUBE_IFRAME_SELECTOR);
        for (var i = 0; i < youtubeIframes.length; i++) {
            addOriginAndPermissions(youtubeIframes[i]);
        }
    }

    function getMutationObserverTarget() {
        if (!document) {
            return null;
        }

        var selectors = [
            '#mck-message-cell .mck-message-inner',
            '.mck-message-inner.mck-group-inner',
            '#mck-sidebox .mck-message-inner',
        ];
        for (var i = 0; i < selectors.length; i++) {
            var target = document.querySelector(selectors[i]);
            if (target) {
                return target;
            }
        }
        return document.body || document.documentElement;
    }

    function observeForNewIframes() {
        if (youtubeOriginObserver || !window.MutationObserver || !document) {
            return;
        }

        var observerTarget = getMutationObserverTarget();
        if (!observerTarget) {
            return;
        }

        youtubeOriginObserver = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                var addedNodes = mutation.addedNodes;
                for (var j = 0; j < addedNodes.length; j++) {
                    inspectNodeForYoutube(addedNodes[j]);
                }
            }
        });

        youtubeOriginObserver.observe(observerTarget, {
            childList: true,
            subtree: true,
        });
    }

    function teardownYoutubeOriginFix() {
        if (youtubeOriginObserver) {
            youtubeOriginObserver.disconnect();
            youtubeOriginObserver = null;
        }
    }

    function initYoutubeOriginFix() {
        patchExistingIframes();
        observeForNewIframes();
    }

    if (document && document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initYoutubeOriginFix, {
            once: true,
        });
    } else {
        initYoutubeOriginFix();
    }

    window.addEventListener('beforeunload', teardownYoutubeOriginFix);
})();
