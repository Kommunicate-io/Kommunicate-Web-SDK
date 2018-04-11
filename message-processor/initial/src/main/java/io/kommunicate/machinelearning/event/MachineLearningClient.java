package io.kommunicate.machinelearning.event;

/**
 *
 * @author devashish
 */
import com.applozic.message.MessagePxy;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class MachineLearningClient {
    
    private static final Logger LOG = LoggerFactory.getLogger(MachineLearningClient.class.getName());

    private static final String EVENT_SERVER_URL = "https://machine.kommunicate.io/events/events.json?accessKey=vE5gvXzmCpBEvp1Rcbr0pukECUZpJMbCeRStber1PsiuRdSjIzyizi7HiqHKcPts";

    @Autowired
    private ObjectMapper objectMapper;
    
    /*
            curl -i -X POST https://machine.kommunicate.io/events/events.json?accessKey=vE5gvXzmCpBEvp1Rcbr0pukECUZpJMbCeRStber1PsiuRdSjIzyizi7HiqHKcPts \
-H "Content-Type: application/json" \
-d '{"eventTime": "2015-06-08T16:46:08.590+0000", "entityId": 9, "properties":
{"text": "Not receiving messages", "label": "5"}
, "event": "chat", "entityType": "content"}' */
    
    public String sendEvent(MessagePxy messagePxy) {
        try {
            Properties properties = objectMapper.readValue(messagePxy.getMetadata().get("KM_ML_01"), Properties.class);

            Event event = new Event();
            //Todo: check why messagPxy.getUserKey() is failing.
            event.setEntityId("" + messagePxy.getUserKey().hashCode());
            LOG.debug("Sender: " + messagePxy.getUserKey());
            event.setProperties(properties);
            
            return post(objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException ex) {
            LOG.error("JsonProcessingException during sending event.", ex);
        } catch (IOException ex) {
            LOG.error("IOException during sending event.", ex);
        }
        return "error";
    }
    
    public String post(String data) {
        LOG.info("Sending data to machine learning server: " + data);
        HttpClient httpClient = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(EVENT_SERVER_URL);
        ResponseHandler<String> responseHandler = new BasicResponseHandler();
        String responseBody = null;
        try {
            StringEntity stringEntity = new StringEntity(data);
            httpPost.setEntity(stringEntity);
            httpPost.setHeader("Content-Type", "application/json");
            responseHandler = new BasicResponseHandler();
            responseBody = httpClient.execute(httpPost, responseHandler);
            LOG.info("Response from event server: " + responseBody);
        } catch (IOException ex) {
            LOG.error("IOException from " + EVENT_SERVER_URL + " with " + data, ex);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return responseBody;
    }
    
    public String insertIntoKnowledgeBase(Event event) {
        //https://api-test.kommunicate.io/autosuggest/message
        //{"applicationId":"3190ea118ed9eb01319ef0a19310a3e54","userName":"devashish+11apr@applozic.com","name":"where is the new faq?","content":"here","category":"faq","type":"faq","status":"published"}
        
        Knowledge knowledge = new Knowledge();
        
        return "success";
    }
}
