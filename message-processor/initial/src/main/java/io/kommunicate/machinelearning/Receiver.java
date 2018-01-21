package io.kommunicate.machinelearning;

/**
 *
 * @author devashish
 */
import com.applozic.message.InstantMessage;
import com.applozic.message.MessagePxy;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.kommunicate.machinelearning.event.MachineLearningClient;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Receiver {
    
    private static final Logger LOG = LoggerFactory.getLogger(Receiver.class.getName());

    private CountDownLatch latch = new CountDownLatch(1);
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private MachineLearningClient machineLearningClient;
    
    public Receiver() {
    }
     
    public void receiveMessage(byte[] bytes) {
        try {
            String str = new String(bytes);
            if (str.startsWith("{\"id\"")) {
                InstantMessage instantMessage = objectMapper.readValue(str, InstantMessage.class);
                
                if (InstantMessage.NOTIFICATION_TYPE.MESSAGE_SENT.getValue().equals(instantMessage.getType())) {
                    
                    MessagePxy messagePxy = objectMapper.readValue(objectMapper.writeValueAsString(instantMessage.getMessage()), MessagePxy.class); 
                    LOG.debug("messagePxy: " + messagePxy);
                    
                    Map<String, String> metadata = messagePxy.getMetadata();
                    
                    if (metadata != null && !metadata.isEmpty() && metadata.containsKey("KM_ML_01")) {
                        LOG.info("Found machine learning data: " + metadata.get("KM_ML_01"));
                        machineLearningClient.sendEvent(messagePxy);
                    }
                }
            }
        } catch (IOException ex) {
            LOG.error("Exception while processing message", ex);
        }
     }

    public void receiveMessage(Object message) {
        LOG.debug("Receive <" + message + ">");
        latch.countDown();
    }

    public CountDownLatch getLatch() {
        return latch;
    }

}
