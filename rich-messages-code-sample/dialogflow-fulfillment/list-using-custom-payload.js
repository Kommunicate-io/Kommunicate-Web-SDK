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
                        message:
                            'I have created a list of wild animals with detail.  It is built with the images, buttons, text and other components. Check the docs to build your own list.',
                        platform: 'kommunicate',
                        metadata: {
                            contentType: '300',
                            templateId: '7',
                            payload: {
                                headerImgSrc:
                                    'https://static.boredpanda.com/blog/wp-content/uploads/2018/09/comedy-wildlife-photography-awards-finalists-2018-36-5b9b5799ea49d__880.jpg',
                                headerText: 'Wildlife Photography',
                                elements: [
                                    {
                                        imgSrc:
                                            'https://nation.com.pk/digital_images/medium/2018-03-05/rumble-in-the-jungle-mother-bear-fights-off-indian-tiger-1520242257-7748.jpg',
                                        title: 'Bengal tiger',
                                        description:
                                            'The Bengal tiger is a Panthera tigris tigris population in the Indian subcontinent.',
                                        action: {
                                            url:
                                                'https://en.wikipedia.org/wiki/Bengal_tiger',
                                            type: 'link',
                                        },
                                    },
                                    {
                                        imgSrc:
                                            'https://i.ytimg.com/vi/CFnt5S6yfyI/hqdefault.jpg',
                                        title: 'Great Indian Elephent',
                                        description:
                                            'Indian elephants are smaller than African elephants and have the highest body point on the head.',
                                        action: {
                                            url:
                                                'https://en.wikipedia.org/wiki/Indian_elephant',
                                            type: 'link',
                                        },
                                    },
                                    {
                                        imgSrc:
                                            'http://cdn.walkthroughindia.com/wp-content/uploads/2017/02/Sloth_Bear-533x400.jpg',
                                        title: 'Sloth Bear',
                                        description:
                                            'Sloth Bear species is the real Jungle Book animal, native to the Indian subcontinent and feed on termites',
                                        action: {
                                            url:
                                                'https://en.wikipedia.org/wiki/Sloth_bear',
                                            type: 'link',
                                        },
                                    },
                                ],
                                buttons: [
                                    {
                                        name: 'Talk to our experts',
                                        action: {
                                            text: 'Talk to our experts',
                                            type: 'quick_reply',
                                        },
                                    },
                                    {
                                        name: 'Check docs',
                                        action: {
                                            text: 'Talk to our experts',
                                            type: 'quick_reply',
                                        },
                                    },
                                ],
                            },
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
