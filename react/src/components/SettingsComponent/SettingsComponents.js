import React, { Component, PropTypes } from 'react';
import './SettingsComponent.css';

const SettingsHeader = (props) =>{

    let currPath = window.location.pathname.replace("/settings/","").replace(/-/g," ");  
    console.log(currPath);  

    let subHeading = "";
    switch(currPath){
        case 'welcome message':
            subHeading = "The welcome message will greet your customers when they initiate a new conversation"
            break;
        case 'away message':
            subHeading = "The away message will be shown to your users if and when they open an existing conversation or initiate a new one when when entire team is away or offline."
            break;
        
        case 'message shortcuts':
            subHeading="Press / before typing the shortcut term during a conversation to get the full message"
            currPath = "Quick reply"
            break;
        case 'email notifications':
            subHeading="We will send you email notifications if you are offline/away for more than 5 minutes and you have unread messages."
            break;
        
        case 'team':
            subHeading="See the list of all the team members, their roles, add new team members and edit member details."
            currPath = "Teammates"
            break;
        case 'agent assignment':
            subHeading="Set up the way you want conversations to be assigned among your team members."
            break;
        case 'connect support email':
            subHeading="Reply to support emails from Kommunicate."
            break;
        case 'billing':
            subHeading=""
            break;
        case 'install':
            subHeading="Follow the steps below to install Kommunicate Chat in your product."
            break;
        case 'pushnotification':
            subHeading="Enabling push notification allows Kommunicate to send notifications even when your mobile app is not in the foreground."
            currPath = "Push Notifications"
            break;
            }
        
   return(
        <div className="km-settings-heading-wrapper">
            <div className={currPath == "profile" || currPath == "billing" ? "km-settings-component-heading km-settings-header-border" : "km-settings-component-heading"}>
                <h1>{currPath}</h1>
            </div>
            
            <div className={subHeading === "" ? "n-vis" : " km-settings-component-subheading"}>
                <h2>{subHeading}</h2>
            </div>
            </div>
   );
}

  

export{ 
    SettingsHeader
}
