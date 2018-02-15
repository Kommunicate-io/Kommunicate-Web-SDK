import React, { Component } from 'react'
import validator from 'validator';
import './Welcome.css';
import SliderToggle from '../../../components/SliderToggle/SliderToggle';
import Notification from '../../model/Notification';
import { addInAppMsg, deleteInAppMsg, getAllSuggestions, getSuggestionsByAppId, createSuggestions, getWelcomeMessge, disableInAppMsgs, enableInAppMsgs,getInAppMessagesByEventId }  from '../../../utils/kommunicateClient'
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../../config/config.js';
import { Label, Input, Row } from 'reactstrap';
import WhenYouAreOnline from './WhenYouAreOnline'
import WhenYouAreOffline from './WhenYouAreOffline'
import CommonUtils from '../../../utils/CommonUtils';


class Welcome extends Component{
  // state = { 
  //   welcomeMessages:[""]
  // }
  constructor(props){
    super(props);
    this.state = {
     msg:'',
     showOverlay: false,
     enableDisableCheckbox: true,
     showOfflinePrefs: false,
     showOnlinePrefs: false,
     welcomeMessages:[{messageField:''}],
     enableAddMsgLink: false,
     activeTextField: -1,
    };
    this.submitWelcomeMessage = this.submitWelcomeMessage.bind(this);
  }

  componentDidMount(){
       this.getWelcomeMessges();
  }
  getWelcomeMessges = () => {
    let eventIds = [1, 2, 3, 4];
    let userSession = CommonUtils.getUserSession();
    let welcomeMessages = [];
    return Promise.resolve(getInAppMessagesByEventId(eventIds)).then(response=>{
      response.eventId3Messages.map(msg => {
        msg.messages.map(item => {
          // welcomeMessages.push(item.message)
          welcomeMessages.push({
            messageField: item.message,
            messageId: item.id
          })
          
          this.setState({welcomeMessages:welcomeMessages});
        
        })
      })    
      
    }).catch(err=>{
      console.log("error while fetching welcome message",err);
    })

  }
  submitWelcomeMessage = () => {
    if(this.state.welcomeMessages[0] !== ""){
      var _this =this;
      let userSession = CommonUtils.getUserSession();
       var applicationId = userSession.application.applicationId;
       var userId = userSession.userName;
       console.log(applicationId,userId);
       var setWelcomeMessageUrl = getConfig().kommunicateBaseUrl+"/applications/"+applicationId+"/welcomemessage";
       axios({
        method: 'post',
        url:setWelcomeMessageUrl,
        data:{
              "applicationId" : applicationId,
              "message" : this.state.welcomeMessages[0]
            }
         }).then(function(response){
           console.log("message successfully send");
           Notification.info("welcome message configured successfully");
           //_this.setState({msg:""});
         }).catch(err=>{
          Notification.error("something went wrong!");
         })
  
    }
    else{
      Notification.error("Can't update empty message")
    }
    
	}

  toggleOverlay = (e) => {

    e.preventDefault();
    console.log("hello");
    if(this.state.showOverlay === false){
      this.setState({showOverlay: true})
    }else {
      this.setState({showOverlay: false})
    }

  }

  toggleOnlinePrefs = (showPref) => {
    if(showPref){
      this.setState({
        showOnlinePrefs: true,
        showOfflinePrefs: false
      })
    }else{
      this.setState({
        showOnlinePrefs: false
      })
    }
  }

  toggleOfflinePrefs = (showPref) => {
    if(showPref){
      this.setState({
        showOfflinePrefs: true,
        showOnlinePrefs: false
      })
    }else{
      this.setState({
        showOfflinePrefs: false
      })
    }
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
  updateUserStatus =(status) =>{
    if(status){
      this.setState({enableDisableCheckbox: true})
    }
    else{
      this.setState({enableDisableCheckbox: false})
    }
    
  }
  welcomeMessagesMethod =() => {
    let index = this.state.activeTextField;
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
        } else {
          Notification.warning('There was a problem while deleting');
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      welcomeMessages.splice(index, 1)
      this.setState({ welcomeMessages: welcomeMessages })
      console.log("deleted array", this.state.welcomeMessages)
    }
  }
  createWelcomeMessage = () => {
    let index = this.state.activeTextField;
    let data = {
      eventId: 3,
      message: this.state.welcomeMessages[index],
      status: 1,
      category: 1,
      sequence: index+1
    }
    addInAppMsg(data)
      .then(response => {
        if (response !== undefined && response.status === 200) {
          if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'created') {
            Notification.success('In app message saved successfully');
          } else if (response.data.code === 'SUCCESS' && response.data.message.toLowerCase() === 'limit reached') {
            Notification.warning('Not created, limit of 3 in app messages reached');
          } else {
            Notification.error('In app message not saved.');
          }
        }
      })

  }
  
  appendMessageTextArea = (index) => {
   // if(this.state.welcomeMessages[0].messageField =)
    if(this.state.welcomeMessages[0].messageField !== '' && this.state.welcomeMessages.length < 3 ){
      let message = Object.assign([], this.state.welcomeMessages);
      //let messageField = '';
      let fields = {
        messageField: '',
        messageId: ''
      }
      message.push(fields);
      this.setState({ welcomeMessages: message })
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
              })
            }}
            onFocus ={(e) =>{ 
              this.setState({activeTextField: index}) 
            } }>
          </textarea>
          <div className={index !== 0 ? "trash-btn" : "n-vis"} ><i className="fa fa-trash-o"
              onClick={(e) => {
                this.setState({ activeTextField: index },this.deleteWelcomeMessage )
              }}></i></div>
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
                    {/* <textarea id="offhourmessage" placeholder="Hi, please leave your email ID and I will get back to you as soon as possible." 
                    rows="5" cols="60" onChange={(event) => this.setState({ msg: event.target.value })} value={this.state.msg} required></textarea> */}
                    {textArea}                  
                  </div>
                </div>
                {  this.state.welcomeMessages.length <= 2 &&
                  <button className ="add-new-msg-link" disabled = { this.state.enableAddMsgLink } onClick={this.appendMessageTextArea} >+ Add a follow up welcome message</button>
                }                
                <div className="btn-group">
                  <button className="km-button km-button--primary save-changes-btn" onClick={this.createWelcomeMessage} >Save changes</button>
                  <button className="km-button km-button--secondary discard-btn">Discard</button>
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
