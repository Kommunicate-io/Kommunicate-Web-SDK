import ClearbitLogo from './images/clearbit.png';
import ZendeskLogo from './images/zendesk.png';
import HelpdocsLogo from './images/helpdocs.png';


export let thirdPartyList = [{
    name: "Helpdocs",
    logo: HelpdocsLogo,
    subTitle: "Import your FAQs from Helpdocs",
    integrationType:1,  
    instructions:[
        "Log in to your HelpDocs dashboard",
        "Go to Settings",
        "Click Create a New API Key",
        "Enter a name for your key. This is just so you can identify the key later.",
        "Choose permissions for your key by ticking the appropriate checkboxes",
        "Hit Save",
    ]       
}, {
    name: "Zendesk",
    logo: ZendeskLogo,
    subTitle: "Open Zendesk ticket for all conversations",
    integrationType: 2, 
    instructions:[
        "Sign in to your Zendesk dashboard.",
        "Enter your Access Email Id of Zendesk",
        "Add Access token on clicking "+" sign and save. Copy and paste that Access token here",
        "Open the agent interface by selecting Support from the product tray in the upper-right",
        "Select Admin > Channels > API. Make sure Token Access is enabled in the settings.",
        "In your browser, navigate to your Zendesk account. The url will look something like",
        "https://your_subdomain.zendesk.com.",
        "Copy your subdoamin and paste in to domain field",
        "Hit save",
    ]
    
}, {
    name: "Clearbit",
    subTitle: "Get company details of youranonymous visitors",
    logo: ClearbitLogo,
    integrationType: 3,
    instructions:[
        "Login to your https://clearbit.com/ account",
        "Go to Dashboard > API to get the API Key",
    ]
    
}]