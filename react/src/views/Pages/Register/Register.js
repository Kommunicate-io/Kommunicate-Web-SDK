import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import {getConfig} from '../../.../../../config/config.js';
import isEmail from 'validator/lib/isEmail';
import  {createCustomer, saveToLocalStorage,createCustomerOrAgent} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification';
import CommonUtils from '../../../utils/CommonUtils';

class Register extends Component {
  constructor(props){
    super(props);
    this.initialState={
      password:'',
      email:'',
      name:'',
      repeatPassword:'',
      disableRegisterButton:false,
      isInvited:false,
      isEmailReadonly:false,
      isBackBtnHidden:false,
      applicationId:null

    };
    this.state = this.initialState;
  }
  componentWillMount(){
    const search = this.props.location.search;
    //const params = new URLSearchParams(search);
    /*const isInvited = params.get('invite');*/

    const isInvited = CommonUtils.getUrlParameter(search, 'invite');

   if(isInvited){
     this.state.isInvite=true;
     //this.state.invitedUserEmail=invitedUserEmail;
     //this.state.email = invitedUserEmail;
     this.state.isEmailReadonly =false;
     this.state.isBackBtnHidden =true;
     this.state.applicationId = CommonUtils.getUrlParameter(search, 'applicationId');

   }
    //console.log("location",this.props.location);
  }

  setUserName= (event)=>{
  this.setState({name:event.target.value});
  }
  setPassword= (event)=>{
  this.setState({password:event.target.value});
  }
  setRepeatPassword = (event)=>{
  //this.setState({repeatPassword:event.target.value});
  }
  setEmail= (event)=>{
  this.setState({email:event.target.value});
  }
  backToLogin = ()=>{
    this.setState(this.initalState);
    //window.location="/login";
    this.props.history.push('/login');
  }
  createAccount=(event)=>{
    var email = this.state.email;
    var password =this.state.password;
    var repeatPassword =this.state.repeatPassword;
    var name = this.state.name;
    var _this= this;
    if(!isEmail(email)){
      Notification.warning("Invalid Email !!");
      return;
    }else if(validator.isEmpty(password)||validator.isEmpty(email)|| validator.isEmpty(name)){
      Notification.warning(" All fields are mandatory !!");
    }else{
      // located in '../../../utils/kommunicateClient'
      // creating user
      let userType = this.state.isInvite?"AGENT":"CUSTOMER";
      let userInfo={};
      userInfo.userName=email;
      userInfo.email= email;
      userInfo.type = userType=="AGENT"?1:3;
      userInfo.applicationId = this.state.applicationId;
      userInfo.password = password;
      userInfo.name=name;
      this.setState({disableRegisterButton:true}); 
      Promise.resolve(createCustomerOrAgent(userInfo,userType)).then((response) => {
       saveToLocalStorage(email, password,name, response);
        _this.setState({disableRegisterButton:false});
       localStorage.isAdmin=="true"?window.location ="/setUpPage":window.location ="/dashboard";
        return;
      }).catch(err=>{
        _this.setState({disableRegisterButton:false});

        let msg = err.code?err.message:"Something went wrong ";
        if(err.response&&err.response.code==="BAD_REQUEST"){
          msg = "Invalid Application Id.";
        }else if(err.response&&err.response.code =="USER_ALREADY_EXISTS"){
          msg = " A user already exists with this email!"
        }else if(err.code=="USER_ALREADY_EXISTS_PWD_INVALID"){
          Notification.warning("This Email id already associated with another account. Please enter the correct password!", 3000);
          return;
        }
        else if(err.code=="APP_NOT_RECEIVED"){
          Notification.error(msg);
          window.location ="/login";
          return;
        }
        Notification.error(msg);
      });
    }
  }

  render() {
    console.log("invite",this.state.invitedUserEmail);
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mx-4">
                <div className="card-block p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Sign Up</p>
                   <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-user"></i></span>
                   <input autofocus type="text" className="form-control" placeholder="name" onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("input-email").focus()}}} onChange= {this.setUserName} required/>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-addon">@</span>
                    <input id = "input-email" type="text" className="form-control" placeholder="Email" onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("input-password").focus()}}} onChange= { this.setEmail } readOnly ={this.state.isEmailReadonly} value={this.state.email}/>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input id="input-password"type="password" className="form-control" placeholder="Password"  onChange={ this.setPassword } onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("create-button").click()}}} />
                  </div>
                  <div className="input-group mb-4" hidden={true}>
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Repeat password" onChange={ this.setRepeatPassword }/>
                  </div>
                  <div className="row">
                    <div className="col-6 text-right">
                      <button id="create-button"type="button" className="btn btn-primary px-4" onClick= { this.createAccount } disabled ={this.state.disableRegisterButton}>Create Account</button>
                    </div>
                    <div className="col-6 text-center">
                      <button type="button" className="btn btn-primary px-4" onClick= { this.backToLogin } hidden ={this.state.isBackBtnHidden}>Back</button>
                    </div>
                  </div>
                </div>
                </div>
               {/* <div className="card-footer p-4">
                  <div className="row">
                    <div className="col-6">
                      <button className="btn btn-block btn-facebook" type="button"><span>facebook</span></button>
                    </div>
                    <div className="col-6">
                   <button className="btn btn-block btn-twitter" type="button"><span>twitter</span></button> 
                    </div>
                  </div>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Register;
