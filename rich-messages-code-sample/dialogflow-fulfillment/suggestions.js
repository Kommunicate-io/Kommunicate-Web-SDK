// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {
        const agent = new WebhookClient({
            request,
            response,
        });

        function welcome(agent) {
            agent.add(`Welcome to my agent!`);
            agent.add(new Suggestion(`Suggestion 1`));
            agent.add(new Suggestion(`Suggestion 2`));
            agent.add(new Suggestion(`Suggestion 3`));
            agent.add(new Suggestion(`Suggestion 4`));
        }

        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        agent.handleRequest(intentMap);
    }
);
