export default {
    applozic: {
        SEND_MESSAGE: "/rest/ws/message/v2/send",
        SEND_MAIL: "/rest/ws/mail/send",
        USER_DETAILS: "/rest/ws/user/v2/detail?v=2.1",
        REGISTER_CLIENT: "/rest/ws/register/client",
        STATS: "/rest/ws/stats/get?appKey=:appKey",
        APPLICATION_LIST: "/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN",
        CIRTIFICATE_UPLOAD: "/rest/ws/file/upload/cert",
        EDIT_APP_MODULE: "/rest/ws/appmodule/edit",
        STATUS_FILTER: "/rest/ws/stats/filter?appKey=:appKey",
        DEV_URL: "/rest/ws/v2/invite/dev",
        CREATE_APPLOZIC_USER: '/rest/ws/user/v2/create',
        UPDATE_APPLOZIC_USER: '/rest/ws/user/update',
        CONTACT_LIST_URL:"/rest/ws/user/v3/filter",
        GROUP_FEED_URL : "/rest/ws/group/info",
        MULTIPLE_GROUP_INFO : "/rest/ws/group/v3/info",
        EDIT_APPLICATION:"/rest/ws/application/v2/edit",
        SEARCH_USER:"/rest/ws/user/search/contact",
        GET_MESSAGE_LIST: "/rest/ws/message/list",
        GROUP_ALL: "/rest/ws/group/all",
        CUSTOMER_INFO: "/rest/ws/application/customer/info",
        ACTIVATE_DEACTIVATE_USER: "/rest/ws/user/update/status",
        DELETE_USER: "/rest/ws/user/delete"
    }, 
    kommunicateApi: {
        LOGIN: "/login",
        SIGN_UP: "/customers",
        PASSWORD_RESET: "/users/password-reset",
        PASSWORD_UPDATE: "/users/password-update",
        PLUGIN_URL: "/kommunicate.app",
        PLUGIN_URL_V2 : "/v2/kommunicate.app",
        SIGN_UP_APPLOZIC: "/signUpWithApplozic",
        CREATE_USER: "/users",
        LOGO: "/img/logo1.png",
        SEND_MAIL: "/misc/invite/mail",
        AUTO_SUGGEST: "/autosuggest/message",
        PROFILE_IMAGE: "/profileImage",
        SUBSCRIPTION_COUNT: '/subscription/count',
        AUTO_REPLY: "/users/",
        TIME_ZONE: '/misc/tz',
        METABASE: '/metabase',
    },
    botplateform: {
        ADD_BOT_URL: '/bot'
    },
    dashboard:{
        ACTIVATE_ACCOUNT: "/register?invite=true&applicationId=:applicationId"
    },
    kommunicateWebsite: {
        KM_WEBSITE_CONVERSATIONS_TEST: "/test"
    }
}