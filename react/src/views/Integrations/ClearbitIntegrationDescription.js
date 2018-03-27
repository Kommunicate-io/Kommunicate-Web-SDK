import React, { Component } from 'react';
import './IntegrationDescription.css';
import ClearbitLogo from './images/clearbit.png';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';

class HelpdocsIntegrationDescription extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return <div className="integration-description-wrapper">        
            <h4 className="integration-description-title"><span><img src={ClearbitLogo} className="integration-description-logo"/></span>
            Integrating Clearbit with Kommunicate</h4>
            <div className="title-divider"></div>
        <div className="integration-instruction-set">
            <p className="integration-instructions">
            <span className="instructions-title">Instructions</span><br/> <br/>
            1. Login to your https://clearbit.com/ account<br/> 
            2. Go to Dashboard > API to get the API Key<br />
            </p>
        </div>
        <div className="token-input-wrapper">
        <p className="token-title">API Key:
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