import React, { Component } from 'react';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';


class WhenYouAreOnline extends Component {

	getMessageFunc = (msg) => {
	  this.setState({unknownMessage: msg});
	}

	state = {
		unknownChatComponents: [],
		unknownMessageSections: [{component: <MessageSection getMessage={this.getMessageFunc.bind(this)}/>}],
		unknownMessageSectionMsgs: [],
		unknownMessage: '',
		knownUserComponents: [],
		showPrefs: false,
		upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
	}

	methodToShowPrefs = (e) => {
	  	e.preventDefault();
	  	if(this.state.showPrefs) {
	  		this.setState({
	  			showPrefs: false,
	  			upDownIcon: "icon-arrow-down icons font-2xl d-block mt-4 text-right"
	  		})
	  	}else {
	  		this.setState({
	  			showPrefs: true,
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

			// this.setState((prevState) => {
			// 	return {unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p>{this.state.unknownMessage}</p>}])}
			// });
		}
	}

	addLeadGenerationTemplate = (e) => {
		e.preventDefault();
		if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0){
			this.setState((prevState) => {
				return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <LeadGenerationTemplate />}])}
			});

			this.setState((prevState) => {
				return {unknownChatComponents: prevState.unknownChatComponents.concat([{component: <LeadGenerationTemplate />}])}
			});
		}
	}

	addMessageToChatPreview = (e) => {
		e.preventDefault();
		if(this.state.unknownMessageSections.length <= 3 && this.state.unknownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([this.state.unknownMessage]),
					unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.unknownMessage}</p>}]),
					unknownMessage: ''
				}
			});
		}
	}

	render(){
		return (
			<div className="cursor-is-pointer">
        <div className="row" onClick={this.methodToShowPrefs}>
          <div className="col-6">
            <h4 className="when-you-are-online-heading"> When you are online <span className="online-indicator"></span></h4>
            	<p className="start-solving-your-user">Start solving your users’ issues with this message </p>
          </div>
          <div className="col-6">
            <i className={this.state.upDownIcon}></i>
          </div>
        </div>
				<div className = {
	        this.state.showPrefs === true
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
	        		{this.state.unknownMessageSections.map((unknownMessageSection, i) => (<div key={i}>{unknownMessageSection.component}</div>))}
	        	</div>
	        	<div className="col-4">
		            <ChatPreview chatPreviewComponents={this.state.unknownChatComponents}/>
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
	        		<button className="welcome-buttons" onClick={this.addMessageToChatPreview}>Add message</button>
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

export default WhenYouAreOnline;