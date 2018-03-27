import React, { Component } from 'react';
import './IntegrationDescription.css';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { createAndUpdateThirdPArtyIntegration, deleteThirdPartyByIntegrationType }  from '../../utils/kommunicateClient'
import { thirdPartyList} from './ThirdPartyList'
import Notification from '../model/Notification';

class IntegrationDescription extends Component{

    constructor(props){
        super(props);
        this.state = {
            accessKey:"",
            accessToken:"",
            subdoamin:"",
            activeModal:this.props.activeModal,
            thirdPartyList:this.props.thirdPartyList,
            helpdocsKeys:this.props.helpdocsKeys,
            zendeskKeys:this.props.zendeskKeys,
            clearbitKeys:this.props.clearbitKeys,
            deleteStatement:false
        }
        
    }
    componentDidMount () {
        if(this.state.activeModal == 0 && this.state.helpdocsKeys.length > 0) {
            this.setState({
            accessKey:this.state.helpdocsKeys[0].accessKey,
            })
        }
        if(this.state.activeModal == 1 && this.state.zendeskKeys.length > 0) {
            this.setState({
                accessKey:this.state.zendeskKeys[0].accessKey,
                accessToken:this.state.zendeskKeys[0].accessToken,
                subdoamin:this.state.zendeskKeys[0].domain
            })
        }
        if(this.state.activeModal == 2 && this.state.clearbitKeys.length > 0) {
            this.setState({
            accessKey:this.state.clearbitKeys[0].accessKey,
            })
        }
        
    }
    showDeleteStatement = () => {
        this.setState({
            deleteStatement:!this.state.deleteStatement
        })
    }


    validateIntegrationInput = () => {
        if(this.state.activeModal == 1) {
            if (this.state.accessKey !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
                this.createandUpdateThirdPartyIntegration()
            }
            else {
                Notification.info("All fields are mandatory")
            }
        }
        else {
            if (this.state.accessKey !== "") {
                this.createandUpdateThirdPartyIntegration()
            }
            else {
                Notification.info("API Key is mandatory")
            }
        }

    }
    createandUpdateThirdPartyIntegration= () => {          
        
        let keys= {
            "accessKey":this.state.accessKey,
            "accessToken":this.state.accessToken,
            "domain":this.state.subdoamin
        }
        let integrationType =thirdPartyList[this.state.activeModal].integrationType
        createAndUpdateThirdPArtyIntegration(keys,integrationType)
        .then(response => {
            console.log(response)
            if (response.status === 200 && response.data.code === "SUCCESS") {
                Notification.info(thirdPartyList[this.state.activeModal].name+" integrated Successfully")
                this.props.handleCloseModal();
                this.props.getThirdPartyList();
               
            } else {
                Notification.info("There was a problem while integrating"+thirdPartyList[this.state.activeModal].name);
                this.props.handleCloseModal();
            }
            return response;
        })
        .catch(err => {
            console.log(err)
        })         
        }
                     
    deleteThirdPartyValidation = () => {
        if(this.state.activeModal == 1) {
            if (this.state.accessKey !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
                this.deleteThirdPartyIntegration();
            }
            else {
                this.props.handleCloseModal();
            }
        }
        else {
            if (this.state.accessKey !== "") {
                this.deleteThirdPartyIntegration();
            }
            else {
                this.props.handleCloseModal();
            }
        }


    }

    deleteThirdPartyIntegration = () => {
        let integrationType =thirdPartyList[this.state.activeModal].integrationType
        deleteThirdPartyByIntegrationType(integrationType)
		.then(response => {
			console.log(response)
			if(response.status === 200 && response.data.code === "SUCCESS"){
				Notification.info(thirdPartyList[this.state.activeModal].name+" integration deleted");		
                this.props.handleCloseModal();
                this.props.getThirdPartyList();
			}else{
				Notification.info("There was problem in deleting the "+thirdPartyList[this.state.activeModal].name+" integration");
			}
		})
		.catch(err => {
			console.log(err)
		})		
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
            <input type="text" name="integration-token" className ="integration-token-input" value={this.state.accessKey}
                onChange={(e) => { 
                    let apiKey = this.state.accessKey;
                    apiKey = e.target.value;
                    this.setState({accessKey:apiKey})
                }} />
            </p>
        }
        { this.state.activeModal == 1 &&
            <p className="token-title">Email:
            <input type="text" id="integration-token" className ="zendesk-email-input" value={this.state.accessKey} 
                onChange={(e) => { 
                    let accessKey = this.state.accessKey;
                    accessKey= e.target.value;
                    this.setState({accessKey:accessKey})
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
        { this.state.deleteStatement == false &&
            <div className="row zendesk-integration-save-delete-wrapper">
                <div className="integration-trash-icon"> <DeleteIcon handleOnClick = {this.showDeleteStatement}/></div>
                <div className="zendesk-integration-save-btn"> 
                    <button className="km-button km-button--primary save-integrate-btn" onClick={this.validateIntegrationInput}>Save and Integrate</button>
                </div>              
            </div>
        }
        { this.state.deleteStatement == true &&
            <div className="row delete-confirmation-wrapper">
                <div className="delete-question">Do you want to delete {thirdPartyList[this.state.activeModal].name} integartion ?</div>
                <div className="yes-or-no-btn-wrapper"> 
                    <button className="km-button km-button--secondary delete-integration-btn" onClick = {this.deleteThirdPartyValidation} >Yes, Delete</button>
                    <button className="km-button km-button--primary save-integrate-btn no-integration-btn" onClick={this.showDeleteStatement}>No</button>
                </div>              
            </div>
        }
        
    </div>
        
    }
}

export default IntegrationDescription;