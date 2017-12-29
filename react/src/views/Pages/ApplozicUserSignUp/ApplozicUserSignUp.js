import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import {getConfig} from '../../.../../../config/config.js';
import isEmail from 'validator/lib/isEmail';
import {SplitButton, MenuItem} from 'react-bootstrap';
import  {createCustomer, saveToLocalStorage, createCustomerOrAgent, checkUserInApplozic, signUpWithApplozic} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification';

class ApplozicUserSignUp extends Component {
  
  constructor(props){
    super(props);
    this.initialState = {
      userName:'',
      password:'',
      applicationId:'',
      applicationName:'',
      isInvited:false,
      loginButtonDisabled:false
    };
    this.state=this.initialState;
  }
  setUserName= (event)=>{
    this.setState({userName:event.target.value});
  }

  setPassword= (event)=>{
    this.setState({password:event.target.value});
  }

  setAppId= (event)=>{
    this.setState({applicationId:event.target.value});
  }

  buttonActions = (e) => {
    e.preventDefault();
    const email = this.state.userName;
    const password =this.state.password;
    const appId = this.state.applicationId;

    if(validator.isEmpty(password) || validator.isEmpty(email) || validator.isEmpty(appId)){
      Notification.info(" All fields are mandatory ! ");
      return;
    }else if(!isEmail(email)){
      Notification.info(" Invalid Email !");
      return;
    }

    const header = {
      'Content-Type' :'application/json',
      'Apz-AppId': this.state.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(this.state.userName+':'+this.state.password).toString('base64')
      // 'Apz-Token': 'Basic c3VyYWorMTIzNEBhcHBsb3ppYy5jb206c3VyYWoxMjM='
    }

    const data = {
      userId: this.state.userName,
      password: this.state.password,
      roleName:'APPLICATION_WEB_ADMIN'
    }
  
    const args = {
      header: header,
      data: data
    }

    // console.log(header)
    // console.log(data)


    checkUserInApplozic(args)
      .then(response => {
        if(response.status===200){
            this.createKommunicateAccount()
          }
      })
      .catch(err => {
        // console.log("in error")
        Notification.info('Invalid credentials.')
      });
  }

  createKommunicateAccount = () => {
    const email = this.state.userName;
    const password =this.state.password;
    const appId = this.state.applicationId;
    const name = this.state.name?this.state.name:email;
    var _this= this;
    if(!isEmail(email)){
      Notification.info("Invalid Email!!");
      return;
    }else if(validator.isEmpty(password) || validator.isEmpty(email) || validator.isEmpty(appId)){
      Notification.info(" All fields are mandatory !!");
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
      Promise.resolve(signUpWithApplozic({userName:email,password:password,applicationId:this.state.applicationId})).then((response) => {
       if(response){
         if(response.data&& response.data.code==="USER_ALREADY_EXISTS"){
          Notification.info("User already exists, Please login.");
          return;
       }else if(response.data&& response.data.code==="APPLICATION_NOT_EXISTS"){
        Notification.info("Incorrect Application Id. Try again");
        return;
       }else if(response.data&& response.data.code==="SUCCESS"){
       
        saveToLocalStorage(email, password, response.data.data.name, response);
        _this.setState({disableRegisterButton:false});
        this.props.history.push('/dashboard');
        return;
       }else throw "error";
      }
    }).catch(err=>{
        _this.setState({disableRegisterButton:false});
        let msg = err.code?err.message:"Something went wrong ";
        if(err.data&&err.data.code==="BAD_REQUEST"){
          msg = "Invalid Application Id.";
        }else if(err.code=="APP_NOT_RECEIVED"){
          Notification.info(msg);
          this.props.history.push('/login');
          return;
        }
          Notification.info(msg);
      });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mx-4">
                <div className="card-block p-4">
                  <h1>Applozic User sign up</h1>
                  <p className="text-muted">Enter your applozic details</p>
                  <div className="input-group mb-3">
                    <span className="input-group-addon">@</span>
                    <input type="text" className="form-control" placeholder="User name for Applozic" onChange= { this.setUserName } value={this.state.userName}/>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="text" className="form-control" placeholder="Application Id"  onChange={ this.setAppId } value={this.state.applicationId}/>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Password"  onChange={ this.setPassword } value={this.state.password}/>
                  </div>
                  <div className="row">
                    <div className="col-12 text-center">
                      <button type="button" className="btn btn-primary px-4" onClick= { this.buttonActions }>Sign Up</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApplozicUserSignUp;

