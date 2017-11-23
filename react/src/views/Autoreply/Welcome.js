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
              <h4>Enable automatic welcome message </h4>
              <Label className="switch switch-3d switch-success">
                  <Input type="checkbox" className="switch-input" defaultChecked/>
                  <span className="switch-label"></span>
                  <span className="switch-handle"></span>
              </Label>
              <p>(welcome message will be automatically shown to the user on opening the chat box)</p>
              <p>You can update status as offline or online manually from the header above. Show me where</p>
            </div> 
            <hr />
            <div>
              <h4> When you are online </h4>
              <p>Start solving your users’ issues with this message </p>
              <i className="icon-arrow-right icons font-2xl d-block mt-4"></i>
            </div>
            <hr />
            <div>
              <h4> When you are offline </h4>
              <p>Ask your user to leave a message so that you can get back to them later</p>
              <i className="icon-arrow-right icons font-2xl d-block mt-4"></i>
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
