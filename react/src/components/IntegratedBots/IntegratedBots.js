import React, {Component} from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {sendProfileImage, updateApplozicUser, getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot, getAgentandBotRouting} from '../../utils/kommunicateClient';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Notification from '../../views/model/Notification';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import CloseButton from './../../components/Modal/CloseButton.js';
import {LizProfileSVG, LizFullSVG, BotDefaultImage , LizBotSvg} from '../../views/Faq/LizSVG.js';
import {SUPPORTED_PLATFORM} from '../../utils/Constant';
import CustomBotInputFields from '../../views/Bot/CustomBotInputFields'
import {createBot} from '../../utils/botPlatformClient';
import Button from '../Buttons/Button';

export default class IntegratedBots extends Component {

    constructor(props) {
        super(props);
        this.state = {
          checkedBotRoutingStatus:false,
          setbotImageLink:'',
          botImagefileObject:[],
          canvas: '',
          botPlatformVersion :'',
          copySuccess: "Copy",
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
          botAiPlatform: {"api.ai": "DialogFlow", "dialogflow": "DialogFlow", "microsoft": "microsoft", "amazon": "amazon", "custom":"Custom"},
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
          showLoader: false,
          webhookUrl:"",
          customBotKey:"",
          customBotValue:"",
        };
      let userSession = CommonUtils.getUserSession();
      this.applicationId = userSession.application.applicationId;
      this.onCloseModal = this.onCloseModal.bind(this);

       };

     componentWillMount= ()=>{
         this.getRoutingState();
     }

    componentDidMount=()=>{
        this.getIntegratedBotsWrapper();
    }

    clearBotDetails = ()=>{
        this.setState({
          devToken: '',
          clientToken: '',
          botName: '',
          editedBotName: '',
          editedClientToken: '',
          editedDevToken: ''
        });
       }

    getIntegratedBotsWrapper = () => {
        getIntegratedBots().then(response => {
            this.setState({
            listOfIntegratedBots: (response && response.allBots) ? response.allBots: [],
            dialogFlowBots: (response && response.dialogFlowBots) ? response.dialogFlowBots: [], showLoader: true,
            }, () => {
                this.getBotDetailsFromUserId(this.state.listOfIntegratedBots);
                this.state.listOfIntegratedBots.map(bot => {
                    if(bot.allConversations == 1 && this.state.checkedBotRoutingStatus === true){
                        this.setState({
                            conversationsAssignedToBot: bot.name
                        })
                    }
                })
            }
           )
        });
    }

    getRoutingState = () => {
        return Promise.resolve(getAgentandBotRouting()).then(response => {
            // response.data.response.botRouting && this.setState({assignConversationToBot:true})
            if (response.data.response.botRouting === false) {
                this.setState({
                    checkedBotRoutingStatus: false
                })
            }
            else {
                this.setState({
                  checkedBotRoutingStatus: true
                })
            }
        }).catch(err => {
            console.log("error while fetching routing state/round roubin state", err);
        })
    }
    toggleEditBotIntegrationModal = (botIdInUserTable, botKey,  botName, botUserName, botToken, botDevToken, botAvailable, botImageLink, bot) => {
        console.log("toggleEditBotIntegrationModal")
        this.clearBotDetails();
       // updating  state
        let customBotInfo = {}
        let updatedState ={};
        (bot && bot.aiPlatform) ? updatedState.botPlatform = bot.aiPlatform : "";

        botUserName?updatedState.botUserName =botUserName:"";
        botKey ? updatedState.botKey = botKey : "";
        updatedState.botAvailable =Boolean(botAvailable);
        botImageLink?updatedState.setbotImageLink=botImageLink:"";
        updatedState.editBotIntegrationModal = !this.state.editBotIntegrationModal;
        botName?(updatedState.editBotIntegrationModalHeader = botName, updatedState.editedBotName = botName) :"";
        botIdInUserTable? updatedState.botIdInUserTable = botIdInUserTable:"";
        (typeof botDevToken === 'undefined') ? updatedState.botPlatformVersion = 'Dialogflow Version V2' : updatedState.botPlatformVersion = 'Dialogflow Version V1';
        if (bot && bot.aiPlatform && bot.aiPlatform == SUPPORTED_PLATFORM.DIALOGFLOW) {

          botToken ? updatedState.editedClientToken = botToken : "";
          botDevToken ? updatedState.editedDevToken = botDevToken : "";
      } else if (bot && bot.aiPlatform && bot.aiPlatform == SUPPORTED_PLATFORM.CUSTOM) {
        customBotInfo.webhookUrl = bot.webhook;
        bot.webhookAuthentication && bot.webhookAuthentication.key && (customBotInfo.customBotKey = bot.webhookAuthentication.key);
        bot.webhookAuthentication && bot.webhookAuthentication.value && (customBotInfo.customBotValue = bot.webhookAuthentication.value);
        this.setState(customBotInfo)
      }
        

        this.setState(updatedState)
      }
      customBotIntegrationInputValue = (e,key) => {
        this.setState({[key] : e.target.value});
      }

      updateBotInfo = (patchUserData, data) => {
        Promise.all([patchUserInfo(patchUserData, this.state.botUserName, this.applicationId),createBot(data)])
          .then(([patchUserInfoResponse, patchBotInfoResponse]) => {
            if (patchUserInfoResponse.data.code === 'SUCCESS' && patchBotInfoResponse.status == 200) {
              Notification.info("Changes Saved successfully")
              this.toggleEditBotIntegrationModal()
              this.getIntegratedBotsWrapper()
            }
            this.getIntegratedBotsWrapper()
          }).catch(err => { console.log(err) })

      }
      saveEditedBotDetails = (botPlatform) => {
        let axiosPostData ={
          aiPlatform: botPlatform,
          type:"KOMMUNICATE_SUPPORT"
        };
        let patchUserData = {
          name: this.state.editedBotName,
        }
        let botDetails = {
          id: this.state.botKey
        }
          if (botPlatform == SUPPORTED_PLATFORM.DIALOGFLOW) {
            if (this.state.botPlatformVersion == "Dialogflow Version V1" && (!this.state.editedBotName.trim() || !this.state.editedClientToken.trim() || !this.state.editedDevToken.trim())) {
              Notification.info("Client token, Dev token and Bot name are mandatory");
              return
            } else if (this.state.botPlatformVersion == "Dialogflow Version V2" && (!this.state.editedBotName)) {
              Notification.info("Bot name mandatory");
              return
            }
            this.state.editedClientToken && (axiosPostData.clientToken = this.state.editedClientToken);
            this.state.editedDevToken && (axiosPostData.devToken = this.state.editedDevToken);
            if (this.state.botName.trim().toLowerCase() !== this.state.editedBotName.trim().toLowerCase() || this.state.clientToken.trim().toLowerCase() !== this.state.editedClientToken.trim().toLowerCase() || this.state.devToken.trim().toLowerCase() !== this.state.editedDevToken.trim().toLowerCase()) {
              botDetails["botInfo"] = axiosPostData
              this.updateBotInfo(patchUserData,botDetails)
            } else {
              Notification.info("Changes Saved successfully");
              this.toggleEditBotIntegrationModal();
            }

        } else if (botPlatform == SUPPORTED_PLATFORM.CUSTOM) {
            if (this.state.webhookUrl.trim() && this.state.editedBotName.trim()) {
              botDetails["botInfo"] = {}
              botDetails.botInfo["webhook"] = this.state.webhookUrl.trim();
              (this.state.customBotKey.trim() || this.state.customBotValue.trim()) && (botDetails.botInfo["webhookAuthentication"] = {});
              this.state.customBotKey.trim() && (botDetails.botInfo.webhookAuthentication["key"] = this.state.customBotKey.trim());
              this.state.customBotValue.trim() && (botDetails.botInfo.webhookAuthentication["value"] = this.state.customBotValue.trim());
              this.updateBotInfo(patchUserData,botDetails)
            } else {
              Notification.info("Webhook url and bot name are mandatory")
            }
          }
        
      }

      deleteBot = () => {

        let patchUserData = {
          deleted_at:new Date()
        }

        patchUserInfo(patchUserData, this.state.botUserName, this.applicationId).then(response => {
          if(response.data.code === 'SUCCESS'){
            Notification.info("Deleted successfully")
            this.toggleDeleteBotIntegrationModal()
            this.getIntegratedBotsWrapper()
          }
        })
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

      toggleDeleteBotIntegrationModal = (botUserName) => {
        // this.clearBotDetails();
        this.setState({
          deleteBotIntegrationModal: !this.state.deleteBotIntegrationModal
        })
        if(botUserName){
          let updatedState ={};
          botUserName?updatedState.botUserName =botUserName:"";
          this.setState(updatedState)
        }
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

      copyToClipboard = (e) => {
        e.preventDefault();
        var testID = e.target.parentNode.parentNode.childNodes[0].id;
        var copyText = document.getElementById(testID);
        copyText.select();
        document.execCommand("copy");
        e.target.focus();
        this.setState({ copySuccess: "Copy" });
        Notification.info("Copied successfully!");
      };

      onCloseModal = () => {
        this.setState({
          deleteBotIntegrationModal: false,
          editBotIntegrationModal: false,
          setbotImageLink:""
        });
      };

      botImageFileInput = (e) => {
        e.preventDefault();
        var botUserNameUpload = this.state.botUserName;
        var inputDiv = document.getElementById('km-bot-image-file-input-id');
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute( 'id', this.state.botUserName);
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('multiple', 'multiple');
        fileSelector.click();
        inputDiv.appendChild(fileSelector);
        this.handleScale(botUserNameUpload);
      };

      handleScale = (botUserNameUpload) => {
        let that=this;
        document.getElementById(botUserNameUpload).addEventListener("change", function(){
          that.setState({
            botImagefileObject: document.getElementById(botUserNameUpload).files[0]
          });
          that.uploadImageToS3(that.state.botImagefileObject, botUserNameUpload);
        });
      }
      // window.$kmApplozic.fn.applozic
      uploadImageToS3 = (blob, botUserNameUpload) => {
        let that=this;
        let file = blob
        let imageUrl = ''
        if (file) {
          sendProfileImage(file, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${file.name.split('.').pop()}`)
            .then(response => {
              if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                that.setState({ setbotImageLink: response.data.profileImageUrl });
                imageUrl = response.data.profileImageUrl
                updateApplozicUser({ imageLink: response.data.profileImageUrl, userId: botUserNameUpload })
                  .then(response => {
                    console.log(response);
                    Notification.info("Successfully uploaded..");
                  }
                  )
                  .catch(err => {
                    console.log(err)
                    Notification.info("Error while uploading")
                  })
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

      getBotDetailsFromUserId = (userId) => {
        let that=this;
        var userIdListArray = [];
        var integratedBotsList = userId;
        for (var i = 0; i < integratedBotsList.length; i++){
          userIdListArray[i] = integratedBotsList[i].userName.toLowerCase().replace(/ /g, '-');
        };
        let userSession = CommonUtils.getUserSession();
        let userDetailUrl =getConfig().applozicPlugin.userDetailUrl;
        let applicationId = userSession.application.applicationId;
        let userIdList = {"userIdList" : userIdListArray}
        axios({
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
            var responseData = response.data.response;
            var sortedListOfIntegratedBots = that.state.listOfIntegratedBots;
            var arr = [];
            for(var j = 0; j < responseData.length; j++){
              arr[responseData[j].userId] = responseData[j];
            };
            for (var j = 0; j< sortedListOfIntegratedBots.length; j++) {
              if (arr[sortedListOfIntegratedBots[j].userName]) {
                sortedListOfIntegratedBots[j].imageLink = arr[sortedListOfIntegratedBots[j].userName].imageLink;
              }
            }

            that.setState({
              listOfIntegratedBots: sortedListOfIntegratedBots
            });
          }
        }).catch(err=>{
          Notification.error("Oops! Something went wrong. Please refresh the page or try again after sometime");
          console.log('uploading error',err)
          return;
        });
      }

    render() {

      let listOfIntegratedBotWithoutLiz = this.state.listOfIntegratedBots.filter(function(i) {
        return i.userName !== "liz";
      });

        return(
          <div>
            <div className=" ui tab loading show-loader" hidden={this.state.showLoader}></div>
            <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>

                <div style={{padding: "10px"}} className={this.state.conversationsAssignedToBot ? "product product-kommunicate":"n-vis"}>
                    <div className="banner-container">
                      <div className="banner-div">
                        <span className="banner-sub-text">All new conversations are assigned to: </span>
                        <span className="banner-main-text">{this.state.conversationsAssignedToBot ? this.state.conversationsAssignedToBot:'No Bot'}</span>
                        <Link className="bot-routing-link" to="/settings/agent-assignment">Manage</Link>
                      </div>
                    </div>

                </div>
                <div className={this.state.conversationsAssignedToBot ? "n-vis":"product product-kommunicate"}>
                  <div className="banner-container">
                    <div className="banner-div banner-div--warning">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <span className="banner-sub-text">None of your integrated bots are currently assigned in conversations</span> <Link className="bot-routing-link" style={{marginLeft:"15px"}} to="/settings/agent-assignment">Manage</Link>
                    </div>
                  </div>
                </div>

                 <div className="container km-liz-container product product-kommunicate">
                  <div className="km-liz-section-wrapper row ">
                      <div className="km-liz-img col-md-5"><LizBotSvg /></div>
                      <div className="km-liz-section-content col-md-7">
                        <div className="km-liz-text">
                        <div className="km-pre-integrated">Pre-integrated</div>
                        <div className="km-liz-section-heading">
                          <span>Liz </span> - FAQ bot by Kommunicate</div>
                        </div>
                        <div className="km-liz-section-textcontent">
                          Let Liz answer common queries and let your team concentrate on more complex ones. Just fill up your <Link className="km-liz-link" to='/faq'>FAQs</Link> and then <Link className="km-liz-link" to='/settings/agent-assignment'>Assign</Link> conversatons to Liz.
                        </div>
                        <div className="km-edit-bot-name-container" style={{border:"1px dashed #bcb7b7",width:'184px',paddingLeft:"8px",marginLeft:"3px"}}>
                           <label className="km-bot-edit-name-font km-restrict-bootstrap-margin" >Bot ID:</label>
                               <div className="km-copy-name-from-box" style={{width:"190px"}}>
                                     <textarea className="km-textArea-custom-color" style={{marginBottom : "3px" , width:"25px"}} id="bot202" value='liz' readOnly/>
                                  <div className="km-copy-name-from-box-icon">
                                    <button onClick={this.copyToClipboard} style={{display:"block",opacity:1,visibility:"visible"}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="none" d="M0 0h24v24H0z"/>
                                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" fill="#969393"/>
                                        </svg>
                                        {this.state.copySuccess}
                                    </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>

                {/* Already created bot List */}
                <div className="km-bot-list-of-integrated-bots-container">
                {listOfIntegratedBotWithoutLiz.length >= 1  ?
                  <div className="row" style={{borderBottom: "1px solid #e2e2e5"}}>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                      <p className="km-bot-list-table-heading">BOT NAME</p>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                      <p className="km-bot-list-table-heading">BOT ID</p>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                      <p className="km-bot-list-table-heading">BOT PLATFORM</p>
                    </div>
                  </div> : "" }

                  {listOfIntegratedBotWithoutLiz.map(bot => (

                    <div className="row km-integrated-bot-list-row" key={bot.id} data-user-name={bot.userName}>
                      <div className="col-md-3 col-sm-6 col-xs-12 km-image-name">
                        <div className="km-bot-image-edit-section">
                          { bot.imageLink!== undefined ?
                            <img src={bot.imageLink} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin km-bot-image-circle" />
                            :
                            <BotDefaultImage/>}
                        </div>
                        <div className="km-bot-name-size-restriction">
                            <span className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</span>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6 col-xs-12">
                        <div className="km-copy-name-from-box" style={{marginLeft:"-10px"}}>
                                  <textarea className="km-textArea-custom-color"id={"km-"+bot.userName+"copy-text"} value={bot.userName} readOnly/>
                              <div style={{opacity:1,visibility:"visible"}} className="km-copy-name-from-box-icon">
                                <button onClick={this.copyToClipboard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="none" d="M0 0h24v24H0z"/>
                                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" fill="#969393"/>
                                    </svg>
                                    {this.state.copySuccess}
                                </button>
                              </div>
                          </div>
                      </div>

                      <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="km-bot-platform-container">
                          <span className="km-bot-list-of-integrated-bots-ai-platform-name">{this.state.botAiPlatform[(bot.aiPlatform) ? bot.aiPlatform.toLowerCase() : '']}</span>
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-6 col-xs-12 km-bot-edit-delete">
                            <span className="teammates-delete-wrapper" onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.userKey, bot.name, bot.userName, bot.token||bot.clientToken, bot.devToken, bot.bot_availability_status, bot.imageLink, bot)}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
                                  <g fill="#8B8888" fillRule="nonzero">
                                      <path d="M8.52 1.29l-.431.432-1.036 1.036-1.25 1.249-1.078 1.079c-.176.176-.356.347-.527.527l-.008.007.306-.126-.968.007-.139.001.432.432.008-.968v-.138c-.041.101-.083.204-.126.305l.434-.434 1.04-1.04 1.25-1.249 1.082-1.082c.173-.173.343-.348.518-.518a.36.36 0 0 1 .03-.027L7.97.85a.253.253 0 0 1 .053-.03l-.104.044A.368.368 0 0 1 7.977.85l-.115.015a.264.264 0 0 1 .058.002 4.149 4.149 0 0 0-.114-.015.27.27 0 0 1 .042.012L7.745.82a.245.245 0 0 1 .051.03L7.71.783c.102.083.192.188.286.282l.432.432c.037.038.078.073.112.116l-.068-.088a.253.253 0 0 1 .03.053l-.044-.104c.006.02.01.038.014.058a4.149 4.149 0 0 1-.015-.115.273.273 0 0 1-.002.06l.015-.115a.384.384 0 0 1-.017.057l.043-.103c-.008.014-.014.027-.024.039l.068-.088a.106.106 0 0 1-.018.023.45.45 0 0 0-.127.305.432.432 0 0 0 .737.305.677.677 0 0 0 .192-.469.67.67 0 0 0-.192-.453C9.106.95 9.078.924 9.05.896L8.64.486C8.543.39 8.447.29 8.348.195a.66.66 0 0 0-.935.012l-.321.322-.657.656-.852.853c-.302.3-.603.602-.904.903l-.808.809-.577.576-.155.155-.037.037a.47.47 0 0 0-.134.317c-.013.333-.005.666-.008.999l-.001.102c-.002.232.2.434.431.432l.784-.006c.106-.002.212 0 .317-.003a.488.488 0 0 0 .338-.154l.791-.791 1.408-1.408 1.381-1.381c.238-.238.479-.473.713-.712l.01-.01c.16-.16.171-.454 0-.611a.438.438 0 0 0-.611-.001z"/>
                                      <path d="M8.52 1.29l-.75.75-.104.105h.61l-.96-.961-.136-.136v.611l.756-.756c.04-.04.078-.084.124-.12L7.972.85a.253.253 0 0 1 .053-.03l-.103.044A.368.368 0 0 1 7.979.85l-.115.015a.264.264 0 0 1 .059.002 4.149 4.149 0 0 0-.115-.015.27.27 0 0 1 .042.012L7.747.82a.245.245 0 0 1 .052.03L7.71.783c.103.083.192.188.286.282l.432.432c.038.038.079.073.112.116l-.068-.088a.253.253 0 0 1 .03.053l-.044-.104c.007.02.01.038.014.058a4.149 4.149 0 0 1-.015-.115.273.273 0 0 1-.002.06l.015-.115a.384.384 0 0 1-.017.057l.043-.103c-.008.014-.014.027-.024.039l.068-.088a.45.45 0 0 0-.147.328.432.432 0 0 0 .737.305.673.673 0 0 0 .17-.627.656.656 0 0 0-.176-.302l-.16-.16-.517-.516C8.393.24 8.341.187 8.278.138a.656.656 0 0 0-.864.066l-.42.42-.425.425a.439.439 0 0 0 0 .611l.96.96.137.137a.439.439 0 0 0 .61 0l.75-.75.105-.105c.16-.16.172-.454 0-.611a.438.438 0 0 0-.61-.001z"/>
                                      <path d="M8.461 3.928v4.318a.67.67 0 0 1-.006.093l.015-.114a.712.712 0 0 1-.042.154l.043-.104a.72.72 0 0 1-.085.148l.068-.087a.7.7 0 0 1-.12.12l.087-.068a.72.72 0 0 1-.148.085l.104-.043a.74.74 0 0 1-.154.042c.037-.006.076-.011.114-.015-.087.01-.178.006-.265.006H1.099a.706.706 0 0 1-.096-.006l.114.015a.712.712 0 0 1-.154-.042l.104.043a.72.72 0 0 1-.148-.085l.087.068a.7.7 0 0 1-.12-.12l.068.087a.72.72 0 0 1-.085-.148l.043.104a.74.74 0 0 1-.042-.154c.006.037.011.076.015.114-.01-.087-.006-.178-.006-.266V7.56 5.844 3.747 1.951v-.85c0-.032.002-.065.006-.096l-.015.114A.712.712 0 0 1 .912.965l-.043.104A.72.72 0 0 1 .954.92l-.068.087a.7.7 0 0 1 .12-.12L.92.956a.72.72 0 0 1 .148-.085L.963.914a.74.74 0 0 1 .154-.042c-.037.006-.076.01-.114.015.159-.02.327-.006.487-.006H4.87c.178 0 .355.003.534 0h.007c.226 0 .443-.199.432-.432a.44.44 0 0 0-.432-.432H1.1A1.073 1.073 0 0 0 .041.86c-.044.234-.027.48-.027.718v6.122c0 .183-.002.366 0 .55.004.289.121.582.336.78.204.186.462.293.74.295h7.051c.13 0 .253-.003.382-.035.474-.123.798-.57.8-1.054V7.26 5.527 4.141v-.214c0-.226-.2-.443-.432-.432a.44.44 0 0 0-.43.433z"/>
                                  </g>
                              </svg>
                              Edit
                            </span>
                            &nbsp;&nbsp;&nbsp;
                            <span onClick={ (event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleDeleteBotIntegrationModal(bot.userName)}} className="teammates-delete-wrapper">
                              <svg  xmlns="http://www.w3.org/2000/svg" width="10"    height="12" viewBox="0 0 10 12">
                                <g fill="#8B8888" fillRule="nonzero">
                                  <path d="M.357 2.5a.357.357 0 0 1 0-.714h9.286a.357.357 0 1 1 0 .714H.357zM5.357 8.929a.357.357 0 1 1-.714 0v-5a.357.357 0 0 1 .714 0v5zM3.928 8.903a.357.357 0 1 1-.713.051l-.357-5a.357.357 0 0 1 .713-.05l.357 5zM6.785 8.954a.357.357 0 1 1-.713-.05l.357-5a.357.357 0 1 1 .713.05l-.357 5z"/>
                                  <path d="M3.214 2.143a.357.357 0 1 1-.714 0v-.714C2.5.837 2.98.357 3.571.357H6.43C7.02.357 7.5.837 7.5 1.43v.714a.357.357 0 1 1-.714 0v-.714a.357.357 0 0 0-.357-.358H3.57a.357.357 0 0 0-.357.358v.714z"/>
                                  <path d="M.716 2.173a.357.357 0 0 1 .355-.387H8.93c.209 0 .373.178.355.387l-.66 7.916c-.046.555-.51.982-1.067.982H2.443a1.071 1.071 0 0 1-1.068-.982l-.66-7.916zm.744.327l.627 7.53c.015.185.17.327.356.327h5.114c.186 0 .34-.142.356-.327L8.54 2.5H1.46z"/>
                                </g>
                              </svg>
                              Delete
                            </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal for editing already created bot */}
                <Modal isOpen={this.state.editBotIntegrationModal} toggle={this.toggleEditBotIntegrationModal} className="modal-dialog modal-dialog--edit" style={{width: "100%",marginTop: "70px"}}>
                    <div className="km-edit-section-header">
                      <div>
                        <span className="km-bot-delete-bot-modal-heading">Edit bot integration - </span>
                        <span className="km-selected-bot-name">{this.state.editBotIntegrationModalHeader}</span>
                      </div>
                    </div>
                    <div className="km-edit-section-body">
                      <div className="km-edit-bot-image">
                        { this.state.setbotImageLink!== "" ?
                          <img src={this.state.setbotImageLink} className="km-default-bot-dp km-bot-image-circle"/>
                          :
                          <BotDefaultImage/>
                        }
                          <div id= "km-bot-image-file-input-id" className="km-edit-section-hover" onClick={this.botImageFileInput}>Update
                          </div>
                    </div>
                      <div className="km-bot-detail-design">
                        <div>
                          <div className="km-edit-bot-name-container" style={{marginBottom: "15px"}}>
                            <label className="km-bot-edit-name-font km-restrict-bootstrap-margin">Bot Name:</label>
                              <input type="text" onChange = {(event) => this.setState({editedBotName:event.target.value})} value={this.state.editedBotName} className="form-control input-field km-change-bot-name-color-onfocus" />
                          </div>
                        </div>
                        <div>
                          <div className="km-edit-bot-name-container">
                            <label className="km-bot-edit-name-font km-restrict-bootstrap-margin">Bot ID:</label>
                            <div className="km-copy-name-from-box" style={{marginLeft:"-25px", border:"1px dashed #bcb7b7"}}>
                                      <textarea className="km-textArea-custom-color" id="km-copy-liz-text" value={this.state.botUserName} readOnly/>
                                  <div style={{opacity:1,visibility:"visible",display:'block'}} className="km-copy-name-from-box-icon">
                                    <button onClick={this.copyToClipboard} style={{opacity:1,visibility:'visible'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="none" d="M0 0h24v24H0z"/>
                                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" fill="#969393"/>
                                        </svg>
                                        {this.state.copySuccess}
                                    </button>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  <ModalBody>
                  <div>
                    <div className="km-dialogflow-version-select-edit">
                     {  this.state.botPlatform == SUPPORTED_PLATFORM.DIALOGFLOW &&
                        <div>
                        { this.state.botPlatformVersion}
                        </div>
                     }
                    </div>
                  { this.state.botPlatform == SUPPORTED_PLATFORM.DIALOGFLOW && this.state.botPlatformVersion === "Dialogflow Version V1" &&
                    <div>
                      <div className="km-edit-bot-credentials" style={{marginBottom: "20px"}}>
                        <label className="km-restrict-bootstrap-margin km-edit-bot-credentials-text">Client Token:</label>
                        <div style={{width: "50%"}}>
                          <input id="km-integrated-bots-client-token" type="text" onChange = {(event) => this.setState({editedClientToken:event.target.value})} value ={this.state.editedClientToken} name="hf-password" className="form-control input-field"/>
                        </div>
                      </div>
                      <div className="km-edit-bot-credentials">
                        <label className="km-restrict-bootstrap-margin km-edit-bot-credentials-text">Dev Token:</label>
                        <div style={{width: "50%"}}>
                          <input id="km-integrated-bots-dev-token" type="text" onChange = {(event) => this.setState({editedDevToken:event.target.value})} value ={this.state.editedDevToken} name="hf-password" className="form-control input-field"/>
                        </div>
                      </div>
                    </div>
                  }
                  { this.state.botPlatform == SUPPORTED_PLATFORM.DIALOGFLOW && this.state.botPlatformVersion === "Dialogflow Version V2" &&
                    <div style={{display:"flex", alignItems:"center"}}>
                      <div className="km-dialogflowV2-key-file">Service account private key file :<span className="customer-type"> </span></div>
                      <label className="km-button km-button--secondary km-btn-file-label km-dialogflowV2-key-file-btn">
                        <span>Key File uploaded</span>
                      </label>
                    </div>
                  }
                  { this.state.botPlatform == SUPPORTED_PLATFORM.CUSTOM &&
                      <div>
                        <CustomBotInputFields webhookUrl ={this.state.webhookUrl}  customBotKey ={this.state.customBotKey} customBotValue ={this.state.customBotValue} customBotIntegrationInputValue = {this.customBotIntegrationInputValue}/>
                      </div>
                  }
                    <div className="" style={{marginTop: "66px"}}>
                      <div className="km-cancel-delete">
                        <Button secondary onClick={this.onCloseModal} style={{marginRight: "16px"}}>
                          Cancel
                        </Button>
                        <Button onClick={()=> {this.saveEditedBotDetails(this.state.botPlatform)}}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                  </ModalBody>
                  <CloseButton  onClick={this.onCloseModal} />
                </Modal>

                {/* Modal for deleting already created bot */}
                <Modal isOpen={this.state.deleteBotIntegrationModal} toggle={this.toggleDeleteBotIntegrationModal} className="modal-dialog modal-dialog--delete-bot km-delete-bot-position">
                  <div className="km-delete-box-header">
                    <span className="km-bot-delete-bot-modal-heading">Delete bot - </span>
                    <span className="km-selected-bot-name">{this.state.botUserName}</span>
                  </div>
                  <ModalBody>
                    <div className="km-bot-delete-text">
                        <p className="km-bot-integration-use-case-modal-text-style">On deleting this bot integration, you will no longer be able to use this bot in conversations.</p>
                        <p className="km-bot-integration-use-case-modal-text-style">Are you sure?  </p>
                    </div>
                    <div className="km-cancel-delete">
                      <Button secondary className="team-delete-modal-cancel-btn" onClick={this.onCloseModal}>
                        Cancel
                      </Button>
                      <Button onClick={this.deleteBot}>
                        Yes, Delete
                      </Button>
                    </div>
                  </ModalBody>
                  <CloseButton onClick={this.onCloseModal} />
                </Modal>
              </div>
              </div>
        );
    }

}
