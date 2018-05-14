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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Component;


@Component
@PropertySources({
    @PropertySource("classpath:application.properties"),
    @PropertySource(value = "classpath:application-${ws.properties}.properties", ignoreResourceNotFound = true),
    @PropertySource(value = "file:${conf_dir}/application.properties", ignoreResourceNotFound = true)    
    })
public class MachineLearningClient {
    
    private static final Logger LOG = LoggerFactory.getLogger(MachineLearningClient.class.getName());

    private static final String EVENT_SERVER_URL = "https://machine.kommunicate.io/events/events.json?accessKey=vE5gvXzmCpBEvp1Rcbr0pukECUZpJMbCeRStber1PsiuRdSjIzyizi7HiqHKcPts";

    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${kommunicate.api.url}")
    private String API_URL = "https://api-test.kommunicate.io";
    
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
            
            //return post(EVENT_SERVER_URL, objectMapper.writeValueAsString(event));
            return insertIntoKnowledgeBase(properties, messagePxy);
        } catch (JsonProcessingException ex) {
            LOG.error("JsonProcessingException during sending event.", ex);
        } catch (IOException ex) {
            LOG.error("IOException during sending event.", ex);
        }
        return "error";
    }
    
    public String insertIntoKnowledgeBase(Properties properties, MessagePxy message) throws JsonProcessingException {
        //https://api-test.kommunicate.io/autosuggest/message
        //{"applicationId":"3190ea118ed9eb01319ef0a19310a3e54","userName":"devashish+11apr@applozic.com","name":"where is the new faq?","content":"here","category":"faq","type":"faq","status":"published"}
        
        Knowledge knowledge = new Knowledge();
        knowledge.setApplicationId(properties.getAppId());
        knowledge.setCategory("train");
        knowledge.setReferenceId(properties.getLabel());
        knowledge.setName(properties.getText());
        //Todo: change it to draft once training and filter UI is ready
        knowledge.setStatus("published");
        knowledge.setType("train");
        knowledge.setUserName(message.getSenderName());
        
        return post(API_URL + "/autosuggest/message", objectMapper.writeValueAsString(knowledge));
    }
    
    public String post(String url, String data) {
        LOG.info("Sending data to machine learning server: " + data);
        HttpClient httpClient = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(url);
        ResponseHandler<String> responseHandler = new BasicResponseHandler();
        String responseBody = null;
        try {
            StringEntity stringEntity = new StringEntity(data);
            httpPost.setEntity(stringEntity);
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Content-Type", "application/json");
            responseHandler = new BasicResponseHandler();
            responseBody = httpClient.execute(httpPost, responseHandler);
            LOG.info("Response from event server: " + responseBody);
        } catch (IOException ex) {
            LOG.error("IOException from " + url + " with " + data, ex);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return responseBody;
    }
    
}
