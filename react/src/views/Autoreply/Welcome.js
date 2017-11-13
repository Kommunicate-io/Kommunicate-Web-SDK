import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions }  from '../../utils/kommunicateClient'
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';


class Welcome extends Component{
  constructor(props){
    super(props);

    this.state = {
     msg:''
    };
this.submitWelcomeMessage = this.submitWelcomeMessage.bind(this);

  }
  submitWelcomeMessage = () => {
     var applicationId =localStorage.getItem("applicationId");
     var userId =localStorage.getItem("loggedinUser");
     console.log(applicationId,userId);
     var setWelcomeMessageUrl = getConfig().kommunicateApi.setWelcomeMessage;
     axios({
      method: 'post',
      url:setWelcomeMessageUrl+applicationId+"/welcomeMessage",
      data:{
            "applicationId" : applicationId,
            "message" : this.state.msg,
            "userId" : "suarj@applozic.com",
            "event" : "onwelcomepageload"
          }
       }).then(function(response){
         console.log("message successfully send");
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
          <div className="form-group row form-control-label">Message</div>
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
