import React, { Component, PropTypes } from 'react';
import './SettingsComponent.css';
import routes from "../../../src/routes";
import subHeadings from "./SettingsSubheading.json";

const LearnMore = props => (
    <svg viewBox="0 0 10 10" {...props}>
      <g fill={ props.color || "#858585"} fillRule="evenodd">
        <path d="M8 5a.5.5 0 0 0-.5.5v3A.5.5 0 0 1 7 9H1.5a.5.5 0 0 1-.5-.5V3c0-.28.22-.5.5-.5h3a.5.5 0 0 0 0-1h-3C.67 1.5 0 2.17 0 3v5.5C0 9.33.67 10 1.5 10H7c.83 0 1.5-.67 1.5-1.5v-3A.5.5 0 0 0 8 5" />
        <path d="M9.96.3A.5.5 0 0 0 9.5 0h-3a.5.5 0 1 0 0 1h1.8L3.64 5.65a.5.5 0 1 0 .7.7L9 1.71V3.5a.5.5 0 1 0 1 0v-3a.5.5 0 0 0-.04-.2" />
      </g>
    </svg>
  )

const SettingsHeader = (props) =>{

    let currPath = routes[window.location.pathname];   
    let subHeading = subHeadings[currPath].subHeading;
    let knowledgeBaseLink = subHeadings[currPath].knowledgeBaseLink;
    if(props.applozicDashboard){
        subHeading=subHeading.replace('Kommunicate', 'Applozic')
    }
     
   return(
        <div className="km-settings-heading-wrapper">
            <div className={subHeading == "" ? "km-settings-component-heading km-settings-header-border" : "km-settings-component-heading"}>
                <h1>{currPath}</h1>
            </div>
            
            <div className={subHeading === "" ? "n-vis" : " km-settings-component-subheading"}>
                <h2>{subHeading} <a href={knowledgeBaseLink} target="_blank" className={knowledgeBaseLink == "" ? "n-vis" : "km-knowledge-base-link"}> Learn More <LearnMore color="#4831d9"/> </a></h2> 
            </div>
            </div>
   );
}

  

export{ 
    SettingsHeader
}
