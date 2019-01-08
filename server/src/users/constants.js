exports.AVAIBILITY_STATUS = { "AVAILABLE": 1, "AWAY": 2 }
exports.ROLE_TYPE = { "SUPER_ADMIN": 0, "ADMIN": 1, "AGENT": 2, "BOT": 3, "DEVELOPER": 11 };

exports.APPLOZIC_USER_ROLE_TYPE = {
    BOT: {id: 1, name: "BOT"},
    APPLICATION_ADMIN: {id: 2, name: "APPLICATION_ADMIN"},
    USER:{id: 3, name: "USER"},
    ADMIN:{id: 4, name: "ADMIN"},
    BUSINESS:{id: 5, name: "BUSINESS"},
    APPLICATION_BROADCASTER:{id: 6, name: "APPLICATION_BROADCASTER"},
    SUPPORT:{id: 7, name: "SUPPORT"},
    APPLICATION_WEB_ADMIN:{id: 8, name: "APPLICATION_WEB_ADMIN"},
    DEVELOPER: {id: 11, name: "DEVELOPER"}
};

exports.EMAIL_NOTIFY = { "UNSUBSCRIBE_ALL": 0, "SUBSCRIBE_ALL": 1, "ONLY_ASSIGNED_CONVERSATION": 4 };
exports. USER_STATUS = {
    AWAY:0,
    ONLINE:1,
    EXPIRED:2,
    DELETED:3
}

/* 
At the moment the only social service we're using for login is google, in future if we add 
other services please add below.
*/
exports.THIRD_PARTY_LOGIN = [
    "google"
];