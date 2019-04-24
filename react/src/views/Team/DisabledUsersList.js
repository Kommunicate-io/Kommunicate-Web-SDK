import React, { Component } from 'react';
import axios from 'axios';
import CommonUtils from '../../utils/CommonUtils.js';
import { deleteUserByUserId } from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import Notification from '../model/Notification';
import { ROLE_TYPE, ROLE_NAME } from '../../utils/Constant';
import StatusIcon from '../../components/StatusIcon/StatusIcon';
import Button from '../../components/Buttons/Button';
import './team.css';


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

class DisabledUsersList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      disabledUsers: this.props.disabledUsers,
      modalIsOpen: false,
      userToBeDeleted: {},
      
    };
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  getContactImageByAlphabet() {
    var displayIconColor;
    var user = this.props.moreUserInfo;
    var displayName = CommonUtils.getDisplayName(user);
    var name = displayName.charAt(0).toUpperCase();
    if (typeof name !== "string" || typeof name === 'undefined' || name === "") {
      return <span className="km-contact-icon km-icon-user km-alpha-user">{name}</span>;
    }
    var first_alpha = name.charAt(0);
    var letters = /^[a-zA-Z0-9]+$/;
    if (first_alpha.match(letters)) {
      first_alpha = "alpha_" + first_alpha.toUpperCase();
      return <span className={`km-contact-icon ${first_alpha}`}>{name}</span>;
    }
    else {
      return <span className="km-contact-icon alpha_user">{name}</span>;
    }
  }

  deleteUser = () => {
    this.onCloseModal();
    let userId = this.state.userToBeDeleted.userId;
    return Promise.resolve(deleteUserByUserId(userId)).then(response => {
      if (response && response.data.code == "SUCCESS") {
        if (response.data.message == "DELETED SUCCESSFULLY") {
          Notification.success('Agent Deleted Successfully');
          this.props.getUsers();
        } else if (response.data.message == "USER DOES NOT EXIST OR ALREADY DELETED") {
          Notification.warning('Agent does not exist or already deleted');
        }
      }
    }).catch(err => {
      console.log(err);
      Notification.error('There was a problem while deleteing the agent');
    })

  }
  onOpenModal = (e) => {
    let index = e.target.dataset.index;
    index = parseInt(index.replace('delete', ''));
    let user = this.state.disabledUsers[index].name || this.state.disabledUsers[index].userName;
    let userToBeDeleted = {
      displayName: this.state.disabledUsers[index].name,
      userId: this.state.disabledUsers[index].userName
    }
    this.setState({
      modalIsOpen: true,
      user: user,
      userToBeDeleted: userToBeDeleted
    });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    var user = this.props.user;
    let moreUserInfo = this.props.moreUserInfo
    var name = user.name;
    var email = user.userName;
    var roleType = user.roleType;
    var deleteRef = "delete"+this.props.index;
    var loggedInUserRoleType = this.props.loggedInUserRoleType;
    var image = (moreUserInfo.imageLink) ? (moreUserInfo.imageLink):'';
    var imageExpr = (moreUserInfo.imageLink) ? 'img-avatar vis' :'n-vis';
    var nameExpr = (moreUserInfo.imageLink) ? 'n-vis' :'km-alpha-contact-image vis';

    return (    
                <tr className="team-data-align team-expired-data-allign" >
                  <td className="team-expired-data-td">
                    <div className="team-name-avatar-wrapper">
                      <div className="avatar">
                        <img src={moreUserInfo.imageLink} className= {imageExpr}/>
                        <div className ={nameExpr}>
                          {this.getContactImageByAlphabet()}
                        </div>
                      </div>
                      <div className="team-displayname">{name}</div>
                    </div>
                  </td>
                  <td className="team-expired-data-td">
                    <div className="km-truncate">{email}</div>
                    <div className="small text-muted">
                    </div>
                  </td>
                  <td className="team-expired-data-td">
                    <div className="teammates-user-role">{ROLE_NAME[roleType].name}</div>
                  </td>
                  <td className="teammates-delete-icon team-expired-data-td">
                    {/* show delete btn for agents and admins if loggedin user is an super admin */}
                    { loggedInUserRoleType ==  ROLE_TYPE.SUPER_ADMIN && roleType != ROLE_TYPE.SUPER_ADMIN &&
              <span onClick ={this.onOpenModal}  data-index= {deleteRef}    className="teammates-delete-wrapper">
                <svg data-index= {deleteRef} xmlns="http://www.w3.org/2000/svg" width="10"    height="12" viewBox="0 0 10 12">
                  <g fill="#8B8888" fillRule="nonzero">
                    <path d="M.357 2.5a.357.357 0 0 1 0-.714h9.286a.357.357 0 1 1 0 .714H.357zM5.357 8.929a.357.357 0 1 1-.714 0v-5a.357.357 0 0 1 .714 0v5zM3.928 8.903a.357.357 0 1 1-.713.051l-.357-5a.357.357 0 0 1 .713-.05l.357 5zM6.785 8.954a.357.357 0 1 1-.713-.05l.357-5a.357.357 0 1 1 .713.05l-.357 5z"/>
                    <path d="M3.214 2.143a.357.357 0 1 1-.714 0v-.714C2.5.837 2.98.357 3.571.357H6.43C7.02.357 7.5.837 7.5 1.43v.714a.357.357 0 1 1-.714 0v-.714a.357.357 0 0 0-.357-.358H3.57a.357.357 0 0 0-.357.358v.714z"/>
                    <path d="M.716 2.173a.357.357 0 0 1 .355-.387H8.93c.209 0 .373.178.355.387l-.66 7.916c-.046.555-.51.982-1.067.982H2.443a1.071 1.071 0 0 1-1.068-.982l-.66-7.916zm.744.327l.627 7.53c.015.185.17.327.356.327h5.114c.186 0 .34-.142.356-.327L8.54 2.5H1.46z"/>
                  </g>
                </svg>
                Delete
              </span>
            }
                    {/* show delete btn only for agents if loggedin user is an admin */}
                    { loggedInUserRoleType ==  ROLE_TYPE.ADMIN && roleType != ROLE_TYPE.SUPER_ADMIN && roleType != ROLE_TYPE.ADMIN &&
              <span onClick ={this.onOpenModal}  data-index= {deleteRef}    className="teammates-delete-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12">
                  <g fill="#8B8888" fillRule="nonzero">
                    <path d="M.357 2.5a.357.357 0 0 1 0-.714h9.286a.357.357 0 1 1 0 .714H.357zM5.357 8.929a.357.357 0 1 1-.714 0v-5a.357.357 0 0 1 .714 0v5zM3.928 8.903a.357.357 0 1 1-.713.051l-.357-5a.357.357 0 0 1 .713-.05l.357 5zM6.785 8.954a.357.357 0 1 1-.713-.05l.357-5a.357.357 0 1 1 .713.05l-.357 5z"/>
                    <path d="M3.214 2.143a.357.357 0 1 1-.714 0v-.714C2.5.837 2.98.357 3.571.357H6.43C7.02.357 7.5.837 7.5 1.43v.714a.357.357 0 1 1-.714 0v-.714a.357.357 0 0 0-.357-.358H3.57a.357.357 0 0 0-.357.358v.714z"/>
                    <path d="M.716 2.173a.357.357 0 0 1 .355-.387H8.93c.209 0 .373.178.355.387l-.66 7.916c-.046.555-.51.982-1.067.982H2.443a1.071 1.071 0 0 1-1.068-.982l-.66-7.916zm.744.327l.627 7.53c.015.185.17.327.356.327h5.114c.186 0 .34-.142.356-.327L8.54 2.5H1.46z"/>
                  </g>
                </svg>
                Delete
              </span>
            }
          </td>
          <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
                    <div>
                      <div className="team-delete-modal-header">
                        <p className="team-delete-modal-header-title" >Delete - <span className="team-delete-modal-header-title-user-name">{this.state.userToBeDeleted.displayName || this.state.userToBeDeleted.userId}</span></p>
                      </div>
                      <hr className="team-delete-modal-divider" />
                      <div className="team-delete-modal-content">
                        <p>On deleting this account, the user will not be able to log into this Kommunicate account. Though, this profile shall be visible in all existing conversations this user has been a part of.</p>
                        <p>Are you sure?</p>
                        <div className="team-delete-modal-btn">
                        <Button secondary className="team-delete-modal-cancel-btn" onClick = {this.onCloseModal}>Cancel</Button>
                        <Button primary onClick= {this.deleteUser}>Yes, Delete</Button>
                        </div>
                      </div>
                      </div>
                      <CloseButton onClick={this.onCloseModal} />
                    </Modal>
                </tr>
                
    );
  }
}


export default DisabledUsersList;
