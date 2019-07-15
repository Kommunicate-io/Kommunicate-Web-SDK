var $original;
var oModal = "";
var sentryConfig = MCK_THIRD_PARTY_INTEGRATION.sentry.plugin;
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
    if (typeof Applozic !== "undefined"){
      throw new Error(" Kommunicate script is already loaded, please check if you're loading it more than once.");
      return;
    }
})(window);

var applozicSideBox = new ApplozicSidebox();
var scriptCounter = 0;
applozicSideBox.load();
function ApplozicSidebox() {
	var googleApiKey = (typeof applozic._globals !== 'undefined' && applozic._globals.googleApiKey)?(applozic._globals.googleApiKey):"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI";
    var mck_external_scripts = [
        {
            "name": "jquery",
            "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js",
            "crossOrigin": "anonymous"
        },
        {
            "name": "applozic-min-js",
            "url": "https://cdn.applozic.com/applozic/applozic.chat-5.6.min.js", // update the url with every new release of applozic-web-plugin
            "alternateUrl": MCK_STATICPATH + "/js/app/applozic.chat-5.6.min.js"
        }
    ];
    var mck_style_loader = [
    {
            "name": "mck-sidebox", 
            "url": KOMMUNICATE_PLUGIN_REQUIREMENTS_CSS
    } ];
    var mck_script_loader1 = [
    {
            "name": "km-utils", 
            "url": KOMMUNICATE_PLUGIN_REQUIREMENTS_MIN_JS
    },
    {
            "name": "maps",
            "url": "https://maps.google.com/maps/api/js?key="+googleApiKey+"&libraries=places"
    }];
    var mck_script_loader2 = [ {
            "name": "locationpicker", "url": MCK_STATICPATH + "/lib/js/locationpicker.jquery.min.js"
    } ];
    this.load = function() {
        try {
            for (var index in mck_external_scripts) {
                var externalFileDetails = mck_external_scripts[index];
                loadExternalFiles(externalFileDetails);
            }  
        } catch (e) {
            console.log("Plugin loading error. Refresh page.", e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function loadExternalFiles(externalFileDetails) {
        try {   
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            externalFileDetails && externalFileDetails.crossOrigin && (script.crossOrigin = externalFileDetails.crossOrigin);
            script.src = externalFileDetails.url;
            if (script.readyState) { // IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        ++scriptCounter;
                        scriptCounter >= mck_external_scripts.length && mckinitPlugin();
                    }
                };
            } else { // Others
                script.onload = function () {
                    ++scriptCounter;
                    scriptCounter >= mck_external_scripts.length && mckinitPlugin();
                };
            }
            script.onerror = function (error) {
                handleFileLoadError(error);
            }
            head.appendChild(script);
            
        } catch (error) {
            console.log(error);
        }

    };
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
    };
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
                    body.innerHTML = this.responseText;
                    var scriptContent = addScriptInsideHtml();
                    body.appendChild(scriptContent);
                    mckInitPluginScript();
                }
            };
            xhr.open("GET", url, true);
            xhr.send(null);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.", e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function addScriptInsideHtml() {
        var scriptData = function detectBrowserAndMakeUiVisible() {
            function showAfterLoad() {
                var mckSidebox = document.getElementById("mck-sidebox");
                mckSidebox.style.visibility = 'visible';
                var mckLocBox = document.getElementById("mck-loc-box");
                mckLocBox.style.visibility = 'visible';
                var mckGmSearchBox = document.getElementById("mck-gm-search-box");
                mckGmSearchBox.style.visibility = 'visible';
            };
            if (navigator.userAgent.indexOf('MSIE') !== -1 ||
                navigator.appVersion.indexOf('Trident/') > 0) {
                showAfterLoad();
            } else {
                var isScriptV2 = !!parent.document.getElementById('kommunicate-widget-iframe');
                if (isScriptV2) {
                    window.parent.document.addEventListener('kmInitilized', function () {
                        showAfterLoad();
                    }, false);
                } else {
                    window.addEventListener('kmInitilized', function () {
                        showAfterLoad();
                    }, false);
                }
            };
        };

        var script = String(scriptData) + "detectBrowserAndMakeUiVisible();"
        var tag = document.createElement('script');
        tag.innerHTML = script;
        return tag;
    };
    function mckLoadStyle(url) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = "stylesheet";
        style.href = url;
        head.appendChild(style);
    };
    function mckLoadScript(url, callback, removeCrossOrigin) {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.crossOrigin = "anonymous";
            removeCrossOrigin && script.removeAttribute("crossOrigin");
            if (callback) {
                if (script.readyState) { // IE
                    script.onreadystatechange = function() {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { // Others
                    script.onload = function() {
                        callback();
                    };
                }
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function mckInitPluginScript() {
        try {
            if(applozic.PRODUCT_ID =='kommunicate'){
                if (typeof applozic._globals.locShare === 'undefined') {
                    applozic._globals.locShare = false;
                } else if (typeof applozic._globals.locShare === 'string') {
                    throw new Error("locShare should be a boolean value");
                }
                if (typeof applozic._globals.excludeGoogleMap === 'undefined') {
                    applozic._globals.excludeGoogleMap = applozic._globals.locShare ? false : true;
                } else if(typeof applozic._globals.excludeGoogleMap === 'string') {
                    throw new Error("excludeGoogleMap should be a boolean value");
                }
                    applozic._globals.googleApiKey= (applozic._globals.googleApiKey)?applozic._globals.googleApiKey :"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI";
       	    }
            for (var index in mck_script_loader1) {
                var data = mck_script_loader1[index];
                if (data.name === "km-utils") {
                    try {
                       var options = applozic._globals;
                        if (typeof options !== 'undefined' && options.locShare === true) {
                            mckLoadScript(data.url, mckLoadScript2);
                        } else {
                            mckLoadScript(data.url, mckLoadAppScript);
                        }
                    } catch (e) {
                        mckLoadScript(data.url, mckLoadAppScript);
                    }
                }
                 else if (data.name === "maps") {
                    try {
                        var options = applozic._globals;
                        if (typeof options !== 'undefined') {
                            if (options.excludeGoogleMap) {
                                return true;
                            }
                            if (options.googleApiKey) {
                                var url = data.url + "&key=" + options.googleApiKey;
                                mckLoadScript(url, null, true);
                            }
                        } else {
                            mckLoadScript(data.url, null, true);
                        }
                    } catch (e) {
                        mckLoadScript(data.url), null, true;
                    }
                }  
                else {
                    mckLoadScript(data.url);    
                }
            };
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            console.log(e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function mckLoadScript2() {
        try {
            for (var index in mck_script_loader2) {
                var data = mck_script_loader1[index];
                if (data.name === "locationpicker") {
                    mckLoadScript(data.url, mckLoadAppScript);
                }
            };
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function mckLoadAppScript() {
        var userId = KommunicateUtils.getRandomId();
        var cookiePrefix = KommunicateUtils.getCookiePrefix();
        var mapCookies = [{
            oldName: 'kommunicate-id',
            newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
            skipPrefix: true
        }, {
            oldName: "userName",
            newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
            skipPrefix: true

        }, {
            oldName: "km_id",
            newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
            skipPrefix: true
        }, {
            oldName: "km_user_name",
            newName: cookiePrefix + KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
            skipPrefix: true
        }, {
            oldName: "km_lead_collection",
            newName: cookiePrefix + KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,
            skipPrefix: true
        },{
            oldName: "_kom_km_id",
            //skip newName to delete the cookie  
            skipPrefix: true
        },{
            oldName: "_kom_km_lead_collection",
            skipPrefix: true
        },{
            oldName: "_kom_km_user_name",
            skipPrefix: true
        }];
        
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.crossOrigin = "anonymous";
            script.src = KOMMUNICATE_PLUGIN_MIN_JS;
            seekReplaceDestroyCookies(mapCookies);         // Will remove this in next release
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        // mckInitSidebox();
                        sentryConfig.enable && loadErrorTracking(userId);
                        loadPseudoName(userId);
                    }
                };
            } else { // Others
                script.onload = function() {
                    // mckInitSidebox();
                    sentryConfig.enable && loadErrorTracking(userId);
                    loadPseudoName(userId);
                };
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function mckInitSidebox(data, randomUserId) {
        try {
            var options = applozic._globals;
            var widgetSettings = data.chatWidget || data.widgetTheme;
            var sessionTimeout = options.sessionTimeout;
            sessionTimeout == null && (sessionTimeout = widgetSettings && widgetSettings.sessionTimeout);
            options["agentId"]= data.agentId;
            options["agentName"]=data.agentName;
            options["widgetSettings"] = widgetSettings;
            options["customerCreatedAt"]=data.customerCreatedAt;
            options["collectFeedback"]=data.collectFeedback;
            var pseudoNameEnabled = KM_PLUGIN_SETTINGS.pseudoNameEnabled;
            options.metadata = typeof options.metadata=='object'?options.metadata: {};
            KommunicateUtils.deleteDataFromKmSession("settings");

            if(sessionTimeout != null && !(options.preLeadCollection || options.askUserDetails)){
                logoutAfterSessionExpiry(sessionTimeout);
                var details = KommunicateUtils.getItemFromLocalStorage(applozic._globals.appId) || {};
                !details.sessionStartTime && (details.sessionStartTime = new Date().getTime());
                details.sessionTimeout = sessionTimeout;
                KommunicateUtils.setItemToLocalStorage(applozic._globals.appId, details);
            }

            if (applozic.PRODUCT_ID == 'kommunicate') {
                var accessTokenFromCookie = KommunicateUtils.getCookie(KommunicateConstants.COOKIES.ACCESS_TOKEN);
                var userIdFromCookie = KommunicateUtils.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID);
                var displayNameFromCookie= KommunicateUtils.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME);
                var isAnonymousUser= !options.userId;
                options["userId"] = !isAnonymousUser? options.userId:(userIdFromCookie||randomUserId)
                var displayName= isAnonymousUser? (pseudoNameEnabled?(displayNameFromCookie||data.userName):""): options.userName;
                displayName && (options["userName"]  = displayName);

                if (isAnonymousUser && pseudoNameEnabled) {
                    options.metadata["KM_PSEUDO_USER"] = JSON.stringify({pseudoName: "true", hidden: "true" })
                }
                if(isAnonymousUser && accessTokenFromCookie){
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
        } catch (e) {
            console.log(e);
            console.log("Plugin loading error. Refresh page.", e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    
    function seekReplaceDestroyCookies (mapCookies){
       var  hostName = parent.window.location.hostname;
        mapCookies && mapCookies.forEach(function(arrayItem){
            if (KommunicateUtils.getCookie(arrayItem.oldName,arrayItem.skipPrefix)) {
                var value = KommunicateUtils.getCookie(arrayItem.oldName, arrayItem.skipPrefix);
                if(arrayItem.newName){
                    KommunicateUtils.setCookie({"name":arrayItem.newName,"value": value, "expiresInDays":30, domain: KommunicateUtils.getDomainFromUrl(),skipPrefix:arrayItem.skipPrefix});
                }
                KommunicateUtils.deleteCookie({name: arrayItem.oldName, skipPrefix: arrayItem.skipPrefix, domain: KommunicateUtils.getDomainFromUrl()});
                // deleting for old version where domain is set as hostname
                KommunicateUtils.deleteCookie({name: arrayItem.oldName, skipPrefix: arrayItem.skipPrefix, domain: hostName});
            }
        })
    };

    function loadPseudoName(userId) {
        var data = {};
        data.appId = applozic._globals.appId;
        // NOTE: Don't pass applozic._globals as it is in data field of ajax call, pass only the fields which are required for this API call.
        var url = KM_PLUGIN_SETTINGS.kommunicateApiUrl + "/users/v2/chat/plugin/settings?appId=" + applozic._globals.appId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                mckInitSidebox(data.response, userId);
            }
        };
        xhr.open("GET", url, true);
        xhr.send(data);
    };
    function loadErrorTracking(userId) {
        userId = KommunicateUtils.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID) || userId;
        Sentry.init({
            dsn: sentryConfig.dsn,
            release: KommunicateConstants.KM_SERVER_RELEASE_VERSION
        });
        Sentry.configureScope(function (scope) {
            scope.setTag("applicationId", applozic._globals.appId);
            scope.setTag("userId", userId);
            scope.setUser({
                id: applozic._globals.appId
            });
        });
    };
    function saveUserCookies(kommunicateSettings){
        var cookieDomain  = KommunicateUtils.getDomainFromUrl();
        KommunicateUtils.setCookie({"name":KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,"value": kommunicateSettings.userId, "expiresInDays":30, domain: cookieDomain});
        KommunicateUtils.setCookie({"name":KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,"value": kommunicateSettings.userName ||"", "expiresInDays":30,domain: cookieDomain});
        if (!(kommunicateSettings.preLeadCollection || kommunicateSettings.askUserDetails)) {
            KommunicateUtils.setCookie({"name":KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,"value": false, "expiresInDays":30, domain: cookieDomain});
        }
        if(kommunicateSettings.accessToken){
            var encodedToken = window.btoa(kommunicateSettings.accessToken);
            KommunicateUtils.setCookie({"name":KommunicateConstants.COOKIES.ACCESS_TOKEN,"value": encodedToken || "", "expiresInDays":30,domain: cookieDomain});
        }
    };
    
    function logoutAfterSessionExpiry(sessionTimeout) {
        var widgetSettings, timeStampDifference;
        applozic._globals.appId && (widgetSettings = KommunicateUtils.getItemFromLocalStorage(applozic._globals.appId));
        var timeStampDifference = widgetSettings && (widgetSettings.sessionEndTime - widgetSettings.sessionStartTime);
        if (widgetSettings && sessionTimeout != null && timeStampDifference > sessionTimeout) {
            KommunicateUtils.deleteUserCookiesOnLogout();
            sessionStorage.removeItem("kommunicate");
            ALStorage.clearSessionStorageElements();
        };
        window.addEventListener('beforeunload', function (event) {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            var details = KommunicateUtils.getItemFromLocalStorage(applozic._globals.appId) || {};
            details.sessionEndTime = new Date().getTime();
            KommunicateUtils.setItemToLocalStorage(applozic._globals.appId, details);
        });
    };
}
