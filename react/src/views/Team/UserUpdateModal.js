
import React, { Component } from 'react';
import axios from 'axios';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId,deleteInvitationByUserId, patchUserInfo} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import Notification from '../model/Notification';
import CloseButton from './../../components/Modal/CloseButton.js';
import UserRoleRadioButtonsTemplate from './UserRoleRadioButtonsTemplate'
import { ROLE_TYPE, ROLE_NAME } from '../../utils/Constant';
const customStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '580px',
      overflow: 'visible'
  }
};
class UserUpdateModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
     index:this.props.index,
     agentList: this.props.agentList,
     modalIsOpen:false,
     userStatus:"",
     selectedRole: ROLE_TYPE.AGENT,
     buttonDisabled: false,
    };
    this.deleteInvitation = this.deleteInvitation.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  componentDidMount = () => {
    this.setState({selectedRole:this.props.roleType})
    this.props.modalType == "edit" && this.setState({buttonDisabled:true})

  }
  handleRoleRadioBtn = (e) => {
    this.setState({
      buttonDisabled: this.props.roleType == e.target.getAttribute('data-value'),
      selectedRole: e.target.getAttribute('data-value')
    })
  }
  deleteInvitation = () => {
    let params ={};
    params.invitedUser = this.props.userToBeUpdated.userId;
    return Promise.resolve(deleteInvitationByUserId(params)).then(response => {
      if (response && response.data.code == "SUCCESS") {
        this.props.getInvitedUsers();
        Notification.success('Invitation Deleted Successfully');

      }
    }).catch(err => {
      Notification.error('There was a problem while deleting Invitation');
    })
  }
  updateUserRole = (data) => {
    let userSession = CommonUtils.getUserSession();
    let appId = userSession.application.applicationId;
    let users = this.props.usersList
    patchUserInfo({ "roleType": this.state.selectedRole }, this.props.userToBeUpdated.userId, appId).then(response => {
      Notification.success('Role has been updated');
      users.find(result => {
        if (result.userName == this.props.userToBeUpdated.userId){
            result.roleType = this.state.selectedRole;
            return users
          }
      });
      this.props.updateUserRoleOnUI(users)
    }).catch(err => {
      console.log("Error while updating application settings", err)
    })
  }
  updateUserInfo = () => {
    this.props.onRequestClose();
    this.props.modalType == "deleteUser" && this.deleteUser();
    this.props.modalType == "deleteInvite" && this.deleteInvitation();
    this.props.modalType == "edit" && this.updateUserRole();
  }
  deleteUser = () => {
    var _this = this;
    let userId = [];
    userId.push(this.props.userToBeUpdated.userId);
    return Promise.resolve(deleteUserByUserId(userId)).then(response => {
      if(response && response.code == "SUCCESS") {
        if (response.message.data[0].result === "DELETED SUCCESSFULLY"){
          Notification.success('Agent Deleted Successfully');
          _this.props.getUsers();
        } else if (response.message.data[0].result === "USER DOES NOT EXIST OR ALREADY DELETED") {
          Notification.warning('Agent does not exist or already deleted');
        }
      }
    }).catch(err => {
      Notification.error('There was a problem while deleting the agent');
    })
  }
  render() {
    const modalContent = {
      edit : {
        title:"Edit role of",
        buttonText:"Save",
        confirmationText:"",
        content: <UserRoleRadioButtonsTemplate handleOnChange={this.handleRoleRadioBtn} selectedRole={this.state.selectedRole} />
       
      },
      deleteUser:{
        title:"Delete-",
        buttonText:"Yes, Delete",
        confirmationText:"Are you sure?",
        content:"On deleting this account, the user will not be able to log into this Kommunicate account. Though, this profile shall be visible in all existing conversations this user has been a part of."
      },
      deleteInvite:{
        title:"Delete-",
        buttonText:"Yes, Delete",
        confirmationText:"Are you sure?",
        content:"On deleting this invitation, the user will not be able to sign up using the invitation link that was sent earlier."
      }
    }
    return (
      <Modal isOpen={this.props.isOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
        <div>
          <div className="team-delete-modal-header">
            <p className="team-delete-modal-header-title" >{ this.props.modalType && modalContent[this.props.modalType].title} <span className="team-delete-modal-header-title-user-name">{this.props.userToBeUpdated.displayName || this.props.userToBeUpdated.userId}</span></p>
          </div>
          <hr className="team-delete-modal-divider" />
          {!CommonUtils.isTrialPlan() && this.props.modalType == "deleteUser" &&
            <div className={this.props.deleteInvitation ? "teammates-billing-update-container n-vis" : "teammates-billing-update-container vis"}>
              <div className="teammates-billing-update-text">
                Deleting a team member will automatically reduce the number of seats in your plan. Your bill will be adjusted on a pro-rata basis.
              </div>
            </div>
          }
          <div className="team-delete-modal-content">  
            {this.props.modalType && modalContent[this.props.modalType].content}
            <p className="teammates-modal-confirmation-text">{this.props.modalType && modalContent[this.props.modalType].confirmationText}</p>
            <div className="team-delete-modal-btn">
              <button className="km-button km-button--secondary team-delete-modal-cancel-btn" onClick={this.props.onRequestClose}>Cancel</button>
              <button className="km-button km-button--primary" disabled ={this.state.buttonDisabled} data-button ={this.props.modalType && modalContent[this.props.modalType]} onClick={this.updateUserInfo}>{this.props.modalType && modalContent[this.props.modalType].buttonText}</button>
            </div>
          </div>
        </div>
        <CloseButton onClick={this.props.onRequestClose} />
      </Modal>)
  }
}

UserUpdateModal.defaultProps={
  userToBeUpdated:{}
}

export default UserUpdateModal;