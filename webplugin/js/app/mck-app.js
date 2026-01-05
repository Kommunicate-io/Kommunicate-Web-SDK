var $original;
var oModal = '';
var sentryConfig = MCK_THIRD_PARTY_INTEGRATION.sentry;
var MCK_COOKIE_DOMAIN;
if (typeof jQuery !== 'undefined') {
    $original = jQuery.noConflict(true);
    $ = $original;
    jQuery = $original;
    if (typeof $.fn.modal === 'function') {
        oModal = $.fn.modal.noConflict(true);
        $.fn.modal = oModal;
        jQuery.fn.modal = oModal;
    }
}
(function (window) {
    if (typeof Applozic !== 'undefined') {
        throw new Error(
            " Kommunicate script is already loaded, please check if you're loading it more than once."
        );
        return;
    }
})(window);

var applozicSideBox = new ApplozicSidebox();
var scriptCounter = 0;
applozicSideBox.load();
function ApplozicSidebox() {
    var mck_external_scripts = [
        {
            name: 'applozic-min-js',
            url: 'https://cdn.kommunicate.io/applozic/applozic.chat-6.2.9.min.js',
            alternateUrl: MCK_CONTEXTPATH + '/applozic.chat-6.2.9.min.js',
            // if updating applozic.chat{version}.min.js, update the same in pluginOptimizer.js too
        },
        {
            name: 'maps',
            url: 'https://maps.googleapis.com/maps/api/js?libraries=places,marker',
            googleApiKey:
                typeof applozic._globals !== 'undefined' && applozic._globals.googleApiKey
                    ? applozic._globals.googleApiKey
                    : 'AIzaSyCcC8PixPO1yzz35TnjWYIhQvCljTPSU7M',
        },
    ];
    var mck_style_loader = [
        {
            name: 'mck-sidebox',
            url: KOMMUNICATE_MIN_CSS,
        },
    ];
    var mck_third_party_scripts = [
        {
            name: 'emojiLibrary',
            url: MCK_STATICPATH + '/lib/js/mck-emojis.min.js',
        },
    ];
    this.load = function () {
        try {
            if (applozic.PRODUCT_ID == 'kommunicate') {
                if (typeof applozic._globals.locShare === 'undefined') {
                    applozic._globals.locShare = false;
                } else if (typeof applozic._globals.locShare === 'string') {
                    throw new Error('locShare should be a boolean value');
                }
                if (typeof applozic._globals.excludeGoogleMap === 'undefined') {
                    applozic._globals.excludeGoogleMap = !applozic._globals.locShare;
                } else if (typeof applozic._globals.excludeGoogleMap === 'string') {
                    throw new Error('excludeGoogleMap should be a boolean value');
                }
            }
            for (var index in mck_external_scripts) {
                var externalFileDetails = mck_external_scripts[index];
                loadExternalFiles(externalFileDetails);
            }
        } catch (e) {
            console.log('Plugin loading error. Refresh page.', e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            KommunicateUtils.sendErrorToSentry(e);
            return false;
        }
    };

    this.loadResourceAsync = loadResourceAsync;

    function loadExternalFiles(externalFileDetails) {
        try {
            if (applozic._globals.excludeGoogleMap && externalFileDetails.name === 'maps') {
                ++scriptCounter;
                return;
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.type = 'text/javascript';
            externalFileDetails &&
                externalFileDetails.crossOrigin &&
                (script.crossOrigin = externalFileDetails.crossOrigin);
            if (externalFileDetails.name === 'maps') {
                script.src =
                    externalFileDetails.url +
                    '&key=' +
                    externalFileDetails.googleApiKey +
                    '&callback=Function.prototype&loading=async';
            } else {
                script.src = externalFileDetails.url;
            }
            if (script.readyState) {
                // IE
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        ++scriptCounter;
                        scriptCounter >= mck_external_scripts.length && mckinitPlugin();
                    }
                };
            } else {
                // Others
                script.onload = function () {
                    ++scriptCounter;
                    scriptCounter >= mck_external_scripts.length && mckinitPlugin();
                };
            }
            script.onerror = function (error) {
                handleFileLoadError(error);
            };
            head.appendChild(script);
        } catch (error) {
            console.log(error);
        }
    }
    function handleFileLoadError(err) {
        if (err && err.target && err.target.src) {
            var data = mck_external_scripts.filter(function (item) {
                return item.url == err.target.src;
            })[0];
            if (data) {
                data.url = data.alternateUrl;
                loadExternalFiles(data);
            }
        }
    }
    function mckinitPlugin() {
        if (!$original && typeof jQuery !== 'undefined') {
            $original = jQuery.noConflict(true);
            $ = $original;
            jQuery = $original;
            if (typeof $.fn.modal === 'function') {
                oModal = $.fn.modal.noConflict(true);
                $.fn.modal = oModal;
                jQuery.fn.modal = oModal;
            }
        }
        try {
            for (var index in mck_style_loader) {
                mck_style_loader[index] && mckLoadStyle(mck_style_loader[index].url);
            }
            var url = MCK_SIDEBOX_HTML;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var body = document.getElementsByTagName('body')[0];
                    body.insertAdjacentHTML('beforeend', this.responseText);
                    var scriptContent = addScriptInsideHtml();
                    var kmScript =
                        window.parent && window.parent.document.getElementById('km-widget-script');
                    if (kmScript && kmScript.nonce) {
                        scriptContent.nonce = kmScript.nonce;
                    }
                    body.appendChild(scriptContent);
                    mckInitPluginScript();
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        } catch (e) {
            console.log('Plugin loading error. Refresh page.', e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            return false;
        }
    }
    function addScriptInsideHtml() {
        var scriptData = function detectBrowserAndMakeUiVisible() {
            function showAfterLoad() {
                var mckSidebox = document.getElementById('mck-sidebox');
                mckSidebox.style.visibility = 'visible';
                var mckLocBox = document.getElementById('mck-loc-box');
                mckLocBox.style.visibility = 'visible';
                var mckGmSearchBox = document.getElementById('mck-gm-search-box');
                mckGmSearchBox.style.visibility = 'visible';
            }
            if (
                navigator.userAgent.indexOf('MSIE') !== -1 ||
                navigator.appVersion.indexOf('Trident/') > 0
            ) {
                showAfterLoad();
            } else {
                var isScriptV2 = !!parent.document.getElementById('kommunicate-widget-iframe');
                if (isScriptV2) {
                    window.parent.document.addEventListener(
                        'kmInitilized',
                        function () {
                            showAfterLoad();
                        },
                        false
                    );
                } else {
                    window.addEventListener(
                        'kmInitilized',
                        function () {
                            showAfterLoad();
                        },
                        false
                    );
                }
            }
        };

        var script = String(scriptData) + 'detectBrowserAndMakeUiVisible();';
        var tag = document.createElement('script');
        tag.innerHTML = script;
        return tag;
    }
    function mckLoadStyle(url) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = url;
        head.appendChild(style);
    }
    // Below function adds the script to document
    function mckLoadScript(url, callback, removeCrossOrigin) {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.crossOrigin = 'anonymous';
            removeCrossOrigin && script.removeAttribute('crossOrigin');
            if (callback) {
                if (script.readyState) {
                    // IE
                    script.onreadystatechange = function () {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {
                    // Others
                    script.onload = function () {
                        callback();
                    };
                }
            }
            body.appendChild(script);
        } catch (e) {
            console.log('Plugin loading error. Refresh page.');
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            return false;
        }
    }
    function mckInitPluginScript() {
        try {
            var options = applozic._globals;
            MCK_COOKIE_DOMAIN = KommunicateUtils.findCookieDomain(document.domain);
            for (var index in mck_third_party_scripts) {
                var data = mck_third_party_scripts[index];
                if (data.name === 'emojiLibrary') {
                    options.emojilibrary && mckLoadScript(data.url, null, true);
                } else {
                    mckLoadScript(data.url);
                }
            }
            mckLoadAppScript();
        } catch (e) {
            console.log('Plugin loading error. Refresh page.');
            console.log(e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            return false;
        }
    }

    function loadResourceAsync(src) {
        return new Promise((resolve, reject) => {
            let element;

            if (src.endsWith('.js')) {
                element = document.createElement('script');
                element.src = src;
                element.type = 'text/javascript';
            } else if (src.endsWith('.css')) {
                element = document.createElement('link');
                element.href = src;
                element.type = 'text/css';
                element.rel = 'stylesheet';
            } else {
                reject(new Error('Unsupported resource type'));
                return;
            }

            element.onload = () => resolve();
            element.onerror = () => reject(new Error(`Resource load error for ${src}`));

            document.head.appendChild(element);
        });
    }

    function applyLayoutClass(layout) {
        if (typeof document === 'undefined' || !layout) {
            return;
        }
        var className = 'layout-' + String(layout).toLowerCase();
        var targets = [document.documentElement, document.body].filter(Boolean);
        targets.forEach(function (node) {
            if (!node.classList) {
                return;
            }
            Array.prototype.slice
                .call(node.classList)
                .filter(function (cls) {
                    return cls.indexOf('layout-') === 0;
                })
                .forEach(function (cls) {
                    node.classList.remove(cls);
                });
            node.classList.add(className);
        });
    }

    async function loadFileBasedOnProp(apiData, options) {
        try {
            const promises = [];

            if (options.zendeskChatSdkKey) {
                promises.push(loadResourceAsync(THIRD_PARTY_SCRIPTS.zendesk.js));
            }

            if (
                Array.isArray(options.preLeadCollection) ||
                (apiData.collectLead && apiData.leadCollection)
            ) {
                const leadCollection = options.preLeadCollection || apiData.leadCollection;

                const shouldLoadIntl = leadCollection?.some((obj) => obj.enableCountryCode);

                if (shouldLoadIntl) {
                    Object.values(THIRD_PARTY_SCRIPTS.intlForPreChat).forEach(async (file) => {
                        promises.push(loadResourceAsync(file));
                    });
                }
            }

            if (options.voiceNote) {
                promises.push(loadResourceAsync(THIRD_PARTY_SCRIPTS.voiceNote.js));
            }

            if (options.voiceChat) {
                promises.push(loadResourceAsync(THIRD_PARTY_SCRIPTS.voiceChat.js));
            }

            await Promise.all(promises);
        } catch (err) {
            console.error(err);
        }
    }

    function mckLoadAppScript() {
        // var cookiePrefix = KommunicateUtils.getCookiePrefix();
        // var mapCookies = [{
        //     oldName: 'kommunicate-id',
        //     newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
        //     skipPrefix: true
        // }, {
        //     oldName: "userName",
        //     newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
        //     skipPrefix: true
        // }, {
        //     oldName: "km_id",
        //     newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
        //     skipPrefix: true
        // }, {
        //     oldName: "km_user_name",
        //     newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
        //     skipPrefix: true
        // }, {
        //     oldName: "km_lead_collection",
        //     newName: cookiePrefix + KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,
        //     skipPrefix: true
        // },{
        //     oldName: "_kom_km_id",
        //     //skip newName to delete the cookie
        //     skipPrefix: true
        // },{
        //     oldName: "_kom_km_lead_collection",
        //     skipPrefix: true
        // },{
        //     oldName: "_kom_km_user_name",
        //     skipPrefix: true
        // }];
        var userId = KommunicateUtils.getRandomId();
        try {
            getApplicationSettings(userId);
        } catch (e) {
            console.log('Plugin loading error. Refresh page.');
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            return false;
        }
    }

    async function mckInitSidebox(data, randomUserId) {
        try {
            appOptionSession.setAppInstanceCount();

            var options = applozic._globals;
            if (options.labels && options.labels['lead.collection']?.heading) {
                options['headingFromWidget'] = true;
            }
            var widgetSettingsFromApi = data.chatWidget || {};
            var localWidgetSettings =
                options.widgetSettings && typeof options.widgetSettings === 'object'
                    ? options.widgetSettings
                    : {};
            var widgetSettings = $applozic.extend(
                true,
                {},
                widgetSettingsFromApi,
                localWidgetSettings
            );
            var disableChatWidget =
                options.disableChatWidget != null
                    ? options.disableChatWidget
                    : widgetSettings.disableChatWidget; // Give priority to appOptions over API data.

            var allowedDomains = widgetSettings.allowedDomains;
            var hostname = parent.window.location.hostname.toLowerCase();

            // check if the current hostname is equal to or a subdomain
            // e.g. www.google.com is a subdomain of google.com
            var isSubDomain = function (domain) {
                return (
                    hostname == domain ||
                    (hostname.length > domain.length &&
                        hostname.substr(hostname.length - domain.length - 1) == '.' + domain)
                );
            };
            function isSettingEnable(key) {
                return options[key] != null ? options[key] : widgetSettings && widgetSettings[key];
            }
            // replace cookies in old format with cookies in new format
            KommunicateUtils.replaceOldCookies();

            //to check if the customer has been churned then show the churn banner
            if (data.currentActivatedPlan == 'churn') {
                var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
                var utmSourceUrl = kommunicateIframe
                    ? kommunicateIframe.getAttribute('data-url') || parent.window.location.href
                    : w.location.href;
                var poweredByUrl =
                    'https://www.kommunicate.io/poweredby?utm_source=' +
                    utmSourceUrl +
                    '&utm_medium=webplugin&utm_campaign=deactivation';
                var linkForChurn = document.getElementById('deactivate-link');
                var churnCust = document.getElementById('km-churn-customer');
                if (churnCust) {
                    linkForChurn && linkForChurn.setAttribute('href', poweredByUrl);
                    churnCust.classList.remove('n-vis');
                }
            }

            // Remove scripts if chatwidget is restricted by domains
            var isCurrentDomainDisabled =
                Array.isArray(allowedDomains) &&
                allowedDomains.length &&
                !allowedDomains.some(isSubDomain);
            // exclude kommunicate.io from restricted domains for
            // the chatbot preview feature
            var isCurrentDomainKommunicate = KommunicateConstants.KOMMUNICATE_DOMAINS.some(
                isSubDomain
            );
            // Remove scripts if disableChatWidget property is enabled
            // or domain restrictions are enabled
            if ((disableChatWidget || isCurrentDomainDisabled) && !isCurrentDomainKommunicate) {
                parent.window && parent.window.removeKommunicateScripts();
                return false;
            }

            (navigator.userAgent.indexOf('MSIE') !== -1 ||
                navigator.appVersion.indexOf('Trident/') > 0) &&
                (sentryConfig.enabled = false);
            sentryConfig.enabled && loadErrorTracking(randomUserId, data);

            var sessionTimeout =
                options.sessionTimeout != null
                    ? options.sessionTimeout
                    : widgetSettings && widgetSettings.sessionTimeout;
            options['appSettings'] = $applozic.extend(true, data, options.appSettings);

            options['agentId'] = options.appSettings.agentId;
            options['agentName'] = options.appSettings.agentName;
            options['widgetSettings'] = widgetSettings;
            options['customerCreatedAt'] = options.appSettings.customerCreatedAt;
            options['collectFeedback'] = options.appSettings.collectFeedback;
            options['isCsatAvailable'] = options.appSettings.isCsatAvailable;
            options['chatPopupMessage'] = options.appSettings.chatPopupMessage;
            options.appSettings = options.appSettings || {};
            options.appSettings.chatWidget = options.appSettings.chatWidget || widgetSettings || {};
            var layoutFromSettings =
                options.layout ||
                options?.appSettings?.layout ||
                options?.appSettings?.chatWidget?.layout;
            var resolvedLayout;
            if (layoutFromSettings) {
                resolvedLayout = layoutFromSettings;
            } else if (
                (options.KM_VER === 'v2' && options.__KM_PLUGIN_VERSION === 'v3') ||
                options.KM_VER === 'v3' ||
                options.__KM_PLUGIN_VERSION === 'v3'
            ) {
                resolvedLayout = KommunicateConstants.DESIGN_LAYOUTS.MODERN;
            } else {
                resolvedLayout = KommunicateConstants.DESIGN_LAYOUTS.DEFAULT || 'classic';
            }
            options.layout = resolvedLayout;
            options.appSettings.layout = resolvedLayout;
            options.appSettings.chatWidget.layout = resolvedLayout;
            if (widgetSettings) {
                widgetSettings.layout = resolvedLayout;
            }
            applyLayoutClass(resolvedLayout);

            var pseudoNameEnabled =
                widgetSettings && typeof widgetSettings.pseudonymsEnabled !== 'undefined'
                    ? widgetSettings.pseudonymsEnabled
                    : KM_PLUGIN_SETTINGS.pseudoNameEnabled;
            options.metadata = typeof options.metadata == 'object' ? options.metadata : {};
            options.conversationMetadata =
                typeof options.defaultConversationMetadata == 'object'
                    ? options.defaultConversationMetadata
                    : {};
            options.fileUpload =
                options.fileUpload || (widgetSettings && widgetSettings.fileUpload);
            [
                'connectSocketOnWidgetClick',
                'voiceInput',
                'voiceOutput',
                'attachment',
                'hidePostCTA',
            ].forEach(function (key) {
                if (options[key] == null) {
                    options[key] = widgetSettings && widgetSettings[key];
                }
            });
            options.zendeskChatSdkKey =
                options.zendeskChatSdkKey != null
                    ? options.zendeskChatSdkKey
                    : widgetSettings && widgetSettings.zendeskChatSdkKey;
            options.capturePhoto =
                options.capturePhoto != null
                    ? options.capturePhoto
                    : widgetSettings && widgetSettings.capturePhoto;
            options.captureVideo =
                options.captureVideo != null
                    ? options.captureVideo
                    : widgetSettings && widgetSettings.captureVideo;
            options.hidePostFormSubmit =
                options.hidePostFormSubmit != null
                    ? options.hidePostFormSubmit
                    : widgetSettings && widgetSettings.hidePostFormSubmit;
            options.disableFormPostSubmit =
                options.disableFormPostSubmit ||
                (widgetSettings && widgetSettings.disableFormPostSubmit);
            options.timeFormat24Hours =
                options.timeFormat24Hours != null
                    ? options.timeFormat24Hours
                    : widgetSettings && widgetSettings.timeFormat24Hours;
            options.voiceNote =
                options.voiceNote != null
                    ? options.voiceNote
                    : widgetSettings && widgetSettings.voiceNote;
            options.attachmentHandler =
                options.attachmentHandler != null
                    ? options.attachmentHandler
                    : function (file) {
                          return file;
                      };
            options.defaultUploadOverride = widgetSettings && widgetSettings.defaultUploadOverride;

            options.maxAttachmentSize =
                options.maxAttachmentSize != null
                    ? options.maxAttachmentSize
                    : widgetSettings && widgetSettings.maxAttachmentSize;
            options.maxAttachmentSizeErrorMsg =
                options.maxAttachmentSizeErrorMsg != null
                    ? options.maxAttachmentSizeErrorMsg
                    : widgetSettings && widgetSettings.maxAttachmentSizeErrorMsg;

            options.checkboxAsMultipleButton =
                options.checkboxAsMultipleButton ||
                (widgetSettings && widgetSettings.checkboxAsMultipleButton);

            // staticTopMessage and staticTopIcon keys are used in mobile SDKs therefore using same.
            options.staticTopMessage =
                options.staticTopMessage != null
                    ? options.staticTopMessage
                    : widgetSettings && widgetSettings.staticTopMessage;
            options.staticTopIcon =
                options.staticTopIcon != null
                    ? options.staticTopIcon
                    : widgetSettings && widgetSettings.staticTopIcon;
            options.preCreateUser = widgetSettings && widgetSettings.preCreateUser;

            options.primaryCTA = isSettingEnable('primaryCTA');
            options.talkToHuman = isSettingEnable('talkToHuman');
            options.showMsgFromStart = isSettingEnable('showMsgFromStart');
            options.rtl = isSettingEnable('rtl');
            options.googleApiKey =
                isSettingEnable('googleApiKey') ?? 'AIzaSyCcC8PixPO1yzz35TnjWYIhQvCljTPSU7M';

            options.anonymousUserIdForPreChatLead = isSettingEnable(
                'anonymousUserIdForPreChatLead'
            );

            options.voiceChat = isSettingEnable('voiceChat') || KommunicateUtils.isAgenticFirst();
            options.voiceChatApiKey = options.voiceChatApiKey || data.voiceChatApiKey;
            options.storageSuffix =
                typeof options.storageSuffix == 'string' ? options.storageSuffix : '';
            appOptionSession.deletePropertyDataFromSession('settings');
            options.loadChatByDays = isSettingEnable('loadChatByDays');

            if (sessionTimeout != null && !(options.preLeadCollection || options.askUserDetails)) {
                logoutAfterSessionExpiry(sessionTimeout);
                var details = kmLocalStorage.getItemFromLocalStorage(applozic._globals.appId) || {};
                !details.sessionStartTime && (details.sessionStartTime = new Date().getTime());
                details.sessionTimeout = sessionTimeout;
                kmLocalStorage.setItemToLocalStorage(applozic._globals.appId, details);
            }

            if (applozic.PRODUCT_ID == 'kommunicate') {
                var accessTokenFromCookie = kmCookieStorage.getCookie(
                    KommunicateConstants.COOKIES.ACCESS_TOKEN
                );
                var userIdFromCookie = kmCookieStorage.getCookie(
                    KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID
                );
                var displayNameFromCookie = kmCookieStorage.getCookie(
                    KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME
                );
                var isAnonymousUser = !options.userId;
                options['userId'] = !isAnonymousUser
                    ? options.userId
                    : userIdFromCookie || randomUserId;
                var displayName = isAnonymousUser
                    ? pseudoNameEnabled
                        ? displayNameFromCookie || data.userName
                        : ''
                    : options.userName;
                displayName && (options['userName'] = displayName);

                if (isAnonymousUser && pseudoNameEnabled) {
                    options.metadata['KM_PSEUDO_USER'] = JSON.stringify({
                        pseudoName: 'true',
                        hidden: 'true',
                    });
                }
                if (isAnonymousUser && accessTokenFromCookie) {
                    options.accessToken = window.atob(accessTokenFromCookie);
                }
                //save user cookies
                saveUserCookies(options);
            }
            await loadFileBasedOnProp(data, options);
            if (typeof options !== 'undefined') {
                options.ojq = $original;
                options.obsm = oModal;
                $applozic.fn.applozic(options);
            }
            if (options.rtl === false) {
                const iframeDocument = window.document;
                iframeDocument.body.setAttribute('dir', 'ltr');
            }
            preLoadLauncherIcon(widgetSettings);
        } catch (e) {
            console.error('Plugin loading error. Refresh page.', e);
            KommunicateUtils.sendErrorToSentry(e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT('error');
            }
            return false;
        }
    }

    function preLoadLauncherIcon(chatWidget) {
        if (chatWidget && chatWidget.widgetImageLink) {
            var img = new Image();
            img.onload = function () {
                preLoadLauncherIconInterval();
            };
            img.src = chatWidget.widgetImageLink;
        } else {
            // This condition is to check if there is no custom launcher icon image.
            preLoadLauncherIconInterval();
        }
    }

    function preLoadLauncherIconInterval() {
        var launcherInterval = setInterval(function () {
            if (document.getElementById('mck-sidebox-launcher')) {
                document.getElementById('mck-sidebox-launcher').classList.remove('n-vis');
                document
                    .getElementById('mck-sidebox-launcher')
                    .classList.add('km-launcher-animation');
                clearInterval(launcherInterval);
            }
        }, 100);
    }

    // function seekReplaceDestroyCookies (mapCookies){
    //    var  hostName = parent.window.location.hostname;
    //     mapCookies && mapCookies.forEach(function(arrayItem){
    //         if (KommunicateUtils.getCookie(arrayItem.oldName,arrayItem.skipPrefix)) {
    //             var value = KommunicateUtils.getCookie(arrayItem.oldName, arrayItem.skipPrefix);
    //             if(arrayItem.newName){
    //                 KommunicateUtils.setCookie({"name":arrayItem.newName,"value": value, "expiresInDays":30, domain: KommunicateUtils.getDomainFromUrl(),skipPrefix:arrayItem.skipPrefix});
    //             }
    //             KommunicateUtils.deleteCookie({name: arrayItem.oldName, skipPrefix: arrayItem.skipPrefix, domain: KommunicateUtils.getDomainFromUrl()});
    //             // deleting for old version where domain is set as hostname
    //             KommunicateUtils.deleteCookie({name: arrayItem.oldName, skipPrefix: arrayItem.skipPrefix, domain: hostName});
    //         }
    //     })
    // };

    function getApplicationSettings(userId) {
        var data = {};
        applozic._globals.appId && (data.appId = applozic._globals.appId);
        applozic._globals.widgetPlatformUrl &&
            (data.widgetPlatformUrl = applozic._globals.widgetPlatformUrl);
        // NOTE: Don't pass applozic._globals as it is in data field of ajax call, pass only the fields which are required for this API call.
        if (
            !data.widgetPlatformUrl &&
            (!data.appId || data.appId === 'APP_ID' || data.appId === '')
        ) {
            console.error(
                "Please replace 'APP_ID' with your App ID in the Kommunicate plugin settings."
            );
            return;
        }

        var url =
            KM_PLUGIN_SETTINGS.kommunicateApiUrl +
            '/users/v3/chat/plugin/settings' +
            KommunicateUtils.formatParams(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var responseData = JSON.parse(this.responseText);
                // if only the url of the shop was provided then set the appId
                if (!data.appId && data.widgetPlatformUrl && responseData.response) {
                    applozic._globals.appId = responseData.response.applicationId;
                }
                mckInitSidebox(responseData.response, userId); // This function will initialize the Sidebox code.
            }
        };
        xhr.open('GET', url, true);
        xhr.send(data);
    }
    function loadErrorTracking(userId, options) {
        if (!window.Sentry) {
            return;
        }

        var kommunicateIframe = parent.document.getElementById('kommunicate-widget-iframe');
        var url = kommunicateIframe
            ? kommunicateIframe.getAttribute('data-url')
            : parent.window.location.href;
        userId =
            options.userId ||
            kmCookieStorage.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID);

        try {
            const sentryGlobalScope = Sentry.getGlobalScope();

            sentryGlobalScope.setTags({
                url: url,
                userId: userId,
                plan: options.currentActivatedPlan,
            });

            sentryGlobalScope.setUser({
                id: applozic._globals.appId || 'NA',
                username: userId,
            });
        } catch (error) {
            console.error('Error in initializing sentry', error);
            // KommunicateUtils.sendErrorToSentry(error);
        }
    }
    function saveUserCookies(kommunicateSettings) {
        kmCookieStorage.setCookie({
            name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
            value: kommunicateSettings.userId,
            expiresInDays: 30,
            domain: MCK_COOKIE_DOMAIN,
        });
        kmCookieStorage.setCookie({
            name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
            value: kommunicateSettings.userName || '',
            expiresInDays: 30,
            domain: MCK_COOKIE_DOMAIN,
        });
        if (
            !(
                kommunicateSettings.preLeadCollection ||
                kommunicateSettings.appSettings.collectLead ||
                kommunicateSettings.askUserDetails
            )
        ) {
            kmCookieStorage.setCookie({
                name: KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,
                value: false,
                expiresInDays: 30,
                domain: MCK_COOKIE_DOMAIN,
            });
        }
        if (kommunicateSettings.accessToken) {
            var encodedToken = window.btoa(kommunicateSettings.accessToken);
            kmCookieStorage.setCookie({
                name: KommunicateConstants.COOKIES.ACCESS_TOKEN,
                value: encodedToken || '',
                expiresInDays: 30,
                domain: MCK_COOKIE_DOMAIN,
            });
        }
    }

    function logoutAfterSessionExpiry(sessionTimeout) {
        var widgetSettings, timeStampDifference;
        applozic._globals.appId &&
            (widgetSettings = kmLocalStorage.getItemFromLocalStorage(applozic._globals.appId));
        var endTime = widgetSettings && widgetSettings.sessionEndTime;
        var startTime = widgetSettings && widgetSettings.sessionStartTime;
        var timeStampDifference = endTime - startTime;

        // // timeStampDiff is NaN when endTime is not set
        // // this happens when the user opens the widget for the first time
        if (Number.isNaN(timeStampDifference)) {
            timeStampDifference = 0;
        }

        if (widgetSettings && sessionTimeout != null && timeStampDifference >= sessionTimeout) {
            kmCookieStorage.deleteUserCookiesOnLogout();
            appOptionSession.deleteSessionData();
            kmLocalStorage.removeItemFromLocalStorage(applozic._globals.appId);
            ALStorage.clearSessionStorageElements();
            kmLocalStorage.removeItemFromLocalStorage('mckActiveConversationInfo');
        }
        // TODO: Handle case where internet disconnects and sessionEndTime is not updated.
        window.addEventListener('beforeunload', function (event) {
            // Cancel the event as stated by the standard.
            var details = kmLocalStorage.getItemFromLocalStorage(applozic._globals.appId) || {};
            details.sessionEndTime = new Date().getTime();
            kmLocalStorage.setItemToLocalStorage(applozic._globals.appId, details);
            appOptionSession.removeAppInstanceCount(true);
        });
    }
}
