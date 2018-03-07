import React, { Component } from 'react'
import validator from 'validator';
import './Welcome.css';
import { EVENT_ID, CATEGORY, STATUS, WELCOME_MSG_METADATA } from '../Constant'
import SliderToggle from '../../../components/SliderToggle/SliderToggle';
import Notification from '../../model/Notification';
import { addInAppMsg, deleteInAppMsg, getAllSuggestions, getSuggestionsByAppId, createSuggestions, editInAppMsg, getWelcomeMessge, disableInAppMsgs, enableInAppMsgs,getInAppMessagesByEventId }  from '../../../utils/kommunicateClient'
import axios from 'axios';

class Welcome extends Component{
  constructor(props){
    super(props);
    this.state = {
     enableDisableCheckbox: true,
     status:STATUS.ENABLE,
     welcomeMessages:[{messageField:''}],
     welcomeMessagesCopy:[],
     enableAddMsgLink: false,
     activeTextField: -1,
     disableButton:true,
     hideTrashBtn:[false, false]
    };
    
  }

  componentDidMount(){
       this.getWelcomeMessges();
  }
  getWelcomeMessges = () => {
    let eventIds = [3]; // Event ID 3 for welcome message
    let welcomeMessages = [];
    let welcomeMessagesCopy = [];
    let  hideTrashBtn = Object.assign([],this.state.hideTrashBtn)
    hideTrashBtn.splice(0,2,false,false);
    return Promise.resolve(getInAppMessagesByEventId(eventIds)).then(response => {
      response.map(item => {
        welcomeMessages.push({
          messageField: item.message,
          messageId: item.id,
          status: item.status
        })
        welcomeMessagesCopy.push({
          messageField: item.message,
          messageId: item.id,
          status: item.status
        })
        this.setState({
          welcomeMessages: welcomeMessages,
          welcomeMessagesCopy: welcomeMessagesCopy,
          hideTrashBtn: hideTrashBtn
        }, this.updateUserStatus);

      })
    }).catch(err => {
      console.log("error while fetching welcome message", err);
    })
  }
  handleCheckboxChange = () => {

    // make api call to disable all rows in in_app_msgs where createdBy = user.id 
    this.setState({enableDisableCheckbox: !this.state.enableDisableCheckbox}, () => {
      if(this.state.enableDisableCheckbox) {
        enableInAppMsgs({category: 1}).then(result => {
          //enable category 1 messages, category 1 is welcome message
          //changing the status 2 to 1 for all category 1 messages
          if(result !== undefined){
            Notification.success('Welcome Mesages Enabled')
            this.setState({status: 1})
          }
        })
      }else{
        //disable category 1 messages
        //changing the status 1 to 2 for all category 1 messages
        disableInAppMsgs({category: 1}).then(result => {
          if(result !== undefined){
            Notification.error('Welcome Messages Disabled')
            this.setState({status: 2})
          }
        })
      }
    }) 
  }
  updateUserStatus =() =>{
    if(this.state.welcomeMessages[0].status === 1){
      this.setState({
        enableDisableCheckbox: true,
        status: 1
      })
    }
    else{
      this.setState({
        enableDisableCheckbox: false,
        status: 2
      })
    }
    
  }
  welcomeMessagesMethod = () => {
    let index = this.state.activeTextField;
    if (this.state.welcomeMessages[index] && this.state.welcomeMessages[index].messageId) {
      this.updateWelcomeMessage(index);
    } else {
      this.createWelcomeMessage(index);
    }
  }
  updateWelcomeMessage = (index) => {
    let welcomeMessages = Object.assign([], this.state.welcomeMessages);
    let id = welcomeMessages[index].messageId;
    let message = welcomeMessages[index].messageField;
    if (validator.isEmpty(message)){
      this.deleteWelcomeMessage();
    }else {
      editInAppMsg (id,message).then(response =>{
        if (response) {
          Notification.success('Welcome Message Updated');
          this.getWelcomeMessges();
          this.setState({disableButton: true})
        } else {
          Notification.warning('There was a problem while updating welcome message');
        }
      }).catch(err => {
        console.log("Error while updating welcome message", err)
      })
    }
    
  }
  deleteWelcomeMessage = () => {
    let index = this.state.activeTextField;
    let welcomeMessages = Object.assign([], this.state.welcomeMessages);
    let welcomeMessagesCopy = Object.assign([],this.state.welcomeMessagesCopy);
    let id = welcomeMessages[index].messageId;
    if (id !== '') {
      deleteInAppMsg(id).then(response => {
        if (response) {
          Notification.success('Welcome message deleted');
          this.getWelcomeMessges()
          this.setState({
            disableButton: true,
          })
        } else {
          Notification.warning('There was a problem while deleting');
        }
      }).catch(err => {
        console.log("Error while deleting welcome message", err)
      })
    } else {
      welcomeMessages.splice(index, 1)
      this.setState({ welcomeMessages: welcomeMessages })
    }
    if(index == 0){
      welcomeMessages.splice(0,1,{ messageField : '' })
      welcomeMessagesCopy.splice(0,1,{ messageField : '' })
      this.setState({
        welcomeMessages:welcomeMessages,
        welcomeMessagesCopy:welcomeMessagesCopy
      })
    }
  }
  createWelcomeMessage = (index) => {
    let data = {
      eventId: EVENT_ID.WELCOME_MESSAGE, // Event ID 3 for welcome message
      message: this.state.welcomeMessages[index].messageField,
      status: this.state.status, // disabled intially
      category: CATEGORY.WELCOME_MESSAGE, // disabling and enabling welcome message based on category,for welcome category is 1
      sequence: index+1,  //sequence is an order, to display welcome message. user can create 3 different welcome messages 
      metadata: WELCOME_MSG_METADATA
    }
    addInAppMsg(data)
      .then(response => {
        if (response !== undefined && response.status === 200) {
          if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created') {
            Notification.success('Welcome Message Created Successfully');
            this.getWelcomeMessges();
          } else if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached') {
            Notification.warning('Not created, limit of 3 in app messages reached');
          } else {
            Notification.error('There was a problem while creating welcome message.');
          }
        }
      })

  }
  discardWelcomeMessage = () => {
    let index = this.state.activeTextField;
    let welcomeMessages = Object.assign([], this.state.welcomeMessages);
    if(this.state.welcomeMessages.length > this.state.welcomeMessagesCopy.length){
			welcomeMessages.splice(index, 1);
			this.setState({
        welcomeMessages: welcomeMessages,
        disableButton: true
			})
    } else {
      welcomeMessages[index] = Object.assign([], this.state.welcomeMessagesCopy[index]);
      this.setState({ 
        welcomeMessages: welcomeMessages,
        disableButton: true 
      })
    }   
  }
  appendMessageTextArea = () => {
    if (this.state.welcomeMessages[this.state.welcomeMessages.length-1].messageField !== '' && this.state.welcomeMessages.length < 3) {
      
      if (this.state.welcomeMessages.length == this.state.welcomeMessagesCopy.length) {
        let  hideTrashBtn = Object.assign([],this.state.hideTrashBtn)
        hideTrashBtn.splice(0,2,false,false);
        let message = Object.assign([], this.state.welcomeMessages);
        let fields = {
          messageField: '',
          messageId: ''
        }
        message.push(fields);
        this.setState({
          welcomeMessages: message,
          hideTrashBtn:hideTrashBtn
        })
      }
      else {
        Notification.warning("Please Save Your Changes");
      }
      
    }
  }
  
  render() {
    const welcomeMsgTextArea = this.state.welcomeMessages.map((message, index) => {
      return <div key = {index}>
        <div className = "row text-area-wrapper">
          <textarea rows="5" cols="60" className="welcome-msg-text-area" placeholder="Example: Hello there! Do you have any questions? We are there to help"
           value={this.state.welcomeMessages[index].messageField}
            onChange={(e) => {
              let welcomeMessages = Object.assign([],this.state.welcomeMessages);
              welcomeMessages[index].messageField = e.target.value;
              this.setState({
                welcomeMessages:welcomeMessages,
                disableButton:false
              })
            }}
            onFocus ={(e) =>{ 
              this.setState({activeTextField: index}) 
            } }>
          </textarea>
          { this.state.hideTrashBtn[index-1] == false &&
            <div className={index !== 0 ? "trash-btn" : "n-vis"} onClick={(e) => {
              let  hideTrashBtn = Object.assign([],this.state.hideTrashBtn)
              hideTrashBtn.splice(index-1,1,true);
              this.setState({
                hideTrashBtn:hideTrashBtn,
                activeTextField: index
              }, 
              this.deleteWelcomeMessage)
              }}>
              <i className="fa fa-trash-o"></i>
            </div>
          }     
        </div>
    </div>  
    });
    return (
      <div className="welcome-message-wrapper">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="card-block welcome-message-header">
              <div className="row">
                <h4 className="welcome-message-title">Show welcome message to customers </h4>
                <SliderToggle checked={this.state.enableDisableCheckbox} handleOnChange={this.handleCheckboxChange} />
              </div>
              <div className="row" >
                <p className="welcome-message-description">The welcome message will greet your customers when they initiate a
                new conversation. Welcome messages are common for all team members across your company.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card">
              <div className="card-header welcome-card-header">
                <div className="message-wrapper">
                  <div className="row">
                    <h5 className="message-title">Welcome message </h5>
                  </div>
                  {welcomeMsgTextArea}                  
                </div>
                {  this.state.welcomeMessages.length <= 2 &&
                  <button className ="add-new-msg-btn" disabled = { this.state.enableAddMsgLink } onClick={this.appendMessageTextArea} >+ Add a follow up welcome message</button>
                }                
                <div className="btn-group">
                  <button disabled={this.state.disableButton} className="km-button km-button--primary save-changes-btn"
                    onClick={(e) => {
                      this.setState({
                        disableButton: true
                      }, this.welcomeMessagesMethod)
                    }} >Save</button>
                  <button disabled = {this.state.disableButton} className="km-button km-button--secondary discard-btn" onClick={this.discardWelcomeMessage}>Discard</button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Welcome;
