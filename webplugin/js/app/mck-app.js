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
            url: MCK_STATICPATH + '/js/app/applozic.chat-6.1.min.js',
        },
        {
            name: 'maps',
            url: 'https://maps.google.com/maps/api/js?libraries=places',
            googleApiKey:
                typeof applozic._globals !== 'undefined' &&
                applozic._globals.googleApiKey
                    ? applozic._globals.googleApiKey
                    : 'AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI',
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
            name: 'locationPicker',
            url: MCK_STATICPATH + '/lib/js/locationpicker.jquery.min.js',
        },
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
                    applozic._globals.excludeGoogleMap = !applozic._globals
                        .locShare;
                } else if (
                    typeof applozic._globals.excludeGoogleMap === 'string'
                ) {
                    throw new Error(
                        'excludeGoogleMap should be a boolean value'
                    );
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
            return false;
        }
    };
    function loadExternalFiles(externalFileDetails) {
        try {
            if (
                applozic._globals.excludeGoogleMap &&
                externalFileDetails.name === 'maps'
            ) {
                ++scriptCounter;
                return;
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.async = false;
            script.type = 'text/javascript';
            externalFileDetails &&
                externalFileDetails.crossOrigin &&
                (script.crossOrigin = externalFileDetails.crossOrigin);
            if (externalFileDetails.name === 'maps') {
                script.src =
                    externalFileDetails.url +
                    '&key=' +
                    externalFileDetails.googleApiKey;
            } else {
                script.src = externalFileDetails.url;
            }
            if (script.readyState) {
                // IE
                script.onreadystatechange = function () {
                    if (
                        script.readyState === 'loaded' ||
                        script.readyState === 'complete'
                    ) {
                        script.onreadystatechange = null;
                        ++scriptCounter;
                        scriptCounter >= mck_external_scripts.length &&
                            mckinitPlugin();
                    }
                };
            } else {
                // Others
                script.onload = function () {
                    ++scriptCounter;
                    scriptCounter >= mck_external_scripts.length &&
                        mckinitPlugin();
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
                mck_style_loader[index] &&
                    mckLoadStyle(mck_style_loader[index].url);
            }
            var url = MCK_SIDEBOX_HTML;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var body = document.getElementsByTagName('body')[0];
                    body.insertAdjacentHTML('beforeend', this.responseText);
                    var scriptContent = addScriptInsideHtml();
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
                var mckGmSearchBox = document.getElementById(
                    'mck-gm-search-box'
                );
                mckGmSearchBox.style.visibility = 'visible';
            }
            if (
                navigator.userAgent.indexOf('MSIE') !== -1 ||
                navigator.appVersion.indexOf('Trident/') > 0
            ) {
                showAfterLoad();
            } else {
                var isScriptV2 = !!parent.document.getElementById(
                    'kommunicate-widget-iframe'
                );
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
                        if (
                            script.readyState === 'loaded' ||
                            script.readyState === 'complete'
                        ) {
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
            MCK_COOKIE_DOMAIN = KommunicateUtils.findCookieDomain(
                document.domain
            );
            for (var index in mck_third_party_scripts) {
                var data = mck_third_party_scripts[index];
                if (data.name === 'locationPicker') {
                    options.locShare && mckLoadScript(data.url);
                } else if (data.name === 'emojiLibrary') {
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
    function mckInitSidebox(data, randomUserId) {
        try {
            var options = applozic._globals;
            var widgetSettings = data.chatWidget;
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
                        hostname.substr(hostname.length - domain.length - 1) ==
                        '.' + domain)
                );
            };

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
            if (
                (disableChatWidget || isCurrentDomainDisabled) &&
                !isCurrentDomainKommunicate
            ) {
                parent.window && parent.window.removeKommunicateScripts();
                return false;
            }

            (navigator.userAgent.indexOf('MSIE') !== -1 ||
                navigator.appVersion.indexOf('Trident/') > 0) &&
                (sentryConfig.enabled = false);
            sentryConfig.enabled && loadErrorTracking(randomUserId);

            var sessionTimeout = options.sessionTimeout;
            sessionTimeout == null &&
                (sessionTimeout =
                    widgetSettings && widgetSettings.sessionTimeout);
            options['appSettings'] = $applozic.extend(
                true,
                data,
                options.appSettings
            );

            options['agentId'] = options.appSettings.agentId;
            options['agentName'] = options.appSettings.agentName;
            options['widgetSettings'] = widgetSettings;
            options['customerCreatedAt'] =
                options.appSettings.customerCreatedAt;
            options['collectFeedback'] = options.appSettings.collectFeedback;
            options['chatPopupMessage'] = options.appSettings.chatPopupMessage;

            var pseudoNameEnabled =
                widgetSettings &&
                    typeof widgetSettings.pseudonymsEnabled !== 'undefined'
                    ? widgetSettings.pseudonymsEnabled
                    : KM_PLUGIN_SETTINGS.pseudoNameEnabled;
            options.metadata =
                typeof options.metadata == 'object' ? options.metadata : {};
            options.fileUpload =
                options.fileUpload ||
                (widgetSettings && widgetSettings.fileUpload);
            options.connectSocketOnWidgetClick =
                options.connectSocketOnWidgetClick != null
                    ? options.connectSocketOnWidgetClick
                    : widgetSettings &&
                    widgetSettings.connectSocketOnWidgetClick;
            options.voiceInput =
                options.voiceInput != null
                    ? options.voiceInput
                    : widgetSettings && widgetSettings.voiceInput;
            options.voiceOutput =
                options.voiceOutput != null
                    ? options.voiceOutput
                    : widgetSettings && widgetSettings.voiceOutput;
            options.attachment =
                options.attachment != null
                    ? options.attachment
                    : widgetSettings && widgetSettings.attachment;
            options.hidePostCTA =
                options.hidePostCTA != null
                    ? options.hidePostCTA
                    : widgetSettings && widgetSettings.hidePostCTA;
            options.capturePhoto =
                options.capturePhoto != null
                    ? options.capturePhoto
                    : widgetSettings && widgetSettings.capturePhoto;
            KommunicateUtils.deleteDataFromKmSession('settings');

            if (
                sessionTimeout != null &&
                !(options.preLeadCollection || options.askUserDetails)
            ) {
                logoutAfterSessionExpiry(sessionTimeout);
                var details =
                    KommunicateUtils.getItemFromLocalStorage(
                        applozic._globals.appId
                    ) || {};
                !details.sessionStartTime &&
                    (details.sessionStartTime = new Date().getTime());
                details.sessionTimeout = sessionTimeout;
                KommunicateUtils.setItemToLocalStorage(
                    applozic._globals.appId,
                    details
                );
            }

            if (applozic.PRODUCT_ID == 'kommunicate') {
                var accessTokenFromCookie = KommunicateUtils.getCookie(
                    KommunicateConstants.COOKIES.ACCESS_TOKEN
                );
                var userIdFromCookie = KommunicateUtils.getCookie(
                    KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID
                );
                var displayNameFromCookie = KommunicateUtils.getCookie(
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
            if (typeof options !== 'undefined') {
                options.ojq = $original;
                options.obsm = oModal;
                $applozic.fn.applozic(options);
            }
            preLoadLauncherIcon(widgetSettings);
        } catch (e) {
            console.log(e);
            console.log('Plugin loading error. Refresh page.', e);
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
                document
                    .getElementById('mck-sidebox-launcher')
                    .classList.remove('n-vis');
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
        applozic._globals.widgetPlatformUrl && (data.widgetPlatformUrl = applozic._globals.widgetPlatformUrl);
        // NOTE: Don't pass applozic._globals as it is in data field of ajax call, pass only the fields which are required for this API call.
        var url =
            KM_PLUGIN_SETTINGS.kommunicateApiUrl +
            '/users/v2/chat/plugin/settings' + KommunicateUtils.formatParams(data);
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
    function loadErrorTracking(userId) {
        var kommunicateIframe = parent.document.getElementById(
            'kommunicate-widget-iframe'
        );
        var url = kommunicateIframe
            ? kommunicateIframe.getAttribute('data-url')
            : parent.window.location.href;
        userId =
            KommunicateUtils.getCookie(
                KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID
            ) || userId;
        try {
            Sentry.init({
                dsn: sentryConfig.dsn,
                release: KommunicateConstants.KM_WIDGET_RELEASE_VERSION,
            });
            Sentry.configureScope(function (scope) {
                scope.setTag('applicationId', applozic._globals.appId);
                scope.setTag('userId', userId);
                scope.setTag('url', url);
                scope.setUser({
                    id: applozic._globals.appId,
                });
            });
        } catch (error) {
            console.log("Error in initializing sentry", error);
        }
    }
    function saveUserCookies(kommunicateSettings) {
        KommunicateUtils.setCookie({
            name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
            value: kommunicateSettings.userId,
            expiresInDays: 30,
            domain: MCK_COOKIE_DOMAIN,
        });
        KommunicateUtils.setCookie({
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
            KommunicateUtils.setCookie({
                name:
                    KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,
                value: false,
                expiresInDays: 30,
                domain: MCK_COOKIE_DOMAIN,
            });
        }
        if (kommunicateSettings.accessToken) {
            var encodedToken = window.btoa(kommunicateSettings.accessToken);
            KommunicateUtils.setCookie({
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
            (widgetSettings = KommunicateUtils.getItemFromLocalStorage(
                applozic._globals.appId
            ));
        var timeStampDifference =
            widgetSettings &&
            widgetSettings.sessionEndTime - widgetSettings.sessionStartTime;
        if (
            widgetSettings &&
            sessionTimeout != null &&
            timeStampDifference > sessionTimeout
        ) {
            KommunicateUtils.deleteUserCookiesOnLogout();
            sessionStorage.removeItem('kommunicate');
            KommunicateUtils.removeItemFromLocalStorage(
                applozic._globals.appId
            );
            ALStorage.clearSessionStorageElements();
            KommunicateUtils.removeItemFromLocalStorage(
                'mckActiveConversationInfo'
            );
        }
        // TODO: Handle case where internet disconnects and sessionEndTime is not updated.
        window.addEventListener('beforeunload', function (event) {
            // Cancel the event as stated by the standard.
            var details =
                KommunicateUtils.getItemFromLocalStorage(
                    applozic._globals.appId
                ) || {};
            details.sessionEndTime = new Date().getTime();
            KommunicateUtils.setItemToLocalStorage(
                applozic._globals.appId,
                details
            );
        });
    }
}
