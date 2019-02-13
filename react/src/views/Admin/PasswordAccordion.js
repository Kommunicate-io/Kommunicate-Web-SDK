import React, { Component } from 'react';
import '../Settings/Installation/Accordion.css';
import {changePassword } from '../../utils/kommunicateClient';
import ApplozicClient from '../../utils/applozicClient'
import Notification from '../model/Notification';
import Modal from 'react-modal';
import CloseButton from '../../components/Modal/CloseButton';
import CommonUtils from '../../utils/CommonUtils';
import './Admin.css';
import Button from '../../components/Buttons/Button';
import { connect } from 'react-redux';
import {BlockButton} from '../../components/GeneralFunctionComponents/GeneralFunctionComponents'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    height: 'auto',
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
      if(this.state.currentPassword.length < 1 && !CommonUtils.isThirdPartyLogin(this.props.loginVia)) {
        Notification.error("Enter Your Current Password");
        console.log("Current password is not entered");
        return;
      }
      else if(this.state.newPassword.length < 6 && !CommonUtils.isThirdPartyLogin(this.props.loginVia)) {
        Notification.error("Your password must have at least 6 characters ");
        return;
      } else {
        this.handlePassword(e);
      }
    }

  handlePassword(e) {
    e.preventDefault();
    if (this.state.newPassword !== this.state.repeatPassword) {
      Notification.error("Password does not match");
      return;
    } else if (CommonUtils.isApplicationAdmin()) {
      let userSession = CommonUtils.getUserSession();
      let params = {
        currPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
        userName: userSession.userName,
        accessToken: this.state.currentPassword,
        applicationId: userSession.application.applicationId,
      }
      ApplozicClient.changeApplozicUserPassword(params).then(res => {
        if (res.data && res.data.status === "success") {
          this.clearPasswordfields(e);
          return;
        }
        Notification.error("Wrong password");
      })
    } else {
      changePassword({
        oldPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
        loginVia : this.props.loginVia
      }).then(data => {
        if (data === "SUCCESS"){
          CommonUtils.updateUserSession({"accessToken": this.state.newPassword});
          window.$kmApplozic.fn.applozic("updateAccessTokenOnPasswordReset", this.state.newPassword);
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
          <div className="km-change-password-container">
              <BlockButton title = {"Change Password"} subTitle = {"Update your password"} onClickOfBlock = {this.openForgotPasswordModal} name="change-password"/>
            <Modal isOpen={this.state.forgotPasswordModalOpen} ariaHideApp={false} onRequestClose={this.closeForgotPasswordModal} style={customStyles} shouldCloseOnOverlayClick={true}>
                  <div id="content-area" className="forgot-password-form-container"> 

                    <h2>Change Password</h2>
                    <hr/>
                    <form className="form-horizontal" autoComplete="off">

                      <div className="password-wrapper">
                        <div className="form-group row">
                          <div className="col-md-9">
                            <label  className={!CommonUtils.isThirdPartyLogin(this.props.loginVia)? "form-control-label" :"n-vis"}>Current Password:</label>
                            <input type="password" id="current-password-input" onKeyPress={this.handleKeyPress} name="current-password-input" className={!CommonUtils.isThirdPartyLogin(this.props.loginVia) ? "form-control input-field" :"n-vis"} onChange = {(event) => this.setState({currentPassword:event.target.value})} value={this.state.currentPassword} placeholder="Enter your current password"/><br/>
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
                        <Button secondary onClick={this.closeForgotPasswordModal}>Cancel</Button>
                        <Button primary className="m-left" autoFocus={true} type="submit" onClick={this.validatePassword}>Save changes</Button>
                      </div>
                    </div>

                  </div> 
                  <CloseButton onClick={this.closeForgotPasswordModal} />   
            </Modal>
            
          </div>
          
        );
       }    
}

const mapStateToProps = state => ({
  loginVia:state.login.loginVia
})

export default connect(mapStateToProps, null)(PasswordAccordion);