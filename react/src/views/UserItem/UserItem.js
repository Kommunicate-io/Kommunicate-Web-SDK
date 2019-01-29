import React, { Component } from 'react';
import { /*Dropdown, DropdownMenu, DropdownItem,*/ Progress } from 'reactstrap';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import Notification from '../model/Notification';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator.js';
import { ROLE_TYPE, ROLE_NAME } from '../../utils/Constant';
import DeleteInvitation from '../Team/DeleteInvitationModal.js';



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
  
    getContactImageByAlphabet() {
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
    
    onOpenModal = (e) => {
      let index = e.target.dataset.index;
      index = parseInt(index.replace('delete', ''));
      let user = this.state.agentList[index].displayName || this.state.agentList[index].userId;
      let userToBeDeleted = {
        displayName: user,
        userId: this.state.agentList[index].userId
      }
      this.setState({ 
        modalIsOpen: true, 
        userToBeDeleted:userToBeDeleted 
      });
    };
    hasTeamEditAccess = (roleType) => {
      const editAccess = {
        [ROLE_TYPE.SUPER_ADMIN]: {
          [ROLE_TYPE.SUPER_ADMIN]: false,
          [ROLE_TYPE.ADMIN]: true,
          [ROLE_TYPE.AGENT]: true
        },
        [ROLE_TYPE.ADMIN]: {
          [ROLE_TYPE.SUPER_ADMIN]: false,
          [ROLE_TYPE.ADMIN]: false,
          [ROLE_TYPE.AGENT]: true
        },
        [ROLE_TYPE.AGENT]: {
          [ROLE_TYPE.SUPER_ADMIN]: false,
          [ROLE_TYPE.ADMIN]: false,
          [ROLE_TYPE.AGENT]: false
        }
      }
      return editAccess[this.props.loggedInUserRoleType][roleType]
    }
    onCloseModal = () => {
      this.setState({ modalIsOpen: false });
    };
    render() {
        var conversationStyle = {
          textDecoration: 'underline',
          color: '#0000EE'
        };
        var index= this.props.index;
        var loggedInUserRoleType = this.props.loggedInUserRoleType;
        var deleteRef = "delete"+index;
        var user = this.props.user;
        let isOnline = this.props.isOnline;
        let isAway = this.props.isAway;
        let roleType = this.props.roleType;
        var emailId = user.email;
        var displayName = user.displayName || "";
        var imageExpr = (user.imageLink) ? 'img-avatar vis' :'n-vis';
        var nameExpr = (user.imageLink) ? 'n-vis' :'km-alpha-contact-image vis';
        var lastLoggedInAtTime = (typeof user.lastLoggedInAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastLoggedInAtTime)): '';
        var lastSeenAt = (typeof user.lastSeenAtTime !== 'undefined') ?(window.$kmApplozic.fn.applozic('getDateTime',user.lastSeenAtTime)):lastLoggedInAtTime;
        return( 
                  <tr className="team-data-align" >
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
                      <div className="teammates-user-role">{ROLE_NAME[roleType].name}</div>
                    </td>
                    <td>{ !isAway &&
                          <div className="small text-muted">  <StatusIndicator label = { isOnline ? "Online" : "Offline"} indicator={isOnline ? "success" : "muted"} /> </div>
                        }
                        { isAway &&
                           <div className="small text-muted">  <StatusIndicator label = {"Away"} indicator={"warning"} /> </div>
                        }
                    </td>
                    
                    <td className= "teammates-delete-icon" colSpan="3"  >
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
                     <DeleteInvitation isOpen={this.state.modalIsOpen} userToBeDeleted={this.state.userToBeDeleted} deleteInvitation={false} agentList ={this.props.agentList} onRequestClose={this.onCloseModal} onClickOfDelete={this.deleteUser} ariaHideApp={false}  getUsers={this.props.getUsers}/>
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
