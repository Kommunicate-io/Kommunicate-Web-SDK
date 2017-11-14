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


class Integration extends Component {
   constructor(props) {
    super(props);
    this.state = {
        email:'',
        result: [],
        multipleEmailAddress: [],
        emailAddress:""
      };
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
      notifyThatEmailIsSent({to:multipleEmailAddress,templateName:"INVITE_TEAM_MAIL"}).then(data=>{
        _this.setState({multipleEmailAddress: [],emailAddress:""});
      });
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

  componentWillMount() {
    var _this = this;
    window.$kmApplozic.fn.applozic("fetchContacts", {roleNameList: ['APPLICATION_ADMIN', 'APPLICATION_WEB_ADMIN'], 'callback': function(response) {
        _this.setState({result: response.response.users});
      }
    });
  }

  render() {
    var result = this.state.result.map(function(result,index){
          return <UserItem key={index} user={ result } />
          });
    return (
      <div className="animated fadeIn">
       <div className="row">
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
                 <label className="form-control-label invite-team" htmlFor="invite">Invite Your Team</label>
                 <div className="col-md-9 form-group row">
                 <div className="form-group col-md-5 multiple-email-container">
                   {this.state.multipleEmailAddress.map((email, i) => (
                     <div className="single-email-container" key={i}>
                       <span>{email}</span>
                       <span className="remove-email" onClick={() => {this.removeEmail(email)}}>| X</span>
                     </div>
                   ))}
                   <input className="input-email" value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder="you can enter multiple emails here"/>
                 </div>
                 </div>
                 <div className="card-footer">
                   <button type="button" onClick={this.sendMail} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Invite</button>
                 </div>
             </div>

           </div>
         </div>
         <div className="col-md-12">
           <div className="card">
             <div className="card-block">
               <label className="col-md-3 form-control-label" htmlFor="invite">Team</label>
               <table className="table table-hover table-outline mb-0 hidden-sm-down">
                 <thead className="thead-default">
                   <tr>
                     <th className="text-center"><i className="icon-people"></i></th>
                     <th>User</th>
                      <th>Contact Info</th>
                      <th>Last Activity</th>
                      <th className="text-center">Add Info</th>
                      <th className="text-center">Actions</th>
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
