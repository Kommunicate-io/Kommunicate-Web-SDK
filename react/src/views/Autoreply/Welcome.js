import React, { Component } from 'react'
import validator from 'validator';

import Notification from '../model/Notification';
import { getAllSuggestions, getSuggestionsByAppId, createSuggestions, getWelcomeMessge }  from '../../utils/kommunicateClient'
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
