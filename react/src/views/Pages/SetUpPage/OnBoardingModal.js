import React, { Component } from 'react';
import { connect } from 'react-redux'
import Modal from 'react-modal';
import CardList from './CardList'
import {SendEmailIcon, CodeIcon, BackIcon} from '../../../assets/svg/svgs'
import './onBoardingModal.css'
import { getJsCode} from '../../../utils/customerSetUp';
import AnalyticsTracking from '../../../utils/AnalyticsTracking';
import Notification from '../../model/Notification';
import InputField from '../../../components/InputField/InputField'
import { notifyThatEmailIsSent } from '../../../utils/kommunicateClient';
import {Link} from 'react-router-dom' ;
import * as SignUpActions from '../../../actions/signupAction'
import CommonUtils from '../../../utils/CommonUtils.js';


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
const mailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
class OnBoardingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: true,
            script:"",
            email:"",
            handleUserNameBlur:"",
            selectedCard:"on-boarding-card-list",
            copyText:"Copy code"
        }
        // this.openModal = this.openModal.bind(this);
        // this.closeModal = this.closeModal.bind(this);
        // this.closeOnboardingModal = this.closeOnboardingModal(this) 
    }
    componentDidMount = () => {
        this.setState({
            script: getJsCode()[0],
            yourApplicationId: getJsCode()[1],
          })
    }
    copyToClipboard = e => {
        e.preventDefault();
        this.textArea.select();
        document.execCommand("copy");
        e.target.focus();
        Notification.info("Code copied successfully!");
        AnalyticsTracking.acEventTrigger("integration.instructions.copycode");
        this.setState({copyText:"Copied"})
    };
    sendInstruction = () => {
        let email = this.state.email.trim();
        if (email.match(mailFormat)) { 
            notifyThatEmailIsSent({
                to: email,
                templateName:"INSTALLATION_INSTRUCTIONS"
            }).then(data => {
                if(data && data.data && data.data.code == "SUCCESS") {
                    Notification.success("Email sent");
                    this.closeModal();
                }
            }).catch(err=> {
                console.log(err);
            });
        } else {
            Notification.error(email + " is an invalid Email");
            return false;
        }
    }
    reDirectToInstallSection = () => {
        this.closeModal();
        //window.location.assign("/settings/install");
    }
    closeModal = () => {
        this.setState({ openModal: false });
        this.props.updateModalStatus(true);
    }
    handleCardClick = (e) => {
        if (CommonUtils.isProductApplozic()) {
            this.closeModal();
            window.appHistory.push("/settings/install");
        } else {
            let selectedCard = e.target.dataset.card;
            this.setState({selectedCard:selectedCard});
        }
    }
    showCardList = () => {
        this.setState({
            selectedCard:"on-boarding-card-list",
            copyText:"Copy code"
        })
    }
    render() {
        return (
            <div>
            <Modal isOpen={this.state.openModal} onRequestClose={this.closeModal} style={customStyles} ariaHideApp={false} shouldCloseOnOverlayClick={false}>
                <div className="installation-modal-wrapper">
                    <p className="installation-modal-title">Add {CommonUtils.getProductName()} to your product</p>
                    <p className="installation-modal-sub-title">You are almost there. We are waiting for you on the other side!</p>
                </div>
                { this.state.selectedCard == "on-boarding-card-list" && // modal step-1
                    <div className="on-boarding-card-list" data-card="on-boarding-card-list">
                        <CardList img ={<CodeIcon />} title={"Install the code myself"} content={CommonUtils.isProductApplozic() ? "You just need to copy and paste the code in your mobile and web apps":"You just need to copy and paste the Javascript code in your website"} handleClick ={this.handleCardClick} card={"install-myself"}/>
                        <CardList img ={<SendEmailIcon />} title={"Ask a teammate to install the code"} content={"Send an email to your teammate with installation instructions"} card={"send-instruction"} handleClick ={this.handleCardClick}/>
                        <div className="skip-install-on-boarding-modal-wrapper">
                            <span className="skip-install-on-boarding-modal brand-color" onClick={this.closeModal}>I will do it later</span>
                        </div>    
                    </div>
                }
                {   this.state.selectedCard == "install-myself" &&
                    <div className="install-modal-wrapper">
                        <p className="install-modal-description-1">Paste the code just above the <span className="install-modal-head-tag">&lt;/head&gt;</span> tag on every page you want the chat widget to appear </p>
                        <div className="install-modal-copy-code-button-wrapper">
                            {document.queryCommandSupported("copy") && (
                                <button
                                    type="button"
                                    className="copy-code-btn km-button km-button--secondary"
                                    onClick={this.copyToClipboard}
                                >
                                {this.state.copyText}
                                </button>
                            )}
                        </div>
                        <textarea
                        className="script-text-area"
                        ref={textarea => (this.textArea = textarea)}
                        rows="7"
                        value={this.state.script}
                        readOnly
                        />
                        <p className="install-modal-description-2">Want to install Kommunicate in some other channel (Android, iOS, Wordpress etc)? Head over to the <span className="install-modal-link" onClick={this.reDirectToInstallSection}>
                        <Link to="/settings/install" >Install</Link>
                        </span> section </p>
                        <div className="modal-install-btn-wrapper">
                            <span className="on-boarding-modal-back-btn" onClick={this.showCardList}><BackIcon />  Back</span>
                            <button className="km-button km-button--primary install-modal-done-btn" onClick={this.closeModal}>Done</button>
                        </div>
                    </div>

                }
                { this.state.selectedCard == "send-instruction" &&
                    <div className="on-boarding-send-instruction-modal">
                        <p className="on-boarding-send-instruction-modal-description">Send an email to your teammate with installation instructions</p>
                        <input type="text" id="email-field" placeholder="Enter email address" 
                          onChange={(e) => {
                            let email = this.state.email;
                            email = e.target.value;
                            this.setState({ email: email })
                          }} 
                          onKeyPress={ (e) => {
                            if (e.charCode === 13) this.sendInstruction()
                            }} />
                        <button className="km-button km-button--primary on-boarding-send-instruction-modal-go-btn" onClick={this.sendInstruction}>Go</button>
                        <div className="on-boarding-send-instruction-btn-set">
                            <span className="on-boarding-modal-back-btn" onClick={this.showCardList}><BackIcon />  Back</span>
                        </div>
                    </div>
                }
            </Modal>
        </div>
        )
    }

}
const mapDispatchToProps = dispatch => {
    return {
        updateModalStatus: payload => dispatch(SignUpActions.updateDetailsOnSignup("UPDATE_KM_ON_BOARDING_MODAL_STATUS",payload))
    }
}
export default connect(null,mapDispatchToProps)(OnBoardingModal)