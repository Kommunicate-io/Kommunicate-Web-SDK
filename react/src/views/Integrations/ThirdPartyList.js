import React, { Component } from 'react';
import ClearbitLogo from './images/clearbit.png';
import ZendeskLogo from './images/zendesk.png';
import HelpdocsLogo from './images/helpdocs.png';


export let thirdPartyList = {
    'zendesk': {
        key: 'zendesk',
        name: "Zendesk",
        logo: ZendeskLogo,
        subTitle: "Open Zendesk ticket for all conversations",
        integrationType: 2,
        docsLink: "https://help.zendesk.com/hc/en-us/articles/115011289348-Zendesk-API-quick-start",
        status: "Settings",
        instructions: [
            <span>Sign in to your <a  target="_blank" className="integration-api-support-link" href="https://www.zendesk.com/login/#support">
            Zendesk dashboard</a></span>,
            "Sign in to your Zendesk dashboard.",
            "Enter your Access Email Id of Zendesk",
            "Add Access token on clicking " + " sign and save. Copy and paste that Access token here",
            "Open the agent interface by selecting Support from the product tray in the upper-right",
            "Select Admin > Channels > API. Make sure Token Access is enabled in the settings.",
            "Navigate to your Zendesk account.The url look like https://your_subdomain.zendesk.com.",
            "Copy your subdomain and paste in to domain field",
            "Hit save",
        ]
    },
    'clearbit': {
        key: 'clearbit',
        name: "Clearbit",
        subTitle: "Get company details of your anonymous visitors",
        logo: ClearbitLogo,
        integrationType: 3,
        docsLink: "https://clearbit.com/docs",
        status: "Settings",
        instructions: [
            <span>Login to your <a  target="_blank" className="integration-api-support-link" href="https://dashboard.clearbit.com/login">
            Clearbit account</a></span>,
            `Go to Dashboard > API to get the API Key`

        ]
    },
    'helpdocs': {
        key: 'helpdocs',
        name: "Helpdocs",
        logo: HelpdocsLogo,
        subTitle: "Import your FAQs from Helpdocs",
        integrationType: 1,
        docsLink: "https://apidocs.helpdocs.io/article/qVqI4u0iqG-managing-api-keys",
        status: "Coming soon",
        instructions: [
            <span>Login to your <a  target="_blank" className="integration-api-support-link" href="https://my.helpdocs.io/login">
            HelpDocs dashboard</a></span>,
            "Log in to your HelpDocs dashboard",
            "Go to Settings",
            "Click Create a New API Key",
            "Enter a name for your key. This is just so you can identify the key later.",
            "Choose permissions for your key by ticking the appropriate checkboxes",
            "Hit Save",
        ]
    }
};