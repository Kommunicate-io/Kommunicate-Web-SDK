import React, { Component } from 'react'
import validator from 'validator';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import Notification from '../model/Notification';
import axios from 'axios';
import Checkbox from '../../components/Checkbox/Checkbox';
import CommonUtils from '../../utils/CommonUtils';
import { getConfig } from "../../config/config.js";
import InputFile from '../.../../../components/InputFile/InputFile';
import './pushNotification.css';

class PushNotification extends Component{
  constructor(props){
    super(props);

    let userDetail =CommonUtils.getUserSession().application.appModulePxys[0];

    this.state = {
     enableDisableCheckbox: false,
     activeTextField: -1,
     gcmKey:'',
     disableButtonForAndroid:true,
     disableButtonForIosDevelopment:true,
     disableButtonForIosDistribution:true,
     gcmKey: userDetail.gcmKey?userDetail.gcmKey: "",
     apnsForDevelepment: userDetail.testApnsUrl? this.getFileName(userDetail.testApnsUrl): "Upload File",
     apnsForDistribution: userDetail.apnsUrl? this.getFileName(userDetail.apnsUrl): "Upload File",
     apnsPassword:userDetail.apnsPassword? userDetail.apnsPassword: "",
     apnstestPassword:userDetail.testApnsPassword? userDetail.testApnsPassword: "",
     apnsProdUrl: userDetail.apnsUrl,
     apnsTestUrl: userDetail.testApnsUrl
    };

    this.submitGcmkey = this.submitGcmkey.bind(this);
    this.uploadDistributionapnsFile = this.uploadDistributionapnsFile.bind(this);
    this.submitApnsForDevelopment = this.submitApnsForDevelopment.bind(this);
  }
  getFileName(url){
    var s = url.lastIndexOf("/");
    var n= url.substr(s);
    var filename = n.split("/")[1]
    return filename;
  }
  certificateUpload(params){
      var data = new FormData();
      var certificateUploadUrl =getConfig().applozicPlugin.certificateUpload
      var file ={};
      data.append("file", params.file);
      axios({
        method: 'POST',
        url:certificateUploadUrl,
        data: data,
        headers: {
          "Apz-AppId": getConfig().adminDetails.kommunicateParentKey,
          "Apz-Token": "Basic "+getConfig().adminDetails.kommunicateAdminApzToken,
        }}).then(function(response){
          if(response.status==200 ){
           file.url = response.data;
               file.success = params.this;
               file.env = params.env;
               params.callback(file);
          }
        });
  }

  uploadDistributionapnsFile(){
    var file ={};
    var allowedFiles = [".p12"];
    if(!document.getElementById("apnsUrl").files[0] && this.state.apnsPassword === "" && this.state.apnsForDistribution===""){
      Notification.error("Please select file");
      return;
    }
      file.file = document.getElementById("apnsUrl").files[0];
      var fileUpload =document.getElementById("apnsUrl");

      if (fileUpload.getAttribute("data-url")) {
        this.submitApnsForDistribution(fileUpload.getAttribute("data-url"));
        return;
      }

      var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
      if(document.getElementById("apnsUrl").value !==""){
      if (!regex.test(fileUpload.value.toLowerCase())) {
        Notification.error("Please upload file in .p12 format");
          return false;
      }
    
      file.name = file.file.name;
      file.this = this;
      file.env = "distribution";
      file.callback = function (file) {
        file.success.submitApnsForDistribution(file.url);
      }}
      this.certificateUpload(file);
}
  uploadDevelopmentapnsFile(){
    var file ={};
    var allowedFiles = [".p12"];
    if(!document.getElementById("testApnsUrl").files[0] && this.state.apnstestPassword ===""&&this.state.apnsForDevelepment==="" ){
      Notification.error("Please select file");
      return;
    }
      file.file = document.getElementById("testApnsUrl").files[0];
      var fileUpload =document.getElementById("testApnsUrl");

      if (fileUpload.getAttribute("data-url")) {
        this.submitApnsForDevelopment(fileUpload.getAttribute("data-url"));
        return;
      }

      if(document.getElementById("testApnsUrl").value !==""){
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
      } }
      this.certificateUpload(file);
  }
  submitGcmkey(fileurl){
    if(document.getElementById("gcmKey").value ===""&& document.getElementById("apnsUrl").value ===""&& document.getElementById("testApnsUrl").value ===""){
      return;
    }

    let userDetailUrl =getConfig().applozicPlugin.editAppModule; 
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
    var userSession =JSON.parse(localStorage.getItem('KM_USER_SESSION'));

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
    if((document.getElementById("gcmKey").value)){
      application.gcmKey = document.getElementById("gcmKey").value;
    }
    if (applicationList.apnsUrl) {
      application.apnsUrl = applicationList.apnsUrl;
    }
    if (applicationList.testApnsUrl) {
      application.testApnsUrl = applicationList.testApnsUrl;
    }
    if (applicationList.apnsPassword||(document.getElementById("apnsPassword").value)) {
      application.apnsPassword = applicationList.apnsPassword?applicationList.apnsPassword:document.getElementById("apnsPassword").value;
    }
    if (applicationList.testapnsPassword||(document.getElementById("testApnsPassword").value)) {
      application.testApnsPassword = applicationList.apnsPassword?applicationList.apnsPassword:document.getElementById("testApnsPassword").value;
    }
    userSession.application.appModulePxys[0]=application;
    CommonUtils.setUserSession(userSession);
  axios({
    method: 'post',
    url: userDetailUrl,
    contentType: 'application/json',
    data: application,
    headers: {
      "Apz-Token": "Basic "+getConfig().adminDetails.kommunicateAdminApzToken,
      "Content-Type": "application/json",
      "Apz-AppId":getConfig().adminDetails.kommunicateParentKey
    }}).then(function(response) {
      if (response.status === 200) {
        Notification.info("GCM Key updated");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({disableButtonForAndroid: true });

  }
  submitApnsForDistribution(fileurl){
    if( document.getElementById("apnsUrl").value ==="" && document.getElementById("apnsPassword").value ===""){
      return;
    }

    let userDetailUrl =getConfig().applozicPlugin.editAppModule; 
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
      applicationList.apnsUrl =fileurl;
    var userSession =JSON.parse(localStorage.getItem('KM_USER_SESSION'));

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
    if (applicationList.testApnsPassword) {
      application.testApnsPassword = applicationList.testApnsPassword;
    }
    if (applicationList.apnsPassword||(document.getElementById("apnsPassword").value)) {
      application.apnsPassword =document.getElementById("apnsPassword").value;
    }
    userSession.application.appModulePxys[0]=application;
    CommonUtils.setUserSession(userSession);

  axios({
    method: 'post',
    url: userDetailUrl,
    contentType: 'application/json',
    data: application,
    headers: {
      "Apz-Token": "Basic "+getConfig().adminDetails.kommunicateAdminApzToken,
      "Content-Type": "application/json",
      "Apz-AppId":getConfig().adminDetails.kommunicateParentKey
    }}).then(function(response) {
      if (response.status === 200) {
        Notification.info("Apns Detail for distribution updated sucessfully");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({disableButtonForIosDistribution: true });

  }
  submitApnsForDevelopment(fileurl){
    if( document.getElementById("testApnsUrl").value ==="" && document.getElementById("testApnsPassword").value ===""){
      return;
    }

    let userDetailUrl =getConfig().applozicPlugin.editAppModule; 
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
      applicationList.testApnsUrl =fileurl;
    var userSession =JSON.parse(localStorage.getItem('KM_USER_SESSION'));

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
    if (applicationList.testApnsPassword) {
      application.testApnsPassword = applicationList.testApnsPassword;
    }
    if (applicationList.testApnsPassword||(document.getElementById("testApnsPassword").value)) {
      application.testApnsPassword = document.getElementById("testApnsPassword").value;
    }
    userSession.application.appModulePxys[0]=application;
    CommonUtils.setUserSession(userSession);

  axios({
    method: 'post',
    url: userDetailUrl,
    contentType: 'application/json',
    data: application,
    headers: {
      "Apz-Token": "Basic "+getConfig().adminDetails.kommunicateAdminApzToken,
      "Content-Type": "application/json",
      "Apz-AppId":getConfig().adminDetails.kommunicateParentKey
    }}).then(function(response) {
      if (response.status === 200) {
        Notification.info("Apns for development updated sucessfully");
      } else {
        Notification.error("something went wrong");
      }
    })
    this.setState({disableButtonForIosDevelopment: true });
  }

  render() {
  
    return (
      <div className="away-message-wrapper">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="card-block away-message-header">
              <div className="row">
                <h4 className="away-message-title">Enabling push notification allows kommunicate to send notification even when your mobile app is in background</h4>
                <div className="app-id-container">
                  <div className="app-id-div">
                    <span className="app-id-sub-text">
                      This setup is for mobile sdk only
                    </span>
                    <span className="app-id-main-text">
                      {this.yourApplicationId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card">
              <div className="card-header away-card-header km-div">
                <div className="away-message-known-customers-wrapper">
                  <div className="">
                   
                    <div className="form-group">For Android (GCM/FCM)<span className="customer-type"> </span></div>           
                    <div className="row form-group">
                        
                    <div className="col-sm-6 col-md-6">GCM/FCM key :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <input id="gcmKey"onChange={(e) => {this.setState({ gcmKey: e.target.value })}} className="km-pushnotification-input" value ={this.state.gcmKey} type="text" onFocus ={(e) =>{ this.setState({disableButtonForAndroid: false})} }></input></div>
                    </div>
                    <div className="btn-group">
                  <button disabled={this.state.disableButtonForAndroid} className="km-button km-button--primary save-changes-btn"
                    onClick={(e) => {
                      this.setState({
                        disableButtonForAndroid: true
                      }, this.submitGcmkey)
                    }} >Save</button>
                </div>
                  </div>
                </div>            
              </div>          
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card">
            <div className="card-header away-card-header km-div">
              <div className="away-message-known-customers-wrapper">
              <div className="">
                   
                    <div className="form-group">For IOS(APNS)<span className="customer-type"> </span></div>  
                    <div className="form-group">For DISTRIBUTION<span className="customer-type"> </span></div>  
                    <hr className="km-pushnotification-hr"></hr>     
                    <div className="row form-group km-pushNotification-development">
                        
                    <div className="col-sm-6 col-md-6">Apple Certificate :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <InputFile id={'apnsUrl'} dataUrl={this.state.apnsProdUrl} className={'secondary'} text={this.state.apnsForDistribution} onBlur ={(e) =>{ this.setState({disableButtonForIosDistribution: false})} } accept={'.p12'}  />
                    </div>
                    </div>
                    <div className="row form-group">
                    <div className="col-sm-6 col-md-6">Password :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <input className="km-pushnotification-input" value={this.state.apnsPassword} onChange ={(e) =>{ this.setState({disableButtonForIosDistribution: false, apnsPassword: e.target.value })} }id="apnsPassword" type="password"></input></div>
                  </div> 
                  <div className="btn-group">
                <button disabled={this.state.disableButtonForIosDistribution}  className="km-button km-button--primary save-changes-btn"
                  onClick={(e) => {
                    this.setState({
                      disableButtonForIosDistribution: true
                    },this.uploadDistributionapnsFile)
                  }} >Save</button>
              </div>
              <div>
                  <div className="form-group km-pushNotification-div">For DEVELOPMENT<span className="customer-type"> </span></div>   
                  <hr className="km-pushnotification-hr"></hr>           
                    <div className="row form-group km-pushNotification-development">
                        
                    <div className="col-sm-6 col-md-6">Apple Certificate :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <InputFile id={'testApnsUrl'} dataUrl={this.state.apnsTestUrl} className={'secondary'} text={this.state.apnsForDevelepment} onBlur={(e) =>{ this.setState({disableButtonForIosDevelopment: false})} } accept={'.p12'} />
                    </div>
                    </div>
                    <div className="row form-group">
                    <div className="col-sm-6 col-md-6">Password :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <input className="km-pushnotification-input"  value={this.state.apnstestPassword} onChange={(e) =>{ this.setState({disableButtonForIosDevelopment: false, apnstestPassword: e.target.value   })} }  id="testApnsPassword" type="password"></input></div>
                  </div> 
                  </div>
                  <div className="btn-group">
                <button disabled={this.state.disableButtonForIosDevelopment} className="km-button km-button--primary save-changes-btn"
                  onClick={(e) => {
                    this.setState({
                      disableButtonForIosDevelopment: true
                    },this.uploadDevelopmentapnsFile)
                  }} >Save</button>
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
