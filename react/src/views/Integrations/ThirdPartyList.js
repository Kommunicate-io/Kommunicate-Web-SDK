import React, { Component } from 'react';
import ClearbitLogo from './images/clearbit.png';
import ZendeskLogo from './images/zendesk.png';
import HelpdocsLogo from './images/helpdocs.png';
import AgilecrmLogo from './images/agilecrm.png';

const integration_type = { HELPDOCS: 1, ZENDESK: 2, CLEARBIT: 3,GOOGLE_SHETS:4, AGILE_CRM: 5 };


export let thirdPartyList = {
    'zendesk': {
        key: 'zendesk',
        name: "Zendesk",
        logo: ZendeskLogo,
        subTitle: "Open Zendesk ticket for all conversations",
        integrationType: integration_type.ZENDESK,
        docsLink: "https://help.zendesk.com/hc/en-us/articles/115011289348-Zendesk-API-quick-start",
        domain:".zendesk.com",
        state: "zendeskKeys",
        instructions: [
            <span>Sign in to your <a  target="_blank" className="integration-api-support-link" href="https://www.zendesk.com/login/#support">
            Zendesk dashboard</a></span>,
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
        integrationType: integration_type.CLEARBIT,
        docsLink: "https://clearbit.com/docs",
        state: "clearbitKeys",
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
        integrationType: integration_type.HELPDOCS,
        state:"helpdocsKeys",
        docsLink: "https://apidocs.helpdocs.io/article/qVqI4u0iqG-managing-api-keys",
        instructions: [
            <span>Login to your <a  target="_blank" className="integration-api-support-link" href="https://my.helpdocs.io/login">
            HelpDocs dashboard</a></span>,
            "Go to Settings",
            "Click Create a New API Key",
            "Enter a name for your key. This is just so you can identify the key later.",
            "Choose permissions for your key by ticking the appropriate checkboxes",
            "Hit Save",
        ],
        discountCouponBanner: [
            <div className="discount-coupon-banner">
                <div className="discount-coupon-text">
                    <p><span className="discount-coupon-percent">20%</span> discount on all Helpdocs monthly plans. Use code <span className="discount-coupon-code">KOMMUNICATE318</span></p>
                </div>
                <div className="discount-coupon-note">
                    <p>* Exclusively for Kommunicate customers</p>
                </div>
            </div>
        ],
        discountCouponOff: "20%"
    },
    'agilecrm': {
        key: 'agilecrm',
        name: "Agile CRM",
        logo: AgilecrmLogo,
        subTitle: "Add leads to Agile CRM contact",
        integrationType: integration_type.AGILE_CRM,
        docsLink: "https://www.agilecrm.com/api",
        domain:".agilecrm.com",
        state:"agilecrmKeys",
        instructions: [
            <span>Sign in to your <a  target="_blank" className="integration-api-support-link" href="https://my.agilecrm.com/enter-domain?to=login">
            Agile CRM dashboard</a></span>,
            "Enter REST API, It is present at Admin Settings -> Developers & API tab",
            "Enter your Access Email Id of Agile CRM",
            "Enter your subdoamin",
            "Hit save",
        ]
    },
};