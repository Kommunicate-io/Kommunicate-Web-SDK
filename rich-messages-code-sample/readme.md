
## Rich message with Dialogflow fulfillment

You can configure the rich messages while working with the dialogflow fulfillment. You can either add the rich message metadata as custom payload response or use the default templates provided by the `dialogflow-fulfillment` library. 

Here are the code samples  to for different message. These samples are tested in Dialogflow's inline editor. You can also use them as firebase functions as well.

1) Using  custom payload
- [Buttons](dialogflow-fulfillment/buttons-using-custom-payload.js)
- [Images](dialogflow-fulfillment/images-using-custom-payload.js)
- [List](dialogflow-fulfillment/list-using-custom-payload.js)
- [Cards](dialogflow-fulfillment/cards-using-custom-payload.js)
- [Form](dialogflow-fulfillment/form-using-custom-payload.js)

2) Using default templates 
- [Suggestions](dialogflow-fulfillment/suggestions.js)
- [Cards](dialogflow-fulfillment/cards.js) 

## Rich message using `action-on-google` library
if you are working with Google assistant and using `action-on-google` library, You don't need to configure the rich messages  separately for Kommunicate. Kommunicate supports the rich messages from `action-on-google library`as well. 
Make sure you have not set any default response(both text and custom payload). If it is set Kommunicate gives priority to the default responses and the response from `action on google` library will be ignored.
[Here](https://github.com/actions-on-google/dialogflow-conversation-components-nodejs/blob/master/functions/index.js) is the code sample for setting rich messages response using `action-on-google` library.   

## Rich message with Amazon lex Lambda functions

Sample codes for custom payload:
- [Form](amazon-lex-lambda/form-using-custom-payload.js)
