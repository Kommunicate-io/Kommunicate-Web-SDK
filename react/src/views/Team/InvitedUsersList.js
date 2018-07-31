import React, { Component } from 'react';
import axios from 'axios';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import Notification from '../model/Notification';
import { ROLE_TYPE } from '../../utils/Constant';
import StatusIcon from '../../components/StatusIcon/StatusIcon'


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

class invitedUsersList extends Component {

    constructor(props) {
      super(props);
      this.state = {
       index:this.props.index,
       agentList: this.props.agentList,
       modalIsOpen:false,
       userToBeDeleted:{},
      };
      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);
    }
    componentDidMount() {
      
    }

    deleteAgent  = () => {
      this.onCloseModal();
      let userId = this.state.userToBeDeleted.userId;
      return Promise.resolve(deleteUserByUserId(userId)).then(response => {
        if(response && response.data.code == "SUCCESS") {
          if (response.data.message == "DELETED SUCCESSFULLY"){
            Notification.success('Agent Deleted Successfully');
            this.props.getUsers();
          } else if (response.data.message == "USER DOES NOT EXIST OR ALREADY DELETED") {
            Notification.warning('Agent does not exist or already deleted');
          }
        }
      }).catch(err => {
        console.log(err.message.response.data);
        Notification.error('There was a problem while deleteing the agent');
      })

    }
    onOpenModal = (e) => {
      let index = e.target.dataset.index;
      index = parseInt(index.replace('delete', ''));
      let user = this.state.agentList[index].displayName || this.state.agentList[index].userId;
      let userToBeDeleted = {
        displayName: this.state.agentList[index].displayName,
        userId: this.state.agentList[index].userId
      }
      this.setState({ 
        modalIsOpen: true, 
        userToBeDeleted:user,
        userToBeDeleted:userToBeDeleted 
      });
    };

    onCloseModal = () => {
      this.setState({ modalIsOpen: false });
    };
    render() {
        var index= this.props.index;
        var loggedInUserId = this.props.loggedInUserId;
        var loggedInUserRoleType = this.props.loggedInUserRoleType;
        var deleteRef = "delete"+index;
        let roleType = this.props.user.roleType;
        var emailId = this.props.user.userId;
        let status = this.props.user.status
        return( 
                  <tr className="team-data-allign" >
                    <td>
                        <StatusIcon label = {"Invitaton sent"} indicator={"done"}  />
                    </td>
                    <td>
                      <div className = "km-truncate">{emailId}</div>
                      <div className="small text-muted">
                      </div>
                    </td>
                    <td>
                      { roleType == ROLE_TYPE.SUPER_ADMIN &&
                        <div className="teammates-user-role">Super Admin</div>
                      }
                      { roleType == ROLE_TYPE.ADMIN &&
                        <div className="teammates-user-role">Admin</div>
                      }
                      { roleType == ROLE_TYPE.AGENT &&
                        <div className="teammates-user-role">Agent</div>
                      }
                    </td>
                    <td>
                        { status == 0 &&
                          <span>Haven't signed up</span>
                        }
                    </td>
                    
                    <td className= "teammates-delete-icon"  >
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
                      { loggedInUserRoleType ==  ROLE_TYPE.ADMIN && roleType != ROLE_TYPE.SUPER_ADMIN &&         roleType != ROLE_TYPE.ADMIN &&
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
                    {/* <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
                    <div>
                      <div className="team-delete-modal-header">
                        <p className="team-delete-modal-header-title" >Delete - <span className="team-delete-modal-header-title-user-name">{this.state.userToBeDeleted.displayName || this.state.userToBeDeleted.userId}</span></p>
                      </div>
                      <hr className="team-delete-modal-divider" />
                      <div className="team-delete-modal-content">
                        <p>On deleting this account, the user will not be able to log into this Kommunicate account. Though, this profile shall be visible in all existing conversations this user has been a part of.</p>
                        <p>Are you sure?</p>
                        <div className="team-delete-modal-btn">
                        <button className="km-button km-button--secondary team-delete-modal-cancel-btn" onClick = {this.onCloseModal}>Cancel</button>
                        <button className="km-button km-button--primary" onClick= {this.deleteAgent}>Yes, Delete</button>
                        </div>
                      </div>
                      </div>
                      <span onClick={this.onCloseModal}><CloseButton /></span>
                    </Modal> */}
                  </tr>
        );
    }
}


export default invitedUsersList;
