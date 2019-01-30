import React, { Component } from 'react';
import { /*Dropdown, DropdownMenu, DropdownItem,*/ Progress } from 'reactstrap';
import CommonUtils from '../../utils/CommonUtils.js';
import {deleteUserByUserId} from '../../utils/kommunicateClient';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import Notification from '../model/Notification';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator.js';
import { ROLE_TYPE, ROLE_NAME } from '../../utils/Constant';
import UserUpdateModal from '../Team/UserUpdateModal.js';
import {DeleteIcon, EditIcon} from '../../../src/assets/svg/svgs'



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
       userStatus:"",
       selectedRole: ROLE_TYPE.AGENT
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
        return <span className={'km-contact-icon ' + first_alpha}>{name}</span>;
      }
      else {
        return <span className="km-contact-icon alpha_user">{name}</span>;
      }
    }
    handleRoleRadioBtn = (e) => {
      this.setState({
        selectedRole: e.target.getAttribute('data-value')
      })
    }
    onOpenModal = (e) => {
      let index = parseInt(e.target.dataset.index);
      let user = this.state.agentList[index].displayName || this.state.agentList[index].userId;
      let userToBeDeleted = {
        displayName: user,
        userId: this.state.agentList[index].userId
      }
      this.setState({ 
        modalIsOpen: true, 
        userToBeDeleted:userToBeDeleted,
        modalType: e.target.dataset.button
      });
    };
    hasTeamEditAccess = (roleType) => {
      return this.props.loggedInUserRoleType < roleType
    }
    onCloseModal = () => {
      this.setState({ modalIsOpen: false });
    };
    render() {
        var conversationStyle = {
          textDecoration: 'underline',
          color: '#0000EE'
        };
        var ref= this.props.index;
        var loggedInUserRoleType = this.props.loggedInUserRoleType;
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
                    
                    <td className= "teammates-row-icon-container" colSpan="1"  >
                      { this.hasTeamEditAccess(roleType) &&
                        <span className="teammates-edit-wrapper km-teammates-icon-visibility" onClick ={this.onOpenModal} data-index= {ref} data-button= {"edit"}>
                         <EditIcon />
                          Edit
                        </span>
                      }
                    </td>
                    <td className= "teammates-row-icon-container" colSpan="2"  >
                      { this.hasTeamEditAccess(roleType) &&
                        <span onClick ={this.onOpenModal}  data-index= {ref} data-button= {"deleteUser"} className="teammates-delete-wrapper km-teammates-icon-visibility">
                         <DeleteIcon />
                          Delete
                        </span>
                      }
                    </td>
                     { this.state.modalIsOpen &&
                       <UserUpdateModal isOpen={this.state.modalIsOpen} userToBeDeleted={this.state.userToBeDeleted} deleteInvitation={false} agentList ={this.props.agentList} onRequestClose={this.onCloseModal} onClickOfDelete={this.deleteUser} ariaHideApp={false} getUsers={this.props.getUsers} modalType={this.state.modalType} handleRoleRadioBtn={this.handleRoleRadioBtn} selectedRole={this.state.selectedRole} />
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
