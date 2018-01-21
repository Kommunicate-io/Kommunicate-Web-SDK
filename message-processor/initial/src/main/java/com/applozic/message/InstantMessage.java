package com.applozic.message;

import java.util.HashMap;
import java.util.Map;

public class InstantMessage implements Cloneable {

    public static final String NOTIFICATION_TYPE_PREPEND_TEXT = "APPLOZIC_";

    public static enum TYPE {
        MESSAGE_RECEIVED("M.R"),
        MT_MESSAGE_SENT("M.M.S"),
        MT_MESSAGE_SENT_UPDATE("M.M.S.U"),
        MESSAGE_DELIVERED("M.D"),
        MT_MESSAGE_DELETED("M.M.D"),
        MT_CONTACT_SYNC_COMPLETED("M.C.S.C"),
        MT_DEVICE_CONTACT_SYNC_COMPLETED("M.D.C.S.C"),
        MT_LOGOUT("M.L"),
        MT_RENEW_OAUTH_TOKEN("M.R.O.T"),
        MT_CONTACT_VERIFIED("M.C.V"),
        MT_DEVICE_REGISTERED("M.D.R"),
        MT_CONVERSATION_DELETED("M.C.D"),
        MT_DISPLAY_CALLS("M.D.C"),
        MT_DELIVERED_MT("M.D.M.T"),
        MT_GROUP_DELETED("M.G.D"),
        MT_GROUP_LEFT("M.G.L"),
        MT_MESSAGE_READ("M.M.R"),
        MT_MESSAGE_DELIVERED_READ("M.M.D.R"),
        MT_CONVERSATION_READ("M.C.R"),
        MT_CONVERSATION_DELIVERED_AND_READ("M.C.D.R"),
        MT_USER_CONNECTED("M.U.C"),
        MT_USER_DISCONNECTED("M.U.D");

        private String value;

        private TYPE(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

    };

    public static enum NOTIFICATION_TYPE {
        MESSAGE_RECEIVED("01"),
        MESSAGE_SENT("02"),
        MESSAGE_SENT_UPDATE("03"),
        MESSAGE_DELIVERED("04"),
        MESSAGE_DELETED("05"),
        CONVERSATION_DELETED("06"),
        MESSAGE_READ("07"),
        MESSAGE_DELIVERED_AND_READ("08"),
        CONVERSATION_READ("09"),
        CONVERSATION_DELIVERED_AND_READ("10"),
        USER_CONNECTED("11"),
        USER_DISCONNECTED("12"),
        GROUP_DELETED("13"),
        GROUP_LEFT("14"),
        GROUP_SYNC("15"),
        USER_BLOCKED("16"),
        USER_UNBLOCKED("17"),
        ACTIVATED("18"),
        DEACTIVATED("19"),
        REGISTRATION("20"),
        GROUP_CONVERSATION_READ("21"),
        GROUP_MESSAGE_DELETED("22"),
        GROUP_CONVERSATION_DELETED("23"),
        APPLOZIC_TEST("24"),
        USER_ONLINE_STATUS("25"),
        CONTACT_SYNC("26"),
        CONVERSATION_DELETED_NEW("27"),
        CONVERSATION_DELIVERED_AND_READ_NEW("28"),
        CONVERSATION_READ_NEW("29"),
        USER_INFO_UPDATED("30"),
        BROADCAST_MESSAGE_DELIVERED("31"),
        BROADCAST_MESSAGE_DELIVERED_AND_READ("32"),
        MESSAGE_META_DATA_UPDATE("33"),
        USER_DELETED("34"),
        LOGOUT_FROM_ALL_DEVICE("35"),
        PROMOTIONAL_MESSAGE("36"),
        USER_MUTE_IN_ONE_TO_ONE("37");

        private String value;

        private NOTIFICATION_TYPE(String c) {
            value = c;
        }

        public String getValue() {
            return NOTIFICATION_TYPE_PREPEND_TEXT + String.valueOf(value);
        }
    };

    public static enum REQUEST_SOURCE {

        WEB(Short.valueOf("0")),
        MOBILE_APP(Short.valueOf("1"));

        private Short value;

        private REQUEST_SOURCE(Short c) {
            value = c;
        }

        public Short getValue() {
            return value;
        }
    };

    private String id;
    private String type;
    private Object message;
    private boolean notifyUser = true;
    private int totalUnreadCount;
    private boolean sendAlert = false;
    private Map messageMetaData = new HashMap<>();

    public InstantMessage() {
    }

    public InstantMessage(String type, Object message) {
        this.type = type;
        this.message = message;
    }

    public InstantMessage(String type, Object message, boolean notifyUser) {
        this.type = type;
        this.message = message;
        this.notifyUser = notifyUser;
    }

    public InstantMessage(String type, Object message, boolean notifyUser, int totalUnreadCount) {
        this.type = type;
        this.message = message;
        this.notifyUser = notifyUser;
        this.totalUnreadCount = totalUnreadCount;
    }

    /*
     public static enum Type {
     SMS_RECEIVED(new Short("0")), UPDATE_SENT_FLAG(new Short("1"));
    
     private Short value;
    
     private Type(Short c) {
     value = c;
     }
    
     public Short getValue() {
     return value;
     }
     };*/
    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isNotifyUser() {
        return notifyUser;
    }

    public void setNotifyUser(boolean notifyUser) {
        this.notifyUser = notifyUser;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public InstantMessage clone() {
        InstantMessage instantMessage = new InstantMessage();

        instantMessage.setMessage(message);
        
        instantMessage.setType(type);
        instantMessage.setNotifyUser(notifyUser);
        instantMessage.setId(id);
        instantMessage.setTotalUnreadCount(totalUnreadCount);
        instantMessage.setSendAlert(isSendAlert());
        instantMessage.setMessageMetaData(messageMetaData);
        return instantMessage;
    }

    public int getTotalUnreadCount() {
        return totalUnreadCount;
    }

    public void setTotalUnreadCount(int totalUnreadCount) {
        this.totalUnreadCount = totalUnreadCount;
    }

    public boolean isNotificationRelatedToMessage() {
        return NOTIFICATION_TYPE.MESSAGE_RECEIVED.toString().equals(getType()) || NOTIFICATION_TYPE.MESSAGE_SENT.toString().equals(getType())
                || NOTIFICATION_TYPE.MESSAGE_RECEIVED.getValue().equals(getType()) || NOTIFICATION_TYPE.MESSAGE_SENT.getValue().equals(getType());
    }

    public boolean isSendAlert() {
        return sendAlert;
    }

    public void setSendAlert(boolean sendAlert) {
        this.sendAlert = sendAlert;
    }

    public Map getMessageMetaData() {
        return messageMetaData;
    }

    public void setMessageMetaData(Map messageMetaData) {
        this.messageMetaData = messageMetaData;
    }

}
