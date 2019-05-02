import React, { Component, Fragment } from 'react';
import axios from 'axios';
import validator from 'validator';
import { withTheme } from 'styled-components';
import {getConfig} from '../../.../../../config/config.js';
import { MenuItem, DropdownButton} from 'react-bootstrap';
import { resetPassword, getUserInfo } from '../../../utils/kommunicateClient';
import Notification from '../../model/Notification';
import CommonUtils, {PRODUCTS} from '../../../utils/CommonUtils';
import AnalyticsTracking from '../../../utils/AnalyticsTracking';
import ApplozicClient   from '../../../utils/applozicClient';
import ValidationUtils from  '../../../utils/validationUtils';
import { Buffer } from 'buffer';
import InputField from '../../../components/InputField/InputField';
import { Link } from 'react-router-dom';
import {USER_STATUS} from '../../../utils/Constant';
import kmLoadingAnimation from '../Register/km-loading-animation.svg';
import alLoadingAnimation from '../Register/al-loading-animation.svg';
import { connect } from 'react-redux'
import * as Actions from '../../../actions/loginAction'
import {GoogleLogin} from '../Login-Signup/LoginSignupCommons'
import {ShowPasswordIcon, HidePasswordIcon, ErrorIcon, BackButton, ConfirmationTick, LoginSignupSvg } from '../../../assets/svg/svgs';
import Button from '../../../components/Buttons/Button';

import './login.css';

class Login extends Component {

	constructor(props) {
		super(props);
		const product = CommonUtils.getUrlParameter(window.location.href, 'product') || CommonUtils.getProduct();
		
		this.initialState = {
			product: product,
			userName:'',
			email:'',
			password:'',
			applicationId:'',
			applicationName:'',
			showAppListModal:false,
			hideUserNameInputbox:false,
			hidePasswordInputbox:false,
			hideAppListDropdown:true,
			loginFormText:"Login to " + PRODUCTS[product].title,
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
			marginBottomFrgtPassHead:'',
			googleLoginUrl: getConfig().googleApi.googleApiUrl,
			next : "/dashboard"
		}
		this.showHide = this.showHide.bind(this);
		this.state=Object.assign({type: 'password'}, this.initialState);
		this.submitForm = this.submitForm.bind(this);
		this.websiteUrl = this.websiteUrl.bind(this);
		this.isKommunicateBrand = getConfig().brand === "kommunicate";
	}
	
	componentWillMount() {
		!CommonUtils.isLatestKmVersionOnLocalStorage() && CommonUtils.updateKommunicateVersion()
		const search = this.props.location.search;
		this.updateGoogleLoginUrl();
		this.autoLoginViaEmailAndPassInUrl(function (forceLogin, that) {
			if (CommonUtils.getUserSession() && !forceLogin) {
				window.location = that.state.next; 
			}
		});

		const googleLogin = CommonUtils.getUrlParameter(search, 'googleLogin');
		if(googleLogin === 'true'){
			const email = CommonUtils.getUrlParameter(search, 'email')
			const loginType = CommonUtils.getUrlParameter(search, 'loginType')
			const _numOfApp = CommonUtils.getUrlParameter(search, 'numOfApp')
			const applicationId = CommonUtils.getUrlParameter(search, 'applicationId')

			this.setState({
				googleOAuth: true,
				email: email,
				userName: email,
				password: '',
				loginButtonAction: 'Login',
				loginType: loginType,
				hideGoogleLoginBtn: true
			}, () => {
				Promise.resolve(this.login()).then( response => {
					if (_numOfApp == 1 && loginType === 'oauth') {
						this.submitForm();
					} else if (_numOfApp == 1 && (loginType === 'email' || loginType === 'null')) {
						getUserInfo(email, applicationId).then(response => {
							this.setState({
								userName: email,
								password: response.data.data.accessToken
							}, () => {
								this.submitForm()
							});
						});
					} else if (_numOfApp != 1 && (loginType === 'email' || loginType === 'null')) {
						this.setState({
							googleOAuth: false
						})
					}
				})
			})
		}

		var sheet = document.createElement('style')
		sheet.innerHTML = ".mck-sidebox-launcher {display: block;} .mck-sidebox-launcher.force-hide.vis {display: block !important;}";
		document.body.appendChild(sheet);

	}

	updateGoogleLoginUrl = () => {
		let state = {};
		let product = CommonUtils.getProduct();
		let search = this.props.location.search;
		let referrer = CommonUtils.getUrlParameter(search, 'referrer');
		referrer && (state.referrer = referrer)
		state.product = product || "kommunicate";
		state.process = "google_login"
		state.dashboardUrl = window.location.origin;
		var cipherText = CommonUtils.encryptDataUsingCrypto(state);
		var url = this.state.googleLoginUrl + "&state=" + encodeURIComponent(cipherText);
		this.setState({
			next: referrer,
			googleLoginUrl: url
		});
	};

	autoLoginViaEmailAndPassInUrl = (callback) => {
		var forceLogin = false;
		const search = this.props.location.search;
		let emailUrl = CommonUtils.getUrlParameter(search, 'email');
		let passUrl = CommonUtils.getUrlParameter(search, 'password');
		if (emailUrl && passUrl){
			forceLogin = true;
			this.setState({
				userName :emailUrl,
				password: passUrl
			},()=> {
				this.submitForm();
			}
			);
		};
		if(typeof callback =="function"){
			var that = this;
			callback(forceLogin, that);
	}
	};

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
		});
	}

	setEmail = (e) => {
		this.setState({email:e.target.value});
	}

	setUserName = (event) => {
		this.setState({userName:event.target.value});
	}

	setPassword = (event) => {
		this.setState({password:event.target.value});
	}

	backToLogin = () => {
		this.setState(this.initialState);
		this.props.history.push('/login');
	}

	handlePasswordResetResponse = (response) => {
		this.setState({
			loginFormSubText:'Password reset link has been sent', 
			isLoginFrgtPassHidden:true, 
			frgtPassSuccessConfirmation:false
		});
		// Notification.info("Password reset link has been sent on your mail!");
		console.log("response",response);
		// !response.err?this.backToLogin():null;
	}

	handlePasswordResetError = (response) => {
		var err = (response.response && response.response.data) ? response.response.data.message : "Somethimg went wrong!";
		Notification.error(err);
		console.log(response);
	}

	submitForm = () => {
		// alert("button clicked "+ this.state.userName+ "  "+this.state.password);
		//validateUser(this.state);
		var _this=this;

		let loginUrl = getConfig().kommunicateApi.login;

		var userName = this.state.userName, 
			password = this.state.password, 
			applicationName = this.state.applicationName, 
			applicationId = this.state.applicationId;
	
		if(!this.state.googleOAuth && (validator.isEmpty(this.state.userName) || validator.isEmpty(this.state.password))) {
			// Notification.warning("Email Id or Password can't be empty!");
			_this.setState({
				hideErrorMessagePassword: false,
				errorMessageTextPassword:"Email Id or Password can't be empty!"
			});
		
		} else {
			AnalyticsTracking.identify(userName);

			loginUrl += "?loginType=" + this.state.loginType;
			this.state.loginType === 'oauth' && _this.props.loginVia("google");
			this.state.loginType === 'email' && _this.props.loginVia("email");

			this.setState({loginButtonDisabled:true});
			
			axios.post( loginUrl, { userName: userName, password:password, applicationName:applicationName, applicationId:applicationId, deviceType:0}).then( function(response) {

				if(response.status == 200 && response.data.code == 'INVALID_CREDENTIALS') {
					// Notification.warning("Invalid credentials");
					_this.setState({hideErrorMessagePassword: false, errorMessageTextPassword:"Invalid Email Id or Password", loginButtonDisabled:false});
				} else if (response.status == 200 && response.data.result.status == USER_STATUS.EXPIRED) {
					_this.setState({ hideErrorMessagePassword: false, errorMessageTextPassword:"Your account has been temporarily disabled as trial period has ended. Please contact your admin to upgrade the plan.", loginButtonDisabled:false});
					return
				} else if (response.status == 200 && response.data.code == "MULTIPLE_APPS") {
					CommonUtils.setApplicationIds(response.data.result);
					_this.checkForMultipleApps(response.data.result);
					return;
				} 
			
				if (response.status == 200 && response.data.code == 'SUCCESS') {
					console.log("logged in successfully");
					if (typeof (Storage) !== "undefined") {

					if (window.$applozic && window.$applozic.fn && window.$applozic.fn.applozic("getLoggedInUser")) {
						window.$applozic.fn.applozic('logout');
					}

					if (!response.data.result.apzToken) {
						var accessToken = response.data.result.accessToken;
                		var apzToken = new Buffer(userName + ":" + accessToken).toString('base64');
						response.data.result.apzToken = apzToken;
					}

					if (!response.data.result.application) {
						console.log("response doesn't have application, create {}");
						response.data.result.application = {};
					}

					_this.setState({'applicationId': response.data.result.application.applicationId});

					response.data.result.displayName=response.data.result.name;
					CommonUtils.setUserSession(response.data.result);
					_this.props.saveUserInfo(response.data.result);
					_this.props.setLogInStatus(true);
					}
					// _this.props.history.push("/dashboard");
					window.location.assign(_this.state.next);
					_this.state=_this.initialState;
				}
			}).catch( function(err) {
				console.log(err);
				Notification.error("Error during login.");
				_this.setState({loginButtonDisabled:false});
			});
		}
	}

	login = (event) => {
		var _this = this;
		if(this.state.loginButtonAction === "Login") {
			/*Promise.resolve(ApplozicClient.getUserInfoByEmail({"email":this.state.email,"applicationId":this.state.applicationId})).then(data=>{
			data?_this.state.userName=data.userId:_this.state.userName=_this.state.email;
			return this.submitForm();
			});*/
			this.setState({
				userName: this.state.email
			}, () => {
				return this.submitForm()
			});
		} else if(this.state.loginButtonAction==="passwordResetAppSected") {
			if(this.state.applicationId) {
				Promise.resolve(ApplozicClient.getUserInfoByEmail({"email":this.state.email,"applicationId":this.state.applicationId})).then(data=>{
					_this.state.userName=data.userId||_this.state.email;
					resetPassword({userName:this.state.userName,applicationId:this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
					return;
				});
			} else {
				Notification.info("Please select your application");
				return;
			}
		} else {
			// console.log(this.state.loginButtonAction);
			if(!this.state.email && this.state.loginButtonAction ==="getAppList") {
				_this.setState({hideErrorMessage: false, errorMessageText:"Please enter user name to login"});
				return;
			}
			let param = ValidationUtils.isValidEmail(this.state.email)?"emailId":"userId";
			var urlEncodedName = encodeURIComponent(this.state.email);
			
			const getApplistUrl = getConfig().applozicPlugin.applicationList+"&"+param+"="+urlEncodedName;
			return  axios.get(getApplistUrl).then(function(response){
				_this.checkForMultipleApps(response.data);
			});
		}
	}
	checkForMultipleApps = (result) => {
		console.log(result);
		var _this = this;
		if(result!=="Invalid userId or EmailId") {
			const numOfApp=Object.keys(result).length;
			if(numOfApp===1) {
				_this.state.applicationId=Object.keys(result)[0];
				_this.state.applicationName=result[_this.state.applicationId];
				_this.state.appIdList= result;
				if(_this.state.loginButtonAction == "passwordReset") {
					resetPassword({userName:_this.state.userName||_this.state.email,applicationId:_this.state.applicationId}).then(_this.handlePasswordResetResponse).catch(_this.handlePasswordResetError);
					return 1;
				}
				_this.setState({
					loginButtonText:'Login',
					loginButtonAction:'Login',
					loginFormSubText:'Enter password to continue ',
					hidePasswordInputbox:false,
					hideAppListDropdown:true,
					hideUserNameInputbox:true,
					loginFormText:"Password",
					hideBackButton:false,
					isForgotPwdHidden:false, 
					hideSignupLink:false
				});
			} else if(numOfApp>1) {
				_this.state.appIdList= result;
				if(_this.state.loginButtonAction=="passwordReset") {
					_this.setState({
						loginButtonText:'Submit',
						loginButtonAction:'passwordResetAppSected',
						loginFormSubText:'please select your application and submit',
						hidePasswordInputbox:true,
						hideAppListDropdown:false,
						hideUserNameInputbox:true,
						loginFormText:"Select Application..",
						hideBackButton:false,
						hideSignupLink:true,
						isForgotPwdHidden:true,
						hideSignupLink:true,
						hideGoogleLoginBtn:true
					});					
				} else {
					_this.setState({
						loginButtonDisabled:false, 
						loginButtonText:'Login',
						loginButtonAction:'Login',
						loginFormSubText:'You are registered in multiple applications',
						hidePasswordInputbox:false,
						hideAppListDropdown:false,
						hideUserNameInputbox:true,
						loginFormText:"Hi! Select your application",
						subHeading:false,
						hideBackButton:false,
						isForgotPwdHidden:true,
						hideSignupLink:false,
						hideSignupLink:true, 
						hideGoogleLoginBtn:true
					});
					if (this.state.googleOAuth){
						_this.props.history.push("/apps?referrer="+_this.state.next, {
							userid: _this.state.userName, 
							pass: "",loginType :'oauth'
						});
					} else {
						_this.props.history.push("/apps?referrer="+_this.state.next, {
							userid: _this.state.userName, 
							pass: _this.state.password
						});
					}
				}
			} else {
				// Notification.info("You are not a registered user. Please sign up!!!");
				_this.setState({
					hideErrorMessage: false, 
					errorMessageText:"You are not a registered user. Please sign up."
				});
			}
			return numOfApp;
		} else {
			console.log("err while getting application list, response : ",result);
			Notification.error(result);
		}
	}

	register = (event) => {
		this.props.history.push("/signup?product=" + this.state.product);
	}

	initiateForgotPassword = (event) => {
		// this.state.loginButtonAction="passwordReset";
		this.setState({
			loginFormText: "Reset your password",
			loginFormSubText: 'Please enter your registered email ID, your password reset link will be sent there.',
			loginButtonText:'Submit',
			loginButtonAction:'passwordReset',
			hideBackButton:false,
			hidePasswordInputbox:true,
			hideAppListDropdown:true,
			hideUserNameInputbox:false,
			isForgotPwdHidden:true, 
			hideSignupLink:true,
			hideGoogleLoginBtn:true,
			marginBottomFrgtPassHead:'50px'
		});
		//this.login(event);
		//const resetPasswordUrl= getConfig().kommunicateApi.passwordResetUrl.replace(":userName",this.state.userName);
		/*axios.get(resetPasswordUrl)
		.then(function(response){}).then(response=>{
		console.log("got data afrom server", response)
		}).catch(err=>{
		console.log("err while getting user by email address",err.response);
		})*/
	}

	websiteUrl = (e) => {
		e.preventDefault();
		let websiteUrl = this.isKommunicateBrand ? getConfig().kommunicateWebsiteUrl : getConfig().applozicWebsiteUrl;
		window.location = websiteUrl;
	}

	checkLoginType = () => {
		return Promise.resolve(getUserInfo(this.state.email, this.state.applicationId))
	}

	showPasswordField = () => {

		if (this.state.hidePasswordInputbox || this.state.googleOAuth) {
			return (
				<div className="input-group mb-4"></div>
			);
		} else {
			return (
				<div className="input-group mb-4">
					<div className="password-input-label-group">
						<input type={this.state.type} className="input" placeholder=" "  onChange = { this.setPassword } value={ this.state.password } onKeyPress={this.onKeyPress} style={{borderColor: this.state.errorInputColor}} required/>
						<label className="label-for-input email-label">Password</label>
						<span className="show-paasword-btn" onClick={this.showHide}>
							{this.state.type === 'input' ? <ShowPasswordIcon /> : <HidePasswordIcon />}
						</span>
					</div>
					<div className="input-error-div" hidden={this.state.hideErrorMessagePassword}>
						<ErrorIcon />
						<p className="input-error-message">{this.state.errorMessageTextPassword}</p>
					</div>
				</div>
			);
		}
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
		const Logo = PRODUCTS[CommonUtils.getProduct()].logo;
		return (
			<div>
				<div className={this.state.googleOAuth?"n-vis":"app flex-row align-items-center login-app-div"}>
					<div className="container">
						<div className="logo-container text-center">
							<a href="#" onClick={this.websiteUrl}><Logo style={{ width: "auto", height: "55px"}} /></a>
						</div>
						<div className="row justify-content-center login-form-div">
							<div className="col-lg-5 col-md-8 col-sm-12 col-xs-12">
								<hr className="hr" />
									<div className="card-group mb-0">
										<div className="p-4 login-card-block">
											<div className="card-block">
												<div className="card-block-login-frgtpass-container" hidden={this.state.isLoginFrgtPassHidden}>
													<h1 className="login-signup-heading text-center" style={{marginBottom: this.state.marginBottomFrgtPassHead}}>{this.state.loginFormText}</h1>
													<p className="setup-sub-heading text-center" hidden={this.state.subHeading}>{this.state.loginFormSubText}</p>

													{/* Login with Google code STARTS here. */}
													{/* To show or hide Login with Google just add "n-vis" to  "signup-with-google-btn" and "or-seperator" class.*/}
													{
													<Fragment>
														<a className="signup-with-google-btn" hidden={this.state.hideGoogleLoginBtn} href={this.state.googleLoginUrl}>
														<GoogleLogin/>
														Login with Google
														</a>

														<div className="or-seperator" hidden={this.state.hideGoogleLoginBtn}>
															<div className="or-seperator--line"></div>
															<div className="or-seperator--text">OR</div>
														</div>
													</Fragment>
													}

													{/* Login with Google code ENDS here */}

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
																return <MenuItem key = {key} onClick={() => {
																	this.state.applicationId=key;
																	this.state.applicationName = this.state.appIdList[key];
																	this.setState({"dropDownBoxTitle":key});
																	this.checkLoginTypeWrapper()
																}}>{key}</MenuItem>
																}.bind(this))
															}
														</DropdownButton>
													</div>
													{   /*
														* Just for more better security no need to render the password field.
														* User can just unhide the field if it is hidden it is better just to not render the field.
														*/
														this.showPasswordField()
													}
													<div className="row">
														<div className="col-12 text-right forgot-password-div">
															<Button link type="button" id ="btn-forgot-password" className="btn-forgot-password" hidden={this.state.isForgotPwdHidden}  onClick= { this.initiateForgotPassword }>Forgot password?</Button>
														</div>
													</div>
													<div className="row">
														<div className="col-12 text-center">
															<Button large fontSize={"16px"} style={{marginTop:"26px"}} id="login-button" type="button" disabled={this.state.loginButtonDisabled} onClick={(event) => this.login(event)}>{this.state.loginButtonText}</Button>
															<p className="have-need-account" hidden={this.state.hideSignupLink}>Don’t have an account? <Button  as={Link} link={"true"} to={'/signup?product=' + this.state.product}>Sign up</Button></p>
														</div> 
													</div>
				
												</div>

												<div className="frgtpass-success-confirmation text-center" hidden={this.state.frgtPassSuccessConfirmation}>
													<p className="text-muted login-signup-sub-heading">{this.state.loginFormSubText}</p>
													<div className="svg-container">
														<ConfirmationTick />
													</div>
													<Button type="button" onClick ={ this.backToLogin }>Login</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="text-center" >
								{!this.state.hideBackButton && 
									<button type="button" className="km-button login-back-btn" onClick= { this.backToLogin }>
										<BackButton />
									</button>
								}
							</div>
						<div className="bottom-shape-container">
							<LoginSignupSvg gradient0={this.props.theme.gradients.loginGradientColorStop0} gradient1={this.props.theme.gradients.loginGradientColorStop1} gradient2={this.props.theme.gradients.loginGradientColorStop2} />
						</div>
					</div>
				</div>
				<div className= {this.state.googleOAuth?"vis":"n-vis"} style={{ width:"6em",height: "6em",position: "fixed",top: "50%",left: "calc(50% - 4em)",transform: "translateY(-50%)"}}>
					<img src={CommonUtils.isProductApplozic() ? alLoadingAnimation : kmLoadingAnimation} style={{width: "6em", height: "6em"}}/> 
				</div>
			</div>
		);
  	}
}

const mapDispatchToProps = dispatch => {
  return {
    saveUserInfo: payload => dispatch(Actions.updateDetailsOnLogin("SAVE_USER_INFO",payload)),
	setLogInStatus: payload => dispatch(Actions.updateDetailsOnLogin("UPDATE_LOGIN_STATUS",payload)),
	loginVia: payload => dispatch(Actions.updateDetailsOnLogin("LOGIN_VIA", payload))
  }
}
export default connect(null, mapDispatchToProps)(withTheme(Login));
