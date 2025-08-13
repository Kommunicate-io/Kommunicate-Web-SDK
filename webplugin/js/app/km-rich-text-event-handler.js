/**
 * Attach all event listeners.
 */

Kommunicate.attachEvents = function ($applozic) {
    var handlers = [
        ['.km-increment-guest-count', Kommunicate.richMsgEventHandler.incrementGuestCount],
        ['.km-decrement-guest-count', Kommunicate.richMsgEventHandler.decrementGuestCount],
        ['.km-btn-add-more-rooms', Kommunicate.richMsgEventHandler.addMoreRoom],
        ['.km-done-button', Kommunicate.richMsgEventHandler.processSelectedRoom],
        ['.km-card-message-footer-button', Kommunicate.richMsgEventHandler.processHotelBookClick],
        ['.mck-form-submit-button', Kommunicate.richMsgEventHandler.handleFormSubmit],
        ['.km-cta-button', Kommunicate.richMsgEventHandler.handleRichButtonClick],
        ['.km-submit-person-detail', Kommunicate.richMsgEventHandler.handlleSubmitPersonDetail],
        ['.km-block-room-button', Kommunicate.richMsgEventHandler.processBookRoomClick],
        ['.km-quick-replies', Kommunicate.richMsgEventHandler.processQuickReplies],
        ['.km-list-item-handler', Kommunicate.richMsgEventHandler.processClickOnListItem],
        ['.km-list-button-item-handler', Kommunicate.richMsgEventHandler.processClickOnButtonItem],
        ['.km-faq-dialog-button', Kommunicate.richMsgEventHandler.processClickOnDialogButton],
        ['.km-progress-meter-container', Kommunicate.attachmentEventHandler.manageUploadAttachment],
        ['.km-link-button', Kommunicate.richMsgEventHandler.handleLinkButtonClick],
        ['.km-attachment-icon', Kommunicate.attachmentEventHandler.handleSendingAttachment],
    ];
    handlers.forEach(function (h) {
        $applozic('#mck-message-cell').on('click', h[0], h[1]);
    });
};

/**
 * define your event listeners.
 */
Kommunicate.attachmentEventHandler = {
    manageUploadAttachment: function (e) {
        var stopUploadIconHidden = $applozic(e.target)
            .closest('.km-msg-box-attachment')
            .find('.km-progress-stop-upload-icon')
            .hasClass('n-vis');
        var uploadIconHidden = $applozic(e.target)
            .closest('.km-msg-box-attachment')
            .find('.km-progress-upload-icon')
            .hasClass('n-vis');
        var attachmentDiv = $applozic(e.target).closest('.km-msg-box-attachment').children();
        var msgkey = attachmentDiv[0].dataset.msgkey;
        var deliveryStatusDiv = $applozic(e.target)
            .closest('.mck-clear')
            .find('.mck-msg-right-muted');
        var fileMetaKey = attachmentDiv[0].dataset.filemetakey;
        var file = KM_PENDING_ATTACHMENT_FILE[msgkey];
        KommunicateUI.updateAttachmentStopUploadStatus(msgkey, true);
        if (Kommunicate.internetStatus) {
            if (!stopUploadIconHidden && uploadIconHidden) {
                Kommunicate.attachmentEventHandler.progressMeter(100, msgkey);
                $applozic('.km-progress-stop-upload-icon-' + msgkey)
                    .removeClass('vis')
                    .addClass('n-vis');
                $applozic('.km-progress-upload-icon-' + msgkey)
                    .removeClass('n-vis')
                    .addClass('vis');
                Kommunicate.attachmentEventHandler.progressMeter(100, msgkey);
                $applozic('.mck-timestamp-' + msgkey)
                    .removeClass('n-vis')
                    .addClass('vis');
                deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display = 'block';
            } else {
                var fileName = attachmentDiv[0].dataset.filename;
                var fileSize = attachmentDiv[0].dataset.filesize;
                var fileUrl = attachmentDiv[0].dataset.fileurl;
                var fileType = attachmentDiv[0].dataset.filetype;
                var groupId = attachmentDiv[0].dataset.groupid;
                var thumbnailUrl = attachmentDiv[0].dataset.thumbnailurl;
                if (fileSize && fileUrl && fileMetaKey && fileName && fileType) {
                    KommunicateUI.updateAttachmentStopUploadStatus(msgkey, false);
                    messagePxy = {
                        contentType: 1,
                        groupId: groupId,
                        fileMeta: {
                            blobKey: fileMetaKey,
                            url: fileUrl,
                            contentType: fileType,
                            size: fileSize,
                            key: fileMetaKey,
                            thumbnailUrl: fileUrl,
                            name: fileName,
                        },
                        message: '',
                        type: 5,
                        metadata: {},
                        key: msgkey,
                    };
                    var optns = {
                        tabId: groupId,
                    };
                    var params = {
                        messagePxy: messagePxy,
                        optns: optns,
                    };
                    $applozic.fn.applozic('submitMessage', params);
                    $applozic(e.target)
                        .closest('.km-msg-box-progressMeter')
                        .children()
                        .removeClass('km-progress-meter-back-drop');
                    $applozic(e.target).closest('.km-msg-box-progressMeter').addClass('n-vis');
                    $applozic('.mck-timestamp-' + msgkey)
                        .removeClass('n-vis')
                        .addClass('vis');
                    deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display =
                        'none';
                } else if (thumbnailUrl && groupId && msgkey && file) {
                    messagePxy = {
                        contentType: 1,
                        groupId: groupId,
                        key: msgkey,
                        fileMeta: {
                            thumbnailUrl: thumbnailUrl,
                            contentType: 1,
                            isUploaded: false,
                        },
                        message: '',
                        type: 5,
                        metadata: {},
                    };
                    params = {
                        params: {
                            file: file,
                            name: file.name,
                        },
                        messagePxy: messagePxy,
                    };
                    KommunicateUI.updateAttachmentStopUploadStatus(msgkey, false);
                    $applozic.fn.applozic('uploadAttachemnt', params);
                    $applozic('.mck-timestamp-' + msgkey)
                        .removeClass('n-vis')
                        .addClass('vis');
                    deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display =
                        'none';
                    delete KM_PENDING_ATTACHMENT_FILE[msgkey];
                    $applozic(e.target)
                        .closest('.km-msg-box-progressMeter')
                        .children()
                        .removeClass('km-progress-meter-back-drop');
                }
            }
        } else {
            KommunicateUI.displayUploadIconForAttachment(msgkey, false);
            KommunicateUI.updateAttachmentStopUploadStatus(msgkey, true);
        }
    },
    progressMeter: function (value, key) {
        var control = document.getElementById('km-progress-meter-input');
        var selector = '.progress-meter-' + key + ' .km-progress-value';
        var stopUpload = KommunicateUI.getAttachmentStopUploadStatus(key);
        if (stopUpload) {
            value = 100;
        }
        var progressValue = document.querySelector(selector);
        if (progressValue) {
            progressValue.style.strokeDasharray = KM_PROGRESS_METER_CIRCUMFERENCE;
            var progress = value / 100;
            var dashoffset = KM_PROGRESS_METER_CIRCUMFERENCE * (1 - progress);
            progressValue.style.strokeDashoffset = dashoffset;
            // value == 100 && !stopUpload && KommunicateUI.deleteProgressMeter(key);
        }
    },
    handleSendingAttachment: function (e) {
        var stopSending =
            !Kommunicate.internetStatus ||
            $applozic(e.target)
                .closest('.km-msg-box-attachment')
                .find('.km-attachment-cancel-icon')
                .hasClass('vis');
        var upload = $applozic(e.target)
            .closest('.km-msg-box-attachment')
            .find('.km-attachment-upload-icon')
            .hasClass('vis');
        var attachmentDiv = $applozic(e.target).closest('.km-msg-box-attachment').children();
        var msgKey = attachmentDiv[0].dataset.msgkey;
        var deliveryStatusDiv = $applozic(e.target)
            .closest('.mck-clear')
            .find('.mck-msg-right-muted');
        var file = KM_PENDING_ATTACHMENT_FILE[msgKey];
        var fileMetaKey = attachmentDiv[0].dataset.filemetakey;

        if (stopSending) {
            KommunicateUI.updateAttachmentStopUploadStatus(msgKey, true);
            kommunicateCommons.hide(
                '.km-attachment-progress-bar-success-' + msgKey,
                '.km-attachment-progress-bar-wrapper-' + msgKey
            );
            kommunicateCommons.show('.mck-timestamp-' + msgKey);
            kommunicateCommons.hide('.km-attachment-cancel-icon-' + msgKey);
            kommunicateCommons.show('.km-attachment-upload-icon-' + msgKey);
            deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display = 'block';
        } else {
            var fileName = attachmentDiv[0].dataset.filename;
            var fileSize = attachmentDiv[0].dataset.filesize;
            var fileType = attachmentDiv[0].dataset.filetype;
            var groupId = attachmentDiv[0].dataset.groupid;
            var thumbnailUrl = attachmentDiv[0].dataset.thumbnailurl;
            var fileUrl = attachmentDiv[0].dataset.fileurl;
            if (fileSize && fileMetaKey && fileName && fileType && fileUrl) {
                KommunicateUI.updateAttachmentStopUploadStatus(msgKey, false);
                messagePxy = {
                    contentType: 1,
                    groupId: groupId,
                    fileMeta: {
                        blobKey: fileMetaKey,
                        contentType: fileType,
                        size: fileSize,
                        key: fileMetaKey,
                        name: fileName,
                        url: fileUrl,
                        thumbnailUrl: fileUrl,
                    },
                    message: '',
                    type: 5,
                    metadata: {},
                    key: msgKey,
                };
                var optns = {
                    tabId: groupId,
                };
                var params = {
                    messagePxy: messagePxy,
                    optns: optns,
                };
                $applozic.fn.applozic('submitMessage', params);
                kommunicateCommons.hide(
                    '.km-attachment-cancel-icon-' + msgKey,
                    '.km-attachment-upload-icon-' + msgKey
                );
                deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display = 'none';
                kommunicateCommons.hide('.mck-timestamp-' + msgKey);
            } else if (thumbnailUrl && groupId && msgKey && file) {
                messagePxy = {
                    contentType: 1,
                    groupId: groupId,
                    key: msgKey,
                    fileMeta: {
                        thumbnailUrl: thumbnailUrl,
                        contentType: 1,
                        isUploaded: false,
                    },
                    message: '',
                    type: 5,
                    metadata: {},
                };
                params = {
                    params: {
                        file: file,
                        name: file.name,
                    },
                    messagePxy: messagePxy,
                };
                KommunicateUI.updateAttachmentStopUploadStatus(msgKey, false);
                $applozic.fn.applozic('uploadAttachemnt', params);
                kommunicateCommons.show('.mck-timestamp-' + msgKey);
                deliveryStatusDiv[0].querySelector('.mck-sending-failed').style.display = 'none';
                delete KM_PENDING_ATTACHMENT_FILE[msgKey];
            }
        }
    },
};

Kommunicate.richMsgEventHandler = {
    disabledCTAMap: [],
    svg: {
        arrow:
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 10 19"><path fill="#1c1c1c" fill-rule="evenodd" d="M9.076 18.266c.21.2.544.2.753 0a.53.53 0 0 0 0-.753L1.524 9.208 9.829.903a.53.53 0 0 0 0-.752.546.546 0 0 0-.753 0L.026 9.208l9.05 9.058z"/></svg>',
    },
    initializeSlick: function ($cardMessageContainer) {
        if ($cardMessageContainer.length > 0) {
            var slider = tns({
                container: $cardMessageContainer[0],
                edgePadding: 60,
                items: 1,
                slideBy: 'page',
                loop: false,
                controlsText: [
                    Kommunicate.richMsgEventHandler.svg.arrow,
                    Kommunicate.richMsgEventHandler.svg.arrow,
                ],
                mouseDrag: true,
                arrowKeys: true,
                onInit: function () {
                    console.log('tiny-slider initilized');
                },
            });
        }
    },
    decrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        var type = target.dataset.type;
        if (type == 'guest') {
            target.parentElement.getElementsByClassName('km-room-number-field')[0].stepDown();
        } else if (type == 'children') {
            target.parentElement.getElementsByClassName('km-person-number-field')[0].stepDown();
        }
    },

    incrementGuestCount: function (e) {
        var target = e.target || e.srcElement;
        var type = target.dataset.type;
        if (type == 'guest') {
            target.parentElement.getElementsByClassName('km-room-number-field')[0].stepUp();
        } else if (type == 'children') {
            target.parentElement.getElementsByClassName('km-person-number-field')[0].stepUp();
        }
    },

    decrementPersonCount: function () {
        document.getElementById('km-person-number-field').stepDown();
    },
    incrementPersonCount: function () {
        document.getElementById('km-person-number-field').stepUp();
    },
    addMoreRoom: function (e) {
        var container = e.target.parentElement.parentElement.parentElement;
        var roomCount = Number(e.target.dataset.roomcount) + 1;
        e.target.setAttribute('data-roomcount', roomCount);
        var roomInfoElem = document.createElement('div');
        roomInfoElem.innerHTML = Kommunicate.markup.getSingleRoomPaxInfo(roomCount);
        container
            .getElementsByClassName('km-room-person-selector-container')[0]
            .appendChild(roomInfoElem);
    },
    processSelectedRoom: function (e) {
        //TODO : handle multiple room select
        var roomGuestJson = [];
        var roomGuest = $(e.target)
            .closest('.mck-msg-box-rich-text-container')
            .find('.km-room-person-selector-container input.km-room-number-field');
        var NoOfChild = $(e.target)
            .closest('.mck-msg-box-rich-text-container')
            .find('.km-room-person-selector-container input.km-person-number-field');
        // TODO: process number of child if required

        var message = '';
        for (var i = 0; i < roomGuest.length; i++) {
            var noOfChild = NoOfChild[i].value;
            var arr = Array(noOfChild * 1).fill(10);
            roomGuestJson.push({
                NoOfAdults: roomGuest[i].value,
                NoOfChild: noOfChild,
                ChildAge: arr,
            });
            message += 'Room ' + (i + 1) + ' Guest ' + roomGuest[i].value + '\n';
        }
        Kommunicate.richMsgEventHandler.handleDisableCTA(e);
        //send message to group
        //[{"NoOfAdults":1,"NoOfChild":2,"ChildAge":[8,9]}]
        var messagePxy = {
            message: message, //message to send
            metadata: {
                isRoomGuestJSON: true,
                roomGuestJson: JSON.stringify(roomGuestJson),
                guestTypeId: 'ADULTS',
            },
        };

        Kommunicate.sendMessage(messagePxy);
    },
    processHotelBookClick: function (e) {
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var resultIndex = target.dataset.resultindex;
        var hotelName = target.dataset.name;

        Kommunicate.richMsgEventHandler.handleDisableCTA(e);
        var messagePxy = {
            message: 'Get room detail of ' + hotelName.replace('_', ' '), //message to send
            metadata: {
                hotelSelected: true,
                sessionId: sessionId,
                resultIndex: resultIndex,
                skipDialogflow: true,
            },
        };

        Kommunicate.sendMessage(messagePxy);
    },

    processBookRoomClick: function (e) {
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var RoomIndex = target.dataset.roomindex;
        var NoOfRooms = target.dataset.noofrooms;
        var HotelName = target.dataset.hotelname == 'undefined' ? '' : target.dataset.hotelname;
        var HotelResultIndex = target.dataset.hotelresultindex;
        var messagePxy = {
            message: 'Book ' + HotelName.replace('_', ' '),
            metadata: {
                sessionId: sessionId,
                RoomIndex: RoomIndex,
                NoOfRooms: NoOfRooms,
                blockHotelRoom: true,
                skipDialogflow: true,
                HotelResultIndex: HotelResultIndex,
            },
        };
        kommunicateCommons.setMessagePxyRecipient(messagePxy);
        //console.log('messagePxy........# ', messagePxy)
        $applozic.fn.applozic('sendGroupMessage', messagePxy);
    },

    handleRichButtonClick: function (e) {
        var validationResults = [];
        var validString = '';
        var inputElement = '';
        var target = e.target || e.srcElement;
        var requestType = target.dataset.requesttype;
        var buttonType = target.dataset.buttontype || target.type;
        var form =
            target.parentElement.getElementsByClassName('km-btn-hidden-form')[0] ||
            target.parentElement;
        if (buttonType != 'submit') {
            return;
        }
        var data = {};
        var postBackData = {};
        var isActionableForm = form.className.indexOf('mck-actionable-form') != -1;
        var postBackToKommunicate = isActionableForm
            ? JSON.parse(target.dataset.postBackToKommunicate.toLowerCase())
            : false;
        var postBackAsMessage = isActionableForm
            ? JSON.parse(target.dataset.postBackAsMessage.toLowerCase())
            : false;
        var replyText = target.title || target.innerHTML;
        var formElements = [];
        formElements = Array.prototype.concat.apply(
            formElements,
            form.getElementsByTagName('input')
        );
        formElements = Array.prototype.concat.apply(
            formElements,
            form.getElementsByTagName('select')
        );
        formElements = Array.prototype.concat.apply(
            formElements,
            form.getElementsByTagName('textarea')
        );
        var name = '';
        var type = '';
        var value = '';
        var radioerror = true;
        var index = -1;
        for (var i = 0; i < formElements.length; i++) {
            name = formElements[i].name;
            type = formElements[i].type;
            value = formElements[i].value;
            switch (type) {
                case 'radio':
                    if (formElements[i].checked) {
                        data[name] = value;
                        radioerror = false;
                    }
                    index = i;
                    break;
                case 'checkbox':
                    if (formElements[i].checked) {
                        !data[name] && (data[name] = []);
                        data[name].push(value);
                    }
                    break;
                case 'select-one': //dropdown
                    data[name] = value;
                    if (formElements[i].dataset.errorText) {
                        Kommunicate.richMsgEventHandler.handleFormErrorMessage(
                            form,
                            name,
                            formElements[i].dataset.errorText,
                            !value
                        );
                        validationResults.push(value ? 'success' : 'failed');
                    }
                    break;
                default:
                    data[name] = value;
                    try {
                        if (formElements[i].dataset.regex) {
                            validString = Kommunicate.richMsgEventHandler.isValidString(
                                formElements[i].dataset.regex,
                                value
                            );
                            validationResults.push(validString ? 'success' : 'failed');
                            Kommunicate.richMsgEventHandler.handleFormErrorMessage(
                                form,
                                name,
                                formElements[i].dataset.errorText ||
                                    MCK_LABELS['rich.form'].errorText,
                                !validString
                            );
                        }
                    } catch (e) {
                        console.log(e);
                    }
            }
            if (
                KommunicateConstants.FORM_POST_BACK_MESSAGE_UNSUPPORTED_FIELDS.indexOf(type) == -1
            ) {
                postBackData[name] = data[name];
            }
        }

        if (index != -1 && formElements[index].dataset.errorText) {
            Kommunicate.richMsgEventHandler.handleFormErrorMessage(
                form,
                formElements[index].name,
                formElements[index].dataset.errorText,
                radioerror
            );
            validationResults.push(!radioerror ? 'success' : 'failed');
        }

        if (isActionableForm && validationResults.indexOf('failed') != -1) {
            return;
        }
        if (requestType == 'json') {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // for success response : this.responseText
                }
            };
            xhr.open('POST', form.action);
            xhr.send(JSON.stringify(data));
        } else if (requestType == 'application/json') {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', form.action);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        } else {
            !isActionableForm && form.submit(); // called for submit button
            isActionableForm &&
                KommunicateUtils.isURL(form.action) &&
                $applozic.post(form.action, data).done(function (data) {
                    // console.log("ResponseText:" + data);
                });
        }
        var messagePxy = {};
        var msgMetadata = {};
        var postFormDataAsMessage = '';
        var postBackToBotPlatform = false;
        var formMsgKey = form.getAttribute('data-msg-key');
        if (Kommunicate._globals.hidePostFormSubmit) {
            postBackAsMessage = true;
        }
        if (Kommunicate._globals.disableFormPostSubmit) {
            postBackToBotPlatform = true;
        }
        if (postBackAsMessage && Object.keys(data).length) {
            for (var i = 0; i < Object.keys(data).length; i++) {
                var key = Object.keys(data)[i];
                postFormDataAsMessage = postFormDataAsMessage.concat(
                    key + ' : ' + data[key] + '\n'
                );
            }
        }
        messagePxy.message =
            replyText && postFormDataAsMessage
                ? replyText.concat('\n' + postFormDataAsMessage)
                : replyText; //message to send

        isActionableForm &&
            (requestType == KommunicateConstants.POST_BACK_TO_BOT_PLATFORM ||
                postBackToBotPlatform) &&
            (msgMetadata['KM_CHAT_CONTEXT'] = { formData: data, formMsgKey: formMsgKey });
        var formDataMessageTemplate =
            postBackToKommunicate && Kommunicate.markup.getFormDataMessageTemplate(postBackData);

        Kommunicate.richMsgEventHandler.handleDisableCTA(e);
        formDataMessageTemplate &&
            Kommunicate.sendMessage({
                message: formDataMessageTemplate,
                type: KommunicateConstants.MESSAGE_CONTENT_TYPE.TEXT_HTML,
            });
        Object.keys(msgMetadata).length > 0 && (messagePxy['metadata'] = msgMetadata);
        (Object.keys(msgMetadata).length > 0 || Object.keys(messagePxy).length > 0) &&
            Kommunicate.sendMessage(messagePxy);
    },
    handleFormErrorMessage: function (form, name, errorText, validationFailed) {
        var fieldName = name.toLowerCase().replace(/ +/g, '');
        var container = form.getElementsByClassName('mck-form-' + fieldName + '-error-container');
        if (container.length) {
            validationFailed
                ? container[0].classList.remove('n-vis')
                : container[0].classList.add('n-vis');
        }

        var element = form.getElementsByClassName(
            ('mck-form-error-' + fieldName).replace(/ +/g, '')
        )[0];
        element.innerHTML = validationFailed ? errorText : '';
    },
    handlleSubmitPersonDetail: function (e) {
        var title = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-title-select option:selected')
            .text();
        var age = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.km-age-input');
        var fname = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.first-name-input');
        var mname = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.middle-name-input');
        var lname = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.last-name-input');
        var email = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.e-mail-input');
        var phone = $applozic(e.target)
            .closest('.km-guest-details-container')
            .find('.km-guest-detail-form input.number-input');

        if (
            fname[0].value == '' ||
            lname[0].value == '' ||
            email[0].value == '' ||
            phone[0].value == ''
        ) {
            $applozic(e.target)
                .closest('.km-guest-details-container')
                .find('.km-mandatory-field-error')
                .removeClass('n-vis')
                .addClass('vis');
            return;
        }
        Kommunicate.richMsgEventHandler.handleDisableCTA(e);
        var personDetail = {
            Title: title === 'title' ? '' : title,
            Age: age[0].value,
            FirstName: fname[0].value,
            MiddleName: mname[0].value,
            LastName: lname[0].value,
            EmailId: email[0].value,
            PhoneNo: phone[0].value,
        };
        var target = e.target || e.srcElement;
        var sessionId = target.dataset.sessionid;
        var messagePxy = {
            message:
                personDetail.Title +
                ' ' +
                personDetail.FirstName +
                ' ' +
                personDetail.LastName +
                '\n' +
                personDetail.EmailId +
                '\n' +
                personDetail.PhoneNo,
            metadata: {
                sessionId: sessionId,
                guestDetail: true,
                skipDialogflow: true,
                personInfo: JSON.stringify(personDetail),
            },
        };
        Kommunicate.sendMessage(messagePxy);
        console.log('passenger detail submitted');
    },
    processQuickReplies: function (e) {
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
        var message = e.target.title;
        var metadata = {};
        try {
            metadata = JSON.parse(e.target.dataset.metadata);
        } catch (e) {}
        var languageCode = e.target.dataset.languagecode;
        languageCode && Kommunicate.updateUserLanguage(languageCode);
        var messagePxy = {
            message: message, //message to send
            metadata: metadata,
        };
        Kommunicate.richMsgEventHandler.handleDisableCTA(e);

        document.getElementById('mck-text-box').setAttribute('data-quick-reply', true);
        Kommunicate.sendMessage(messagePxy);
    },
    processClickOnListItem: function (e) {
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var type = target.dataset.type;
        var articleId = target.dataset.articleid;
        var source = target.dataset.source;
        var languageCode = target.dataset.languagecode;
        var metadata = {};

        try {
            metadata = JSON.parse(target.dataset.metadata);
        } catch (e) {
            console.error('Metadata is not parsable' + e);
        }

        metadata.KM_FAQ_ID = articleId;
        metadata.source = source;
        if (type && type == 'quick_reply') {
            languageCode && Kommunicate.updateUserLanguage(languageCode);
            var messagePxy = {
                message: reply, //message to send
                metadata: metadata,
            };
            Kommunicate.richMsgEventHandler.handleDisableCTA(e);
            Kommunicate.sendMessage(messagePxy);
        } else if (type && type == 'submit') {
            //TODO : support for post request with data.
        }
    },
    processClickOnButtonItem: function (e) {
        e.preventDefault();
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var type = target.dataset.type;
        var languageCode = target.dataset.languagecode;
        var metadata = (target.dataset && target.dataset.metadata) || {};
        metadata.KM_BUTTON_CLICKED = true;
        if (type && type == 'quick_reply') {
            languageCode && Kommunicate.updateUserLanguage(languageCode);
            var messagePxy = {
                message: reply, //message to send
                metadata: metadata,
            };

            Kommunicate.richMsgEventHandler.handleDisableCTA(e);
            Kommunicate.sendMessage(messagePxy);
        } else if (type && type == 'submit') {
            //TODO : support for post request with data.
        }
    },
    processClickOnDialogButton: function (e) {
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
        var target = e.currentTarget;
        var reply = target.dataset.reply;
        var metadata = {};
        try {
            metadata = JSON.parse(target.dataset.metadata);
        } catch (e) {}

        // default value for  metadata.skipBot is true for backward compatibility
        metadata.skipBot = typeof metadata.skipBot != 'undefined' ? metadata.skipBot : true;
        var messagePxy = {
            message: reply, //message to send
            metadata: metadata,
        };

        Kommunicate.richMsgEventHandler.handleDisableCTA(e);
        Kommunicate.sendMessage(messagePxy);
    },
    handleLinkButtonClick: function (e) {
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
        var url = decodeURI(e.currentTarget.dataset.url);
        window.open(url, e.currentTarget.dataset.target);
    },
    handleFormSubmit: function (e) {
        e.preventDefault();
        kmWidgetEvents.eventTracking(eventMapping.onRichMessageButtonClick, e.target.innerText);
    },
    isValidString: function (str, value) {
        return new RegExp(str).test(value);
    },
    handleDisableCTA: function ({ target = {} }) {
        // prevent cta double click
        target.disabled = true;
        Kommunicate.richMsgEventHandler.disabledCTAMap.push(target);
    },
    handleEnableCTA: function () {
        Kommunicate.richMsgEventHandler.disabledCTAMap.forEach(
            (ele = {}) => (ele.disabled = false)
        );
        Kommunicate.richMsgEventHandler.disabledCTAMap = [];
    },
};
