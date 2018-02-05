import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI} from '../../utils/kommunicateClient';
import CommonUtils from '../../utils/CommonUtils';
import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

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
    };
  let userSession = CommonUtils.getUserSession();
  this.applicationId = userSession.application.applicationId;
  
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleClick = this.handleClick.bind(this);
  this.toggle = this.toggle.bind(this);
   };
   componentWillMount =()=>{
    //this.populateBotOptions();
   }
  componentDidMount=()=>{
    //console.log("options",this.state.botListInnerHtml);
  
  }

  clearBotForm = ()=>{
    this.state.userid="";
    this.state.username="";
    this.state.password="";
    this.state.bot="";
    this.state.ctoken="";
    this.setState({dtoken:""});
   }
   
     handleClick (event){
       var _this =this;
     event.preventDefault();
     let userSession = CommonUtils.getUserSession();
     var applicationId = userSession.application.applicationId;
     var authorization = userSession.authorization;
     var password = CommonUtils.getUserSession().password;
     var device = atob(authorization);
     var devicekey = device.split(":")[1];
     var env = getEnvironmentId();
     var userDetailUrl =getConfig().applozicPlugin.userDetailUrl;

     if(!this.state.bot){
       Notification.info("Please select a bot!!");
       return;
     }else if(!this.state.ctoken){
      Notification.info("Please enter the client token!!");
      return;
     }else if(!this.state.dtoken){
      Notification.info("Please select a developer token!!");
      return;
     }
     var data = {
            "clientToken" : this.state.ctoken,
            "devToken" : this.state.dtoken,
            "aiPlatform" : this.state.platform,
            "botname": this.state.bot.value
        }

        axios({
         method: 'post',
         url:userDetailUrl,
         data:{
               "userIdList" : [data.botname]
             },
             headers: {
              "Apz-Product-App": true,
              "Apz-Token": 'Basic ' + new Buffer(CommonUtils.getUserSession().userName+':'+CommonUtils.getUserSession().password).toString('base64'),
              "Content-Type": "application/json",
              "Apz-AppId":applicationId
             }
          })
      .then(function(response){
       if(response.status==200 ){
          console.log("success");
           axios({
         method: 'post',
         url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure',
         data:JSON.stringify(data),
         headers: {
          "Content-Type": "application/json",
         }
          })
      .then(function(response){
       if(response.status==200 ){
        _this.clearBotForm();
          Notification.info("Bot configured successfully");
         
          }
       });
          }
       });
     }
     // creating bot
    handleSubmit(event) {
        var _this=this;

        if(!this.state.userid){
          Notification.info("Please enter a Bot Id !!");
          return;
        }else if(!this.state.username){
          Notification.info("Please select display name of the bot!!");
          return;
         }else if(!this.state.password){
         Notification.info("Please enter a password !!");
         return;
        }
        let userSession = CommonUtils.getUserSession();
        var applicationId = userSession.application.applicationId;
        Promise.resolve(createCustomerOrAgent({userName:this.state.userid,type:2,applicationId:applicationId,password:this.state.password,name:this.state.username},"BOT"))
        .then(bot=>{
          Notification.info("Bot successfully created");
          _this.clearBotForm();
         }).catch(err=>{
           if(err.code=="USER_ALREADY_EXISTS"){
            Notification.info("Bot Id is already taken. try again.");
            return;
           }
          Notification.error("Something went wrong");
          console.log("err creating bot",err);
         })
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

  toggleDialogFlowModal = () => {
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
      botName:this.state.botName,
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;
    let authorization = userSession.authorization;
    let password = CommonUtils.getUserSession().password;
    let device = atob(authorization);
    let devicekey = device.split(":")[1];
    let env = getEnvironmentId();
    let userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
    let userIdList = {"userIdList" : [this.state.botName]}

    this.setState({disableIntegrateBotButton: true})

    this.checkBotNameAvailability().then( bot => {
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
        if(response.status==200 ){
          console.log(response);
          console.log("success");
          axios({
            method: 'post',
            url:getConfig().applozicPlugin.addBotUrl+"/"+response.data.response[0].id+'/configure',
            data:JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            }
          }).then(function(response){
            if(response.status==200 ){
              _this.clearBotForm();
              Notification.info("Bot integrated successfully");
              _this.setState({disableIntegrateBotButton: false}) 
              if(aiPlatform === "dialogflow"){
                _this.setState({dialogFlowIntegrated: true})
              }else if( aiPlatform === "microsoft"){
                _this.setState({microsoftIntegrated: true})
              }else{

              }
              _this.toggleBotProfileModal()
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

  checkBotNameAvailability() {

    if(!this.state.botName){
      Notification.info("Please enter a bot name !!");
      return;
    }

    let userSession = CommonUtils.getUserSession();
    let applicationId = userSession.application.applicationId;

    return Promise.resolve(
      createCustomerOrAgent({
        userName:this.state.botName,
        type:2,
        applicationId:applicationId,
        password:this.state.botName,
        name:this.state.botName
      },"BOT")).then( bot => {
        Notification.info("Bot successfully created");
        return bot;
      })
  }

  render() {
    return (
      <div className="animated fadeIn" >
        {/* Change showOldBot to false to hide old bot section*/}
        <div className="row" style={{display: this.state.showOldBot ? null:"none"} }>
          <div className="col-md-6 mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); this.state.descriptionType = "ADD_BOT",this.state.descriptionHeader="Step 1"}}
                >
                  Add Bot
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={this.handleClickOnConfigureTab}
                >
                  Configure Bot
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="animated fadeIn">
        <div className="row">
        <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <form className="form-horizontal">
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-userid">Bot Id</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-userid" name="hf-userid" 
                        onChange = {this.handleOnChangeforBotId} value={this.state.userid} className="form-control" placeholder="Enter unique bot id"/>
                      <span className="help-block">Please enter unique bot id</span>
                    </div>
                  </div>
                   <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-userid">Display Name</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-username" onChange = {(event) => this.setState({username:event.target.value})} value={this.state.username} name="hf-username" className="form-control" placeholder="Enter Username"/>
                      <span className="help-block">Please enter your username</span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-password">Password</label>
                    <div className="col-md-9">
                      <input type="password" id="hf-password"  onChange = {(event) => this.setState({password:event.target.value})} value ={this.state.password} name="hf-password" className="form-control" placeholder="Enter Password.."/>
                      <span className="help-block">Please enter your password</span>
                    </div>
                  </div>
                  <div className="form-group row" hidden>
                    <label className="col-md-3 form-control-label" htmlFor="hf-role">Role</label>
                    <div className="col-md-9">
                      <input type="text" id="hf-role" name="hf-role" onChange = {(event) => this.setState({role:event.target.value})} value = {this.state.role} className="form-control" placeholder="Enter Role"/>
                      <span className="help-block">Please enter your role</span>
                    </div>
                  </div>
                </form>
              </div>
               <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick ={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</button>
                <button type="reset" className="btn btn-sm btn-danger n-vis"><i className="fa fa-ban"></i> Reset</button>
              </div>
              </div>
              </div>
              </div>
            </div>
              </TabPane>
              <TabPane tabId="2">
                 <div className="animated fadeIn">
       <form>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-block">
                <form action="" method="post" className="form-horizontal">
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="bot">Select Bot</label>
                    <div className="col-md-9">
                    <Select
                      name="km-bot-id"
                      value={this.state.bot}
                      onChange={(value) => this.setState({bot:value})}
                      options={this.state.botOptionList}/>
                    </div>
                  </div>
              <div hidden>
                  <select id="platform" onChange = {(event) => this.setState({platform:event.target.value})} value ={this.state.platform} >
                  <option selected="" >Api.ai</option>
                  <option value="Api.ai" >Api.ai</option>
                  <option value="Message.ai">Message.ai</option>
                  </select>
             </div>
             <div></div>
              <div></div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="ctoken">Client Token</label>
                    <div className="col-md-9">
                      <input type="text" id="ctoken" name="ctoken"  onChange = {(event) => this.setState({ctoken:event.target.value})} value ={this.state.ctoken} className="form-control" placeholder="Enter Client Token.."/>

                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="hf-dtoken">Dev Token</label>
                    <div className="col-md-9">
                      <input type="text" value={this.state.dtoken} onChange = {(event) => this.setState({dtoken:event.target.value})} value ={this.state.dtoken} id="hf-dtoken" name="hf-dtoken" className="form-control"
                  placeholder="Enter Dev.."/>

                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick={(event) => this.handleClick(event)}><i className="fa fa-dot-circle-o"></i> Submit</button>
                <button type="reset" className="btn btn-sm btn-danger n-vis"><i className="fa fa-ban"></i> Reset</button>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
              </TabPane>
            </TabContent>
          </div>
          <div className="col-md-6 mb-4">
            <BotDescription type ={this.state.descriptionType} header={this.state.descriptionHeader} />
          </div>
        </div>
      {/* Change showNewBot to false to hide new bot section*/}
        <div className="card" style={{display: this.state.showNewBot ? null:"none"} }>
          <div className="card-block">
            <div style={{width: "60%", margin: "0 auto"}}>
              <div className="row">
                <div className="col-sm-12 km-bot-integration-heading">
                  <p>Integrating a bot will allow you to send answers to some customer <br />queries automatically</p>
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
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.dialogFlowIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.microsoftIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
                <div style={{textAlign: "center", width:"12.5%"}}>
                  <p></p>
                </div>
                <div className="col-sm-3" style={{textAlign: "center"}}>
                  <p className={this.state.amazonIntegrated ? null:"n-vis" } style={{"color": "#22d674"}}>Integrated</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 km-bot-integration-logo-container" style={{textAlign: "center"}}>
                  <div className={this.state.dialogFlowIntegrated ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674"}}></div>
                  <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-integration-dialogflow-text">Dialogflow <br />(Api.ai)</p>
                  <p onClick={this.toggleDialogFlowModal} style={{cursor: "pointer", color: "#5c5aa7"}}>Settings</p>
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
      </div>
    )
  }
}

// "key" : "0376d7e9-dfad-4121-8632-e3e29c532573",
// "name" : "bot",
// "applicationKey" : "31ac5a02baeb4dce22eb06a0abf3b1fa7",
// "accessToken" : "bot", //password
// "authorization" : "Ym90OjgyNGRiNmNmLWFiYjgtNDkzZS04MDk1LTdjYjAxMDRmNDAzNw==", //base64(userName:password)
// "brokerUrl" : "tcp://apps.applozic.com:8080",
// "platform" : "aiPlatform",
// "clientToken": "4372f06b2a214580a8dc20d782c4e29c", // get from user
// "devToken": "0662feba0ad84bfb9455cb0205afb66f",  // get from user
// "deleted" : false,
// "type" : "KOMMUNICATE_SUPPORT",
// // "handlerModule": "DEFAULT_KOMMUNICATE_SUPPORT_BOT" // 

export default Tabs;