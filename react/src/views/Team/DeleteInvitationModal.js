
import React, { Component } from 'react';
import axios from 'axios';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId,deleteInvitationByUserId} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import Notification from '../model/Notification';
import CloseButton from './../../components/Modal/CloseButton.js';
import Button from '../../components/Buttons/Button';

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
class DeleteInvitation extends Component {

  constructor(props) {
    super(props);
    this.state = {
     index:this.props.index,
     agentList: this.props.agentList,
     modalIsOpen:false,
     userStatus:""
    };
    this.deleteInvitation = this.deleteInvitation.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  deleteInvitation = () => {
    let params ={};
    params.invitedUser = this.props.userToBeDeleted.userId;
    return Promise.resolve(deleteInvitationByUserId(params)).then(response => {
      if (response && response.data.code == "SUCCESS") {
        this.props.getInvitedUsers();
        Notification.success('Invitation Deleted Successfully');

      }
    }).catch(err => {
      Notification.error('There was a problem while deleting Invitation');
    })
  }
    
  deleteUser () {
    var _this = this;
    this.props.onRequestClose();
    let userId = [];
    if(this.props.deleteInvitation){
      this.deleteInvitation();
    }else{
    userId.push(this.props.userToBeDeleted.userId);
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
      Notification.error('There was a problem while deleteing the agent');
    })
    }
  }

  render() {
    let deleteUserOrInvitationContent =this.props.deleteInvitation? "On deleting this invitation, the user will not be able to sign up using the invitation link that was sent earlier." : "On deleting this account, the user will not be able to log into this Kommunicate account. Though, this profile shall be visible in all existing conversations this user has been a part of.";
    return(
<Modal isOpen={this.props.isOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
<div>
  <div className="team-delete-modal-header">
    <p className="team-delete-modal-header-title" >Delete - <span className="team-delete-modal-header-title-user-name">{this.props.userToBeDeleted.displayName || this.props.userToBeDeleted.userId}</span></p>
  </div>
  <hr className="team-delete-modal-divider" />
  { !CommonUtils.isTrialPlan() &&
    <div className= {this.props.deleteInvitation ?"teammates-billing-update-container n-vis":"teammates-billing-update-container vis"}> 
      <div className="teammates-billing-update-text">
      Deleting a team member will automatically reduce the number of seats in your plan. Your bill will be adjusted on a pro-rata basis.
      </div>
    </div> 
  }
  <div className="team-delete-modal-content">
    <p>{deleteUserOrInvitationContent}</p>
    <p>Are you sure?</p>
    <div className="team-delete-modal-btn">
      <Button secondary className="team-delete-modal-cancel-btn" onClick = {this.props.onRequestClose}>Cancel</Button>
      <Button onClick= {this.deleteUser}>Yes, Delete</Button>
    </div>
  </div>
  </div>
  <CloseButton onClick={this.props.onRequestClose} />
</Modal>)
  }
}

DeleteInvitation.defaultProps={
  userToBeDeleted:{}
}

export default DeleteInvitation;