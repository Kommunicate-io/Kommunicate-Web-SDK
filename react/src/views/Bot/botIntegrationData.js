
import React, { Component } from 'react';
import CustomBotInputFields from './CustomBotInputFields'


export const botIntegrationData = {
    custom : {
        step1:{
            title:"Integrate your bot with Kommunicate",
            subTitle:"Follow the instructions to integrate your bot:",
            instructions:["Create a webhook end point at your server [https://docs.kommunicate.io/docs/webhooks-configuration]","Setup authentication at your server using request headers.","Enter the web hook url and request headers and paste here."],
            inputFieldComponent:"CustomBotInputFields",
        },
        step2:{
            component:"botProfile",
            title:"Give your Bot a name and face",
            subTitle:""
        },
        inputFields:{
            field1:{label:"Webhook URL",placeHolder:"Enter webhook URL"},
            field2:{label:"Key", placeHolder:"Enter Header Key (optional)"},
            field3:{label:"Value", placeHolder:"Enter Header Value (optional)"},
            title:"Request Header (optional):"
        }
        
    }
}