import React, { Component } from 'react';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';

import {addInAppMsg} from '../../../utils/kommunicateClient'
import Notification from '../../model/Notification'


class WhenYouAreOnline extends Component {

	getMessageFunc = (msg) => {
	  this.setState({unknownMessage: msg}, () => {
	  	// this._addMessageToChatPreview()
	  });
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

	addMessageToChatPreview = (eventId, status) => {
		if(this.state.unknownMessageSections.length <= 3 && this.state.unknownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([this.state.unknownMessage]),
					unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.unknownMessage}</p>}]),
					// unknownMessage: ''
				}
			}, () => {

				let data = {
					eventId: eventId,
					message: this.state.unknownMessage,
					status: status,
					sequence: this.state.unknownMessageSectionMsgs.length,
					metadata: null
				}

				addInAppMsg(data)
					.then(response => {
						this.setState({unknownMessage: ''})
						if(response.data.code === 'SUCCESS'){
		          			Notification.success('In app message saved successfully');
		        		}else{
		          			Notification.error('In app message not saved.');
		        		}
		        	})
			});
		}
	}

	known_addMessageToChatPreview = (eventId, status) => {
		if(this.state.knownMessageSections.length <= 3 && this.state.knownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.concat([this.state.knownMessage]),
					knownChatComponents: prevState.knownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.knownMessage}</p>}])
				}
			}, () => {

				let data = {
					eventId: eventId,
					message: this.state.knownMessage,
					status: status,
					sequence: this.state.knownMessageSectionMsgs.length,
					metadata: null
				}

				addInAppMsg(data)
					.then(response => {
						this.setState({knownMessage: ''})
						if(response.data.code === 'SUCCESS'){
		          			Notification.success('In app message saved successfully');
		        		}else{
		          			Notification.error('In app message not saved.');
		        		}
		        	})
			});
		}
	}

	known_addMessageSection = (e) => {
		e.preventDefault();
		if(this.state.knownMessageSections.length < 3 && this.state.knownMessageSectionMsgs.length > 0){
			this.setState((prevState) => {
				return {knownMessageSections: prevState.knownMessageSections.concat([{component: <MessageSection getMessage={this.known_getMessageFunc.bind(this)}/>}])}
			});
		}
	}

	_addMessageToChatPreview = () => {

		// if(this.state.unknownMessageSections.length <= 3 && this.state.unknownMessage.trim().length > 0){

		// 	this.setState((prevState) => {
		// 		return {
		// 			unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.unknownMessage}</p>}]),
		// 		}
		// 	});
		// }
	}

	insertLink = () => {
		let textWithLink = <a href={this.state.url}>{this.state.textToDisplay}</a>
		this.setState({
		})
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
	        	<div className="col-md-4 col-sm-12">
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
	        		<button className="welcome-buttons" onClick={() => {this.addMessageToChatPreview(3, 1)}}>Add message</button>
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
	        		<button className="welcome-buttons" onClick={() => {this.known_addMessageToChatPreview(4, 1)}}>Add message</button>
              		<button className="welcome-buttons" onClick={this.known_addMessageSection}>Add another message</button>
	        	</div>
	        </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;