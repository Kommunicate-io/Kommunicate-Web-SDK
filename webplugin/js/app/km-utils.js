/* .
 Initilize all global variables used in kommunicate 
*/

KommunicateConstants = {
    KM_SERVER_RELEASE_VERSION: "4.3",
    EVENT_IDS: {
        WELCOME_MESSAGE: "3",
        AWAY_MESSAGE: {
            KNOWN: "2",
            ANONYMOUS: "1"
        }
    },
    THIRD_PARTY_APPLICATION: {
        HELPDOCS: "1"
    },
    KOMMUNICATE_SESSION_KEY: "kommunicate",
    PRICING_PACKAGE : {
        STARTUP: 101,
        PER_AGENT_MONTHLY:102,
        PER_AGENT_YEARLY:103,
        GROWTH_MONTHLY:104,
        ENTERPRISE_MONTHLY:105,
        ENTERPRISE_YEARLY:106,
        EARLY_BIRD_MONTHLY:107,
        EARLY_BIRD_YEARLY:108,
   },
   BOT_PLATFORM : { 	
        DIALOGFLOW:"dialogflow",	
        APIAI:"api.ai",	
        HELPDOCS:"helpdocs.io",	
        AMAZONLEX:"amazonlex",	
        RASA:"rasa",	
        CUSTOM:'custom'	
    },
   KM_NOTIFICATION_TONE_URL: "https://cdn.kommunicate.io/kommunicate/notification_tone.mp3",
    NOTIFICATION_RINGTONES: {
    'default': "https://cdn.kommunicate.io/kommunicate/notification_tone.mp3", // renamed to eventually
    'choose_me': "https://cdn.kommunicate.io/kommunicate/choose_me.mp3", // renamed to subtle
    'eventually': "https://cdn.kommunicate.io/kommunicate/eventually.mp3",
    'subtle': "https://cdn.kommunicate.io/kommunicate/subtle.mp3",
    'intuition': 'https://cdn.kommunicate.io/kommunicate/intuition.mp3',
    'light': 'https://cdn.kommunicate.io/kommunicate/light.mp3',
    'open_ended': 'https://cdn.kommunicate.io/kommunicate/open_ended.mp3'
    },
   KM_CHAT_POPUP_NOTIFICATION_URL: "https://cdn.kommunicate.io/kommunicate/chat-popup-notification-tone.mp3",
   CUSTOM_WIDGETS_SVG : {
    1: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 20\"><path fill=\"#FFF\" d=\"M21.25 18.48V7.31a7.3 7.3 0 0 0-7.3-7.3H7.31a7.3 7.3 0 1 0 0 14.6h7.2s.58.04.93.17c.34.12.71.42.71.42l4.44 3.66s.4.34.55.27c.15-.07.11-.65.11-.65zM7.51 8.8c0 .49-.42.88-.95.88-.52 0-.95-.4-.95-.88V5.67c0-.49.43-.88.95-.88.53 0 .95.4.95.88V8.8zm4.07 1.48c0 .49-.43.88-.95.88s-.95-.39-.95-.88v-6.1c0-.48.43-.88.95-.88s.95.4.95.88v6.1zm4.06-1.48c0 .49-.42.88-.95.88-.52 0-.94-.4-.94-.88V5.67c0-.49.42-.88.94-.88.53 0 .95.4.95.88V8.8z\"/></svg>",
    2: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 18\"><path fill=\"#FFF\" d=\"M3.35 18a.48.48 0 0 1-.44-.3.47.47 0 0 1 .1-.5c.53-.53 1.49-1.82 2.12-3.21C1.95 12.61 0 10.19 0 7.58 0 3.4 4.93 0 11 0s11 3.4 11 7.58-4.93 7.58-11 7.58c-.4 0-.78-.02-1.16-.05A8.63 8.63 0 0 1 3.34 18z\"/></svg>",
    3: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 17\"><path fill=\"#FFF\" d=\"M17.98 3.22h-6.65V1.64C11.33.78 10.64.1 9.78.1H1.56C.69.09 0 .78 0 1.64v7.67c0 .2.11.38.27.49a.61.61 0 0 0 .29.07c.08 0 .2-.03.26-.07l1.67-.96h1.47v4.65a2.03 2.03 0 0 0 2.02 2.02h10.7l2.5 1.42a.6.6 0 0 0 .26.07c.1 0 .2-.02.3-.07.17-.09.26-.29.26-.49V5.22c0-1.09-.91-2-2.02-2zm-14.02 2v2.51h-1.6c-.1 0-.2.03-.27.07l-.98.56V1.64c0-.24.2-.44.45-.44h8.22c.24 0 .44.2.44.44v1.58H5.96a2 2 0 0 0-2 2zM18.89 15.5l-1.78-1.02a.6.6 0 0 0-.27-.07H5.96a.92.92 0 0 1-.92-.91V5.22c0-.49.4-.9.92-.9h12.02c.49 0 .9.4.9.9V15.5z\"/></svg>",
    4: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 18 17\"><path fill=\"#FFF\" d=\"M17.63 16.5a.37.37 0 0 0 .37-.38V.74a.38.38 0 0 0-.38-.37H.38A.38.38 0 0 0 0 .74v12c0 .2.17.38.38.38h12.5l4.52 3.3a.37.37 0 0 0 .23.08z\"/></svg>"
    },
   RATINGS_SVG : {
    1: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.966 17.483c0 9.655-7.828 17.483-17.483 17.483C7.828 34.966 0 27.138 0 17.483 0 7.828 7.828 0 17.483 0c9.655 0 17.483 7.828 17.483 17.483"/> <path fill="#6F543A" d="M24.753 26.592c-.044-.173-1.134-4.253-7.27-4.253-6.137 0-7.227 4.08-7.27 4.253-.054.211.042.43.23.539.19.107.427.075.582-.075.018-.019 1.898-1.803 6.458-1.803 4.56 0 6.44 1.784 6.457 1.803a.49.49 0 0 0 .58.077.486.486 0 0 0 .233-.54M14.083 13.112c0 1.879-1.086 3.4-2.428 3.4-1.34 0-2.428-1.521-2.428-3.4 0-1.877 1.087-3.4 2.428-3.4 1.342 0 2.428 1.523 2.428 3.4M26.763 13.112c0 1.879-1.087 3.4-2.428 3.4s-2.428-1.521-2.428-3.4c0-1.877 1.087-3.4 2.428-3.4s2.428 1.523 2.428 3.4"/></g></svg>',
    5: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><circle cx="17.497" cy="17.497" r="17.497" fill="#FFCC4D"/><g fill="#6F543A" transform="translate(8.089 8.713)"> <circle cx="4.411" cy="2.787" r="2.5"/><circle cx="14.411" cy="2.787" r="2.5"/><path d="M1.499 15.287h16.825c.783 0 .783-1 0-1H1.499c-.783 0-.783 1 0 1z"/></g></g></svg>',
    10: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"> <g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.932 17.466c0 9.646-7.82 17.466-17.466 17.466S0 27.112 0 17.466 7.82 0 17.466 0s17.466 7.82 17.466 17.466"/><path fill="#6F543A" d="M17.466 20.377c-3.516 0-5.848-.41-8.733-.97-.659-.128-1.94 0-1.94 1.94 0 3.881 4.458 8.733 10.673 8.733 6.214 0 10.674-4.852 10.674-8.733 0-1.94-1.282-2.069-1.941-1.94-2.885.56-5.218.97-8.733.97"/><path fill="#FFF" d="M8.733 21.347s2.91.97 8.733.97c5.822 0 8.733-.97 8.733-.97s-1.94 3.881-8.733 3.881c-6.792 0-8.733-3.88-8.733-3.88"/><path fill="#6F543A" d="M14.07 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396M26.737 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396"/></g></svg>'
    },
    DEFAULT_AVATAR_IMAGE : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e9e9e9" d="M12,0A12,12,0,1,0,24,12,12.0044,12.0044,0,0,0,12,0Zm0,3.6A3.6,3.6,0,1,1,8.4,7.2,3.5952,3.5952,0,0,1,12,3.6Zm0,17.04a8.6406,8.6406,0,0,1-7.2-3.864c.036-2.388,4.8-3.696,7.2-3.696,2.388,0,7.164,1.308,7.2,3.696A8.6406,8.6406,0,0,1,12,20.64Z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    CONVERSATION_CLOSED_STATUS : 'closed',
    CONVERSATION_RESOLVED_STATUS : 'Resolved',
    CONVERSATION_OPEN_STATUS : 'Open',
    MESSAGE_SOURCE: {
        DEVICE: 0,
        WEB: 1,
        ANDROID: 2,
        IOS: 3,
        PLATFORM: 4,
        DESKTOP_BROWSER: 5,
        MOBILE_BROWSER: 6,
        MAIL_INTERCEPTOR: 7
    },
    MESSAGE_CONTENT_TYPE: {
        DEFAULT: 0,
        ATTACHMENT: 1,
        LOCATION: 2,
        TEXT_HTML: 3,
        PRICE: 4,
        IMAGELINK: 5,
        HYPERLINK: 6,
        CONTACT: 7,
        AUDIO: 8,
        VIDEO: 9,
        NOTIFY_MESSAGE: 10,
        HIDDEN_MESSAGE: 11,
        RECEIVER_ONLY: 12,
        BLOCK_NOTIFY_MESSAGE: 13,
        AUDIO_VIDEO_CALL: 102,
        MISSED_CALL: 103
    },
    APPLOZIC_USER_ROLE_TYPE : {
        BOT:1,
        APPLICATION_ADMIN:2,
        USER:3,
        ADMIN:4,
        BUSINESS:5,
        APPLICATION_BROADCASTER:6,
        SUPPORT:7,
        APPLICATION_WEB_ADMIN:8,
        DEVELOPER: 11
    },
    MESSAGE_TYPE: {
        RECEIVED: 4,
        SENT: 5,
    },
    DEFAULT_PROFILE_IMAGE: {
        URL: "https://s3.amazonaws.com/kommunicate.io/default-avatar-image.png"
    },
    ACTIONABLE_MESSAGE_TEMPLATE:{
        ROOM_COUNT:"1",
        HOTEL_BOOKING_CARD:"2",
        LINK_BUTTON:"3",
        ROOM_DETAIL:"4",
        PASSENGER_DETAIL:"5",
        QUICK_REPLY:"6",
        LIST:"7",
        DIALOG_BOX:"8",
        IMAGE:"9",
        CARD_CAROUSEL:"10",
        GENERIC_BUTTONS:"11", // supports link button/submit buttons and suggested replies 
        FORM:"12",
        GENERIC_BUTTONS_V2:"13"
    },
    COOKIES : {
        KOMMUNICATE_LOGGED_IN_ID: "km_id",
        KOMMUNICATE_LOGGED_IN_USERNAME: "km_user_name",
        IS_USER_ID_FOR_LEAD_COLLECTION: "km_lead_collection",
        ACCESS_TOKEN:"km_ac_tn"
    },
    MESSAGE_CLUBBING: {
        TIME_FRAME: 300000, // 5 minutes timestamp value in milliseconds.
    },
    GROUP_TYPE:{
        VIRTUAL:0,
        PRIVATE:1,
        PUBLIC:2,
        SELLER:3,
        SELF:4,
        BROADCAST:5,
        OPEN:6,
        GROUP_OF_TWO:7,
        APPLOZIC_INTERNAL:8,
        APPLICATION_LEVEL:9,
        SUPPORT:10,
        SKIP_DELIVERED_READ:11,
        ANNOUNCEMENT_GROUP:12
    },
    SETTINGS : {
        // chat context parameters are  dynamic and defined by customers while some of them are used to define system settings.
        // these parameters should not be overridden by customer defined parameters
        KM_CHAT_CONTEXT: "KM_CHAT_CONTEXT",
        KM_USER_LANGUAGE_CODE:"kmUserLanguageCode",
        KM_USER_TIMEZONE:"kmUserTimezone"
    },
    AVAILABILITY_STATUS : {
        ONLINE: "online",
        OFFLINE: "offline"
    },
    POST_BACK_TO_BOT_PLATFORM: "postBackToBotPlatform",
    CHAT_POPUP_TEMPLATE: {
        HORIZONTAL: 1,
        VERTICAL: 2
    },
    GROUP_ROLE: {
        USER: 0,
        ADMIN: 1,
        MODERATOR_OR_BOT: 2,
        MEMBER: 3
    },
    POSITION: {
        LEFT: 'left',
        RIGHT: 'right'
    }
}

/**
 * Kommunicate stores all Exposed functions to user.
 * 
 */
Kommunicate = {
    settings: {},
    internetStatus:true
};

/**
 * stores all UI manipulation
 */
KommunicateUI = {};


/**all  utilities*/
KommunicateUtils = {

    getCookie: function (cname, skipPrefix) {
        var cookiePrefix = this.getCookiePrefix();
        var name = (skipPrefix ?cname:  cookiePrefix+cname)+ "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    /* Method to set cookies*/
        setCookie: function (cookie) {
        var cookiePrefix =this.getCookiePrefix();
        var name = (cookie && cookie.skipPrefix )?cookie.name: cookiePrefix+cookie.name;
        var value =cookie.value;
        var path = "/";
        var secure = typeof cookie.secure == "undefined"?this.isHttpsEnabledConnection():cookie.secure;
        var cookieExpiry= new Date("2038-01-19 04:14:07").toUTCString();
        var domain = cookie.domain;
        if(cookie.path){
            path = cookie.path;
        }
        if(cookie.expiresInDays){
            var today = new Date();
            cookieExpiry = new Date(today.setDate(today.getDate()+cookie.expiresInDays)).toUTCString();
        }

        document.cookie = name + "=" + value + ";" + "expires="+cookieExpiry+ ";path="+path+(secure?";secure":"") +(domain?";domain="+domain:"");
    },
    getCookiePrefix : function(){
        var appOptions = KommunicateUtils.getDataFromKmSession("appOptions") || applozic._globals;
        var cookiePrefix = KommunicateUtils.getSubDomain();
        if(appOptions && appOptions.domainKey){
            cookiePrefix = appOptions.domainKey;
        }
        return cookiePrefix+"_";
    },
    isHttpsEnabledConnection : function(){
         return parent.window.location.protocol == "https:";
    },
    deleteCookie : function(cookie) {
        
        var cookiePrefix =this.getCookiePrefix();
        var name = (cookie && cookie.skipPrefix )?cookie.name: cookiePrefix+cookie.name;
        var value ="";
        var path = cookie.path ||"/";
        var secure = typeof cookie.secure == "undefined"?this.isHttpsEnabledConnection():cookie.secure;
        var domain = cookie.domain;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path="+path+(secure?";secure":"") +(domain?";domain="+domain:"");
    },
    getRandomId: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    getDataFromKmSession: function (key) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = sessionStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            return session ? JSON.parse(session)[key] : "";  
        }
    },
    storeDataIntoKmSession: function (key, data) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = (typeof sessionStorage !== 'undefined') && sessionStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            session = session ? JSON.parse(session) : {};
            session[key] = data;
            (typeof sessionStorage !== 'undefined') && sessionStorage.setItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY, JSON.stringify(session));
        }

    },
    deleteDataFromKmSession : function (key) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = (typeof sessionStorage !== 'undefined') && sessionStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            session = session ? JSON.parse(session) : {};
            delete session[key];
            (typeof sessionStorage !== 'undefined') && sessionStorage.setItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY, JSON.stringify(session));
        }
    },
    triggerCustomEvent: function(eventName, options, kmPluginVersion) {

        options = typeof options == 'object' ? options : {}
        options.bubbles = options.bubbles || true;
        options.cancelable = options.cancelable || true;

        if (navigator.userAgent.indexOf('MSIE') !== -1 ||
            navigator.appVersion.indexOf('Trident/') > 0) {
            /* Microsoft Internet Explorer detected in. */
            var evt =  kmPluginVersion  === "v2" ? window.parent.document.createEvent('Event') : document.createEvent('Event');
            evt.initEvent(eventName, options.bubbles, options.cancelable);
            kmPluginVersion  === "v2" ? window.parent.document.dispatchEvent(evt) : window.dispatchEvent(evt);

        } else {
            var parentWindow = (kmPluginVersion  === "v2") ? window.parent.document : window
            //Custom event trigger
            parentWindow.dispatchEvent(new CustomEvent(eventName, {
                detail: options.data || {},
                bubbles: options.bubbles || true,
                cancelable: options.cancelable || true
            }));
        }
    },
    getSettings:function(key){
        var settings = KommunicateUtils.getDataFromKmSession("settings"); 
        settings=  settings?settings:null;
        return key&&settings?settings[key]:(settings?settings:"");
    },
    getItemFromLocalStorage: function(key) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            return session ? JSON.parse(session)[key] : "";
        } 
    },
    removeItemFromLocalStorage: function(key) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            session = session ? JSON.parse(session) : {};
            delete session[key];
            localStorage.setItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY, JSON.stringify(session));
        }
    },
    setItemToLocalStorage: function(key,data) {
        if(KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
            session = session ? JSON.parse(session) : {};
            session[key] = data;
            localStorage.setItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY, JSON.stringify(session));
        }
    },
    getDomainFromUrl: function (hostName) {
        hostName = hostName || parent.window.location.hostname;
        var domain = "";
        if (hostName != null) {
            var parts = hostName.split('.').reverse();

            if (parts != null && parts.length <= 1) {
                // cases like  localhost
                return domain;
            } else if (parts != null && parts.length <= 3) {
                // cases:  url with one or no sub domain 
                domain = "." + parts[1] + '.' + parts[0];
            } else if (parts != null && parts.length <= 4) {

                if (!parseInt(parts[1]) && !parseInt(parts[0])) {
                    // check if url is not IP address
                    domain = "." + parts[2] + "." + parts[1] + "." + parts[0];
                }
            }
        }
        return domain;
    },
    getSubDomain : function(){
         var hostName = parent.window.location.hostname;
         var domainLength= this.getDomainFromUrl(hostName).length;
         var subDomain =hostName.substr(0,hostName.length - domainLength);
         return subDomain;
    },
    deleteUserCookiesOnLogout : function(){
        var cookieDomain  = KommunicateUtils.getDomainFromUrl();
        KommunicateUtils.deleteCookie({name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,domain: KommunicateUtils.getDomainFromUrl()});
        KommunicateUtils.deleteCookie({name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME, domain: KommunicateUtils.getDomainFromUrl()});
        KommunicateUtils.deleteCookie({name: KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,  domain: KommunicateUtils.getDomainFromUrl()});
        KommunicateUtils.deleteCookie({name: KommunicateConstants.COOKIES.ACCESS_TOKEN, domain: KommunicateUtils.getDomainFromUrl()});
    },
    isValidTimeZone : function(tzId) {
        if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
            console.log("not able to validate the timezone in this environment, skipping validation for timezone ", tzId);
            return true;
        }
        try {
            Intl.DateTimeFormat(undefined, {timeZone: tzId});
            return true;
        }
        catch (ex) {
            console.log("ERROR: time zone is not registered into IANA timezone db. can not set the user timezone. more detail about timezone db https://www.iana.org/time-zones" );
            return false;
        }
    },
    isActiveConversationNeedsToBeOpened : function(activeConversationInfo, data) {
        var userId = KommunicateUtils.getCookie(KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID);
        return (activeConversationInfo && typeof data != "undefined" && (data.appId == activeConversationInfo.appId && userId == activeConversationInfo.userId ));
    },
    isSessionStorageAvailable: function() {
        try {
            return typeof (w.sessionStorage) !== "undefined"
        } catch (e) {
            return false
        }
    },
    isURL: function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
}
