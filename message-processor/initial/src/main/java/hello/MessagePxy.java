/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author devashish
 */
package hello;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessagePxy implements Cloneable {

    
    private String key;

    private String oldKey;

    private String id;

    
    private String deviceKey;

    
    private String userKey;

    private String keyString;

    private String deviceKeyString;

    private String suUserKeyString;

    private String to;
    
    private String contactIds;

    private String fromUserName;

    private String emailIds;

    private String message;

    private boolean sent;

    private boolean delivered;

    private boolean read;

    private int deliveredValue;

    private boolean sendToDevice;

    private boolean shared;

    private Long createdAtTime;

    private Date createdAt;

    private Long oldTimestamp;

    private Long scheduledAt;
    
    
    private Short type = MessageType.MT_OUTBOX.getValue();

    
    private Short source;

    
    private Short status;

    private Integer timeToLive;

    
    private String pairedMessageKey;

    private String pairedMessageKeyString;
    
    private String fileMetaKey;

    private List<String> fileMetaKeyStrings;

    private String applicationKey;

    private Integer groupId;

    private String clientGroupId;
    
    private Integer conversationId;

    private Short contentType;

    private String senderName;
    
    private Map<String, String> metadata = new HashMap<>();
    
    private boolean alert = Boolean.TRUE;

    public MessagePxy(String message, String to, Long timeStamp) {
        this.message = message;
        this.to = to;
        this.oldTimestamp = timeStamp;
        this.createdAtTime = timeStamp;
    }

    public MessagePxy() {
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getDeviceKey() {
        return deviceKey;
    }

    public void setDeviceKey(String deviceKey) {
        this.deviceKey = deviceKey;
    }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getContactIds() {
        return contactIds;
    }

    public void setContactIds(String contactIds) {
        this.contactIds = contactIds;
    }

    public String getEmailIds() {
        return emailIds;
    }

    public void setEmailIds(String emailIds) {
        this.emailIds = emailIds;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        try {
            if (message == null || message.length() == 0) {
                return;
            }
            this.message = new String(message.getBytes("UTF-8"), "UTF-8");
        } catch (Exception e) {
            this.message = message;
            System.out.println("Error converting message to UTF-8");
            e.printStackTrace();
        }
    }

    public boolean isSent() {
        return this.sent;
    }

    public boolean isDelivered() {
        return this.delivered;
    }

    public boolean isRead() {
        return this.read;
    }

    public boolean isSendToDevice() {
        return sendToDevice;
    }

    public void setSendToDevice(boolean sendToDevice) {
        this.sendToDevice = sendToDevice;
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
    }

    @JsonIgnore
    public Date getCreatedAt() {
        return createdAt;
    }

    public Long getCreatedAtMillis() {
        return createdAt != null ? createdAt.getTime() : null;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getCreatedAtTime() {
        return createdAtTime;
    }

    public void setCreatedAtTime(Long createdAtTime) {
        this.createdAtTime = createdAtTime;
    }

    public Long getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Long scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public Short getType() {
        return type;
    }

    public void setType(Short type) {
        this.type = type;
    }

    public Short getSource() {
        return source;
    }

    public void setSource(Short source) {
        this.source = source;
    }

    public Short getStatus() {
        return status;
    }

    public String getFromUserName() {
        return fromUserName;
    }

    public void setFromUserName(String fromUserName) {
        this.fromUserName = fromUserName;
    }

    public void setStatus(Short status) {
        this.status = status;
        this.sent = this.status == StatusType.SENT.getValue();
        this.delivered = this.status == StatusType.DELIVERED.getValue() || this.status == StatusType.DELIVERED_AND_READ.getValue();
        this.read = this.status == StatusType.READ.getValue();
    }

    public Integer getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(Integer timeToLive) {
        this.timeToLive = timeToLive;
    }

    public String getPairedMessageKey() {
        return pairedMessageKey;
    }

    public void setPairedMessageKey(String pairedMessageKey) {
        this.pairedMessageKey = pairedMessageKey;
    }

    public String getFileMetaKey() {
        return fileMetaKey;
    }

    public void setFileMetaKey(String fileMetaKey) {
        this.fileMetaKey = fileMetaKey;
    }

    public String getApplicationKey() {
        return applicationKey;
    }

    public void setApplicationKey(String applicationKey) {
        this.applicationKey = applicationKey;
    }

    public String getKeyString() {
        return keyString;
    }

    public void setKeyString(String keyString) {
        this.keyString = keyString;
    }

    public String getDeviceKeyString() {
        return deviceKeyString;
    }

    public void setDeviceKeyString(String deviceKeyString) {
        this.deviceKeyString = deviceKeyString;
    }

    public String getSuUserKeyString() {
        return suUserKeyString;
    }

    public void setSuUserKeyString(String suUserKeyString) {
        this.suUserKeyString = suUserKeyString;
    }

    public String getPairedMessageKeyString() {
        return pairedMessageKeyString;
    }

    public void setPairedMessageKeyString(String pairedMessageKeyString) {
        this.pairedMessageKeyString = pairedMessageKeyString;
    }

    public List<String> getFileMetaKeyStrings() {
        return fileMetaKeyStrings;
    }

    public void setFileMetaKeyStrings(List<String> fileMetaKeyStrings) {
        this.fileMetaKeyStrings = fileMetaKeyStrings;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Short getContentType() {
        return contentType;
    }

    public void setContentType(Short contentType) {
        this.contentType = contentType;
    }

    public boolean isTypeOutbox() {
        return MessageType.OUTBOX.getValue().equals(type) || MessageType.MT_OUTBOX.getValue().equals(type);
    }

    public boolean isSending() {
        return MessageType.OUTBOX.getValue().equals(type) || MessageType.OUTBOX_SENT_FROM_DEVICE.getValue().equals(type) || MessageType.MT_OUTBOX.getValue()
                .equals(type);
    }

    public boolean isNotificationToDeviceRequired() {
        return (MessageType.OUTBOX.getValue().equals(type) || MessageType.MT_OUTBOX.getValue().equals(type) || MessageType.MT_INBOX.getValue().equals(type));
    }

    public int getDeliveredValue() {
        return deliveredValue;
    }

    public void setDeliveredValue(int deliveredValue) {
        this.deliveredValue = deliveredValue;
        this.delivered = deliveredValue > 0 ? true : false;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    
    public Long getOldTimestamp() {
        return oldTimestamp;
    }

    public void setOldTimestamp(Long oldTimestamp) {
        this.oldTimestamp = oldTimestamp;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getClientGroupId() {
        return clientGroupId;
    }

    public void setClientGroupId(String clientGroupId) {
        this.clientGroupId = clientGroupId;
    }

    public String getOldKey() {
        return oldKey;
    }

    public void setOldKey(String oldKey) {
        this.oldKey = oldKey;
    }

    public boolean isAlert() {
        return alert;
    }

    public void setAlert(boolean alert) {
        this.alert = alert;
    }

    
    public MessagePxy clone() {
        MessagePxy messagePxy = new MessagePxy();
        messagePxy.setKey(this.getKey());
        messagePxy.setId(this.getId());
        messagePxy.setDeviceKey(this.getDeviceKey());
        messagePxy.setUserKey(this.getUserKey());
        messagePxy.setKeyString(this.getKeyString());
        messagePxy.setDeviceKeyString(this.getDeviceKeyString());
        messagePxy.setSuUserKeyString(this.getSuUserKeyString());
        messagePxy.setTo(this.getTo());
        messagePxy.setContactIds(this.getContactIds());
        messagePxy.setFromUserName(this.getFromUserName());
        messagePxy.setEmailIds(this.getEmailIds());
        messagePxy.setMessage(this.getMessage());
        messagePxy.setDeliveredValue(this.getDeliveredValue());
        messagePxy.setDeliveredValue(this.getDeliveredValue());
        messagePxy.setCreatedAtTime(this.getCreatedAtTime());
        messagePxy.setCreatedAt(this.getCreatedAt());
        messagePxy.setOldTimestamp(this.getOldTimestamp());
        messagePxy.setScheduledAt(this.getScheduledAt());
        messagePxy.setType(this.getType());
        messagePxy.setSource(this.getSource());
        messagePxy.setStatus(this.getStatus());
        messagePxy.setTimeToLive(this.getTimeToLive());
        messagePxy.setPairedMessageKey(this.getPairedMessageKey());
        messagePxy.setPairedMessageKeyString(this.getPairedMessageKeyString());
        messagePxy.setFileMetaKey(this.getFileMetaKey());
        messagePxy.setFileMetaKeyStrings(this.getFileMetaKeyStrings());
        messagePxy.setApplicationKey(this.getApplicationKey());
        messagePxy.setGroupId(this.getGroupId());
        messagePxy.setClientGroupId(this.getClientGroupId());
        messagePxy.setConversationId(this.getConversationId());
        messagePxy.setContentType(this.getContentType());
        messagePxy.setSenderName(this.getSenderName());
        messagePxy.setOldKey(this.getOldKey());
        messagePxy.setMetadata(this.getMetadata());
        messagePxy.setAlert(this.isAlert());
        return messagePxy;
    }

    @Override
    public String toString() {
        return "MessagePxy{" + "key=" + key + ", id=" + id + ", deviceKey=" + deviceKey + ", userKey=" + userKey + ", keyString=" + keyString
               + ", deviceKeyString=" + deviceKeyString + ", suUserKeyString=" + suUserKeyString + ", to=" + to + ", contactIds=" + contactIds
               + ", fromUserName=" + fromUserName + ", emailIds=" + emailIds + ", message=" + message + ", sent=" + sent + ", delivered=" + delivered
               + ", read=" + read + ", deliveredValue=" + deliveredValue + ", sendToDevice=" + sendToDevice + ", shared=" + shared + ", createdAtTime="
               + createdAtTime + ", createdAt=" + createdAt + ", oldTimestamp=" + oldTimestamp + ", scheduledAt=" + scheduledAt + ", type=" + type + ", source="
               + source + ", status=" + status + ", timeToLive=" + timeToLive + ", pairedMessageKey=" + pairedMessageKey + ", pairedMessageKeyString="
               + pairedMessageKeyString + ", fileMetaKey=" + fileMetaKey + ", fileMetaKeyStrings=" + fileMetaKeyStrings + ", applicationKey=" + applicationKey
               + ", groupId=" + groupId + ", clientGroupId=" + clientGroupId + ", conversationId="
               + conversationId + ", contentType=" + contentType + ", senderName=" + senderName + ", metadata="
               + metadata + '}';
    }
}

