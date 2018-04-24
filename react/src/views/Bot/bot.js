import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from 'uuid/v1';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {Link} from 'react-router-dom';
import './bot.css';
import NoteIcon from './images/note-icon.png'

class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      descriptionType :"ADD_BOT",
      descriptionHeader:"Step 1",
      userid: '',
      username: '',
      password:'',
      role :'BOT',
      bot: '',
      ctoken: '',
      platform:'api.ai',
      dtoken :'',
      // amap of {botId :botName}
      botOptionList:[],
      useCaseModal: false,
      dialogFlowModal: false,
      botProfileModal: false,
      otherPlatformModal: false,
      editBotIntegrationModal: false,
      deleteBotIntegrationModal: false,
      listOfDialogFlowModal: false,
      useCaseSubmitted: false,
      clientToken: '',
      devToken: '',
      showNewBot: true,
      showOldBot: false,
      botUseCaseText: '',
      otherPlatformText: '',
      botName: '',
      dialogFlowIntegrated: false,
      microsoftIntegrated: false,
      amazonIntegrated: false,
      botNameAlreadyExists: false,
      disableIntegrateBotButton: false,
      listOfIntegratedBots: [],
      botAiPlatform: {"api.ai": "DialogFlow", "dialogflow": "DialogFlow", "microsoft": "microsoft", "amazon": "amazon"},
      editBotIntegrationModalHeader: 'Edit Bot Profile',
      botIdInUserTable: '',
      botKey: '',
      editedBotName: '',
      editedClientToken: '',
      editedDevToken: '',
      botUserName: '',
      dialogFlowBots: [],
      botAvailable: true,
      conversationsAssignedToBot: null
    };
  let userSession = CommonUtils.getUserSession();
  this.applicationId = userSession.application.applicationId;

  this.toggle = this.toggle.bind(this);
   };

   componentWillMount =()=>{
    //this.populateBotOptions();
   }

  componentDidMount=()=>{
    this.getIntegratedBotsWrapper()
  }

  clearBotDetails = ()=>{
    this.setState({
      devToken: '',
      clientToken: '',
      botName: '',
      editedBotName: '',
      editedClientToken: '',
      editedDevToken: '',
    });
   }
   
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  populateBotOptions=()=>{
    var _this =this;
    Promise.resolve(getUsersByType(this.applicationId,2)).then(data=>{
      console.log("received data",data);
      //_this.state.botOptionList.push({"value":"","label":"Select",disabled:true,selected:true,clearableValue:false});
      data.forEach(function(elem){
        let botName =elem.name||elem.userName;
        let botId =elem.userName;
        //_this.state.botNameMap[botId] =botName;
        _this.state.botOptionList.push({value:botId,label:botName});
        _this.setState({botOptionList:_this.state.botOptionList});
      });
    }).catch(err=>{
      console.log("err while fetching bot list ",err);
    });
  }
  handleClickOnConfigureTab=()=>{
     this.toggle('2'); 
     this.state.descriptionType = "CONFIGURE_BOT";
     this.state.descriptionHeader="Step 2";
     this.state.botOptionList=[];
     this.populateBotOptions();
  }
  handleOnChangeforBotId =(e)=>{
        
        this.setState({userid:e.target.value});
  }

  toggleUseCaseModal = () => {
      this.setState({
          useCaseModal: !this.state.useCaseModal
      });
    }

  submitEmail = (type) => {

    if(type === "USE_CASE_REQUEST" && this.state.botUseCaseText.trim().length > 0){

      let options = {
       templateName: "BOT_USE_CASE_EMAIL",
       botUseCase: this.state.botUseCaseText,
       subject: "Custom Bot Request"
      }

      callSendEmailAPI(options).then(response => {
        console.log(response);
        if(response.status ==  200 && response.data.code == "SUCCESS"){
          Notification.success("Use case submitted");
          this.toggleUseCaseModal()
          this.setState({
            useCaseSubmitted: true,
            botUseCaseText: ''
          })
        }
      });
    }else if(type === "BOT_PLATFORM_REQUEST" && this.state.otherPlatformText.trim().length > 0){

      let options = {
       templateName: "BOT_USE_CASE_EMAIL",
       botUseCase: this.state.otherPlatformText,
       subject: "Other Bot Platform Request"
      }

      callSendEmailAPI(options).then(response => {
        console.log(response);
        if(response.status ==  200 && response.data.code == "SUCCESS"){
          Notification.success("Other bot platform request submitted");
          this.toggleOtherPlatformModal()
          this.setState({otherPlatformText: ''})
        }
      });
    }else if(this.state.botUseCaseText.trim().length < 1 || this.state.otherPlatformText.trim().length < 1 ){
      Notification.info("Please enter the text");
    }
  }

  toggleDialogFlowModalWrapper = () => {
    if(this.state.dialogFlowBots.length < 1){
      this.toggleDialogFlowModal()
    }else{
      this.toggleListOfDialogFlowModal()
    }
  }

  toggleDialogFlowModal = () => {
    // this.clearBotDetails()
    this.setState({
      dialogFlowModal: !this.state.dialogFlowModal
    });
  }

  toggleBotProfileModal = () => {
    this.setState({
        botProfileModal: !this.state.botProfileModal
    });
  }

  integrateBot = (aiPlatform) => {

    if(!this.state.botName){
      Notification.info("Bot name missing");
      return;
    }else if(!this.state.clientToken){
      Notification.info("Client token missing");
      return;
    }else if(!this.state.devToken){
      Notification.info("Dev Token missing");
      return;
    }

    let _this =this;

    let data = {
      clientToken : this.state.clientToken,
      devToken : this.state.devToken,
      aiPlatform : aiPlatform,
      botName : this.state.botName,
      type:'KOMMUNICATE_SUPPORT'
    }

    // let uuid_holder = uuid();

    let userId = this.state.botName.toLowerCase().replace(/ /g, '-')

    // this.setState({uuid: uuid_holder})

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let authorization = userSession.authorization;
    let password = CommonUtils.getUserSession().password;
    let device = atob(authorization);
    let devicekey = device.split(":")[1];
    let env = getEnvironmentId();
    let userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
    let userIdList = {"userIdList" : [userId]}

    this.setState({disableIntegrateBotButton: true})

    this.checkBotNameAvailability(userId,aiPlatform).then( bot => {
      axios({
      method: 'post',
      url:userDetailUrl,
      data: userIdList,
      headers: {
        "Apz-Product-App": true,
        "Apz-Token": 'Basic ' + new Buffer(CommonUtils.getUserSession().userName+':'+CommonUtils.getUserSession().password).toString('base64'),
        "Content-Type": "application/json",
        "Apz-AppId":applicationId
      }}).then(function(response) {
        if(response.status==200 && response.data.response[0]){
          console.log(response);
          console.log("success");
          axios({
            method: 'post',
            url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure',
            // url:"http://localhost:5454/bot/"+response.data.response[0].id+'/configure', 
            data:JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            }
          }).then(function(response){
            if(response.status==200 ){
              _this.clearBotDetails();
              Notification.info("Bot integrated successfully");
              _this.setState({disableIntegrateBotButton: false}) 
              if(aiPlatform === "dialogflow"){
                _this.setState({dialogFlowIntegrated: true})
              }else if( aiPlatform === "microsoft"){
                _this.setState({microsoftIntegrated: true})
              }else{

              }
              _this.toggleBotProfileModal()
              _this.getIntegratedBotsWrapper()
            }
          });
        }
      });
    }).catch( err => {
      if(err.code=="USER_ALREADY_EXISTS"){
        // _this.setState({botNameAlreadyExists:true})
        Notification.info("Bot name taken. Try again.");
      }else{
        Notification.error("Something went wrong");
        console.log("Error creating bot", err);
      }
      this.setState({disableIntegrateBotButton: false})
    })
  }

  toggleOtherPlatformModal = () => {
    this.setState({
      otherPlatformModal: !this.state.otherPlatformModal
    })
  }

  openBotProfileModal = () => {
    if(this.state.clientToken.trim().length < 1){
      Notification.info("Client Token is empty");
      return;
    }else if(this.state.devToken.trim().length < 1){
      Notification.info("Dev Token is empty");
      return;
    }else if( this.state.clientToken.trim().length > 0 && this.state.devToken.trim().length > 0 ){
      this.toggleDialogFlowModal()
      this.toggleBotProfileModal()
    }
  }

  checkBotNameAvailability(userId,aiPlatform) {

    if(!this.state.botName){
      Notification.info("Please enter a bot name !!");
      return;
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;


    return Promise.resolve(
      createCustomerOrAgent({
        userName: userId,
        type:2,
        applicationId:applicationId,
        password:userId,
        name:this.state.botName,
        aiPlatform:aiPlatform
      },"BOT")).then( bot => {
        Notification.info("Bot successfully created");
        return bot;
      })
  }

  toggleEditBotIntegrationModal = (botIdInUserTable, botKey,  botName, botUserName, botToken, botDevToken, botAvailable) => {
    console.log("toggleEditBotIntegrationModal")
    this.clearBotDetails();
    this.setState({
      editBotIntegrationModal: !this.state.editBotIntegrationModal
    })

    if(botIdInUserTable && botKey){
      this.setState({
        botIdInUserTable,
        botKey
    }, () => {this.editBotDetails()})

    }
    if(botName && botUserName && botToken && botDevToken){
      this.setEditBotIntegrationDetails(botName, botUserName, botToken, botDevToken)
    }

    console.log(botAvailable);
    console.log(botName);
    console.log(botUserName);
    console.log(botToken);

      this.setState({
        botAvailable: botAvailable == 1 ? true:false
      }, () => {console.log(this.state.botAvailable)})
  }

  toggleDeleteBotIntegrationModal = () => {
    // this.clearBotDetails();
    this.setState({
      deleteBotIntegrationModal: !this.state.deleteBotIntegrationModal
    })
  }

  setEditBotIntegrationDetails = (botName, botUserName, clientToken, devToken) => {
    this.setState({
      editBotIntegrationModalHeader: botName,
      editedBotName: botName,
      editedClientToken: clientToken,
      editedDevToken: devToken,
      botUserName,
      botName,
      clientToken,
      devToken,
    })
  }

  editBotDetails = () => {

    console.log(this.state.botIdInUserTable)
    console.log(this.state.botKey)

  }

  saveEditedBotDetails = () => {

    let patchUserData = {
      name: this.state.editedBotName,
    }

    let axiosPostData = {
      //botName: this.state.editedBotName,
      aiPlatform: "dialogflow",
      type:"KOMMUNICATE_SUPPORT",
      clientToken: this.state.editedClientToken,
      devToken: this.state.editedDevToken,
    }

    // let url = "http://localhost:5454/bot"+"/"+this.state.botKey+'/configure'
    let url = getConfig().applozicPlugin.addBotUrl+"/"+this.state.botKey+'/configure'

    console.log(this.state.botName.toLowerCase());
    console.log(this.state.editedBotName.toLowerCase());

    if(this.state.botName.trim().toLowerCase() !== this.state.editedBotName.trim().toLowerCase() || this.state.clientToken.trim().toLowerCase() !== this.state.editedClientToken.trim().toLowerCase() || this.state.devToken.trim().toLowerCase() !== this.state.editedDevToken.trim().toLowerCase()){

      Promise.all([patchUserInfo(patchUserData, this.state.botUserName, this.applicationId), axios({method: 'post',url: url,data:JSON.stringify(axiosPostData),headers: {"Content-Type": "application/json",}})])
        .then(([patchUserInfoResponse, axiosPostResponse]) => {
          if (patchUserInfoResponse.data.code === 'SUCCESS' && axiosPostResponse.status==200 ) {
            Notification.info("Changes Saved successfully")
            this.toggleEditBotIntegrationModal()
            this.getIntegratedBotsWrapper()
          }
          this.getIntegratedBotsWrapper()
        }).catch(err => {console.log(err)})
    }else{
      Notification.info("No Changes to be saved successfully")
    }
  }

  toggleListOfDialogFlowModal = () => {
    this.setState({
      listOfDialogFlowModal: !this.state.listOfDialogFlowModal
    });
  }

  getIntegratedBotsWrapper = () => {
    getIntegratedBots().then(response => {
      console.log(response);
      this.setState({
        listOfIntegratedBots: (response && response.allBots) ? response.allBots: [],
        dialogFlowBots: (response && response.dialogFlowBots) ? response.dialogFlowBots: [],
      }, () => {
        this.state.listOfIntegratedBots.map(bot => {
          if(bot.allConversations == 1){
            this.setState({
              conversationsAssignedToBot: bot.name
            })
          }
        })
      })
    });
  }

  toggleBotAvailability = () => {
    this.setState({
      botAvailable: !this.state.botAvailable
    }, () => {
      if(this.state.botAvailable){
        this.enableBot()
      }else{
        this.disableBot()
      }
    })
  }

  deleteBot = () => {

    let patchUserData = {
      deleted_at:new Date()
    }

    patchUserInfo(patchUserData, this.state.botUserName, this.applicationId).then(response => {
      if(response.data.code === 'SUCCESS'){
        Notification.info("Deleted successfully")
        this.toggleDeleteBotIntegrationModal()
        this.toggleEditBotIntegrationModal()
        this.getIntegratedBotsWrapper()
      }
    })
  }

  disableBot = () => {

    let patchUserData = {
      bot_availability_status: 0
    }

    patchUserInfo(patchUserData, this.state.botUserName, this.applicationId).then(response => {
      if(response.data.code === 'SUCCESS'){
        Notification.info("Disabled successfully")
        // this.toggleDeleteBotIntegrationModal()
        // this.toggleEditBotIntegrationModal()
        this.getIntegratedBotsWrapper()
        return true
      }
    }).then(response => {
      if(response ===  true){
        return conversationHandlingByBot(this.state.botUserName, 0)
      }
    }).then(response => {
      if(response.data.code === "success"){
        Notification.info('Disabled bot removed from converstaions')
      }
    })

  }

  enableBot = () => {

    let patchUserData = {
      bot_availability_status: 1
    }

    patchUserInfo(patchUserData, this.state.botUserName, this.applicationId).then(response => {
      if(response.data.code === 'SUCCESS'){
        Notification.info("Enabled successfully")
        // this.toggleDeleteBotIntegrationModal()
        // this.toggleEditBotIntegrationModal()
        this.getIntegratedBotsWrapper()
      }
    })

  }

  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display: this.state.showNewBot ? null:"none"} }>
          <div className="card-block">
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div>
              </div>
              <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>
                <div style={{height:"4px", backgroundColor: "#5C5AA7", borderRadius: "15px 15px 0 0"}}></div>
                <div style={{padding: "10px"}} className={this.state.conversationsAssignedToBot ? null:"n-vis"}>
                  <div style={{marginTop: "20px"}}>
                    <span className="integrated-bot-assigned-bot-text">All new conversations are assigned to : </span>
                    <span style={{display: "inline-block", border: "1px dashed #d0cccc", padding: "5px"}}>
                      <img src={Diaglflow} style={{ width: "39px", height: "37.5px"}} /> 
                      <span>{this.state.conversationsAssignedToBot ? this.state.conversationsAssignedToBot:'No Bot'}</span> 
                    </span> 
                  </div>
                  <div style={{marginTop: "20px"}}>
                    <span className="integrated-bot-note-text"><strong>Note:</strong> Any other integrated bots (if present) will remain idle and will not <br /> be assigned to any conversation</span>
                  </div>
                </div>
                <div style={{padding: "10px"}} className={this.state.conversationsAssignedToBot ? "n-vis":null}>
                  <div style={{marginTop: "20px", marginBottom:"20px"}}>
                    <img src={NoteIcon} style={{height: '18px'}} />
                    <span style={{marginLeft: "5px"}} className="integrated-bot-assigned-bot-text">None of your integrated bots are currently assigned in conversations</span>
                  </div>
                </div>
                <div style={{backgroundColor: "#cce7f8", height: "41px", textAlign: "center"}}>
                  <span className="integrated-bot-converstaion-routing-text">You may change conversation assignment settings from <Link to="/settings/agent-assignment">Conversation routing</Link></span>
                </div>
                <div style={{padding: "10px"}}>
                  <span className="km-bot-integrated-bots-container-heading">Integrated Bots:</span>
                  <hr />
                </div>
                <div className="km-bot-list-of-integrated-bots-container">
                  {this.state.listOfIntegratedBots.map(bot => (
                    <div className="container" key={bot.id}>
                      <div className="row">
                        <div className="col-sm-2">
                          { 
                            bot.bot_availability_status == 1 ? <span className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span> : <span className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                          }
                        </div>
                        <div className="row col-sm-5">
                          <div style={{marginRight: "8px"}}>
                            <img src={Diaglflow} style={{marginTop: "0px"}} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                          </div>
                          <div>
                            <span>
                              <span className="km-bot-list-of-integrated-bots-ai-platform-name">{this.state.botAiPlatform[(bot.aiPlatform) ? bot.aiPlatform.toLowerCase() : '']}</span>
                              <br />
                              <span className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</span>
                            </span>
                          </div> 
                        </div>
                        <div className="col-sm-4">
                          <span className="km-bot-list-of-integrated-bots-bot-name">Bot ID: {bot.userName}</span>
                        </div>
                        <div className="col-sm-1" style={{textAlign: "right"}}>
                          <button className="btn btn-primary" data-user-name={bot.userName} onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.key, bot.name, bot.userName, bot.token, bot.devToken, bot.bot_availability_status)}}>
                            Edit
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
              <div className={!this.state.useCaseSubmitted ? "row mt-4 km-bot-integration-second-container":"n-vis"}>
                <div className="col-sm-6 km-bot-integration-second-container-text-container">
                  <p>Want a custom bot?</p>
                  <p>Tell us your bot use-case and we will take <br />care of everything else</p>
                  <p onClick={this.toggleUseCaseModal}>REQUEST CUSTOM BOT</p>
                </div>
                <div className="col-sm-1">
                </div>
                <div className="col-sm-4 km-bot-integration-second-container-cato-container">
                  <img src={Cato} className="km-bot-integration-cato" />
                </div>
              </div>
              <div className={this.state.useCaseSubmitted ? "row mt-4 km-bot-integration-use-case-sbmt-container":"n-vis"}>
                <div className="col-sm-1 km-bot-integration-tick-container">
                  <img src={Tick} className="km-bot-integration-tick-icon" />
                </div>
                <div className="col-sm-9 km-bot-integration-use-case-sbmt-text-container">
                  <p>Use case submitted. We will get back to you over phone or <br />email soon with more details.</p>
                  <p>Schedule a call with our Product Team right away if you have something more to add. We will be glad to assist !!</p>
                  <a className="btn schedule-call-btn" href="https://calendly.com/kommunicate/15min" target="_blank">Schedule a Call</a>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-2">
                </div>
                <div className="col-sm-8 km-bot-integration-third-container">
                  <p><strong>OR</strong>, integrate a bot from one of the platforms below</p>
                </div>
                <div className="col-sm-2">
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-3">
                  <div className="row" style={{textAlign: "center"}}>
                    <p className={(this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{"backgroundColor": "#22d674", color: "white", borderRadius: "50%", width: "23px", height: "22px", padding: "0px", marginLeft: "23%"}}>{this.state.dialogFlowBots.length}</p>
                    <p className={(this.state.dialogFlowIntegrated || this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{"color": "#22d674", marginLeft: "5px"}}>INTEGRATED</p>
                  </div>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.microsoftIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>INTEGRATED</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.amazonIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>INTEGRATED</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={(this.state.dialogFlowIntegrated || this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-dialogflow-text">Dialogflow <br />(Api.ai)</p>
                  <p onClick={this.toggleDialogFlowModalWrapper} style={{cursor: "pointer", color: "#5c5aa7"}}>SETTINGS</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.microsoftIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Microsoft} className="km-bot-integration-microsoft-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-microsoft-text">Microsoft Bot <br />Framework</p>
                  <p className="km-bot-integration-coming-soon">Coming Soon</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.amazonIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Amazon} className="km-bot-integration-amazon-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-amazon-text">Amazon Lex</p>
                  <p className="km-bot-integration-coming-soon">Coming Soon</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-12" style={{textAlign: "center"}}>
                  <a className="btn km-bot-integration-other-pltform km-bot-cursor-pointer" onClick={this.toggleOtherPlatformModal}>Have some other platform in mind? Let us know</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.useCaseModal} toggle={this.toggleUseCaseModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleUseCaseModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Please explain your bot use case:</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <textArea rows="5" className="form-control" style={{resize: "none"}} placeholder="Example: I need a bot for hotel booking. It should be able to manage bookings." onChange={(event) => this.setState({botUseCaseText: event.target.value})} value={this.state.botUseCaseText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={ () => {this.submitEmail("USE_CASE_REQUEST")} }>
                  Submit Usecase
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.otherPlatformModal} toggle={this.toggleOtherPlatformModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleOtherPlatformModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Please explain other bot platform:</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <textArea rows="5" className="form-control" style={{resize: "none"}} placeholder="Example: I need to integrate with this bot platform." onChange={(event) => this.setState({otherPlatformText: event.target.value})} value={this.state.otherPlatformText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={ () => {this.submitEmail("BOT_PLATFORM_REQUEST")}}>
                  Submit Platform Request
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.dialogFlowModal} toggle={this.toggleDialogFlowModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleDialogFlowModal}>
            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
            <span className="km-bot-integration-use-case-modal-text">Integrating your Dialogflow bot with Kommunicate</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Instructions:</p>
                <BotDescription />
              </div>
            </div>
            <div className="row">
              <label className="col-sm-3" htmlFor="hf-password">Client Token:</label>
              <div className="col-sm-9">
                <input type="text" onChange = {(event) => this.setState({clientToken:event.target.value})} value ={this.state.clientToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-md-3" htmlFor="hf-password">Dev Token:</label>
              <div className="col-md-9">
                <input type="text" onChange = {(event) => this.setState({devToken:event.target.value})} value ={this.state.devToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={this.openBotProfileModal}>
                  Next
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.botProfileModal} toggle={this.toggleBotProfileModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleBotProfileModal}>
            <img src={KmIcon} className="km-bot-integration-dialogflow-icon" />
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Bot Profile</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Give a name to your bot from DialogFlow   </p>
              </div>
            </div>
            <div className="row" style={{marginTop: "75px"}}>
              <label className="col-sm-3" htmlFor="hf-password">Bot Name:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({botName:event.target.value})} value ={this.state.botName} name="hf-password" className="form-control input-field" placeholder="Example: Alex, Bot " />
              </div>
            </div>
            <div className="row" style={{marginTop: "0px"}}>
              <label className="col-sm-3" htmlFor="hf-password"></label>
              <div className="col-sm-7">
                <span className={this.state.botNameAlreadyExists ? "n-vis":"help-block km-bot-profile-modal-text"}>The name you select here will be seen <br /> by your customers</span>
                <span className={this.state.botNameAlreadyExists ? "help-block":"n-vis"} style={{color: "red"}}>Bot name is taken. Try again.</span>
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <button className="btn btn-primary" onClick={() => {this.integrateBot("dialogflow")}} disabled={this.state.disableIntegrateBotButton}>
                  Integrate and Setup Bot Profile
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.editBotIntegrationModal} toggle={this.toggleEditBotIntegrationModal} className="modal-dialog" style={{width: "700px"}}>
          <ModalHeader toggle={this.toggleEditBotIntegrationModal}>
            <div className="row">
              <div>
                <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
                <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>{this.state.editBotIntegrationModalHeader}</span>
              </div>
              <div style={{marginTop: "20px", marginLeft: "200px"}}>
                <SliderToggle checked={this.state.botAvailable} handleOnChange={this.toggleBotAvailability} />
              </div>
            </div>
          </ModalHeader>
          <div style={{width:"100%"}} className={this.state.botAvailable ? "n-vis":"km-bot-integration-third-container"}>
            <p>Your bot will not reply to conversations in disabled state</p>
          </div>
          <ModalBody>
            <div className="row">
              <label className="col-sm-3">Client Token:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({editedClientToken:event.target.value})} value ={this.state.editedClientToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-md-3">Dev Token:</label>
              <div className="col-md-6">
                <input type="text" onChange = {(event) => this.setState({editedDevToken:event.target.value})} value ={this.state.editedDevToken} name="hf-password" className="form-control input-field"/>
              </div>
            </div>
            <div className="row mt-4">
              <label className="col-sm-3">Bot Name:</label>
              <div className="col-sm-6">
                <input type="text" onChange = {(event) => this.setState({editedBotName:event.target.value})} value={this.state.editedBotName} className="form-control input-field" />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-4">
              </div> 
              <div className="col-sm-4 text-right">
                <button className="btn btn-outline-primary" onClick={ () => {this.toggleDeleteBotIntegrationModal();}}>
                  Delete Integration
                </button>
              </div>
              <div className="col-sm-3 text-right">
                <button className="btn btn-primary" onClick={this.saveEditedBotDetails}>
                  Save Changes
                </button>
              </div> 
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.deleteBotIntegrationModal} toggle={this.toggleDeleteBotIntegrationModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleDeleteBotIntegrationModal}>
            <span className="km-bot-delete-bot-modal-heading">Delete Integration</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-sm-12">
                <p className="km-bot-integration-use-case-modal-text">Are you sure you want to delete this integration? You may add it as a new integration later on if needed.  </p>
              </div>
            </div>
            <div className="row" style={{marginTop: "75px"}}>
            </div>
            <div className="row" style={{borderRadius: "6px", border: "solid 1px #979797", margin: "-1px", padding: "12px 5px"}}>
              <div className="row col-sm-7">
                <div className="col-sm-3">
                  <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" style={{marginTop: "0px"}}/>
                </div>
                <div className="col-sm-4">
                  <span style={{whiteSpace: "nowrap"}}>{this.state.botAiPlatform['dialogflow']}<br />{this.state.botName}</span>
                </div> 
              </div>
              <div className="col-sm-2" style={{textAlign: "left"}}>
                { 
                  this.state.botAvailable ? <span className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span> : <span className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                }
              </div>
              <div className="col-sm-3" style={{textAlign: "right"}}>
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-6">
              </div>
              <div className="col-sm-3 text-right">
                <button className="btn btn-primary" onClick={this.toggleDeleteBotIntegrationModal}>
                  Cancel
                </button>
              </div>
              <div className="col-sm-3 text-right">
                <button className="btn btn-primary" onClick={this.deleteBot}>
                  Delete
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.listOfDialogFlowModal} toggle={this.toggleListOfDialogFlowModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleListOfDialogFlowModal}>
            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Your Dialogflow integrations</span>
          </ModalHeader>
          <ModalBody style={{padding: "0px"}}>
            <div className="km-bot-list-of-dialogflow-bots-container">
                  {this.state.dialogFlowBots.map(bot => (
                    <div style={{marginTop: "1em", marginBottom: "1em"}} key={bot.id}>
                      <div className="row col-sm-12" style={{marginLeft: "10px"}}>
                        <div className="col-sm-5">
                            <p className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</p>
                            <p className="km-bot-list-of-integrated-bots-bot-name">Bot ID: {bot.userName}</p>
                        </div>
                        <div className="col-sm-3">
                          { 
                            bot.bot_availability_status == 1 ? <span className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span> : <span className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                          }
                        </div>
                        <div className="col-sm-4" style={{textAlign: "right"}}>
                          <button className="btn btn-primary" data-user-name={bot.userName} onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.key, bot.name, bot.userName, bot.token, bot.devToken, bot.bot_availability_status)}}>
                            Edit
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
            <div className="row">
            </div>
            <div className="row" style={{marginTop: "66px", padding: "10px"}}>
              <div className="col-sm-6">
              </div> 
              <div className="col-sm-6 text-right">
                <button className="btn btn-primary" onClick={() => {this.toggleDialogFlowModal(); this.toggleListOfDialogFlowModal()}}>
                  New Integration
                </button>
              </div>  
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Tabs;