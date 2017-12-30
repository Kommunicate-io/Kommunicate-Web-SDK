import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig} from '../../.../../../config/config.js';
import {Modal} from 'react-bootstrap';
import  {Button}  from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import {SplitButton, MenuItem} from 'react-bootstrap';
import {resetPassword} from '../../../utils/kommunicateClient';
import Notification from '../../model/Notification';
import CommonUtils from '../../../utils/CommonUtils';



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
    isForgotPwdHidden:false
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
        _this.setState({loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'Enter password to continue ',hidePasswordInputbox:false,hideAppListDropdown:true,hideUserNameInputbox:true,loginFormText:"Password",hideBackButton:false,isForgotPwdHidden:true});
    }else if(numOfApp>1){
      //popUpApplicationList(numOfApp,response.data);
        _this.state.appIdList= response.data;
      if(_this.state.loginButtonAction=="passwordReset"){
        _this.setState({loginButtonText:'Submit',loginButtonAction:'passwordResetAppSected',loginFormSubText:'please select your application and submit',hidePasswordInputbox:true,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Select Application..",hideBackButton:false});
      }else{
      _this.setState({loginButtonText:'Login',loginButtonAction:'Login',loginFormSubText:'you are registered in multiple application. please select one Application and enter password to  login.',hidePasswordInputbox:false,hideAppListDropdown:false,hideUserNameInputbox:true,loginFormText:"Select Application..",hideBackButton:false,isForgotPwdHidden:true});
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
  loginButtonAction:'passwordReset',hideBackButton:false});
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1>{this.state.loginFormText}</h1>
                    <p className="text-muted">{this.state.loginFormSubText}</p>
                    <div className="input-group mb-3" hidden ={this.state.hideUserNameInputbox}>
                      {/* <span className="input-group-addon"><i className="icon-user"></i></span> */}
                       <input autoFocus type="text" className="input" placeholder=" "  onChange = { this.setUserName } value={ this.state.userName } onBlur ={this.state.handleUserNameBlur} onKeyPress={this.onKeyPress} required/>
                       <label className="label-for-input email-label">Username</label>

                    </div>
                    <div className="input-group mb-4" hidden ={this.state.hideAppListDropdown}>
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <SplitButton title={this.state.dropDownBoxTitle}  id="split-button-pull-right" >
                          {

                            Object.keys(this.state.appIdList).map(function(key) {
                              return <MenuItem onClick={()=>{
                                this.state.applicationId=key;
                                this.state.applicationName = this.state.appIdList[key];
                                this.setState({"dropDownBoxTitle":key});

                              }}>{key}</MenuItem>
                            }.bind(this))
                        }
                      </SplitButton>
                    </div>
                    <div className="input-group mb-4" hidden ={this.state.hidePasswordInputbox}>
                      {/* <span className="input-group-addon"><i className="icon-lock"></i></span> */}
                      <input type="password" className="input" placeholder=" "  onChange = { this.setPassword } value={ this.state.password } onKeyPress={this.onKeyPress} required/>
                      <label className="label-for-input email-label">Password</label>
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <button id="login-button" type="button" className="btn btn-primary px-3 km-login-btn" disabled={this.state.loginButtonDisabled} onClick={(event) => this.login(event)}>{this.state.loginButtonText}</button>
                      </div>
                      <div className="col-3 text-left" >
                      {
                        !this.state.hideBackButton?
                        <button type="button" className="btn btn-primary px-3 km-btn-back km-login-btn"  onClick= { this.backToLogin }>Back</button>
                        :null
                      }
                      </div>
                      <div className="col-6 text-right">
                        <button type="button" id ="btn-forgot-password" className="btn btn-link px-0" hidden={this.state.isForgotPwdHidden}  onClick= { this.initiateForgotPassword }>Forgot password?</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card card-inverse card-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <div className="card-block text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>New User? Sign up! </p>
                      <button type="button" className="btn btn-primary active mt-3" onClick ={ this.register }>Register Now!</button>
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
