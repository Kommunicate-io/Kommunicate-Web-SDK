import React, {Component} from 'react';
import CommonUtils from '../../utils/CommonUtils';
import {getUsersByType,createCustomerOrAgent, callSendEmailAPI, getIntegratedBots, patchUserInfo, conversationHandlingByBot} from '../../utils/kommunicateClient';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Notification from '../../views/model/Notification';
import  {getConfig,getEnvironmentId,get} from '../../config/config.js';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import SliderToggle from '../../components/SliderToggle/SliderToggle';

import Cato from '../../views/Bot/images/cato-bot-integration.png'
import Amazon from '../../views/Bot/images/amazon-icon.png'
import Diaglflow from '../../views/Bot/images/dialogflow-icon.png'
import Microsoft from '../../views/Bot/images/microsoft-icon.png'
import Tick from '../../views/Bot/images/tick-icon.png'
import KmIcon from '../../views/Bot/images/km-icon.png'
import NoteIcon from '../../views/Bot/images/note-icon.png';

export default class IntegratedBots extends Component {

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
          showLoader: false
        };
      let userSession = CommonUtils.getUserSession();
      this.applicationId = userSession.application.applicationId;
    
       };

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

    getIntegratedBotsWrapper = () => {
        getIntegratedBots().then(response => {
            this.setState({
            listOfIntegratedBots: (response && response.allBots) ? response.allBots: [],
            dialogFlowBots: (response && response.dialogFlowBots) ? response.dialogFlowBots: [], showLoader: true,
            }, () => {
                this.state.listOfIntegratedBots.map(bot => {
                    if(bot.allConversations == 1){
                        this.setState({
                            conversationsAssignedToBot: bot.name
                        })
                    }
                })
            }
           )
        });
    }

    toggleEditBotIntegrationModal = (botIdInUserTable, botKey,  botName, botUserName, botToken, botDevToken, botAvailable) => {
        console.log("toggleEditBotIntegrationModal")
        this.clearBotDetails();
       // updating  state
        let updatedState ={};
        updatedState.editBotIntegrationModal = !this.state.editBotIntegrationModal;
        botIdInUserTable? updatedState.botIdInUserTable = botIdInUserTable:"";
        botKey?updatedState.botKey=botKey:"";
        botName?(updatedState.editBotIntegrationModalHeader = botName, updatedState.editedBotName = botName) :"";
        botToken?updatedState.editedClientToken=botToken:"";
        botDevToken?updatedState.editedDevToken=botDevToken:"";
        botUserName?updatedState.botUserName =botUserName:"";
        updatedState.botAvailable =Boolean(botAvailable);
        
        this.setState(updatedState)
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

      toggleDeleteBotIntegrationModal = () => {
        // this.clearBotDetails();
        this.setState({
          deleteBotIntegrationModal: !this.state.deleteBotIntegrationModal
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
    


    render() {
        return(
          <div>
            <div className=" ui tab loading show-loader" hidden={this.state.showLoader}></div>
            <div className={this.state.listOfIntegratedBots.length > 0 ? "mt-4 km-bot-integrated-bots-container":"n-vis"}>
                
                <div style={{padding: "10px"}} className={this.state.conversationsAssignedToBot ? null:"n-vis"}>
                    <div className="banner-container">
                      <div className="banner-div">
                        <span className="banner-sub-text">All new conversations are assigned to: </span>
                        <span className="banner-main-text">{this.state.conversationsAssignedToBot ? this.state.conversationsAssignedToBot:'No Bot'}</span>
                        <Link className="bot-routing-link" to="/settings/agent-assignment">Manage</Link>
                      </div>
                    </div>
                    {/* <div style={{marginTop: "20px"}}>
                        <span className="integrated-bot-assigned-bot-text">All new conversations are assigned to : </span>
                        <span style={{display: "inline-block", border: "1px dashed #d0cccc", padding: "5px"}}>
                        <img src={Diaglflow} style={{ width: "39px", height: "37.5px"}} /> 
                        <span>{this.state.conversationsAssignedToBot ? this.state.conversationsAssignedToBot:'No Bot'}</span> 
                        </span> 
                    </div> */}
                    
                </div>
                <div className={this.state.conversationsAssignedToBot ? "n-vis":null}>
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
                {/* <div style={{backgroundColor: "#cce7f8", height: "41px", textAlign: "center"}}>
                  <span className="integrated-bot-converstaion-routing-text">You may change conversation assignment settings from <Link className="bot-routing-link" to="/settings/agent-assignment">Conversation routing</Link></span>
                </div> */}
                {/* <div style={{padding: "10px"}}>
                  <span className="km-bot-integrated-bots-container-heading">Integrated Bots:</span>
                  <hr />
                </div> */}


                {/* Already created bot List */}
                <div className="km-bot-list-of-integrated-bots-container">
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
                    <div className="col-md-2 col-sm-6 col-xs-12">
                      <p className="km-bot-list-table-heading">STATUS</p> 
                    </div>
                  </div>
                  {this.state.listOfIntegratedBots.map(bot => (

                    <div className="row km-integrated-bot-list-row" key={bot.id} data-user-name={bot.userName} onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.key, bot.name, bot.userName, bot.token||bot.clientToken, bot.devToken, bot.bot_availability_status)}}>
                      <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* <div style={{marginRight: "8px"}}>
                          <img src={Diaglflow} style={{marginTop: "0px"}} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                        </div> */}
                        <div>
                            <span className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</span>
                        </div> 
                      </div>

                      <div className="col-md-4 col-sm-6 col-xs-12">
                        <span className="km-bot-list-of-integrated-bots-bot-name">{bot.userName}</span>
                      </div>

                      <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="km-bot-platform-container">
                          <div className="km-bot-integration-dialogflow-icon-container">
                            <img src={Diaglflow} style={{marginTop: "0px"}} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                          </div>
                          <span className="km-bot-list-of-integrated-bots-ai-platform-name">{this.state.botAiPlatform[(bot.aiPlatform) ? bot.aiPlatform.toLowerCase() : '']}</span>
                        </div>
                        {/* <div>
                          <span>
                            <span className="km-bot-list-of-integrated-bots-ai-platform-name">{this.state.botAiPlatform[(bot.aiPlatform) ? bot.aiPlatform.toLowerCase() : '']}</span>
                            <br />
                            <span className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</span>
                          </span>
                        </div> */}
                      </div>

                      <div className="col-md-2 col-sm-6 col-xs-12">
                      { 
                            bot.bot_availability_status == 1 ?
                            <div className="badge-container badge-container--success">
                              <div className="badge-circle"></div>
                              <div className="badge-text">Enabled</div>
                            </div> :
                            <div className="badge-container badge-container--no_outline badge-container--error">
                              <div className="badge-circle"></div>
                              <div className="badge-text">Disabled</div>
                            </div>
                          }
                      </div>
                    </div>

                    // <div className="container" key={bot.id}>
                    //   <div className="row">
                    //     <div className="col-sm-2">
                    //       { 
                    //         bot.bot_availability_status == 1 ? <span className="km-bot-list-of-integrated-bots-badge badge-enabled">Enabled</span> : <span className="km-bot-list-of-integrated-bots-badge badge-disabled">Disabled</span>
                    //       }
                    //     </div>
                    //     <div className="row col-sm-5">
                    //       <div style={{marginRight: "8px"}}>
                    //         <img src={Diaglflow} style={{marginTop: "0px"}} className="km-bot-integration-dialogflow-icon km-bot-integration-icon-margin" />
                    //       </div>
                    //       <div>
                    //         <span>
                    //           <span className="km-bot-list-of-integrated-bots-ai-platform-name">{this.state.botAiPlatform[(bot.aiPlatform) ? bot.aiPlatform.toLowerCase() : '']}</span>
                    //           <br />
                    //           <span className="km-bot-list-of-integrated-bots-bot-name">{bot.name}</span>
                    //         </span>
                    //       </div> 
                    //     </div>
                    //     <div className="col-sm-4">
                    //       <span className="km-bot-list-of-integrated-bots-bot-name">Bot ID: {bot.userName}</span>
                    //     </div>
                    //     <div className="col-sm-1" style={{textAlign: "right"}}>
                    //       <button className="btn btn-primary" data-user-name={bot.userName} onClick={(event) => {console.log(event.target.getAttribute('data-user-name')); this.toggleEditBotIntegrationModal(bot.id, bot.key, bot.name, bot.userName, bot.token, bot.devToken, bot.bot_availability_status)}}>
                    //         Edit
                    //       </button>
                    //     </div>
                    //   </div>
                    //   <hr />
                    // </div>
                  ))}
                </div>

                {/* Modal for editing already created bot */}
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

                {/* Modal for deleting already created bot */}
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
              </div>
              </div>
        );
    }

}