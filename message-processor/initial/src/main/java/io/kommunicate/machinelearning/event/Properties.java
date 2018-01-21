package io.kommunicate.machinelearning.event;

import java.io.Serializable;

/**
 *
 * @author devashish
 */
public class Properties implements Serializable {
    
    public Properties() {
        
    }
    
    private String text;
    private String label;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
    
}
