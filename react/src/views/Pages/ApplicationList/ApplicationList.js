import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig} from '../../.../../../config/config.js';
import CommonUtils from '../../../utils/CommonUtils';
import Notification from '../../model/Notification';
import './ApplicationList.css';
import {USER_STATUS} from '../../../utils/Constant';
import { connect } from 'react-redux'
import * as Actions from '../../../actions/loginAction'
import ApplozicClient from '../../../utils/applozicClient'
import { KommunicateLogo } from '../../Faq/LizSVG';
import { ApplozicLogo } from '../../../assets/svg/svgs';
import styled from 'styled-components';
import AnalyticsTracking from '../../../utils/AnalyticsTracking.js';



const InputContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	margin: -25px 6px 10px 0;
`;

const Input = styled.input`
	background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZD0iTTE1LjUgMTRoLS43OWwtLjI4LS4yN0MxNS40MSAxMi41OSAxNiAxMS4xMSAxNiA5LjUgMTYgNS45MSAxMy4wOSAzIDkuNSAzUzMgNS45MSAzIDkuNSA1LjkxIDE2IDkuNSAxNmMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBDNy4wMSAxNCA1IDExLjk5IDUgOS41UzcuMDEgNSA5LjUgNSAxNCA3LjAxIDE0IDkuNSAxMS45OSAxNCA5LjUgMTR6IiBmaWxsPSIjY2FjYWNhIi8+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
	background-position: 8px 10px;
	background-repeat: no-repeat;
	width: 100%;
	font-size: 16px;
	padding: 10px 20px 10px 40px;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 1px 1px rgba(0,0,0,.24);
	outline: 0;
	border: 1px solid rgba(0,0,0,.12);
`;



class ApplicationList extends Component {

    constructor(props){
        super(props);
        this.state = {
            userName:'',
            email:'',
            loginType:'',
            password:'',
            applicationId:'',
            applicationName:'',
			randomColorClass: 0,
			searchApplications: ""
        }
		this.submitForm = this.submitForm.bind(this);
		this.searchInApplicationsList = this.searchInApplicationsList.bind(this);
    };


    componentWillMount() {
      const search = this.props.location.search;
      let next  = CommonUtils.getUrlParameter(search, 'referrer');
      this.state.next = next == "" ? '/' : next;
      var userDetails = CommonUtils.getUserSession();
      if(userDetails) {
        this.setState({
          userName: userDetails.userName,
          password: userDetails.accessToken
        });
      } else if(!userDetails && !CommonUtils.getApplicationIds()) {
        window.location = "/login";
      } else if(userDetails && !CommonUtils.getApplicationIds()) {
        window.location = next;
      }
    }

    componentDidMount() {
		var userDetails = CommonUtils.getUserSession();
		if(!userDetails) {
			this.setState({
			userName: this.props.location.state.userid,
			password: this.props.location.state.pass,
			loginType:this.props.location.state.loginType
			});
		}

		var appListCards = document.getElementsByClassName("application-lists");
		var randomColor = '#' + Math.random().toString(16).slice(2, 8).toUpperCase(); 
		for(var i = 0; i < appListCards.length; i++) {
			var randomColor = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
			appListCards[i].style.borderLeftColor = randomColor;
		}
    }

    gotoNextPage(url) {
      window.location = url;
    }

  submitForm = (key) => {
    var _this = this;
    let loginUrl = getConfig().kommunicateApi.login;
    var userName = this.state.userName, password = this.state.password, applicationName = this.state.applicationName, applicationId = key;
    AnalyticsTracking.identify(userName);

    if (this.state.loginType === 'oauth') {
      loginUrl += "?loginType=oauth"
    } else if (this.state.loginType === 'email') {
      loginUrl += "?loginType=email"
    }
      axios.post(loginUrl, { userName: userName, password: password, applicationName: applicationName, applicationId: applicationId })
        .then(function (response) {
          if (response.status == 200 && response.data.code == 'INVALID_CREDENTIALS') {
            Notification.error("Invalid Password");
          } else if (response.status == 200 && response.data.result.status == USER_STATUS.EXPIRED) {
            Notification.error("Your account has been temporarily disabled as trial period has ended. Please contact your admin to upgrade the plan.");
            return
          } else if (response.status == 200 && response.data.code == "MULTIPLE_APPS") {
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

              _this.setState({ 'applicationId': response.data.result.application.applicationId });

              // response.data.result.password = password=='' ? response.data.result.accessToken : password;
              response.data.result.displayName = response.data.result.name;
              CommonUtils.setUserSession(response.data.result);
              _this.props.saveUserInfo(response.data.result);
              _this.props.setLoginStatus(true);
            }
            // _this.props.history.push({pathname:"/dashboard", state:{randomNo: _this.state.randomColorClass}});
            window.location.assign(_this.state.next);
          }
        }).catch(function (err) {
          console.log(err);
          Notification.error("Error during login.");
          _this.setState({ loginButtonDisabled: false });
        });
  }


  	searchInApplicationsList = (e) => {
		  this.setState({
			searchApplications: e.target.value
		  })
		var filter, mainContainer, div, p, i;
            
		filter = this.state.searchApplications.toUpperCase();
		mainContainer = document.getElementById("application-list-main-container");
		div = mainContainer.getElementsByTagName('div');
		// Looping through all list items, and hiding those who don't match the search query
		for (i = 0; i < div.length; i++) {
			p = div[i].getElementsByTagName("p")[0];
			if (p.innerHTML.toUpperCase().indexOf(filter) > -1) {
				div[i].style.display = "";
			} else {
				div[i].style.display = "none";
			}
		}
	}

    render() {
        var appIdList = CommonUtils.getApplicationIds();
        if(appIdList) {
          var applicationLists = new Map(Object.entries(appIdList));
        } else {
          this.gotoNextPage(this.state.next);
        }
        var allApps = [];
        applicationLists.forEach(function(value, key) {
          allApps.push({
            appid: key,
            appname: value,
          });
        });

        return(
            <div className="app flex-row align-items-center app-list-div">
				<div className="container">
                  	<div className="logo-container text-center">
                      	<a href="#/">
					  		{ CommonUtils.isKommunicateDashboard() ? <KommunicateLogo /> : <ApplozicLogo/> }
						</a>
					</div>
                    <div className="row justify-content-center app-list-form-div">
                      	<div className="col-lg-5 col-md-8 col-sm-12 col-xs-12">
                      		<hr className="hr"/>
							<div className="card-group mb-0">
								<div className="card p-4 app-list-card-block">
									<div className="card-block">
										<div className="card-block-login-frgtpass-container">
											<h1 className="login-signup-heading text-center">Select your Application ID</h1>
											<p className="setup-sub-heading text-center">You are registered in multiple applications</p>
											
											{ Object.keys(allApps).length > 3 && <InputContainer>
													<Input type="text" value={this.state.searchApplications} onChange={this.searchInApplicationsList} placeholder="Search applications"></Input>
												</InputContainer> 
											}

											<div id="application-list-main-container" className="application-list-main-container">
											{
												allApps.map((item, index) => (
												<div className="application-lists" key = {index} onClick={(e) => (this.submitForm(item.appid))}>
													<p className="app-name">{item.appname}</p>
													<p className="app-id">{item.appid}</p>
												</div>
												))
											}
											</div>
										</div>
									</div>
								</div>
							</div>
                      	</div>
                    </div>
                    <div className="bottom-shape-container"></div>
				</div>
			</div>
        );
    }
}

const mapStateToProps = state => ({
  userInfo:state.login.userInfo
})
const mapDispatchToProps = dispatch => {
  return {
    saveUserInfo: payload => dispatch(Actions.updateDetailsOnLogin("SAVE_USER_INFO",payload)),
    setLoginStatus: payload => dispatch(Actions.updateDetailsOnLogin("UPDATE_LOGIN_STATUS",payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ApplicationList)
