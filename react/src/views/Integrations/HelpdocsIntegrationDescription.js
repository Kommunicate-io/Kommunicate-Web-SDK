import React, { Component } from 'react';
import './IntegrationDescription.css';
import HelpdocsLogo from './images/helpdocs.png';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';

class HelpdocsIntegrationDescription extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return <div className="integration-description-wrapper">        
            <h4 className="integration-description-title"><span><img src={HelpdocsLogo} className="integration-description-logo"/></span>
            Integrating Helpdocs with Kommunicate</h4>
            <div className="title-divider"></div>
        <div className="integration-instruction-set">
            <p className="integration-instructions">
            <span className="instructions-title">Instructions</span><br/> <br/>
            1. Log in to your HelpDocs dashboard<br/> 
            2. Go to Settings > API<br />
            3. Click Create a New API Key<br />
            4. Enter a name for your key. This is just so you can identify the key later.<br />
            5. Choose permissions for your key by ticking the appropriate checkboxes<br />
            6. Hit Save
            </p>
        </div>
        <div className="token-input-wrapper">
        <p className="token-title">Example token:
         <input type="text" name="integration-token" className ="integration-token-input" />
         </p>
        </div>
        <div className="row integration-save-delete-wrapper">
          <div className="integration-trash-icon"> <DeleteIcon/></div>
          <div className="integration-save-btn"> <button className="km-button km-button--primary save-integrate-btn">Save and Integrate</button></div>              
        </div>
    </div>
        
    }
}

export default HelpdocsIntegrationDescription;