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
import NoteIcon from './images/note-icon.png';
import IntegratedBots from '../../components/IntegratedBots/IntegratedBots';
import BotStore from './BotStore';
import { SegmentedControl } from 'segmented-control';

<<<<<<< HEAD
import { Tab } from 'semantic-ui-react';
||||||| merged common ancestors
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
      botAvailable: true
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
      botName: ''
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
=======
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
      botAvailable: true
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
      botName: ''
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

  // integrateBot = (aiPlatform) => {

  //   if(!this.state.botName){
  //     Notification.info("Bot name missing");
  //     return;
  //   }else if(!this.state.clientToken){
  //     Notification.info("Client token missing");
  //     return;
  //   }else if(!this.state.devToken){
  //     Notification.info("Dev Token missing");
  //     return;
  //   }

  //   let _this =this;

  //   let data = {
  //     clientToken : this.state.clientToken,
  //     devToken : this.state.devToken,
  //     aiPlatform : aiPlatform,
  //     botName : this.state.botName,
  //     type:'KOMMUNICATE_SUPPORT'
  //   }

  //   // let uuid_holder = uuid();

  //   let userId = this.state.botName.toLowerCase().replace(/ /g, '-')

  //   // this.setState({uuid: uuid_holder})

  //   let userSession = CommonUtils.getUserSession();
  //   let applicationId = userSession.application.applicationId;
  //   let authorization = userSession.authorization;
  //   let password = CommonUtils.getUserSession().password;
  //   let device = atob(authorization);
  //   let devicekey = device.split(":")[1];
  //   let env = getEnvironmentId();
  //   let userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
  //   let userIdList = {"userIdList" : [userId]}

  //   this.setState({disableIntegrateBotButton: true})

  //   this.checkBotNameAvailability(userId,aiPlatform).then( bot => { // 1st API call
  //     axios({
  //     method: 'post',
  //     url:userDetailUrl, // 2nd API Call
  //     data: userIdList,
  //     headers: {
  //       "Apz-Product-App": true,
  //       "Apz-Token": 'Basic ' + new Buffer(CommonUtils.getUserSession().userName+':'+CommonUtils.getUserSession().password).toString('base64'),
  //       "Content-Type": "application/json",
  //       "Apz-AppId":applicationId
  //     }}).then(function(response) {
  //       if(response.status==200 && response.data.response[0]){
  //         console.log(response);
  //         console.log("success");
  //         axios({
  //           method: 'post',
  //           url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure', //3rd API call
  //           // url:"http://localhost:5454/bot/"+response.data.response[0].id+'/configure', 
  //           data:JSON.stringify(data),
  //           headers: {
  //             "Content-Type": "application/json",
  //           }
  //         }).then(function(response){
  //           if(response.status==200 ){
  //             _this.clearBotDetails(); // 4th API call
  //             Notification.info("Bot integrated successfully");
  //             _this.setState({disableIntegrateBotButton: false}) 
  //             if(aiPlatform === "dialogflow"){
  //               _this.setState({dialogFlowIntegrated: true})
  //             }else if( aiPlatform === "microsoft"){
  //               _this.setState({microsoftIntegrated: true})
  //             }else{

  //             }
  //             _this.toggleBotProfileModal()
  //             _this.getIntegratedBotsWrapper()
  //           }
  //         });
  //       }
  //     });
  //   }).catch( err => {
  //     if(err.code=="USER_ALREADY_EXISTS"){
  //       // _this.setState({botNameAlreadyExists:true})
  //       Notification.info("Bot name taken. Try again.");
  //     }else{
  //       Notification.error("Something went wrong");
  //       console.log("Error creating bot", err);
  //     }
  //     this.setState({disableIntegrateBotButton: false})
  //   })
  // }
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
>>>>>>> KM-971 dashboard bot section bugs and improvements

const panes = [
  { menuItem: 'Bot Store', render: () => <Tab.Pane attached={false}><BotStore /></Tab.Pane> },
  { menuItem: 'Integrated Bots', render: () => <Tab.Pane attached={false} ><IntegratedBots/></Tab.Pane> },
]

<<<<<<< HEAD
const TabExampleSecondaryPointing = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)
||||||| merged common ancestors
    let data = {
      clientToken : this.state.clientToken,
      devToken : this.state.devToken,
      aiPlatform : aiPlatform,
      botName : this.state.botName,
      type:'KOMMUNICATE_SUPPORT'
    }
=======
    
>>>>>>> KM-971 dashboard bot section bugs and improvements

<<<<<<< HEAD
||||||| merged common ancestors
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
=======
    // let uuid_holder = uuid();

    let userId = this.state.botName.toLowerCase().replace(/ /g, '-')

    // this.setState({uuid: uuid_holder})
    let data = {
      clientToken : this.state.clientToken,
      devToken : this.state.devToken,
      aiPlatform : aiPlatform,
      botName : this.state.botName,
      type:'KOMMUNICATE_SUPPORT',
      userId:userId
    }
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

     // 1st API call
      return Promise.resolve(createCustomerOrAgent({   
          userName: userId,
          type:2,
          applicationId:applicationId,
          password:userId,
          name:this.state.botName,
          aiPlatform:aiPlatform,
          clientToken : this.state.clientToken,
          devToken : this.state.devToken,
          botName : this.state.botName,
          userId:userId
        },"BOT")).then( response => {
          Notification.info("Bot successfully created");
          if (response.status == 200 || response.data.code === 'SUCCESS') {
            this.clearBotDetails();
            this.toggleBotProfileModal()
            this.getIntegratedBotsWrapper() 
            this.setState({ disableIntegrateBotButton: false })
            if (aiPlatform === "dialogflow") {
              this.setState({ dialogFlowIntegrated: true })
            } else if (aiPlatform === "microsoft") {
              this.setState({ microsoftIntegrated: true })
            } 
            
            
        
          }
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
>>>>>>> KM-971 dashboard bot section bugs and improvements

<<<<<<< HEAD
||||||| merged common ancestors
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
      botName: this.state.editedBotName,
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
=======
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

  checkBotNameAvailability(data,aiPlatform) {

    if(!this.state.botName){
      Notification.info("Please enter a bot name !!");
      return;
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let authorization = userSession.authorization;
    let password = CommonUtils.getUserSession().password;
    let device = atob(authorization);
    let devicekey = device.split(":")[1];
    let env = getEnvironmentId();
    // let userIdList = {"userIdList" : [userId]}


    
  }
  abc = () => {
    var name= this.state.myName;
    console.log("name",name);
  }
  toggleEditBotIntegrationModal = (botIdInUserTable, botKey,  botName, botUserName, botToken, botDevToken, botAvailable) => {
    console.log("toggleEditBotIntegrationModal")
    let abc = {"myName":"suraj"};
    this.setState({myName:"suraj"},this.abc);
    var name= this.state.myName;
    console.log("name",name);
 
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
      botName: this.state.editedBotName,
      clientToken: this.state.editedClientToken,
      devToken: this.state.editedDevToken,
    }

    let axiosPostData = {
      botName: this.state.editedBotName,
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

      // Promise.all([patchUserInfo(patchUserData, this.state.botUserName, this.applicationId), axios({method: 'post',url: url,data:JSON.stringify(axiosPostData),headers: {"Content-Type": "application/json",}})])
      //   .then(([patchUserInfoResponse, axiosPostResponse]) => {
      //     if (patchUserInfoResponse.data.code === 'SUCCESS' && axiosPostResponse.status==200 ) {
      return Promise.resolve(patchUserInfo(patchUserData, this.state.botUserName, this.applicationId))
        .then(patchUserInfoResponse => {
          if (patchUserInfoResponse.data.code === 'SUCCESS') {
            Notification.info("Changes Saved successfully")
            this.toggleEditBotIntegrationModal();
            this.getIntegratedBotsWrapper();
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
>>>>>>> KM-971 dashboard bot section bugs and improvements

class Tabs extends Component {

  render() {
    return (
      <div className="animated fadeIn" >
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display:"block"} }>
          <div className="card-block">
<<<<<<< HEAD
            <div className="bot-main-card-container">
||||||| merged common ancestors
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div>
              </div>
              <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>
                <div style={{height:"4px", backgroundColor: "#5C5AA7", borderRadius: "15px 15px 0 0"}}></div>
                <div style={{padding: "10px"}}>
                  <span className="km-bot-integrated-bots-container-heading">My Integrated Bots:</span>
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
                        <div className="row col-sm-4">
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
                        <div className="col-sm-2" style={{textAlign: "right"}}>
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
=======
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div>
              </div>
              <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>
                <div style={{height:"4px", backgroundColor: "#5C5AA7", borderRadius: "15px 15px 0 0"}}></div>
                <div style={{padding: "10px"}}>
                  <span className="km-bot-integrated-bots-container-heading">My Integrated Bots:</span>
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
                        <div className="row col-sm-4">
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
                        <div className="col-sm-2" style={{textAlign: "right"}}>
                          <button className="btn btn-primary" data-user-name={bot.userName} onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.key, bot.name, bot.userName, bot.accessToken, bot.devToken, bot.bot_availability_status)}}>
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
>>>>>>> KM-971 dashboard bot section bugs and improvements
              <div className="row">

                <div style={{width:"100%"}}>
                  <TabExampleSecondaryPointing />
                </div>

                {/* <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
                </div> */}

              </div>
              </div>
              </div>
              </div>
      </div>
    )
  }
}

export default Tabs;