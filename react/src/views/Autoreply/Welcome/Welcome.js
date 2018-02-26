import React, { Component } from 'react'
import validator from 'validator';
import './Welcome.css';
import SliderToggle from '../../../components/SliderToggle/SliderToggle';
import Notification from '../../model/Notification';
import { addInAppMsg, deleteInAppMsg, getAllSuggestions, getSuggestionsByAppId, createSuggestions, editInAppMsg, getWelcomeMessge, disableInAppMsgs, enableInAppMsgs,getInAppMessagesByEventId }  from '../../../utils/kommunicateClient'
import axios from 'axios';

class Welcome extends Component{
  constructor(props){
    super(props);
    this.state = {
     enableDisableCheckbox: false,
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
    let eventIds = [1, 2, 3, 4];
    let welcomeMessages = [];
    let welcomeMessagesCopy = [];
    return Promise.resolve(getInAppMessagesByEventId(eventIds)).then(response=>{
      
      response.eventId3Messages.map(msg => {
        msg.messages.map(item => {
          welcomeMessages.push({
            messageField: item.message,
            messageId: item.id,
            status: item.status
          })
          welcomeMessagesCopy.push({
            messageField: item.message,
            messageId: item.id,
            status:item.status
          })
          this.setState({
            welcomeMessages:welcomeMessages,
            welcomeMessagesCopy:welcomeMessagesCopy
          },this.updateUserStatus);
        
        })
      })    
      
    }).catch(err=>{
      console.log("error while fetching welcome message",err);
    })

  }
  handleCheckboxChange = () => {

    // make api call to disable all rows in in_app_msgs where createdBy = user.id 
    this.setState({enableDisableCheckbox: !this.state.enableDisableCheckbox}, () => {
      if(this.state.enableDisableCheckbox) {
        enableInAppMsgs({category: 1}).then(result => {
          if(result !== undefined){
            Notification.success('Welcome Mesages Enabled')
          }
        })
      }else{
        disableInAppMsgs({category: 1}).then(result => {
          if(result !== undefined){
            Notification.error('Welcome Messages Disabled')
          }
        })
      }
    }) 
  }
  updateUserStatus =() =>{
    if(this.state.welcomeMessages[0].status === 1){
      this.setState({enableDisableCheckbox: true})
    }
    else{
      this.setState({enableDisableCheckbox: false})
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
    let id = welcomeMessages[index].messageId;
    if (id !== '') {
      deleteInAppMsg(id).then(response => {
        if (response) {
          Notification.success('Successfully deleted');
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
  }
  createWelcomeMessage = (index) => {
    let data = {
      eventId: 3,
      message: this.state.welcomeMessages[index].messageField,
      status: 2,
      category: 1,
      sequence: index+1
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
        this.state.hideTrashBtn.splice(0,2,false,false);
        let message = Object.assign([], this.state.welcomeMessages);
        let fields = {
          messageField: '',
          messageId: ''
        }
        message.push(fields);
        this.setState({
          welcomeMessages: message
        })
      }
      else {
        Notification.warning("Please Save Your Changes");
      }
      
    }
  }
  
  render() {
    const textArea = this.state.welcomeMessages.map((message, index) => {
      return <div key = {index}>
        <div className = "row text-area-wrapper">
          <div className="trash-wrapper">
          <textarea rows="5" cols="60" placeholder="Hi, please leave your email ID and I will get back to you as soon as possible."
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
              this.state.hideTrashBtn.splice(index-1,1,true);
              this.setState({
                activeTextField: index
              }, 
              this.deleteWelcomeMessage)
              }}>
              <i className="fa fa-trash-o"></i>
            </div>
          }     
        </div>
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
              <div className="card-header">
                <div className="message-wrapper">
                  <div className="row">
                    <h5 className="message-title">Welcome message </h5>
                  </div>
                  <div className="row">
                    {textArea}                  
                  </div>
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
                    }} >Save changes</button>
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
