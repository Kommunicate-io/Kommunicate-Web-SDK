import React, {Component} from 'react';
import CommonUtils, {PRODUCTS}  from '../../utils/CommonUtils';
import {sendProfileImage,getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot, getAppSetting,updateAppSetting} from '../../utils/kommunicateClient';
import {Link} from 'react-router-dom';
import axios from 'axios';
import BotDescription from './BotDescription.js';
import Notification from '../model/Notification';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import CloseButton from './../../components/Modal/CloseButton.js';
import Cato from './images/cato-bot-integration.png'
import Amazon from './images/amazon-icon.png'
import Diaglflow from './images/dialogflow-icon.png'
import Microsoft from './images/microsoft-icon.png'
import Tick from './images/tick-icon.png'
import KmIcon from './images/km-icon.png'
import NoteIcon from './images/note-icon.png';
import RadioButton from '../../components/RadioButton/RadioButton';
import InputFile from '../../components/InputFile/InputFile';
import AnalyticsTracking from '../../utils/AnalyticsTracking';
import EventMessageClient from '../../utils/EventMessageClient';
import {PseudoNameImage, ConversationsEmptyStateImage, LizProfileSVG, LizFullSVG, BotDefaultImage , LizBotSvg,BotSectionSvg} from '../../views/Faq/LizSVG.js';
import BotIntegrationModal from 'react-modal';
import {botIntegrationData} from './botIntegrationData'
import BotIntegrationModalContent from './BotIntegrationModalContent'
import Banner from '../../components/Banner';
import {SUPPORTED_PLATFORM, DEFAULT_BOT_IMAGE_URL, ROLE_TYPE} from '../../utils/Constant.js'
import Button from '../../components/Buttons/Button';
import styled, { withTheme } from 'styled-components';
import { ConfirmationTick } from '../../assets/svg/svgs'

const TextArea = styled.textarea`
    resize: none;
    border-radius: 4px;
    border: solid 1px #e1dbdb;
    width: 100%;
    font-size: 14px;
    outline: 0;
    background: transparent;
    margin: 10px auto;
    padding: 10px;

    &:focus {
        border: solid 1px ${props => props.theme.primary};
        outline: 0;
    }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '650px',
    // maxWidth: '580px',
    overflow: 'visible',
    paddingLeft: '32px',
    paddingRight: '32px'
  }
};
class BotStore extends Component {
    constructor(props) {
        super(props);

        this.state = {
          openModal:false,
          botPlatformVersion :'DialogflowVersion2',
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
          googleClientEmail:'',
          googlePrivateKey:'',
          projectId:'',
          dialogFlowBots: [],
          botAvailable: true,
          conversationsAssignedToBot: null,
          hideIntegratedBots: true,
          setbotImageLink:'',
          botIntegrationType:"",
          botAssignmentModal:false,
          latestIntegratedBotId:'',
          conversationsAssignedToBotId:'',
          applicationExpiryDate:'',
          step: 1
        };
      let userSession = CommonUtils.getUserSession();
      this.applicationId = userSession.application.applicationId;

      this.toggle = this.toggle.bind(this);
       };

      componentDidMount=()=>{
        this.getIntegratedBotsWrapper();
        this.checkForBotRoutingEnabled();
        this.setState({
          applicationExpiryDate: CommonUtils.getFormatedExpiryDate()
        });
      }

      toggleBotIntegrationModal = (value, botPlatform, step) => {
        this.setState({
          openModal: value,
          step
        })
        if (botPlatform) {
          this.setState({
            botIntegrationType: botPlatform,
            botIntegrationContent: botIntegrationData[botPlatform]
          })
        }
      }
      checkForBotRoutingEnabled = () =>{
        getAppSetting().then(response => {
          response.status = 200 && response.data && this.setState({
            botRoutingEnabled: response.data.response.botRouting
          })
        })
      }

      clearBotDetails = ()=>{
        this.setState({
          devToken: '',
          clientToken: '',
          botName: '',
          editedBotName: '',
          editedClientToken: '',
          editedDevToken: '',
          setbotImageLink:''
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
                  conversationsAssignedToBot: bot.name,
                  conversationsAssignedToBotId: bot.userName
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
        this.toggleDialogFlowModal();
      }

      handleVersion = (e) => {
        // e.preventDefault();
        if (e.target.id === "km-dialogflow-radio-v1"){
          this.setState({
              botPlatformVersion:"DialogflowVersion1"
          })
        }
        else {
          this.setState({
              botPlatformVersion:"DialogflowVersion2"
          })
        }
      }

      uploadDialogFlowV2File = () => {
        var file = {};
        let fileValue = {};
        var dialogflowJSON
        file.json = document.getElementById("uploadJson").files[0];
        var reader = new FileReader();
        let that=this;
        reader.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            fileValue = evt.target.result;
            dialogflowJSON = JSON.parse(fileValue);
            that.setStateForDialogFlow(dialogflowJSON);
          }
        }
        reader.readAsText(file.json);
      }

      setStateForDialogFlow = (dialogflowJSON) => {
        if(typeof dialogflowJSON.client_email === 'undefined'){
          Notification.info("Client email missing in JSON file. Please upload a valid JSON file.");
          return;
        }
        else if(typeof dialogflowJSON.private_key === 'undefined'){
          Notification.info("Private key id missing in JSON file. Please upload a valid JSON file.");
          return;
        }
        else if(typeof dialogflowJSON.project_id === 'undefined'){
          Notification.info("Project id missing in JSON file. Please upload a valid JSON file.");
          return;
        }
        this.setState({
          googleClientEmail:dialogflowJSON.client_email,
          googlePrivateKey:dialogflowJSON.private_key,
          projectId:dialogflowJSON.project_id
        });
        this.toggleDialogFlowModal();
        this.toggleBotProfileModal();
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

          if(!this.state.botName.trim()){
            Notification.info("Bot name missing");
            return;
          }

        let _this =this;
        let data;

        if(this.state.botPlatformVersion === "DialogflowVersion1"){
          data = {
            clientToken : this.state.clientToken,
            devToken : this.state.devToken,
            aiPlatform : aiPlatform,
            type:'KOMMUNICATE_SUPPORT'
          }
        }
        else {
          data = {
            googleClientEmail:this.state.googleClientEmail,
            googlePrivateKey:this.state.googlePrivateKey,
            projectId:this.state.projectId,
            aiPlatform : aiPlatform,
            type:'KOMMUNICATE_SUPPORT'
          }
        }
        // let uuid_holder = uuid();

        let userId = CommonUtils.removeSpecialCharacters(this.state.botName);
        data.userId = userId;

        // this.setState({uuid: uuid_holder})

        /*let userSession = CommonUtils.getUserSession();
        let applicationId = userSession.application.applicationId;
        let userDetailUrl = getConfig().applozicPlugin.userDetailUrl;
        let userIdList = {"userIdList" : [userId]}*/

        this.setState({disableIntegrateBotButton: true})

        this.checkBotNameAvailability(data).then( bot => {
          _this.clearBotDetails();
          _this.onCloseModal();
          _this.openIntegrationModal();
          if(aiPlatform === "dialogflow"){
            _this.setState({dialogFlowIntegrated: true})
          }else if( aiPlatform === "microsoft"){
            _this.setState({microsoftIntegrated: true})
          }
          if (_this.state.listOfIntegratedBots.length == 1) {
            EventMessageClient.sendEventMessage('ac-integrated-bot');
          }
          _this.getIntegratedBotsWrapper();
          _this.setState({
            disableIntegrateBotButton: false
          });
          /*axios({
          method: 'post',
          url:userDetailUrl,
          data: userIdList,
          headers: {
            "Apz-Product-App": true,
            "Apz-Token": 'Basic ' + new Buffer(CommonUtils.getUserSession().userName+':'+CommonUtils.getUserSession().accessToken).toString('base64'),
            "Content-Type": "application/json",
            "Apz-AppId":applicationId
          }}).then(function(response) {
            if(response.status==200 && response.data.response[0]){
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
                  _this.onCloseModal();
                  _this.openIntegrationModal();
                  if(aiPlatform === "dialogflow"){
                    _this.setState({dialogFlowIntegrated: true})
                  }else if( aiPlatform === "microsoft"){
                    _this.setState({microsoftIntegrated: true})
                  }
                  if (_this.state.listOfIntegratedBots.length == 1) {
                    EventMessageClient.sendEventMessage('ac-integrated-bot');
                  }
                  _this.getIntegratedBotsWrapper();
                  _this.setState({
                    disableIntegrateBotButton: false
                  })
                }
              });
            }
          });*/
        }).catch( err => {
          if(err.code=="USER_ALREADY_EXISTS"){
            // _this.setState({botNameAlreadyExists:true})
            Notification.error("Bot name or bot ID already exists. Try again with a different name");
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

      openIntegrationModal = () =>{
        this.setState({
          botAssignmentModal: true && CommonUtils.isKommunicateDashboard(),
        })
      }
      setBotCredentials = (botName, botId) =>{
        this.setState({
          latestIntegratedBotName : botName,
          latestIntegratedBotId: botId
        })
      }

      openBotProfileModal = () => {
        if(this.state.botPlatformVersion === "DialogflowVersion1"){
          if(this.state.clientToken.trim().length < 1){
            Notification.info("Client Token is empty");
            return;
          }else if(this.state.devToken.trim().length < 1){
            Notification.info("Dev Token is empty");
            return;
          }else if( this.state.clientToken.trim().length > 0 && this.state.devToken.trim().length > 0 ){
            this.toggleDialogFlowModal();
            this.toggleBotProfileModal();
          }
        }
        else {
          if(typeof document.getElementById("uploadJson").files[0] === 'undefined'){
            Notification.info("No file uploaded");
            return;
          }
          else{
            this.uploadDialogFlowV2File();
          }
        }
        AnalyticsTracking.acEventTrigger('ac-integrated-bot');
      }

      checkBotNameAvailability(data) {
        if(!this.state.botName){
          Notification.info("Please enter a bot name !!");
          return;
        }

        let userSession = CommonUtils.getUserSession();
        let applicationId = userSession.application.applicationId;

        data.userName = data.userId;
        data.type = 2;
        data.applicationId = applicationId;
        data.password = data.userId;
        data.name = this.state.botName;
        data.roleType = ROLE_TYPE.BOT;
        data.imageLink = this.state.setbotImageLink ? this.state.setbotImageLink : DEFAULT_BOT_IMAGE_URL;

        return Promise.resolve(
          createCustomerOrAgent(data,"BOT")).then( bot => {
            var bot = bot.data.data;
            let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
            botAgentMap[bot.userName] = bot;
            CommonUtils.setItemInLocalStorage("KM_BOT_AGENT_MAP",botAgentMap);
            Notification.info("Bot successfully created");
            this.setState({
              latestIntegratedBotName: this.state.botName,
              latestIntegratedBotId : bot.userName
            })
            return bot;
          })
      }

      gotoBotIntegration() {
        document.querySelector(".ui.pointing.secondary a.item:last-child").click();
      }

      handleScale = (botUserNameUpload) => {
        let that=this;
        document.getElementById("km-upload-bot-image-select").addEventListener("change", function(){
          that.setState({
            botImagefileObject: document.getElementById("km-upload-bot-image-select").files[0]
          });
          document.getElementById("km-upload-bot-image-select").value="";
          that.uploadBotProfileImage(that.state.botImagefileObject, botUserNameUpload);
        });
      }
      
      uploadBotProfileImage = (blob, botUserNameUpload) => {
        let that=this;
        let file = blob;
        if (file) {
          sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${file.name.split('.').pop()}`)
            .then(response => {
              if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                that.setState({ setbotImageLink: response.data.profileImageUrl });
              } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
                Notification.info(response.data.message)
              }
            })
            .catch(err => {
              console.log(err)
              Notification.info("Error while uploading")
            })
        } else {
          Notification.info("No file to upload")
        }
      }
     
      onCloseModal = () => {
        this.clearBotDetails();
        this.setState({
          dialogFlowModal: false,
          botProfileModal: false,
          botAssignmentModal: false
        });
      };

      integratedBotCount = (botPlatform,data) =>{
        if(data){
          var botList = data.filter(function(item){
            return item.aiPlatform == botPlatform;
          });
          return botList.length;
        }
        return 0;
      }

      enableBotRouting = () => {
        updateAppSetting({botRouting: true}).then(response => {
          this.setState({
            botRoutingEnabled: 1
          })
        }).catch(err => {
          console.log("error while updating bot routing", err);
        })
      }

      assignConversationsToIntegratedBot = () => {

        if (!this.state.botRoutingEnabled) {
          this.enableBotRouting();
        }
        this.state.conversationsAssignedToBotId && conversationHandlingByBot(this.state.conversationsAssignedToBotId, 0)
        conversationHandlingByBot(this.state.latestIntegratedBotId, 1).then(response => {
          if (response.data.code === "success") {
            window.Aside.loadAgents();
            Notification.info('Conversations assigned to ' + this.state.latestIntegratedBotName);
            this.setState({
              conversationsAssignedToBot: this.state.latestIntegratedBotName,
              conversationsAssignedToBotId : this.state.latestIntegratedBotId
            })
          } else {
            Notification.info('Conversations not assigned to ' + his.state.latestIntegratedBotName)
          }
        }).catch(err => {
          console.log(err)
        })

        this.onCloseModal();

      }


    render() {

      const product = CommonUtils.getProduct();

        return(
            <div className="km-bot-store-main-container">
                <div className={this.state.listOfIntegratedBots.length > (CommonUtils.isProductApplozic() ? 1:0) ?"banner-container" : "banner-container n-vis"}>
                  <div className="banner-div">
                    <span className="banner-sub-text">You have <span className="banner-main-text" style={{marginRight:"0px", paddingLeft:"0px"}}>{CommonUtils.isProductApplozic() ? this.state.listOfIntegratedBots.length - 1 : this.state.listOfIntegratedBots.length} bots</span>  integrated</span>

                    <a className="bot-routing-link brand-color" onClick={this.gotoBotIntegration} style={{marginLeft:"20px"}}>Manage</a>
                  </div>
                </div>
                {/* <div className={!this.state.useCaseSubmitted && CommonUtils.isKommunicateDashboard() ? "row mt-4 km-bot-integration-second-container":"n-vis"}>
                <div className="col-sm-6 km-bot-integration-second-container-text-container">
                  <p className="km-bot-request-bot-heading">Want a custom bot made for you?</p>
                  <p className="km-bot-request-bot-sub-heading">Tell us your bot use-case and we will take care of everything else</p>
                  <p className="brand-color" style={{fontSize : "16px"}} onClick={this.toggleUseCaseModal}>REQUEST CUSTOM BOT</p>
                </div>
                <div className="col-sm-6 km-bot-section-image" >
                <BotSectionSvg />
                </div>
                <div className="col-sm-4 km-bot-integration-second-container-cato-container">
                  
                </div>
              </div> */}

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

            { CommonUtils.isProductApplozic() && <Button secondary onClick={(e)=> {this.toggleBotIntegrationModal(true, "custom", 2)}} >CREATE BOT</Button> }

            <h4 className="km-bot-box-heading">Integrate your existing bot with {PRODUCTS[product].title}</h4>
           <div className="row km-bot-integration-boxes" >
                <div onClick={this.toggleDialogFlowModalWrapper} className="col-sm-6 km-bot-integration-logo-container" >
                 
                  <img src={Diaglflow} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                  <p className="km-bot-type">Dialogflow <br /> 
                  <span>Dialogflow is a Google-owned chatbot builder </span>
                  </p>
                  <p className="km-integrated-bot-text brand-color">
                  {this.integratedBotCount(SUPPORTED_PLATFORM.DIALOGFLOW,this.state.listOfIntegratedBots)>=1 ?  "INTEGRATE ANOTHER BOT" : "INTEGRATE BOT" } 
                  </p>
                  <p className={this.integratedBotCount(SUPPORTED_PLATFORM.DIALOGFLOW,this.state.listOfIntegratedBots)>0 ? "km-integrated-bot-info":"n-vis" } 
                  onClick={()=>{document.getElementsByClassName('item')[1].click()}} >{this.integratedBotCount(SUPPORTED_PLATFORM.DIALOGFLOW,this.state.listOfIntegratedBots)>1 ? (this.integratedBotCount(SUPPORTED_PLATFORM.DIALOGFLOW,this.state.listOfIntegratedBots )+ " bots") : (this.integratedBotCount(SUPPORTED_PLATFORM.DIALOGFLOW,this.state.listOfIntegratedBots) + " bot") }  integrated</p>
                
                </div>
              
                <div onClick={(e)=> {this.toggleBotIntegrationModal(true, "custom", 1)}} className="col-sm-6 km-bot-integration-logo-container" style={{marginLeft: "2%"}}>
                  
                  <BotDefaultImage/>
                  <p className="km-bot-type">Other bot platforms <br /> 
                  <span>For bot platforms other than Dialogflow</span>
                  </p>
                  <p className="km-integrated-bot-text brand-color">
                  {this.integratedBotCount(SUPPORTED_PLATFORM.CUSTOM,this.state.listOfIntegratedBots)>=1 ?  "INTEGRATE ANOTHER BOT" : "INTEGRATE BOT" } 
                  </p>

                  <p className={this.integratedBotCount(SUPPORTED_PLATFORM.CUSTOM,this.state.listOfIntegratedBots)>0 ? "km-integrated-bot-info":"n-vis" } 
                  onClick={()=>{document.getElementsByClassName('item')[1].click()}} >{this.integratedBotCount(SUPPORTED_PLATFORM.CUSTOM,this.state.listOfIntegratedBots)>1 ? (this.integratedBotCount(SUPPORTED_PLATFORM.CUSTOM,this.state.listOfIntegratedBots )+ " bots") : (this.integratedBotCount(SUPPORTED_PLATFORM.CUSTOM,this.state.listOfIntegratedBots) + " bot") }  integrated</p>
                
                </div>
            
              
              </div>

      


            {/* USECASE Modal */}
            {/* <Modal isOpen={this.state.useCaseModal} toggle={this.toggleUseCaseModal} className="modal-dialog">
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
                <TextArea rows="5" placeholder="Example: I need a bot for hotel booking. It should be able to manage bookings." onChange={(event) => this.setState({botUseCaseText: event.target.value})} value={this.state.botUseCaseText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <Button onClick={ () => {this.submitEmail("USE_CASE_REQUEST")} }>
                  Submit Usecase
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal> */}

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
                <textarea rows="5" className="form-control" style={{resize: "none"}} placeholder="Example: I need to integrate with this bot platform." onChange={(event) => this.setState({otherPlatformText: event.target.value})} value={this.state.otherPlatformText} />
              </div>
            </div>
            <div className="row" style={{marginTop: "66px"}}>
              <div className="col-sm-12 text-right">
                <Button onClick={ () => {this.submitEmail("BOT_PLATFORM_REQUEST")}}>
                  Submit Platform Request
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

          {/* Select dialogflow version modal */}
          <Modal isOpen={this.state.dialogFlowModal} toggle={this.toggleDialogFlowModal} className="modal-dialog">
                <div className="km-edit-section-header">
                  <span className="km-bot-delete-bot-modal-heading">Integrating your Dialogflow bot with Kommunicate</span>
              </div>
          <ModalBody>
              <div className="km-dialogflow-version-select">
                Select your Dialogflow version:
                <div className="km-dialogflow-radio">
                    <RadioButton className = "km-dialogflow-radio-v1" idRadioButton={'km-dialogflow-radio-v1'} handleOnChange={this.handleVersion} checked={this.state.botPlatformVersion == "DialogflowVersion1"} label="Dialogflow V1" />
                    <RadioButton className = "km-dialogflow-radio-v2" idRadioButton={'km-dialogflow-radio-v2'} handleOnChange={this.handleVersion} checked={this.state.botPlatformVersion == "DialogflowVersion2"} label="Dialogflow V2" />
                </div>
              </div>
              {
                this.state.botPlatformVersion === "DialogflowVersion1" ?
            <div>
              <div className="row">
                <div className="col-sm-12">
                  <p className="km-bot-integration-use-case-modal-text">Instructions:</p>
                  {BotDescription.dialogflowV1()}
                </div>
              </div>
              <div className="row">
                <label className="col-sm-3" htmlFor="hf-password">Client Token:</label>
                <div className="col-sm-9">
                  <input id= "km-client-token-bot"type="text" onChange = {(event) => this.setState({clientToken:event.target.value})} value ={this.state.clientToken} name="hf-password" className="form-control input-field"/>
                </div>
              </div>
              <div className="row mt-4">
                <label className="col-sm-3" htmlFor="hf-password">Dev Token:</label>
                <div className="col-sm-9">
                  <input id="km-dev-token-bot"type="text" onChange = {(event) => this.setState({devToken:event.target.value})} value ={this.state.devToken} name="hf-password" className="form-control input-field"/>
                </div>
              </div>
            </div>
              :
              <div>
                <div className="row">
                  <div className="col-sm-12">
                    <p className="km-bot-integration-use-case-modal-text">Instructions:</p>
                    {BotDescription.dialogflowV2()}
                  </div>
                </div>
                <div className="row form-group km-pushNotification-development">
                  <div className="km-dialog-flow-upload">Service account private key file :<span className="customer-type"> </span></div>
                  <div className="col-sm-6 col-md-6 km-input-component">
                    <InputFile id={'uploadJson'} className={'secondary'} text={"Upload File"} accept={'.json'} />
                  </div>
                </div>
              </div>
            }
              <div className="row" style={{marginTop: "66px"}}>
                <div className="col-sm-12 text-right">
                  <Button onClick={this.openBotProfileModal} disabled={this.state.enableButton}>
                    Next
                  </Button>
                </div>
              </div>
          </ModalBody>
          <CloseButton onClick={this.onCloseModal} />
        </Modal>

          {/* Set bot image and name modal */}
          <Modal isOpen={this.state.botProfileModal} toggle={this.toggleBotProfileModal} className="modal-dialog">
            <div className="km-edit-section-header">
              <div>
                <span className="km-selected-bot-name">Update your bot's profile</span>
              </div>
            </div>
                {  (CommonUtils.isKommunicateDashboard() && !CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan()) &&
                  <Banner appearance="info" heading={["Adding a bot will increase the number of team members in your plan ",<strong key={1} >(1 bot = 1 team member).</strong>," Your bill will be updated on pro rata basis."]} />
                }

                {  (CommonUtils.isKommunicateDashboard() && CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) &&
                  <Banner appearance="warning" heading={["Upgrade to a paid plan before your trial period ends ",<strong key={2} >({this.state.applicationExpiryDate})</strong>," to ensure that all bot related features continue to work"]} />
                }
                
            <ModalBody>
              
              <div className="km-edit-section-body" style={{borderBottom:"none", width:"100%"}}>
                <div className="km-edit-bot-image">
                  { this.state.setbotImageLink!== "" ?
                     <img src={this.state.setbotImageLink} className="km-default-bot-dp km-bot-image-circle"/>
                     :
                    <BotDefaultImage/>
                  }
                    <label htmlFor="km-upload-bot-image-select" id= "km-upload-bot-image-check" className="km-edit-section-hover" onClick={this.handleScale} style={{bottom:"-8px"}}> Update 
                      <input className="km-hide-input-element" type="file" id="km-upload-bot-image-select" accept="image/png, image/jpeg" />
                    </label>
              </div>
                <div className="km-bot-detail-design" style={{ marginTop: "22px"}}>
                  <div>
                    <div className="km-edit-bot-name-container" style={{marginBottom: "15px"}}>
                      <label style={{width:"40%"}}className="km-bot-edit-name-font km-restrict-bootstrap-margin">Bot Name:</label>
                        <input style={{border: "solid 1px #979797"}} type="text" onChange = {(event) => this.setState({botName:event.target.value})} value ={this.state.botName} className="form-control input-field" placeholder="Example: Alex, Bot " />
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
              <div className="" style={{marginTop: "20px"}}>
                <div className="km-cancel-delete">
                  <Button secondary onClick={this.onCloseModal} style={{marginRight: "16px"}}>Cancel</Button>
                  <Button onClick={() => {this.integrateBot("dialogflow")}} disabled={this.state.disableIntegrateBotButton}>
                    Integrate bot
                  </Button>
                </div>
              </div>
            </ModalBody>
        </Modal>
        {/* Modal for assigning conversations to integrated bot */}
          <Modal isOpen={this.state.botAssignmentModal} centered className="km-bot-assign-modal">
              
              <ConfirmationTick />
              <p className="bot-assignment-heading">{this.state.latestIntegratedBotName} has been integrated</p>
              {
                this.state.botRoutingEnabled == 1 ? 
                <p className="bot-assignment-subheading">
                  You currently have a different bot, <strong>{this.state.conversationsAssignedToBot}</strong>, handling all new conversations. Do you want to let this bot handle them instead?
                </p> : 
                <p className="bot-assignment-subheading">
                  You are currently not using any bot in conversations. Do you want to let this bot handle all new conversations?
                </p>
              }
              <p className="bot-assignment-note"><strong>Note:</strong> You can set it up later too from Settings > Conversation rules</p>
              <CloseButton onClick={this.onCloseModal}/>
               <div className="bot-assign-modal-footer">
                  <Button onClick={this.onCloseModal} secondary>I’ll set it up later</Button>
                  <Button onClick={this.assignConversationsToIntegratedBot}>Let this bot handle all conversations</Button>
                </div>
          </Modal>
            
            <BotIntegrationModal isOpen={this.state.openModal} onRequestClose={()=>{this.toggleBotIntegrationModal(false)}} style={customStyles} ariaHideApp={false}>
              <BotIntegrationModalContent step={this.state.step || 2} applicationExpiryDate = {this.state.applicationExpiryDate} integrationContent ={this.state.botIntegrationContent} closeModal={()=>{this.toggleBotIntegrationModal(false)}} aiPlatform = {this.state.botIntegrationType} assignmentModal={this.openIntegrationModal} setBotData={this.setBotCredentials}/>
              <CloseButton onClick={()=>{this.toggleBotIntegrationModal(false)}} />
            </BotIntegrationModal>
            </div>
            


        );
    }
}

export default withTheme(BotStore);