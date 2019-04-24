import React from 'react';
import './SettingsComponent.css';
import routes from "../../routes";
import subHeadings from "./SettingsSubheading.json";
import {LearnMore} from "../../views/Faq/LizSVG"
import CommonUtils from '../../utils/CommonUtils';



const SettingsHeader = (props) =>{

    let currPath = routes[window.location.pathname], subHeading, knowledgeBaseLink;   
    currPath ? subHeading = subHeadings[currPath].subHeading :  "";
    currPath ? knowledgeBaseLink = subHeadings[currPath].knowledgeBaseLink :  "";
    if(subHeading && (props.applozicDashboard || CommonUtils.isProductApplozic())){
        subHeading = subHeading.replace('Kommunicate', 'Applozic');
    }
     
   return(
        <div className="km-settings-heading-wrapper">
            <div className={!subHeading  ? "km-settings-component-heading km-settings-header-border" : "km-settings-component-heading"}>
                <h1>{currPath}</h1>
            </div>
            
            <div className={!subHeading  ? "n-vis" : " km-settings-component-subheading"}>
                <h2>{subHeading} <a href={knowledgeBaseLink} target="_blank" className={knowledgeBaseLink == "" ? "n-vis" : "km-knowledge-base-link"}> Learn More <LearnMore color="#4831d9"/> </a></h2> 
            </div>
            </div>
   );
}

  

export{ 
    SettingsHeader
}
