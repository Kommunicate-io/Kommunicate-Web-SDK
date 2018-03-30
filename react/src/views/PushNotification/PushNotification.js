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
    this.state = {
     enableDisableCheckbox: false,
     activeTextField: -1,
     gcmKey:'',
     disableButtonForAndroid:true,
     disableButtonForIosDevelopment:true,
     disableButtonForIosDistribution:true,
    };
    this.submitGcmkey = this.submitGcmkey.bind(this);
    this.uploadDistributionapnsFile = this.uploadDistributionapnsFile.bind(this);
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
           console.log(response);
           file.url = response.data;
               file.success = params.this;
               file.env = params.env;
               params.callback(file);
          }
        });
  }
  uploadDistributionapnsFile(){
    var file ={};
    file.file = document.getElementById("apnsUrl").files[0];
    file.name = file.file.name;
    file.this =this;
    file.env ="distribution";
    file.callback= function(file){
      file.success.submitGcmkey(file.url,file.env);
    }
    this.certificateUpload(file);
  }
  uploadDevelopmentapnsFile(){
    var file ={};
    file.file = document.getElementById("testApnsUrl").files[0];
    file.name = file.file.name;
    file.this =this;
    file.env ="development";
    file.callback= function(file){
      file.success.submitGcmkey(file.url,file.env);
    }
     this.certificateUpload(file);
  }
  submitGcmkey(fileurl,env){
    if(document.getElementById("gcmKey").value ===""&& document.getElementById("apnsUrl").value ===""&& document.getElementById("testApnsUrl").value ===""){
      return;
    }

    let userDetailUrl =getConfig().applozicPlugin.editAppModule; 
    let applicationList = CommonUtils.getUserSession().application.appModulePxys[0];
    if(fileurl && env ==="development"){
      applicationList.testApnsUrl =fileurl;
    }
    if(fileurl && env ==="distribution"){
      applicationList.apnsUrl =fileurl;
    }
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
      application.gcmKey = applicationList.gcmKey?applicationList.gcmKey:document.getElementById("gcmKey").value;
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
    userSession.application.appModulePxys[0] =applicationList;
    localStorage.setItem('KM_USER_SESSION', JSON.stringify(userSession));
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
        alert(" data successfully updated");
      } else {
        alert("something went wrong");
      }
    })
    this.setState({disableButtonForAndroid: true });
    this.setState({disableButtonForIosDistribution: true });
    this.setState({disableButtonForIosDevelopment: true });

  }

  render() {
  
    return (
      <div className="away-message-wrapper">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="card-block away-message-header">
              <div className="row">
                <h4 className="away-message-title">Enabling push notification allows kommunicate to send notification even when your mobile app in foreground</h4>
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
                    <input id="gcmKey" className="km-pushnotification-input" type="text" onFocus ={(e) =>{ this.setState({disableButtonForAndroid: false})} }></input></div>
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
                    <InputFile id={'apnsUrl'} className={'secondary'} text={'Upload File'} onBlur ={(e) =>{ this.setState({disableButtonForIosDistribution: false})} } accept={'.p12'} />
                    </div>
                    </div>
                    <div className="row form-group">
                    <div className="col-sm-6 col-md-6">Password :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <input className="km-pushnotification-input" id="apnsPassword" type="password"></input></div>
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
                    <InputFile id={'testApnsUrl'} className={'secondary'} text={'Upload File'} onBlur={(e) =>{ this.setState({disableButtonForIosDevelopment: false})} } accept={'.p12'} />
                    </div>
                    </div>
                    <div className="row form-group">
                    <div className="col-sm-6 col-md-6">Password :<span className="customer-type"> </span></div>
                    <div className="col-sm-6 col-md-6">
                    <input className="km-pushnotification-input" id="testApnsPassword" type="password"></input></div>
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
