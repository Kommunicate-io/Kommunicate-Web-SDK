import React, { Component, PropTypes } from 'react';
import './SettingsComponent.css';
import routes from "../../../src/routes";
import subHeadings from "./SettingsSubheading.json";

const SettingsHeader = (props) =>{

    let currPath = routes[window.location.pathname];    
    let subHeading = subHeadings[currPath];
     
   return(
        <div className="km-settings-heading-wrapper">
            <div className={currPath == "Billing" ? "km-settings-component-heading km-settings-header-border" : "km-settings-component-heading"}>
                <h1>{currPath}</h1>
            </div>
            
            <div className={subHeading === "empty" ? "n-vis" : " km-settings-component-subheading"}>
                <h2>{subHeading}</h2>
            </div>
            </div>
   );
}

  

export{ 
    SettingsHeader
}
