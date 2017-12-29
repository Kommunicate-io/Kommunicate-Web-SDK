import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions, getWelcomeMessge, disableInAppMsgs, enableInAppMsgs }  from '../../../utils/kommunicateClient'
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../../config/config.js';
import { Label, Input } from 'reactstrap';
import WhenYouAreOnline from './WhenYouAreOnline'
import WhenYouAreOffline from './WhenYouAreOffline'


class Welcome extends Component{
  constructor(props){
    super(props);
    this.state = {
     msg:'',
     showOverlay: false,
     enableDisableCheckbox: true
    };
    this.submitWelcomeMessage = this.submitWelcomeMessage.bind(this);
  }

  componentDidMount(){
    getWelcomeMessge(localStorage.getItem("applicationId")).then(message=>{
      this.setState({msg:message});
    }).catch(err=>{
      console.log("error while fetching welcome message",err);
    })
  }

  submitWelcomeMessage = () => {
    var _this =this;
     var applicationId =localStorage.getItem("applicationId");
     var userId =localStorage.getItem("loggedinUser");
     console.log(applicationId,userId);
     var setWelcomeMessageUrl = getConfig().kommunicateBaseUrl+"/applications/"+applicationId+"/welcomemessage";
     axios({
      method: 'post',
      url:setWelcomeMessageUrl,
      data:{
            "applicationId" : applicationId,
            "message" : this.state.msg
          }
       }).then(function(response){
         console.log("message successfully send");
         Notification.info("welcome message configured successfully");
         //_this.setState({msg:""});
       }).catch(err=>{
        Notification.error("something went wrong!");
       })

	}

  toggleOverlay = (e) => {

    e.preventDefault();
    console.log("hello");
    if(this.state.showOverlay === false){
      this.setState({showOverlay: true})
    }else {
      this.setState({showOverlay: false})
    }

  }

  handleCheckboxChange = () => {

    // make api call to disable all rows in in_app_msgs where createdBy = user.id 

    this.setState({enableDisableCheckbox: !this.state.enableDisableCheckbox}, () => {
      if(this.state.enableDisableCheckbox) {
        enableInAppMsgs().then(result => {
          Notification.success('Welcome Mesages Enabled')
        })
      }else{
        disableInAppMsgs().then(result => {
          Notification.error('Welcome Messages Disabled')
        })
        
      }
    }) 
  }

render(){
  return (
<div className="animated fadeIn">
  <div className="row">
    <div className="col-sm-12 col-md-12">
      <div className="card welcome-message-container">
        <div className="card-block">
          <div>
            <div className="col-6">
              <div  className="row">
                <h4 className="enable-automatic-welcome">Enable automatic welcome message </h4>
                <Label className="switch switch-3d switch-enable-automatic">
                    <Input type="checkbox" className="switch-input" onChange={this.handleCheckboxChange} checked={this.state.enableDisableCheckbox}/>
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
                </Label>
              </div>
              <div className="row">
                <p className="welcome-message-will">(welcome message will be automatically shown to the user on opening the chat box)</p>
              </div>
              <div className="row">
                <p className="you-can-update-status">You can update status as <span className="you-can-update-status text-style-1">offline</span> or <span className="you-can-update-status text-style-1">online</span> manually from the header above. 
                <span className="you-can-update-status text-style-2" onClick={this.toggleOverlay}>Show me where</span></p>
                
              </div>
            </div>
          </div>
          <hr />
          <WhenYouAreOnline />
          <hr />
          <WhenYouAreOffline />
        </div>
        <div className={this.state.showOverlay ? "full-screen-overlay show-full-screen-overlay": "full-screen-overlay hide-full-screen-overlay"} onClick={this.toggleOverlay}>
          <p>You can update your status
          as offline or online from here</p>
          {
            <div className="curved-arrow"></div>
          }
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-block">
            <div className="form-group row form-control-label">
              Message
            </div>
            <div className="form-group row">
              <textarea id ="offhourmessage" rows="6" cols="60" onChange = {(event) => this.setState({msg:event.target.value})} value={this.state.msg} required></textarea>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-primary px-4" onClick={this.submitWelcomeMessage}>Save</button>
          <button type="reset" className="btn btn-danger px-4">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}
}

export default Welcome;
