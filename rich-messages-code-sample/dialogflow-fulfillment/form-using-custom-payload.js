// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    function welcome(agent) {
        agent.add(
            new Payload('PLATFORM_UNSPECIFIED', [
                {
                    message: 'Submit your details',
                    platform: 'kommunicate',
                    metadata: {
                        contentType: '300',
                        templateId: '12',
                        payload: [
                            {
                                type: 'text',
                                label: 'Name',
                                placeholder: 'Enter your name',
                            },
                            {
                                type: 'text',
                                label: 'Age',
                                placeholder: 'Enter your age',
                            },
                            {
                                type: 'submit',
                                label: 'Submit',
                                requestType: 'json',
                                formAction: '<URL>', // enter a valid Url here. submit button will post the form data in thi url.
                                message:
                                    'optional- this message will be used as acknowledgement text when user clicks the button',
                            },
                        ],
                    },
                },
            ])
        );
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    agent.handleRequest(intentMap);
});
