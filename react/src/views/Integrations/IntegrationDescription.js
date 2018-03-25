import React, { Component } from 'react';
import './IntegrationDescription.css';
import ZendeskLogo from './images/zendesk.png';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { submitIntegrationKeys }  from '../../utils/kommunicateClient'
import { thirdPartyList} from './ThirdPartyList'
import Notification from '../model/Notification';

class IntegrationDescription extends Component{

    constructor(props){
        super(props);
        this.state = {
            apiKey:"",
            email:"",
            accessToken:"",
            subdoamin:"",
            activeModal:this.props.activeModal
        }
        
    }
    submitIntegrationKeys = () => {          
        
        let keys= {
            "apiKey":this.state.apiKey,
            "accessKey":this.state.email,
            "accessToken":this.state.accessToken,
            "domain":this.state.subdoamin
        }
        if(this.state.activeModal == 1) {
            if (this.state.email !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
                submitIntegrationKeys(keys)
                    .then(response => {
                        console.log(response)
                        if (response.status === 200 && response.data.code === "SUCCESS") {
                            Notification.info("Zendesk Integrated Successfully")
                            this.props.handleCloseModal()
                            
                        } else {
                            Notification.info("There was a problem while integrating Zendesk");
                        }
                        return response;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            else {
                Notification.info("All fields are mandatory");
            }
        }
    }

    render(){
        return <div className="integration-description-wrapper">        
            <h4 className="integration-description-title"><span><img src={thirdPartyList[this.state.activeModal].logo} className="integration-description-logo"/></span>
            Integrating {thirdPartyList[this.state.activeModal].name} with Kommunicate</h4>
            <div className="title-divider"></div>
        <div className="integration-instruction-set">
            <p className="instructions-title">Instructions</p>
            {thirdPartyList[this.state.activeModal].instructions.map((item, index) => (
                <p key={index} className="integration-instructions">{index+1}. {item} </p>
            ))}
        </div>
        <div className="token-input-wrapper">
        { this.state.activeModal !== 1 &&
            <p className="token-title">API Key:
            <input type="text" name="integration-token" className ="integration-token-input" />
            </p>
        }
        { this.state.activeModal == 1 &&
            <p className="token-title">Email:
            <input type="text" id="integration-token" className ="zendesk-email-input" value={this.state.email} 
                onChange={(e) => { 
                    let email = this.state.email;
                    email= e.target.value;
                    this.setState({email:email})
                }} />
            </p>
        }
        { this.state.activeModal == 1 &&
            <p className="token-title">Access Token:
            <input type="text" id="integration-token" className ="zendesk-access-token-input" value={this.state.accessToken}
             onChange={(e) => { 
               let accessToken = this.state.accessToken;
               accessToken= e.target.value;
               this.setState({accessToken:accessToken})
              }} />   
           </p>
        }
        { this.state.activeModal == 1 &&
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
        }
        </div>
        <div className="row zendesk-integration-save-delete-wrapper">
          <div className="integration-trash-icon"> <DeleteIcon/></div>
          <div className="zendesk-integration-save-btn"> 
          <button className="km-button km-button--primary save-integrate-btn" onClick={this.submitIntegrationKeys}>Save and Integrate</button></div>              
        </div>
    </div>
        
    }
}

export default IntegrationDescription;