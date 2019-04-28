import React, { Component, Fragment } from 'react'
import validator from 'validator';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import Notification from '../model/Notification';
import axios from 'axios';
import Checkbox from '../../components/Checkbox/Checkbox';
import CommonUtils from '../../utils/CommonUtils';
import { getConfig } from "../../config/config.js";
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import ApplozicClient from '../../utils/applozicClient'
import InputFile from '../.../../../components/InputFile/InputFile';
import './pushNotification.css';
import { getApplication } from '../../utils/kommunicateClient';
import {SettingsHeader} from '../../../src/components/SettingsComponent/SettingsComponents';
import Button from '../../components/Buttons/Button';
import LockBadge from '../../components/LockBadge/LockBadge';
import Banner from '../../components/Banner';


let headers = {
  "Apz-Token": CommonUtils.getUserSession() && 'Basic ' + new Buffer(CommonUtils.getUserSession().userName + ':' + CommonUtils.getUserSession().accessToken).toString('base64'),
  "Content-Type": "application/json",
  "Apz-AppId": CommonUtils.getUserSession() && CommonUtils.getUserSession().application.applicationId,
  "Apz-Product-App": true
};

class PushNotification extends Component {
  constructor(props) {
    super(props);

    let userDetail = CommonUtils.getUserSession().application.appModulePxys[0];

    this.state = {
      enableDisableCheckbox: false,
      activeTextField: -1,
      gcmKey: '',
      disableButtonForAndroid: true,
      disableButtonForIosDevelopment: true,
      disableButtonForIosDistribution: true,
      gcmKey: userDetail.gcmKey ? userDetail.gcmKey : "",
      apnsForDevelepment: userDetail.testApnsUrl ? this.getFileName(userDetail.testApnsUrl) : "Upload File",
      apnsForDistribution: userDetail.apnsUrl ? this.getFileName(userDetail.apnsUrl) : "Upload File",
      apnsPassword: userDetail.apnsPassword ? userDetail.apnsPassword : "",
      apnstestPassword: userDetail.testApnsPassword ? userDetail.testApnsPassword : "",
      apnsProdUrl: userDetail.apnsUrl,
      apnsTestUrl: userDetail.testApnsUrl,
      appSync: '',
      isTrialPlan: CommonUtils.isTrialPlan(),
      isStartUpPlan: CommonUtils.getProduct() == "applozic" ? false : CommonUtils.isStartupPlan()
    };

    this.submitGcmkey = this.submitGcmkey.bind(this);
    this.uploadDistributionapnsFile = this.uploadDistributionapnsFile.bind(this);
    this.submitApnsForDevelopment = this.submitApnsForDevelopment.bind(this);
  }
  componentDidMount() {
    let that = this;
    getApplication().then(result => {
      that.setState({ appSync: true })
    });
  }
  getFileName(url) {
    var s = url.lastIndexOf("/");
    var n = url.substr(s);
    var filename = n.split("/")[1]
    return filename;
  }
  certificateUpload(params) {
    var file = {};
    ApplozicClient.uploadCertificate(params).then(function (response) {
      if (response.status == 200) {
        file.url = response.data;
        file.success = params.this;
        file.env = params.env;
        params.callback(file);
      }
    });
  }

  uploadDistributionapnsFile() {
    var file = {};
    var allowedFiles = [".p12"];
    if (!document.getElementById("apnsUrl").files[0] && this.state.apnsPassword === "" && this.state.apnsForDistribution === "") {
      Notification.error("Please select file");
      return;
    }
    file.file = document.getElementById("apnsUrl").files[0];
    var fileUpload = document.getElementById("apnsUrl");

    if (fileUpload.getAttribute("data-url") && document.getElementById("apnsUrl").value === "") {
      this.submitApnsForDistribution(fileUpload.getAttribute("data-url"));
      return;
    }

    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (document.getElementById("apnsUrl").value !== "") {
      if (!regex.test(fileUpload.value.toLowerCase())) {
        Notification.error("Please upload file in .p12 format");
        return false;
      }

      file.name = file.file.name;
      file.this = this;
      file.env = "distribution";
      file.callback = function (file) {
        file.success.submitApnsForDistribution(file.url);
      }
    }
    this.certificateUpload(file);
  }
  uploadDevelopmentapnsFile() {
    var file = {};
    var allowedFiles = [".p12"];
    if (!document.getElementById("testApnsUrl").files[0] && this.state.apnstestPassword === "" && this.state.apnsForDevelepment === "") {
      Notification.error("Please select file");
      return;
    }
    file.file = document.getElementById("testApnsUrl").files[0];
    var fileUpload = document.getElementById("testApnsUrl");

    if (fileUpload.getAttribute("data-url") && document.getElementById("testApnsUrl").value === "") {
      this.submitApnsForDevelopment(fileUpload.getAttribute("data-url"));
      return;
    }

    if (document.getElementById("testApnsUrl").value !== "") {
      var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
      if (!regex.test(fileUpload.value.toLowerCase())) {
        Notification.error("Please upload file in .p12 format");
        return false;
      }
      file.name = file.file.name;
      file.this = this;
      file.env = "development";
      file.callback = function (file) {
        file.success.submitApnsForDevelopment(file.url);
      }
    }
    this.certificateUpload(file);
  }
  submitGcmkey(fileurl) {
    if (document.getElementById("gcmKey").value === "" && document.getElementById("apnsUrl").value === "" && document.getElementById("testApnsUrl").value === "") {
      return;
    }

    let userDetailUrl = getConfig().applozicPlugin.editAppModule;
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
    var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));

    var application = {};
    if (applicationList.applicationId) {
      application.applicationId = applicationList.applicationId;
    }
    if (applicationList.id) {
      application.id = applicationList.id;
    }
    if (applicationList.name) {
      application.name = applicationList.name;
    }
    if (applicationList.gcmKey) {
      application.gcmKey = applicationList.gcmKey;
    }
    if ((document.getElementById("gcmKey").value)) {
      application.gcmKey = document.getElementById("gcmKey").value;
    }
    if (applicationList.apnsUrl) {
      application.apnsUrl = applicationList.apnsUrl;
    }
    if (applicationList.testApnsUrl) {
      application.testApnsUrl = applicationList.testApnsUrl;
    }
    if (applicationList.apnsPassword || (document.getElementById("apnsPassword").value)) {
      application.apnsPassword = applicationList.apnsPassword ? applicationList.apnsPassword : document.getElementById("apnsPassword").value;
    }
    if (applicationList.testapnsPassword || (document.getElementById("testApnsPassword").value)) {
      application.testApnsPassword = applicationList.apnsPassword ? applicationList.apnsPassword : document.getElementById("testApnsPassword").value;
    }
    userSession.application.appModulePxys[0] = application;
    CommonUtils.setUserSession(userSession);
    
    axios({
      method: 'post',
      url: userDetailUrl,
      contentType: 'application/json',
      data: application,
      headers: headers
    }).then(function (response) {
      if (response.status === 200) {
        Notification.info("GCM Key updated");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({ disableButtonForAndroid: true });

  }
  submitApnsForDistribution(fileurl) {
    if (document.getElementById("apnsUrl").value === "" && document.getElementById("apnsPassword").value === "") {
      return;
    }

    let userDetailUrl = getConfig().applozicPlugin.editAppModule;
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
    applicationList.apnsUrl = fileurl;
    var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));

    var application = {};
    if (applicationList.applicationId) {
      application.applicationId = applicationList.applicationId;
    }
    if (applicationList.id) {
      application.id = applicationList.id;
    }
    if (applicationList.name) {
      application.name = applicationList.name;
    }
    if (applicationList.gcmKey) {
      application.gcmKey = applicationList.gcmKey;
    }
    if (applicationList.apnsUrl) {
      application.apnsUrl = applicationList.apnsUrl;
    }
    if (applicationList.testApnsUrl) {
      application.testApnsUrl = applicationList.testApnsUrl;
    }
    if (applicationList.apnsPassword || (document.getElementById("apnsPassword").value)) {
      application.apnsPassword = document.getElementById("apnsPassword").value ? document.getElementById("apnsPassword").value : applicationList.apnsPassword;
    }
    if (applicationList.testApnsPassword || (document.getElementById("testApnsPassword").value)) {
      application.testApnsPassword = document.getElementById("testApnsPassword").value ? document.getElementById("testApnsPassword").value : applicationList.testApnsPassword;
    }
    userSession.application.appModulePxys[0] = application;
    CommonUtils.setUserSession(userSession);

    axios({
      method: 'post',
      url: userDetailUrl,
      contentType: 'application/json',
      data: application,
      headers: headers
    }).then(function (response) {
      if (response.status === 200) {
        Notification.info("Apns Detail for distribution updated sucessfully");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({ disableButtonForIosDistribution: true });

  }
  submitApnsForDevelopment(fileurl) {
    if (document.getElementById("testApnsUrl").value === "" && document.getElementById("testApnsPassword").value === "") {
      return;
    }

    let userDetailUrl = getConfig().applozicPlugin.editAppModule;
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
    applicationList.testApnsUrl = fileurl;
    var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));

    var application = {};
    if (applicationList.applicationId) {
      application.applicationId = applicationList.applicationId;
    }
    if (applicationList.id) {
      application.id = applicationList.id;
    }
    if (applicationList.name) {
      application.name = applicationList.name;
    }
    if (applicationList.gcmKey) {
      application.gcmKey = applicationList.gcmKey;
    }
    if (applicationList.apnsUrl) {
      application.apnsUrl = applicationList.apnsUrl;
    }
    if (applicationList.testApnsUrl) {
      application.testApnsUrl = applicationList.testApnsUrl;
    }
    if (applicationList.apnsPassword || (document.getElementById("apnsPassword").value)) {
      application.apnsPassword = document.getElementById("apnsPassword").value ? document.getElementById("apnsPassword").value : applicationList.apnsPassword;
    }
    if (applicationList.testApnsPassword || (document.getElementById("testApnsPassword").value)) {
      application.testApnsPassword = document.getElementById("testApnsPassword").value ? document.getElementById("testApnsPassword").value : applicationList.testApnsPassword;
    }
    userSession.application.appModulePxys[0] = application;
    CommonUtils.setUserSession(userSession);

    axios({
      method: 'post',
      url: userDetailUrl,
      contentType: 'application/json',
      data: application,
      headers: headers
    }).then(function (response) {
      if (response.status === 200) {
        Notification.info("Apns for development updated sucessfully");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({ disableButtonForIosDevelopment: true });
  }

  render() {

    return (   
      <div className="fadeIn animated km-push-notification-container">
         <div className="km-heading-wrapper">
          <div className="app-id-container " style={{margin: "-15px 0 50px 0"}}>
            <div className="app-id-div">
              <Banner heading="This setup is for mobile sdk only" />
            </div>
          </div>
          <SettingsHeader  />
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div>
                <div className="push-notification-android-container">
                  <div>
                    <div className="form-group fcm"><span>For Android (GCM/FCM)</span>
                    {
                        CommonUtils.isKommunicateDashboard() && !this.state.isTrialPlan && this.state.isStartUpPlan && <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                      }
                    </div>
                    <div className="row form-group">

                      <div className="fcm-key col-md-2">GCM/FCM key :<span className="customer-type"> </span></div>
                      <div className="col-md-10">
                        <input id="gcmKey" onChange={(e) => { this.setState({ gcmKey: e.target.value }) }} className="km-input-apns km-gcm-input" value={this.state.gcmKey} type="text" onFocus={(e) => { this.setState({ disableButtonForAndroid: false }) }} autoComplete="off"></input></div>
                    </div>
                    <div>
                      {
                        this.state.isTrialPlan ? <Button primary disabled={this.state.disableButtonForAndroid} className="save-changes-btn"
                        onClick={(e) => {
                          this.setState({
                            disableButtonForAndroid: true
                          }, this.submitGcmkey),
                          AnalyticsTracking.acEventTrigger("ac-android-push");
                        }} >Save</Button> : this.state.isStartUpPlan ? <Button primary disabled={true} className="save-changes-btn">Save</Button> : <Button primary disabled={this.state.disableButtonForAndroid} className="save-changes-btn"
                        onClick={(e) => {
                          this.setState({
                            disableButtonForAndroid: true
                          }, this.submitGcmkey),
                          AnalyticsTracking.acEventTrigger("ac-android-push");
                        }} >Save</Button>
                      }
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card km-remove-border">
              <div>
                <div className="push-notification-ios-container">
                  <div>

                    <div className="form-group fcm" style={{marginTop:"20px"}}><span>For iOS(APNS)</span>
                    {
                        CommonUtils.isKommunicateDashboard() && !this.state.isTrialPlan && this.state.isStartUpPlan && <LockBadge className={"lock-with-text"} text={"Available in Growth Plan"} history={this.props.history} onClickGoTo={"/settings/billing"}/>
                      }
                    </div>
                    <div className="form-group fcm ">For DISTRIBUTION<span className="customer-type"> </span></div>
                    <div className="row form-group km-pushNotification-development  pushnotifiction-sub">

                      <div className="apple-certificate">Apple Certificate :<span className="customer-type"> </span></div>
                      <div className="col-sm-6 col-md-6 km-input-component">
                        <InputFile id={'apnsUrl'} dataUrl={this.state.apnsProdUrl} className={'secondary'} text={this.state.apnsForDistribution} onBlur={(e) => { this.setState({ disableButtonForIosDistribution: false }) }} accept={'.p12'} />
                      </div>
                    </div>
                    <div className="row form-group  pushnotifiction-sub">
                      <div className="apple-certificate second-option">Password :<span className="customer-type"> </span></div>
                      <div className="col-sm-6 col-md-6">
                        <input className="km-input-apns" value={this.state.apnsPassword} onChange={(e) => { this.setState({ disableButtonForIosDistribution: false, apnsPassword: e.target.value }) }} id="apnsPassword" type="password" autoComplete="off"></input></div>
                    </div>
                    <div>
                      {
                        this.state.isTrialPlan ? <Button primary disabled={this.state.disableButtonForIosDistribution} className="save-changes-btn  pushnotifiction-sub"
                        onClick={(e) => {
                          this.setState({
                            disableButtonForIosDistribution: true
                          }, this.uploadDistributionapnsFile),
                          AnalyticsTracking.acEventTrigger("ac-ios-dist");
                        }} >Save</Button> : this.state.isStartUpPlan ? <Button primary disabled={true} className="save-changes-btn ">Save</Button> : <Button primary disabled={this.state.disableButtonForIosDistribution} className="save-changes-btn"
                        onClick={(e) => {
                          this.setState({
                            disableButtonForIosDistribution: true
                          }, this.uploadDistributionapnsFile),
                          AnalyticsTracking.acEventTrigger("ac-ios-dist");
                        }} >Save</Button>
                      }
                      
                    </div>
                    <div>
                      <div className="form-group km-pushNotification-div fcm">For DEVELOPMENT<span className="customer-type"> </span></div>
                      <div className="row form-group km-pushNotification-development">

                        <div className="apple-certificate col-sm-2 ">Apple Certificate :<span className="customer-type"> </span></div>
                        <div className="col-sm-6 col-md-6 km-input-component" style={{marginLeft:"-24px"}}>
                          <InputFile id={'testApnsUrl'} dataUrl={this.state.apnsTestUrl} className={'secondary'} text={this.state.apnsForDevelepment} onBlur={(e) => { this.setState({ disableButtonForIosDevelopment: false }) }} accept={'.p12'} />
                        </div>
                      </div>
                      <div className="row form-group" style={{marginLeft:"0"}}>
                        <div className="apple-certificate second-option">Password :<span className="customer-type"> </span></div>
                        <div className=" col-md-6">
                          <input className="km-input-apns" value={this.state.apnstestPassword} onChange={(e) => { this.setState({ disableButtonForIosDevelopment: false, apnstestPassword: e.target.value }) }} id="testApnsPassword" type="password" autoComplete="off"></input></div>
                      </div>
                    </div>
                    <div>
                    {
                      this.state.isTrialPlan ? <Button primary disabled={this.state.disableButtonForIosDevelopment} className="save-changes-btn"
                      onClick={(e) => {
                        this.setState({
                          disableButtonForIosDevelopment: true
                        }, this.uploadDevelopmentapnsFile),
                        AnalyticsTracking.acEventTrigger("ac-ios-dev");
                      }} >Save</Button> : this.state.isStartUpPlan ? <Button primary disabled={true} className="save-changes-btn" >Save</Button> : <Button primary disabled={this.state.disableButtonForIosDevelopment} className="save-changes-btn"
                      onClick={(e) => {
                        this.setState({
                          disableButtonForIosDevelopment: true
                        }, this.uploadDevelopmentapnsFile),
                        AnalyticsTracking.acEventTrigger("ac-ios-dev");
                      }} >Save</Button>
                    }
                      
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

export default PushNotification;
