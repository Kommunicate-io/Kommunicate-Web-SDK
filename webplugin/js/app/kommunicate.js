/**
 * all methods exposed to  users.
 */

function activateConversationTabOnStartConversation() {
    if (typeof document === 'undefined') {
        return;
    }
    var conversationTabOptions = {
        skipFaqTrigger: true,
        skipConversationListView: true,
        skipEmptyStateToggle: true,
    };
    var bottomTabsManager =
        typeof getBottomTabsManager === 'function' ? getBottomTabsManager() : null;
    if (bottomTabsManager && typeof bottomTabsManager.handleChange === 'function') {
        bottomTabsManager.handleChange('conversations', conversationTabOptions);
    } else if (bottomTabsManager && typeof bottomTabsManager.setActiveTab === 'function') {
        bottomTabsManager.setActiveTab('conversations');
        bottomTabsManager.setActiveSubsection &&
            bottomTabsManager.setActiveSubsection('conversation-individual');
    } else {
        var sideboxContent = document.getElementById('mck-sidebox-content');
        if (sideboxContent && sideboxContent.classList) {
            sideboxContent.classList.remove('active-tab-no-conversations');
            sideboxContent.classList.add(
                'active-tab-conversations',
                'active-subsection-conversation-individual'
            );
        }
        typeof setActiveSubsectionState === 'function' &&
            setActiveSubsectionState('conversation-individual');
    }
    if (typeof KommunicateUI !== 'undefined') {
        KommunicateUI.toggleConversationsEmptyState &&
            KommunicateUI.toggleConversationsEmptyState(false);
        KommunicateUI.hideFaq && KommunicateUI.hideFaq();
        KommunicateUI.setHasConversationHistory && KommunicateUI.setHasConversationHistory(true);
        KommunicateUI.showChat && KommunicateUI.showChat({ keepConversationHeader: true });
    }
}

// above code will expose below function from iframe window to browser window.
var KOMMUNICATE_VERSION = window.kommunicate.version;
KOMMUNICATE_VERSION === 'v2' && (parent.Kommunicate = window.Kommunicate);

$applozic.extend(true, Kommunicate, {
    getBaseUrl: function () {
        return KM_PLUGIN_SETTINGS.kommunicateApiUrl;
    },
    setDefaultAgent: function (agentName) {
        //kommunicate.defaultAgent  = agentName;
        throw new Error('not implemented');
    },
    getConversationOfParticipent: function (options, callback) {
        if (typeof callback !== 'function') {
            throw new Error(
                'invalid callback! expected: Kommunicate.startNewConversation(options, callback) '
            );
        }
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + '/conversations/participent/' + options.userId,
            type: 'get',
            success: function (result) {
                callback(null, result);
            },
            error: function (err) {
                callback(err);
            },
        });
    },
    startConversation: function (params, callback) {
        kommunicateCommons.setWidgetStateOpen(true);
        activateConversationTabOnStartConversation();
        params = typeof params == 'object' ? params : {};
        kmWidgetEvents.eventTracking(eventMapping.onStartNewConversation);
        params = Kommunicate.updateConversationDetail(params);
        if (!params.agentId && !params.agentIds && !params.teamId) {
            var appOptions =
                appOptionSession.getPropertyDataFromSession('appOptions') || applozic._globals;
            params.agentId = appOptions.agentId;
        }
        var user = [];
        if (params.agentIds && Array.isArray(params.agentIds)) {
            for (var i = 0; i < params.agentIds.length; i++) {
                user.push({ userId: params.agentIds[i], groupRole: 1 });
            }
        } else {
            user.push({ userId: params.agentIds, groupRole: 1 });
        }

        if (params.botIds && Array.isArray(params.botIds)) {
            for (var i = 0; i < params.botIds.length; i++) {
                user.push({ userId: params.botIds[i], groupRole: 2 });
            }
        } else {
            user.push({ userId: params.botIds, groupRole: 2 });
        }

        var groupName =
            params.defaultGroupName ||
            params.conversationTitle ||
            params.groupName ||
            kommunicate._globals.conversationTitle ||
            kommunicate._globals.groupName ||
            kommunicate._globals.agentId;
        var assignee = params.defaultAssignee || params.assignee || params.agentId;

        var groupMetadata = {};
        params.defaultGroupName && (groupMetadata.KM_ORIGINAL_TITLE = true);
        typeof params.metadata == 'object' &&
            typeof params.metadata['KM_CHAT_CONTEXT'] == 'object' &&
            (groupMetadata.KM_CHAT_CONTEXT = params.metadata['KM_CHAT_CONTEXT']);

        params.WELCOME_MESSAGE && (groupMetadata.WELCOME_MESSAGE = params.WELCOME_MESSAGE);
        params.conversationMetadata &&
            typeof params.conversationMetadata == 'object' &&
            (groupMetadata = params.conversationMetadata);

        var conversationDetail = {
            groupName: groupName || 'Conversations',
            type: 10,
            agentId: params.agentId || '',
            assignee: assignee,
            users: user,
            clientGroupId: params.clientGroupId,
            isMessage: params.isMessage,
            isInternal: params.isInternal,
            skipRouting: params.skipRouting,
            skipBotEvent: params.skipBotEvent,
            customWelcomeEvent: params.customWelcomeEvent,
            metadata: groupMetadata,
            teamId: params.teamId,
        };
        if (IS_SOCKET_CONNECTED) {
            Kommunicate.client.createConversation(conversationDetail, callback);
        } else {
            var SET_INTERVAL_DURATION = 500;
            var SET_TIMEOUT_DURATION = 3500;
            var interval = setInterval(function () {
                // socket connected check
                if (IS_SOCKET_CONNECTED) {
                    Kommunicate.client.createConversation(conversationDetail, callback);
                    clearInterval(interval);
                    timeout && clearTimeout(timeout);
                }
            }, SET_INTERVAL_DURATION);
            var timeout = setTimeout(function () {
                conversationDetail.allowMessagesViaSocket = true;
                Kommunicate.client.createConversation(conversationDetail, callback);
                clearInterval(interval);
            }, SET_TIMEOUT_DURATION);
        }
    },

    updateConversationMetadata: function (conversationMetadata) {
        if (conversationMetadata) {
            if (
                Object.prototype.toString.call(conversationMetadata) == '[object Object]' &&
                Object.prototype.toString.call(conversationMetadata.metadata) ==
                    '[object Object]' &&
                conversationMetadata.groupId &&
                conversationMetadata.metadata
            ) {
                var metadataToSend = conversationMetadata.metadata;
                const groupDataResponse = Applozic.ALApiService.groupUpdate({
                    data: {
                        groupId: conversationMetadata.groupId,
                        metadata: {
                            conversationMetadata: JSON.stringify(metadataToSend),
                        },
                    },
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
                return groupDataResponse;
            } else {
                throw new TypeError('updateConversationMetadata expects an object as an argument');
            }
        } else {
            throw new Error('updateConversationMetadata expect an object but got null');
        }
    },
    updateDefaultConversationMetadata: function (options = {}) {
        if (typeof options !== 'object' || options === null || Array.isArray(options)) {
            throw new TypeError(
                'updateDefaultConversationMetadata expects an object as an argument'
            );
        }

        try {
            // Sanitize and parse the object
            const sanitizedString = window.DOMPurify.sanitize(JSON.stringify(options));
            options = JSON.parse(sanitizedString);

            if (kommunicate._globals.defaultConversationMetadata) {
                kommunicate._globals.defaultConversationMetadata = options;
            }
        } catch (error) {
            console.error(
                'An error occurred while sanitizing or updating the conversation metadata:',
                error
            );
        }
    },
    updateConversationDetail: function (conversationDetail) {
        var settings = appOptionSession.getPropertyDataFromSession('settings') || {};
        if (!Object.keys(settings).length) {
            return conversationDetail;
        }
        return {
            ...conversationDetail,
            WELCOME_MESSAGE: conversationDetail.WELCOME_MESSAGE ?? settings.WELCOME_MESSAGE,
            defaultAssignee:
                conversationDetail.defaultAssignee ??
                conversationDetail.assignee ??
                settings.defaultAssignee,
            agentIds: conversationDetail.agentIds ?? settings.defaultAgentIds,
            botIds: conversationDetail.botIds ?? settings.defaultBotIds,
            skipRouting: conversationDetail.skipRouting ?? settings.skipRouting,
            skipBotEvent: conversationDetail.skipBotEvent ?? settings.skipBotEvent,
            customWelcomeEvent:
                conversationDetail.customWelcomeEvent ?? settings.customWelcomeEvent,
            teamId: conversationDetail.teamId ?? settings.teamId,
        };
    },
    openConversationList: function () {
        kommunicateCommons.setWidgetStateOpen(true);
        activateConversationTabOnStartConversation();
        window.$applozic.fn.applozic('loadTab', '');
        KommunicateUI.showChat();
        KommunicateUI.hideFaq();
    },
    openConversation: function (groupId, groupDetail) {
        kommunicateCommons.setWidgetStateOpen(true);
        activateConversationTabOnStartConversation();
        if (groupId) {
            window.$applozic.fn.applozic('loadGroupTab', groupId);
        } else if (groupDetail && groupDetail.clientGroupId) {
            window.$applozic.fn.applozic('loadGroupTabByClientGroupId', groupDetail);
        }
        KommunicateUI.showChat();
        KommunicateUI.hideFaq();
    },
    openDirectConversation: function (userId) {
        kommunicateCommons.setWidgetStateOpen(true);
        activateConversationTabOnStartConversation();
        window.$applozic.fn.applozic('loadTab', userId);
        KommunicateUI.showChat();
        KommunicateUI.hideFaq();
    },
    reloadWidget: function () {
        ALStorage.clearAppHeaders();
        window.$applozic.fn.applozic('reInitialize', {
            userId: kommunicate._globals.userId,
            appId: kommunicate._globals.appId,
            password: kommunicate._globals.password || '',
        });
    },
    /**
     * load conversation will open or create a conversation between existing users.
     * it generate clientGroupId from the given conversationDetail, if any group exists with that Id opens that otherwise it will call creatge group API.
     * it will not open the group created by createConversation API.
     * @param {Object}  conversationDetail
     * @param {Array} conversationDetail.agentIds required parameter
     * @param {Array} conversationDetail.botIds  optional parameter
     */
    loadConversation: function (conversationDetail, callback) {
        var agentList = (conversationDetail.agentIds || []).sort(function (a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });
        console.log('agent list ', agentList);
        var botList = conversationDetail.botIds || [];

        if (agentList.length < 1) {
            var error = {
                code: 'INVALID_PARAMETERS',
                message: 'required parameter agentIds is missing.',
            };
            return typeof callback == 'function'
                ? callback(error)
                : console.log('required parameter agentIds is missing.');
        }
        // max length of clientGroupId is 256 in db.
        // default bot is not included in client groupId generation
        var loggedInUserName =
            kommunicate._globals.userId ||
            kmCookieStorage.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID);
        var agentsNameStr = agentList.join('_');

        var botsNameStr = botList.join('_');
        var clientGroupId = encodeURIComponent(
            botsNameStr
                ? [agentsNameStr, loggedInUserName, botsNameStr].join('_')
                : [agentsNameStr, loggedInUserName].join('_')
        );
        if (clientGroupId.length > 256) {
            var error = {
                code: 'MEMBER_LIMIT_EXCEEDS',
                message: 'try adding fewer members',
            };

            return typeof callback == 'function'
                ? callback(error)
                : console.log('member limit exceeds. try adding fewer members');
        }
        mckGroupService.getGroupFeed({
            clientGroupId: clientGroupId,
            apzCallback: function (result) {
                if (result.status == 'error' && result.code == 'AL-G-01') {
                    // group not found. createing new group
                    var users = agentList.map(function (item) {
                        return { userId: item, groupRole: 1 };
                    });
                    users.push({ userId: 'bot', groupRole: 2 });
                    users.push(
                        botList.map(function (item) {
                            return { userId: item, groupRole: 2 };
                        })
                    );
                    var conversationDetail = {
                        groupName:
                            kommunicate._globals.conversationTitle ||
                            kommunicate._globals.groupName ||
                            kommunicate._globals.agentId,
                        type: 10,
                        agentId: users[0].userId,
                        users: users,
                        clientGroupId: decodeURIComponent(clientGroupId),
                    };
                    Kommunicate.client.createConversation(conversationDetail, function (result) {
                        if (callback) {
                            return callback(null, result);
                        }
                    });
                } else if (result.status == 'success') {
                    // group exist with clientGroupId
                    var groupId = result.data.id;
                    $applozic.fn.applozic('loadGroupTab', groupId);
                    return callback(null, result);
                }
            },
        });
    },
    createGroupName: function (group) {
        return group.sort().join().replace(/,/g, '_').substring(0, 250);
    },
    openLastConversation: function (params) {
        var conversationDetail = params;
        var user = [];
        var group = [];
        group.push(params.agentId);
        group.push(kommunicate._globals.userId);
        user.push({ userId: params.agentId, groupRole: 1 });
        user.push({ userId: 'bot', groupRole: 2 });
        if (params.botIds) {
            console.log(params.botIds);
            for (var i = 0; i < params.botIds.length; i++) {
                user.push({ userId: params.botIds[i], groupRole: 2 });
                group.push(params.botIds[i]);
            }
        }
        var groupName = Kommunicate.createGroupName(group);
        var groupDetail = {};
        groupDetail.groupName = groupName;
        groupDetail.callback = function (response) {
            if (response.data.groups.length > 0) {
                console.log('already have a group');
                Kommunicate.openConversation(response.data.groups[0].id);
            } else {
                console.log('new user');
                Kommunicate.startConversation(conversationDetail, function (response) {});
            }
        };
        window.$applozic.fn.applozic('getGroupListByFilter', groupDetail);
    },
    /**
     * creating conversation entry in kommuncate db.
     */
    createNewConversation: function (options, callback) {
        if (typeof callback !== 'function') {
            throw new Error(
                'invalid callback! expected: Kommunicate.startNewConversation(options, callback) '
            );
        }
        var data = {
            groupId: options.groupId,
            participantUserId: options.participantUserId,
            createdBy: options.participantUserId,
            defaultAgentId: options.defaultAgentId,
            applicationId: options.applicationId,
        };
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + '/conversations',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                console.log('conversation started successfully');
                callback(null, result);
            },
            error: function (err) {
                console.log('err while starting Conversation');
                callback(err);
            },
        });
    },
    logout: function () {
        if (
            typeof window.$applozic !== 'undefined' &&
            typeof window.$applozic.fn !== 'undefined' &&
            typeof window.$applozic.fn.applozic !== 'undefined'
        ) {
            window.$applozic.fn.applozic('logout');
        }
        kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
        kmCookieStorage.deleteUserCookiesOnLogout();
        appOptionSession.removeAppInstanceCount();
        window.Sentry && window.Sentry.close();
        parent.window && parent.window.removeKommunicateScripts();
    },
    launchConversation: function () {
        activateConversationTabOnStartConversation();
        window.$applozic.fn.applozic('mckLaunchSideboxChat');
    },
    triggerEvent: function (event, options) {
        $applozic.ajax({
            url: Kommunicate.getBaseUrl() + '/applications/events?type=' + event,
            type: 'post',
            data: JSON.stringify({
                conversationId: options.groupId,
                applicationId: options.applicationId,
            }),
            contentType: 'application/json',
            success: function (result) {
                console.log('conversation triggering event');
            },
            error: function (err) {
                console.log('err while starting Conversation');
            },
        });
    },
    updateUser: function (options) {
        var data = { data: options };
        window.$applozic.fn.applozic('updateUser', data);
    },
    getAwayMessage: function (options, callback) {
        $applozic.ajax({
            url:
                Kommunicate.getBaseUrl() +
                '/applications/' +
                options.applicationId +
                '/awaymessage?conversationId=' +
                options.conversationId +
                '&languageCode=' +
                options.languageCode,
            type: 'get',
            contentType: 'application/json',
            success: function (result) {
                // console.log("got away message data");
                typeof callback == 'function' ? callback(null, result) : '';
            },
            error: function (err) {
                console.log('err while fetching away message');
                typeof callback == 'function' ? callback(err) : '';
            },
        });
    },
    updateUserIdentity: function (newUserId) {
        window.$applozic.fn.applozic('updateUserIdentity', {
            newUserId: newUserId,
            callback: function (response) {
                kmCookieStorage.setCookie({
                    name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
                    value: newUserId,
                    expiresInDays: 30,
                    domain: MCK_COOKIE_DOMAIN,
                });
                if (response == 'success') {
                    window.$applozic.fn.applozic('reInitialize', {
                        userId: newUserId,
                    });
                }
            },
        });
    },
    isRichTextMessage: function (metadata) {
        // contentType should be 300 for rich text message in metadata
        // contentType 300 is removed from rich message payload since Jan-2020 and old payload this may getting used.
        return metadata && (metadata.hasOwnProperty('templateId') || metadata.contentType == 300);
    },
    appendEmailToIframe: function (message) {
        var richText = Kommunicate.isRichTextMessage(message.metadata) || message.contentType == 3;
        if (richText && message.source === 7 && message.message) {
            var iframeID = 'km-iframe-' + message.groupId;
            var iframe = document.getElementById(iframeID);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(message.message);
            doc.close();
            var anchors = doc.getElementsByTagName('a');
            for (var i = 0; i < anchors.length; i++) {
                anchors[i].setAttribute('target', '_blank');
            }
        }
    },
    isAttachment: function (msg) {
        return (
            (typeof msg.fileMeta === 'object' &&
                msg.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ATTACHMENT) ||
            msg.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.AUDIO ||
            msg.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.LOCATION
        );
    },
    getContainerTypeForRichMessage: function (message) {
        // this method is obsolete, not in use. use km-div-slider to get slide effect
        var metadata = message.metadata;
        var sliderClass = 'km-slick-container ';
        metadata.templateId == KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL &&
            metadata.payload &&
            metadata.payload.length > 1 &&
            (sliderClass += 'km-slider-multiple-cards-container');
        if (metadata.templateId) {
            switch (metadata.templateId) {
                // add template Id to enable slick effect
                // 2 for get room pax info template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.HOTEL_BOOKING_CARD:
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_DETAIL:
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
                    return sliderClass;
                    break;
                case '6':
                    return 'km-border-less-container km-cta-multi-button-container';
                    break;

                default:
                    return 'km-fixed-container';
                    break;
            }
        } else if (
            message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.TEXT_HTML &&
            message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR
        ) {
            return 'km-fixed-container';
        }
    },
    sendMessage: function (messagePxy) {
        kommunicateCommons.setMessagePxyRecipient(messagePxy);
        $applozic.fn.applozic('sendGroupMessage', messagePxy);
    },
    getRichTextMessageTemplate: function (message) {
        var metadata = message.metadata;
        if (metadata.templateId) {
            switch (metadata.templateId) {
                // 1 for get room pax info template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_COUNT:
                    return Kommunicate.markup.getHotelRoomPaxInfoTemplate();
                    break;
                //2 for hotel card template
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.HOTEL_BOOKING_CARD:
                    return Kommunicate.markup.getHotelCardContainerTemplate(
                        JSON.parse(metadata.hotelList || '[]'),
                        metadata.sessionId
                    );
                    break;
                // 3 for button container
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.LINK_BUTTON:
                    return Kommunicate.markup.buttonContainerTemplate(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.PASSENGER_DETAIL:
                    return Kommunicate.markup.getPassangerDetail(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.ROOM_DETAIL:
                    return Kommunicate.markup.getRoomDetailsContainerTemplate(
                        JSON.parse(metadata.hotelRoomDetail || '[]'),
                        metadata.sessionId
                    );
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY:
                    return Kommunicate.markup.quickRepliesContainerTemplate(
                        metadata,
                        KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.QUICK_REPLY
                    );
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.LIST:
                    return Kommunicate.markup.getListContainerMarkup(metadata);
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.DIALOG_BOX:
                    return Kommunicate.markup.getDialogboxContainer(metadata);
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.IMAGE:
                    return Kommunicate.markup.getImageContainer(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.CARD_CAROUSEL:
                    return Kommunicate.markup.getCarouselMarkup(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.GENERIC_BUTTONS:
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.GENERIC_BUTTONS_V2:
                    return Kommunicate.markup.getGenericButtonMarkup(metadata);
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.FORM:
                    metadata['msgKey'] = message.key;
                    return Kommunicate.markup.getActionableFormMarkup(metadata);
                    break;
                case KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.VIDEO:
                    return Kommunicate.markup.getVideoMarkup(metadata);
                    break;
                default:
                    return '';
                    break;
            }
        } else if (
            (message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.TEXT_HTML &&
                message.source == KommunicateConstants.MESSAGE_SOURCE.MAIL_INTERCEPTOR) ||
            message.contentType == KommunicateConstants.MESSAGE_CONTENT_TYPE.ELECTRONIC_MAIL
        ) {
            return Kommunicate.markup.getHtmlMessageMarkups(message);
        } else {
            return '';
        }
    },
    /*
       updateSettings parameters 
       1. defaultAssignee [single value]
       2. defaultAgentIds [multiple values]
       3. defaultBotIds [multiple values]
       4. skipRouting [boolean]
       5. skipBotEvent [multiple values]
       6. KM_CHAT_CONTEXT
       7. WELCOME_MESSAGE
       8. customWelcomeEvent [single value]
   */
    updateSettings: function (options) {
        var type = typeof options;
        if (type != 'object') {
            throw new error('update settings expects an object, found ' + type);
        }
        var settings = appOptionSession.getPropertyDataFromSession('settings');
        settings = settings ? settings : {};

        for (var key in options) {
            settings[key] = options[key];
        }
        appOptionSession.setSessionData('settings', settings);
    },
    getSettings: function (setting) {
        return KommunicateUtils.getSettings(setting);
    },
    updateChatContext: function (options) {
        if (typeof options == 'object') {
            var chatContext =
                KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
            for (var key in options) {
                chatContext[key] = options[key];
            }
            Kommunicate.updateSettings({ KM_CHAT_CONTEXT: chatContext });
        } else {
            console.info(
                "can not update chat context, expected data type is 'object', found ",
                typeof chatContext
            );
        }
    },
    updateUserLanguage: function (languageCode) {
        var chatContext =
            KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
        chatContext[KommunicateConstants.SETTINGS.KM_USER_LANGUAGE_CODE] = languageCode;
        Kommunicate.updateChatContext(chatContext);
    },
    setDefaultIframeConfigForOpenChat: function (isPopupEnabled) {
        !kommunicateCommons.checkIfDeviceIsHandheld() &&
            kommunicateCommons.modifyClassList({ id: ['mck-sidebox'] }, 'popup-enabled', '');
        var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
        var kommunicateIframeDocument = kommunicateIframe.contentDocument;
        var popUpCloseButton = kommunicateIframeDocument.getElementById('km-popup-close-button');
        kommunicateIframe.style.width = '';
        kommunicateIframe.classList.remove('km-iframe-notification');
        kommunicateIframe.classList.remove('km-iframe-closed');
        isPopupEnabled
            ? (kommunicateIframe.classList.add('km-iframe-dimension-with-popup'),
              popUpCloseButton && (popUpCloseButton.style.display = 'flex'))
            : kommunicateIframe.classList.add('km-iframe-dimension-no-popup');
        kommunicateIframe.classList.add('kommunicate-iframe-enable-media-query');
        kommunicateCommons.adjustIframeHeightForLayout(kommunicateIframe);
    },
    setDefaultIframeConfigForClosedChat: function () {
        var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
        if (kommunicateIframe) {
            //kommunicateIframe.style.height = '';
            kommunicateIframe.classList.add('km-iframe-closed');
            kommunicateIframe.classList.remove('kommunicate-iframe-enable-media-query');
            kommunicateIframe.classList.remove('km-iframe-dimension-with-popup');
            kommunicateIframe.classList.remove('km-iframe-dimension-no-popup');
        }
        var popUpCloseButton = parent.document.querySelector('#km-popup-close-button');
        popUpCloseButton && (popUpCloseButton.style.display = 'none');
    },
    // add css to style component in window
    customizeWidgetCss: function (classSettings) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = classSettings;
        document.getElementsByTagName('head')[0].appendChild(style);
    },
    // subscribe to custom events
    subscribeToEvents: function (events) {
        $applozic.fn.applozic('subscribeToEvents', events);
    },
    /**
     * @param {String} timezone
     */
    updateUserTimezone: function (timezone) {
        if (KommunicateUtils.isValidTimeZone(timezone)) {
            var chatContext =
                KommunicateUtils.getSettings(KommunicateConstants.SETTINGS.KM_CHAT_CONTEXT) || {};
            chatContext[KommunicateConstants.SETTINGS.KM_USER_TIMEZONE] = timezone;
            Kommunicate.updateChatContext(chatContext);
        }
    },
    /**
     * @param {Boolean} display
     */
    displayKommunicateWidget: function (display) {
        var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
        display
            ? kommunicateIframe.classList.remove('kommunicate-hide-custom-iframe')
            : kommunicateIframe.classList.add('kommunicate-hide-custom-iframe');
    },
    // check if the message needs to be processed by addMessage
    visibleMessage: function (msg, msgThroughListAPI) {
        if (!msg) return false;
        if (
            !msg.message &&
            (msg.metadata.hasOwnProperty('KM_ASSIGN_TO') ||
                msg.metadata.hasOwnProperty('KM_ASSIGN_TEAM'))
        ) {
            // KM_ASSIGN_TO and KM_ASSIGN_TEAM parameter comes when we change assignee by bot message.
            return false;
        }
        if (
            msg.type === KommunicateConstants.MESSAGE_TYPE.CALL_INCOMING ||
            msg.type === KommunicateConstants.MESSAGE_TYPE.CALL_OUTGOING
        ) {
            return false;
        }
        if (
            (msg.metadata && msg.metadata.category === 'HIDDEN') ||
            msg.contentType === KommunicateConstants.MESSAGE_CONTENT_TYPE.AUDIO_VIDEO_CALL
        ) {
            return false;
        }
        if (
            msg.metadata &&
            msg.metadata.KM_STATUS
            // (msg.metadata.KM_ASSIGN || msg.metadata.KM_STATUS)
        ) {
            return false;
        }
        if (
            msg.contentType === KommunicateConstants.MESSAGE_CONTENT_TYPE.NOTIFY_MESSAGE &&
            msg.metadata &&
            (msg.metadata.hasOwnProperty('KM_TRIGGER_EVENT') || msg.metadata.hide === 'true')
        ) {
            return false;
        }

        // genai last message
        if (!msgThroughListAPI) {
            // Enable the msg area when we got the last token
            if (msg.metadata?.lastToken === 'true' || !msg.tokenMessage) {
                genAiService.resetState();
                genAiService.enableTextArea(true);
            }
            if (
                msg.metadata?.lastToken === 'true' ||
                msg.metadata?.firstToken === 'true' ||
                (msg.metadata?.hasOwnProperty('PLATFORM_MESSAGE_ID') && !msg.message)
            ) {
                return false;
            }
        }

        return true;
    },
    isMessageClubbing: function (className) {
        var CLUBBING_CLASSES = ['km-clubbing-first', 'km-clubbing-last'];
        return CLUBBING_CLASSES.some(function (clName) {
            return className.classList.contains(clName);
        });
    },
    hideMessage: function (element) {
        //all cta expect link button will hide if hidePostCta is enable
        if (!element || !element[0]) return;
        var quickReplyCtaPrevSibling = element[0];

        //return if CLUBBING_CLASSES classes are not present
        var isClubbing = this.isMessageClubbing(quickReplyCtaPrevSibling);
        if (!isClubbing) return;

        //if cta button and last message is in same container in UI
        var isCtaMultiContainerExist = quickReplyCtaPrevSibling.querySelector(
            '.mck-msg-box-rich-text-container.km-cta-multi-button-container'
        );

        if (isCtaMultiContainerExist) {
            quickReplyCtaPrevSibling.style.display = 'block';
            isCtaMultiContainerExist.classList.remove('vis');
            isCtaMultiContainerExist.classList.add('n-vis');
            return;
        }

        while (quickReplyCtaPrevSibling?.classList.contains('contains-quick-replies-only')) {
            quickReplyCtaPrevSibling = quickReplyCtaPrevSibling.previousElementSibling;
        }
        if (quickReplyCtaPrevSibling) {
            var isFirstGroupMessage = quickReplyCtaPrevSibling.previousElementSibling;
            quickReplyCtaPrevSibling.classList.remove('km-clubbing-first');
            isFirstGroupMessage && quickReplyCtaPrevSibling.classList.add('km-clubbing-last');
        }
    },
    getAllSiblings: function (element) {
        var siblings = [];
        if (!element || !element.parentNode) {
            return siblings;
        }
        var sibling = element.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== element) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
        }
        return siblings;
    },
    openWidgetPreview: function () {
        var isPreChatForm = document.getElementById('km-anonymous-chat-launcher');

        isPreChatForm ? isPreChatForm.click() : Kommunicate.launchConversation();
    },
    closeWidgetPreview: function () {
        var closeBtn = document.getElementById('km-popup-close-button');
        closeBtn && closeBtn.click();
    },
    hideMessageCTA: function (processAllMsg) {
        var allMessages = $applozic('#mck-message-cell .mck-message-inner div[name="message"]');
        var lastMessage = allMessages.length - 1;

        for (var i = lastMessage; i >= 0; i--) {
            var currentMsg = allMessages[i];

            if (!processAllMsg && currentMsg.classList.contains('mck-msg-right')) {
                break;
            }

            if (
                processAllMsg &&
                currentMsg.dataset.msgkey == allMessages[lastMessage].dataset.msgkey
            ) {
                // console.log("don't process the hide post cta last msg");
            } else if (
                currentMsg.querySelector('.km-cta-multi-button-container') // checking if button container is exist in the message div
            ) {
                var allCTAButtons = currentMsg.querySelectorAll('.km-quick-replies');

                allCTAButtons.forEach(function (cta) {
                    cta.setAttribute('data-hidden', true);
                });

                allCTAButtons.length &&
                    currentMsg.classList.contains('contains-quick-replies-only') &&
                    currentMsg.classList.add('km-hide-message');
            } else if (
                // ONLY FOR LIST RICH MESSAGE
                currentMsg.querySelector('.km-faq-list--footer_button-container')
            ) {
                var allCTAButtons = currentMsg.querySelectorAll('[data-hidepostcta="true"]');
                allCTAButtons.length &&
                    allCTAButtons.forEach(function (cta) {
                        cta.setAttribute('data-hidden', true);
                    });
            }
        }
    },
    getCurrentPosition: () =>
        new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)),
    getUserLocation: async function () {
        try {
            const api_key = kommunicate._globals.googleApiKey;
            const position = await this.getCurrentPosition();
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true&key=${api_key}`
            );
            const result = await response.json();

            return result?.results.length
                ? result.results[0].formatted_address
                : 'LOCATION_NOT_FOUND';
        } catch (error) {
            console.debug('Error while fetching location', error);
            return 'PERMISSION_DENIED';
        }
    },
    getTimeToLoadChatByDays: function () {
        // Validate input parameter

        const days = kommunicate._globals.loadChatByDays;
        if (days === undefined || days === null) {
            throw new Error('Days parameter is required');
        }

        // Convert string to number if needed
        let numericDays;
        if (typeof days === 'string') {
            numericDays = parseInt(days, 10);
        } else if (typeof days === 'number') {
            numericDays = days;
        } else {
            throw new Error(
                'Days parameter must be a number or string that can be converted to a number'
            );
        }

        // Validate that conversion was successful
        if (isNaN(numericDays)) {
            throw new Error('Invalid days value: cannot convert to a valid number');
        }

        // Validate that it's a positive integer
        if (!Number.isInteger(numericDays) || numericDays <= 0) {
            throw new Error('Days must be a positive integer');
        }

        // Optional: Set reasonable upper limit (e.g., 365 days = 1 year)
        if (numericDays > 365) {
            throw new Error('Days cannot exceed 365');
        }

        // Set endTime to today at 23:59:00
        const today = new Date();
        today.setHours(23, 59, 0, 0); // Set to 23:59:00.000
        const endTime = today.getTime();

        // Calculate startTime by going back the specified number of days
        const daysInMilliseconds = numericDays * 24 * 60 * 60 * 1000;
        const startTime = endTime - daysInMilliseconds;

        return { startTime, endTime };
    },
});
