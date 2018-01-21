/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
