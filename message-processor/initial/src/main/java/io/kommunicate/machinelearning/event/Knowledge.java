/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.kommunicate.machinelearning.event;

/**
 *
 * @author devashish
 */
public class Knowledge {
    //{"applicationId":"3190ea118ed9eb01319ef0a19310a3e54","userName":"devashish+11apr@applozic.com","name":"where is the new faq?","content":"here","category":"faq","type":"faq","status":"published"}
    private String applicationId;
    private String userName;
    private String name;
    private String content;
    private String category;
    private String type;
    private String status;

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    
}
