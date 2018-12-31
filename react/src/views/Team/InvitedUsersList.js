import React, { Component } from 'react';
import { ROLE_NAME } from '../../utils/Constant';
import StatusIcon from '../../components/StatusIcon/StatusIcon'
import DeleteInvitation from '../Team/DeleteInvitationModal.js';
import Notification from '../model/Notification';
import { DeleteIcon,ResendIcon } from '../../assets/svg/svgs';
import { notifyThatEmailIsSent } from '../../utils/kommunicateClient';
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
  render() {
    var index = this.props.index;
    var deleteRef = "delete" + index;
    let roleType = this.props.user.roleType;
    var emailId = this.props.user.userId;
    return (
      <tr className="team-data-allign team-invite" >
        <td>
          <StatusIcon label={"Invitaton sent"} indicator={"done"} />
        </td>
        <td>
          <div className="km-truncate">{emailId}</div>
          <div className="small text-muted">
          </div>
        </td>
        <td>
        <div className="teammates-user-role tm-invite-user-role">{ROLE_NAME[roleType]}</div>
        </td>
        <td>
          <span className="tm-invite-status-havent-signed-up">Haven't signed up</span>
        </td>
        <DeleteInvitation isOpen={this.state.modalIsOpen} getInvitedUsers ={this.props.getInvitedUsers} agentList ={this.props.agentList}  userToBeDeleted ={this.state.userToBeDeleted}deleteInvitation ={true} onRequestClose={this.onCloseModal} ariaHideApp={false}>}</DeleteInvitation>
        <td className="teammates-resend-icon team-invite-list-delete"  >
          <span onClick={this.sendMail} data-index={deleteRef} className="teammates-delete-wrapper km-delete-invitation">
            <ResendIcon/>
            Resend
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
