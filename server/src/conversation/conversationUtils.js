exports.CONVERSATION_STATUS={ "OPEN":"OPEN","ASSIGNED":"ASSIGNED","CLOSED":"CLOSED","SPAM":"SPAM","REOPENED":"REOPENED"};
exports.CONVERSATION_STATUS_ARRAY=["OPEN","ASSIGNED","CLOSED","SPAM","REOPENED"];
exports.GROUP_INFO = {
    groupName: "",
    type: 10,
    admin: "agentId",
    users: [{userId:"agentId",groupRole:1}, {userId:"user",groupRole:3}, {userId:"bot",groupRole:2}],
    metadata: {
        CREATE_GROUP_MESSAGE: "",
        REMOVE_MEMBER_MESSAGE: "",
        ADD_MEMBER_MESSAGE: "",
        JOIN_MEMBER_MESSAGE: "",
        GROUP_NAME_CHANGE_MESSAGE: "",
        GROUP_ICON_CHANGE_MESSAGE: "",
        GROUP_LEFT_MESSAGE: "",
        CONVERSATION_STATUS: 0,
        DELETED_GROUP_MESSAGE: "",
        GROUP_USER_ROLE_UPDATED_MESSAGE: "",
        GROUP_META_DATA_UPDATED_MESSAGE: "",
        CONVERSATION_ASSIGNEE: "agentId",
        KM_CONVERSATION_TITLE: "agentId",
        HIDE: "true"
    }
}