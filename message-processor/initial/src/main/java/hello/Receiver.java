/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hello;

/**
 *
 * @author devashish
 */
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.stereotype.Component;

@Component
public class Receiver {

    private CountDownLatch latch = new CountDownLatch(1);
    private ObjectMapper objectMapper = new ObjectMapper();
    
    public Receiver() {
        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
    }
     
    public void receiveMessage(byte[] bytes) {
        try {
            String str = new String(bytes);
            if (str.startsWith("{\"id\"")) {
                InstantMessage instantMessage = objectMapper.readValue(str, InstantMessage.class);
                
                if (InstantMessage.NOTIFICATION_TYPE.MESSAGE_SENT.getValue().equals(instantMessage.getType())) {
                    
                    MessagePxy messagePxy = objectMapper.readValue(objectMapper.writeValueAsString(instantMessage.getMessage()), MessagePxy.class); 
                    System.out.println("###messagePxy: " + messagePxy);
                    
                    Map<String, String> metadata = messagePxy.getMetadata();
                    
                    if (metadata != null && !metadata.isEmpty() && metadata.containsKey("KM_ML_01")) {
                        System.out.println("#Found machine learning data: " + metadata.containsKey("KM_ML_01"));
                        //Todo: call event server from here.
                    }
                }
            }
        } catch (IOException ex) {
            Logger.getLogger(Receiver.class.getName()).log(Level.SEVERE, null, ex);
        }
     }

    public void receiveMessage(Object message) {
        //System.out.println(message.getClass().toString());
        //System.out.println("Received <" + message + ">");

        latch.countDown();
    }

    public CountDownLatch getLatch() {
        return latch;
    }

}
