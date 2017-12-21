import React, { Component } from 'react';
import Notification from '../model/Notification';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';

class WhenYouAreOffline extends Component {

	state = {
    unknownChatComponents: [],
    knownUserComponents: [],
    unknownMessageSections: [{component: <MessageSection />}],
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
    if(this.state.unknownMessageSections.length < 3){
      this.setState((prevState) => {
        return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <MessageSection />}])}
      });

      this.setState((prevState) => {
        return {unknownChatComponents: prevState.unknownChatComponents.concat([{component: <MessageSection />}])}
      });
    }
  }

  addLeadGenerationTemplate = (e) => {
    e.preventDefault();
    if(this.state.unknownMessageSections.length < 3){
      this.setState((prevState) => {
        return {unknownMessageSections: prevState.MessageSections.concat([{component: <LeadGenerationTemplate />}])}
      });

      this.setState((prevState) => {
        return {unknownChatComponents: prevState.unknownChatComponents.concat([{component: <LeadGenerationTemplate />}])}
      });
    }
  }

	render(){
		return (
      <div className="cursor-is-pointer">
        <div className="row">
          <div className="col-6">
            <h4 className="when-you-are-online-heading"> When you are offline <span className="offline-indicator"></span></h4>
            <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
          </div>
          <div className="col-6" onClick={this.methodToShowOfflinePrefs}>
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
            <div className="col-12">
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
              <button className="welcome-buttons" onClick={this.addWelcomeMessage}>Add message</button>
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
            <div className="col-12">
              <UserPopover 
                title="Message for known users"
                message="Users whose email ID/Phone number are available with you will be shown this message"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-5">
              <MessageSection />
            </div>
            <div className="col-4">
                <ChatPreview chatPreviewComponents={this.state.knownUserComponents}/>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
                  <button className="welcome-buttons">Add another message</button>
              <button className="welcome-buttons">Add input field</button>
            </div>
          </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOffline;