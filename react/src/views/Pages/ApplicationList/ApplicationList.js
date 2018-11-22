import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import validator from 'validator';
import  {getConfig} from '../../.../../../config/config.js';
import CommonUtils from '../../../utils/CommonUtils';
import Notification from '../../model/Notification';
import './ApplicationList.css';
import {USER_STATUS} from '../../../utils/Constant';
import ApplozicClient from '../../../utils/applozicClient'


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
            randomColorClass:0
        }
        this.submitForm = this.submitForm.bind(this);
    };


    componentWillMount() {
      const search = this.props.location.search;
      let next  = CommonUtils.getUrlParameter(search, 'referrer');
      this.state.next = next;
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
        })
      }
    }

    gotoNextPage(url) {
      window.location = url;
    }

  submitForm = (key) => {
    var _this = this;
    let loginUrl = getConfig().kommunicateApi.login;
    var userName = this.state.userName, password = this.state.password, applicationName = this.state.applicationName, applicationId = key;
    if (window.heap) {
      window.heap.identify(userName);
    }

    if (this.state.loginType === 'oauth') {
      loginUrl += "?loginType=oauth"
    } else if (this.state.loginType === 'email') {
      loginUrl += "?loginType=email"
    }
    if (window.location.host.indexOf('kommunicate') !== -1) {
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
            }
            // _this.props.history.push({pathname:"/dashboard", state:{randomNo: _this.state.randomColorClass}});
            window.location.assign(_this.state.next);
          }
        }).catch(function (err) {
          console.log(err);
          Notification.error("Error during login.");
          _this.setState({ loginButtonDisabled: false });
        });

    } else {
      //applozic login
      ApplozicClient.validateApplozicUser({ userName: userName, password: password, applicationName: applicationName, applicationId: applicationId, deviceType: 0 }).then(res => {
        if (res.status === 200 && res.data === 'LOGIN') {
          ApplozicClient.getApplication({ userName: userName, accessToken: password, applicationName: applicationName, applicationId: applicationId }, true).then(result => {
            let user = { ...result.data.adminUser, name: result.data.adminUser.displayName, userName: userName, accessToken: password, application: result.data }
            CommonUtils.setUserSession(user);
            window.location.assign(_this.state.next);
          })
        }
      }).catch(err => {
        console.log('applozic login err')
      })
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
        // console.log(allApps);

        return(
            <div className="app flex-row align-items-center app-list-div">
                  <div className="container">
                  <div className="logo-container text-center">
                      <a href="#/">
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
                    <div className="row justify-content-center app-list-form-div">
                      <div className="col-lg-5 col-md-8 col-sm-12 col-xs-12">
                      <hr className="hr"/>
                        <div className="card-group mb-0">
                          <div className="card p-4 app-list-card-block">
                            <div className="card-block">
                              <div className="card-block-login-frgtpass-container">
                                <h1 className="login-signup-heading text-center">Select your Application ID</h1>
                                <p className="setup-sub-heading text-center">You are registered in multiple applications</p>

                                <div className="application-list-main-container">
                                  {
                                    allApps.map((item, index) => (
                                     
                                      <div className={`application-lists letter-${index}`}  key = {index} onClick={(e) => (this.submitForm(item.appid))}>
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

export default ApplicationList;