import React, { Component } from 'react';
import { ROLE_NAME } from '../../utils/Constant';
import StatusIcon from '../../components/StatusIcon/StatusIcon'
import UserUpdateModal from '../Team/UserUpdateModal.js';
import Notification from '../model/Notification';
import { DeleteIcon,ResendIcon, CopyIcon } from '../../assets/svg/svgs';
import { notifyThatEmailIsSent } from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils'
import { getConfig } from '../../config/config';
import copy from 'copy-to-clipboard';
class invitedUsersList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      modalIsOpen: false,
      agentList: this.props.agentList,
      isDeleteInvitaion :true,
      userToBeDeleted: this.props.user.userId
    };
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.sendMail =this.sendMail.bind(this);
  }

  sendMail =(e) =>{
    console.log("Inside send mail",this.props.user);
    let email = this.props.user.userId;
    let roleType = this.props.user.roleType;
    let mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    if (email.match(mailformat)) {
      return Promise.resolve(notifyThatEmailIsSent({ to: email, templateName: "INVITE_TEAM_MAIL", roleType:roleType ,'resendMail':true})).then(response => {
        if (response.data && response.data.code === "SUCCESS") {
          Notification.success('Invitation sent successfully');
        }
      }).catch(err => {
        Notification.error("Something went wrong!")
        console.log("error while inviting an user", err.message.response.data);
      })
    }
  }

  onOpenModal = (e) => {
    let index = e.target.dataset.index;
    index = parseInt(index.replace('delete', ''));
    let user = this.props.user.displayName || this.props.user.userId;
    let userToBeDeleted = {
      displayName: user,
      userId: this.props.user.userId
    }
    this.setState({ 
      modalIsOpen: true,
      userToBeDeleted:userToBeDeleted
    });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };

  copyToClipboard = (e) => {
    let product = CommonUtils.getProduct();
    let userSession = CommonUtils.getUserSession();
    let botAgentMap = Object.values(CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP"));
    let invitedBy;

    if(this.props.user.invitedBy === userSession.userKey) {
      invitedBy = userSession.email;
    } else {
      for (var i=0, len = botAgentMap.length; i < len; i++) {
        if(this.props.user.invitedBy === botAgentMap[i].userKey) {
          invitedBy = botAgentMap[i].userKey;
          return;
        }
      }
    }

    let inviteUrl = getConfig().kommunicateDashboardUrl + "/signup?invite=true&token=" + this.props.user.id + "&referer=" + invitedBy + "&product=" + product;

    copy(inviteUrl);
    Notification.success("Invite link copied successfully.");

  };


  render() {
    var index = this.props.index;
    var deleteRef = "delete" + index;
    let roleType = this.props.user.roleType;
    var emailId = this.props.user.userId;
    return (
      <tr className="team-data-align team-invite" >
        <td>
          <StatusIcon label={"Invitaton sent"} indicator={"done"} />
        </td>
        <td>
          <div className="km-truncate">{emailId}</div>
          <div className="small text-muted">
          </div>
        </td>
        <td>
        <div className="teammates-user-role tm-invite-user-role">{ROLE_NAME[roleType].name}</div>
        </td>
        <td>
          <span className="tm-invite-status-havent-signed-up">Haven't signed up</span>
        </td>
        <UserUpdateModal isOpen={this.state.modalIsOpen} getInvitedUsers ={this.props.getInvitedUsers} agentList ={this.props.agentList}  userToBeDeleted ={this.state.userToBeDeleted}deleteInvitation ={true} onRequestClose={this.onCloseModal} modalType={"deleteInvite"} ariaHideApp={false} getUsers={this.props.getUsers}/>
        <td className="teammates-resend-icon team-invite-list-delete"  >
          <span onClick={this.sendMail} data-index={deleteRef} className="teammates-delete-wrapper km-delete-invitation">
            <ResendIcon/>
            Resend
                        </span>
        </td>
        <td className="teammates-resend-icon team-invite-list-delete" title="Copy Invite Link" >
          <span onClick={this.copyToClipboard} className="teammates-delete-wrapper km-delete-invitation">
            <CopyIcon/>
            Invite link
          </span>
        </td>

        <td className="team-invite-list-delete"  >
          <span onClick={this.onOpenModal} data-index={deleteRef} className="teammates-delete-wrapper km-delete-invitation">
            <DeleteIcon/>
            Delete
                        </span>
        </td>
      </tr>
    );
  }
}


export default invitedUsersList;
