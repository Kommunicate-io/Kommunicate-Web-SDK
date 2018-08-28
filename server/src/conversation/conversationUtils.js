function GroupInfo() {
    this.groupName = "";
    this.type = 10;
    this.admin = "agentId";
    this.users = [{ userId: "agentId", groupRole: 1 }, { userId: "user", groupRole: 3 }, { userId: "bot", groupRole: 2 }];
    this.metadata = {
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
        HIDE: "true",
        WELCOME_MESSAGE: ""
    };
};
module.exports = GroupInfo;