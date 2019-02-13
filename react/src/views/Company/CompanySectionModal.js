import React, { Component } from 'react';
import Modal from 'react-modal';
import CloseButton from '../../components/Modal/CloseButton.js'
import {CompanyModalTitleContainer, CompanyModalFooterContainer} from './companyStyle'
import Button from '../../components/Buttons/Button';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
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
         <Button data-button= {props.buttonText} onClick={props.onButtonClick} >{props.buttonText}</Button>
    </CompanyModalFooterContainer>

)
class CompanySectionModal extends Component {
    constructor(props){ 
        super(props);
        this.state = {
            step:1
        }
    }
    onButtonClick = (e) => {
        if(e.target.dataset.button == "Close"){
            this.props.controlModal();
            return
        }
        const stepsData = {
            "Continue":2,
            "I’ve done this":3,
        }
        this.setState({step: stepsData[e.target.dataset.button] })        
    }
    render() {
        const modalContent = {
            "customUrl" : {
                1:{
                    step:1,
                    title:"Step 1 - Enter the domain address",
                    content:"",
                    buttonText:"Continue",
                    showCancelButton: true
                },
                2:{
                    step:2,
                    title:"Step 2 - Set up your domain",
                    content:"",
                    buttonText:"I’ve done this",
                    showCancelButton: false
                },
                3:{
                    step:3,
                    title:"Step 3 - Setup complete",
                    content:"",
                    buttonText:"Close",
                    showCancelButton: false
                }
            }
        }
        return(
            <div>
                 <Modal isOpen={this.props.openModal} onRequestClose={this.props.controlModal} style={customStyles} ariaHideApp={false} >
                    <div>
                      <ModalTitle title={modalContent[this.props.modal][this.state.step].title}/>
                      <ModalFooter onCancelClick = {this.props.controlModal} buttonText={modalContent[this.props.modal][this.state.step].buttonText}  onButtonClick={this.onButtonClick} showCancelButton = {modalContent[this.props.modal][this.state.step].showCancelButton} />
                    </div>    
                    <CloseButton onClick={this.props.controlModal}/>
                 </Modal>
            </div>
        )
    }
}

export default CompanySectionModal