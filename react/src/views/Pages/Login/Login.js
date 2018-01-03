import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig} from '../../.../../../config/config.js';
import {Modal} from 'react-bootstrap';
import  {Button}  from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import {SplitButton, MenuItem, DropdownButton} from 'react-bootstrap';
import {resetPassword} from '../../../utils/kommunicateClient';
import Notification from '../../model/Notification';
import CommonUtils from '../../../utils/CommonUtils';
import './login.css';



class Login extends Component {

constructor(props){
  super(props);
  this.initialState = {
    userName:'',
    password:'',
    applicationId:'',
    applicationName:'',
    showAppListModal:false,
    hideUserNameInputbox:false,
    hidePasswordInputbox:true,
    hideAppListDropdown:true,
    loginFormText:"Login",
    loginFormSubText:'Sign In to your account',
    loginButtonText:'Next',
    loginButtonAction:'getAppList',
    appIdList:{},
    dropDownBoxTitle:"Select Application.......",
    hideBackButton:true,
    loginButtonDisabled:false,
    isForgotPwdHidden:true
  }
  this.state=Object.assign({},this.initialState);
  this.submitForm = this.submitForm.bind(this);
}

  componentWillMount() {
    if (CommonUtils.getUserSession()) {
      window.location = "/dashboard";
    }
  }

  onKeyPress(e) {
    if (e.charCode == 13) {
      var login = document.getElementById('login-button');
      login.click();
    }
  }

setUserName=(event)=>{
this.setState({userName:event.target.value});
}
setPassword= (event)=>{
this.setState({password:event.target.value});
}
backToLogin = ()=>{
  this.setState(this.initialState);
  //window.location="/login";
  this.props.history.push('/login');
}
handlePasswordResetResponse=(response)=>{
  Notification.info("Password reset link has been sent on your mail!");
  console.log("response",response);
  !response.err?this.backToLogin():null;
}
handlePasswordResetError=(response)=>{
  var err =(response.response&&response.response.data)?response.response.data.message:"Somethimg went wrong! ";
  Notification.error(err);
  console.log(response);
}

submitForm = ()=>{
  // alert("button clicked "+ this.state.userName+ "  "+this.state.password);
  //validateUser(this.state);
  var _this=this;
  const loginUrl= getConfig().kommunicateApi.login;
  var userName= this.state.userName, password= this.state.password,applicationName=this.state.applicationName, applicationId=this.state.applicationId;
  if(validator.isEmpty(this.state.userName)|| validator.isEmpty(this.state.password)){
    Notification.warning("username or password can't be empty!");
  }else{
    console.log("inside submit form");
    this.setState({loginButtonDisabled:true});
    axios.post(loginUrl,{ userName: userName,password:password,applicationName:applicationName,applicationId:applicationId})
    .then(function(response){
      if(response.status==200&&response.data.code=='INVALID_CREDENTIALS'){
        Notification.warning("Invalid credentials");
        _this.setState({loginButtonDisabled:false});
      } else if (response.status == 200 && response.data.code == 'SUCCESS') {
        console.log("logged in successfully");
        if (typeof (Storage) !== "undefined") {

          if (window.$applozic && window.$applozic.fn && window.$applozic.fn.applozic && window.$applozic.fn.applozic("getLoggedInUser")) {
            window.$applozic.fn.applozic('logout');
          }

          if (response.data.result.apzToken) {
          } else {
            var apzToken = new Buffer(userName + ":" + password).toString('base64');
            response.data.result.apzToken = apzToken;
          }

          if (!response.data.result.application) {
            console.log("response doesn't have application, create {}");
            response.data.result.application = {};
          }
          response.data.result.application.applicationId = _this.state.applicationId;

          response.data.result.password = password;
          console.log("###login:");
          console.log(response.data.result);
          CommonUtils.setUserSession(response.data.result);
        }

        if (window.$applozic) {
          var options = window.applozic._globals;
          options.userId = _this.state.userName;
          options.accessToken = _this.state.password;
          window.$applozic.fn.applozic(options);          
        }

        _this.props.history.push("/dashboard");
        _this.state=_this.initialState;
    
        //window.chatLogin();
    }
    }).catch(function(err){
      console.log(err);
      Notification.error("Error during login.");
      _this.setState({loginButtonDisabled:false});
    });
  }
}

login = (event)=>{
  var _this= this;
  if(this.state.loginButtonAction==="Login"){
    this.submitForm();
  }else if(this.state.loginButtonAction==="passwordResetAppSected" ){
    if(this.state.applicationId){
      resetPassword({userName:this.state.userName,applicationId:this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
      return;
    }else{
      Notification.info("Please select your application");
      return;
    }
  }else{
    console.log(this.state.loginButtonAction);
    if(!this.state.userName && this.state.loginButtonAction ==="getAppList"){
     //alert("please enter user name to login");
     Notification.info("please enter user name to login");
      return;
    }
    var urlEncodedName = encodeURIComponent(this.state.userName);
    //console.log("name",urlEncodedName);
  const getApplistUrl = getConfig().applozicPlugin.applicationList.replace(":userId",urlEncodedName);
  var _this=this;
   axios.get(getApplistUrl)
  .then(function(response){
    console.log("response",response);
    if(response.status=200 && response.data!=="Invalid userId or EmailId"){
      const numOfApp=Object.keys(response.data).length;
      console.log("number of app",numOfApp);
      if(numOfApp===1){
        _this.state.applicationId=Object.keys(response.data)[0];
        _this.state.applicationName=response.data[_this.state.applicationId];
        _this.state.appIdList= response.data;
        console.log("got one application for user, appId : ",_this.state.applicationId);
        if(_this.state.loginButtonAction=="passwordReset"){
          resetPassword({userName:_this.state.userName,applicationId:_this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
          return;
        }
        _this.setState({loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'Enter password to continue ',hidePasswordInputbox:false,hideAppListDropdown:true,hideUserNameInputbox:true,loginFormText:"Password",hideBackButton:false,isForgotPwdHidden:false});
    }else if(numOfApp>1){
      //popUpApplicationList(numOfApp,response.data);
        _this.state.appIdList= response.data;
      if(_this.state.loginButtonAction=="passwordReset"){
        _this.setState({loginButtonText:'Submit',loginButtonAction:'passwordResetAppSected',loginFormSubText:'please select your application and submit',hidePasswordInputbox:true,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Select Application..",hideBackButton:false});
      }else{
      _this.setState({loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'You are registered in multiple application. Please select one application and enter password to login.',hidePasswordInputbox:false,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Select Application..",hideBackButton:false,isForgotPwdHidden:false});
    }
  }else{
    Notification.info("You are not a registered user. Please sign up!!!");
  }
  }else{
      console.log("err while getting application list, status : ",response.status);
      Notification.error(response.message);
    }
 });
}
}
register=(event)=>{
  this.props.history.push("/register");

}

 initiateForgotPassword = (event)=>{
  this.state.loginButtonAction="passwordReset";
  this.setState({"loginFormText":"Email",
  "loginFormSubText":'Enter your registered Email to get the password reset link.',
  loginButtonText:'Submit',
  loginButtonAction:'passwordReset',hideBackButton:false,hidePasswordInputbox:true,hideAppListDropdown:true,hideUserNameInputbox:false});
  //this.login(event);
  //const resetPasswordUrl= getConfig().kommunicateApi.passwordResetUrl.replace(":userName",this.state.userName);
  /*axios.get(resetPasswordUrl)
 .then(function(response){}).then(response=>{
   console.log("got data afrom server", response)
 }).catch(err=>{
   console.log("err while getting user by email address",err.response);
 })*/
}

  render() {
    return (
      <div className="app flex-row align-items-center">
      <header>
        <div className="header-container">
            <div className="logo-container">
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 1551 274">
                    <g id="Layer_1">
                      <title>New-KM-Logo-Final</title>
                      <g className="km-logo-varient3-0">
                        <path className="km-logo-varient3-1" d="M399.7,196.9l-22.9-37.6l-14,13.3v20.6c0,5-1.3,8.8-3.9,11.5s-5.6,4-9.1,4c-4,0-7.1-1.3-9.4-4    s-3.4-6.6-3.4-11.8V82.6c0-5.8,1.1-10.1,3.3-13.1c2.2-3,5.4-4.5,9.5-4.5c4,0,7.1,1.4,9.5,4.1c2.3,2.7,3.5,6.7,3.5,12v62.8    l29.1-30.5c3.6-3.8,6.4-6.4,8.3-7.8s4.2-2.1,6.9-2.1c3.2,0,5.9,1,8.1,3.1c2.1,2.1,3.2,4.6,3.2,7.7c0,3.8-3.5,8.9-10.5,15.2    l-13.8,12.6l26.6,41.7c2,3.1,3.4,5.5,4.2,7.1c0.9,1.6,1.3,3.1,1.3,4.6c0,4.1-1.1,7.4-3.4,9.7c-2.2,2.4-5.2,3.6-8.9,3.6    c-3.2,0-5.6-0.9-7.3-2.6C404.9,204.5,402.6,201.4,399.7,196.9z"
                        />
                        <path className="km-logo-varient3-1" d="M530.9,156.2c0,7.7-1.2,14.8-3.6,21.3c-2.4,6.5-5.9,12.1-10.4,16.8c-4.6,4.7-10,8.3-16.3,10.8    s-13.4,3.7-21.3,3.7c-7.8,0-14.9-1.3-21.2-3.8c-6.3-2.5-11.7-6.1-16.3-10.9c-4.6-4.7-8.1-10.3-10.4-16.7    c-2.4-6.4-3.6-13.5-3.6-21.3s1.2-15,3.6-21.5s5.8-12.1,10.3-16.7s9.9-8.2,16.3-10.7s13.4-3.7,21.2-3.7c7.8,0,15,1.3,21.3,3.8    c6.4,2.5,11.9,6.1,16.4,10.8c4.6,4.7,8,10.2,10.4,16.7S530.9,148.4,530.9,156.2z M504.9,156.2c0-10.6-2.3-18.8-7-24.7    s-10.9-8.8-18.7-8.8c-5.1,0-9.5,1.3-13.4,3.9s-6.8,6.5-8.9,11.6s-3.1,11.1-3.1,17.9c0,6.8,1,12.7,3.1,17.7c2.1,5.1,5,8.9,8.8,11.6    c3.8,2.7,8.3,4,13.5,4c7.8,0,14.1-3,18.7-8.9C502.6,174.8,504.9,166.6,504.9,156.2z"
                        />
                        <path className="km-logo-varient3-1" d="M632.2,158.1v34.4c0,5.4-1.2,9.5-3.7,12.2s-5.7,4.1-9.8,4.1c-3.9,0-7.1-1.4-9.5-4.1    c-2.4-2.7-3.7-6.8-3.7-12.2v-41.3c0-6.5-0.2-11.6-0.7-15.2c-0.4-3.6-1.6-6.6-3.6-8.9c-2-2.3-5.1-3.5-9.3-3.5    c-8.5,0-14.1,2.9-16.7,8.7c-2.7,5.8-4,14.2-4,25v35c0,5.4-1.2,9.4-3.7,12.2c-2.4,2.8-5.6,4.1-9.6,4.1c-3.9,0-7.1-1.4-9.6-4.1    c-2.5-2.8-3.7-6.8-3.7-12.2v-74.1c0-4.9,1.1-8.6,3.4-11.1c2.2-2.5,5.2-3.8,8.9-3.8c3.5,0,6.5,1.2,8.9,3.6s3.6,5.6,3.6,9.8v2.5    c4.5-5.4,9.3-9.3,14.4-11.9c5.1-2.5,10.8-3.8,17.1-3.8c6.5,0,12.1,1.3,16.8,3.9s8.5,6.5,11.6,11.8c4.4-5.3,9-9.2,14-11.8    c5-2.6,10.5-3.8,16.6-3.8c7.1,0,13.2,1.4,18.3,4.2c5.1,2.8,8.9,6.8,11.5,12c2.2,4.7,3.3,12,3.3,22.1v50.6c0,5.4-1.2,9.5-3.7,12.2    s-5.7,4.1-9.8,4.1c-3.9,0-7.1-1.4-9.6-4.1c-2.5-2.8-3.7-6.8-3.7-12.2V149c0-5.6-0.2-10-0.7-13.4s-1.8-6.2-3.8-8.4    c-2.1-2.3-5.3-3.4-9.5-3.4c-3.4,0-6.7,1-9.7,3c-3.1,2-5.5,4.7-7.2,8.2C633.1,139.3,632.2,147,632.2,158.1z"
                        />
                        <path className="km-logo-varient3-1" d="M798.8,158.1v34.4c0,5.4-1.2,9.5-3.7,12.2s-5.7,4.1-9.8,4.1c-3.9,0-7.1-1.4-9.5-4.1    c-2.4-2.7-3.7-6.8-3.7-12.2v-41.3c0-6.5-0.2-11.6-0.7-15.2c-0.4-3.6-1.6-6.6-3.6-8.9c-2-2.3-5.1-3.5-9.3-3.5    c-8.5,0-14.1,2.9-16.7,8.7c-2.7,5.8-4,14.2-4,25v35c0,5.4-1.2,9.4-3.7,12.2c-2.4,2.8-5.6,4.1-9.6,4.1c-3.9,0-7.1-1.4-9.6-4.1    c-2.5-2.8-3.7-6.8-3.7-12.2v-74.1c0-4.9,1.1-8.6,3.4-11.1c2.2-2.5,5.2-3.8,8.9-3.8c3.5,0,6.5,1.2,8.9,3.6s3.6,5.6,3.6,9.8v2.5    c4.5-5.4,9.3-9.3,14.4-11.9c5.1-2.5,10.8-3.8,17.1-3.8c6.5,0,12.1,1.3,16.8,3.9s8.5,6.5,11.6,11.8c4.4-5.3,9-9.2,14-11.8    c5-2.6,10.5-3.8,16.6-3.8c7.1,0,13.2,1.4,18.3,4.2c5.1,2.8,8.9,6.8,11.5,12c2.2,4.7,3.3,12,3.3,22.1v50.6c0,5.4-1.2,9.5-3.7,12.2    s-5.7,4.1-9.8,4.1c-3.9,0-7.1-1.4-9.6-4.1c-2.5-2.8-3.7-6.8-3.7-12.2V149c0-5.6-0.2-10-0.7-13.4s-1.8-6.2-3.8-8.4    c-2.1-2.3-5.3-3.4-9.5-3.4c-3.4,0-6.7,1-9.7,3c-3.1,2-5.5,4.7-7.2,8.2C799.8,139.3,798.8,147,798.8,158.1z"
                        />
                        <path className="km-logo-varient3-1" d="M944,194.2v-3.3c-3.1,3.9-6.4,7.2-9.8,9.9c-3.4,2.7-7.1,4.6-11.2,5.9c-4,1.3-8.7,1.9-13.8,1.9    c-6.3,0-11.9-1.3-16.8-3.9c-5-2.6-8.8-6.2-11.5-10.7c-3.2-5.5-4.8-13.4-4.8-23.7V119c0-5.2,1.2-9.1,3.5-11.6    c2.3-2.6,5.4-3.8,9.3-3.8c3.9,0,7.1,1.3,9.5,3.9s3.6,6.5,3.6,11.6v41.5c0,6,0.5,11.1,1.5,15.1c1,4.1,2.8,7.3,5.5,9.6    c2.6,2.3,6.2,3.5,10.7,3.5c4.4,0,8.5-1.3,12.3-3.9c3.9-2.6,6.7-6,8.4-10.2c1.5-3.7,2.2-11.7,2.2-24.1v-31.5c0-5.1,1.2-9,3.6-11.6    c2.4-2.6,5.5-3.9,9.4-3.9s7,1.3,9.3,3.8c2.3,2.6,3.5,6.4,3.5,11.6v75c0,4.9-1.1,8.6-3.4,11.1c-2.2,2.5-5.1,3.7-8.7,3.7    c-3.5,0-6.5-1.3-8.8-3.8C945.2,202.4,944,198.8,944,194.2z"
                        />
                        <path className="km-logo-varient3-1" d="M1012.4,117.8v3.1c4.6-6,9.5-10.4,14.9-13.2c5.4-2.8,11.6-4.2,18.6-4.2c6.8,0,12.9,1.5,18.3,4.5    s9.4,7.2,12,12.6c1.7,3.2,2.8,6.6,3.3,10.2c0.5,3.7,0.8,8.3,0.8,14V193c0,5.2-1.2,9.1-3.6,11.8s-5.5,4-9.2,4c-3.9,0-7-1.4-9.4-4.1    c-2.4-2.7-3.6-6.6-3.6-11.7v-43.2c0-8.5-1.2-15.1-3.6-19.6s-7.1-6.8-14.2-6.8c-4.6,0-8.8,1.4-12.6,4.1c-3.8,2.8-6.6,6.5-8.3,11.3    c-1.3,3.9-1.9,11.1-1.9,21.6v32.4c0,5.3-1.2,9.2-3.7,11.8c-2.4,2.6-5.6,3.9-9.4,3.9c-3.7,0-6.8-1.4-9.2-4.1    c-2.4-2.7-3.6-6.6-3.6-11.7v-74.5c0-4.9,1.1-8.6,3.2-11.1c2.1-2.4,5.1-3.7,8.8-3.7c2.3,0,4.3,0.5,6.2,1.6c1.8,1.1,3.3,2.7,4.4,4.8    C1011.8,112.1,1012.4,114.7,1012.4,117.8z"
                        />
                        <path className="km-logo-varient3-1" d="M1114.1,91.5c-3.6,0-6.7-1.1-9.2-3.3c-2.6-2.2-3.8-5.3-3.8-9.4c0-3.7,1.3-6.7,3.9-9.1s5.7-3.6,9.2-3.6    c3.4,0,6.3,1.1,8.9,3.2c2.6,2.2,3.9,5.3,3.9,9.4c0,4-1.3,7.1-3.8,9.3C1120.5,90.3,1117.5,91.5,1114.1,91.5z M1126.9,118.2V193    c0,5.2-1.2,9.1-3.7,11.8s-5.6,4-9.4,4s-6.9-1.4-9.3-4.1c-2.4-2.7-3.6-6.6-3.6-11.7v-74.1c0-5.1,1.2-9,3.6-11.6s5.5-3.9,9.3-3.9    s6.9,1.3,9.4,3.9C1125.6,110,1126.9,113.6,1126.9,118.2z"
                        />
                        <path className="km-logo-varient3-1" d="M1241.2,176.7c0,3.2-1,6.7-2.9,10.3c-1.9,3.7-4.9,7.2-8.8,10.5c-4,3.3-8.9,6-14.9,8s-12.8,3-20.3,3    c-16,0-28.5-4.7-37.5-14s-13.5-21.8-13.5-37.5c0-10.6,2.1-20,6.2-28.2s10.1-14.5,17.8-18.9c7.8-4.5,17.1-6.7,27.9-6.7    c6.7,0,12.9,1,18.5,2.9c5.6,2,10.3,4.5,14.2,7.6c3.9,3.1,6.9,6.4,8.9,9.9c2.1,3.5,3.1,6.8,3.1,9.8c0,3.1-1.2,5.7-3.5,7.9    s-5.1,3.2-8.4,3.2c-2.2,0-3.9-0.6-5.4-1.7c-1.4-1.1-3-2.9-4.8-5.4c-3.2-4.8-6.5-8.4-9.9-10.8c-3.4-2.4-7.8-3.6-13.1-3.6    c-7.7,0-13.8,3-18.5,9c-4.7,6-7,14.2-7,24.5c0,4.9,0.6,9.3,1.8,13.4c1.2,4.1,2.9,7.6,5.2,10.4c2.3,2.9,5,5.1,8.3,6.5    c3.2,1.5,6.8,2.2,10.6,2.2c5.2,0,9.6-1.2,13.3-3.6s7-6.1,9.8-11c1.6-2.9,3.3-5.2,5.1-6.8c1.8-1.6,4.1-2.5,6.7-2.5    c3.2,0,5.8,1.2,7.9,3.6C1240.2,171.5,1241.2,174,1241.2,176.7z"
                        />
                        <path className="km-logo-varient3-1" d="M1324,194.2c-6.3,4.9-12.3,8.5-18.2,11c-5.9,2.4-12.4,3.7-19.7,3.7c-6.6,0-12.5-1.3-17.5-3.9    c-5-2.6-8.9-6.2-11.6-10.7s-4.1-9.4-4.1-14.6c0-7.1,2.2-13.1,6.7-18.1s10.7-8.3,18.5-10.1c1.6-0.4,5.7-1.2,12.2-2.6    c6.5-1.3,12.1-2.5,16.7-3.7c4.6-1.1,9.7-2.5,15.1-4c-0.3-6.8-1.7-11.8-4.1-15s-7.5-4.8-15.1-4.8c-6.6,0-11.5,0.9-14.8,2.8    c-3.3,1.8-6.2,4.6-8.5,8.3c-2.4,3.7-4,6.1-5,7.3s-3.1,1.8-6.3,1.8c-2.9,0-5.4-0.9-7.5-2.8c-2.1-1.9-3.2-4.3-3.2-7.2    c0-4.6,1.6-9,4.8-13.3c3.2-4.3,8.3-7.8,15.1-10.6c6.8-2.8,15.3-4.2,25.5-4.2c11.4,0,20.3,1.3,26.8,4s11.1,6.9,13.8,12.8    c2.7,5.8,4,13.5,4,23.1c0,6.1,0,11.2,0,15.5c0,4.2-0.1,8.9-0.1,14.1c0,4.9,0.8,9.9,2.4,15.2s2.4,8.7,2.4,10.2    c0,2.7-1.2,5.1-3.7,7.3s-5.3,3.3-8.5,3.3c-2.7,0-5.3-1.2-7.9-3.7C1329.7,202.6,1326.9,198.9,1324,194.2z M1322.3,156.7    c-3.8,1.4-9.3,2.9-16.6,4.4c-7.2,1.5-12.3,2.7-15,3.4c-2.8,0.7-5.4,2.2-8,4.3c-2.5,2.1-3.8,5.1-3.8,8.9c0,3.9,1.5,7.3,4.5,10    s6.9,4.1,11.7,4.1c5.1,0,9.8-1.1,14.2-3.4c4.3-2.2,7.5-5.1,9.5-8.7c2.3-3.9,3.5-10.4,3.5-19.4L1322.3,156.7L1322.3,156.7z"
                        />
                        <path className="km-logo-varient3-1" d="M1365.4,105.8h2.8V90.2c0-4.2,0.1-7.4,0.3-9.8c0.2-2.4,0.8-4.4,1.8-6.1c1-1.8,2.5-3.2,4.4-4.3    c1.9-1.1,4-1.7,6.4-1.7c3.3,0,6.3,1.2,8.9,3.7c1.8,1.6,2.9,3.7,3.4,6c0.5,2.4,0.7,5.7,0.7,10.1v17.6h9.5c3.7,0,6.5,0.9,8.4,2.6    s2.9,4,2.9,6.7c0,3.5-1.4,5.9-4.1,7.3c-2.8,1.4-6.7,2.1-11.8,2.1h-4.8V172c0,4,0.1,7.2,0.4,9.3c0.3,2.2,1,4,2.3,5.3    c1.2,1.4,3.2,2,6,2c1.5,0,3.6-0.3,6.2-0.8s4.6-0.8,6.1-0.8c2.1,0,4,0.8,5.6,2.5c1.7,1.7,2.5,3.7,2.5,6.2c0,4.2-2.3,7.4-6.8,9.6    s-11.1,3.3-19.6,3.3c-8.1,0-14.2-1.4-18.4-4.1c-4.2-2.7-6.9-6.5-8.2-11.3c-1.3-4.8-1.9-11.2-1.9-19.3v-49.7h-3.4    c-3.7,0-6.6-0.9-8.5-2.7c-2-1.8-2.9-4-2.9-6.7s1-4.9,3.1-6.7C1358.5,106.7,1361.4,105.8,1365.4,105.8z"
                        />
                        <path className="km-logo-varient3-1" d="M1499.8,162.5h-50.7c0.1,5.9,1.2,11.1,3.6,15.6c2.3,4.5,5.4,7.9,9.2,10.2c3.8,2.3,8,3.4,12.7,3.4    c3.1,0,5.9-0.4,8.5-1.1c2.6-0.7,5-1.9,7.4-3.4s4.6-3.2,6.6-5s4.6-4.2,7.9-7.2c1.3-1.1,3.2-1.7,5.7-1.7c2.7,0,4.8,0.7,6.5,2.2    c1.6,1.5,2.5,3.5,2.5,6.2c0,2.3-0.9,5.1-2.8,8.2c-1.8,3.1-4.6,6.1-8.3,9c-3.7,2.9-8.3,5.3-13.9,7.2s-12,2.8-19.3,2.8    c-16.6,0-29.6-4.7-38.8-14.2c-9.2-9.5-13.8-22.4-13.8-38.6c0-7.7,1.1-14.8,3.4-21.3s5.6-12.2,10-16.8c4.4-4.7,9.7-8.3,16.1-10.8    s13.5-3.7,21.2-3.7c10.1,0,18.8,2.1,26,6.4s12.7,9.8,16.3,16.6c3.6,6.8,5.4,13.7,5.4,20.7c0,6.5-1.9,10.7-5.6,12.7    C1511.8,161.6,1506.5,162.5,1499.8,162.5z M1449.1,147.8h47c-0.6-8.9-3-15.5-7.2-19.9c-4.1-4.4-9.6-6.6-16.4-6.6    c-6.5,0-11.7,2.2-15.9,6.7C1452.5,132.5,1450,139.1,1449.1,147.8z"
                        />
                      </g>
                    </g>
                    <g id="Layer_2_1_">
                      <g>
                        <g>
                          <ellipse className="km-logo-varient3-1" cx="102.7" cy="143" rx="17.9" ry="17.9" />
                          <ellipse className="km-logo-varient3-1" cx="156.1" cy="143" rx="17.9" ry="17.9" />
                          <circle className="km-logo-varient3-1" cx="204.8" cy="143" r="17.9" />
                        </g>
                        <g>
                          <path className="km-logo-varient3-1" d="M154.7,16.9c-3.7-6.2-10.5-10.3-18.2-10.3c-10.1,0-18.5,7-20.7,16.4c-38.2,12.4-68.3,42.6-80.6,80.8     c-9.6,2.1-16.7,10.6-16.7,20.8c0,7.9,4.3,14.8,10.7,18.5c3.1,1.8,6.7,2.8,10.5,2.8c4.2,0,8-1.2,11.3-3.3c6-3.8,10-10.4,10-18     c0-5.3-1.9-10.1-5.1-13.8c10.1-31.7,35-56.7,66.6-66.9c3.7,3.3,8.6,5.2,14,5.2c7.7,0,14.5-4.1,18.2-10.3c2-3.2,3.1-7,3.1-11     C157.7,23.9,156.6,20.1,154.7,16.9z"
                          />
                          <path className="km-logo-varient3-1" d="M273.9,104.2c-9.8-30.9-31.2-56.6-59.2-71.9c-0.8-11-10-19.7-21.2-19.7c-6,0-11.5,2.5-15.4,6.6     c-3.6,3.8-5.9,9-5.9,14.7c0,2.3,0.4,4.6,1.1,6.7c2.8,8.4,10.8,14.5,20.2,14.5c4.1,0,7.9-1.2,11.2-3.2     c22.4,12.5,39.7,33.1,47.8,57.9c-3.7,3.8-6,9.1-6,14.8c0,8.1,4.5,15.1,11.2,18.7c3,1.6,6.4,2.5,10,2.5c4.4,0,8.6-1.4,12-3.7     c5.6-3.8,9.3-10.3,9.3-17.5C289,115,282.6,106.9,273.9,104.2z"
                          />
                          <path className="km-logo-varient3-1" d="M277.1,167.7c-3.9-4.5-9.6-7.3-16-7.3c-1.8,0-3.4,0.2-5.1,0.6c-9.3,2.3-16.2,10.7-16.2,20.6     c0,4.6,1.5,8.9,4,12.4c-17.9,30.8-51.3,51.5-89.4,51.5c-38.2,0-71.5-20.7-89.4-51.5c2.5-3.5,4-7.8,4-12.4     c0-10-6.9-18.4-16.3-20.7c-1.6-0.4-3.3-0.6-5-0.6c-6.4,0-12.1,2.8-16,7.2c-3.3,3.7-5.3,8.7-5.3,14c0,10.7,7.9,19.6,18.3,21     c21.3,38.6,62.5,64.8,109.7,64.8s88.4-26.2,109.7-64.8c10.3-1.5,18.1-10.4,18.1-21C282.3,176.3,280.4,171.4,277.1,167.7z"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
            </div>
        </div>
    </header>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1 className="login-signup-heading">{this.state.loginFormText}</h1>
                    <p className="text-muted login-signup-sub-heading">{this.state.loginFormSubText}</p>
                    <div className="input-group mb-3" hidden ={this.state.hideUserNameInputbox}>
                      {/* <span className="input-group-addon"><i className="icon-user"></i></span> */}
                       <input autoFocus type="text" className="input" placeholder=" "  onChange = { this.setUserName } value={ this.state.userName } onBlur ={this.state.handleUserNameBlur} onKeyPress={this.onKeyPress} required/>
                       <label className="label-for-input email-label">Username</label>

                    </div>
                    <div className="input-group mb-4" hidden ={this.state.hideAppListDropdown}>
                      {/* <span className="input-group-addon"><i className="icon-user"></i></span> */}
                      <DropdownButton title={this.state.dropDownBoxTitle}  id="split-button-pull-right" >
                          {

                            Object.keys(this.state.appIdList).map(function(key) {
                              return <MenuItem onClick={()=>{
                                this.state.applicationId=key;
                                this.state.applicationName = this.state.appIdList[key];
                                this.setState({"dropDownBoxTitle":key});

                              }}>{key}</MenuItem>
                            }.bind(this))
                        }
                      </DropdownButton>
                    </div>
                    <div className="input-group mb-4" hidden ={this.state.hidePasswordInputbox}>
                      {/* <span className="input-group-addon"><i className="icon-lock"></i></span> */}
                      <input type="password" className="input" placeholder=" "  onChange = { this.setPassword } value={ this.state.password } onKeyPress={this.onKeyPress} required/>
                      <label className="label-for-input email-label">Password</label>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <button id="login-button" type="button" className="btn btn-primary px-3 km-login-btn btn-primary-custom" disabled={this.state.loginButtonDisabled} onClick={(event) => this.login(event)}>{this.state.loginButtonText}</button>
                      </div>
                      <div className="col-3 text-left" >
                      {
                        !this.state.hideBackButton?
                        <button type="button" className="btn btn-primary px-3 km-btn-back km-login-btn btn-primary-custom btn-primary-custom--grey"  onClick= { this.backToLogin }>Back</button>
                        :null
                      }
                      </div>
                      <div className="col-6 text-right">
                        <button type="button" id ="btn-forgot-password" className="btn btn-link px-0" hidden={this.state.isForgotPwdHidden}  onClick= { this.initiateForgotPassword }>Forgot password?</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card card-inverse card-primary py-5 d-md-down-none signup-blue-card" style={{ width: 44 + '%' }}>
                  <div className="card-block text-center">
                    <div>
                      <h2 className="login-signup-heading">Sign up</h2>
                      <p className="login-signup-sub-heading">New User? Sign up now!</p>
                      <button type="button" className="btn btn-primary active mt-3 btn-primary-custom btn-primary-custom--white" onClick ={ this.register }>Register Now!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
