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
import io.kommunicate.machinelearning.event.Event;
import io.kommunicate.machinelearning.event.Properties;
import com.applozic.message.MessagePxy;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class MachineLearningClient {

    private static String EVENT_SERVER_URL = "https://machine.kommunicate.io/events/events.json?accessKey=vE5gvXzmCpBEvp1Rcbr0pukECUZpJMbCeRStber1PsiuRdSjIzyizi7HiqHKcPts";

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
            System.out.println("####Sender: " + messagePxy.getUserKey());
            //Todo: set event params
            event.setProperties(properties);
            
            return post(objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException ex) {
            Logger.getLogger(MachineLearningClient.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(MachineLearningClient.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "error";
    }
    
    public String post(String data) {
        System.out.println("###Sending data to machine learning server: " + data);
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
            System.out.println("###response from event server: " + responseBody);
        } catch (IOException e) {
            e.printStackTrace();
            //log.error("IOException from " + url + " with " + object , e);
            //throw e;
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return responseBody;
    }
}
