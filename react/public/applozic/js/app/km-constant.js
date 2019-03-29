KOMMUNICATE_CONSTANTS = {
    CONVERSATION_STATE: {
        INITIAL: -1,
        OPEN: 0,
        PROGRESS: 1,
        CLOSED: 2,
        SPAM: 3,
        DUPLICATE: 4,
        ARCHIVE: 5,
        UNRESPONDED: 6
    },
     OPEN_CONVERSATION_ARRAY : ["-1", "0", "6", "1"],
     CLOSED_CONVERSATION_ARRAY : ["2", "3", "4", "5"],
     CONVERSATION_TAB_VIEW_MAP : {
        'km-conversation': 'km-allconversation',
        'km-assigned': 'km-assigned',
        'km-closed': 'km-closed'
    },
    CONVERSATION_STATUS :{
        'Open': 0,
        'Resolved':2,
        'Spam/Irrelevant':3,
        'Duplicate':4
    },
      ROLE_IN_GROUP: {
        USER: 0,
        ADMIN: 1,
        MODERATOR: 2,
        MEMBER: 3
     },
     ACTIONABLE_MESSAGE_TEMPLATE: {
        ROOM_COUNT:"1",
        HOTEL_BOOKING_CARD:"2",
        LINK_BUTTON:"3",
        ROOM_DETAIL:"4",
        PASSENGER_DETAIL:"5",
        QUICK_REPLY:"6",
        LIST:"7",
        DIALOG_BOX:"8",
        IMAGE:"9",
        CARD_CAROUSEL:"10"
    },
    GROUP_ACTION:{
        CREATE:0,
        ADD_MEMBER:1,
        REMOVE_MEMBER:2,
        LEFT:3,
        DELETE_GROUP:4,
        CHANGE_GROUP_NAME:5,
        CHANGE_IMAGE_URL:6,
        JOIN:7,
        GROUP_USER_ROLE_UPDATED:8,
        GROUP_META_DATA_UPDATED:9
    },
    CONVERSATION_TYPE:{
        //only used for UI purpose
        ALL : 0,
        ASSIGNED_TO_ME: 1,
        CLOSED: 2
    },
    RELEASE_DATE: "2019-03-20",
    // user role 
    USER_ROLE_TYPE:{
        APPLOZIC:{
            ADMIN: 4,
            APPLICATION_ADMIN: 2,
            APPLICATION_WEB_ADMIN:8,
            USER : 3,
            BOT: 1,
            DEVELOPER:11,
            BUSINESS:5,
            APPLICATION_BROADCASTER:6,
            SUPPORT:7
        },
        KOMMUNICATE: {
            SUPER_ADMIN : 0,
            ADMIN : 1,
            AGENT : 2,
            BOT : 3,
        } 
    }
}