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
		unknownMessageSections: [],
		unknownMessageSectionMsgs: [],
		unknownMessage: '',
	}

	knownUser = {
		knownChatComponents: [],
		knownMessageSections: [],
		knownMessageSectionMsgs: [],
		knownMessage: '',
	}

	state = {
		...this.unknownUser,
		...this.knownUser,
		showPrefs: this.props.showOnlinePrefs,
		upDownIcon: "icon-arrow-down icons font-2xl d-block text-right",
				
	}

	componentDidMount() {

		let eventIds = [1, 2, 3, 4];
		return Promise.resolve(getInAppMessagesByEventId(eventIds)).then(welcomeMessages => {
		console.log("When you are Online msg API response", welcomeMessages)
		
		if (welcomeMessages.eventId3Messages instanceof Array && welcomeMessages.eventId3Messages.length < 1) {
			this.setState({ unknownMessageSections: [] })
			}
		
		// eventId id 3 when agent is online and user is anonymous users
		welcomeMessages.eventId3Messages.map(msg => {
			msg.messages.map(item => {
				if (item.status === 1 && item.metadata === null) {
					this.setState(prevState => {
		          return {
							unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([{ id: item.id, message: item.message }]),
							unknownChatComponents: prevState.unknownChatComponents.concat([{ id: item.id, component: <p dangerouslySetInnerHTML={{ __html: item.message }} style={{ width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px" }}></p> }])
		          }
		        }, () => {
						if (this.state.unknownMessageSections.length < 1) {
		        		this.setState((prevState) => {
								let messageId = item.id
								return { unknownMessageSections: prevState.unknownMessageSections.concat([{ id: item.id, component: <MessageSection id={item.id} editInAppMsg={true} showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.addMessageToChatPreview(3, 1) }} messageValue={item.message} deleteInAppMsg={() => { this._deleteInAppMsg(messageId) }} /> }]) }
						});
						} else {
		        		this.setState((prevState) => {
								let messageId = item.id
								return { unknownMessageSections: prevState.unknownMessageSections.concat([{ id: item.id, component: <MessageSection id={item.id} editInAppMsg={true} showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.addMessageToChatPreview(3, 1) }} messageValue={item.message} deleteInAppMsg={() => { this._deleteInAppMsg(messageId) }} /> }]) }
						});
		        	}
		        })
				} else if (item.status === 1 && item.metadata !== null) {
					this.setState(prevState => {
						let messageId = item.id
		          return {
							unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([{ id: item.id, message: "Lead Generation template added" }]),
							unknownMessageSections: prevState.unknownMessageSections.concat([{ id: item.id, component: <LeadGenerationTemplate showDeleteBtn={true} deleteInAppMsg={() => { this._deleteInAppMsg(messageId) }} /> }]),
							unknownChatComponents: prevState.unknownChatComponents.concat([{ id: item.id, component: <LeadGenerationTemplate showDeleteBtn={false} /> }])
		          }
		        })
		    }
	      })
		})
		
		if (this.state.unknownMessageSections.length < 1) {
			this.setState({ unknownMessageSections: [{ id: -1, component: <MessageSection id={null} showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.addMessageToChatPreview(3, 1) }} deleteInAppMsg={() => { this._deleteInAppMsg(-1) }} /> }] })
      	  }
	    // eventId id 4 when agent is online and user is known

		if (welcomeMessages.eventId4Messages instanceof Array && welcomeMessages.eventId4Messages.length < 1) {
			this.setState({ knownMessageSections: [{ id: -101, component: <MessageSection id={-101} showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.known_addMessageToChatPreview(4, 1) }} deleteInAppMsg={() => { this._deleteInAppMsg(-101) }} /> }] })
	      }

		welcomeMessages.eventId4Messages.map(msg => {
			msg.messages.map(item => {
				if (item.status === 1) {
					this.setState(prevState => {
		          return {
							knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.concat([{ id: item.id, message: item.message }]),
							knownChatComponents: prevState.knownChatComponents.concat([{ id: item.id, component: <p dangerouslySetInnerHTML={{ __html: item.message }} style={{ width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px" }}></p> }])
		          }
		        }, () => {
						if (this.state.knownMessageSections.length < 1) {
		        		this.setState((prevState) => {
								return { knownMessageSections: prevState.knownMessageSections.concat([{ id: item.id, component: <MessageSection id={item.id} editInAppMsg={true} showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.known_addMessageToChatPreview(4, 1) }} messageValue={item.message} deleteInAppMsg={() => { this._deleteInAppMsg(item.id) }} /> }]) }
						});
						} else {
		        		this.setState((prevState) => {
								return { knownMessageSections: prevState.knownMessageSections.concat([{ id: item.id, component: <MessageSection id={item.id} editInAppMsg={true} showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.known_addMessageToChatPreview(4, 1) }} messageValue={item.message} deleteInAppMsg={() => { this._deleteInAppMsg(item.id) }} /> }]) }
						});
		        	}
		        })
	    	}
	      })
		})

		if (this.state.knownMessageSections.length < 1) {
				this.setState({ knownMessageSections: [{ id: -101, component: <MessageSection id={-101} showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => { this.known_addMessageToChatPreview(4, 1) }} deleteInAppMsg={() => { this._deleteInAppMsg(-101) }} /> }] })
		}
		if (welcomeMessages.eventId3Messages[0].messages[0].status === 2 || welcomeMessages.eventId4Messages[0].messages[0].status === 2 ||
			welcomeMessages.eventId3Messages[0].messages[0].status === 3 || welcomeMessages.eventId4Messages[0].messages[0].status === 3) {
			this.props.updateUserStatus(false);
		}	
			
	}).catch(err => {
			console.log("Error while fetching welcome messages for WhenYouAreOnline ", err)

	    })
			
  	}


  	componentWillReceiveProps(nextProps) {
  		if(nextProps.showOnlinePrefs){
  			this.setState({
	    		showPrefs: true,
				upDownIcon: "icon-arrow-up icons font-2xl d-block text-right",
				
	    	})
  		}else{
  			this.setState({
	    		showPrefs: false,
	    		upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
	    	})
  		}
  	}

	

	

  	_deleteInAppMsg = (id) => {

  		if(id < 0){

  			this.setState((prevState) => {
  				return {
  					unknownMessageSections: prevState.unknownMessageSections.filter(message => message.id !== id),
  					unknownChatComponents: prevState.unknownChatComponents.filter(message => message.id !== id),
  					knownMessageSections: prevState.knownMessageSections.filter(message => message.id !== id),
  					knownChatComponents: prevState.knownChatComponents.filter(message => message.id !== id)
  				}
  			}, () => {
  				if(this.state.unknownMessageSections.length < 1){
  					this.setState({unknownMessageSections: [{id: -1, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} />}]})
  				}

  				if(this.state.knownMessageSections.length < 1){
  					this.setState({knownMessageSections: [{id: -101, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} />}]})
  				}
  			})

  		}else{
  			deleteInAppMsg(id).then(response =>{

  			this.setState((prevState) => {
  				return {
  					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.filter(message => message.id !== id),
  					unknownMessageSections: prevState.unknownMessageSections.filter(message => message.id !== id),
  					unknownChatComponents: prevState.unknownChatComponents.filter(message => message.id !== id),
  					knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.filter(message => message.id !== id),
  					knownMessageSections: prevState.knownMessageSections.filter(message => message.id !== id),
  					knownChatComponents: prevState.knownChatComponents.filter(message => message.id !== id)
  				}
  			}, () => {
  				if(this.state.unknownMessageSections.length < 1){
  					this.setState({unknownMessageSections: [{id: -1, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} />}]})
  				}

  				if(this.state.knownMessageSections.length < 1){
  					this.setState({knownMessageSections: [{id: -1, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} />}]})
  				}
  			})
  			if(response){
  				Notification.success('Successfully deleted');
  			}else {
  				Notification.warning('Not deleted');
  			}
  		})

  		}
  		
  	}

	methodToShowPrefs = (e) => {
	  	e.preventDefault();
	  	if(this.state.showPrefs) {
	  		this.setState({
	  			showPrefs: false,
	  			upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
	  		}, () => {this.props.toggleOnlinePrefs(false)})
	  	}else {
	  		this.setState({
	  			showPrefs: true,
	  			upDownIcon: "icon-arrow-up icons font-2xl d-block text-right"
	  		}, () => {this.props.toggleOnlinePrefs(true)})
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
		if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0 && this.state.unknownMessageSectionMsgs.length < 4 && (this.state.unknownMessageSectionMsgs.length === this.state.unknownMessageSections.length)){
			this.setState((prevState) => {
				const id = -1 * prevState.unknownMessageSections.length
				return {unknownMessageSections: prevState.unknownMessageSections.concat([{id: id, component: <MessageSection showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} deleteInAppMsg={() => {this._deleteInAppMsg(id)}} />}])}
			});
		}else if(this.state.unknownMessageSections.length > 2){
      		Notification.warning('Limit of 3 in app messages reached');
    	}
	}

	known_addMessageSection = (e) => {
		e.preventDefault();
		if(this.state.knownMessageSections.length < 3 && this.state.knownMessageSectionMsgs.length > 0 && this.state.knownMessageSectionMsgs.length < 4 && (this.state.knownMessageSectionMsgs.length === this.state.knownMessageSections.length)){
			this.setState((prevState) => {
				const id = -1 * prevState.unknownMessageSections.length - 100
				return {knownMessageSections: prevState.knownMessageSections.concat([{id: id, component: <MessageSection showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} deleteInAppMsg={() => {this._deleteInAppMsg(id)}} />}])}
			});
		}else if(this.state.knownMessageSections.length > 2){
      		Notification.warning('Limit of 3 in app messages reached');
    	}
	}

	addLeadGenerationTemplate = (e) => {
		e.preventDefault();
		if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0){
			this.setState((prevState) => {
				return {
					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat(["Lead Generation template"]),
					unknownMessageSections: prevState.unknownMessageSections.concat([{component: <LeadGenerationTemplate showDeleteBtn={true} />}]),
					unknownChatComponents: prevState.unknownChatComponents.concat([{component: <LeadGenerationTemplate showDeleteBtn={false} />}])
				}
			}, () => {

				const metadata = {
					"msg_type": "INPUT",
					"scroll": "HORIZONTAL",
					"hidden": false,
					"payload": "[{\"title\":\"Submit\", \"hidden\":false, \"type\":\"input\"} ]"
				}

				let data = {
					eventId: 3,
					message: "Please enter the details...",
					status: 1,
					category: 1,
					sequence: this.state.unknownMessageSectionMsgs.length,
					metadata: metadata
				}

				this._callApiCreateInAppMsg(data)

			});
		}
	}

	addMessageToChatPreview = (eventId, status) => {

		if(this.state.unknownMessage.trim().length <= 0){
			Notification.warning('Please enter a message.');
		}else if(this.state.unknownMessageSectionMsgs.length < 3 && this.state.unknownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([this.state.unknownMessage]),
					unknownChatComponents: prevState.unknownChatComponents.concat([{component: <p dangerouslySetInnerHTML={{__html: this.state.unknownMessage}} style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}></p>}])
				}
			}, () => {

				let data = {
					eventId: eventId,
					message: this.state.unknownMessage,
					status: status,
					category: 1,
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

		if(this.state.knownMessage.trim().length <= 0){
			Notification.warning('Please enter a message.');
		}else if(this.state.knownMessageSectionMsgs.length < 3 && this.state.knownMessage.trim().length > 0){

			this.setState((prevState) => {
				return {
					knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.concat([this.state.knownMessage]),
					knownChatComponents: prevState.knownChatComponents.concat([{component: <p dangerouslySetInnerHTML={{__html: this.state.knownMessage}} style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}></p>}])
				}
			}, () => {

				let data = {
					eventId: eventId,
					message: this.state.knownMessage,
					status: status,
					category: 1,
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
				<div className={
	        this.state.showPrefs === true
	          ? null
	          : "n-vis"
	    		}
	        style={{ marginLeft: "0" }}>
	        <div className="form-group row">
	        	<div className="col-5">
	        	</div>
	        	<div className="col-7">
							<h3 className="welcome-preview text-left" style={{ display: "none" }}>Preview:</h3>
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
		            {
		           	// <ChatPreview chatPreviewComponents={this.state.unknownChatComponents}/>
		            }
	        	</div>
	        </div>
	        <div className="form-group row">
	        	<div className="col-4">
	        		<button className="welcome-buttons mb-2" onClick={this.addMessageSection}>Add another message</button>
	        		{
	        			// <button className="welcome-buttons" onClick={this.addLeadGenerationTemplate}>Add lead generation template</button>
	        		}
	        	</div>
	        </div>
	        <div className="form-group row">
		        <div className="col-5">
							<span style={{ display: "none" }} className={this.state.unknownMessageSectionMsgs.length < 2 ? null : "n-vis"}><strong>Tip:</strong> You can use the lead generation template to collect customer contact information</span>
							<span className={this.state.unknownMessageSectionMsgs.length >= 2 ? null : "n-vis"}> You can only show a maximum of 3 welcomemessages. </span>
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
							{/* {messagefield} */}
	        		{this.state.knownMessageSections.map((knownMessageSection, i) => (<div key={i}>{knownMessageSection.component}</div>))}
	        	</div>
	        	<div className="col-4">
	        		{
		            // <ChatPreview chatPreviewComponents={this.state.knownChatComponents}/>
	        		}
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