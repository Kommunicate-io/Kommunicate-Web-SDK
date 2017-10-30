import React, { Component } from 'react';
import isEmail from 'validator/lib/isEmail';

import {getJsCode, getJsInstructions} from '../../../utils/customerSetUp';
import {notifyThatEmailIsSent} from '../../../utils/kommunicateClient'
import ValidationUtils from '../../../utils/validationUtils'

import '../../Settings/Integration/multiple-email.css'
import Notification from '../../model/Notification';

class Step1 extends Component {

	constructor(props) {
		super(props);

    this.state = {
      emailInstructions : false,
      multipleEmailAddress: [],
      emailAddress: '',
      hideShowInputEmail :false,
      hideNextBtn:false
    }

    this.jsScript = getJsCode();
    this.jsInstructions = getJsInstructions();
	}

  showEmailInput = (e) => {
    e.preventDefault();
    this.setState({emailInstructions : true})
  }

  sendMail = (e) => {
    e.preventDefault();
    if(this.state.multipleEmailAddress.length >= 1){
      console.log(this.state.multipleEmailAddress)
      for(let i = 0; i < this.state.multipleEmailAddress.length; i++){
        if(!isEmail(this.state.multipleEmailAddress[i])){
          Notification.warning(this.state.multipleEmailAddress[i] + " is an invalid Email");
          return;
        }
      }
      notifyThatEmailIsSent({to:this.state.multipleEmailAddress,templateName:"SEND_KOMMUNICATE_SCRIPT"});
    }else{
      console.log(this.state.emailAddress)
      if(!isEmail(this.state.emailAddress)){
        Notification.warning(this.state.emailAddress + " is an invalid Email");
        return;
      }else{
        notifyThatEmailIsSent({to:this.state.emailAddress,templateName:"SEND_KOMMUNICATE_SCRIPT"});
      }
    }
  }

  multipleEmailHandler = (e) => {
    if(e.target.value.includes(' ')){
      this.setState({emailAddress: ''})
    }else{
      this.setState({emailAddress: e.target.value})
    }
  }

  checkForSpace = (e) => {
    if((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) && ValidationUtils.isValidEmail(this.state.emailAddress)) {
      this.setState({multipleEmailAddress: this.state.multipleEmailAddress.concat([this.state.emailAddress])})
      this.setState({emailAddress: ''})
    }
    // console.log(this.state.multipleEmailAddress)
    // console.log(this.state.emailAddress)

  }

  removeEmail = (removeEmail) => {
    // console.log(this.state.multipleEmailAddress);
    const filteredEmails = this.state.multipleEmailAddress.filter(email => email !== removeEmail)
    this.setState({multipleEmailAddress: filteredEmails})
    // console.log(this.state.multipleEmailAddress);
  }

  componentDidMount() {
    
  }
  componentWillMount(){
    if(this.props.location && this.props.location.pathname ==="/installation" &&this.props.location.search){
      //const search = encodeURIComponent(this.props.location.search);
      let paramArray = this.props.location.search.substr(1).split("&");
      let params = {};
      for(var i=0;i<paramArray.length;i++){
        var item = paramArray[i].split("=");
        params[item[0]]=item[1];
      }
      console.log("search",params);
       localStorage.setItem("applicationId",params.applicationId||"your _application_id");
       localStorage.setItem("agentId",params.agentId||"default_agent_id");
       localStorage.setItem("agentName",params.agentName||"agent_display_name");
      this.state.hideShowInputEmail = true;
      this.state.hideNextBtn=true;
       }
  }

  render() {

    const texAreaStyle = { 
      "backgroundColor": "#FFF",
      "color":"#000"
    }

  	return (
      <form>
        <div className="form-group" hidden = {this.state.hideShowInputEmail}>
          <button className="btn btn-sm btn-primary px-4" onClick={this.showEmailInput}> Email instructions to the team </button>
        </div> 
        <div className={((this.state.emailInstructions === true)  ? 'form-group row' : 'n-vis')} style={{"marginLeft": "0"}}>
          {/*<div style={{"backgroundColor":"#FFF","border":"0px solid #000","paddingLeft": "0"}} className="form-group col-md-5">
            {this.state.multipleEmailAddress.map((email, i) => (
              <div key={i} style={{"display":"inline-block", "border":"0", "backgroundColor":"#C0C0C0", "marginLeft": "5px", "marginTop":"5px"}}>
                <span>{email}</span>
                <span style={{"marginLeft": "3px", "cursor": "pointer"}} onClick={() => {this.removeEmail(email)}}>X</span>
              </div>
            ))}
            <input style={{"border":"0","width":"232px","margin":"5px"}} value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder="Enter email here"/>
          </div>*/}
          <div className="form-group col-md-5 multiple-email-container">
            {this.state.multipleEmailAddress.map((email, i) => (
              <div className="single-email-container" key={i}>
                <span>{email}</span>
                <span className="remove-email" onClick={() => {this.removeEmail(email)}}>| X</span>
              </div>
            ))}
            <input className="input-email" value={this.state.emailAddress} onKeyDown={this.checkForSpace} onChange={this.multipleEmailHandler}  placeholder= "You can enter multiple emails here"/>
          </div>
          <div className="col-md-7">
            <button className="btn btn-sm btn-primary px-4" onClick={this.sendMail}> Send </button>
          </div>
        </div>  
        <div className="row">
          <div className="form-group col-md-5">
            <textarea style={texAreaStyle} className="form-control" rows='16' value={this.jsInstructions} readOnly />
          </div>
          <div className="form-group col-md-7">
            <textarea style={texAreaStyle} className="form-control" rows='16' value={getJsCode()} readOnly />
          </div>
        </div>
        <div className="form-group"> 
          <button className="btn btn-sm btn-primary px-4" onClick={this.props.changeStep} hidden = {this.state.hideNextBtn}> Next </button>
        </div>
      </form>
  	)
  }
}

export default Step1