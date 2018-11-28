import React, { Component } from 'react';
import '../Settings/Installation/Accordion.css';
import {changePassword } from '../../utils/kommunicateClient';
import ApplozicClient from '../../utils/applozicClient'
import Notification from '../model/Notification';
import Modal from 'react-modal';
import CloseButton from '../../components/Modal/CloseButton';
import CommonUtils from '../../utils/CommonUtils';
import './Admin.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    height: '450px',
    maxWidth: '500px',
    overflow: 'visible'
  }
};

class PasswordAccordion extends Component {

  
    constructor(props) {
      super(props);
      this.state =  {
        dropDown:false,
        currentPassword: '',
        newPassword: '',
        repeatPassword:'',
        forgotPasswordModalOpen: false,
      };
      this.data=this.props.data;
      this.handleClick = this.handleClick.bind(this);
      this.handlePassword = this.handlePassword.bind(this);
      this.validatePassword = this.validatePassword.bind(this);
      this.clearPasswordfields = this.clearPasswordfields.bind(this);
      this.openForgotPasswordModal = this.openForgotPasswordModal.bind(this);
      this.closeForgotPasswordModal = this.closeForgotPasswordModal.bind(this);
    }

    handleClick (e) { 
      e.preventDefault();
      this.setState({
        dropDown: !this.state.dropDown
      }); 
    }

    openForgotPasswordModal() {
      this.setState({ forgotPasswordModalOpen: true });
    }

    closeForgotPasswordModal(e) {
      e.stopPropagation();
      this.setState({ forgotPasswordModalOpen: false });
    }

    validatePassword(e) {
      e.preventDefault();
      if(this.state.currentPassword.length < 1) {
        Notification.info("Enter Your Current Password");
        console.log("Current password is not entered");
        return;
      }
      else if(this.state.newPassword.length < 6) {
        Notification.info("Your password must have at least 6 characters ");
        return;
      } else {
        this.handlePassword(e);
      }
    }

    handlePassword(e) {
      e.preventDefault(); 
      var isKommunicateUser = {}     
      if (this.state.newPassword !== this.state.repeatPassword){
        Notification.info("Password does not match");
        return;   
      } else if(isKommunicateUser){
        changePassword({
          oldPassword : this.state.currentPassword,
          newPassword: this.state.newPassword,
        }).then(data => {
          if(data === "SUCCESS")
            this.clearPasswordfields(e);
        })
      }else{
        let userSession = CommonUtils.getUserSession();
        let params = {
          currPassword:this.state.currentPassword,
          newPassword:this.state.newPassword,
          confirmPassword:this.state.repeatPassword,
          userName:userSession.userName,
          accessToken:this.state.currentPassword,
          applicationId:userSession.application.applicationId
        } 
        ApplozicClient.changeApplozicUserPassword(params).then(data=>{
          if(data === "SUCCESS"){
            this.clearPasswordfields(e);
          }   
        }) 
      }
    }

    clearPasswordfields(e) {
      this.setState({
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
        rePassword: ''
      });
      this.closeForgotPasswordModal(e);
    }

    render () {
        return (
          <div className="forgot-password-container change-courser" onClick={this.openForgotPasswordModal}>
            <div className="forgot-password-texts">
              <h2>Change Password</h2>
              <p>Update your password</p>
            </div>
            <div className="forgot-password-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"/>
              </svg>
            </div>

            <Modal isOpen={this.state.forgotPasswordModalOpen} ariaHideApp={false} onRequestClose={this.closeForgotPasswordModal} style={customStyles} shouldCloseOnOverlayClick={true}>
                  <div id="content-area" className="forgot-password-form-container"> 

                    <h2>Change Password</h2>
                    <hr/>
                    <form className="form-horizontal" autoComplete="off">

                      <div className="password-wrapper">
                        <div className="form-group row">
                          <div className="col-md-9">
                            <label className="form-control-label">Current Password:</label>
                            <input type="password" id="current-password-input" onKeyPress={this.handleKeyPress} name="current-password-input" className="form-control input-field" onChange = {(event) => this.setState({currentPassword:event.target.value})} value={this.state.currentPassword} placeholder="Enter your current password"/><br/>
                          </div>
                          <div className="col-md-9">
                            <label className="form-control-label">New Password:</label>
                            <input type="password" id="new-password-input" name="new-password-input" className="form-control input-field" onChange = {(event) => this.setState({newPassword:event.target.value})} value={this.state.newPassword} placeholder="Enter your new password"/>
                            <div className="about-password-text">Your password must have at least 6 characters</div>
                            <br/>
                          </div>
                          <div className="col-md-9">
                            <label className="form-control-label">Re-type New Password:</label>
                            <input type="password" id="re-new-password-input" name="re-new-password-input" className="form-control input-field" onChange = {(event) => this.setState({repeatPassword:event.target.value})} value={this.state.repeatPassword} placeholder="Enter your new password"/><br/>
                          </div>
                        </div>                        
                      </div>
                    </form>

                    <div className="form-group row">
                      <div className="col-md-12 text-right">
                        <button className="km-button km-button--secondary" onClick={this.closeForgotPasswordModal}>Cancel</button>
                        <button className="km-button km-button--primary m-left" autoFocus={true} type="submit" onClick={this.validatePassword}>Save changes</button>
                      </div>
                    </div>

                  </div> 
                  <CloseButton onClick={this.closeForgotPasswordModal} />   
            </Modal>
            
          </div>
          
        );
       }    
}
export default PasswordAccordion;