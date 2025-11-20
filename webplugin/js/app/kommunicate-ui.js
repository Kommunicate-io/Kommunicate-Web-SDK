/**
 * Add all Kommunicate UI Manipulation in this file.
 *
 */
var kommunicateCommons = new KommunicateCommons();
var KM_GLOBAL = kommunicate._globals;
function getFaqClearButton() {
    if (typeof document === 'undefined') {
        return null;
    }
    return (
        document.querySelector('.km-faqsearch-clear') ||
        document.querySelector('.km-faqsearch-icon__clear')
    );
}
KommunicateUI = {
    awayMessageInfo: {},
    awayMessageScroll: true,
    leadCollectionEnabledOnAwayMessage: false,
    welcomeMessageEnabled: false,
    leadCollectionEnabledOnWelcomeMessage: false,
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
        var conversationWindowNotActive = $applozic('#mck-tab-individual').hasClass('n-vis');
        var closedConversation = $applozic('#mck-conversation-status-box').hasClass('vis');
        if (
            !err &&
            message.code == 'SUCCESS' &&
            message.data.messageList.length > 0 &&
            !conversationWindowNotActive &&
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
        mckUtils.ajax({
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            url: kommunicate.getBaseUrl() + '/rest/ws/extractlink?linkToExtract=' + url,
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
        var conversationWindowNotActive = $applozic('#mck-tab-individual').hasClass('n-vis');
        if (
            KommunicateUI.awayMessageInfo &&
            KommunicateUI.awayMessageInfo.isEnabled &&
            !conversationWindowNotActive
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
        $applozic('.progress-meter-' + key)
            .removeClass('n-vis')
            .addClass('vis');
        $applozic('.mck-attachment-' + key)
            .next()
            .removeClass('n-vis')
            .addClass('vis');
        $applozic('.mck-attachment-' + key + ' .mck-image-download').addClass('n-vis');
    },
    deleteProgressMeter: function (key, uploadStatus) {
        $applozic('.progress-meter-' + key).remove();
        uploadStatus &&
            $applozic('.mck-attachment-' + key)
                .next()
                .removeClass('vis')
                .addClass('n-vis');
    },
    displayUploadIconForAttachment: function (key, uploadStatus) {
        $applozic('.progress-meter-' + key + ' .km-progress-upload-icon')
            .removeClass('n-vis')
            .addClass('vis');
        $applozic('.progress-meter-' + key + ' .km-progress-stop-upload-icon')
            .removeClass('vis')
            .addClass('n-vis');
        Kommunicate.attachmentEventHandler.progressMeter(100, key);
        !uploadStatus &&
            $applozic('.mck-attachment-' + key)
                .next()
                .removeClass('n-vis')
                .addClass('vis');
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
        kommunicateCommons.hide('#mck-email-collection-box');
        kommunicateCommons.hide('#mck-email-error-alert-box');
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
        $applozic(d).on('click', '#km-faq', function () {
            KommunicateUI.ensureFaqCategoriesLoaded();
            var isFaqCategoryPresent =
                kommunicate && kommunicate._globals && kommunicate._globals.faqCategory;
            kmWidgetEvents.eventTracking(eventMapping.onFaqClick);
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
            KommunicateUI.showHeader();
            KommunicateUI.toggleModernFaqBackButton(false);
            kommunicateCommons.hide('.km-faq-back-btn-wrapper');
            KommunicateUI.showFaqListHeaderState();
            KommunicateUI.awayMessageScroll = true;
            if (isFaqCategoryPresent) {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                    MCK_EVENT_HISTORY.push('km-faq-list');
            } else {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-category-list' &&
                    MCK_EVENT_HISTORY.push('km-faq-category-list');
            }

            typingService.resetState();

            // remove n-vis
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-contact-search-input-box', 'faq-common', 'km-faqdiv', 'mck-tab-title'],
                    class: [
                        'mck-conversation-back-btn',
                        'km-contact-input-container',
                        'km-faq-category-list-container',
                    ],
                },
                'vis',
                'n-vis'
            );

            // add n-vis
            kommunicateCommons.modifyClassList(
                {
                    id: [
                        'km-faq',
                        'mck-no-conversations',
                        'mck-away-msg-box',
                        'mck-sidebox-ft',
                        'mck-contacts-content',
                        'km-widget-options',
                    ],
                    class: [
                        'mck-conversation',
                        'mck-agent-image-container',
                        'mck-agent-status-text',
                        'km-header-cta',
                    ],
                },
                'n-vis',
                'vis'
            );

            isFaqCategoryPresent
                ? $applozic('.km-faq-category-list-container').addClass('n-vis')
                : $applozic('#km-faq-list-container').addClass('n-vis') &&
                  $applozic('.km-faq-category-list-container').removeClass('n-vis');

            $applozic('#mck-tab-title').html(MCK_LABELS['faq']);
            $applozic('#mck-msg-new').attr('disabled', false);
            $applozic('#mck-tab-individual .mck-tab-link.mck-back-btn-container')
                .removeClass('n-vis')
                .addClass('vis-table');
            $applozic('#mck-tab-individual .mck-name-status-container.mck-box-title').removeClass(
                'padding'
            );
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
            kommunicateCommons.modifyClassList(
                {
                    class: ['km-faq-category-list-container'],
                },
                'n-vis',
                'vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-faq-list-container'],
                },
                'vis',
                'n-vis'
            );
            KommunicateUI.toggleModernFaqBackButton(true);
            kommunicateCommons.show('.km-faq-back-btn-wrapper');
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
            Kommunicate.getFaqList(data, categoryName);
        });

        document.addEventListener('click', function (event) {
            var backButton = event.target && event.target.closest('.km-faq-back-btn');
            if (!backButton) {
                return;
            }
            KommunicateUI.showFaqCategoryScreen();
        });

        // on click of back button previous window should open
        $applozic(d).on('click', '#mck-conversation-back-btn', function (e) {
            kommunicateCommons.hide('.km-contact-input-container');
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
            KommunicateUI.awayMessageScroll = true;
            KommunicateUI.hideAwayMessage();
            KommunicateUI.hideLeadCollectionTemplate();
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-widget-options'],
                },
                'n-vis'
            );
            typingService.resetState();
            if (MCK_EVENT_HISTORY.length >= 2) {
                if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == 'km-faq-category-list') {
                    KommunicateUI.showHeader();

                    // remove n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faqdiv', 'km-contact-search-input-box'],
                            class: ['km-contact-input-container', 'km-faq-category-list-container'],
                        },
                        'vis',
                        'n-vis'
                    );

                    // add n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faq-list-container'],
                            class: ['km-no-results-found-container'],
                        },
                        'n-vis',
                        'vis'
                    );

                    $applozic('#mck-msg-new').attr('disabled', false);
                    kommunicateCommons.hide('.km-faq-back-btn-wrapper');
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    KommunicateUI.toggleModernFaqBackButton(false);
                    return;
                } else if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == 'km-faq-list') {
                    KommunicateUI.showHeader();

                    // remove n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faqdiv', 'km-contact-search-input-box'],
                            class: ['km-contact-input-container'],
                        },
                        'vis',
                        'n-vis'
                    );

                    // add n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faqanswer'],
                            class: ['km-no-results-found-container'],
                        },
                        'n-vis',
                        'vis'
                    );

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
                    ? $applozic('#km-faq').addClass('vis')
                    : $applozic('#km-faq').addClass('n-vis');

                kommunicateCommons.modifyClassList(
                    {
                        id: ['mck-rate-conversation'],
                        class: ['mck-conversation'],
                    },
                    'vis',
                    'n-vis'
                );

                // add n-vis
                kommunicateCommons.modifyClassList(
                    {
                        id: ['faq-common', 'km-faqdiv', 'km-contact-search-input-box'],
                        class: [
                            'km-faq-category-list-container',
                            'km-no-results-found-container',
                            'mck-agent-status-text',
                            'mck-agent-image-container',
                            'mck-agent-status-indicator',
                        ],
                    },
                    'n-vis',
                    'vis'
                );

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
                        kommunicateCommons.hide(
                            '#km-contact-search-input-box',
                            '#mck-no-conversations'
                        );
                        kommunicateCommons.show('#km-faqdiv', '#km-faqanswer');
                        KommunicateUI.toggleModernFaqBackButton(true);
                        kommunicateCommons.hide('.km-faq-back-btn-wrapper');
                        $applozic('#km-faqanswer .km-faqanswer').linkify({
                            target: '_blank',
                        });
                    }
                },
                error: function (error) {
                    throw new Error('Error while fetching faq details', error);
                },
            });
            kommunicateCommons.hide('.km-contact-input-container');
        });

        $applozic(d).on('click', '#km-faqanswer a', function (e) {
            e.preventDefault();
            window.open(e.target.href);
        });

        var $faqSearchIcon = $applozic('.km-faqsearch-icon');
        var $faqClearIcon = $applozic('.km-faqsearch-clear');

        function setFaqSearchIconState(hasValue) {
            if (hasValue) {
                $faqClearIcon.removeClass('n-vis');
            } else {
                $faqClearIcon.addClass('n-vis');
            }
        }

        $applozic('#km-faq-search-input').keyup(
            kommunicateCommons.debounce(function (e) {
                var searchQuery = e.target.value;

                setFaqSearchIconState(searchQuery.length > 0);
                if (!document.querySelector('.km-faq-category-list-container.n-vis')) {
                    MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                        MCK_EVENT_HISTORY.push('km-faq-list');
                    kommunicateCommons.modifyClassList(
                        {
                            class: ['km-faq-category-list-container'],
                        },
                        'n-vis',
                        'vis'
                    );
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faq-list-container'],
                        },
                        'vis',
                        'n-vis'
                    );
                }
                if (e.which == 32 || e.which == 13) {
                    KommunicateUI.searchFaqs(data);
                    return;
                }
                KommunicateUI.searchFaqs(data);
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
        kommunicateCommons.modifyClassList(
            {
                class: ['km-no-results-found-container'],
            },
            'vis',
            'n-vis'
        );
        document.querySelector('.km-talk-to-human-div p').innerHTML = MCK_LABELS['no-faq-found'];
        document.querySelector('.km-no-results-found p').innerHTML = MCK_LABELS['faq-empty-state'];
    },
    flushFaqsEvents: function () {
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
            kommunicateCommons.show('.km-faq-category-list-container');
            return;
        }
        if (response.data && response.data.length === 0) {
            kommunicateCommons.modifyClassList(
                {
                    class: ['km-no-results-found-container'],
                },
                'vis',
                'n-vis'
            );
            document.querySelector('.km-talk-to-human-div p').innerHTML =
                MCK_LABELS['no-faq-found'];
            document.querySelector('.km-no-results-found p').innerHTML =
                MCK_LABELS['faq.no.results'] || 'No results found';
        } else {
            kommunicateCommons.modifyClassList(
                {
                    class: ['km-no-results-found-container'],
                },
                'n-vis',
                'vis'
            );
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
        kommunicateCommons.show('#km-faqdiv', '#km-faq-list-container');
        kommunicateCommons.hide('.km-faq-category-list-container');
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
                error: function () {
                    console.log('error while searching faq', err);
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
                    console.log('error while searching faq', err);
                },
            });
        }
    },
    hideFaq: function () {
        kommunicateCommons.hide('#km-contact-search-input-box');
        kommunicateCommons.hide('#km-faqdiv');
        $applozic('#mck-msg-new').attr('disabled', false);
        KommunicateUI.flushFaqsEvents();
    },
    hideMessagePreview: function () {
        kommunicateCommons.hide('#mck-msg-preview-visual-indicator');
        $applozic('#mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text').html(
            ''
        );
    },

    showChat: function (options) {
        var keepConversationHeader = false;
        if (typeof options === 'boolean') {
            keepConversationHeader = options;
        } else if (options && typeof options.keepConversationHeader !== 'undefined') {
            keepConversationHeader = options.keepConversationHeader;
        }
        var isModernLayout = kommunicateCommons.isModernLayoutEnabled();
        var shouldShowConversationListHeader = keepConversationHeader && isModernLayout;
        var shouldShowChatHeader = !shouldShowConversationListHeader;
        kommunicateCommons.setWidgetStateOpen(true);
        kommunicateCommons.hide('#faq-common');
        kommunicateCommons.show('.mck-conversation');
        if (isModernLayout) {
            if (shouldShowConversationListHeader) {
                kommunicateCommons.show('#mck-tab-conversation');
                kommunicateCommons.hide('#mck-tab-individual');
                if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
                    KM_TOP_BAR.toggleBackButton(false);
                }
                KommunicateUI.isConversationListView = true;
                kommunicateCommons.hide('#km-widget-options');
            } else {
                kommunicateCommons.hide('#mck-tab-conversation');
                kommunicateCommons.show('#mck-tab-individual');
                KommunicateUI.isConversationListView = false;
                kommunicateCommons.show('#km-widget-options');
            }
        }
        if (shouldShowChatHeader) {
            kommunicateCommons.show('#mck-tab-individual');
            kommunicateCommons.show('#mck-tab-individual .mck-name-status-container');
            kommunicateCommons.show('#mck-tab-individual .mck-tab-link.mck-back-btn-container');
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
    },
    showHeader: function () {
        kommunicateCommons.show('#mck-tab-individual');
        kommunicateCommons.hide('#mck-tab-conversation');
        KommunicateUI.resetConversationListTitle();
        $applozic('#mck-msg-new').attr('disabled', false);
        KommunicateUI.isConversationListView = false;
        kommunicateCommons.show('#km-widget-options');
    },
    showConversationList: function () {
        kommunicateCommons.hide('#mck-tab-individual');
        kommunicateCommons.show('#mck-tab-conversation');
        kommunicateCommons.show('#mck-contacts-content');
        kommunicateCommons.hide('#km-widget-options');
        kommunicateCommons.hide('.km-option-faq');
        if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
            KM_TOP_BAR.showConversationHeader();
            KM_TOP_BAR.toggleAvatar(false);
            KM_TOP_BAR.toggleBackButton(false);
        }
        KommunicateUI.setIndividualTitle();
        KommunicateUI.resetConversationListTitle();
        KommunicateUI.toggleModernFaqBackButton(false);
        kommunicateCommons.hide('.km-faq-back-btn-wrapper');
        kommunicateCommons.hide('#km-faq-back-btn');
        kommunicateCommons.hide('#mck-tab-individual .mck-tab-link.mck-back-btn-container');
        kommunicateCommons.modifyClassList(
            {
                class: ['km-faq-back-btn-wrapper'],
            },
            'vis',
            'n-vis'
        );
        KommunicateUI.isFAQPrimaryCTA() && kommunicateCommons.show('#km-faq');
        $applozic('#mck-msg-new').attr('disabled', false);
        MCK_EVENT_HISTORY.length = 0;
        KommunicateUI.isConversationListView = true;
    },
    hasConversationHistory: false,
    isConversationListView: false,
    setHasConversationHistory: function (value) {
        var boolValue = Boolean(value);
        KommunicateUI.hasConversationHistory = boolValue;
        KommunicateUI.updateWelcomeCtaLabel && KommunicateUI.updateWelcomeCtaLabel();
        if (typeof window !== 'undefined' && window.KmBottomTabsManager) {
            window.KmBottomTabsManager.toggleConversationTabVisibility(boolValue);
        }
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
        var labelKey = KommunicateUI.hasConversationHistory
            ? 'mck.empty.welcome.cta.continue'
            : 'mck.empty.welcome.cta';
        var fallback = KommunicateUI.hasConversationHistory
            ? 'Continue previous conversation'
            : 'Send us a message';
        sendCta.textContent = KommunicateUI.getLabel('mck.empty.welcome.cta', 'Send us a message');
        continueCta.textContent = KommunicateUI.getLabel(
            'mck.empty.welcome.cta.continue',
            'Continue previous conversation'
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
        if (!kommunicateCommons.isModernLayoutEnabled()) {
            return;
        }
        var faqTitle = KommunicateUI.getFaqTitle();
        if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
            KM_TOP_BAR.setConversationTitle(faqTitle);
            KM_TOP_BAR.showConversationHeader();
            KM_TOP_BAR.toggleAvatar(false);
            KM_TOP_BAR.toggleBackButton(false);
            return;
        }
        KommunicateUI.setConversationTitle(faqTitle);
        kommunicateCommons.show('#mck-tab-conversation');
        kommunicateCommons.hide('#mck-tab-individual');
    },
    showFaqDetailsHeaderState: function () {
        var faqTitle = KommunicateUI.getFaqTitle();
        if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
            KM_TOP_BAR.setFaqTitle();
            KM_TOP_BAR.showDualHeader();
            KM_TOP_BAR.toggleAvatar(false);
            KM_TOP_BAR.toggleBackButton(false);
            return;
        }
        KommunicateUI.setIndividualTitle(faqTitle);
        kommunicateCommons.show('#mck-tab-individual');
        kommunicateCommons.show('#mck-tab-conversation');
        kommunicateCommons.hide(
            '.mck-agent-image-container',
            '.mck-agent-status-text',
            '.mck-agent-status-indicator'
        );
    },
    setConversationTitle: function (text) {
        var value = text || KommunicateUI.getLabel('conversations.title', 'Conversations');
        if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
            KM_TOP_BAR.setConversationTitle(value);
            return;
        }
        var conversationTitle = document.getElementById('mck-conversation-title');
        conversationTitle && (conversationTitle.textContent = value);
    },
    setIndividualTitle: function (text) {
        var value = text || KommunicateUI.getLabel('conversations.title', 'Conversations');
        if (typeof KM_TOP_BAR !== 'undefined' && KM_TOP_BAR) {
            KM_TOP_BAR.setIndividualTitle(value);
            return;
        }
        var individualTitle = document.getElementById('mck-tab-title');
        individualTitle && (individualTitle.textContent = value);
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
        kommunicateCommons.modifyClassList(
            {
                class: ['km-faq-category-list-container'],
            },
            'vis',
            'n-vis'
        );
        kommunicateCommons.modifyClassList(
            {
                id: ['km-faq-list-container'],
            },
            'n-vis',
            'vis'
        );
        kommunicateCommons.hide('.km-no-results-found-container');
        kommunicateCommons.show('#km-contact-search-input-box');
        kommunicateCommons.hide('.km-faq-back-btn-wrapper');
        KommunicateUI.toggleModernFaqBackButton(false);
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
        $applozic('.mck-agent-image-container .mck-agent-status-indicator')
            .removeClass('mck-status--online')
            .removeClass('mck-status--offline')
            .removeClass('mck-status--away')
            .removeClass('n-vis')
            .addClass('vis mck-status--' + status);
        $applozic('#mck-agent-status-text')
            .text(MCK_LABELS[status])
            .addClass('vis')
            .removeClass('n-vis');
    },
    toggleVoiceOutputOverride: function (voiceOutput) {
        if (voiceOutput) {
            kommunicateCommons.modifyClassList(
                { id: ['user-overide-voice-output-svg-off'] },
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                { id: ['user-overide-voice-output-svg-on'] },
                '',
                'n-vis'
            );
            document.getElementById('user-overide-voice-output-text').innerText =
                MCK_LABELS['conversation.header.dropdown'].USER_OVERIDE_VOICE_OUTPUT_OFF;
        } else {
            kommunicateCommons.modifyClassList(
                { id: ['user-overide-voice-output-svg-on'] },
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                { id: ['user-overide-voice-output-svg-off'] },
                '',
                'n-vis'
            );
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
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                'n-vis',
                'vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                'km-mid-conv-csat'
            );

            kommunicateCommons.modifyClassList(
                {
                    id: ['csat-1', 'csat-2', 'mck-feedback-text-wrapper'],
                },
                'vis',
                'n-vis'
            );
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
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-conversation-status-box'],
                },
                'vis',
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                '',
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-widget-options'],
                },
                'n-vis'
            );
            KommunicateUI.updateScroll(messageBody);
        } else {
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-csat-text-1'],
                },
                'vis',
                'n-vis'
            );
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
        isConversationClosed &&
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                'n-vis'
            );
        if (KommunicateUI.isConversationResolvedFromZendesk) {
            isCSATenabled && KommunicateUI.triggerCSAT();
            // if (document.getElementById('mck-csat-close').className == "n-vis") {
            //     kommunicateCommons.modifyClassList(
            //         {
            //             id: ['mck-csat-close'],
            //         },
            //         'vis',
            //         'n-vis'
            //     );
            // }
            document.getElementById('mck-submit-comment').onclick = function (e) {
                kommunicateCommons.modifyClassList(
                    {
                        class: ['mck-ratings-smilies'],
                    },
                    'n-vis'
                );
                kommunicateCommons.modifyClassList(
                    {
                        id: ['csat-1'],
                    },
                    'n-vis'
                );
            };
            var isCSATenabled = kommunicate._globals.oneTimeRating
                ? kommunicate._globals.collectFeedback &&
                  KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] !=
                      KommunicateConstants.FEEDBACK_API_STATUS.RATED
                : kommunicate._globals.collectFeedback;
            if (!isCSATenabled) {
                kommunicateCommons.modifyClassList(
                    {
                        id: ['mck-conversation-status-box'],
                    },
                    'n-vis',
                    'vis'
                );
            }

            document.getElementById('mck-submit-comment').disabled = false;
            kommunicateCommons.modifyClassList({ class: ['mck-rating-box'] }, '', 'selected');
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                'n-vis',
                'vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-csat-text-1'],
                },
                '',
                'n-vis'
            );
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
                kommunicateCommons.modifyClassList(
                    {
                        class: ['mck-box-form-container'],
                    },
                    'n-vis'
                );
                kommunicateCommons.modifyClassList(
                    {
                        class: ['mck-csat-text-1'],
                    },
                    '',
                    'n-vis'
                );
                kommunicateCommons.modifyClassList(
                    {
                        id: ['mck-sidebox-ft'],
                    },
                    'mck-restart-conv-banner'
                );
                kommunicateCommons.modifyClassList(
                    {
                        id: ['csat-1', 'csat-2', 'csat-3'],
                    },
                    'n-vis'
                );
                kommunicateCommons.modifyClassList(
                    {
                        id: ['km-widget-options'],
                    },
                    'n-vis'
                );
                /*
                csat-1 : csat rating first screen where you can rate via emoticons.
                csat-2 : csat rating second screen where you can add comments.
                csat-3 : csat result screen where you show overall feedback.
                */
                if (!feedback) {
                    // no rating given after conversation is resolved
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['csat-1', 'csat-2'],
                        },
                        '',
                        'n-vis'
                    );
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
            kommunicateCommons.modifyClassList(
                {
                    id: ['csat-1', 'csat-2', 'csat-3', 'mck-rated'],
                },
                'n-vis',
                ''
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                '',
                'km-mid-conv-csat'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-conversation-status-box'],
                },
                'n-vis',
                'vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                '',
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-csat-text-1'],
                },
                'n-vis'
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
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-conversation-status-box'],
                },
                'vis',
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form-container'],
                },
                '',
                'n-vis'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-widget-options'],
                },
                'n-vis'
            );
            KommunicateUI.updateScroll(messageBody);
        } else {
            kommunicateCommons.modifyClassList(
                {
                    id: ['csat-1', 'csat-2', 'csat-3', 'mck-rated'],
                },
                'n-vis',
                ''
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-sidebox-ft'],
                },
                '',
                'km-mid-conv-csat'
            );
            kommunicateCommons.modifyClassList(
                {
                    id: ['mck-conversation-status-box'],
                },
                'n-vis',
                'vis'
            );
            !KM_GLOBAL.disableTextArea &&
                kommunicateCommons.modifyClassList(
                    {
                        class: ['mck-box-form-container'],
                    },
                    '',
                    'n-vis'
                );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-csat-text-1'],
                },
                'n-vis'
            );
        }
    },
    handleAttachmentIconVisibility: function (enableAttachment, msg, groupReloaded) {
        if (
            !groupReloaded &&
            typeof msg.metadata === 'object' &&
            msg.metadata.KM_ENABLE_ATTACHMENT
        ) {
            msg.metadata.KM_ENABLE_ATTACHMENT == 'true' &&
                kommunicateCommons.modifyClassList(
                    { id: ['mck-attachfile-box', 'mck-file-up'] },
                    'vis',
                    'n-vis'
                );
            msg.metadata.KM_ENABLE_ATTACHMENT == 'false' &&
                kommunicateCommons.modifyClassList(
                    { id: ['mck-attachfile-box', 'mck-file-up'] },
                    'n-vis',
                    'vis'
                );
        } else if (groupReloaded && enableAttachment) {
            enableAttachment == 'true' &&
                kommunicateCommons.modifyClassList(
                    { id: ['mck-attachfile-box', 'mck-file-up'] },
                    'vis',
                    'n-vis'
                );
            enableAttachment == 'false' &&
                kommunicateCommons.modifyClassList(
                    { id: ['mck-attachfile-box', 'mck-file-up'] },
                    'n-vis',
                    'vis'
                );
        }
    },
    displayPopupChatTemplate: function (
        popupChatContent,
        chatWidget,
        mckChatPopupNotificationTone
    ) {
        var enableGreetingMessage =
            kommunicateCommons.isObject(chatWidget) &&
            chatWidget.hasOwnProperty('enableGreetingMessageInMobile')
                ? chatWidget.enableGreetingMessageInMobile
                : true;
        var isPopupEnabled =
            kommunicateCommons.isObject(chatWidget) &&
            chatWidget.popup &&
            (kommunicateCommons.checkIfDeviceIsHandheld() ? enableGreetingMessage : true);
        var delay = popupChatContent && popupChatContent.length ? popupChatContent[0].delay : -1;
        var popupTemplateKey =
            (popupChatContent && popupChatContent.length && popupChatContent[0].templateKey) ||
            KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL;
        if (isPopupEnabled && delay > -1) {
            MCK_CHAT_POPUP_TEMPLATE_TIMER = setTimeout(function () {
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
        if (showTemplate && !kommunicateCommons.isWidgetOpen()) {
            if (playPopupTone == null || playPopupTone) {
                mckChatPopupNotificationTone && mckChatPopupNotificationTone.play();
                appOptionSession.setSessionData('playPopupNotificationTone', false);
            }
            var popupTemplateClass =
                KommunicateConstants.CHAT_POPUP_TEMPLATE_CLASS[popupTemplateKey];

            kommunicateIframe.classList.add(popupTemplateClass.replace('-container-', ''));

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
            kommunicateCommons.modifyClassList(
                { id: ['chat-popup-widget-container'] },
                'n-vis',
                'km-animate'
            );
        }
    },
    handleConversationBanner: function () {
        var conversationFilterBanner = document.getElementById('mck-conversation-filter');
        conversationFilterBanner &&
            conversationFilterBanner.parentNode.removeChild(conversationFilterBanner);
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
        var mckTabTitle = document.getElementById('mck-tab-title');
        mckTabTitle.classList.remove(titleClassName);
        if (document.querySelector('.km-kb-container').classList.contains('vis')) {
            titleClassName = isPopupWidgetEnabled
                ? 'mck-title-width-with-faq'
                : 'mck-title-width-with-faq-close-btn';
        }
        mckTabTitle.classList.add(titleClassName);
    },
    setFAQButtonText: function () {
        document.querySelector('#km-faq').textContent = MCK_LABELS['faq'];
    },
    checkSingleThreadedConversationSettings: function (hasMultipleConversations) {
        if (
            kommunicateCommons.isObject(kommunicate._globals.widgetSettings) &&
            kommunicate._globals.widgetSettings.isSingleThreaded
        ) {
            var startConversationButton = document.getElementById('mck-contacts-content');
            var backButton = document.querySelector('.mck-back-btn-container');
            startConversationButton.classList.add('force-n-vis');
            hasMultipleConversations
                ? backButton.classList.remove('force-n-vis')
                : backButton.classList.add('force-n-vis');
        }
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
                            '#km-restart-conversation'
                        );
                        CURRENT_GROUP_DATA.isWaitingQueue = true;
                        headerTabTitle.innerHTML =
                            MCK_LABELS['waiting.queue.message']['header.text'];
                        var messageBody = document.querySelector(
                            '.mck-message-inner.mck-group-inner'
                        );
                        if (messageBody) {
                            KommunicateUI.updateScroll(messageBody);
                        }
                    } else {
                        kommunicateCommons.hide('#mck-waiting-queue');

                        headerTabTitle = document.getElementById('mck-tab-title');
                        headerTabTitle.innerHTML = headerTabTitle.getAttribute('title');

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
                    kommunicateCommons.modifyClassList(
                        {
                            class: ['mck-box-form-container'],
                        },
                        'n-vis',
                        'vis'
                    );
                    break;
                } else {
                    kommunicateCommons.modifyClassList(
                        {
                            class: ['mck-box-form-container'],
                        },
                        'n-vis'
                    );
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
