import React, { Component } from 'react';

import ChatPreview from './ChatPreview';
import UserPopover from './UserPopover';

import MessageSection from './MessageSection';
import LeadGenerationTemplate from './LeadGenerationTemplate';

import {addInAppMsg, getInAppMessagesByEventId, deleteInAppMsg} from '../../../utils/kommunicateClient'
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
    unknownMessageSections: [],
    // unknownMessageSections: [{component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} />}],
    unknownMessageSectionMsgs: [],
    unknownMessage: '',
  }

  knownUser = {
    knownChatComponents: [],
    knownMessageSections: [],
    // knownMessageSections: [{component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} />}],
    knownMessageSectionMsgs: [],
    knownMessage: '',
  }

	state = {
    ...this.unknownUser,
    ...this.knownUser,
		showOfflinePrefs: this.props.showOfflinePrefs,
		upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
	}

  componentDidMount(){

    // eventId id 1 when agent is offline and user is anonymous
    getInAppMessagesByEventId(1).then(response => {
      console.log(response)

      if(response instanceof Array && response.length < 1){
        this.setState({unknownMessageSections: [{id: null, component: <MessageSection id={null} showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} />}]})
      }

      response.map(message => {
        if(message.status === 1 && message.metadata === null){
          this.setState(prevState =>{
            return {
              unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat([message.message]),
              unknownChatComponents: prevState.unknownChatComponents.concat([{id: message.id, component: <p dangerouslySetInnerHTML={{__html: message.message}} style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}></p>}])
            }
          }, () => {
              if(this.state.unknownMessageSections.length < 1){
                this.setState((prevState) => {
                  let messageId = message.id
                  return {unknownMessageSections: prevState.unknownMessageSections.concat([{id: message.id, component: <MessageSection id={message.id} editInAppMsg={true} showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}}/>}])}
                })
              }else{
                this.setState((prevState) => {
                  let messageId = message.id
                  return {unknownMessageSections: prevState.unknownMessageSections.concat([{id: message.id, component: <MessageSection id={message.id} editInAppMsg={true} showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}}/>}])}
                })
              }
            })
        }else if(message.status === 1 && message.metadata !== null){
          this.setState(prevState =>{
            let messageId = message.id
            return {
              unknownMessageSectionMsgs: prevState.unknownMessageSectionMsgs.concat(["Lead Generation template added"]),
              unknownMessageSections: prevState.unknownMessageSections.concat([{id: message.id, component: <LeadGenerationTemplate showDeleteBtn={true} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}} />}]),
              unknownChatComponents: prevState.unknownChatComponents.concat([{id: message.id, component: <LeadGenerationTemplate showDeleteBtn={false} />}])
            }
          })
        }
      }, () =>{
        if(this.state.unknownMessageSections.length < 1){
          this.setState({unknownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} />}]})
        }
      })

      if(this.state.unknownMessageSections.length < 1){
        this.setState({unknownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}} />}]})
      }

    })

    // eventId id 2 when agent is offline and user is known
    getInAppMessagesByEventId(2).then(response => {
      console.log(response)
      if(response instanceof Array && response.length < 1){
        this.setState({knownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} />}]})
      }
      response.map(message => {
        if(message.status === 1){
          this.setState(prevState =>{
            return {
              knownMessageSectionMsgs: prevState.knownMessageSectionMsgs.concat([message.message]),
              knownChatComponents: prevState.knownChatComponents.concat([{id: message.id, component: <p dangerouslySetInnerHTML={{__html: message.message}} style={{width: "70%", margin: "5px", backgroundColor: "#5c5aa7", color: "#fff", border: "1px solid black", borderRadius: "3px", padding: "3px"}}></p>}])
            }
          }, () => {
            if(this.state.knownMessageSections.length < 1){
              this.setState((prevState) => {
                let messageId = message.id
                return {knownMessageSections: prevState.knownMessageSections.concat([{id: message.id, component: <MessageSection id={message.id} editInAppMsg={true} showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}}/>}])}
              });
            }else{
              this.setState((prevState) => {
                let messageId = message.id
                return {knownMessageSections: prevState.knownMessageSections.concat([{id: message.id, component: <MessageSection id={message.id} editInAppMsg={true} showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} messageValue={message.message} deleteInAppMsg={() => {this._deleteInAppMsg(messageId)}}/>}])}
              });
            }
              
          })
        }
      }, () => {
        if(this.state.knownMessageSections.length < 1){
          this.setState({knownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} />}]})
        }
      })

      if(this.state.knownMessageSections.length < 1){
          this.setState({knownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}} />}]})
      }

    })
  }

  componentWillReceiveProps(nextProps) {
      if(nextProps.showOfflinePrefs){
        this.setState({
          showOfflinePrefs: true,
          upDownIcon: "icon-arrow-up icons font-2xl d-block text-right"
        })
      }else{
        this.setState({
          showOfflinePrefs: false,
          upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
        })
      }
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
        }, () => {
          if(this.state.unknownMessageSections.length < 1){
            this.setState({unknownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(3, 1)}} />}]})
          }

          if(this.state.knownMessageSections.length < 1){
            this.setState({knownMessageSections: [{id: null, component: <MessageSection showDeleteBtn={false} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(4, 1)}} />}]})
          }
        })
        if(response){
          Notification.success('Successfully deleted');
        }else {
          Notification.danger('Not deleted');
        }
      })
    }

  methodToShowOfflinePrefs = (e) => {
  	e.preventDefault();
  	if(this.state.showOfflinePrefs){
  		this.setState({
  			showOfflinePrefs: false,
  			upDownIcon: "icon-arrow-down icons font-2xl d-block text-right"
  		}, () => {this.props.toggleOfflinePrefs(false)})
  	}else{
  		this.setState({
  			showOfflinePrefs: true,
  			upDownIcon: "icon-arrow-up icons font-2xl d-block text-right"
  		}, () => {this.props.toggleOfflinePrefs(true)})
  	}
  }

  _callApiCreateInAppMsg = (data) => {

    addInAppMsg(data)
          .then(response => {
            this.setState({unknownMessage: ''})
            this.setState({knownMessage: ''})
            if(response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created'){
                  Notification.success('In app message saved successfully');
                }else if(response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached'){
                  Notification.warning('Not created, limit of 3 in app messages reached');  
                }else{
                  Notification.error('In app message not saved.');
                }
              })
  }

  addMessageSection = (e) => {
    e.preventDefault();
    if(this.state.unknownMessageSections.length < 3 && this.state.unknownMessageSectionMsgs.length > 0){
      this.setState((prevState) => {
        return {unknownMessageSections: prevState.unknownMessageSections.concat([{component: <MessageSection showDeleteBtn={true} getMessage={this.getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.addMessageToChatPreview(1, 1)}}/>}])}
      });
    }else if(this.state.unknownMessageSections.length > 2){
      Notification.warning('Limit of 3 in app messages reached');
    }
  }

  known_addMessageSection = (e) => {
    e.preventDefault();
    console.log("known_addMessageSection");
    if(this.state.knownMessageSections.length < 3 && this.state.knownMessageSectionMsgs.length > 0){
      this.setState((prevState) => {
        return {knownMessageSections: prevState.knownMessageSections.concat([{component: <MessageSection showDeleteBtn={true} getMessage={this.known_getMessageFunc.bind(this)} addMessageToChatPreview={() => {this.known_addMessageToChatPreview(2, 1)}}/>}])}
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
          eventId: 1,
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
      Notification.warning('Not able to create message.');
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
      Notification.warning('Not able to create message.');
    }
  }

	render(){
		return (
      <div className="cursor-is-pointer">
        <div className="row" onClick={this.methodToShowOfflinePrefs}>
          <div className="col-5">
            <h4 className="when-you-are-online-heading"> When you are offline <span className="offline-indicator"></span></h4>
            <p className="ask-your-user-to">Ask your user to leave a message so that you can get back to them later</p>
          </div>
          <div className="col-5" >
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
            <div className="col-5">
            </div>
            <div className="col-7">
              <h3 className="welcome-preview text-left"  style={{display: "none"}}>Preview:</h3>
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
              <span style={{display: "none"}} className={this.state.unknownMessageSectionMsgs.length < 2 ? null:"n-vis"} ><strong>Tip:</strong> You can use the lead generation template to collect customer contact information</span>
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

export default WhenYouAreOffline;