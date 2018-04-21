import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig} from '../../.../../../config/config.js';
import {Modal} from 'react-bootstrap';
import  {Button}  from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import {SplitButton, MenuItem, DropdownButton} from 'react-bootstrap';
import {resetPassword, getUserInfo} from '../../../utils/kommunicateClient';
import Notification from '../../model/Notification';
import CommonUtils from '../../../utils/CommonUtils';
import './login.css';
import ApplozicClient   from '../../../utils/applozicClient';
import ValidationUtils from  '../../../utils/validationUtils';
import { Buffer } from 'buffer';
import InputField from '../../../components/InputField/InputField';
import GoogleLogo from '../Register/logo_google.svg';
import GoogleSignIn from '../Register/btn_google_signin_dark_normal_web@2x.png';
import { Link } from 'react-router-dom';


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
    hidePasswordInputbox:false,
    hideAppListDropdown:true,
    loginFormText:"Login to Kommunicate",
    loginFormSubText:'Sign In to your account',
    loginButtonText:'Login',
    loginButtonAction:'Login',
    appIdList:{},
    dropDownBoxTitle:"Select Application.......",
    hideBackButton:true,
    loginButtonDisabled:false,
    hideSignupLink: false,
    isForgotPwdHidden:false,
    isLoginFrgtPassHidden: false,
    frgtPassSuccessConfirmation: true,
    subHeading:true,
    hideErrorMessage: true,
    errorMessageText: "Please enter user name to login",
    errorInputColor:'',
    errorMessageTextPassword:'',
    hideErrorMessagePassword: true,
    handleUserNameBlur:false,
    googleOAuth: false,
    loginType: 'email',
    hideGoogleLoginBtn:false,
    marginBottomFrgtPassHead:'8px',
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

    const search = this.props.location.search;
    const googleLogin = CommonUtils.getUrlParameter(search, 'googleLogin');
    console.log(googleLogin)

    if(googleLogin === 'true'){

      const email = CommonUtils.getUrlParameter(search, 'email');
      const loginType = CommonUtils.getUrlParameter(search, 'loginType');
      const _numOfApp = CommonUtils.getUrlParameter(search, 'numOfApp');

      console.log(email);
      console.log(loginType);
      console.log(_numOfApp);

      this.setState({
        googleOAuth: true,
        email: email,
        userName: email,
        password: 'CHANGE IT',
        loginButtonAction: 'getAppList',
        loginType: loginType
      }, () => {
        Promise.resolve(this.login()).then( numOfApp => {
          console.log(numOfApp);
          if(numOfApp == 1 && loginType === 'oauth'){
            this.submitForm()
          } else if (numOfApp == 1 && (loginType === 'email' || loginType === 'null')){
            this.setUpLocalStorageForLogin()
          } else if (numOfApp != 1 && (loginType === 'email' || loginType === 'null')){
            this.setState({
              googleOAuth: false
            })
          }
        })
      })
    }
  }

  onKeyPress(e) {
    if (e.charCode == 13) {
      var login = document.getElementById('login-button');
      login.click();
    }
  }

  blurHandler(){
    //this.setState({handleUserNameBlur:true})
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

  let loginUrl= getConfig().kommunicateApi.login;
  var userName= this.state.userName, password= this.state.password,applicationName=this.state.applicationName, applicationId=this.state.applicationId;
  
  if(!this.state.googleOAuth && (validator.isEmpty(this.state.userName)|| validator.isEmpty(this.state.password))){
    // Notification.warning("Email Id or Password can't be empty!");
      _this.setState({hideErrorMessagePassword: false, errorMessageTextPassword:"Email Id or Password can't be empty!"});
    
  }else{
    if (window.heap) {
      window.heap.identify(userName);
    }

    if (this.state.loginType === 'oauth'){
      loginUrl += "?loginType=oauth"
    } else if (this.state.loginType === 'email'){
      loginUrl += "?loginType=email"
    }

    this.setState({loginButtonDisabled:true});
    axios.post(loginUrl,{ userName: userName,password:password,applicationName:applicationName,applicationId:applicationId})
    .then(function(response){
      if(response.status==200&&response.data.code=='INVALID_CREDENTIALS'){
        // Notification.warning("Invalid credentials");
        _this.setState({hideErrorMessagePassword: false, errorMessageTextPassword:"Invalid Email Id or Password", loginButtonDisabled:false});
      } else if (response.status == 200 && response.data.code == "MULTIPLE_APPS") {
        _this.checkForMultipleApps(response.data.result);
        return;
      }
      
      if (response.status == 200 && response.data.code == 'SUCCESS') {
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

          _this.setState({'applicationId': response.data.result.application.applicationId});

          response.data.result.password = password;
          response.data.result.displayName=response.data.result.name;
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
    /*Promise.resolve(ApplozicClient.getUserInfoByEmail({"email":this.state.email,"applicationId":this.state.applicationId})).then(data=>{
      data?_this.state.userName=data.userId:_this.state.userName=_this.state.email;
    return this.submitForm();
    });*/
    this.state.userName = this.state.email;
    return this.submitForm();
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
    //  Notification.info("please enter user name to login");
    _this.setState({hideErrorMessage: false, errorMessageText:"Please enter user name to login"});

      return;
    }
   let param = ValidationUtils.isValidEmail(this.state.email)?"emailId":"userId";
      var urlEncodedName = encodeURIComponent(this.state.email);

      //console.log("name",urlEncodedName);
    const getApplistUrl = getConfig().applozicPlugin.applicationList+"&"+param+"="+urlEncodedName;
    var _this=this;
    return  axios.get(getApplistUrl)
    .then(function(response){
      _this.checkForMultipleApps(response.data);
   });
}
}
checkForMultipleApps=(result)=>{
  console.log(result);

  var _this = this;
  if(result!=="Invalid userId or EmailId"){
    const numOfApp=Object.keys(result).length;
    if(numOfApp===1){
      _this.state.applicationId=Object.keys(result)[0];
      _this.state.applicationName=result[_this.state.applicationId];
      _this.state.appIdList= result;
      if(_this.state.loginButtonAction=="passwordReset"){
        resetPassword({userName:_this.state.userName||_this.state.email,applicationId:_this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
        return 1;
      }
      _this.setState({loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'Enter password to continue ',hidePasswordInputbox:false,hideAppListDropdown:true,hideUserNameInputbox:true,loginFormText:"Password",hideBackButton:false,isForgotPwdHidden:false, hideSignupLink:false});
  }else if(numOfApp>1){
      _this.state.appIdList= result;
    if(_this.state.loginButtonAction=="passwordReset"){
      _this.setState({loginButtonText:'Submit',loginButtonAction:'passwordResetAppSected',loginFormSubText:'please select your application and submit',hidePasswordInputbox:true,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Select Application..",hideBackButton:false,hideSignupLink:true, isForgotPwdHidden:true, hideSignupLink:true, hideGoogleLoginBtn:true});
    }else{
    _this.setState({loginButtonDisabled:false, loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'You are registered in multiple applications',hidePasswordInputbox:false,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Hi! Select your application",subHeading:false,hideBackButton:false,isForgotPwdHidden:true,hideSignupLink:false,hideSignupLink:true, hideGoogleLoginBtn:true});
  }
}else{
  // Notification.info("You are not a registered user. Please sign up!!!");
  _this.setState({hideErrorMessage: false, errorMessageText:"You are not a registered user. Please sign up!!!"});
}
  return numOfApp;
}else{
    console.log("err while getting application list, response : ",result);
    Notification.error(result);
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
  loginButtonAction:'passwordReset',hideBackButton:false,hidePasswordInputbox:true,hideAppListDropdown:true,hideUserNameInputbox:false,isForgotPwdHidden:true, hideSignupLink:true,hideGoogleLoginBtn:true, marginBottomFrgtPassHead:'50px'});
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

checkLoginType = () => {
  return Promise.resolve(getUserInfo(this.state.email, this.state.applicationId))
}

showPasswordField = () => {

  if (this.state.hidePasswordInputbox || this.state.googleOAuth) {
    return (
      <div className="input-group mb-4"></div>
    );
  }else{
    return (
      <div className="input-group mb-4">
        <div className="password-input-label-group">
          <input type={this.state.type} className="input" placeholder=" "  onChange = { this.setPassword } value={ this.state.password } onKeyPress={this.onKeyPress} style={{borderColor: this.state.errorInputColor}} required/>
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
        <div className="input-error-div" hidden={this.state.hideErrorMessagePassword}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
            <g id='Page-1' fill='none' fillRule='evenodd'>
                <g id='Framework' transform='translate(-77 -805)' fill='#ED1C24'>
                    <g id='Wrong-Value-with-Notification' transform='translate(77 763)'>
                        <g id='Error-Notification' transform='translate(0 40)'>
                            <path d='M0,10 C0,5.582 3.581,2 8,2 C12.418,2 16,5.582 16,10 C16,14.418 12.418,18 8,18 C3.581,18 0,14.418 0,10 Z M9.315,12.718 C9.702,13.105 10.331,13.105 10.718,12.718 C11.106,12.331 11.106,11.702 10.718,11.315 L9.41,10.007 L10.718,8.698 C11.105,8.311 11.105,7.683 10.718,7.295 C10.33,6.907 9.702,6.907 9.315,7.295 L8.007,8.603 L6.694,7.291 C6.307,6.903 5.678,6.903 5.291,7.291 C4.903,7.678 4.903,8.306 5.291,8.694 L6.603,10.006 L5.291,11.319 C4.903,11.707 4.903,12.335 5.291,12.722 C5.678,13.11 6.307,13.11 6.694,12.722 L8.007,11.41 L9.315,12.718 Z'
                            id='Error-Icon' />
                        </g>
                    </g>
                </g>
            </g>
          </svg>
          <p className="input-error-message">{this.state.errorMessageTextPassword}</p>
        </div>
      </div>
    );
  }
}

  setUpLocalStorageForLogin = () => {

    var search = window.location.href;
    const userDetails = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    console.log(userDetails)

    if (typeof (Storage) !== "undefined") {

      if (window.$applozic && window.$applozic.fn && window.$applozic.fn.applozic("getLoggedInUser")) {
        window.$applozic.fn.applozic('logout');
      }

      if (userDetails.apzToken) {
      } else {
        var apzToken = new Buffer(userDetails.userName + ":" + userDetails.accessToken).toString('base64');
        userDetails.apzToken = apzToken;
      }

      if (!userDetails.application) {
        console.log("response doesn't have application, create {}");
        userDetails.application = {};
      }
      userDetails.application.applicationId = userDetails.applicationId;

      userDetails.displayName=userDetails.name;
      CommonUtils.setUserSession(userDetails);
    }

    if (window.$applozic) {
      var options = window.applozic._globals;
      options.userId = userDetails.userName;
      options.accessToken = userDetails.accessToken;
      window.$applozic.fn.applozic(options);
    }

    this.props.history.push("/dashboard");
    this.state=this.initialState;
  }

  checkLoginTypeWrapper = () => {
    this.checkLoginType().then( response => {
      console.log(response.data.data.loginType);
      if (response.data.data.loginType === 'oauth') {
        this.submitForm()
      } else {
        this.setState({
          googleOAuth: false
        })
      }
    })
  }


  render() {
    return (
      <div className="app flex-row align-items-center login-app-div">
      {/* <header>
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
    </header> */}
        <div className="container">
        <div className="logo-container text-center">
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
          <div className="row justify-content-center login-form-div">
            <div className="col-lg-5 col-md-8 col-sm-12 col-xs-12">
            <hr className="hr"/>
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <div className="card-block-login-frgtpass-container" hidden={this.state.isLoginFrgtPassHidden}>
                    <h1 className="login-signup-heading text-center" style={{marginBottom: this.state.marginBottomFrgtPassHead}}>{this.state.loginFormText}</h1>
                    <p className="setup-sub-heading text-center" hidden={this.state.subHeading}>{this.state.loginFormSubText}</p>

                    {/* <div className="input-group mb-3" hidden ={this.state.hideUserNameInputbox}>
                       <input autoFocus type="text" className="input" placeholder=" "  onChange = { this.setEmail } value={ this.state.email } onBlur ={this.state.handleUserNameBlur} onKeyPress={this.onKeyPress} style={{borderColor: this.state.errorInputColor}} required/>
                       <label className="label-for-input email-label">Email Id</label>
                       <div className="input-error-div" hidden={this.state.hideErrorMessage}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                          <g id='Page-1' fill='none' fillRule='evenodd'>
                              <g id='Framework' transform='translate(-77 -805)' fill='#ED1C24'>
                                  <g id='Wrong-Value-with-Notification' transform='translate(77 763)'>
                                      <g id='Error-Notification' transform='translate(0 40)'>
                                          <path d='M0,10 C0,5.582 3.581,2 8,2 C12.418,2 16,5.582 16,10 C16,14.418 12.418,18 8,18 C3.581,18 0,14.418 0,10 Z M9.315,12.718 C9.702,13.105 10.331,13.105 10.718,12.718 C11.106,12.331 11.106,11.702 10.718,11.315 L9.41,10.007 L10.718,8.698 C11.105,8.311 11.105,7.683 10.718,7.295 C10.33,6.907 9.702,6.907 9.315,7.295 L8.007,8.603 L6.694,7.291 C6.307,6.903 5.678,6.903 5.291,7.291 C4.903,7.678 4.903,8.306 5.291,8.694 L6.603,10.006 L5.291,11.319 C4.903,11.707 4.903,12.335 5.291,12.722 C5.678,13.11 6.307,13.11 6.694,12.722 L8.007,11.41 L9.315,12.718 Z'
                                          id='Error-Icon' />
                                      </g>
                                  </g>
                              </g>
                          </g>
                        </svg>
                        <p className="input-error-message">{this.state.errorMessageText}</p>
                       </div>
                    </div> */}

                        <a className="signup-with-google-btn" hidden={this.state.hideGoogleLoginBtn} href={"https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&access_type=offline&redirect_uri=" + getConfig().kommunicateBaseUrl  + "/google/authCode&response_type=code&client_id=155543752810-134ol27bfs1k48tkhampktj80hitjh10.apps.googleusercontent.com&state=google_sign_in"}>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="24" height="24">
                            <defs>
                              <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                            </defs>
                            <clipPath id="b">
                                <use overflow="visible" xlinkHref="#a" />
                            </clipPath>
                            <path fill="#FBBC05" d="M0 37V11l17 13z" clipPath="url(#b)" />
                            <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" clipPath="url(#b)" />
                            <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" clipPath="url(#b)" />
                            <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" clipPath="url(#b)" />
                          </svg>
                          Login with Google
                        </a>

                        <div className="or-seperator" hidden={this.state.hideGoogleLoginBtn}>
                          <div className="or-seperator--line"></div>
                          <div className="or-seperator--text">OR</div>
                        </div>

                    <div hidden ={this.state.hideUserNameInputbox}>
                      <InputField
                      inputType={'email'}
                                  id={'email-input-field'}
                                  title={'Email Id'}
                                  name={'email'}
                                  onChange={this.setEmail}
                                  value={this.state.email}
                                  errorMessage={this.state.errorMessageText}
                                  hideErrorMessage={this.state.hideErrorMessage}
                                  required={'required'}
                                  onBlur ={this.blurHandler} onKeyPress={this.onKeyPress}
                                  style={{borderColor: this.state.errorInputColor}}/>
                    </div>
                   

                    <div className="input-group mb-4" hidden ={this.state.hideAppListDropdown}>
                      {/* <span className="input-group-addon"><i className="icon-user"></i></span> */}
                      <DropdownButton title={this.state.dropDownBoxTitle}  id="split-button-pull-right" >
                          {

                            Object.keys(this.state.appIdList).map(function(key) {
                              return <MenuItem key = {key} onClick={()=>{
                                this.state.applicationId=key;
                                this.state.applicationName = this.state.appIdList[key];
                                this.setState({"dropDownBoxTitle":key});

                                this.checkLoginTypeWrapper()

                              }}>{key}</MenuItem>
                            }.bind(this))
                        }
                      </DropdownButton>
                    </div>
                    {/* <div className="password-input-label-group" hidden ={this.state.hidePasswordInputbox}>
                      <InputField
                                  inputType={this.state.type}
                                  title={'Password'}
                                  name={'password'}
                                  controlFunc={this.setPassword}
                                  content={this.state.password}
                                  errorMessage={this.state.errorMessageTextPassword}
                                  hideErrorMessage={this.state.hideErrorMessagePassword}
                                  required={'required'}
                                  keyPressFunc={this.onKeyPress}/>
                        <span className="show-paasword-btn" onClick={this.showHide}>
                      {this.state.type === 'input' ? <svg fill="#999999" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M0 0h24v24H0z" fill="none"/>
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg> :     <svg xmlns="http://www.w3.org/2000/svg" fill="#999999" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/>
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>}
                        
                      </span>
                    </div> */}
                    { /*
                      * Just for more better security no need to render the password field.
                      * User can just unhide the field if it is hidden it is better just to not render the field.
                      */
                      this.showPasswordField()
                    }
                    <div className="row">
                      <div className="col-12 text-right forgot-password-div">
                        <button type="button" id ="btn-forgot-password" className="btn btn-link px-0" hidden={this.state.isForgotPwdHidden}  onClick= { this.initiateForgotPassword }>Forgot password?</button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 text-center">
                        <button id="login-button" type="button" className="km-button km-button--primary step-1-submit-btn" disabled={this.state.loginButtonDisabled} onClick={(event) => this.login(event)}>{this.state.loginButtonText}</button>
                        <p className="have-need-account" hidden={this.state.hideSignupLink}>
                        Don’t have an account? <Link to={'/signup'}>Sign up</Link>
                      </p>
                      </div>
                      <div className="col-12 text-left" >
                      {
                        !this.state.hideBackButton?
                        <button type="button" className="km-button km-button--secondary step-1-submit-btn"  onClick= { this.backToLogin }>Back</button>
                        :null
                      }
                      </div>
                    </div>
               
                    
                    </div>
                    <div className="frgtpass-success-confirmation text-center" hidden={this.state.frgtPassSuccessConfirmation}>
                      <p className="text-muted login-signup-sub-heading">{this.state.loginFormSubText}</p>
                      <div className="svg-container">
                      <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1">
                        <g id="LOGIN-&amp;-SIGNUP-PAGES" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="Forgot-Password" transform="translate(-367.000000, -245.000000)" fillRule="nonzero" fill="#3DE00E">
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
                {/* <div className="card card-inverse card-primary py-5 d-md-down-none signup-blue-card p-4" style={{ width: 44 + '%' }}>
                  <div className="card-block text-center">
                    <div>
                      <h2 className="login-signup-heading">Sign up</h2>
                      <p className="login-signup-sub-heading">New User? Sign up now!</p>
                      <button type="button" className="btn btn-primary active mt-3 btn-primary-custom btn-primary-custom--white" onClick ={ this.register }>Register Now!</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="bottom-shape-container"></div>
        </div>
      </div>
    );
  }
}

export default Login;
