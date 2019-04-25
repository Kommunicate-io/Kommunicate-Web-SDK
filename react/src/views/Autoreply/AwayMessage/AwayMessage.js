import React, { Component } from 'react'
import validator from 'validator';
import ReactTooltip from 'react-tooltip'
import './AwayMessage.css';
import { EVENT_ID, CATEGORY, STATUS, SEQUENCE, WELCOME_MSG_METADATA } from '../Constant'
import SliderToggle from '../../../components/SliderToggle/SliderToggle';
import Notification from '../../model/Notification';
import { addInAppMsg, deleteInAppMsg, editInAppMsg, disableInAppMsgs, enableInAppMsgs,getInAppMessagesByEventId,updateAppSetting, getAppSetting }  from '../../../utils/kommunicateClient'
import Checkbox from '../../../components/Checkbox/Checkbox';
import AnalyticsTracking from '../../../utils/AnalyticsTracking';
import {SettingsHeader} from '../../../../src/components/SettingsComponent/SettingsComponents';
import Button from '../../../components/Buttons/Button';
import {LiveChatWidget} from '../../../components/LiveChatWidget/LiveChatWidget'



class AwayMessage extends Component{
  constructor(props){
    super(props);
    this.state = {
     isChecked: false,
     switchIsEnabled: true,
     status:STATUS.ENABLE,
     awayMessageKnownCustomers:[{messageField:''}],
     awayMessageAnonymousCustomers:[{messageField:''}],
     awayMessageCopyKnownCustomers:[{messageField:''}],
     awayMessageCopyAnonymousCustomers:[{messageField:''}],
     liveAwayMessage:"",
     enableAddMsgLink: false,
     activeTextField: -1,
     disableButtonForKnownTextArea:true,
     disableButtonForAnonymousTextArea:true,
    };
    
  }
  componentDidMount(){
       this.getAwayMessages();
       this.getStatusOfCollectEmailID();       
  }
  getStatusOfCollectEmailID = () => {
   return Promise.resolve(getAppSetting().then(response => {
      if(response.status == 200) {
        response.data.response.collectEmailOnAwayMessage && this.setState({isChecked:true});
        response.data.response.collectEmailOnAwayMessage == false && this.setState({isChecked:false});
      }
    })).catch(err => {
      // console.log(err);
    })
  }
  getAwayMessages = () => {
     // Event ID 1 : agent is offline and anonymous customer
     //Event ID 2 : agent is offline and customer is known   
    let eventIds = [1, 2];
    let eventId2Messages = [];
    let eventId1Messages =[];
    let awayMessageKnownCustomers = [];
    let awayMessageCopyKnownCustomers = [];
    let awayMessageAnonymousCustomers = [];
    let awayMessageCopyAnonymousCustomers =[];
      return Promise.resolve(getInAppMessagesByEventId(eventIds)).then(response => {
        // eventId id 2 when agent is offline and customer is known
        if (response) {
          eventId1Messages = response.filter(function (msg) {
            return msg.eventId == 1;
          });
          eventId2Messages = response.filter(function (msg) {
            return msg.eventId == 2;
          });
          
          eventId2Messages.map(item => {
            awayMessageKnownCustomers.push({
              messageField: item.message,
              messageId: item.id,
              status: item.status
          })
            awayMessageCopyKnownCustomers.push({
              messageField: item.message,
              messageId: item.id,
              status: item.status
           })
          this.setState({
              awayMessageKnownCustomers: awayMessageKnownCustomers,
              awayMessageCopyKnownCustomers: awayMessageCopyKnownCustomers,
            }, this.updateUserStatus);
          })
          
          // eventId id 1 when agent is offline and user is anonymous customer
          eventId1Messages.map(item => {
            awayMessageAnonymousCustomers.push({
                messageField: item.message,
                messageId: item.id,
                status: item.status
            })
            awayMessageCopyAnonymousCustomers.push({
                messageField: item.message,
                messageId: item.id,
                      status: item.status
            })
            this.setState({
                awayMessageAnonymousCustomers: awayMessageAnonymousCustomers,
                awayMessageCopyAnonymousCustomers: awayMessageCopyAnonymousCustomers
              },this.updateUserStatus);
  
            })     
        }

      }).catch(err => {
          console.log("Error while fetching away message", err);
      })
      
  }
  handleToggleSwitch = () => {

    // make api call to disable all rows in in_app_msgs where createdBy = user.id 
    this.setState({switchIsEnabled: !this.state.switchIsEnabled}, () => {
      if(this.state.switchIsEnabled) {
        //enable category 2 messages, category 2 is away message
        //changing the status 2 to 1 for all category 2 messages
        enableInAppMsgs({category: 2}).then(result => {
          if(result !== undefined){
            Notification.success('Away Mesages Enabled');
            this.setState({status: 1});
          }
        })
      }else{
        //disable category 2 messages
        //changing the status 1 to 2 for all category 2 messages
        disableInAppMsgs({category: 2}).then(result => {
          if(result !== undefined){
            Notification.error('Away Messages Disabled');
            this.setState({status: 2})
          }
        })
      }
    }) 
  } 
  updateUserStatus =() =>{
    if(this.state.awayMessageKnownCustomers[0].status === 1 || this.state.awayMessageAnonymousCustomers[0].status === 1){
      this.setState({
        switchIsEnabled: true,
        status:1,
      })
    }
    else{
      this.setState({
        switchIsEnabled: false,
        status:2
      })
    }

    this.setState({
      liveAwayMessage : this.state.awayMessageAnonymousCustomers[0].messageField ? this.state.awayMessageAnonymousCustomers[0].messageField : this.state.awayMessageKnownCustomers[0].messageField
    })
    
  }

  //Methods for Known customers(EventId id 2 )

  awayMessageKnownCustomersMethod = () => {
    let index = this.state.activeTextField;
    if (this.state.awayMessageKnownCustomers[index] && this.state.awayMessageKnownCustomers[index].messageId) {
      this.updateAwayMessageKnownCustomers(index);
    } else {
      this.createAwayMessageKnownCustomers(index);
    }
    AnalyticsTracking.acEventTrigger('ac-away-message');
  }
  updateAwayMessageKnownCustomers = (index) => {
    let awayMessageKnownCustomers = Object.assign([], this.state.awayMessageKnownCustomers);
    let id = awayMessageKnownCustomers[index].messageId;
    let message = awayMessageKnownCustomers[index].messageField;
    if (validator.isEmpty(message)){
      this.deleteAwayMessageKnownCustomers();
    }else {
      editInAppMsg (id,message).then(response =>{
        if (response) {
          Notification.success('Away message is updated for known customers');
          this.getAwayMessages();
        } else {
          Notification.warning('There was a problem while updating away message');
        }
      }).catch(err => {
        console.log("Error while updating away message", err)
      })
    }
    
  }
  deleteAwayMessageKnownCustomers = () => {
    let index = this.state.activeTextField;
    let awayMessageKnownCustomers = Object.assign([], this.state.awayMessageKnownCustomers);
    let awayMessageCopyKnownCustomers = Object.assign([], this.state.awayMessageCopyKnownCustomers);
    let id = awayMessageKnownCustomers[index].messageId;
    if (id !== '') {
      deleteInAppMsg(id).then(response => {
        if (response) {
          Notification.success('Away message deleted successfully');
          this.getAwayMessages()
        } else {
          Notification.warning('There was a problem while deleting away message');
        }
      }).catch(err => {
        console.log("Error while deleting away message", err)
      })
    } else {
        Notification.warning('Message field is empty!!');
    }
    if(index == 0){
      awayMessageKnownCustomers.splice(0,1,{ messageField : '' })
      awayMessageCopyKnownCustomers.splice(0,1,{ messageField : '' })
      this.setState({
        awayMessageKnownCustomers: awayMessageKnownCustomers,
        awayMessageCopyKnownCustomers:awayMessageCopyKnownCustomers
      })
    }
  }
  createAwayMessageKnownCustomers = (index) => {
    let data = {
      eventId: EVENT_ID.KNOWN_CUSTOMER_AWAY_MSG, //eventId id 2 when agent is offline and user is known
      message: this.state.awayMessageKnownCustomers[index].messageField,
      status: this.state.status, // disable(2) : intially away message disabled 
      category: CATEGORY.AWAY_MESSAGE, //disabling and enabling away message based on category, away message category is 2 
      sequence: SEQUENCE.AWAY_MESSAGE, //sequence is for order for showing away message
      metadata: WELCOME_MSG_METADATA
    }
    addInAppMsg(data)
      .then(response => {
        if (response !== undefined && response.status === 200) {
          if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created') {
            Notification.success('Away message created successfully for known customers');
            this.getAwayMessages();
          } else if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached') {
            Notification.warning('Not created, limit of 3 in app messages reached');
          } else {
            Notification.error('There was a problem while creating away message.');
          }
        }
      })

  }
  discardAwayMessageKnownCustomers = () => {
    let index = this.state.activeTextField;
    let awayMessageKnownCustomers = Object.assign([], this.state.awayMessageKnownCustomers);
    
    awayMessageKnownCustomers[index] = Object.assign([], this.state.awayMessageCopyKnownCustomers[index]);
      this.setState({ 
        awayMessageKnownCustomers: awayMessageKnownCustomers,
      })
      
  }
  
  //--End here-- Methods for Known customers
  //Methods for  Anonymous customers (EventId id 1)

  awayMessageAnonymousCustomersMethod = () => {
    let index = this.state.activeTextField;
    if (this.state.awayMessageAnonymousCustomers[index] && this.state.awayMessageAnonymousCustomers[index].messageId) {
      this.updateAwayMessageAnonymousCustomers(index);
    } else {
      this.createAwayMessageAnonymousCustomers(index);
    }
    AnalyticsTracking.acEventTrigger('ac-away-message');
  }
  updateAwayMessageAnonymousCustomers = (index) => {
    let awayMessageAnonymousCustomers = Object.assign([], this.state.awayMessageAnonymousCustomers);
    let id = awayMessageAnonymousCustomers[index].messageId;
    let message = awayMessageAnonymousCustomers[index].messageField;
    if (validator.isEmpty(message)){
      this.deleteAwayMessageAnonymousCustomers();
    }else {
      editInAppMsg (id,message).then(response =>{
        if (response) {
          Notification.success('Away message is updated for anonymous customers');
          this.getAwayMessages();
        } else {
          Notification.warning('There was a problem while updating away message');
        }
      }).catch(err => {
        console.log("Error while updating away message", err)
      })
    }
    
  }
  deleteAwayMessageAnonymousCustomers = () => {
    let index = this.state.activeTextField;
    let awayMessageAnonymousCustomers = Object.assign([], this.state.awayMessageAnonymousCustomers);
    let awayMessageCopyAnonymousCustomers = Object.assign([],this.state.awayMessageCopyAnonymousCustomers);
    let id = awayMessageAnonymousCustomers[index].messageId;
    if (id !== '') {
      deleteInAppMsg(id).then(response => {
        if (response) {
          Notification.success('Away message deleted successfully');
          this.getAwayMessages();
        } else {
          Notification.warning('There was a problem while deleting');
        }
      }).catch(err => {
        console.log("Error while deleting away message", err)
      })
    } else {
        Notification.warning('Message field is empty!!');
    }
    if(index == 0){
      awayMessageAnonymousCustomers.splice(0,1,{ messageField : '' })
      awayMessageCopyAnonymousCustomers.splice(0,1,{ messageField : '' })
      this.setState({
        awayMessageAnonymousCustomers: awayMessageAnonymousCustomers,
        awayMessageCopyAnonymousCustomers: awayMessageCopyAnonymousCustomers
      })
    }
  }
  createAwayMessageAnonymousCustomers = (index) => {
    let data = {
      eventId: EVENT_ID.ANONYMOUS_CUSTOMER_AWAY_MSG, //eventId id 1 when agent is offline and user is anonymous users
      message: this.state.awayMessageAnonymousCustomers[index].messageField,
      status: this.state.status, // disable:2 : intially away message disabled
      category: CATEGORY.AWAY_MESSAGE, //disabling and enabling away message based on category, away message category is 2
      sequence: SEQUENCE.AWAY_MESSAGE // sequence is for order for showing away message
    }
    addInAppMsg(data)
      .then(response => {
        if (response !== undefined && response.status === 200) {
          if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created') {
            Notification.success('Away Message created successfully for anonymous users ');
            this.getAwayMessages();
          } else if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached') {
            Notification.warning('Not created, limit of 3 in app messages reached');
          } else {
            Notification.error('There was a problem while creating away message for anonymous users.');
          }
        }
      })

  }
  discardAwayMessageAnonymousCustomers = () => {
    let index = this.state.activeTextField;
    let awayMessageAnonymousCustomers = Object.assign([], this.state.awayMessageAnonymousCustomers);
    awayMessageAnonymousCustomers[index] = Object.assign([], this.state.awayMessageCopyAnonymousCustomers[index]);
    this.setState({
        awayMessageAnonymousCustomers: awayMessageAnonymousCustomers,
    })
      
  }
  toggleChangeCheckbox = () => {
    let isChecked = !this.state.isChecked
    this.setState({
      isChecked: isChecked,
    });
    let data = { "collectEmailOnAwayMessage": isChecked }
    updateAppSetting(data).then(response => {
      // console.log(response);
    }).catch(err => {
      // console.log(err);
      console.log("Error while updating application settings", err)
    })
  }
  

  //--End here-- Methods for Anonymous customers
  render() {
    //known customers
    const textAreaForKnownCustomersMsg = this.state.awayMessageKnownCustomers.map((message, index) => {
      return <div key = {index}>
        <div className = "row away-text-area-wrapper">
          <textarea  rows="5" cols="60" className ="away-msg-text-area" placeholder="Example: Hi, please leave a message and I will get back to you as soon as possible."
           value={this.state.awayMessageKnownCustomers[index].messageField}
            onChange={(e) => {
              let awayMessageKnownCustomers = Object.assign([],this.state.awayMessageKnownCustomers);
              awayMessageKnownCustomers[index].messageField = e.target.value;
              this.setState({
                awayMessageKnownCustomers:awayMessageKnownCustomers,
                liveAwayMessage:awayMessageKnownCustomers[index].messageField,
                disableButtonForKnownTextArea:false
              })
            }}
            onFocus ={(e) =>{ 
              this.setState({activeTextField: index}) 
            } }>
          </textarea>
      </div>
    </div>  
    });
    //Anonymous customers
    const textAreaForAnonymousCustomersMsg = this.state.awayMessageAnonymousCustomers.map((message, index) => {
        return <div key = {index}>
          <div className = "row away-text-area-wrapper">
            <textarea  rows="5" cols="60" className ="away-msg-text-area" placeholder="Example: Hi, please leave your email ID and your message and I will get back to you as soon as possible."
             value={this.state.awayMessageAnonymousCustomers[index].messageField}
              onChange={(e) => {
                let awayMessageAnonymousCustomers = Object.assign([],this.state.awayMessageAnonymousCustomers);
                awayMessageAnonymousCustomers[index].messageField = e.target.value;
                this.setState({
                  awayMessageAnonymousCustomers:awayMessageAnonymousCustomers,
                  liveAwayMessage:awayMessageAnonymousCustomers[index].messageField,
                  disableButtonForAnonymousTextArea:false
                })
              }}
              onFocus ={(e) =>{ 
                this.setState({activeTextField: index}) 
              } }>
            </textarea>
        </div>
      </div>  
      });
    return (
      <div className="away-message-wrapper animated fadeIn">
            <SettingsHeader />

        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="away-message-header">
              <div className="row">
                <h4 className="away-message-title">Show away message to users </h4>
                <SliderToggle checked={this.state.switchIsEnabled} handleOnChange={this.handleToggleSwitch} />
              </div>
            </div>
          </div>
        </div>
        <div className="away-message-row">
          <div className="away-message-textboxes">
        {/* Anonymous customers container */}
                <div className="away-message-anonymous-customers-wrapper">
                  <div className="row">
                    <h5 className="customers-message-title">Away Message for<span className="customer-type"> anonymous </span>users
                    <span className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" style={{
                            verticalAlign: "bottom",
                            marginLeft: "8px",
                            marginBottom: "2px"
                          }} data-tip="This away message will be shown to users whose contact details are not available with you" data-effect="solid" data-place="right" data-multiline="True">
                          <g fill="#514E4E" fillRule="nonzero">
                            <path d="M6.6.073c-.014-.002-.026 0-.04 0C2.983.094.073 2.975.073 6.5c0 3.525 2.914 6.409 6.494 6.426a.56.56 0 0 0 .035.002l.001-.002c3.489-.017 6.326-2.9 6.326-6.426 0-3.525-2.837-6.41-6.329-6.427zm.003 12.098l-.03-.001C3.404 12.155.827 9.61.827 6.5S3.405.845 6.598.83c3.073.015 5.574 2.56 5.574 5.67 0 3.108-2.498 5.652-5.569 5.671z"/>
                            <path d="M6.485 5.38H5.84v4.317h1.32V5.38zM6.509 3.306v-.003l-.004-.001-.008.001-.006-.001v.003c-.399.007-.643.29-.651.659 0 .354.246.64.651.656v.004h.012l.003-.001.003.001v-.001a.636.636 0 0 0 .651-.66c0-.366-.257-.646-.651-.657z"/>
                          </g>
                        </svg>
                    </span></h5>
                  </div>
                  <div className="row away-msg-collect-email-checkbox">
                    <Checkbox idCheckbox={'away-msg-collect-email-checkbox'} label={'Collect email ID from user'}
                    checked = {this.state.isChecked} handleOnChange = {this.toggleChangeCheckbox} />
                  </div>
                  {textAreaForAnonymousCustomersMsg}                  
                </div>            
                <div className="btn-group">
                  <Button primary disabled={this.state.disableButtonForAnonymousTextArea} className="save-changes-btn"
                    onClick={(e) => {
                      this.setState({
                        disableButtonForAnonymousTextArea: true,
                        liveAwayMessage : ""
                      }, this.awayMessageAnonymousCustomersMethod)
                    }} >Save</Button>
                  <Button secondary disabled = {this.state.disableButtonForAnonymousTextArea} className="discard-btn" 
                    onClick={(e) => {
                        this.setState({
                          disableButtonForAnonymousTextArea: true,
                          liveAwayMessage : ""
                        },this.discardAwayMessageAnonymousCustomers)
                    }}>Discard</Button>
                </div>
        {/* Anonymous customers container end here */}
        {/* known customers container */}
                <div className="away-message-known-customers-wrapper">
                  <div className="row">
                    <h5 className="customers-message-title">Away Message for<span className="customer-type"> known </span>users
                    <span className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" style={{
                            verticalAlign: "bottom",
                            marginLeft: "8px",
                            marginBottom: "2px"
                          }} data-tip="This away message will be shown to users whose contact details are already available with you" data-effect="solid" data-place="right" data-multiline="True">
                          <g fill="#514E4E" fillRule="nonzero">
                            <path d="M6.6.073c-.014-.002-.026 0-.04 0C2.983.094.073 2.975.073 6.5c0 3.525 2.914 6.409 6.494 6.426a.56.56 0 0 0 .035.002l.001-.002c3.489-.017 6.326-2.9 6.326-6.426 0-3.525-2.837-6.41-6.329-6.427zm.003 12.098l-.03-.001C3.404 12.155.827 9.61.827 6.5S3.405.845 6.598.83c3.073.015 5.574 2.56 5.574 5.67 0 3.108-2.498 5.652-5.569 5.671z"/>
                            <path d="M6.485 5.38H5.84v4.317h1.32V5.38zM6.509 3.306v-.003l-.004-.001-.008.001-.006-.001v.003c-.399.007-.643.29-.651.659 0 .354.246.64.651.656v.004h.012l.003-.001.003.001v-.001a.636.636 0 0 0 .651-.66c0-.366-.257-.646-.651-.657z"/>
                          </g>
                        </svg>
                    </span></h5>
                  </div>
                  {textAreaForKnownCustomersMsg}                  
                </div>            
                <div className="btn-group">
                  <Button primary disabled={this.state.disableButtonForKnownTextArea} className="save-changes-btn"
                    onClick={(e) => {
                      this.setState({
                        disableButtonForKnownTextArea: true
                      }, this.awayMessageKnownCustomersMethod)
                    }} >Save</Button>
                  <Button secondary disabled = {this.state.disableButtonForKnownTextArea} className="discard-btn" 
                    onClick={(e) => {
                        this.setState({
                        disableButtonForKnownTextArea: true
                        },this.discardAwayMessageKnownCustomers)
                    }}>Discard</Button>
                </div>
        {/* known customers container ends here */}</div>
          <div className="away-message-preview">
            <LiveChatWidget
              hasTextBox={true}
              hasAwayMessage={true}
              awayMessage={this.state.liveAwayMessage || this.props.awayMessage}
              hasSecondMessage={false}
              hideChatIcon={true}
              status={"Offline"}
            />  
          </div>
        </div>
        
        <ReactTooltip />
      </div>

    )
  }
}

export default AwayMessage;
