import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import UserItem from '../UserItem/';
import InvitedUsersList from './InvitedUsersList';
import {notifyThatEmailIsSent, getUsersByType, getInvitedUserByApplicationId} from '../../utils/kommunicateClient' ;
import '../MultiEmail/multiple-email.css'
import ValidationUtils from '../../utils/validationUtils'
import Notification from '../model/Notification';
import './team.css';
import CommonUtils from '../../utils/CommonUtils';
import { USER_TYPE, GROUP_ROLE, LIZ, DEFAULT_BOT } from '../../utils/Constant';
import { Agent } from 'https';
import Modal from 'react-modal';
import CloseButton from './../../components/Modal/CloseButton.js';
import RadioButton from '../../components/RadioButton/RadioButton';
import Banner from '../../components/Banner/Banner';
import { ROLE_TYPE } from '../../utils/Constant';



const customStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '580px',
      // maxWidth: '580px',
      overflow: 'visible'
  }
};

class Integration extends Component {
   constructor(props) {
    super(props);
    this.state = {
        email:'',
        result: [],
        multipleEmailAddress: [],
        emailAddress:"",
        loggedInUserId:"",
        loggedInUserRoleType:"",
        agentsInfo:[],
        applicationId:"",
        hideErrorMessage:true,
        existingAndActiveUsers : [],
        isAgentSelected:true,
        isAdminSelected:false,
        invitedUser :[]
      };
      this.getUsers  = this.getUsers.bind(this);
      window.addEventListener("kmFullViewInitilized",this.getUsers,true);
      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);

  }
  componentWillMount() {
    // this.getInvitedUsers();
    this.getUsers();
    let userSession = CommonUtils.getUserSession();
    let adminUserName = userSession.adminUserName;
    let loggedInUserRoleType = userSession.roleType;
    let applicationId = userSession.application.applicationId;
    this.setState({
      loggedInUserId:adminUserName,
      applicationId:applicationId,
      loggedInUserRoleType:loggedInUserRoleType
    },this.getAgents);
  }
  getUsers = () => {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {roleNameList: ['APPLICATION_ADMIN', 'APPLICATION_WEB_ADMIN'], 'callback': function(response) {
        let users = response.response.users;
        let existingAndActiveUsers = []
        users.map(function(user,index){
          if (!user.deactivated) {
              existingAndActiveUsers.push(user.userId);
            }
          })
        
        _this.setState({
          result: response.response.users,
          existingAndActiveUsers:existingAndActiveUsers
        });
      }
    });
  }
  getInvitedUsers = () => {
    let invitedUser = [];
    return Promise.resolve(getInvitedUserByApplicationId()).then(response => {
      response.forEach(item => {
        invitedUser.push({userId:item.invitedUser, roleType:item.roleType, status:item.status});
      })
      this.setState({invitedUser:invitedUser});
    }).catch(err => {
      console.log("error while fetching invited users list", err.message);
    })
  }
  showEmailInput=(e)=>{
    e.preventDefault();
    this.setState({emailInstructions : true})
  }
  onOpenModal = () => {
    this.setState({modalIsOpen: true });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
    this.handleAgentRadioBtn();
  };
  sendEmail = (e) => {
    let email = this.state.email;
    let roleType = this.state.isAdminSelected ? ROLE_TYPE.ADMIN : ROLE_TYPE.AGENT ;
    let existingAndActiveUsers = this.state.existingAndActiveUsers;
    let isUserExists = existingAndActiveUsers.indexOf(email);
    let mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    
    if (isUserExists == -1) {
      if (email.match(mailformat)) {
        this.onCloseModal();
        return Promise.resolve(notifyThatEmailIsSent({ to: email, templateName: "INVITE_TEAM_MAIL",     roleType:roleType })).then(response => {
          // console.response(response);
          Notification.success('Invitation sent successfully');
          // this.getInvitedUsers();
        }).catch(err => {
          Notification.error("Something went wrong!")
          console.log("error while inviting an user", err.message.response.data);
        })
      } else {
        Notification.error(email + " is an invalid Email");
        return false;
      }
    } else {
      Notification.warning("Teammate with this email already exists");
    }
  }

  //this method not using now. this can be use in case of sending multiple invitation 
  sendMail=(e)=>{
     const _this =this;
     console.log(_this.state.email);
    if(!_this.state.emailAddress && _this.state.multipleEmailAddress.length === 0){
      Notification.info("Please enter email address");
      return;
    }
    e.preventDefault();

    let multipleEmailAddress = this.state.multipleEmailAddress;
    if(isEmail(this.state.emailAddress)) {
        multipleEmailAddress = multipleEmailAddress.concat([this.state.emailAddress]);
        this.setState({ multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress]) })
        this.setState({ emailAddress: '' });
    }
    if(multipleEmailAddress.length >= 1){
      for(let i = 0; i < multipleEmailAddress.length; i++){
        if(!isEmail(multipleEmailAddress[i])){
          Notification.error(multipleEmailAddress[i] + " is an invalid Email");
          return;
        }
      }

      for(let i = 0; i < multipleEmailAddress.length; i++){
        notifyThatEmailIsSent({to:multipleEmailAddress[i],templateName:"INVITE_TEAM_MAIL"}).then(data=>{
          _this.setState({multipleEmailAddress: [],emailAddress:""});
        });
      }

    }else{
      console.log(this.state.emailAddress)
      if(this.state.emailAddress&&!isEmail(this.state.emailAddress)){
        Notification.error(this.state.emailAddress + " is an invalid Email");
        return;
      }else{
        notifyThatEmailIsSent({to:this.state.emailAddress,templateName:"INVITE_TEAM_MAIL"}).then(data=>{
          _this.setState({multipleEmailAddress: [],emailAddress:""});

        });
      }
    }
  }
  getAgents() {
     var that = this;
     let users = [USER_TYPE.AGENT, USER_TYPE.ADMIN,USER_TYPE.BOT];
     return Promise.resolve(getUsersByType(this.state.applicationId, users)).then(data => {
       let agentsInfo = data;
       this.setState({agentsInfo:agentsInfo})
     }).catch(err => {
      //  console.log("err while fetching users list ", err);
     });
  }
  multipleEmailHandler=(e)=>{
    if(e.target.value.includes(' ')){
     // this.setState({emailAddress: ''})
    }else{
      this.setState({emailAddress: e.target.value});
    }
  }

  checkForSpace=(e)=>{
    if((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) && ValidationUtils.isValidEmail(this.state.emailAddress)) {
      this.setState({multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress])})
      this.setState({emailAddress: ''})
    }

  }

  removeEmail=(removeEmail)=>{
    // console.log(this.state.multipleEmailAddress);
    const filteredEmails = this.state.multipleEmailAddress.filter(email => email !== removeEmail)
    this.setState({multipleEmailAddress: filteredEmails})
    // console.log(this.state.multipleEmailAddress);
  }
  handleAgentRadioBtn = (e) => {
    // e.preventDefault();
    this.setState({
        isAdminSelected: false,
        isAgentSelected: true
    })
  }
  handleAdminRadioBtn = (e) => {
    // e.preventDefault();
    this.setState({
        isAdminSelected: true,
        isAgentSelected: false,
    })
  }

  render() {
    var agentList = this.state.result;
    var getUsers = this.getUsers;
    var loggedInUserId = this.state.loggedInUserId;
    var loggedInUserRoleType = this.state.loggedInUserRoleType;
    var agentsInfo = this.state.agentsInfo;
    var isAway = false;
    var isOnline = false;
    var roleType ;
    var result = this.state.result.map(function(result,index){
      let userId = result.userId;
      let isOnline = result.connected;
      if (!result.deactivated) {
        agentsInfo.map(function(user,i){
          if(userId == user.userName){
            roleType = user.roleType
            if(user.availabilityStatus && isOnline ){
              //agent is online
              isOnline = true;
              isAway = false;
            } else if (!user.availabilityStatus && isOnline){
              //agent is away
              isAway= true;
              isOnline = false;
            } else {
              //agent is offline
              isOnline = false;
              isAway = false;

            }
          }
        })
        return <UserItem key={index} user={result} agentList={agentList} index={index} hideConversation="true" getUsers={getUsers} loggedInUserId = {loggedInUserId} isOnline= {isOnline} isAway ={isAway} roleType = {roleType} loggedInUserRoleType = {loggedInUserRoleType} />
      }
    });
    const agentRadioBtnContainer = (
     <div className="row">
       <div className="col-radio-btn col-md-2 col-lg-2">
        </div>
      <div className="radion-btn-agent-wrapper col-md-9 col-lg-9">
        <h5 className="radio-btn-agent-title">Agent</h5>
        <p className="radio-btn-agent-description">Have full access to edit all the settings and features in the dashboard</p>
      </div>
    </div>  
    )
    const adminRadioBtnContainer = (
     <div className="row">
       <div className="col-radio-btn col-md-1 col-lg-1">
        </div>
       <div className="radion-btn-admin-wrapper col-md-9 col-lg-9">
        <h5 className="radio-btn-agent-title">Admin</h5>
        <p className="radio-btn-admin-description">Have access to only key features and information in the dashboard </p>
      </div>
     </div>  
    )
    var invitedUserList = this.state.invitedUser.map((user,index)=> {
      return <InvitedUsersList key={index} user={user} index={index} />
    }) 
    return (
      <div className="animated fadeIn teammate-table">
       <div className="row">
         <div className="col-md-12">
           <div className="card">
             {  this.state.loggedInUserRoleType == ROLE_TYPE.AGENT &&
               <Banner  indicator = {"warning"} isVisible= {false} text = {"You need admin permissions to manage your team"}/>
             }
             <div className="card-block">
                 <h5 className="form-control-label teammates-description">See the list of all the team members, their roles, add new team members and edit member details.</h5>
                  <button className="km-button km-button--primary teammates-add-member-btn" onClick= {this.onOpenModal} disabled = {this.state.loggedInUserRoleType == ROLE_TYPE.AGENT ? true : false }>+ Add a team member</button>
                 
             </div>
             <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.onCloseModal} style={customStyles} ariaHideApp={false} >
                <div className="teammates-add-member-modal-wrapper">
                  <div className="teammates-add-member-modal-header">
                    <p className="teammates-add-member-modal-header-title" >Adding new team member</p>
                  </div>
                  <hr className="teammates-add-member-modal-divider" />
                  <div className="teammates-add-member-modal-content-wrapper">
                    <h5 className="teammates-add-member-modal-content-title">Whom do you want to add?</h5>
                    <input type="text" className="form-control email-field" id="email-field" 
								      onChange={(e) => {
								      	let email = this.state.email;
									      email = e.target.value;
									      this.setState({ email: email  })
								      }}
									
								    placeholder="Enter email address" />
                  </div>
                  <h5 className="teammates-add-member-modal-role">Role</h5>
                  <div className="teammates-add-member-modal-radio-btn-wrapper">
                    <RadioButton idRadioButton={'teammates-admin-radio'} handleOnChange={this.handleAgentRadioBtn}checked={this.state.isAgentSelected} label={agentRadioBtnContainer} />
                                 
                    <RadioButton idRadioButton={'teammates-agent-radio'} handleOnChange={this.handleAdminRadioBtn} checked={this.state.isAdminSelected} label={adminRadioBtnContainer} />
                  </div>  
                  <div className="teammates-add-member-modal-btn">
                    <button className="km-button km-button--secondary teammates-add-member-modal-cancel-btn" onClick = {this.onCloseModal}>Cancel</button>
                    <button className="km-button km-button--primary teammates-add-member-modal-add-btn" onClick= {this.sendEmail}>Add member</button>
                  </div>  
                </div>  
              <span onClick={this.onCloseModal}><CloseButton /></span>
              </Modal>
           </div>
         </div>
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
               {/* <label className="col-md-3 form-control-label invite-team" htmlFor="invite">Team</label> */}
               <table className= "table table-hover mb-0 hidden-sm-down teammates-table">
                 <thead className="thead-default">
                   <tr>
                      {/* <th className="text-center"><i className="icon-people"></i></th> */}
                      <th className="team-name-title">Name</th>
                      <th>Email id</th>
                      <th>Role</th>
                      {/* <th>Last Activity</th> */}
                      <th>Status</th>
                      <th className="team-th-delete-edit">Delete</th>
                      <th className="text-center n-vis">Add Info</th>
                      <th className="text-center n-vis">Actions</th>
                      <th className="text-center n-vis">Country</th>
                      <th className="n-vis">Usage</th>
                      <th className="text-center n-vis">Payment Method</th>
                      <th className="n-vis">Activity</th>
                   </tr>
                 </thead>
                 <tbody>
                   {/* {invitedUserList} */}
                   {result}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
      </div>

    )
  }
  }

  export default Integration;
