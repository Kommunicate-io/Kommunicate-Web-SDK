import React, { Component } from 'react';
import validator from 'validator';
import axios from 'axios';
import {getConfig} from '../../../config/config.js';
import isEmail from 'validator/lib/isEmail';
import  {createCustomer, saveToLocalStorage,createCustomerOrAgent, getUserDetailsByToken} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification';
import CommonUtils from '../../../utils/CommonUtils';
import ApplozicClient from '../../../utils/applozicClient';
import GoogleSignIn from './btn_google_signin_dark_normal_web@2x.png';
import GoogleLogo from './logo_google.svg';
import { Link } from 'react-router-dom';
import { ROLE_TYPE, INVITED_USER_STATUS } from '../../../utils/Constant';
import kmloadinganimation from './km-loading-animation.svg';
import AnalyticsTracking from '../../../utils/AnalyticsTracking.js';
import { KommunicateLogoSvg } from '../../../assets/svg/svgs';
import { connect } from 'react-redux'
import * as Actions from '../../../actions/loginAction'

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
      applicationId:null,
      token:null,
      invitedBy:'',
      signupButtonTxt:'Create Account',
      subscription: 'startup',
      googleOAuth :false,
      isInvited:false,
      roleType:null,
      renderInvitationRevokedView :false,
      isDataFetched:false,
      googleSignUpUrl: getConfig().googleApi.googleApiUrl + "&state=google_sign_up"
    };
    this.showHide = this.showHide.bind(this);
    this.state=Object.assign({type: 'password'},this.initialState);
  }
  componentDidMount(){
    const search = this.props.location.search;
    const googleOAuth = CommonUtils.getUrlParameter(search, 'googleSignUp');

    if(googleOAuth === 'true'){
      this.setState({googleOAuth: true})
      document.getElementById("create-button").click();
    }
  }
  componentWillMount(){

    if (CommonUtils.getUserSession()) {
      window.location = "/dashboard";
    }
    
    const search = this.props.location.search;
    const isInvited = CommonUtils.getUrlParameter(search, 'invite');
    const token = CommonUtils.getUrlParameter(search, 'token');
    const invitedBy = CommonUtils.getUrlParameter(search, 'referer')
    const email = CommonUtils.getUrlParameter(search, 'email');
    if (email) {
      this.setState({email:email});
    }
    this.setState({
      isInvited:isInvited,
      invitedBy:invitedBy,
      token:token,
    });
    
    const googleOAuth = CommonUtils.getUrlParameter(search, 'googleSignUp')
    console.log(googleOAuth)

    if(googleOAuth === 'true'){
      this.setState({googleOAuth: true})
    }else if(googleOAuth === 'false'){
      console.log(googleOAuth)
      Notification.warning("User Already Exists", 3000);
    }
    
    const name = CommonUtils.getUrlParameter(search, 'name')
    console.log(name)

    if(name){
      this.setState({name: name})
      console.log(name)
    }
    
   if(isInvited){
     this.getUserDetails(token);
     this.state.isInvited=true;
     //this.state.invitedUserEmail=invitedUserEmail;
     //this.state.email = invitedUserEmail;
    //  this.state.signupButtonTxt='Join Team';
    //  this.state.isEmailReadonly =false;
    //  this.state.isBackBtnHidden =true;
    //  this.state.applicationId = CommonUtils.getUrlParameter(search, 'applicationId'); 
    //  this.state.token = CommonUtils.getUrlParameter(search, 'token');
    // this.state.invitedBy = CommonUtils.getUrlParameter(search, 'referer')
   }
    //console.log("location",this.props.location);
  }
  getUserDetails= (token) => {
    return Promise.resolve(getUserDetailsByToken(token)).then(response => {
      if (!response) {
        this.setState({
          renderInvitationRevokedView: true
        })
      }
      this.setState({
        isDataFetched:true
      })
      
      let email = response.invitedUser;
      let applicationId = response.applicationId;
      let roleType = response.roleType;
      this.setState({
        email:email,
        applicationId:applicationId,
        signupButtonTxt:'Join Team',
        isEmailReadonly:false,
        roleType:roleType
      })
    }).catch(err => {
      console.log(err.message);
    })
  }
  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'password' ? 'input' : 'password'
    })  
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
  createAccountWithUserId=(_this)=>{

    var email = this.state.email;
    var password = this.state.password;
    var repeatPassword =this.state.repeatPassword;
    var name = this.state.name;
    let signUpVia = this.state.googleOAuth ? "GOOGLE" : "";
   // creating user
    let userType = this.state.isInvited ? (this.state.roleType == ROLE_TYPE.AGENT ? "AGENT" : "ADMIN"):"CUSTOMER";
    // let userType = this.state.isInvited?"AGENT":"CUSTOMER";
    let userInfo={};
    userInfo.userName=_this.state.userName||email;
    userInfo.email= email;
    userInfo.type = userType == "CUSTOMER"? 3 : 1;
    userInfo.applicationId = this.state.applicationId;
    userInfo.password = password;
    userInfo.name=_this.state.name || _this.state.userName;
    userInfo.subscription = _this.state.subscription;
    userInfo.roleType = this.state.roleType;
    userInfo.token = this.state.token;
    userInfo.deviceType = "0";

    AnalyticsTracking.identify(email);

    this.setState({disableRegisterButton:true}); 
    //Promise.resolve(applozic)
    Promise.resolve(createCustomerOrAgent(userInfo,userType,signUpVia)).then((response) => {
      if (window.Kommunicate && window.$applozic) { 
        //window.Kommunicate.updateUserIdentity(userInfo.userName);
        let user = {'email': userInfo.email, 'displayName': userInfo.name};
        window.$applozic.fn.applozic('updateUser', {data: user, success: function(response) {
            console.log("email and displayName updated for support user");
          }, error: function(error) {
            console.log(error);
          }
        });
      }
      response.data.data.displayName=response.data.data.name;
     saveToLocalStorage(email, password, name, response);
     _this.props.saveUserInfo(response.data.data);
     _this.props.logInStatus(true);

      _this.setState({disableRegisterButton:false});

      CommonUtils.getUserSession().isAdmin ? window.location ="/setUpPage":window.location ="/dashboard?referer="+this.state.invitedBy;
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
  createAccount=(event)=>{
    var email = this.state.email;
    var password =this.state.password;
    var repeatPassword =this.state.repeatPassword;
    var name = this.state.name;
    var _this= this;
    if(!isEmail(email)){
      Notification.warning("Invalid Email !!");
      return;
    }else if( !this.state.googleOAuth  && ( validator.isEmpty(password) || validator.isEmpty(email))){
      Notification.warning(" All fields are mandatory !!");
    }else{
      // located in '../../../utils/kommunicateClient'
      if(this.state.isInvited){
        ApplozicClient.getUserInfoByEmail({"email":email,"applicationId":this.state.applicationId,"token": this.state.token})
        .then(userDetail=>{
          if(userDetail){
            _this.state.userName= userDetail.userId;
          }
          return _this.createAccountWithUserId(_this);
        })
      }else{
        return _this.createAccountWithUserId(_this);
      }
    }
  }

  renderSignUpView =() =>{
    return(
      <div> 
      <div className= {this.state.googleOAuth?"n-vis":"app flex-row align-items-center signup-app-div"}>
        <div className="container">
          <div className="logo-container text-center">
          <KommunicateLogoSvg/>
          </div>
          
          <div className="row justify-content-center signup-form-div">
            <div className="col-lg-5 col-md-8 col-sm-12 col-xs-12">
            <hr className={ this.state.isInvited ? "n-vis":"hr"}/>
              <div className="card">
              <div className={this.state.isInvited?"card-header text-center display-invitee-email":"n-vis"}>You were invited by {this.state.invitedBy}</div>
                <div className="card-block p-4 signup-card-block">
                  <h1 className="login-signup-heading text-center">Sign up to Kommunicate</h1>
                  {/* <p className="text-muted login-signup-sub-heading text-center">Your account information</p> */}

                  {/* Signup with Google code STARTS here. */}
                    {/* To show or hide Signup with Google just add "n-vis" to  "signup-with-google-btn" and "or-seperator" class.*/}
                  <a className={ (this.state.googleOAuth || this.state.isInvited) ? "n-vis":"signup-with-google-btn"} href={this.state.googleSignUpUrl}>
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
                    Sign up with Google
                  </a>

                  <div className={(this.state.googleOAuth || this.state.isInvited) ? "n-vis":"or-seperator"}>
                    <div className="or-seperator--line"></div>
                    <div className="or-seperator--text">OR</div>
                  </div>

                  {/* Signup with Google code ENDS here. */}

                  <div className={this.state.googleOAuth?"input-group mb-3":"n-vis"}>
                  {/*<span className="input-group-addon"><i className="icon-user"></i></span>*/}
                   <input type="text" className="input" placeholder="Google user name" onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("input-password").focus()}}} onChange= {this.setUserName} value={this.state.name} required/>
                   <label className="label-for-input name-label">Name</label>
                  </div>  

                  <div className="input-group mb-3 email-field-group">
                    {/* <span className="input-group-addon">@</span> */}
                    <input id = "input-email" type="text" className="input" autoComplete="off" placeholder=" " onKeyPress={(e)=>{if(e.charCode===13){document.getElementById(this.state.isInvited?"input-name":"input-password").focus()}}} onChange= { this.setEmail } readOnly ={this.state.isEmailReadonly} value={this.state.email} required disabled={this.state.isInvited}/>
                    <label className="label-for-input email-label">Email Id</label>
                  </div>

                  <div className={this.state.isInvited?"input-group mb-3":"n-vis"}>
                  {/*<span className="input-group-addon"><i className="icon-user"></i></span>*/}
                   <input id = "input-name"type="text" className="input" placeholder=" " onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("input-password").focus()}}} onChange= {this.setUserName} required/>
                   <label className="label-for-input name-label">Name</label>
                  </div>

                  <div className={this.state.googleOAuth ? "n-vis":"input-group mb-3 register-password-div"}>
                  {/*<div className="input-group mb-3 register-password-div">*/}
                    {/* <span className="input-group-addon"><i className="icon-lock"></i></span> */}
                    <input id="input-password" type={this.state.type} className="input" placeholder=" "  onChange={ this.setPassword } onKeyPress={(e)=>{if(e.charCode===13){document.getElementById("create-button").click()}}} required/>
                    <label className="label-for-input email-label">Password</label>
                    <label className="label-for-input2 email-label">Your password must have a minimum of 6 characters</label>
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
                  <div className="input-group mb-4" hidden={true}>
                    <input type="password" className="input" placeholder=" " onChange={ this.setRepeatPassword } required/>
                    <label className="label-for-input email-label">Repeat password</label>
                  </div>
                  <div className="row signup-button-row">
                    <div className="col-lg-12 text-center">
                      <button id="create-button"type="button" className="km-button km-button--primary step-1-submit-btn" onClick= { this.createAccount } disabled ={this.state.disableRegisterButton}>{this.state.signupButtonTxt}</button>
                      
                      <p className="have-need-account">
                        Already have an account? <Link to={'/login'}>Sign In</Link>
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
            <div className="bottom-shape-container"></div>
          </div>
        </div>
      <div className= {this.state.googleOAuth?"vis":"n-vis"} style={{ width:"6em",height: "6em",position: "fixed",top: "50%",left: "calc(50% - 4em)",transform: "translateY(-50%)"}}>
      <img src={kmloadinganimation} style={{width: "6em", height: "6em"}}/> 
      </div>
     </div> 
    );
  }


renderDefaultView =()=>{
  return this.state.isDataFetched ? this.renderSignUpView() : 
 <div className="app flex-row align-items-center applozic-user-signup"></div>
};

  renderInvitationRevoked =() =>{
    return (
      <div className="app flex-row align-items-center applozic-user-signup">
        <div className="container km-delete-invitation-card">
          <div className="logo-container  text-center">
            <KommunicateLogoSvg/>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
            <hr className="hr"/>
              <div className="card">
                            <div className="card-block p-4 signup-card-block">
                                <div className="km-cancel-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                                        <path fill="#A8A4A4" fillRule="nonzero" d="M25.002.917C11.701.917.917 11.701.917 25.002s10.784 24.085 24.085 24.085 24.085-10.784 24.085-24.085S38.303.917 25.002.917zm10.504 31.974a1.849 1.849 0 0 1-2.614 2.616l-7.89-7.89-7.89 7.888a1.845 1.845 0 0 1-2.614 0 1.849 1.849 0 0 1 0-2.615l7.89-7.888-7.89-7.89a1.849 1.849 0 1 1 2.614-2.614l7.89 7.89 7.89-7.89a1.849 1.849 0 0 1 2.614 2.614l-7.89 7.89 7.89 7.89z" />
                                    </svg>
                                </div>
                                <div className="km-invitation-revoked">
                                    <p>This invitation is revoked.</p>
                                    <p>Please contact your admin for more details.</p>
                                </div>
                            </div>
              </div>
            </div>
          </div>
          <div className="bottom-shape-container"></div>
        </div>
      </div>
    )
  }

  render() {
    
    AnalyticsTracking.acEventTrigger("/signup");

    console.log("invite",this.state.invitedUserEmail);
    return this.state.renderInvitationRevokedView ? this.renderInvitationRevoked() :this.renderDefaultView();
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveUserInfo: payload => dispatch(Actions.saveUserInfo(payload)),
    logInStatus: payload => dispatch(Actions.updateLogInStatus(payload))
  }
}
export default connect(null, mapDispatchToProps)(Register)
