import React, { Component } from 'react';
import Modal from 'react-modal';
import CloseButton from '../../components/Modal/CloseButton.js'
import {CompanyModalTitleContainer, CompanyModalFooterContainer, CustomUrlStep1InputFieldContainer, SetUpYourDomainContainer,DomainTable, SetUpCompleteContainer} from './companyStyle'
import Button from '../../components/Buttons/Button';
import { ConfirmationTick, CopyIcon } from '../../assets/svg/svgs';
import { getConfig } from '../../../src/config/config'
import copy from 'copy-to-clipboard';
import Notification from '../model/Notification';
import isURL from 'validator/lib/isURL';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        overflow: 'visible'
    }
};

const ModalTitle = props => (
    <CompanyModalTitleContainer>
        <p>{props.title}</p>
        <hr />
    </CompanyModalTitleContainer>
)

const ModalFooter = props => (
    <CompanyModalFooterContainer>
         <Button hidden = {!props.showCancelButton} secondary data-button= {"cancel"} onClick= {props.onCancelClick} >Cancel</Button>
         <Button data-id = {props.buttonId} onClick={(e) => {props.onButtonClick(e) }} >{props.buttonText}</Button>
    </CompanyModalFooterContainer>

)
const CustomUrlStep1InputField = props => (
    <CustomUrlStep1InputFieldContainer>
        <p>https://</p>
        <input  autoFocus type="text" id="custom-url" data-id = {props.inputFieldId} placeholder="kommunicate.yourcompany.com or dashboard.domain.com"
            value={props.customUrl} 
            onChange={(e) => { props.customUrlInputValue(e, "customUrl") }}
            onKeyDown={(e) => {
                if (e.keyCode === 13) { props.onButtonClick(e); }}}
        />
    </CustomUrlStep1InputFieldContainer>
)
const SetUpYourDomain = props => (
    <SetUpYourDomainContainer>
        <ol>
            <li>Login to your<span> domain administration panel </span>and find <span>DNS records management panel</span> for the domain: <span>abcdefgh.com</span> </li>
            <li>Then add new records</li>
        </ol>
        <DomainTable>
            <tbody>
            <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Value</th>
                <th></th>
            </tr>
            <tr>
                <td>CNAME</td>
                <td>{props.customUrl}</td>
                <td>{props.value}</td>
                <td><span onClick = {props.copyToClipboard}><CopyIcon/> Copy</span></td>
            </tr>
            </tbody>
        </DomainTable>
        <p>If you have any problems with the setup, please contact your domain admin support team. They will be able to help you out</p>
    </SetUpYourDomainContainer>
)
const SetUpComplete = props => (
    <SetUpCompleteContainer>
        <ConfirmationTick />
        <h5>The setup of your custom domain URL is successful  </h5>
        <p>The domain should be connected in a few hours if the information you entered in your panel were correct</p>
    </SetUpCompleteContainer>
)
class CompanySectionModal extends Component {
    constructor(props){ 
        super(props);
        this.state = {
            step:1,
            customUrl: this.props.customUrl
        }
    }
    onButtonClick = (e) => {
        let buttonIdInfo = {
            step1:1,
            step2:2,
            step3:3
        }
        if(buttonIdInfo.step3 == e.target.dataset.id){
            this.props.controlModal();
            return
        }
        buttonIdInfo.step1 == e.target.dataset.id && this.updateCustomUrl(e.target.dataset.id);  
        buttonIdInfo.step2 == e.target.dataset.id && this.goToNextStep(e.target.dataset.id);        
    }
    goToNextStep = (buttonId) => {
        this.setState({step: parseInt(buttonId)+1 })
    }
    customUrlInputValue = (e,key) => {
        this.setState({[key] : e.target.value});
    }
    copyToClipboard = () => {
        copy(getConfig().loadBalancerDnsValue);
        Notification.success("Domain value copied");
    }
    updateCustomUrl = (step) => {
        if (this.state.customUrl && !isURL(this.state.customUrl)) {
            Notification.error("Invalid URL");
            return
        }
        this.props.updateSettings({domainUrl: this.state.customUrl.trim()})
        this.goToNextStep(step)
    }

    render() {
        const modalContent = {
            "customUrl" : {
                1:{
                    step:1,
                    title:"Step 1 - Enter the domain address",
                    content: <CustomUrlStep1InputField customUrlInputValue = {this.customUrlInputValue} customUrl = {this.state.customUrl} onButtonClick={this.onButtonClick} inputFieldId={1} />,
                    buttonText:"Continue",
                    showCancelButton: true,
                    buttonId:1
                },
                2:{
                    step:2,
                    title:"Step 2 - Set up your domain",
                    content:<SetUpYourDomain value = {getConfig().loadBalancerDnsValue} copyToClipboard = {this.copyToClipboard} customUrl = {this.state.customUrl}/>,
                    buttonText:"I’ve done this",
                    showCancelButton: false,
                    buttonId:2
                },
                3:{
                    step:3,
                    title:"Step 3 - Setup complete",
                    content:<SetUpComplete />,
                    buttonText:"Close",
                    showCancelButton: false,
                    buttonId:3
                }
            }
        }
        let item = modalContent[this.props.modal][this.state.step]
        return(
            <div>
                 <Modal isOpen={this.props.openModal} onRequestClose={this.props.controlModal} style={customStyles} ariaHideApp={false} >
                    <div>
                      <ModalTitle title={item.title}/>
                     
                      {item.content}

                      <ModalFooter onCancelClick = {this.props.controlModal} buttonText={item.buttonText} buttonId ={item.buttonId}  onButtonClick={this.onButtonClick} showCancelButton = {item.showCancelButton} />
                    </div>    
                    <CloseButton onClick={this.props.controlModal}/>
                 </Modal>
            </div>
        )
    }
}

export default CompanySectionModal