// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {
        const agent = new WebhookClient({ request, response });
        function welcome(agent) {
            agent.add(
                new Payload('PLATFORM_UNSPECIFIED', [
                    {
                        message: 'This is the sample json for card template',
                        platform: 'kommunicate',
                        metadata: {
                            contentType: '300',
                            templateId: '10',
                            payload: [
                                {
                                    title: 'Card Title',
                                    subtitle: 'Card Subtitle ',
                                    header: {
                                        overlayText: 'Overlay Text',
                                        imgSrc:
                                            'https://fyf.tac-cdn.net/images/products/small/BF116-11KM.jpg',
                                    },
                                    description: 'Description',
                                    titleExt: 'Title extension',
                                    buttons: [
                                        {
                                            name: 'Buy',
                                            action: {
                                                type: 'link',
                                                payload: {
                                                    url:
                                                        'https://www.fromyouflowers.com/products/youre_in_my_heart_3.htm',
                                                },
                                            },
                                        },
                                    ],
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
    }
);
