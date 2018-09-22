import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { getConfig } from '../../config/config.js';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import Notification from '../model/Notification';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator.js';
import { ROLE_TYPE } from '../../utils/Constant';



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

class UserItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
       index:this.props.index,
       agentList: this.props.agentList,
       modalIsOpen:false,
       userToBeDeleted:{},
       userStatus:""
      };
      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);
    }
    handleClick() {
      var user = this.props.user;
      var groupName = CommonUtils.getDisplayName(user);
      var agentId = window.$kmApplozic.fn.applozic("getLoggedInUser");
      var conversationDetail = {
        agentId: agentId,
        botIds: ["bot"],
        //groupName: [agentId, user.userId].sort().join().replace(/,/g, "_").substring(0, 250),
        groupName: groupName,
        type: 10,
        admin: agentId,
        users: [{"userId":user.userId,"groupRole":3}], //userId of user
        //clientGroupId: ''
      };

      window.$kmApplozic.fn.applozic("createGroup", {
        //createUrl: getConfig().kommunicateApi+"/conversations/create",
        groupName: conversationDetail.groupName,
        type: conversationDetail.type,
        admin: conversationDetail.agentId,
        users: conversationDetail.users,
        clientGroupId:conversationDetail.clientGroupId,
        metadata: {
            CREATE_GROUP_MESSAGE: "",
            REMOVE_MEMBER_MESSAGE: "",
            ADD_MEMBER_MESSAGE: "",
            JOIN_MEMBER_MESSAGE: "",
            GROUP_NAME_CHANGE_MESSAGE: "",
            GROUP_ICON_CHANGE_MESSAGE: "",
            GROUP_LEFT_MESSAGE: "",
            DELETED_GROUP_MESSAGE: "",
            GROUP_USER_ROLE_UPDATED_MESSAGE: "",
            GROUP_META_DATA_UPDATED_MESSAGE: "",
            CONVERSATION_ASSIGNEE: conversationDetail.agentId,
            KM_CONVERSATION_TITLE:conversationDetail.groupName,
            //ALERT: "false",
            HIDE: "true",
            WELCOME_MESSAGE:""
        },
        callback: function (response) {
            // console.log("response", response);
            if (response.status === 'success') {
              window.$kmApplozic.fn.applozic('loadGroupTab', response.groupId);
              window.appHistory.push("/conversations");
            }
        }
      });
    }

    getContactImageByAlphabet() {
      var displayIconColor;
      var user = this.props.user;
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
    
    deleteUser  = () => {
      this.onCloseModal();
      let userId = [];
      userId.push(this.state.userToBeDeleted.userId);
      return Promise.resolve(deleteUserByUserId(userId)).then(response => {
        if(response && response.data.code == "SUCCESS") {
          if (response.message.data[0].result == "DELETED SUCCESSFULLY"){
            Notification.success('Agent Deleted Successfully');
            this.props.getUsers();
          } else if (response.message.data[0].result == "USER DOES NOT EXIST OR ALREADY DELETED") {
            Notification.warning('Agent does not exist or already deleted');
          }
        }
      }).catch(err => {
        // console.log(err.message.response.data);
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
        var conversationStyle = {
          textDecoration: 'underline',
          color: '#0000EE'
        };
        var index= this.props.index;
        var loggedInUserId = this.props.loggedInUserId;
        var loggedInUserRoleType = this.props.loggedInUserRoleType;
        var deleteRef = "delete"+index;
        var agentList = this.props.agentList;
        var conversationClass = this.props.hideConversation ? 'n-vis': 'vis';
        var user = this.props.user;
        let isOnline = this.props.isOnline;
        let isAway = this.props.isAway;
        let roleType = this.props.roleType;
        var emailId = user.email;
        var displayName = user.displayName || "";
        // var displayName = CommonUtils.getDisplayName(user);
        var online = (user.connected === true) ? 'avatar-status badge-success ':'n-vis';
        var latestConversation = user.messagePxy?user.messagePxy.message:null;
        var lastMessageTime = user.messagePxy?(window.$kmApplozic.fn.applozic('getDateTime',user.messagePxy.createdAtTime)):'';
        var asignee = user.assignee?user.assignee:"";
        var groupId = user.messagePxy?user.messagePxy.groupId:"";
        var image = (user.imageLink) ? (user.imageLink):'';
        var imageExpr = (user.imageLink) ? 'img-avatar vis' :'n-vis';
        var nameExpr = (user.imageLink) ? 'n-vis' :'km-alpha-contact-image vis';
        var name = displayName.charAt(0).toUpperCase();
        var createdAtTime = window.$kmApplozic.fn.applozic('getDateTime',user.createdAtTime);
        var lastLoggedInAtTime = (typeof user.lastLoggedInAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastLoggedInAtTime)): '';
        var lastSeenAt = (typeof user.lastSeenAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastSeenAtTime)):lastLoggedInAtTime;
        return( 
                  <tr className="team-data-allign" >
                    <td>
                      <div className="team-name-avatar-wrapper">
                        <div className="avatar">
                          <img src={user.imageLink} className= {imageExpr}/>
                          <div className ={nameExpr}>
                            {this.getContactImageByAlphabet()}
                          </div>
                          {/* <span className={online}></span> */}
                        </div>
                        <div className="team-displayname">{displayName}</div>
                      </div>  
                    </td>
                    <td>
                      <div className = "km-truncate">{emailId}</div>
                      <div className="small text-muted">
                      </div>
                    </td>
                    {/* Last Actitvity
                    <td>
                      <div className="small text-muted">Last Seen</div>
                      <strong>{lastSeenAt}</strong>
                      <div className="small text-muted">Last Loggedin at {lastLoggedInAtTime} </div>
                    </td> */}
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
                    <td>{ !isAway &&
                          <div className="small text-muted">  <StatusIndicator label = { isOnline ? "Online" : "Offline"} indicator={isOnline ? "success" : "muted"} /> </div>
                        }
                        { isAway &&
                           <div className="small text-muted">  <StatusIndicator label = {"Away"} indicator={"warning"} /> </div>
                        }
                    </td>
                    
                    <td className= "teammates-delete-icon"  >
                      {/* show delete btn for agents and admins if loggedin user is an super admin */}
                      { loggedInUserRoleType ==  ROLE_TYPE.SUPER_ADMIN && roleType != ROLE_TYPE.SUPER_ADMIN &&
                        <span onClick ={this.onOpenModal}  data-index= {deleteRef}    className="teammates-delete-wrapper km-teammates-delete-visibility">
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
                        <span onClick ={this.onOpenModal}  data-index= {deleteRef}    className="teammates-delete-wrapper km-teammates-delete-visibility">
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
                      <div className="teammates-billing-update-container">
                        <div className="teammates-billing-update-text">
                        Deleting a team member will automatically reduce the number of seats in your plan. Your bill will be adjusted on a pro-rata basis.
                        </div>
                      </div>
                      <div className="team-delete-modal-content">
                        <p>On deleting this account, the user will not be able to log into this Kommunicate account. Though, this profile shall be visible in all existing conversations this user has been a part of.</p>
                        <p>Are you sure?</p>
                        <div className="team-delete-modal-btn">
                        <button className="km-button km-button--secondary team-delete-modal-cancel-btn" onClick = {this.onCloseModal}>Cancel</button>
                        <button className="km-button km-button--primary" onClick= {this.deleteUser}>Yes, Delete</button>
                        </div>
                      </div>
                      </div>
                      <span onClick={this.onCloseModal}><CloseButton /></span>
                    </Modal>
                    {this.props.hideConversation == "true" ?
                        null
                        :

                        <td className="km-conversation-tab-link" data-km-id={groupId+''} data-isgroup="true">
                          <span style={conversationStyle} className="km-truncate-block">

                          {latestConversation == null ?
                            <button type="submit" className="btn btn-sm btn-primary"  onClick={(event) => this.handleClick(event)}>Start New</button>
                            :
                            latestConversation
                          }

                          </span>
                          <div className="small text-muted">{lastMessageTime} </div>
                        </td>
                    }

                    {this.props.hideConversation == "true" ?
                        null
                        :
                        <td className="n-vis">
                          <div>{asignee}</div>
                          <div className="small text-muted">
                          </div>
                        </td>
                    }

                    <td className="text-center n-vis">
                      <img src={'img/flags/USA.png'} alt="USA" style={{height: 24 + 'px'}}/>
                    </td>
                    <td className="n-vis">
                      <div className="clearfix n-vis">
                        <div className="float-left">
                          <strong>50%</strong>
                        </div>
                        <div className="float-right">
                          <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                        </div>
                      </div>
                      <Progress className="progress-xs n-vis" color="success" value="50" />
                    </td>
                    <td className="text-center n-vis">
                      <i className="fa fa-cc-mastercard" style={{fontSize: 24 + 'px'}}></i>
                    </td>
                    <td className="n-vis">
                      <div className="small text-muted n-vis">Last Seen</div>
                      <strong className="n-vis">{lastSeenAt}</strong>
                    </td>
                  </tr>
        );
    }
}


export default UserItem;
