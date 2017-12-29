import React, { Component } from 'react';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';

import {addInAppMsg} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification'

class WhenYouAreOffline extends Component {

  getMessageFunc = (msg) => {
    this.setState({unknownMessage: msg});
  }

  known_getMessageFunc = (msg) => {
    this.setState({knownMessage: msg}, () => {
      // this._addMessageToChatPreview()
    });
  }

  unknownUser = {
    unknownChatComponents: [],
    unknownMessageSections: [{component: <MessageSection getMessage={this.getMessageFunc.bind(this)}/>}],
    unknownMessageSectionMsgs: [],
    unknownMessage: '',
  }

  knownUser = {
    knownChatComponents: [],
    knownMessageSections: [{component: <MessageSection getMessage={this.known_getMessageFunc.bind(this)}/>}],
    knownMessageSectionMsgs: [],
    knownMessage: '',
  }

	state = {
    ...this.unknownUser,
    ...this.knownUser,
		showOfflinePrefs: false,
		upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
	}

  methodToShowOfflinePrefs = (e) => {
  	e.preventDefault();
  	if(this.state.showOfflinePrefs){
  		this.setState({
  			showOfflinePrefs: false,
  			upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
  		})
  	}else{
  		this.setState({
  			showOfflinePrefs: true,
  			upDownIcon: "icon-arrow-up icons font-2xl d-block mt-4 text-right"
  		})
  	}
  }

  addMessageSection = (e) => {
    e.preventDefault();
    if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0){
      this.setState((prevState) => {
        return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <MessageSection getMessage={this.getMessageFunc.bind(this)}/>}])}
      });
    }
  }

  addLeadGenerationTemplate = (e) => {
    e.preventDefault();
    if(this.state.unknownMessageSections.length < 3){
      this.setState((prevState) => {
        return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <LeadGenerationTemplate />}])}
      });

      this.setState((prevState) => {
        return {unknownChatComponents: prevState.unknownChatComponents.concat([{component: <LeadGenerationTemplate />}])}
      });
    }
  }

  addMessageToChatPreview = (eventId, status) => {
    if(this.state.unknownMessageSections.length <= 3 && this.state.unknownMessage.trim().length > 0){

      this.setState((prevState) => {
        return {
          unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([this.state.unknownMessage]),
          unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.unknownMessage}</p>}])
        }
      }, () => {

        let data = {
          eventId: eventId,
          message: this.state.unknownMessage,
          status: status,
          sequence: this.state.unknownMessageSectionMsgs.length,
        }

        addInAppMsg(data)
          .then(response => {
            this.setState({unknownMessage: ''})
            if(response.data.code === 'SUCCESS'){
                    Notification.success('In app message saved successfully');
                }else{
                    Notification.success('In app message not saved.');
                }
              })
      });
    }
  }

	render(){
		return (
      <div className="cursor-is-pointer">
        <div className="row" onClick={this.methodToShowOfflinePrefs}>
          <div className="col-6">
            <h4 className="when-you-are-online-heading"> When you are offline <span className="offline-indicator"></span></h4>
            <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
          </div>
          <div className="col-6" >
            <i className={this.state.upDownIcon}></i>
          </div>
        </div>
				<div className = {
	        this.state.showOfflinePrefs === true
	          ? null
	          : "n-vis"
	    		}
	        style={{ marginLeft: "0" }}>
          <div className="form-group row">
            <div className="col-6">
              <h3 className="welcome-preview text-right">Preview:</h3>
            </div>
            <div className="col-6">
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-4 col-sm-12">
              <UserPopover 
                title="Message for anonymous users"
                message="Users whose contact details are not available with you will be shown this message"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-5">
              {this.state.unknownMessageSections.map((MessageSection, i) => (<div key={i}>{MessageSection.component}</div>))}
            </div>
            <div className="col-4">
                <ChatPreview chatPreviewComponents={this.state.unknownChatComponents}/>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
              <button className="welcome-buttons" onClick={() => {this.addMessageToChatPreview(1, 1)}}>Add message</button>
              <button className="welcome-buttons" onClick={this.addLeadGenerationTemplate}>Add lead generation template</button>
              <button className="welcome-buttons" onClick={this.addMessageSection}>Add another message</button>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
              <span><strong>Tip:</strong> You can use the lead generation template to collect customer contact information</span>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-4 col-sm-12">
              <UserPopover
                title="Message for known users"
                message="Users whose email ID/Phone number are available with you will be shown this message"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-5">
              {this.state.knownMessageSections.map((knownMessageSection, i) => (<div key={i}>{knownMessageSection.component}</div>))}
            </div>
            <div className="col-4">
                <ChatPreview chatPreviewComponents={this.state.knownChatComponents}/>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
                  <button className="welcome-buttons">Add another message</button>
            </div>
          </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOffline;