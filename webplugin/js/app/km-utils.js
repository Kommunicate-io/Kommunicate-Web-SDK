/* .
 Initilize all global variables used in kommunicate 
*/

KommunicateConstants = {
    KM_WIDGET_RELEASE_VERSION: "6.3",
    EVENT_IDS: {
        WELCOME_MESSAGE: '3',
        AWAY_MESSAGE: {
            KNOWN: '2',
            ANONYMOUS: '1',
        },
    },
    KOMMUNICATE_SESSION_KEY: 'kommunicate',
    PRICING_PACKAGE: {
        STARTUP: 101,
        PER_AGENT_MONTHLY: 102,
        PER_AGENT_YEARLY: 103,
        GROWTH_MONTHLY: 104,
        ENTERPRISE_MONTHLY: 105,
        ENTERPRISE_YEARLY: 106,
        EARLY_BIRD_MONTHLY: 107,
        EARLY_BIRD_YEARLY: 108,
        TRIAL: 111,
    },
    BOT_PLATFORM: {
        DIALOGFLOW: 'dialogflow',
        APIAI: 'api.ai',
        AMAZONLEX: 'amazonlex',
        RASA: 'rasa',
        CUSTOM: 'custom',
    },
    KM_NOTIFICATION_TONE_URL:
        'https://cdn.kommunicate.io/kommunicate/notification_tone.mp3',
    NOTIFICATION_RINGTONES: {
        default: 'https://cdn.kommunicate.io/kommunicate/notification_tone.mp3', // renamed to eventually
        choose_me: 'https://cdn.kommunicate.io/kommunicate/choose_me.mp3', // renamed to subtle
        eventually: 'https://cdn.kommunicate.io/kommunicate/eventually.mp3',
        subtle: 'https://cdn.kommunicate.io/kommunicate/subtle.mp3',
        intuition: 'https://cdn.kommunicate.io/kommunicate/intuition.mp3',
        light: 'https://cdn.kommunicate.io/kommunicate/light.mp3',
        open_ended: 'https://cdn.kommunicate.io/kommunicate/open_ended.mp3',
    },
    KM_CHAT_POPUP_NOTIFICATION_URL:
        'https://cdn.kommunicate.io/kommunicate/chat-popup-notification-tone.mp3',
    CUSTOM_WIDGETS_SVG: {
        1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20"><path fill="#FFF" d="M21.25 18.48V7.31a7.3 7.3 0 0 0-7.3-7.3H7.31a7.3 7.3 0 1 0 0 14.6h7.2s.58.04.93.17c.34.12.71.42.71.42l4.44 3.66s.4.34.55.27c.15-.07.11-.65.11-.65zM7.51 8.8c0 .49-.42.88-.95.88-.52 0-.95-.4-.95-.88V5.67c0-.49.43-.88.95-.88.53 0 .95.4.95.88V8.8zm4.07 1.48c0 .49-.43.88-.95.88s-.95-.39-.95-.88v-6.1c0-.48.43-.88.95-.88s.95.4.95.88v6.1zm4.06-1.48c0 .49-.42.88-.95.88-.52 0-.94-.4-.94-.88V5.67c0-.49.42-.88.94-.88.53 0 .95.4.95.88V8.8z"/></svg>',
        2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18"><path fill="#FFF" d="M3.35 18a.48.48 0 0 1-.44-.3.47.47 0 0 1 .1-.5c.53-.53 1.49-1.82 2.12-3.21C1.95 12.61 0 10.19 0 7.58 0 3.4 4.93 0 11 0s11 3.4 11 7.58-4.93 7.58-11 7.58c-.4 0-.78-.02-1.16-.05A8.63 8.63 0 0 1 3.34 18z"/></svg>',
        3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17"><path fill="#FFF" d="M17.98 3.22h-6.65V1.64C11.33.78 10.64.1 9.78.1H1.56C.69.09 0 .78 0 1.64v7.67c0 .2.11.38.27.49a.61.61 0 0 0 .29.07c.08 0 .2-.03.26-.07l1.67-.96h1.47v4.65a2.03 2.03 0 0 0 2.02 2.02h10.7l2.5 1.42a.6.6 0 0 0 .26.07c.1 0 .2-.02.3-.07.17-.09.26-.29.26-.49V5.22c0-1.09-.91-2-2.02-2zm-14.02 2v2.51h-1.6c-.1 0-.2.03-.27.07l-.98.56V1.64c0-.24.2-.44.45-.44h8.22c.24 0 .44.2.44.44v1.58H5.96a2 2 0 0 0-2 2zM18.89 15.5l-1.78-1.02a.6.6 0 0 0-.27-.07H5.96a.92.92 0 0 1-.92-.91V5.22c0-.49.4-.9.92-.9h12.02c.49 0 .9.4.9.9V15.5z"/></svg>',
        4: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17"><path fill="#FFF" d="M17.63 16.5a.37.37 0 0 0 .37-.38V.74a.38.38 0 0 0-.38-.37H.38A.38.38 0 0 0 0 .74v12c0 .2.17.38.38.38h12.5l4.52 3.3a.37.37 0 0 0 .23.08z"/></svg>',
    },
    RATINGS_SVG: {
        1: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.966 17.483c0 9.655-7.828 17.483-17.483 17.483C7.828 34.966 0 27.138 0 17.483 0 7.828 7.828 0 17.483 0c9.655 0 17.483 7.828 17.483 17.483"/> <path fill="#6F543A" d="M24.753 26.592c-.044-.173-1.134-4.253-7.27-4.253-6.137 0-7.227 4.08-7.27 4.253-.054.211.042.43.23.539.19.107.427.075.582-.075.018-.019 1.898-1.803 6.458-1.803 4.56 0 6.44 1.784 6.457 1.803a.49.49 0 0 0 .58.077.486.486 0 0 0 .233-.54M14.083 13.112c0 1.879-1.086 3.4-2.428 3.4-1.34 0-2.428-1.521-2.428-3.4 0-1.877 1.087-3.4 2.428-3.4 1.342 0 2.428 1.523 2.428 3.4M26.763 13.112c0 1.879-1.087 3.4-2.428 3.4s-2.428-1.521-2.428-3.4c0-1.877 1.087-3.4 2.428-3.4s2.428 1.523 2.428 3.4"/></g></svg>',
        5: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><circle cx="17.497" cy="17.497" r="17.497" fill="#FFCC4D"/><g fill="#6F543A" transform="translate(8.089 8.713)"> <circle cx="4.411" cy="2.787" r="2.5"/><circle cx="14.411" cy="2.787" r="2.5"/><path d="M1.499 15.287h16.825c.783 0 .783-1 0-1H1.499c-.783 0-.783 1 0 1z"/></g></g></svg>',
        10: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"> <g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.932 17.466c0 9.646-7.82 17.466-17.466 17.466S0 27.112 0 17.466 7.82 0 17.466 0s17.466 7.82 17.466 17.466"/><path fill="#6F543A" d="M17.466 20.377c-3.516 0-5.848-.41-8.733-.97-.659-.128-1.94 0-1.94 1.94 0 3.881 4.458 8.733 10.673 8.733 6.214 0 10.674-4.852 10.674-8.733 0-1.94-1.282-2.069-1.941-1.94-2.885.56-5.218.97-8.733.97"/><path fill="#FFF" d="M8.733 21.347s2.91.97 8.733.97c5.822 0 8.733-.97 8.733-.97s-1.94 3.881-8.733 3.881c-6.792 0-8.733-3.88-8.733-3.88"/><path fill="#6F543A" d="M14.07 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396M26.737 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396"/></g></svg>',
    },
    DEFAULT_AVATAR_IMAGE:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e9e9e9" d="M12,0A12,12,0,1,0,24,12,12.0044,12.0044,0,0,0,12,0Zm0,3.6A3.6,3.6,0,1,1,8.4,7.2,3.5952,3.5952,0,0,1,12,3.6Zm0,17.04a8.6406,8.6406,0,0,1-7.2-3.864c.036-2.388,4.8-3.696,7.2-3.696,2.388,0,7.164,1.308,7.2,3.696A8.6406,8.6406,0,0,1,12,20.64Z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    RICH_MESSAGE_ICON:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 23 22"><g fill="none" fill-rule="evenodd" opacity=".539" transform="translate(1 1)"><circle cx="6.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M14.636 16h-1.045l-3.136 4-3.137-4H.763C.342 16 0 15.673 0 15.27V4.36a4.287 4.287 0 0 1 1.356-3.091A4.69 4.69 0 0 1 4.6-.001h15.546c.421 0 .763.328.763.731V16h-6.273z"/><circle cx="10.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/><circle cx="14.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/></g></svg>',
    VIDEO_ICON: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.612 1.69804L14.5899 4.0101V3.264C14.5899 2.62758 14.3371 2.01708 13.8869 1.56701C13.4369 1.11694 12.8264 0.864014 12.1899 0.864014H2.39999C1.76356 0.864014 1.15307 1.11694 0.702996 1.56701C0.25282 2.01708 0 2.62754 0 3.264V10.7361C0 11.3725 0.252788 11.983 0.702996 12.4331C1.15307 12.8832 1.76353 13.1361 2.39999 13.1361H12.1899C12.8264 13.1361 13.4369 12.8832 13.8869 12.4331C14.3371 11.983 14.5899 11.3726 14.5899 10.7361V9.99L18.612 12.3021C19.374 12.7401 20 12.38 20 11.5021V2.50218C20 1.62008 19.376 1.26015 18.612 1.69804Z" fill="#919EAD"/></svg>',
    IMAGE_ICON: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 16V2C18 0.9 17.1 0 16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16ZM5.9 10.98L8 13.51L11.1 9.52C11.3 9.26 11.7 9.26 11.9 9.53L15.41 14.21C15.66 14.54 15.42 15.01 15.01 15.01H3.02C2.6 15.01 2.37 14.53 2.63 14.2L5.12 11C5.31 10.74 5.69 10.73 5.9 10.98Z" fill="#919EAD"/></svg>',
    DOCUMENT_ICON: '<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.59 0.59C10.21 0.21 9.7 0 9.17 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6.83C16 6.3 15.79 5.79 15.41 5.42L10.59 0.59ZM11 16H5C4.45 16 4 15.55 4 15C4 14.45 4.45 14 5 14H11C11.55 14 12 14.45 12 15C12 15.55 11.55 16 11 16ZM11 12H5C4.45 12 4 11.55 4 11C4 10.45 4.45 10 5 10H11C11.55 10 12 10.45 12 11C12 11.55 11.55 12 11 12ZM9 6V1.5L14.5 7H10C9.45 7 9 6.55 9 6Z" fill="#919EAD"/></svg>',
    LOCATION_ICON: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(38,50,56,.52)"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    ATTACHMENT_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><g data-name="Group 122"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 1"></path><path d="M19.00483767 16.29529691l-11.90272845-.0417193a4.358 4.358 0 0 1-4.32607928-4.32607929A4.259 4.259 0 0 1 7.0483691 7.65515915l10.48639356.03394113v.70710678L7.07241074 8.3382243a3.61826547 3.61826547 0 1 0 .00141421 7.2365308l11.89990002.03889087a2.647 2.647 0 0 0 2.68700577-2.68700576 2.688 2.688 0 0 0-2.70680476-2.70680476l-10.15476048-.0615183a1.774 1.774 0 0 0-1.75998878 1.75998879 1.8 1.8 0 0 0 1.76776695 1.76776695l8.82681395.02899138v.70710678l-8.81832866-.02333453a2.491 2.491 0 0 1-2.47840927-2.47840926 2.46 2.46 0 0 1 2.46426713-2.46426714l10.18375186.0311127a3.462 3.462 0 0 1 3.4400745 3.4400745 3.424 3.424 0 0 1-3.4202755 3.3679496z" data-name="Path 1"></path></g></svg>',
    CONVERSATION_CLOSED_STATUS: 'closed',
    CONVERSATION_RESOLVED_STATUS: 'Resolved',
    CONVERSATION_OPEN_STATUS: 'Open',
    CONVERSATION_WAITING_STATUS: 'Waiting',
    MESSAGE_SOURCE: {
        DEVICE: 0,
        WEB: 1,
        ANDROID: 2,
        IOS: 3,
        PLATFORM: 4,
        DESKTOP_BROWSER: 5,
        MOBILE_BROWSER: 6,
        MAIL_INTERCEPTOR: 7,
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
        MISSED_CALL: 103,
    },
    APPLOZIC_USER_ROLE_TYPE: {
        BOT: 1,
        APPLICATION_ADMIN: 2,
        USER: 3,
        ADMIN: 4,
        BUSINESS: 5,
        APPLICATION_BROADCASTER: 6,
        SUPPORT: 7,
        APPLICATION_WEB_ADMIN: 8,
        DEVELOPER: 11,
    },
    MESSAGE_TYPE: {
        INBOX: 0,
        OUTBOX: 1,
        DRAFT: 2,
        OUTBOX_SENT_FROM_DEVICE: 3,
        RECEIVED: 4,
        SENT: 5,
        CALL_INCOMING: 6,
        CALL_OUTGOING: 7,
    },
    DEFAULT_PROFILE_IMAGE: {
        URL: 'https://s3.amazonaws.com/kommunicate.io/default-avatar-image.png',
    },
    ACTIONABLE_MESSAGE_TEMPLATE: {
        ROOM_COUNT: '1',
        HOTEL_BOOKING_CARD: '2',
        LINK_BUTTON: '3',
        ROOM_DETAIL: '4',
        PASSENGER_DETAIL: '5',
        QUICK_REPLY: '6',
        LIST: '7',
        DIALOG_BOX: '8',
        IMAGE: '9',
        CARD_CAROUSEL: '10',
        GENERIC_BUTTONS: '11', // supports link button/submit buttons and suggested replies
        FORM: '12',
        GENERIC_BUTTONS_V2: '13',
        VIDEO: '14',
    },
    FORM_SUPPORTED_FIELDS: [
        'text',
        'hidden',
        'radio',
        'checkbox',
        'dropdown',
        'textarea',
    ],
    FORM_POST_BACK_MESSAGE_UNSUPPORTED_FIELDS: ['password', 'hidden'],
    COOKIES: {
        KOMMUNICATE_LOGGED_IN_ID: 'km_id',
        KOMMUNICATE_LOGGED_IN_USERNAME: 'km_user_name',
        IS_USER_ID_FOR_LEAD_COLLECTION: 'km_lead_collection',
        ACCESS_TOKEN: 'km_ac_tn',
    },
    MESSAGE_CLUBBING: {
        TIME_FRAME: 300000, // 5 minutes timestamp value in milliseconds.
    },
    GROUP_TYPE: {
        VIRTUAL: 0,
        PRIVATE: 1,
        PUBLIC: 2,
        SELLER: 3,
        SELF: 4,
        BROADCAST: 5,
        OPEN: 6,
        GROUP_OF_TWO: 7,
        APPLOZIC_INTERNAL: 8,
        APPLICATION_LEVEL: 9,
        SUPPORT: 10,
        SKIP_DELIVERED_READ: 11,
        ANNOUNCEMENT_GROUP: 12,
    },
    SETTINGS: {
        // chat context parameters are  dynamic and defined by customers while some of them are used to define system settings.
        // these parameters should not be overridden by customer defined parameters
        KM_CHAT_CONTEXT: 'KM_CHAT_CONTEXT',
        KM_USER_LANGUAGE_CODE: 'kmUserLanguageCode',
        KM_USER_TIMEZONE: 'kmUserTimezone',
    },
    AVAILABILITY_STATUS: {
        ONLINE: 'online',
        OFFLINE: 'offline',
    },
    POST_BACK_TO_BOT_PLATFORM: 'postBackToBotPlatform',
    CHAT_POPUP_TEMPLATE: {
        HORIZONTAL: 1,
        VERTICAL: 2,
        ACTIONABLE: 3
    },
    CHAT_POPUP_TEMPLATE_CLASS: {
        1: 'chat-popup-widget-container--horizontal',
        2: 'chat-popup-widget-container--vertical',
        3: 'chat-popup-widget-container--actionable'
    },
    GROUP_ROLE: {
        USER: 0,
        ADMIN: 1,
        MODERATOR_OR_BOT: 2,
        MEMBER: 3,
    },
    POSITION: {
        LEFT: 'left',
        RIGHT: 'right',
    },
    KOMMUNICATE_DOMAINS: ['kommunicate.io'],
    AWS_IMAGE_URL_EXPIRY_TIME: 15*60*1000,
    IMAGE_PLACEHOLDER_URL: 'https://cdn.kommunicate.io/kommunicate/image-placeholder.png',
    MAX_UPLOAD_SIZE: 25000000,
    FEEDBACK_API_STATUS: {
        INIT: 1,
        RATED: 2,
    },
    APPLOZIC_USER_STATUS: {
        0 : 'offline', 
        1 : 'online', 
        2 : 'away',
        3 : 'online', // NOT_AWAY
    },
    // Left here for future reference.
    //  APPLOZIC_USER_STATUS: {
    //     OFFLINE: 0,
    //     ONLINE: 1,
    //     AWAY: 2,
    //     NOT_AWAY: 3,
    //     BUSY: 4,
    //     INVISIBLE: 5,
    //     NOT_AVAILABLE: 6,
    //     ONLINE_WITHOUT_NOTIFICATIONS: 7,
    // },
    STATIC_MESSAGE_ICONS: {
        KM_LOCK: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" fill="#112222"></path></svg>'
    }
};

/**
 * Kommunicate stores all Exposed functions to user.
 *
 */
Kommunicate = {
    settings: {},
    internetStatus: true,
    _globals:kommunicate._globals,
    PRODUCT_ID:kommunicate.PRODUCT_ID,
};
/**
 * stores all UI manipulation
 */
KommunicateUI = {};

/**all  utilities*/
KommunicateUtils = {
    getCookie: function (cname, skipPrefix) {
        var cookiePrefix = this.getCookiePrefix();
        var name = (skipPrefix ? cname : cookiePrefix + cname) + '=';
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
        return '';
    },
    /* Method to set cookies*/
    setCookie: function (cookie) {
        var cookiePrefix = this.getCookiePrefix();
        var name =
            cookie && cookie.skipPrefix
                ? cookie.name
                : cookiePrefix + cookie.name;
        var value = cookie.value;
        var path = '/';
        var secure =
            typeof cookie.secure == 'undefined'
                ? this.isHttpsEnabledConnection()
                : cookie.secure;

        var cookieExpiry = new Date('2038-01-19 04:14:07').toUTCString();
        var isChrome =
            navigator.userAgent.indexOf('Chrome') != -1 &&
            navigator.vendor.indexOf('Google') != -1;
        var domain = cookie.domain;
        if (cookie.path) {
            path = cookie.path;
        }
        if (cookie.expiresInDays) {
            var today = new Date();
            cookieExpiry = new Date(
                today.setDate(today.getDate() + cookie.expiresInDays)
            ).toUTCString();
        }
        document.cookie =
            name +
            '=' +
            value +
            ';' +
            'expires=' +
            cookieExpiry +
            ';path=' +
            path +
            (secure ? ';secure' : '') +
            (domain ? ';domain=' + domain : '') +
            (';samesite=strict');
    },
    getCookiePrefix: function () {
        var appOptions =
            KommunicateUtils.getDataFromKmSession('appOptions') ||
            applozic._globals;
        var cookiePrefix = KommunicateUtils.getSubDomain();
        if (appOptions && appOptions.domainKey) {
            cookiePrefix = appOptions.domainKey;
        }
        return cookiePrefix + '_';
    },
    isHttpsEnabledConnection: function () {
        return parent.window.location.protocol == 'https:';
    },
    deleteCookie: function (cookie) {
        var cookiePrefix = this.getCookiePrefix();
        var name =
            cookie && cookie.skipPrefix
                ? cookie.name
                : cookiePrefix + cookie.name;
        var value = '';
        var path = cookie.path || '/';
        var secure =
            typeof cookie.secure == 'undefined'
                ? this.isHttpsEnabledConnection()
                : cookie.secure;
        var domain = cookie.domain;
        document.cookie =
            name +
            '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' +
            path +
            (secure ? ';secure' : '') +
            (domain ? ';domain=' + domain : '');
    },
    getRandomId: function () {
        var text = '';
        var possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 32; i++)
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        return text;
    },
    getDataFromKmSession: function (key) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session = sessionStorage.getItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY
            );
            return session ? JSON.parse(session)[key] : '';
        }
    },
    storeDataIntoKmSession: function (key, data) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session =
                typeof sessionStorage !== 'undefined' &&
                sessionStorage.getItem(
                    KommunicateConstants.KOMMUNICATE_SESSION_KEY
                );
            session = session ? JSON.parse(session) : {};
            session[key] = data;
            typeof sessionStorage !== 'undefined' &&
                sessionStorage.setItem(
                    KommunicateConstants.KOMMUNICATE_SESSION_KEY,
                    JSON.stringify(session)
                );
        }
    },
    deleteDataFromKmSession: function (key) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session =
                typeof sessionStorage !== 'undefined' &&
                sessionStorage.getItem(
                    KommunicateConstants.KOMMUNICATE_SESSION_KEY
                );
            session = session ? JSON.parse(session) : {};
            delete session[key];
            typeof sessionStorage !== 'undefined' &&
                sessionStorage.setItem(
                    KommunicateConstants.KOMMUNICATE_SESSION_KEY,
                    JSON.stringify(session)
                );
        }
    },
    triggerCustomEvent: function (eventName, options, kmPluginVersion) {
        options = typeof options == 'object' ? options : {};
        options.bubbles = options.bubbles || true;
        options.cancelable = options.cancelable || true;

        if (
            navigator.userAgent.indexOf('MSIE') !== -1 ||
            navigator.appVersion.indexOf('Trident/') > 0
        ) {
            /* Microsoft Internet Explorer detected in. */
            var evt =
                kmPluginVersion === 'v2'
                    ? window.parent.document.createEvent('Event')
                    : document.createEvent('Event');
            evt.initEvent(eventName, options.bubbles, options.cancelable);
            kmPluginVersion === 'v2'
                ? window.parent.document.dispatchEvent(evt)
                : window.dispatchEvent(evt);
        } else {
            var parentWindow =
                kmPluginVersion === 'v2' ? window.parent.document : window;
            //Custom event trigger
            parentWindow.dispatchEvent(
                new CustomEvent(eventName, {
                    detail: options.data || {},
                    bubbles: options.bubbles || true,
                    cancelable: options.cancelable || true,
                })
            );
        }
    },
    getSettings: function (key) {
        var settings = KommunicateUtils.getDataFromKmSession('settings');
        settings = settings ? settings : null;
        return key && settings ? settings[key] : settings ? settings : '';
    },
    getItemFromLocalStorage: function (key) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY
            );
            return session ? JSON.parse(session)[key] : '';
        }
    },
    removeItemFromLocalStorage: function (key) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY
            );
            session = session ? JSON.parse(session) : {};
            delete session[key];
            localStorage.setItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY,
                JSON.stringify(session)
            );
        }
    },
    setItemToLocalStorage: function (key, data) {
        if (KommunicateUtils.isSessionStorageAvailable()) {
            var session = localStorage.getItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY
            );
            session = session ? JSON.parse(session) : {};
            session[key] = data;
            localStorage.setItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY,
                JSON.stringify(session)
            );
        }
    },
    findCookieDomain: function (domain) {
        //reference : http://rossscrivener.co.uk/blog/javascript-get-domain-exclude-subdomain
        var i = 0;
        var parts = domain.split('.');
        var value = 'km_' + new Date().getTime();
        //check value is added in cookie else continue the iteration
        while (
            i < parts.length - 1 &&
            document.cookie.indexOf(value + '=' + value) == -1
        ) {
            //join the parts of domain
            domain = parts.slice(-1 - ++i).join('.');
            //set value in cookie
            document.cookie = value + '=' + value + ';domain=' + domain + ';';
        }
        //delete value from cookie
        document.cookie =
            value +
            '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' +
            domain +
            ';';
        return domain;
    },
    getSubDomain: function () {
        var hostName = parent.window.location.hostname;
        var domainLength = MCK_COOKIE_DOMAIN.length;
        var subDomain = hostName.substr(0, hostName.length - domainLength);
        return subDomain;
    },
    deleteUserCookiesOnLogout: function () {
        KommunicateUtils.deleteCookie({
            name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID,
            domain: MCK_COOKIE_DOMAIN,
        });
        KommunicateUtils.deleteCookie({
            name: KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_USERNAME,
            domain: MCK_COOKIE_DOMAIN,
        });
        KommunicateUtils.deleteCookie({
            name: KommunicateConstants.COOKIES.IS_USER_ID_FOR_LEAD_COLLECTION,
            domain: MCK_COOKIE_DOMAIN,
        });
        KommunicateUtils.deleteCookie({
            name: KommunicateConstants.COOKIES.ACCESS_TOKEN,
            domain: MCK_COOKIE_DOMAIN,
        });
    },
    isValidTimeZone: function (tzId) {
        if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
            console.log(
                'not able to validate the timezone in this environment, skipping validation for timezone ',
                tzId
            );
            return true;
        }
        try {
            Intl.DateTimeFormat(undefined, { timeZone: tzId });
            return true;
        } catch (ex) {
            console.log(
                'ERROR: time zone is not registered into IANA timezone db. can not set the user timezone. more detail about timezone db https://www.iana.org/time-zones'
            );
            return false;
        }
    },
    isActiveConversationNeedsToBeOpened: function (
        activeConversationInfo,
        data
    ) {
        var userId = KommunicateUtils.getCookie(
            KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID
        );
        return (
            activeConversationInfo &&
            typeof data != 'undefined' &&
            data.appId == activeConversationInfo.appId &&
            userId == activeConversationInfo.userId
        );
    },
    isSessionStorageAvailable: function () {
        try {
            return typeof w.sessionStorage !== 'undefined';
        } catch (e) {
            return false;
        }
    },
    isURL: function (str) {
        var pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator
        return pattern.test(str);
    },
    formatParams: function (params) {
        return (
            '?' +
            Object.keys(params)
                .map(function (key) {
                    return key + '=' + encodeURIComponent(params[key]);
                })
                .join('&')
        );
    },
    /**
     * When a new group is created, initially CURRENT_GROUP_DATA.groupMembers array has role of a member.
     * @param {object} assigneeDetails 
     * @returns boolean
     */
    isCurrentAssigneeBot: function (){
        if (CURRENT_GROUP_DATA.groupMembers && CURRENT_GROUP_DATA.groupMembers.length) {
            var currentConversationAssignee = {};
            for (
                var i = 0;
                i <= CURRENT_GROUP_DATA.groupMembers.length;
                i++
            ) {
                if (
                    CURRENT_GROUP_DATA.groupMembers[i] &&
                    CURRENT_GROUP_DATA.groupMembers[i].userId ==
                    CURRENT_GROUP_DATA.conversationAssignee
                ) {
                    currentConversationAssignee = CURRENT_GROUP_DATA.groupMembers[i]
                    break;
                }
            }

            if(currentConversationAssignee.hasOwnProperty('role')){
                return currentConversationAssignee.role === KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT;
            }else if(currentConversationAssignee.hasOwnProperty('roleType')){
                return currentConversationAssignee.roleType === KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT;
            }
        }
        return false;
    }
};
