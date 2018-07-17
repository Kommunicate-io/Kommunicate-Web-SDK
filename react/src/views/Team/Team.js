import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import UserItem from '../UserItem/'
import {notifyThatEmailIsSent} from '../../utils/kommunicateClient' ;
import '../MultiEmail/multiple-email.css'
import ValidationUtils from '../../utils/validationUtils'
import Notification from '../model/Notification';
import './team.css';
import CommonUtils from '../../utils/CommonUtils';

class Integration extends Component {
   constructor(props) {
    super(props);
    this.state = {
        email:'',
        result: [],
        multipleEmailAddress: [],
        emailAddress:"",
        adminUserId:"",
      };
      this.getUsers  = this.getUsers.bind(this);
      window.addEventListener("kmFullViewInitilized",this.getUsers,true);

  }
  componentWillMount() {
    this.getUsers();
    let userSession = CommonUtils.getUserSession();
    let adminUserName = userSession.adminUserName;
    this.setState({adminUserId:adminUserName});
  }
  getUsers = () => {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {roleNameList: ['APPLICATION_ADMIN', 'APPLICATION_WEB_ADMIN'], 'callback': function(response) {
        _this.setState({result: response.response.users});
      }
    });
  }
  showEmailInput=(e)=>{
    e.preventDefault();
    this.setState({emailInstructions : true})
  }

  sendMail=(e)=>{
     const _this =this;
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


  render() {
    var agentList = this.state.result;
    var getUsers = this.getUsers;
    var adminUserId = this.state.adminUserId;
    var result = this.state.result.map(function(result,index){
      if (!result.deactivated) {
        return <UserItem key={index} user={result} agentList={agentList} index={index} hideConversation="true" getUsers={getUsers} adminUserId = {adminUserId}/>
      }
    });
    return (
      <div className="animated fadeIn teammate-table">
       <div className="row">
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
                 <label className="form-control-label invite-team" htmlFor="invite">Invite Your Team</label>
                 <div className="col-md-9 row email-field-wrapper ">
                 <div className="form-group col-md-5 multiple-email-box">
                   {this.state.multipleEmailAddress.map((email, i) => (
                     <div className="single-email-container" key={i}>
                       <span>{email}</span>
                       <span className="remove-email" onClick={() => {this.removeEmail(email)}}>| X</span>
                     </div>
                   ))}
                   <input className="input-email" value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder="You can enter multiple emails here" style={{paddingLeft: "10px", borderRadius: "4px"}}/>
                 </div>
                 </div>
             </div>
              <div className="card-block invite-btn-wrapper">
                <button type="button" onClick={this.sendMail} className="km-button km-button--primary"><i className="fa fa-dot-circle-o"></i> Invite</button>
              </div>
           </div>
         </div>
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
               <label className="col-md-3 form-control-label invite-team" htmlFor="invite">Team</label>
               <table className="table table-hover mb-0 hidden-sm-down">
                 <thead className="thead-default">
                   <tr>
                      <th className="text-center"><i className="icon-people"></i></th>
                      <th>Name</th>
                      <th>Email id</th>
                      <th>Last Activity</th>
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
