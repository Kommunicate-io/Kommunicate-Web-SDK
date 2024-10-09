/**
 * Add all Kommunicate UI Manipulation in this file.
 *
 */
var kommunicateCommons = new KommunicateCommons();
var KM_GLOBAL = kommunicate._globals;
KommunicateUI = {
    awayMessageInfo: {},
    awayMessageScroll: true,
    leadCollectionEnabledOnAwayMessage: false,
    welcomeMessageEnabled: false,
    leadCollectionEnabledOnWelcomeMessage: false,
    anonymousUser: false,
    showResolvedConversations: false,
    isCSATtriggeredByUser: false,
    isConvJustResolved: false,
    isConversationResolvedFromZendesk: false,
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
        if (
            !err &&
            (message.code == 'SUCCESS' || message.code == 'AGENTS_ONLINE')
        ) {
            KommunicateUI.leadCollectionEnabledOnAwayMessage =
                message.data.collectEmailOnAwayMessage;
            if (
                message.code != 'AGENTS_ONLINE' &&
                message.data.messageList.length > 0
            ) {
                KommunicateUI.awayMessageInfo['eventId'] =
                    message.data.messageList[0].eventId;
                KommunicateUI.awayMessageInfo['isEnabled'] = true;
            }
            KommunicateUI.leadCollectionEnabledOnWelcomeMessage =
                message.data.collectEmailOnWelcomeMessage;
            KommunicateUI.welcomeMessageEnabled =
                message.data.welcomeMessageEnabled;
            KommunicateUI.anonymousUser = message.data.anonymousUser;
            KommunicateUI.displayLeadCollectionTemplate(data);
        }
    },
    loadIntentDropdown: function () {
        var intentOptions = document.getElementById('mck-intent-options');
        var replyOption = kommunicate._globals.replyMenu;
        if (replyOption && intentOptions) {
            for (var i = 0; i <= replyOption.length; i++) {
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
        var conversationWindowNotActive = $applozic(
            '#mck-tab-individual'
        ).hasClass('n-vis');
        var closedConversation = $applozic(
            '#mck-conversation-status-box'
        ).hasClass('vis');
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
            $applozic('#mck-away-msg-box').removeClass('n-vis').addClass('vis');
        } else {
            $applozic('#mck-away-msg-box').removeClass('vis').addClass('n-vis');
        }
        var messageBody = document.querySelectorAll(
            '.mck-message-inner.mck-group-inner'
        )[0];
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
                    var svgDocument = parser.parseFromString(
                        decodedData,
                        'image/svg+xml'
                    );
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
            url:
                kommunicate.getBaseUrl() +
                '/rest/ws/extractlink?linkToExtract=' +
                url,
            type: 'GET',
            global: false,
            success: function (result) {
                if (result) {
                    var images = result.data.images;
                    result.data.images = images.length
                        ? KommunicateUI.checkSvgHasChildren(images)
                        : [];
                    // this happens when the link gets redirected
                    if (result.data.title === "ERROR: The request could not be satisfied") return;

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
        var conversationWindowNotActive = $applozic(
            '#mck-tab-individual'
        ).hasClass('n-vis');
        if (
            KommunicateUI.awayMessageInfo &&
            KommunicateUI.awayMessageInfo.isEnabled &&
            !conversationWindowNotActive
        ) {
            $applozic('#mck-email-collection-box')
                .removeClass('vis')
                .addClass('n-vis');
            $applozic('#mck-away-msg-box').removeClass('n-vis').addClass('vis');
        }
    },
    hideAwayMessage: function () {
        // $applozic("#mck-away-msg").html("");
        $applozic('#mck-away-msg-box').removeClass('vis').addClass('n-vis');
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
        $applozic('.mck-attachment-' + key + ' .mck-image-download').addClass(
            'n-vis'
        );
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
        var thumbnailUrl =
            template && template.dataset && template.dataset.thumbnailurl;
        thumbnailUrl &&
            $applozic('.mck-attachment-' + key + ' .file-preview-link').attr(
                'data-url',
                thumbnailUrl
            );
    },
    hideFileBox: function (file, $file_box, $mck_file_upload) {
        if (KommunicateUI.isAttachmentV2(file.type)) {
            $file_box.removeClass('vis').addClass('n-vis');
            $mck_file_upload.attr('disabled', false);
        } else {
            $file_box.removeClass('n-vis').addClass('vis');
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
        var template = document.querySelector(
            '.mck-message-inner.mck-group-inner'
        );
        template &&
            key &&
            (attachment = template.querySelector('.mck-attachment-' + key));
        if (attachment) {
            file_meta.blobKey &&
                attachment.setAttribute('data-filemetakey', file_meta.blobKey);
            file_meta.name &&
                attachment.setAttribute('data-filename', file_meta.name);
            attachment.setAttribute(
                'data-fileurl',
                file_meta.thumbnailUrl || file_meta.url
            );
            file_meta.size &&
                attachment.setAttribute('data-filesize', file_meta.size);
            attachment.setAttribute(
                'data-filetype',
                file_meta.contentType || file_meta.fileMeta.contentType
            );
            // need to update blobkey if media is encrypted.
            // Note: All the attachements sent from widget are encrypted
            file_meta.blobKey &&
                $applozic('.km-attachment-preview-href-' + key).attr(
                    'blobkey',
                    file_meta.blobKey
                );
        }
    },
    updateAttachmentStopUploadStatus: function (key, status) {
        var template = document.querySelector(
            '.mck-message-inner.mck-group-inner'
        );
        var attachment =
            template && template.querySelector('.mck-attachment-' + key);
        attachment && attachment.setAttribute('data-stopupload', status);
    },
    getAttachmentStopUploadStatus: function (key) {
        var stopUpload = $applozic('.mck-attachment-' + key).attr(
            'data-stopupload'
        );
        stopUpload = stopUpload == 'true' ? true : false;
        return stopUpload;
    },
    populateLeadCollectionTemplate: function () {
        KommunicateUI.hideAwayMessage();
        $applozic('#mck-email-collection-box')
            .removeClass('n-vis')
            .addClass('vis');
        $applozic('#mck-btn-attach-box').removeClass('vis').addClass('n-vis');
        $applozic('#mck-text-box').blur();
        $applozic('#mck-text-box').attr('data-text', 'Your email ID');
    },
    hideLeadCollectionTemplate: function () {
        $applozic('#mck-email-collection-box')
            .removeClass('vis')
            .addClass('n-vis');
        $applozic('#mck-email-error-alert-box')
            .removeClass('vis')
            .addClass('n-vis');
        $applozic('#mck-btn-attach-box').removeClass('n-vis').addClass('vis');
        $applozic('#mck-text-box').attr(
            'data-text',
            MCK_LABELS['input.message']
        );
    },
    validateEmail: function (sendMsg) {
        var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (sendMsg.match(mailformat)) {
            $applozic('#mck-email-error-alert-box')
                .removeClass('vis')
                .addClass('n-vis');
            this.hideLeadCollectionTemplate();
            window.$applozic.fn.applozic('updateUser', {
                data: { email: sendMsg },
            });
            // KommunicateUI.showAwayMessage();  lead collection feature improvement- [WIP]
            return true;
        } else {
            $applozic('#mck-email-error-alert-box')
                .removeClass('n-vis')
                .addClass('vis');
            $applozic('#mck-email-collection-box')
                .removeClass('vis')
                .addClass('n-vis');
            return false;
        }
    },

    initFaq: function () {
        var data = {};
        data.appId = kommunicate._globals.appId;

        // On Click of FAQ button the FAQ category List will open.
        $applozic(d).on('click', '#km-faq', function () {
            var isFaqCategoryPresent =
                kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.faqCategory;
            kmWidgetEvents.eventTracking(eventMapping.onFaqClick);
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage(
                    'mckActiveConversationInfo'
                );
            KommunicateUI.showHeader();
            KommunicateUI.awayMessageScroll = true;
            if (isFaqCategoryPresent) {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !==
                    'km-faq-list' && MCK_EVENT_HISTORY.push('km-faq-list');
            } else {
                MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !==
                    'km-faq-category-list' &&
                    MCK_EVENT_HISTORY.push('km-faq-category-list');
            }

            typingService.resetState();

            // remove n-vis
            kommunicateCommons.modifyClassList(
                {
                    id: [
                        'km-contact-search-input-box',
                        'faq-common',
                        'km-faqdiv',
                        'mck-tab-title',
                        'km-faq-category-list-container',
                    ],
                    class: [
                        'mck-conversation-back-btn',
                        'km-contact-input-container',
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
                ? $applozic('#km-faq-category-list-container').addClass('n-vis')
                : $applozic('#km-faq-list-container').addClass('n-vis') &&
                  $applozic('#km-faq-category-list-container').removeClass(
                      'n-vis'
                  );

            $applozic('#mck-tab-title').html(MCK_LABELS['faq']);
            $applozic('#mck-msg-new').attr('disabled', false);
            $applozic(
                '#mck-tab-individual .mck-tab-link.mck-back-btn-container'
            )
                .removeClass('n-vis')
                .addClass('vis-table');
            $applozic(
                '#mck-tab-individual .mck-name-status-container.mck-box-title'
            ).removeClass('padding');
            KommunicateUI.checkSingleThreadedConversationSettings(true);
        });

        // on click of FAQ category card the FAQ list for that category will open
        $applozic(d).on('click', '.km-faq-category-card', function () {
            kommunicateCommons.modifyClassList(
                {
                    id: ['km-faq-category-list-container'],
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
            MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !== 'km-faq-list' &&
                MCK_EVENT_HISTORY.push('km-faq-list');
            var categoryName = this.getAttribute('data-category-name');
            document.querySelector('#km-faq-list-container').innerHTML = '';
            Kommunicate.getFaqList(data, categoryName);
        });

        // on click of back button previous window should open
        $applozic(d).on('click', '#mck-conversation-back-btn', function (e) {
            $applozic('.km-contact-input-container')
                .removeClass('vis')
                .addClass('n-vis');
            MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE &&
                kmLocalStorage.removeItemFromLocalStorage(
                    'mckActiveConversationInfo'
                );
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
                if (
                    MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] ==
                    'km-faq-category-list'
                ) {
                    KommunicateUI.showHeader();

                    // remove n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: [
                                'km-faqdiv',
                                'km-faq-category-list-container',
                                'km-contact-search-input-box',
                            ],
                            class: ['km-contact-input-container'],
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
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    return;
                } else if (
                    MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] ==
                    'km-faq-list'
                ) {
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
                    return;
                } else if (
                    typeof MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] ==
                    'object'
                ) {
                    // remove n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['mck-tab-conversation', 'km-faq'],
                            class: [
                                'mck-conversation',
                                'mck-agent-image-container',
                                'mck-agent-status-text',
                            ],
                        },
                        'vis',
                        'n-vis'
                    );

                    // add n-vis
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['faq-common'],
                            class: [
                                'km-no-results-found-container',
                                'km-talk-to-human-div',
                            ],
                        },
                        'n-vis',
                        'vis'
                    );
                    var elem = MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2];
                    document.getElementById('mck-tab-title').textContent = '';
                    $applozic.fn.applozic('openChat', elem);
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    KommunicateUI.activateTypingField();
                    return;
                } else {
                    KommunicateUI.isFAQPrimaryCTA() &&
                        $applozic('#km-faq')
                            .removeClass('n-vis')
                            .addClass('vis');
                    $applozic('#mck-msg-new').attr('disabled', false);
                    MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                    MCK_EVENT_HISTORY.length = 0;
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
                        id: [
                            'faq-common',
                            'km-faqdiv',
                            'km-faq-category-list-container',
                            'km-contact-search-input-box',
                        ],
                        class: [
                            'km-no-results-found-container',
                            'km-talk-to-human-div',
                            'mck-agent-status-text',
                            'mck-agent-image-container',
                            'mck-agent-status-indicator',
                        ],
                    },
                    'n-vis',
                    'vis'
                );

                kommunicateCommons.modifyClassList(
                    { class: ['mck-rating-box'] },
                    '',
                    'selected'
                );
                document.getElementById('mck-tab-title').textContent = '';
                MCK_EVENT_HISTORY.length = 0;
                KommunicateUI.handleConversationBanner();
                document.querySelector('#km-faq-search-input').value &&
                    document.querySelector('.km-clear-faq-search-icon').click();
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
            $applozic('#km-faqanswer').empty();
            MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !==
                'km-faq-answer-list' &&
                MCK_EVENT_HISTORY.push('km-faq-answer-list');
            var articleId = $applozic(this).attr('data-articleid');
            var source = $applozic(this).attr('data-source');
            KommunicateKB.getArticle({
                data: {
                    appId: data.appId,
                    articleId: articleId,
                    source: source,
                },
                success: function (response) {
                    var faqDetails = response && response.data;
                    if (
                        faqDetails &&
                        $applozic('#km-faqanswer .km-faqanswer-list').length ==
                            0
                    ) {
                        var faqTitle =
                            faqDetails.title &&
                            kommunicateCommons.formatHtmlTag(faqDetails.title);
                        // FAQ description is already coming in formatted way from the dashboard FAQ editor.
                        $applozic('#km-faqanswer').append(
                            '<div class="km-faqanswer-list ql-snow"><div class="km-faqquestion">' +
                                faqTitle +
                                '</div> <div class="km-faqanchor km-faqanswer ql-editor">' +
                                faqDetails.body +
                                '</div></div>'
                        );
                        $applozic('#km-contact-search-input-box')
                            .removeClass('vis')
                            .addClass('n-vis');
                        $applozic('#km-faqdiv')
                            .removeClass('vis')
                            .addClass('n-vis');
                        $applozic('#km-faqanswer')
                            .removeClass('n-vis')
                            .addClass('vis');
                        $applozic('#mck-tab-individual')
                            .removeClass('n-vis')
                            .addClass('vis');
                        $applozic('#mck-tab-conversation')
                            .removeClass('vis')
                            .addClass('n-vis');
                        $applozic('#mck-no-conversations')
                            .removeClass('vis')
                            .addClass('n-vis');
                        $applozic('#km-faqanswer .km-faqanswer').linkify({
                            target: '_blank',
                        });
                    }
                },
                error: function (error) {
                    throw new Error('Error while fetching faq details', error);
                },
            });
            $applozic('.km-contact-input-container')
                .removeClass('vis')
                .addClass('n-vis');
        });

        $applozic(d).on('click', '#km-faqanswer a', function (e) {
            e.preventDefault();
            window.open(e.target.href);
        });

        $applozic('#km-faq-search-input').keyup(
            kommunicateCommons.debounce(function (e) {
                var searchQuery = e.target.value;

                if (searchQuery.length > 0) {
                    $applozic('.km-clear-faq-search-icon')
                        .addClass('vis')
                        .removeClass('n-vis');
                } else {
                    $applozic('.km-clear-faq-search-icon')
                        .addClass('n-vis')
                        .removeClass('vis');
                }
                if (
                    !document.querySelector(
                        '#km-faq-category-list-container.n-vis'
                    )
                ) {
                    MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1] !==
                        'km-faq-list' && MCK_EVENT_HISTORY.push('km-faq-list');
                    kommunicateCommons.modifyClassList(
                        {
                            id: ['km-faq-category-list-container'],
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

        $applozic(d).on('click', '.km-clear-faq-search-icon', function () {
            $applozic('#km-faq-search-input').val('');
            $applozic('.km-clear-faq-search-icon')
                .addClass('n-vis')
                .removeClass('vis');
            // this is being used to simulate an Enter Key Press on the search input.
            var e = jQuery.Event('keyup');
            e.which = 13;
            $applozic('#km-faq-search-input').trigger(e);
        });
    },
    faqEmptyState: function () {
        kommunicateCommons.modifyClassList(
            {
                class: [
                    'km-no-results-found-container',
                    'km-talk-to-human-div',
                ],
            },
            'vis',
            'n-vis'
        );
        document.querySelector('.km-talk-to-human-div p').innerHTML =
            MCK_LABELS['no-faq-found'];
        document.querySelector('.km-no-results-found p').innerHTML =
            MCK_LABELS['faq-empty-state'];
    },
    flushFaqsEvents: function () {
        var lastEvent = MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 1];
        var backBtn = $applozic('#mck-conversation-back-btn')[0];
        if (
            lastEvent &&
            typeof lastEvent == 'string' &&
            lastEvent.includes('faq')
        ) {
            backBtn && backBtn.click();
            KommunicateUI.flushFaqsEvents();
        }
    },
    searchFaqUI: function (response) {
        if (response.data && response.data.length === 0) {
            kommunicateCommons.modifyClassList(
                {
                    class: [
                        'km-no-results-found-container',
                        'km-talk-to-human-div',
                    ],
                },
                'vis',
                'n-vis'
            );
            document.querySelector('.km-talk-to-human-div p').innerHTML =
                MCK_LABELS['no-faq-found'];
            document.querySelector('.km-no-results-found p').innerHTML =
                'NO RESULTS FOUND';
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
            kommunicateCommons.modifyClassList(
                {
                    class: ['km-talk-to-human-div'],
                },
                'vis',
                'n-vis'
            );
        }
        document.getElementById('km-faq-list-container').innerHTML = '';
        $applozic.each(response.data, function (i, faq) {
            var id = faq.id || faq.articleId;
            var title = faq.name || faq.title;
            title = title && kommunicateCommons.formatHtmlTag(title);
            document.getElementById('km-faq-list-container').innerHTML +=
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
        if (
            kommunicate &&
            kommunicate._globals &&
            kommunicate._globals.faqCategory
        ) {
            searchFilter.categoryName = kommunicate._globals.faqCategory;
        }
        if (!document.getElementById('km-faq-search-input').value) {
            KommunicateKB.getArticles({
                data: searchFilter,
                success: function (response) {
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
                    KommunicateUI.searchFaqUI(response);
                },
                error: function (err) {
                    console.log('error while searching faq', err);
                },
            });
        }
    },
    hideFaq: function () {
        $applozic('#km-contact-search-input-box')
            .removeClass('vis')
            .addClass('n-vis');
        $applozic('#km-faqdiv').removeClass('vis').addClass('n-vis');
        $applozic('#mck-msg-new').attr('disabled', false);
        KommunicateUI.flushFaqsEvents();
    },
    hideMessagePreview: function () {
        $applozic('#mck-msg-preview-visual-indicator')
            .removeClass('vis')
            .addClass('n-vis');
        $applozic(
            '#mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text'
        ).html('');
    },

    showChat: function () {
        kommunicateCommons.setWidgetStateOpen(true);
        $applozic('#faq-common').removeClass('vis').addClass('n-vis');
        $applozic('.mck-conversation').removeClass('n-vis').addClass('vis');
        KommunicateUI.isFAQPrimaryCTA() &&
            $applozic('#km-faq').removeClass('n-vis').addClass('vis');
        $applozic('#mck-msg-new').attr('disabled', false);
        if (
            $applozic(
                "#mck-message-cell .mck-message-inner div[name='message']"
            ).length === 0 &&
            isFirstLaunch == true
        ) {
            isFirstLaunch = false;
        } else {
            $applozic(
                '#mck-tab-individual .mck-tab-link.mck-back-btn-container'
            ).removeClass('n-vis');
            $applozic(
                '#mck-tab-individual .mck-name-status-container.mck-box-title'
            ).removeClass('padding');
        }
    },
    showHeader: function () {
        $applozic('#mck-tab-individual').removeClass('n-vis').addClass('vis');
        $applozic('#mck-tab-conversation').removeClass('vis').addClass('n-vis');
        $applozic('#mck-msg-new').attr('disabled', false);
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
        $applozic('.mck-agent-image-container')
            .removeClass('n-vis')
            .addClass('vis');
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
            document.getElementById(
                'user-overide-voice-output-text'
            ).innerText =
                MCK_LABELS[
                    'conversation.header.dropdown'
                ].USER_OVERIDE_VOICE_OUTPUT_OFF;
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
            document.getElementById(
                'user-overide-voice-output-text'
            ).innerText =
                MCK_LABELS[
                    'conversation.header.dropdown'
                ].USER_OVERIDE_VOICE_OUTPUT_ON;
        }
    },
    loadQuickReplies: function (quickReplies) {
        var intentList = document.getElementById('mck-intent-options');
        if (
            quickReplies.length > 0 &&
            intentList &&
            intentList.childElementCount < 1
        ) {
            kommunicateCommons.modifyClassList(
                { id: ['mck-quick-replies-box'] },
                'vis',
                'n-vis'
            );
            for (var i = 0; i <= quickReplies.length - 1; i++) {
                var li = document.createElement('li');
                li.innerText = quickReplies[i];
                intentList.appendChild(li);
                li.onclick = function (e) {
                    e.preventDefault();
                    document.getElementById(
                        'mck-text-box'
                    ).innerText = this.innerText;
                    document.getElementById('mck-msg-sbmt').click();
                };
            }
        }
    },
    triggerCSAT: function (triggeredByBot) {
        ratingService.resetStarsColor();
        var isConvRated =
            document.getElementsByClassName('mck-rated').length > 0;
        if (kommunicate._globals.oneTimeRating) {
            if (isConvRated && CURRENT_GROUP_DATA.tabId) {
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] =
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED;
            } else if (
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] >
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED ||
                !KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId]
            ) {
                kommunicateCommons.getFeedback(
                    CURRENT_GROUP_DATA.tabId,
                    function (params) {
                        KommunicateUI.convRatedTabIds[
                            CURRENT_GROUP_DATA.tabId
                        ] = params.data
                            ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                            : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                    }
                );
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
        var messageBody = document.querySelector(
            '.mck-message-inner.mck-group-inner'
        );
        if (isCSATenabled || triggeredByBot) {
            document.getElementById('mck-submit-comment').disabled = false;
            kommunicateCommons.modifyClassList(
                { class: ['mck-rating-box'] },
                '',
                'selected'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form'],
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
            var conversationStatusDiv = document.getElementById(
                'mck-conversation-status-box'
            );
            conversationStatusDiv &&
                (conversationStatusDiv.innerHTML = messageText);
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
                    class: ['mck-box-form'],
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
        var isConvRated =
            document.getElementsByClassName('mck-rated').length > 0;
        if (kommunicate._globals.oneTimeRating) {
            if (isConvRated && CURRENT_GROUP_DATA.tabId) {
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] =
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED;
            } else if (
                KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] >
                    KommunicateConstants.FEEDBACK_API_STATUS.RATED ||
                !KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId]
            ) {
                kommunicateCommons.getFeedback(
                    CURRENT_GROUP_DATA.tabId,
                    function (params) {
                        KommunicateUI.convRatedTabIds[
                            CURRENT_GROUP_DATA.tabId
                        ] = params.data
                            ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                            : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                    }
                );
            }
        }
        var ratingTitleElement = document.querySelector('.mck-csat-title');
        var messageText = MCK_LABELS['closed.conversation.message'];
        var ratingTitle = MCK_LABELS['csat.rating'].CONVERSATION_RATING_HEADING;

        ratingTitleElement && (ratingTitleElement.innerHTML = ratingTitle);
        var conversationStatusDiv = document.getElementById(
            'mck-conversation-status-box'
        );
        var isCSATtriggeredByUser = KommunicateUI.isCSATtriggeredByUser;
        var isConvJustResolved = KommunicateUI.isConvJustResolved;
        var isCSATenabled = kommunicate._globals.oneTimeRating
            ? kommunicate._globals.collectFeedback &&
              KommunicateUI.convRatedTabIds[CURRENT_GROUP_DATA.tabId] !=
                  KommunicateConstants.FEEDBACK_API_STATUS.RATED
            : kommunicate._globals.collectFeedback;
        var messageBody = document.querySelector(
            '.mck-message-inner.mck-group-inner'
        );
        isConversationClosed &&
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form'],
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
            document.getElementById('mck-submit-comment').onclick = function (
                e
            ) {
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
            kommunicateCommons.modifyClassList(
                { class: ['mck-rating-box'] },
                '',
                'selected'
            );
            kommunicateCommons.modifyClassList(
                {
                    class: ['mck-box-form'],
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
            kommunicateCommons.getFeedback(
                CURRENT_GROUP_DATA.tabId,
                feedbackResponseCallback
            );
            function feedbackResponseCallback(data) {
                var feedback = data.data;
                KommunicateUI.convRatedTabIds[
                    CURRENT_GROUP_DATA.tabId
                ] = feedback
                    ? KommunicateConstants.FEEDBACK_API_STATUS.RATED
                    : KommunicateConstants.FEEDBACK_API_STATUS.INIT;
                CURRENT_GROUP_DATA.currentGroupFeedback = feedback;
                kommunicateCommons.modifyClassList(
                    {
                        class: ['mck-box-form'],
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
                    document.getElementById(
                        'mck-submit-comment'
                    ).disabled = false;
                }
                KommunicateUI.updateScroll(messageBody);
            }
        } else if (
            isConversationClosed &&
            KommunicateUI.isCSATtriggeredByUser
        ) {
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
                    class: ['mck-box-form'],
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
            conversationStatusDiv &&
                (conversationStatusDiv.innerHTML = messageText);
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
                    class: ['mck-box-form'],
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
                        class: ['mck-box-form'],
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
    handleAttachmentIconVisibility: function (
        enableAttachment,
        msg,
        groupReloaded
    ) {
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
            (kommunicateCommons.checkIfDeviceIsHandheld()
                ? enableGreetingMessage
                : true);
        var delay =
            popupChatContent && popupChatContent.length
                ? popupChatContent[0].delay
                : -1;
        var popupTemplateKey =
            (popupChatContent &&
                popupChatContent.length &&
                popupChatContent[0].templateKey) ||
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
        kmWidgetEvents.eventTracking(
            eventMapping.onGreetingMessageNotificationClick
        );
    },
    togglePopupChatTemplate: function (
        popupTemplateKey,
        showTemplate,
        mckChatPopupNotificationTone
    ) {
        var kommunicateIframe = parent.document.getElementById(
            'kommunicate-widget-iframe'
        );
        var playPopupTone = appOptionSession.getPropertyDataFromSession(
            'playPopupNotificationTone'
        );
        if (showTemplate && !kommunicateCommons.isWidgetOpen()) {
            if (playPopupTone == null || playPopupTone) {
                mckChatPopupNotificationTone &&
                    mckChatPopupNotificationTone.play();
                    appOptionSession.setSessionData(
                    'playPopupNotificationTone',
                    false
                );
            }
            var popupTemplateClass =
                KommunicateConstants.CHAT_POPUP_TEMPLATE_CLASS[
                    popupTemplateKey
                ];

            kommunicateIframe.classList.add(
                popupTemplateClass.replace('-container-', '')
            );

            popupTemplateKey ===
                KommunicateConstants.CHAT_POPUP_TEMPLATE.HORIZONTAL &&
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
            var greetingMessageContainer = document.getElementById(
                'chat-popup-widget-container'
            );
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
            kommunicateIframe &&
                kommunicateIframe.classList.remove(
                    'chat-popup-widget-horizontal'
                );
            kommunicateIframe &&
                kommunicateIframe.classList.remove(
                    'chat-popup-widget-vertical'
                );
            kommunicateIframe &&
                kommunicateIframe.classList.remove(
                    'chat-popup-widget-actionable'
                );
            kommunicateCommons.modifyClassList(
                { id: ['chat-popup-widget-container'] },
                'n-vis',
                'km-animate'
            );
        }
    },
    handleConversationBanner: function (showBanner) {
        var totalConversations =
            document.querySelectorAll('ul#mck-contact-list li') &&
            document.querySelectorAll('ul#mck-contact-list li').length;
        var showAllBannerHtml = '<div id="mck-conversation-filter"><span id="mck-conversation-banner-heading">'
            .concat(
                MCK_LABELS['filter.conversation.list'].ACTIVE_CONVERSATIONS,
                '</span><span id="mck-conversation-banner-action" onclick="KommunicateUI.toggleShowResolvedConversationsStatus(),KommunicateUI.handleResolvedConversationsList()">'
            )
            .concat(
                MCK_LABELS['filter.conversation.list'].HIDE_RESOLVED,
                '</span></div>'
            );
        var resolvedConversations =
            document.getElementsByClassName('mck-conversation-resolved') &&
            document.getElementsByClassName('mck-conversation-resolved').length;
        var openConversations =
            document.getElementsByClassName('mck-conversation-open') &&
            document.getElementsByClassName('mck-conversation-open').length;
        var bannerParent = document.querySelector(
            '.mck-conversation.vis .mck-message-inner'
        );
        var conversationFilterBanner = document.getElementById(
            'mck-conversation-filter'
        );
        if (
            totalConversations !== openConversations &&
            totalConversations !== resolvedConversations &&
            !conversationFilterBanner &&
            bannerParent
        ) {
            bannerParent.insertAdjacentHTML('afterbegin', showAllBannerHtml);
        } else if (totalConversations === resolvedConversations) {
            conversationFilterBanner &&
                conversationFilterBanner.parentNode.removeChild(
                    conversationFilterBanner
                );
            KommunicateUI.showResolvedConversations = true;
        } else if (
            conversationFilterBanner &&
            totalConversations == openConversations
        ) {
            conversationFilterBanner &&
                conversationFilterBanner.parentNode.removeChild(
                    conversationFilterBanner
                );
            KommunicateUI.showResolvedConversations = false;
        }
        KommunicateUI.handleResolvedConversationsList();
    },
    toggleShowResolvedConversationsStatus: function () {
        KommunicateUI.showResolvedConversations = !KommunicateUI.showResolvedConversations;
    },
    handleResolvedConversationsList: function () {
        var bannerHeading = document.getElementById(
            'mck-conversation-banner-heading'
        );
        var bannerAction = document.getElementById(
            'mck-conversation-banner-action'
        );
        if (KommunicateUI.showResolvedConversations) {
            kommunicateCommons.modifyClassList(
                { class: ['mck-conversation-resolved'] },
                'mck-show-resolved-conversation'
            );
            bannerHeading &&
                (bannerHeading.innerHTML =
                    MCK_LABELS['filter.conversation.list'].ALL_CONVERSATIONS);
            if (
                bannerAction &&
                bannerAction.innerText ==
                    MCK_LABELS['filter.conversation.list'].SHOW_RESOLVED
            ) {
                kmWidgetEvents.eventTracking(eventMapping.onShowResolvedClick);
            }
            bannerAction &&
                (bannerAction.innerHTML =
                    MCK_LABELS['filter.conversation.list'].HIDE_RESOLVED);
        } else {
            kommunicateCommons.modifyClassList(
                { class: ['mck-conversation-resolved'] },
                '',
                'mck-show-resolved-conversation'
            );
            bannerHeading &&
                (bannerHeading.innerHTML =
                    MCK_LABELS[
                        'filter.conversation.list'
                    ].ACTIVE_CONVERSATIONS);
            bannerAction &&
                (bannerAction.innerHTML =
                    MCK_LABELS['filter.conversation.list'].SHOW_RESOLVED);
        }
    },
    adjustConversationTitleHeadingWidth: function (isPopupWidgetEnabled) {
        var titleClassName = 'mck-title-width-wo-faq-with-close-btn';
        var mckTabTitle = document.getElementById('mck-tab-title');
        mckTabTitle.classList.remove(titleClassName);
        if (
            document.querySelector('.km-kb-container').classList.contains('vis')
        ) {
            titleClassName = isPopupWidgetEnabled
                ? 'mck-title-width-with-faq'
                : 'mck-title-width-with-faq-close-btn';
        }
        mckTabTitle.classList.add(titleClassName);
    },
    setFAQButtonText: function () {
        document.querySelector('#km-faq').textContent = MCK_LABELS['faq'];
    },
    checkSingleThreadedConversationSettings: function (
        hasMultipleConversations
    ) {
        if (
            kommunicateCommons.isObject(kommunicate._globals.widgetSettings) &&
            kommunicate._globals.widgetSettings.isSingleThreaded
        ) {
            var startConversationButton = document.getElementById(
                'mck-contacts-content'
            );
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
            group &&
            group.conversationStatus ==
                Kommunicate.conversationHelper.status.WAITING;
        let waitingListEndpoint = `/rest/ws/group/waiting/list?teamId=${CURRENT_GROUP_DATA.teamId}`;
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
                    var waitingQueueNumber = document.getElementById(
                        'waiting-queue-number'
                    );
                    var headerTabTitle = document.getElementById(
                        'mck-tab-title'
                    );
                    if (
                        waitingQueueNumber &&
                        waitingStatus &&
                        isGroupPresentInWaitingQueue &&
                        WAITING_QUEUE.length
                    ) {
                        waitingQueueNumber.innerHTML =
                            '#' +
                            parseInt(
                                WAITING_QUEUE.indexOf(parseInt(groupId)) + 1
                            );
                        kommunicateCommons.modifyClassList(
                            {
                                id: ['mck-waiting-queue'],
                            },
                            'vis',
                            'n-vis'
                        );
                        kommunicateCommons.modifyClassList(
                            {
                                class: [
                                    'mck-agent-image-container',
                                    'mck-agent-status-text',
                                ],
                            },
                            'n-vis',
                            'vis'
                        );
                        headerTabTitle.innerHTML =
                            MCK_LABELS['waiting.queue.message']['header.text'];
                        var messageBody = document.querySelector(
                            '.mck-message-inner.mck-group-inner'
                        );
                        if (messageBody) {
                            KommunicateUI.updateScroll(messageBody);
                        }
                    } else {
                        kommunicateCommons.modifyClassList(
                            {
                                id: ['mck-waiting-queue'],
                            },
                            'n-vis',
                            'vis'
                        );

                        headerTabTitle = document.getElementById(
                            'mck-tab-title'
                        );
                        headerTabTitle.innerHTML = headerTabTitle.getAttribute(
                            'title'
                        );

                        var updateClasses = {
                            class: [
                                'mck-agent-image-container',
                                'mck-agent-status-text',
                            ],
                        };

                        KommunicateUI.isFAQPrimaryCTA() &&
                            (updateClasses.id = ['km-faq']);

                        kommunicateCommons.modifyClassList(
                            updateClasses,
                            'vis',
                            'n-vis'
                        );
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
        KommunicateUI.getUrlFromBlobKey(
            thumbnailBlobKey,
            function (err, thumbnailUrl) {
                if (err) {
                    throw err;
                }
                thumbnailUrl && (imageElement.src = thumbnailUrl);
                setTimeout(function () {
                    imageElement.classList.add('file-enc');
                }, KommunicateConstants.AWS_IMAGE_URL_EXPIRY_TIME);
            }
        );
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
                    attachmentWrapper &&
                    attachmentWrapper.querySelector('a.file-preview-link');
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
            kommunicate &&
            kommunicate._globals &&
            kommunicate._globals.disableTextArea;
        if (isDisableTextAreaEnabled && assignee && groupMembers) {
            for (var i = 0; i < groupMembers.length; i++) {
                if (
                    groupMembers[i] &&
                    groupMembers[i].userId === assignee &&
                    (groupMembers[i].roleType ==
                        KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT ||
                        groupMembers[i].role ==
                            KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT)
                ) {
                    kommunicateCommons.modifyClassList(
                        {
                            class: ['mck-box-form'],
                        },
                        'n-vis',
                        'vis'
                    );
                    break;
                } else {
                    kommunicateCommons.modifyClassList(
                        {
                            class: ['mck-box-form'],
                        },
                        'vis',
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
            if (
                key === KM_GLOBAL.primaryCTA &&
                KM_GLOBAL[data[key].identifier]
            ) {
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
        if (KM_GLOBAL.primaryCTA !== HEADER_CTA.RESTART_CONVERSATION)
            return false;

        return (
            KM_GLOBAL.primaryCTA === HEADER_CTA.RESTART_CONVERSATION &&
            !KommunicateUtils.isCurrentAssigneeBot()
        );
    },
};
