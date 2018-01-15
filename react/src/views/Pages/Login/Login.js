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
import ApplozicClient   from '../../../utils/applozicClient';
import ValidationUtils from  '../../../utils/validationUtils';
import { Buffer } from 'buffer';


class Login extends Component {

constructor(props){
  super(props);
  this.initialState = {
    userName:'',
    email:'',
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
    isForgotPwdHidden:true,
    isLoginFrgtPassHidden: false,
    frgtPassSuccessConfirmation: true
  }
  this.showHide = this.showHide.bind(this);
  this.state=Object.assign({type: 'password'},this.initialState);
  this.submitForm = this.submitForm.bind(this);
  this.websiteUrl = this.websiteUrl.bind(this);
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

  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'password' ? 'input' : 'password'
    })  
  }

  setEmail =(e)=>{
    this.setState({email:e.target.value});
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
  this.setState({"loginFormSubText":'Password reset link has been sent', isLoginFrgtPassHidden:true, frgtPassSuccessConfirmation:false});
  // Notification.info("Password reset link has been sent on your mail!");
  console.log("response",response);
  // !response.err?this.backToLogin():null;
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
    Notification.warning("Email Id or Password can't be empty!");
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

          if (window.$applozic && window.$applozic.fn && window.$applozic.fn.applozic("getLoggedInUser")) {
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
    let apzToken = 'Basic '+ new Buffer(this.state.email+':'+this.state.password).toString('base64');
    Promise.resolve(ApplozicClient.getUserInfoByEmail({"email":this.state.email,"applicationId":this.state.applicationId, 'apzToken':apzToken})).then(data=>{
      _this.state.userName=data.userId||_this.state.email;
    return this.submitForm();
    });
  }else if(this.state.loginButtonAction==="passwordResetAppSected" ){
    if(this.state.applicationId){
      Promise.resolve(ApplozicClient.getUserInfoByEmail({"email":this.state.email,"applicationId":this.state.applicationId})).then(data=>{
        _this.state.userName=data.userId||_this.state.email;
      resetPassword({userName:this.state.userName,applicationId:this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
      return;
      });
    }else{
      Notification.info("Please select your application");
      return;
    }
  }else{
    console.log(this.state.loginButtonAction);
    if(!this.state.email && this.state.loginButtonAction ==="getAppList"){
     //alert("please enter user name to login");
     Notification.info("please enter user name to login");
      return;
    }
   let param = ValidationUtils.isValidEmail(this.state.email)?"emailId":"userId";
      var urlEncodedName = ValidationUtils.isValidEmail(this.state.email)?encodeURIComponent(this.state.email):encodeURIComponent(this.state.userName);

      //console.log("name",urlEncodedName);
    const getApplistUrl = getConfig().applozicPlugin.applicationList+"&"+param+"="+urlEncodedName;
    var _this=this;
    return  axios.get(getApplistUrl)
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
  this.props.history.push("/signup");

}

 initiateForgotPassword = (event)=>{
  this.state.loginButtonAction="passwordReset";
  this.setState({"loginFormText":"Resetting Password",
  "loginFormSubText":'Please enter your registered email ID, your password reset link will be sent there.',
  loginButtonText:'Submit',
  loginButtonAction:'passwordReset',hideBackButton:false,hidePasswordInputbox:true,hideAppListDropdown:true,hideUserNameInputbox:false,isForgotPwdHidden:true});
  //this.login(event);
  //const resetPasswordUrl= getConfig().kommunicateApi.passwordResetUrl.replace(":userName",this.state.userName);
  /*axios.get(resetPasswordUrl)
 .then(function(response){}).then(response=>{
   console.log("got data afrom server", response)
 }).catch(err=>{
   console.log("err while getting user by email address",err.response);
 })*/
}

websiteUrl = (e)=> {
  e.preventDefault();
  let kmWebsiteUrl = getConfig().kommunicateWebsiteUrl;
  window.location = kmWebsiteUrl;
}


  render() {
    return (
      <div className="app flex-row align-items-center login-app-div">
      <header>
        <div className="header-container">
          <div className="logo-container">
            <a href="#" onClick={this.websiteUrl}>
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
            </a>
            </div>
        </div>
    </header>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <div className="card-block-login-frgtpass-container" hidden={this.state.isLoginFrgtPassHidden}>
                    <h1 className="login-signup-heading">{this.state.loginFormText}</h1>
                    <p className="text-muted login-signup-sub-heading">{this.state.loginFormSubText}</p>
                    <div className="input-group mb-3" hidden ={this.state.hideUserNameInputbox}>
                      {/* <span className="input-group-addon"><i className="icon-user"></i></span> */}
                       <input autoFocus type="text" className="input" placeholder=" "  onChange = { this.setEmail } value={ this.state.email } onBlur ={this.state.handleUserNameBlur} onKeyPress={this.onKeyPress} required/>
                       <label className="label-for-input email-label">Email Id</label>

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
                      <input type={this.state.type} className="input" placeholder=" "  onChange = { this.setPassword } value={ this.state.password } onKeyPress={this.onKeyPress} required/>
                      <label className="label-for-input email-label">Password</label>
                      <span className="show-paasword-btn" onClick={this.showHide}>
                      {this.state.type === 'input' ? <svg fill="#999999" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M0 0h24v24H0z" fill="none"/>
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg> :     <svg xmlns="http://www.w3.org/2000/svg" fill="#999999" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/>
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>}
                        
                      </span>
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
                    </div>
                    <div className="row">
                      <div className="col-6 text-left forgot-password-div">
                        <button type="button" id ="btn-forgot-password" className="btn btn-link px-0" hidden={this.state.isForgotPwdHidden}  onClick= { this.initiateForgotPassword }>Forgot password?</button>
                      </div>
                    </div>
                    </div>
                    <div className="frgtpass-success-confirmation text-center" hidden={this.state.frgtPassSuccessConfirmation}>
                      <p className="text-muted login-signup-sub-heading">{this.state.loginFormSubText}</p>
                      <div className="svg-container">
                      <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1">
                        <g id="LOGIN-&amp;-SIGNUP-PAGES" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="Forgot-Password" transform="translate(-367.000000, -245.000000)" fill-rule="nonzero" fill="#3DE00E">
                            <g id="tick" transform="translate(367.000000, 245.000000)">
                              <polygon id="Shape" points="16.7125 23.275 14.175 25.6375 26.075 38.4125 53.9875 10.4125 51.5375 7.9625 26.075 33.425"/>
                              <path d="M0.525,28 C0.525,43.225 12.8625,55.475 28,55.475 C43.1375,55.475 55.475,43.225 55.475,28 L51.975,28 C51.975,41.2125 41.2125,51.975 28,51.975 C14.7875,51.975 4.025,41.2125 4.025,28 C4.025,14.7875 14.7875,4.025 28,4.025 L28,0.525 C12.8625,0.525 0.525,12.8625 0.525,28 Z" id="Shape"/>
                            </g>
                          </g>
                        </g>
                      </svg>
                      </div>
                      <button type="button" className="btn btn-primary px-3 km-login-btn btn-primary-custom " onClick ={ this.backToLogin }>Login</button>
                    </div>
                  </div>
                </div>
                <div className="card card-inverse card-primary py-5 d-md-down-none signup-blue-card p-4" style={{ width: 44 + '%' }}>
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
