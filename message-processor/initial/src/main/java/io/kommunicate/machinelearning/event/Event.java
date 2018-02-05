package io.kommunicate.machinelearning.event;

/**
 *
 * @author devashish
 */

/*{"eventTime": "2015-06-08T16:46:08.590+0000", "entityId": 9, "properties":
{"text": "Not receiving messages", "label": "5"}
, "event": "chat", "entityType": "content"}*/

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.util.Date;

public class Event implements Serializable {
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'hh:mm:ssZ")
    private Date eventTime;
    private String entityId;
    private String event = "chat";
    private String entityType = "contentType";
    private Properties properties;
    
    public Event() {
        this.eventTime = new Date();
    }

    public Date getEventTime() {
        return eventTime;
    }

    public void setEventTime(Date eventTime) {
        this.eventTime = eventTime;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }
    
}
