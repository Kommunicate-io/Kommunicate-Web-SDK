/* .
 Initilize all global variables used in kommunicate 
*/
HEADER_CTA = {
    FAQ: 'FAQ',
    CSAT_RATING: 'CSAT_RATING',
    RESTART_CONVERSATION: 'RESTART_CONVERSATION',
    TTS: 'TTS', // TEXT TO SPEECH
    TALK_TO_HUMAN: 'TALK_TO_HUMAN',
};

KommunicateConstants = {
    KM_WIDGET_RELEASE_VERSION: '6.3',
    DESIGN_LAYOUTS: {
        DEFAULT: 'classic',
        MODERN: 'modern',
    },
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
    KM_NOTIFICATION_TONE_URL: 'https://cdn.kommunicate.io/kommunicate/notification_tone.mp3',
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
        1: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none"><path d="M10.9307 8.30567C11.506 8.30567 11.9723 7.83929 11.9723 7.264C11.9723 6.6887 11.506 6.22233 10.9307 6.22233C10.3554 6.22233 9.889 6.6887 9.889 7.264C9.889 7.83929 10.3554 8.30567 10.9307 8.30567Z" fill="#D64242"/><path d="M6.06955 8.30567C6.64485 8.30567 7.11122 7.83929 7.11122 7.264C7.11122 6.6887 6.64485 6.22233 6.06955 6.22233C5.49426 6.22233 5.02789 6.6887 5.02789 7.264C5.02789 7.83929 5.49426 8.30567 6.06955 8.30567Z" fill="#D64242"/><path d="M8.49317 2.05566C4.65983 2.05566 1.55566 5.16678 1.55566 9.00011C1.55566 12.8334 4.65983 15.9446 8.49317 15.9446C12.3334 15.9446 15.4446 12.8334 15.4446 9.00011C15.4446 5.16678 12.3334 2.05566 8.49317 2.05566ZM8.50011 14.5557C5.43066 14.5557 2.94455 12.0696 2.94455 9.00011C2.94455 5.93066 5.43066 3.44455 8.50011 3.44455C11.5696 3.44455 14.0557 5.93066 14.0557 9.00011C14.0557 12.0696 11.5696 14.5557 8.50011 14.5557ZM8.50011 10.389C7.18067 10.389 5.97928 11.0626 5.27094 12.1807C5.11816 12.4237 5.19455 12.7432 5.43761 12.8959C5.68066 13.0487 6.00011 12.9723 6.15289 12.7293C6.66678 11.9098 7.54178 11.4237 8.50011 11.4237C9.45844 11.4237 10.3334 11.9098 10.8473 12.7293C10.9446 12.889 11.1182 12.9723 11.2918 12.9723C11.389 12.9723 11.4793 12.9446 11.5696 12.8959C11.8126 12.7432 11.889 12.4237 11.7362 12.1807C11.0209 11.0557 9.81955 10.389 8.50011 10.389Z" fill="#D64242"/></svg>',
        5: '<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.93761 11.4307H10.0626C10.3473 11.4307 10.5834 11.1946 10.5834 10.9098C10.5834 10.6251 10.3473 10.389 10.0626 10.389H6.93761C6.65289 10.389 6.41678 10.6251 6.41678 10.9098C6.41678 11.1946 6.65289 11.4307 6.93761 11.4307Z" fill="#ED9D00"/><path d="M10.9307 8.30567C11.506 8.30567 11.9723 7.83929 11.9723 7.264C11.9723 6.6887 11.506 6.22233 10.9307 6.22233C10.3554 6.22233 9.889 6.6887 9.889 7.264C9.889 7.83929 10.3554 8.30567 10.9307 8.30567Z" fill="#ED9D00"/><path d="M6.06955 8.30567C6.64485 8.30567 7.11122 7.83929 7.11122 7.264C7.11122 6.6887 6.64485 6.22233 6.06955 6.22233C5.49426 6.22233 5.02789 6.6887 5.02789 7.264C5.02789 7.83929 5.49426 8.30567 6.06955 8.30567Z" fill="#ED9D00"/><path d="M8.49317 2.05566C4.65983 2.05566 1.55566 5.16678 1.55566 9.00011C1.55566 12.8334 4.65983 15.9446 8.49317 15.9446C12.3334 15.9446 15.4446 12.8334 15.4446 9.00011C15.4446 5.16678 12.3334 2.05566 8.49317 2.05566ZM8.50011 14.5557C5.43066 14.5557 2.94455 12.0696 2.94455 9.00011C2.94455 5.93066 5.43066 3.44455 8.50011 3.44455C11.5696 3.44455 14.0557 5.93066 14.0557 9.00011C14.0557 12.0696 11.5696 14.5557 8.50011 14.5557Z" fill="#ED9D00"/></svg>',
        10: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4307 8.30567C12.006 8.30567 12.4723 7.83929 12.4723 7.264C12.4723 6.6887 12.006 6.22233 11.4307 6.22233C10.8554 6.22233 10.389 6.6887 10.389 7.264C10.389 7.83929 10.8554 8.30567 11.4307 8.30567Z" fill="#2EA63A"/><path d="M6.56955 8.30567C7.14485 8.30567 7.61122 7.83929 7.61122 7.264C7.61122 6.6887 7.14485 6.22233 6.56955 6.22233C5.99426 6.22233 5.52789 6.6887 5.52789 7.264C5.52789 7.83929 5.99426 8.30567 6.56955 8.30567Z" fill="#2EA63A"/><path d="M9.00011 11.7779C7.97233 11.7779 7.09039 11.2154 6.60428 10.389H5.44455C6.00011 11.8126 7.38205 12.8196 9.00011 12.8196C10.6182 12.8196 12.0001 11.8126 12.5557 10.389H11.3959C10.9098 11.2154 10.0279 11.7779 9.00011 11.7779ZM8.99317 2.05566C5.15983 2.05566 2.05566 5.16678 2.05566 9.00011C2.05566 12.8334 5.15983 15.9446 8.99317 15.9446C12.8334 15.9446 15.9446 12.8334 15.9446 9.00011C15.9446 5.16678 12.8334 2.05566 8.99317 2.05566ZM9.00011 14.5557C5.93066 14.5557 3.44455 12.0696 3.44455 9.00011C3.44455 5.93066 5.93066 3.44455 9.00011 3.44455C12.0696 3.44455 14.5557 5.93066 14.5557 9.00011C14.5557 12.0696 12.0696 14.5557 9.00011 14.5557Z" fill="#2EA63A"/></svg>',
    },
    RATING_TITLE: {
        1: 'Poor',
        5: 'Average',
        10: 'Great',
    },
    DEFAULT_AVATAR_IMAGE:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e9e9e9" d="M12,0A12,12,0,1,0,24,12,12.0044,12.0044,0,0,0,12,0Zm0,3.6A3.6,3.6,0,1,1,8.4,7.2,3.5952,3.5952,0,0,1,12,3.6Zm0,17.04a8.6406,8.6406,0,0,1-7.2-3.864c.036-2.388,4.8-3.696,7.2-3.696,2.388,0,7.164,1.308,7.2,3.696A8.6406,8.6406,0,0,1,12,20.64Z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    STAR_SVG:
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin: 0 !important;" xmlns="http://www.w3.org/2000/svg"><path d="M9.00024 13.1393L12.1127 15.0218C12.6827 15.3668 13.3802 14.8568 13.2302 14.2118L12.4052 10.6718L15.1577 8.28684C15.6602 7.85184 15.3902 7.02684 14.7302 6.97434L11.1077 6.66684L9.69024 3.32184C9.43524 2.71434 8.56524 2.71434 8.31024 3.32184L6.89274 6.65934L3.27024 6.96684C2.61024 7.01934 2.34024 7.84434 2.84274 8.27934L5.59524 10.6643L4.77024 14.2043C4.62024 14.8493 5.31774 15.3593 5.88774 15.0143L9.00024 13.1393Z" fill="#FFC045"/></svg>',
    RICH_MESSAGE_ICON:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 23 22"><g fill="none" fill-rule="evenodd" opacity=".539" transform="translate(1 1)"><circle cx="6.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M14.636 16h-1.045l-3.136 4-3.137-4H.763C.342 16 0 15.673 0 15.27V4.36a4.287 4.287 0 0 1 1.356-3.091A4.69 4.69 0 0 1 4.6-.001h15.546c.421 0 .763.328.763.731V16h-6.273z"/><circle cx="10.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/><circle cx="14.455" cy="9" r="1" fill="#000" fill-rule="nonzero"/></g></svg>',
    VIDEO_ICON:
        '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.612 1.69804L14.5899 4.0101V3.264C14.5899 2.62758 14.3371 2.01708 13.8869 1.56701C13.4369 1.11694 12.8264 0.864014 12.1899 0.864014H2.39999C1.76356 0.864014 1.15307 1.11694 0.702996 1.56701C0.25282 2.01708 0 2.62754 0 3.264V10.7361C0 11.3725 0.252788 11.983 0.702996 12.4331C1.15307 12.8832 1.76353 13.1361 2.39999 13.1361H12.1899C12.8264 13.1361 13.4369 12.8832 13.8869 12.4331C14.3371 11.983 14.5899 11.3726 14.5899 10.7361V9.99L18.612 12.3021C19.374 12.7401 20 12.38 20 11.5021V2.50218C20 1.62008 19.376 1.26015 18.612 1.69804Z" fill="#919EAD"/></svg>',
    IMAGE_ICON:
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 16V2C18 0.9 17.1 0 16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16ZM5.9 10.98L8 13.51L11.1 9.52C11.3 9.26 11.7 9.26 11.9 9.53L15.41 14.21C15.66 14.54 15.42 15.01 15.01 15.01H3.02C2.6 15.01 2.37 14.53 2.63 14.2L5.12 11C5.31 10.74 5.69 10.73 5.9 10.98Z" fill="#919EAD"/></svg>',
    DOCUMENT_ICON:
        '<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.59 0.59C10.21 0.21 9.7 0 9.17 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6.83C16 6.3 15.79 5.79 15.41 5.42L10.59 0.59ZM11 16H5C4.45 16 4 15.55 4 15C4 14.45 4.45 14 5 14H11C11.55 14 12 14.45 12 15C12 15.55 11.55 16 11 16ZM11 12H5C4.45 12 4 11.55 4 11C4 10.45 4.45 10 5 10H11C11.55 10 12 10.45 12 11C12 11.55 11.55 12 11 12ZM9 6V1.5L14.5 7H10C9.45 7 9 6.55 9 6Z" fill="#919EAD"/></svg>',
    LOCATION_ICON:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(38,50,56,.52)"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    ATTACHMENT_ICON:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><g data-name="Group 122"><path fill="none" d="M0 0h24v24H0z" data-name="Rectangle 1"></path><path d="M19.00483767 16.29529691l-11.90272845-.0417193a4.358 4.358 0 0 1-4.32607928-4.32607929A4.259 4.259 0 0 1 7.0483691 7.65515915l10.48639356.03394113v.70710678L7.07241074 8.3382243a3.61826547 3.61826547 0 1 0 .00141421 7.2365308l11.89990002.03889087a2.647 2.647 0 0 0 2.68700577-2.68700576 2.688 2.688 0 0 0-2.70680476-2.70680476l-10.15476048-.0615183a1.774 1.774 0 0 0-1.75998878 1.75998879 1.8 1.8 0 0 0 1.76776695 1.76776695l8.82681395.02899138v.70710678l-8.81832866-.02333453a2.491 2.491 0 0 1-2.47840927-2.47840926 2.46 2.46 0 0 1 2.46426713-2.46426714l10.18375186.0311127a3.462 3.462 0 0 1 3.4400745 3.4400745 3.424 3.424 0 0 1-3.4202755 3.3679496z" data-name="Path 1"></path></g></svg>',
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
        ELECTRONIC_MAIL: 104,
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
    FORM_SUPPORTED_FIELDS: ['text', 'hidden', 'radio', 'checkbox', 'dropdown', 'textarea'],
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
        AWAY: 'away',
    },
    POST_BACK_TO_BOT_PLATFORM: 'postBackToBotPlatform',
    CHAT_POPUP_TEMPLATE: {
        HORIZONTAL: 1,
        VERTICAL: 2,
        ACTIONABLE: 3,
    },
    CHAT_POPUP_TEMPLATE_CLASS: {
        1: 'chat-popup-widget-container--horizontal',
        2: 'chat-popup-widget-container--vertical',
        3: 'chat-popup-widget-container--actionable',
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
    AWS_IMAGE_URL_EXPIRY_TIME: 15 * 60 * 1000,
    IMAGE_PLACEHOLDER_URL: 'https://cdn.kommunicate.io/kommunicate/image-placeholder.png',
    MAX_UPLOAD_SIZE: 25000000,
    FEEDBACK_API_STATUS: {
        INIT: 1,
        RATED: 2,
    },
    APPLOZIC_USER_STATUS: {
        0: 'offline',
        1: 'online',
        2: 'away',
        3: 'online', // NOT_AWAY
    },
    AGENT_STATUS: {
        offline: 0,
        online: 1,
    },
    HEADER_PRIMARY_CTA: {
        [HEADER_CTA.FAQ]: {
            name: HEADER_CTA.FAQ,
        },
        [HEADER_CTA.CSAT_RATING]: {
            id: 'km-csat-trigger',
            identifier: 'collectFeedback',
            name: HEADER_CTA['CSAT_RATING'],
            icon:
                '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.99998 11.8467L12.12 14.3334L11.0266 9.64675L14.6666 6.49341L9.87331 6.08675L7.99998 1.66675L6.12665 6.08675L1.33331 6.49341L4.97331 9.64675L3.87998 14.3334L7.99998 11.8467Z" fill="#ffffff"></path></svg>',
        },
        [HEADER_CTA.RESTART_CONVERSATION]: {
            id: 'km-restart-conversation',
            identifier: 'restartConversationByUser',
            name: HEADER_CTA['RESTART_CONVERSATION'],
            icon:
                '<svg class="restart-conversation-icon" width="17" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.00002 8.85669C4.00002 7.75669 4.44669 6.75669 5.17335 6.03002L4.22669 5.08336C3.26669 6.05002 2.66669 7.38336 2.66669 8.85669C2.66669 11.5767 4.70002 13.8167 7.33335 14.1434V12.7967C5.44669 12.4767 4.00002 10.8367 4.00002 8.85669ZM13.3334 8.85669C13.3334 5.91002 10.9467 3.52336 8.00002 3.52336C7.96002 3.52336 7.92002 3.53002 7.88002 3.53002L8.60669 2.80336L7.66669 1.85669L5.33335 4.19002L7.66669 6.52336L8.60669 5.58336L7.88669 4.86336C7.92669 4.86336 7.96669 4.85669 8.00002 4.85669C10.2067 4.85669 12 6.65002 12 8.85669C12 10.8367 10.5534 12.4767 8.66669 12.7967V14.1434C11.3 13.8167 13.3334 11.5767 13.3334 8.85669Z" fill="#ffffff"></path></svg>',
        },
        [HEADER_CTA.TTS]: {
            id: 'user-overide-voice-output',
            identifier: 'voiceOutput',
            name: HEADER_CTA.TTS,
            icon: {
                ON:
                    '<svg width="16px" height="16px" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.458984 4.66672V7.33339C0.458984 7.70006 0.76882 8.00006 1.14751 8.00006H3.21308L5.47833 10.1934C5.9121 10.6134 6.65571 10.3134 6.65571 9.72006V2.27339C6.65571 1.68006 5.9121 1.38006 5.47833 1.80006L3.21308 4.00006H1.14751C0.76882 4.00006 0.458984 4.30006 0.458984 4.66672ZM9.75407 6.00006C9.75407 4.82006 9.05177 3.80672 8.03275 3.31339V8.68006C9.05177 8.19339 9.75407 7.18006 9.75407 6.00006ZM8.03275 0.966723V1.10006C8.03275 1.35339 8.20489 1.57339 8.44587 1.66672C10.2223 2.35339 11.4754 4.04006 11.4754 6.00006C11.4754 7.96006 10.2223 9.64672 8.44587 10.3334C8.198 10.4267 8.03275 10.6467 8.03275 10.9001V11.0334C8.03275 11.4534 8.46653 11.7467 8.86587 11.6001C11.2 10.7401 12.8524 8.56006 12.8524 6.00006C12.8524 3.44006 11.2 1.26006 8.86587 0.400057C8.46653 0.246723 8.03275 0.546723 8.03275 0.966723Z" fill="#ffffff"></path></svg>',
                OFF:
                    '<svg width="16px" height="16px" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.459229 3.66668V6.33335C0.459229 6.70001 0.769065 7.00001 1.14775 7.00001H3.21333L5.47857 9.19335C5.91234 9.61335 6.65595 9.31335 6.65595 8.72001V1.27334C6.65595 0.680012 5.91234 0.380012 5.47857 0.800012L3.21333 3.00001H1.14775C0.769065 3.00001 0.459229 3.30001 0.459229 3.66668Z" fill="#FFFFFF"></path></svg>',
            },
        },
        [HEADER_CTA.TALK_TO_HUMAN]: {
            id: 'km-talk-to-human',
            identifier: 'talkToHuman',
            name: HEADER_CTA['TALK_TO_HUMAN'],
            icon:
                '<svg width="20" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6666 0.756661H2.34163C1.42496 0.756661 0.674959 1.50666 0.674959 2.42333L0.666626 15.4067C0.666626 16.1483 1.56663 16.5233 2.09163 15.9983L3.99996 14.09H15.6666C16.5833 14.09 17.3333 13.34 17.3333 12.4233V2.42333C17.3333 1.50666 16.5833 0.756661 15.6666 0.756661ZM8.99996 4.08999C9.91663 4.08999 10.6666 4.83999 10.6666 5.75666C10.6666 6.67333 9.91663 7.42333 8.99996 7.42333C8.08329 7.42333 7.33329 6.67333 7.33329 5.75666C7.33329 4.83999 8.08329 4.08999 8.99996 4.08999ZM12.3333 10.7567H5.66663V10.2817C5.66663 9.60666 6.06663 9.00666 6.68329 8.74C7.39163 8.43166 8.17496 8.25666 8.99996 8.25666C9.82496 8.25666 10.6083 8.43166 11.3166 8.74C11.9333 9.00666 12.3333 9.60666 12.3333 10.2817V10.7567Z" fill="currentColor"></path></svg>',
        },
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
        KM_LOCK:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" fill="#112222"></path></svg>',
    },
    MINIMIZE_ICON:
        '<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.77083 1L5.00417 4.23333L8.2375 1C8.5625 0.675 9.0875 0.675 9.4125 1C9.7375 1.325 9.7375 1.85 9.4125 2.175L5.5875 6C5.2625 6.325 4.7375 6.325 4.4125 6L0.5875 2.175C0.2625 1.85 0.2625 1.325 0.5875 1C0.9125 0.683334 1.44583 0.675 1.77083 1Z" fill="white"/></svg>',
    ANSWER_FEEDBACK: {
        HELPFUL: 1,
        NOT_HELPFUL: 0,
        DISCARD: -1,
    },
    ANSWER_FEEDBACK_ICONS: {
        0: '<svg width="13" height="13" viewBox="0 0 13 13" class="km-answer-feedback-button" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 0.875L11.5 0.875C11.1563 0.875 10.875 1.15625 10.875 1.5L10.875 7.125C10.875 7.46875 11.1563 7.75 11.5 7.75L12.75 7.75L12.75 0.875ZM0.35625 5.325C0.287501 5.48125 0.250001 5.65 0.250001 5.825L0.25 6.5C0.25 7.1875 0.8125 7.75 1.5 7.75L4.9375 7.75L4.3625 10.6562C4.33125 10.7937 4.35 10.9437 4.4125 11.0687C4.55625 11.35 4.7375 11.6062 4.9625 11.8312L5.25 12.125L9.25625 8.11875C9.49375 7.88125 9.625 7.5625 9.625 7.23125L9.625 2.33125C9.625 1.53125 8.96875 0.875 8.1625 0.875L3.09375 0.874999C2.65625 0.874999 2.24375 1.10625 2.01875 1.48125L0.35625 5.325Z" fill="none"/></svg>',
        1: '<svg width="13" height="13" viewBox="0 0 13 13" class="km-answer-feedback-button" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.25 12.125H1.5C1.84375 12.125 2.125 11.8438 2.125 11.5V5.875C2.125 5.53125 1.84375 5.25 1.5 5.25H0.25V12.125ZM12.6438 7.675C12.7125 7.51875 12.75 7.35 12.75 7.175V6.5C12.75 5.8125 12.1875 5.25 11.5 5.25H8.0625L8.6375 2.34375C8.66875 2.20625 8.65 2.05625 8.5875 1.93125C8.44375 1.65 8.2625 1.39375 8.0375 1.16875L7.75 0.875L3.74375 4.88125C3.50625 5.11875 3.375 5.4375 3.375 5.76875V10.6687C3.375 11.4688 4.03125 12.125 4.8375 12.125H9.90625C10.3438 12.125 10.7563 11.8938 10.9812 11.5188L12.6438 7.675Z" fill="none"/></svg>',
    },
    BUSINESS_HOURS_PLANS: new Set([
        'trial',
        'business_monthly_v7',
        'business_yearly_v7',
        'business_monthly_v7_inr',
        'business_yearly_v7_inr',
        'business_monthly_v8',
        'business_yearly_v8',
        'business_monthly_v8_inr',
        'business_yearly_v8_inr',
    ]),
    PRODUCTS: {
        KOMMUNICATE: 'kommunicate',
        AGENTICFIRST: 'agenticFirst',
    },
};

/**
 * Kommunicate stores all Exposed functions to user.
 *
 */
Kommunicate = {
    settings: {},
    internetStatus: true,
    _globals: kommunicate._globals,
    PRODUCT_ID: kommunicate.PRODUCT_ID,
};
/**
 * stores all UI manipulation
 */
KommunicateUI = {};

/**all  utilities*/
KommunicateUtils = {
    getRandomId: function () {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    getProduct: function () {
        return MCK_ENV_DETAILS.PRODUCT;
    },
    isAgenticFirst: function () {
        return this.getProduct() == KommunicateConstants.PRODUCTS.AGENTICFIRST;
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
            var parentWindow = kmPluginVersion === 'v2' ? window.parent.document : window;
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
        var settings = appOptionSession.getPropertyDataFromSession('settings');
        settings = settings ? settings : null;
        return key && settings ? settings[key] : settings ? settings : '';
    },
    findCookieDomain: function (domain) {
        //reference : http://rossscrivener.co.uk/blog/javascript-get-domain-exclude-subdomain
        var i = 0;
        var parts = domain.split('.');
        var value = 'km_' + new Date().getTime();
        //check value is added in cookie else continue the iteration
        while (i < parts.length - 1 && document.cookie.indexOf(value + '=' + value) == -1) {
            //join the parts of domain
            domain = parts.slice(-1 - ++i).join('.');
            //set value in cookie
            document.cookie = value + '=' + value + ';domain=' + domain + ';';
        }
        //delete value from cookie
        document.cookie = value + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + domain + ';';
        return domain;
    },
    getSubDomain: function () {
        var hostName = parent.window.location.hostname;
        var domainLength = MCK_COOKIE_DOMAIN.length;
        var subDomain = hostName.substr(0, hostName.length - domainLength);
        return subDomain;
    },
    replaceOldCookies: function () {
        Object.values(KommunicateConstants.COOKIES).forEach((cookie) => {
            let cookieData = kmCookieStorage.getCookie(cookie, false, true);

            if (cookieData) {
                kmCookieStorage.deleteCookie(
                    {
                        name: cookie,
                        domain: MCK_COOKIE_DOMAIN,
                    },
                    true
                );
                kmCookieStorage.setCookie({
                    name: cookie,
                    value: cookieData,
                    expiresInDays: 30,
                    domain: MCK_COOKIE_DOMAIN,
                });
            }
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
    isActiveConversationNeedsToBeOpened: function (activeConversationInfo, data) {
        var userId = kmCookieStorage.getCookie(
            KommunicateConstants.COOKIES.KOMMUNICATE_LOGGED_IN_ID
        );
        return (
            activeConversationInfo &&
            typeof data != 'undefined' &&
            data.appId == activeConversationInfo.appId &&
            userId == activeConversationInfo.userId
        );
    },
    isURL: function (str) {
        try {
            var url = new URL(str);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (e) {
            return false;
        }
    },
    isYoutubeUrl: function (url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        var sanitized = url.trim();
        var origin = '';
        if (typeof window !== 'undefined' && window.location) {
            origin = window.location.origin;
        }
        try {
            var parsed = new URL(sanitized, origin || undefined);
            var hostname = parsed.hostname.toLowerCase();
            return (
                hostname === 'www.youtube.com' ||
                hostname === 'youtube.com' ||
                hostname === 'm.youtube.com' ||
                hostname === 'www.youtube-nocookie.com' ||
                hostname === 'youtube-nocookie.com' ||
                hostname === 'youtu.be'
            );
        } catch (error) {
            return /(?:^|\/\/)(?:www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(
                sanitized
            );
        }
    },
    getYoutubeWatchUrl: function (url) {
        if (!url || typeof url !== 'string') {
            return '';
        }
        var sanitized = url.trim();
        var origin = '';
        if (typeof window !== 'undefined' && window.location) {
            origin = window.location.origin;
        }
        try {
            var parsed = new URL(sanitized, origin || undefined);
            var hostname = parsed.hostname.toLowerCase();
            var pathname = parsed.pathname || '';
            var videoId = '';

            if (hostname === 'youtu.be') {
                videoId = pathname.replace(/^\//, '');
            } else if (
                hostname === 'www.youtube.com' ||
                hostname === 'youtube.com' ||
                hostname === 'm.youtube.com' ||
                hostname === 'youtube-nocookie.com' ||
                hostname === 'www.youtube-nocookie.com'
            ) {
                if (parsed.searchParams.has('v')) {
                    videoId = parsed.searchParams.get('v') || '';
                } else if (pathname.indexOf('/embed/') === 0 || pathname.indexOf('/v/') === 0) {
                    var pieces = pathname.split('/');
                    videoId = pieces.length > 2 ? pieces[2] : '';
                }
            }

            videoId = videoId.split('?')[0];
            videoId = videoId.split('#')[0];
            if (videoId) {
                return 'https://www.youtube.com/watch?v=' + videoId;
            }
        } catch (error) {
            // fall through
        }

        // Fallback: try extracting the video ID using a regex in case the URL parsing above failed.
        var fallbackMatch = sanitized.match(
            /(?:v=|\/embed\/|\/v\/|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );
        if (fallbackMatch && fallbackMatch[1]) {
            return 'https://www.youtube.com/watch?v=' + fallbackMatch[1];
        }
        return '';
    },
    isSafariBrowser: function () {
        if (typeof navigator === 'undefined') {
            return false;
        }
        var userAgent = navigator.userAgent || '';
        if (!userAgent) {
            return false;
        }
        var isSafari =
            /Safari/i.test(userAgent) &&
            !/(Chrome|CriOS|Chromium|Edg|OPR|FxiOS|SamsungBrowser)/i.test(userAgent);
        var isAndroid = /Android/i.test(userAgent);
        return isSafari && !isAndroid;
    },
    getBooleanOption: function (value, defaultValue) {
        return typeof value === 'boolean' ? value : defaultValue;
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
    isCurrentAssigneeBot: function () {
        if (CURRENT_GROUP_DATA.groupMembers && CURRENT_GROUP_DATA.groupMembers.length) {
            var currentConversationAssignee = {};
            for (var i = 0; i < CURRENT_GROUP_DATA.groupMembers.length; i++) {
                if (
                    CURRENT_GROUP_DATA.groupMembers[i] &&
                    CURRENT_GROUP_DATA.groupMembers[i].userId ==
                        CURRENT_GROUP_DATA.conversationAssignee
                ) {
                    currentConversationAssignee = CURRENT_GROUP_DATA.groupMembers[i];
                    break;
                }
            }

            if (currentConversationAssignee.hasOwnProperty('role')) {
                return (
                    currentConversationAssignee.role ===
                    KommunicateConstants.GROUP_ROLE.MODERATOR_OR_BOT
                );
            } else if (currentConversationAssignee.hasOwnProperty('roleType')) {
                return (
                    currentConversationAssignee.roleType ===
                    KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT
                );
            }
        }
        return false;
    },
    loadCryptoJS: async function (options = {}) {
        if (!(options.encryptionKey && options.encryptionType)) {
            console.debug("Encryption not enabled, can't load crypto-js");
            return;
        }

        await applozicSideBox.loadResourceAsync(THIRD_PARTY_SCRIPTS.crypto.js);
    },
    sendErrorToSentry: function (error) {
        if (!window.Sentry) return;
        Sentry.captureException(error);
    },
    lazyLoadSentryIntegration: async function (integration) {
        if (!window.Sentry) {
            console.debug('Sentry not available');
            return;
        }
        try {
            const integrationToAdd = await Sentry.lazyLoadIntegration(integration);
            Sentry.addIntegration(integrationToAdd());
        } catch (err) {
            console.error('Error while loading sentry integration', err);
        }
    },
    customElementSupported: function () {
        return 'customElements' in window && window.customElements.get('mck-html-rich-message');
    },
    getAndParseEml: async function (emlUrl) {
        try {
            const response = await fetch(emlUrl, {
                method: 'GET',
                // headers: {
                //     responseType: 'arraybuffer',
                // },
            });
            const emlData = await response.arrayBuffer();

            const data = await kmPostalMime.parse(emlData);
            return data;
        } catch (e) {
            throw e;
        }
    },
    downloadTableAsCSV: function (htmlString, filename = 'data.csv') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const table = doc.querySelector('table');

        if (!table) {
            return;
        }

        // Extract rows
        const rows = table.querySelectorAll('tr');
        const csv = [];

        rows.forEach((row) => {
            const cols = row.querySelectorAll('td, th');
            const rowData = Array.from(cols).map((col) => `"${col.textContent.trim()}"`);
            csv.push(rowData.join(','));
        });

        // Convert array to Blob and trigger download
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    normalizeMarkdown: function (text) {
        return text
            .replace(/\r\n/g, '\n') // Normalize line endings
            .split('\n')
            .map((line) => line.replace(/^\s*-\s*/, '- ').trimEnd()) // Trim right-side spaces
            .filter((line) => line !== '') // Remove empty lines
            .join('\n\n');
    },

    containsRawHTML: function (text) {
        return /<\/?[a-z][\s\S]*>/i.test(text);
    },
    validateFileExtension: function (file) {
        if (!file || !file.name) {
            return {
                isValid: false,
                errorMessage: 'Invalid file format. File must have an extension.',
            };
        }

        var fileName = file.name;
        var lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
            return {
                isValid: false,
                errorMessage: 'Invalid file format. File must have an extension.',
            };
        }

        var fileExtension = fileName.substring(lastDotIndex).toLowerCase();

        // Blocked extensions: scripts, executables, archives
        var blockedExtensions = [
            // Scripts & interpreted languages
            '.py',
            '.js',
            '.sh',
            '.bat',
            '.cmd',
            '.ps1',
            '.ps',
            '.rb',
            '.php',
            '.phtml',
            '.phar',
            '.pl',
            '.pm',
            '.lua',
            '.groovy',
            '.scala',
            '.r',
            '.tcl',
            '.vbs',
            '.vbe',
            '.ws',
            '.wsf',
            '.jsp',
            '.jspx',
            '.asp',
            '.aspx',
            '.cfm',
            '.hta',
            // Compiled executables & binaries
            '.exe',
            '.dll',
            '.so',
            '.dylib',
            '.out',
            '.elf',
            '.macho',
            '.app',
            '.run',
            '.bin',
            '.com',
            '.scr',
            '.cpl',
            '.sys',
            '.ocx',
            // Installers & packages
            '.msi',
            '.pkg',
            '.deb',
            '.rpm',
            '.appinstaller',
            '.jar',
            '.war',
            '.ear',
            '.jmod',
            '.class',
            '.apk',
            '.ipa',
            // Archives & compression formats
            '.zip',
            '.rar',
            '.7z',
            '.tar',
            '.gz',
            '.bz2',
            '.xz',
            '.cab',
            '.arj',
            '.lzh',
            '.zst',
            // Disk images & virtual machines
            '.iso',
            '.img',
            '.dmg',
            '.vhd',
            '.vhdx',
            '.vmdk',
            // Windows system / shortcut abuse
            '.lnk',
            '.msc',
            '.inf',
            '.reg',
            // Serialization / object injection
            '.ser',
            '.dat',
            '.pickle',
            '.pkl',
        ];

        // Check if the file extension is in the blocked list
        if (blockedExtensions.indexOf(fileExtension) !== -1) {
            return {
                isValid: false,
                errorMessage: "File type '" + fileExtension + "' is not allowed.",
            };
        }

        // If not blocked, allow the file
        return { isValid: true, errorMessage: null };
    },
};
