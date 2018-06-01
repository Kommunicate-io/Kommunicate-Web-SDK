import React, {Component} from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot} from '../../utils/kommunicateClient';
import {Link} from 'react-router-dom';
import axios from 'axios';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import NoteIcon from './images/note-icon.png';


export default class BotStore extends Component {

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
          conversationsAssignedToBot: null,
          hideIntegratedBots: true
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

     toggleDialogFlowModalWrapper = () => {
        if(this.state.dialogFlowBots.length < 1){
          this.toggleDialogFlowModal()
        }else{
          this.toggleListOfDialogFlowModal()
        }
      }

      toggleListOfDialogFlowModal = () => {
        this.setState({
          listOfDialogFlowModal: !this.state.listOfDialogFlowModal
        });
      }
    
      getIntegratedBotsWrapper = () => {
        getIntegratedBots().then(response => {
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
        // if(this.state.dialogFlowBots.length < 1){
        //   this.toggleDialogFlowModal()
        // }else{
        //   this.toggleListOfDialogFlowModal()
        // }
        this.toggleDialogFlowModal()
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

      gotoBotIntegration() {
        document.querySelector(".ui.pointing.secondary a.item:last-child").click();
      }


    render() {
        return(
            <div className="km-bot-store-main-container">
                <div className={this.state.listOfIntegratedBots.length >0 ?"banner-container" : "banner-container n-vis"}>
                  <div className="banner-div">
                    <span className="banner-sub-text">You have <span className="banner-main-text" style={{marginRight:"0px", paddingLeft:"0px"}}>{this.state.listOfIntegratedBots.length} bots</span>  integrated</span>
                    
                    <a className="bot-routing-link" onClick={this.gotoBotIntegration} style={{marginLeft:"20px"}}>Manage</a>
                  </div>
                </div>
                <div className={!this.state.useCaseSubmitted ? "row mt-4 km-bot-integration-second-container":"n-vis"}>
                <div className="col-sm-6 km-bot-integration-second-container-text-container">
                  <p className="km-bot-request-bot-heading">Want a custom bot made for you?</p>
                  <p className="km-bot-request-bot-sub-heading">Tell us your bot use-case and we will take care of everything else</p>
                  <p onClick={this.toggleUseCaseModal}>REQUEST CUSTOM BOT</p>
                </div>
                <div className="col-sm-1">
                </div>
                <div className="col-sm-4 km-bot-integration-second-container-cato-container">
                  <img src="data:image/png;base64,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" className="km-bot-integration-cato" />
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


              {/* <div className="row mt-4">
                <div className="col-sm-2">
                </div>
                <div className="col-sm-8 km-bot-integration-third-container">
                  <p><strong>OR</strong>, integrate a bot from one of the platforms below</p>
                </div>
                <div className="col-sm-2">
                </div>
              </div> */}
              <div className="row mt-4">
                <div className="col-sm-3">
                  <div className="row" style={{textAlign: "center"}}>
                    <p className={(this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{"backgroundColor": "#22d674", color: "white", borderRadius: "50%", width: "23px", height: "23px", padding: "3px 0px 0px 0px", marginLeft: "13%", fontSize:"12px", marginBottom:"5px"}}>{this.state.dialogFlowBots.length}</p>
                    <p className={(this.state.dialogFlowIntegrated || this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{"color": "#22d674", marginLeft: "5px", marginBottom:"5px"}}>INTEGRATED</p>
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
                  <div className={(this.state.dialogFlowIntegrated || this.state.dialogFlowBots.length > 0) ? null:"n-vis" } style={{height:"4px", backgroundColor: "#22d674", borderRadius:"4px 4px 0px 0px"}}></div>
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


            {/* USECASE Modal */}
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

                {/* <Modal isOpen={this.state.listOfDialogFlowModal} toggle={this.toggleListOfDialogFlowModal} className="modal-dialog">
          <ModalHeader toggle={this.toggleListOfDialogFlowModal}>
            <img src={Diaglflow} className="km-bot-integration-dialogflow-icon" />
            <span style={{fontSize: "14px", color: "#6c6a6a", marginLeft: "10px"}}>Your Dialogflow integrations</span>
          </ModalHeader>
          <ModalBody style={{padding: "0px"}}>
            <div className="km-bot-list-of-dialogflow-bots-container">
                  {this.state.dialogFlowBots.map((bot,index) => (
                    <div style={{marginTop: "1em", marginBottom: "1em"}} key={index}>
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
        </Modal> */}

            </div>

            
        );
    }
}