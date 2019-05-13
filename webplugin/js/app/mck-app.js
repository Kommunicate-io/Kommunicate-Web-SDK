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
applozicSideBox.load();
function ApplozicSidebox() {
	var googleApiKey = (typeof applozic._globals !== 'undefined' && applozic._globals.googleApiKey)?(applozic._globals.googleApiKey):"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI";
    var mck_style_loader = [
    {
            "name": "mck-sidebox", 
            "url": KOMMUNICATE_PLUGIN_REQUIREMENTS_CSS
    } ];
    var mck_script_loader1 = [
    {
            "name": "applozic-min-js", 
            "url": "https://cdn.applozic.com/applozic/applozic.chat-5.4.2.min.js" // update the url with every new release of applozic-web-plugin
    },
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
   var mck_videocall = [ {
          "name": "video_twilio", "url": MCK_STATICPATH + "/js/app/twilio-video.js"
    } ];
    this.load = function() {
        try {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.crossOrigin = "anonymous";
            script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckinitPlugin();
                    }
                };
            } else { // Others
                script.onload = function() {
                    mckinitPlugin();
                };
            }
            head.appendChild(script);
        } catch (e) {

            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
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
            $.each(mck_style_loader, function(i, data) {
                mckLoadStyle(data.url);
            });
            $.ajax({
                    url: MCK_SIDEBOX_HTML, crossDomain: true, success: function(data) {
                        data = data.replace(/MCK_STATICPATH/g, MCK_STATICPATH);
                        $("body").append(data);
                        mckInitPluginScript();
                    }
            });
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
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
            $.each(mck_script_loader1, function(i, data) {
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
                } else if (data.name === "applozic-min-js"){
                    mckLoadScript(data.url, null, true)
                } 
                else {
                    mckLoadScript(data.url);
                }
            });
             if (typeof applozic._globals !== 'undefined'&& applozic._globals.video === true) {
                          $.each(mck_videocall, function(i, data) {
                          mckLoadScript(data.url);
                 });
               }
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
            $.each(mck_script_loader2, function(i, data) {
                if (data.name === "locationpicker") {
                    mckLoadScript(data.url, mckLoadAppScript);
                }
            });
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
            options["agentId"]= data.agentId;
            options["agentName"]=data.agentName;
            options["widgetSettings"]=data.widgetTheme;
            options["customerCreatedAt"]=data.customerCreatedAt;
            var pseudoNameEnabled = KM_PLUGIN_SETTINGS.pseudoNameEnabled;
            options.metadata = typeof options.metadata=='object'?options.metadata: {};
            KommunicateUtils.deleteDataFromKmSession("settings");
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
        $applozic.ajax({
            url: MCK_CONTEXTPATH + "/users/v2/chat/plugin/settings",
            method: 'GET',
            data: data,
            success: function (data) {
                mckInitSidebox(data.response, userId);
            },
            error: function (error) {
                console.log(error);
            }

        })
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
    }

}
