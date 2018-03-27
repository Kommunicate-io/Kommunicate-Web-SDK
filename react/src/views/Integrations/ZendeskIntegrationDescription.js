import React, { Component } from 'react';
import './IntegrationDescription.css';
import ZendeskLogo from './images/zendesk.png';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { submitZendeskKeys }  from '../../utils/kommunicateClient'

class HelpdocsIntegrationDescription extends Component{

    constructor(props){
        super(props);
        this.state = {
            email:"",
            accessToken:"",
            subdoamin:""
        }
    }
    submitIntegrationKeys = () => {
        let keys= {
            "accessKey":this.state.email,
            "accessToken":this.state.accessToken,
            "domain":this.state.domain
        }
        if (this.state.email !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
            submitZendeskKeys()
				.then(response => {
					console.log(response)
					if (response.status === 200 && response.data.code === "") {
						Notification.info("")
					} else {
						Notification.info("");
					}
				})
				.catch(err => {
					console.log(err)
				})
        }
    }

    render(){
        return <div className="integration-description-wrapper">        
            <h4 className="integration-description-title"><span><img src={ZendeskLogo} className="integration-description-logo"/></span>
            Integrating Zendesk with Kommunicate</h4>
            <div className="title-divider"></div>
        <div className="integration-instruction-set">
            <p className="integration-instructions">
            <span className="instructions-title">Instructions</span><br/> <br/>
            1. Sign in to your Zendesk dashboard.<br/>  
            2. Enter your Access Email Id of Zendesk<br />
            3. Add Access token on clicking "+" sign and save. Copy and paste that Access token here<br />
            4. Open the agent interface by selecting Support from the product tray in the upper-right<br/>
            Select Admin > Channels > API. Make sure Token Access is enabled in the settings.<br />
            5. In your browser, navigate to your Zendesk account. The url will look something like <br/> 
               https://your_subdomain.zendesk.com.<br />
            6. Copy your subdoamin and paste in to domain field <br/>
            7. Hit save
           
            </p>
        </div>
        <div className="zendesk-token-input-wrapper">
        <p className="token-title">Email:
         <input type="text" id="integration-token" className ="zendesk-email-input" value={this.state.email} 
          onChange={(e) => { 
              let email = this.state.email;
              email= e.target.value;
              this.setState({email:email})
          }} />
        </p>
        <p className="token-title">Access Token:
         <input type="text" id="integration-token" className ="integration-token-input" value={this.state.accessToken}
          onChange={(e) => { 
            let accessToken = this.state.accessToken;
            accessToken= e.target.value;
            this.setState({accessToken:accessToken})
        }} />
         
        </p>
        <p className="token-title">Subdomain:
         <span className="zendesk-domain-https">https://</span>
         <input type="text" id="integration-token" className ="zendesk-subdoamin-input" value={this.state.subdoamin} 
          onChange={(e) => { 
            let subdomain = this.state.subdoamin;
            subdomain= e.target.value;
            this.setState({subdoamin:subdomain})
        }} />
         
         <span className="zendesk-domain"> .zendesk.com </span>
        </p>
        </div>
        <div className="row zendesk-integration-save-delete-wrapper">
          <div className="integration-trash-icon"> <DeleteIcon/></div>
          <div className="zendesk-integration-save-btn"> 
          <button className="km-button km-button--primary save-integrate-btn" onClick={this.submitIntegrationKeys}>Save and Integrate</button></div>              
        </div>
    </div>
        
    }
}

export default HelpdocsIntegrationDescription;