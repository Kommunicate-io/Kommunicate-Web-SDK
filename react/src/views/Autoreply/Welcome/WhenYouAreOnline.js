import React, { Component } from 'react';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';

import {addInAppMsg, getInAppMessagesByEventId, deleteInAppMsg} from '../../../utils/kommunicateClient'
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
		// unknownMessageSections: [],
		unknownMessageSections: [{component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} />}],
		unknownMessageSectionMsgs: [],
		unknownMessage: '',
	}

	knownUser = {
		knownChatComponents: [],
		// knownMessageSections: [],
		knownMessageSections: [{component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} />}],
		knownMessageSectionMsgs: [],
		knownMessage: '',
	}

	state = {
		...this.unknownUser,
		...this.knownUser,
		showPrefs: false,
		upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
	}

	componentDidMount(){

	    // eventId id 3 when agent is online and user is anonymous
	    getInAppMessagesByEventId(3).then(response => {
	      console.log(response)
	      if(response.length < 1){
	      	this.setState({unknownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} />}]})
      	  }

	      response.map(message => {
	      	if(message.status === 1){
		        this.setState(prevState =>{
		          return {
		          	unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([message.message]),
		            unknownChatComponents: prevState.unknownChatComponents.concat([{id: message.id, component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{message.message}</p>}])
		          }
		        }, () => {
		        	this.setState((prevState) => {
		        		let messageId = message.id
						return {unknownMessageSections: prevState.unknownMessageSections.concat([{id: message.id, component: <MessageSection showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}}/>}])}
					});
		        })
		    }
	      })
	    })

	    // eventId id 4 when agent is online and user is known
	    getInAppMessagesByEventId(4).then(response => {
	      console.log(response)

	      if(response.length < 1){
	      	this.setState({knownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} />}]})
	      }

	      response.map(message => {
	      	if(message.status === 1){
		        this.setState(prevState =>{
		          return {
		          	knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.concat([message.message]),
		            knownChatComponents: prevState.knownChatComponents.concat([{id: message.id, component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{message.message}</p>}])
		          }
		        }, () => {
		        	this.setState((prevState) => {
						return {knownMessageSections: prevState.knownMessageSections.concat([{id: message.id, component: <MessageSection showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(message.id)}}/>}])}
					});
		        })
	    	}
	      })
	    })
  	}


  	_deleteInAppMsg = (id) => {
  		console.log(id)
  		deleteInAppMsg(id).then(response =>{

  			this.setState((prevState) => {
  				return {
  					unknownMessageSections: prevState.unknownMessageSections.filter(message => message.id !== id),
  					unknownChatComponents: prevState.unknownChatComponents.filter(message => message.id !== id),
  					knownMessageSections: prevState.knownMessageSections.filter(message => message.id !== id),
  					knownChatComponents: prevState.knownChatComponents.filter(message => message.id !== id)
  				}
  			})
  			if(response){
  				Notification.success('Successfully deleted');
  			}else {
  				Notification.danger('Not deleted');
  			}
  		})
  	}

	methodToShowPrefs = (e) => {
	  	e.preventDefault();
	  	if(this.state.showPrefs) {
	  		this.setState({
	  			showPrefs: false,
	  			upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
	  		})
	  	}else {
	  		this.setState({
	  			showPrefs: true,
	  			upDownIcon: "icon-arrow-up icons font-2xl d-block text-right"
	  		})
	  	}
	}

	_callApiCreateInAppMsg = (data) => {

		addInAppMsg(data)
					.then(response => {
						this.setState({unknownMessage: ''})
						this.setState({knownMessage: ''})
						if(response !== undefined && response.status === 200 ){
							if(response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created'){
		          				Notification.success('In app message saved successfully');
		        			}else if(response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached'){
		        				Notification.warning('Not created, limit of 3 in app messages reached');	
		        			}else{
		          				Notification.error('In app message not saved.');
		        			}
						}
		        	})

	}

	addMessageSection = (e) => {
		e.preventDefault();
		if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0 && this.state.unknownMessageSectionMsgs.length < 4){
			this.setState((prevState) => {
				return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <MessageSection showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}}/>}])}
			});
		}
	}

	known_addMessageSection = (e) => {
		e.preventDefault();
		if(this.state.knownMessageSections.length < 3 && this.state.knownMessageSectionMsgs.length > 0 && this.state.knownMessageSectionMsgs.length < 4){
			this.setState((prevState) => {
				return {knownMessageSections: prevState.knownMessageSections.concat([{component: <MessageSection showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}}/>}])}
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
		if(this.state.unknownMessageSectionMsgs.length < 3 && this.state.unknownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([this.state.unknownMessage]),
					unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}>{this.state.unknownMessage}</p>}]),
				}
			}, () => {

				let data = {
					eventId: eventId,
					message: this.state.unknownMessage,
					status: status,
					sequence: this.state.unknownMessageSectionMsgs.length,
					metadata: null
				}

				this._callApiCreateInAppMsg(data)

			});
		}else{
      		Notification.warning('Limit of 3 messages reached.');
    	}
	}


	known_addMessageToChatPreview = (eventId, status) => {
		if(this.state.knownMessageSectionMsgs.length < 3 && this.state.knownMessage.trim().length > 0){

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

				this._callApiCreateInAppMsg(data)

			});
		}else{
     		Notification.warning('Limit of 3 messages reached.');
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
		console.log(this.state)
		return (
			<div className="cursor-is-pointer">
        <div className="row" onClick={this.methodToShowPrefs}>
          <div className="col-5">
            <h4 className="when-you-are-online-heading"> When you are online <span className="online-indicator"></span></h4>
            	<p className="start-solving-your-user">Start solving your users’ issues with this message </p>
          </div>
          <div className="col-5">
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
	        	<div className="col-5">
	        	</div>
	        	<div className="col-7">
	        		<h3 className="welcome-preview text-left">Preview:</h3>
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
	        		<button className="welcome-buttons mb-2" onClick={this.addMessageSection}>Add another message</button>
	        		<button className="welcome-buttons" onClick={this.addLeadGenerationTemplate}>Add lead generation template</button>
	        	</div>
	        </div>
	        <div className="form-group row">
		        <div className="col-5">
		        	<span className={this.state.unknownMessageSectionMsgs.length < 2 ? null:"n-vis"}><strong>Tip:</strong> You can use the lead generation template to collect customer contact information</span>
              		<span className={this.state.unknownMessageSectionMsgs.length >= 2 ? null:"n-vis"}> You can only show a maximum of 3 welcomemessages. </span>
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
	        		<button className="welcome-buttons" onClick={this.known_addMessageSection}>Add another message</button>
	        	</div>
	        </div>
	  		</div>
			</div>
		)
	}

}

export default WhenYouAreOnline;