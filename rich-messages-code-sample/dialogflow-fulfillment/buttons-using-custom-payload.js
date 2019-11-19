'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


  
exports.dialogflowfullfilment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response }); 
  
  /**
   * This method create a suggested replies  in Kommunicate chat widget
   * @param {*} agent 
   */ 
  function generateSuggestedReplies(agent) {
    agent.add(new Payload("PLATFORM_UNSPECIFIED", [{
      "message": "Do you want more updates?",
      "platform": "kommunicate",
      "metadata": {
        "contentType": "300",
        "templateId": "6",
        "payload": [
          {
            "title": "Yes",
            "message": "Cool! send me more."
          },
          {
            "title": "No ",
            "message": "Don't send it to me again"
          }
        ]
      }
    }]));
  }


  /**
   * This method create link buttons in Kommunicate chat widget
   * @param {*} agent 
   */
  function generateLinkButtons(agent) {
    agent.add(new Payload("PLATFORM_UNSPECIFIED", [{
        "message": "click the pay button",
        "platform": "kommunicate",
        "metadata": {
            "contentType": "300",
            "templateId": "3",
            "payload": [{
                    "type": "link",
                    "url": "https://www.google.com",
                    "name": "Go To Google"
                },
                {
                    "type": "link",
                    "url": "https://www.facebook.com",
                    "name": "Go To Facebook",
                    "openLinkInNewTab": false
                }
            ]
        }
      }]));
    }

    /**
     * This method create submit buttons in Kommunicate chat widget
     * @param {*} agent 
     */
    function generateSubmitButtons(agent) {
        agent.add(new Payload("PLATFORM_UNSPECIFIED", [{
            "message": "click the pay button",
            "platform": "kommunicate",
            "metadata": {
                "contentType": "300",
                "templateId": "3",
                "payload": [{
                    "name": "Pay",
                    "replyText":"optional, will be used as acknowledgement message to user in case of requestType JSON. Default value is same as name parameter"
                }],
                "formData": {
                    "amount": "1000",
                    "description": "movie ticket"
                },
                "formAction": "https://example.com/book",
                "requestType":"json"   
            }
          }]));
        }
 
  let intentMap = new Map();
  // intent map 
  intentMap.set('generateSuggestedReplies', generateSuggestedReplies);
  intentMap.set('generateLinkButtons', generateLinkButtons);
  intentMap.set('generateSubmitButtons', generateSubmitButtons);
  
  agent.handleRequest(intentMap);
});