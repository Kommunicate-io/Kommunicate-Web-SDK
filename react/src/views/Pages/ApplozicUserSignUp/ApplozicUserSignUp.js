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
      <header>
        <div className="header-container">
            <div className="logo-container">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 729.5 138.5">
            <path className="km-logo-final-full-0" d="M148.7,130.6V53c0-28-22.7-50.8-50.8-50.8H51.7C23.7,2.2,0.9,24.9,0.9,53c0,28,22.7,50.8,50.8,50.8h50 c0,0,4.1,0.2,6.5,1.1c2.3,0.9,5,2.9,5,2.9l30.9,25.4c0,0,2.8,2.4,3.8,1.9C148.9,134.6,148.7,130.6,148.7,130.6z M53.1,63.3 c0,3.4-3,6.1-6.6,6.1c-3.6,0-6.6-2.7-6.6-6.1V41.5c0-3.4,3-6.1,6.6-6.1c3.6,0,6.6,2.7,6.6,6.1V63.3z M81.4,73.6 c0,3.4-3,6.1-6.6,6.1c-3.6,0-6.6-2.7-6.6-6.1V31.2c0-3.4,3-6.1,6.6-6.1c3.6,0,6.6,2.7,6.6,6.1V73.6z M109.7,63.3 c0,3.4-3,6.1-6.6,6.1c-3.6,0-6.6-2.7-6.6-6.1V41.5c0-3.4,3-6.1,6.6-6.1c3.6,0,6.6,2.7,6.6,6.1V63.3z"
            />
            <g>
              <path className="km-logo-final-full-1" d="M177.5,86.6c-0.9,0.9-2,1.3-3.3,1.3c-1.3,0-2.4-0.4-3.3-1.3c-0.9-0.9-1.3-2-1.3-3.3V33.8 c0-1.3,0.4-2.4,1.3-3.3c0.9-0.9,2-1.3,3.3-1.3c1.3,0,2.4,0.4,3.3,1.3c0.9,0.9,1.4,2,1.4,3.3v29.1l17.2-17.2c0.9-0.9,2-1.3,3.3-1.3 c1.3,0,2.4,0.4,3.3,1.3c0.9,0.9,1.4,2,1.4,3.3c0,1.3-0.5,2.4-1.4,3.3l-12.6,12.6L203,80.3c1.2,1.6,1.4,3.2,0.5,5 c-0.9,1.8-2.2,2.6-3.9,2.6c-1.7,0-2.9-0.6-3.8-1.7l-12.3-15l-4.6,4.6v7.4C178.9,84.7,178.4,85.8,177.5,86.6z"
              />
              <path className="km-logo-final-full-1" d="M234.9,88.2c-5.7,0-10.4-2.1-14.4-6.2c-3.9-4.1-5.9-9.1-5.9-14.9c0-5.8,2-10.7,5.9-14.9 c3.9-4.2,8.7-6.3,14.2-6.3c5.5,0,10.3,2.1,14.2,6.3c3.9,4.2,5.8,9.3,5.8,15.1c0,5.8-2,10.6-5.9,14.4 C245.3,86.1,240.6,88.2,234.9,88.2z M226.9,58.3c-2,2.4-3,5.3-3,8.7c0,3.5,1,6.4,3,8.9c2.2,2.1,4.8,3.1,7.9,3.1 c3.1,0,5.7-1,7.9-3.1c2.2-2.5,3.3-5.4,3.3-8.9c0-3.5-1.1-6.4-3.3-8.7c-2.4-2.1-5-3.2-7.9-3.2C231.9,55.1,229.3,56.2,226.9,58.3z"
              />
              <path className="km-logo-final-full-1" d="M273.6,88l-0.8-0.1c-1.1-0.3-1.9-0.8-2.6-1.6c-0.7-0.8-1-1.7-1-2.8v-33c0-1.3,0.4-2.4,1.3-3.2 c0.9-0.9,1.9-1.3,3.2-1.3c2,0,3.3,0.8,4,2.5c2.9-1.7,5.9-2.5,9-2.5c5.4,0,9.8,1.9,13.2,5.8c3.3-3.9,7.5-5.8,12.7-5.8 c5.2,0,9.4,1.7,12.9,5.2c3.4,3.4,5.1,7.6,5.1,12.5v19.9c0,1.2-0.4,2.3-1.3,3.2c-0.9,0.9-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.4-3.2-1.3 c-0.9-0.9-1.3-1.9-1.3-3.2V63.6c0-2.4-0.8-4.5-2.5-6.1c-1.7-1.7-3.7-2.5-6-2.5c-2.3,0-4.3,0.8-6,2.4c-1.7,1.6-2.6,3.6-2.7,6v20.2 c0,1.2-0.4,2.3-1.3,3.2c-0.9,0.9-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.4-3.2-1.3c-0.9-0.9-1.4-1.9-1.4-3.1V63.4c-0.1-2.3-0.9-4.3-2.6-5.9 c-1.7-1.7-3.7-2.5-6-2.5c-2.3,0-4.3,0.8-6,2.5c-1.7,1.7-2.5,3.7-2.5,6.1v19.9l-0.1,0.6v0.3l-0.3,0.5v0.4 C276.9,87.1,275.5,88,273.6,88z"
              />
              <path className="km-logo-final-full-1" d="M353.5,88l-0.8-0.1c-1.1-0.3-1.9-0.8-2.6-1.6c-0.7-0.8-1-1.7-1-2.8v-33c0-1.3,0.4-2.4,1.3-3.2 c0.9-0.9,1.9-1.3,3.2-1.3c2,0,3.3,0.8,4,2.5c2.9-1.7,5.9-2.5,9-2.5c5.4,0,9.8,1.9,13.2,5.8c3.3-3.9,7.5-5.8,12.7-5.8 c5.2,0,9.4,1.7,12.9,5.2c3.4,3.4,5.1,7.6,5.1,12.5v19.9c0,1.2-0.4,2.3-1.3,3.2c-0.9,0.9-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.4-3.2-1.3 c-0.9-0.9-1.3-1.9-1.3-3.2V63.6c0-2.4-0.8-4.5-2.5-6.1c-1.7-1.7-3.7-2.5-6-2.5c-2.3,0-4.3,0.8-6,2.4c-1.7,1.6-2.6,3.6-2.7,6v20.2 c0,1.2-0.4,2.3-1.3,3.2c-0.9,0.9-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.4-3.2-1.3c-0.9-0.9-1.4-1.9-1.4-3.1V63.4c-0.1-2.3-0.9-4.3-2.6-5.9 c-1.7-1.7-3.7-2.5-6-2.5c-2.3,0-4.3,0.8-6,2.5c-1.7,1.7-2.5,3.7-2.5,6.1v19.9l-0.1,0.6v0.3l-0.3,0.5v0.4 C356.8,87.1,355.4,88,353.5,88z"
              />
              <path className="km-logo-final-full-1" d="M463.2,70.5c0,4.8-1.8,8.9-5.3,12.3c-3.5,3.4-7.6,5.2-12.4,5.2c-4.8,0-8.9-1.7-12.3-5.1 c-3.4-3.4-5.2-7.5-5.2-12.3V50.4c0-1.2,0.4-2.2,1.3-3.1c0.9-0.9,1.9-1.3,3.1-1.3c1.2,0,2.3,0.4,3.2,1.3c0.9,0.9,1.3,1.9,1.3,3.1 v20.1c0,2.4,0.8,4.4,2.5,6.1c1.7,1.7,3.7,2.5,6.1,2.5c2.4,0,4.5-0.8,6.2-2.5c1.7-1.7,2.6-3.7,2.6-6.1V50.4c0-1.2,0.4-2.2,1.3-3.1 c0.8-0.9,1.9-1.3,3.1-1.3c1.2,0,2.3,0.4,3.2,1.3c0.9,0.9,1.4,1.9,1.4,3.1V70.5z"
              />
              <path className="km-logo-final-full-1" d="M489.4,83.5c0,1.2-0.5,2.3-1.4,3.2c-1,0.9-2,1.3-3.2,1.3s-2.2-0.4-3.1-1.3c-0.9-0.9-1.3-1.9-1.3-3.2V50.4 c0-1.2,0.4-2.3,1.3-3.2c0.9-0.9,1.9-1.3,3.2-1.3c1.9,0,3.3,0.9,4.1,2.6c2.7-1.7,5.7-2.6,8.9-2.6c4.9,0,9,1.7,12.4,5.2 c3.4,3.4,5.1,7.5,5.1,12.3v20.1c0,1.2-0.4,2.3-1.3,3.2c-0.8,0.9-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.4-3.1-1.3c-0.9-0.9-1.3-1.9-1.3-3.2 V63.5c0-2.4-0.9-4.4-2.6-6c-1.7-1.7-3.8-2.5-6.1-2.5c-2.4,0-4.4,0.8-6,2.5c-1.6,1.7-2.4,3.7-2.4,6V83.5z"
              />
              <path className="km-logo-final-full-1" d="M541,33.7v1.8c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-1.9,1.3-3.2,1.3c-1.3,0-2.3-0.4-3.2-1.3c-0.9-0.9-1.3-2-1.3-3.3 v-1.8c0-1.2,0.4-2.3,1.3-3.2c0.9-0.9,2-1.3,3.2-1.3c1.3,0,2.3,0.4,3.2,1.3C540.6,31.4,541,32.4,541,33.7z M533.3,47.4 c0.9-0.9,1.9-1.3,3.2-1.3c1.3,0,2.4,0.4,3.2,1.3c0.9,0.9,1.3,2,1.3,3.3v32.8c0,1.3-0.4,2.4-1.3,3.2c-0.9,0.9-1.9,1.3-3.2,1.3 c-1.3,0-2.3-0.4-3.2-1.3c-0.9-0.9-1.3-2-1.3-3.2V50.7C531.9,49.4,532.4,48.2,533.3,47.4z"
              />
              <path className="km-logo-final-full-1" d="M558.8,81.8c-4.2-4.1-6.3-9.1-6.3-14.8c0-5.8,2.1-10.7,6.3-14.8c4.2-4.1,9.2-6.2,15-6.2 c4.9,0,9.3,1.5,13.4,4.6c1,0.7,1.5,1.7,1.7,3c0.2,1.3-0.1,2.4-0.9,3.3c-0.8,1-1.7,1.5-2.9,1.7c-1.2,0.2-2.3-0.1-3.2-0.9 c-2.5-1.8-5.3-2.7-8.4-2.7s-5.9,1.2-8.4,3.6c-2.5,2.4-3.7,5.2-3.7,8.5c0,3.2,1.2,6.1,3.7,8.4c2.4,2.4,5.2,3.6,8.4,3.6 c3.1,0,5.9-0.9,8.4-2.7c0.9-0.7,2-1,3.2-0.8c1.2,0.2,2.2,0.7,3,1.7c0.8,1,1,2,0.9,3.2c-0.2,1.2-0.7,2.2-1.7,3.1 c-4.1,3-8.6,4.5-13.4,4.5C568,88,563,85.9,558.8,81.8z"
              />
              <path className="km-logo-final-full-1" d="M604.7,81.9c-3.8-4.1-5.8-9-5.8-14.8s1.9-10.8,5.8-14.9c3.8-4.1,8.6-6.2,14.2-6.2c4,0,7.7,1.2,11.2,3.7 c0.3-1.1,0.8-1.9,1.6-2.6c0.8-0.7,1.7-1,2.9-1c1.1,0,2.2,0.4,3,1.3c0.9,0.9,1.3,2,1.3,3.2v33c0,1.2-0.4,2.3-1.3,3.2 c-0.9,0.9-1.9,1.3-3,1.3c-1.1,0-2.1-0.3-2.9-1c-0.8-0.7-1.3-1.5-1.6-2.6C626.7,86.8,623,88,619,88C613.3,88,608.6,85.9,604.7,81.9z M608,67c0,3.4,1,6.2,3.1,8.5c2,2.3,4.7,3.4,7.9,3.4c3.2,0,5.9-1.1,8-3.4c2.1-2.3,3.2-5.1,3.2-8.5c0-3.4-1.1-6.2-3.2-8.6 c-2.1-2.4-4.8-3.5-7.9-3.5c-3.2,0-5.8,1.2-7.9,3.5C609,60.8,608,63.6,608,67z"
              />
              <path className="km-logo-final-full-1" d="M669.6,46c1.3,0,2.4,0.4,3.3,1.3c0.9,0.9,1.4,2,1.4,3.2c0,1.3-0.5,2.4-1.4,3.3c-0.9,0.9-2,1.4-3.3,1.4h-2.1 v23.4c1.3,0,2.4,0.5,3.3,1.4c0.9,0.9,1.3,2,1.3,3.3c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-2,1.3-3.3,1.3c-2.6,0-4.8-0.9-6.6-2.7 c-1.8-1.8-2.7-4-2.7-6.6V55.2h-2.4c-1.3,0-2.4-0.4-3.3-1.3c-0.9-0.9-1.3-2-1.3-3.3c0-1.3,0.4-2.4,1.3-3.3c0.9-0.9,2-1.3,3.3-1.3 h2.4V33.8c0-1.3,0.5-2.4,1.4-3.3c0.9-0.9,2-1.3,3.3-1.3c1.3,0,2.4,0.4,3.3,1.3c0.9,0.9,1.3,2,1.3,3.3V46H669.6z"
              />
              <path className="km-logo-final-full-1" d="M726.8,65.9c0,1.2-0.4,2.2-1.2,3c-0.8,0.8-1.9,1.1-3.2,1.1h-26.7c0.5,2.4,1.5,4.3,2.9,5.5 c1.8,2.1,4.4,3.3,7.9,3.7c3.4,0.4,6.4-0.3,8.9-2.1c0.8-0.9,2-1.3,3.4-1.3c1.4,0,2.4,0.4,2.9,1.1c1.6,1.7,1.6,3.6,0,5.5 c-4,3.7-9,5.5-14.8,5.5c-5.9,0-10.8-2.1-14.7-6.2c-3.9-4.1-6-9-6-14.8c0.1-5.8,2.1-10.7,6-14.8c3.9-4.1,8.7-6.2,14.3-6.2 c5.6,0,10.3,1.8,14.2,5.5c3.8,3.7,5.9,8.3,6.3,14V65.9z M706.6,54c-3.2,0.2-5.9,1.2-7.8,3c-2,1.8-3.1,3.8-3.5,5.9H719 c-0.5-2-1.9-3.9-4.1-5.7C712.7,55.3,709.9,54.3,706.6,54z"
              />
            </g>
          </svg>
            </div>
            <div className="link-container">
                <p>
                    Already have an account? <a href="/login/">Sign In</a>
                </p> 
            </div>
        </div>
    </header>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mx-4">
                <div className="card-block p-4">
                  <h1 className="login-signup-heading">Applozic User sign up</h1>
                  <p className="text-muted login-signup-sub-heading">Enter your applozic details</p>
                  <div className="input-group mb-3">
                    {/* <span className="input-group-addon">@</span> */}
                    <input type="text" className="input" placeholder=" " onChange= { this.setUserName } value={this.state.userName} required/>
                    <label className="label-for-input email-label">User name for Applozic</label>
                  </div>
                  <div className="input-group mb-3">
                    {/* <span className="input-group-addon"><i className="icon-lock"></i></span> */}
                    <input type="text" className="input" placeholder=" "  onChange={ this.setAppId } value={this.state.applicationId} required/>
                    <label className="label-for-input email-label">Application Id</label>
                  </div>
                  <div className="input-group mb-3 register-password-div">
                    {/* <span className="input-group-addon"><i className="icon-lock"></i></span> */}
                    <input type="password" className="input" placeholder=" "  onChange={ this.setPassword } value={this.state.password} required/>
                    <label className="label-for-input email-label">Password</label>
                    <label className="label-for-input2 email-label">Your password must have a minimum of 6 characters</label>
                  </div>
                  <div className="row">
                    <div className="col-12 text-center">
                      <button type="button" className="btn btn-primary px-4 btn-primary-custom" onClick= { this.buttonActions }>Sign Up</button>
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

