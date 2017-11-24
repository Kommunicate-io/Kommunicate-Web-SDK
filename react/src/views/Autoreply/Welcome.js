import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions, getWelcomeMessge }  from '../../utils/kommunicateClient'
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import { Label, Input } from 'reactstrap';


class Welcome extends Component{
  constructor(props){
    super(props);

    this.state = {
     msg:''
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
render(){
  return (
<div className="animated fadeIn">
  <div className="row">
    <div className="col-sm-12 col-md-12">
      <div className="card">
        <div className="card-header">
          <div className="card-block">
            <div>
              <div className="col-6">
                <div  className="row">
                  <h4 className="enable-automatic-welcome">Enable automatic welcome message </h4>
                  <Label className="switch switch-3d switch-success">
                      <Input type="checkbox" className="switch-input" defaultChecked/>
                      <span className="switch-label"></span>
                      <span className="switch-handle"></span>
                  </Label>
                </div>
                <div className="row">
                  <p className="welcome-message-will">(welcome message will be automatically shown to the user on opening the chat box)</p>
                </div>
                <div className="row">
                  <p className="you-can-update-status">You can update status as <span className="you-can-update-status text-style-1">offline</span> or <span className="you-can-update-status text-style-1">online</span> manually from the header above. <span className="you-can-update-status text-style-2">Show me where</span></p>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div className="row">
                <div className="col-6">
                  <h4> When you are online </h4>
                  <p className="start-solving-your-user">Start solving your users’ issues with this message </p>
                </div>
                <div className="col-6">
                  <i className="icon-arrow-down icons font-2xl d-block mt-4 text-right"></i>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div className="row">
                <div className="col-6">
                  <h4> When you are offline </h4>
                  <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
                </div>
                <div className="col-6">
                  <i className="icon-arrow-down icons font-2xl d-block mt-4 text-right"></i>
                </div>
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

export default Welcome;
