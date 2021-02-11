// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion, Payload } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
    (request, response) => {
        const agent = new WebhookClient({ request, response });
        function welcome(agent) {
            agent.add(
                new Payload("PLATFORM_UNSPECIFIED", [
                    {
                        message:
                            "This is the image template. Image height and width will automatically be adjusted acording to the view port. If image is too small it will be strached to fill container space. The minimum recommend size of image is 500*500px",
                        platform: "kommunicate",
                        metadata: {
                            contentType: "300",
                            templateId: "9",
                            payload: [
                                {
                                    url:
                                        "https://kommunicate.s3.ap-south-1.amazonaws.com/profile_pic/1537970492506kommunicate-support-devashish%40kommunicate.io.png",
                                },
                            ],
                        },
                    },
                ])
            );
        }

        let intentMap = new Map();
        intentMap.set("Default Welcome Intent", welcome);
        agent.handleRequest(intentMap);
    }
);
