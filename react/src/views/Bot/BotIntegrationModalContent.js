import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { BotDefaultImage } from '../../views/Faq/LizSVG.js';
import CustomBotInputFields from './CustomBotInputFields'
import {createCustomerOrAgent, sendProfileImage} from '../../utils/kommunicateClient';
import Notification from '../model/Notification';
import ApplozicClient from '../../utils/applozicClient';
import {createBot} from '../../utils/botPlatformClient';
import { ROLE_TYPE, SUPPORTED_PLATFORM, DEFAULT_BOT_IMAGE_URL } from '../../utils/Constant';
import CommonUtils from '../../utils/CommonUtils';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { Title, Instruction, Footer, BotProfileContainer} from './BotStyle'
import Linkify from 'react-linkify';
import Banner from '../../components/Banner';
import BotDescription from './BotDescription.js';
import AnalyticsTracking from '../../utils/AnalyticsTracking';



function BotIntegrationTitle(props) {
    return (
        <Title>
            <p className="bot-integration-title">{props.title}</p>
            <hr/>
            <p className="bot-integration-sub-title">{props.subTitle}</p>
        </Title>
    )
}

function BotIntegrationInstructions() {
    return (
        <Instruction>
            {BotDescription.customBot()}
        </Instruction>
        
    )
}
function BotIntegrationModalFooter(props) {
    return (
        <Footer>
            <button data-button-text="Cancel" className="km-button km-button--secondary bot-integration-cancel-button" onClick={props.closeModal}>Cancel</button>
            <button data-button-text={props.buttonText} className="km-button km-button--primary bot-integration-cancel-next" onClick={props.onButtonClick}>{props.buttonText}</button>
        </Footer>
    )
}
function BotProfile(props) {
    return (             
        <BotProfileContainer>
          
            <div className="km-edit-bot-image-wrapper">
                {props.botImage ?
                    <img src={props.botImage} className="km-default-bot-dp km-bot-image-circle" />
                    :
                    <BotDefaultImage />
                }
                <label htmlFor="km-bot-integration-image-select" id="bot-integration-upload-bot-image-label" className="km-bot-integration-edit-section-hover bot-image-update" style={{ bottom: "-8px" }} onClick={props.handleBotImageUpload} > Update
                  <input className="km-hide-input-element" type="file" id="km-bot-integration-image-select" accept="image/png, image/jpeg" />
                </label>
            </div>
            <div className="bot-name-wrapper">
                <p>Bot Name:</p>
                <input type="text" id="input-bot-integration-name" placeholder="Example: Alex, Bot"
                    onChange={props.botName}
                />
            </div>
        </BotProfileContainer>
    )

}
class BotIntegrationModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText:"Next",
            step: this.props.step || 1,
            title:this.props.integrationContent.step1.title,
            subTitle:this.props.integrationContent.step1.subTitle,
            step1InputField:this.props.integrationContent.step1.inputFieldComponent,
            aiPlatform:this.props.aiPlatform ,
            webhookUrl:"",
            customBotKey:"",
            customBotValue:"",
            botName:"",
            selectedBotImage:"",
            applicationExpiryDate: this.props.applicationExpiryDate
        }
        
    }
    onNext = (e) => {
        if (this.state.aiPlatform == SUPPORTED_PLATFORM.CUSTOM && this.isInputFieldEmpty(this.state.webhookUrl.trim())){
            Notification.warning("Webhook url is mandatory");
            return;
        }
        this.state.step == 1 && this.setState({
            step:2,
            buttonText:"Integrate",
            botImageFileObject:"",
            title:this.props.integrationContent.step2.title,
            subTitle:this.props.integrationContent.step2.subTitle,
        })
    }
    customBotIntegrationInputValue = (e,key) => {
        this.setState({[key] : e.target.value});
    }
    botName = (e) => {
        this.setState({ botName:  e.target.value });
    }
    uploadBotImage = (e) => {
        let botImageFile;
        let that = this
        document.getElementById("km-bot-integration-image-select").addEventListener("change", function () {
            botImageFile = document.getElementById("km-bot-integration-image-select").files[0]
            document.getElementById("km-bot-integration-image-select").value = "";
           
            botImageFile && sendProfileImage(botImageFile, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${botImageFile.name.split('.').pop()}`)
                .then(response => {
                    if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                        that.setState({ selectedBotImage: response.data.profileImageUrl });
                    } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
                        Notification.info(response.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                    Notification.info("Error while uploading")
                })
        });
    }
    integrateBot = (e) => {
        let userId = CommonUtils.removeSpecialCharacters(this.state.botName);
        if (this.isInputFieldEmpty(this.state.botName.trim())) {
            Notification.warning("Please enter a bot name !!");
            return;
        }
       
        let userSession = CommonUtils.getUserSession();
        let applicationId = userSession.application.applicationId;
        let userInfo = {
            userName: userId,
            type: 2,
            applicationId: applicationId,
            password: userId,
            name: this.state.botName.trim(),
            aiPlatform: this.state.aiPlatform.trim(),
            roleType: ROLE_TYPE.BOT,
            imageLink: this.state.selectedBotImage ? this.state.selectedBotImage : DEFAULT_BOT_IMAGE_URL
        }
        let botInfo = {}
        if (this.state.aiPlatform == SUPPORTED_PLATFORM.CUSTOM) {
            botInfo["aiPlatform"] = this.state.aiPlatform
            botInfo["webhook"] = this.state.webhookUrl.trim();
            (this.state.customBotKey.trim() || this.state.customBotValue.trim()) && (botInfo ["webhookAuthentication"] = {});
            this.state.customBotKey.trim() &&(botInfo.webhookAuthentication["key"] = this.state.customBotKey.trim());
            this.state.customBotValue.trim() && (botInfo.webhookAuthentication["value"] = this.state.customBotValue.trim());  
        }   
        let data = { "userIdList": [userId] }
        createCustomerOrAgent(userInfo, "BOT").then(bot => {
            var bot = bot.data.data,
                botId = bot.userName;
            let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
            botAgentMap[bot.userName] = bot;
            CommonUtils.setItemInLocalStorage("KM_BOT_AGENT_MAP", botAgentMap);
            ApplozicClient.getUserDetails(data).then(response => {
                if (response.data.response[0]) {
                    let id = response.data.response[0].id;
                    let data = { id: id, botInfo: botInfo };
                    createBot(data).then(response => {
                        this.props.closeModal();
                        this.props.setBotData(this.state.botName,botId);
                        this.props.assignmentModal();
                        Notification.success("Bot successfully created");  
                        CommonUtils.isProductApplozic() &&  AnalyticsTracking.acEventTrigger('createBotAL');
                    }).catch(err => {
                        console.log(err)
                    })
                }

            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            if (err.code == "USER_ALREADY_EXISTS") {
                Notification.error("Bot name or bot ID already exists. Try again with a different name");
            } else {
                Notification.error("Something went wrong");
                console.log("Error creating bot", err);
            }
        })

    }
    isInputFieldEmpty = (value) => {
      return !value
    }
render() {
    let instructions;
    let inputField;
    let step2;
    (this.state.step == 1 && this.props.integrationContent) && [this.props.integrationContent].map((integration) => {
        instructions = <BotIntegrationInstructions/>
    });
    return (
        <div className="">
       
            <BotIntegrationTitle title={this.state.title} subTitle={this.state.subTitle}/>
            {this.state.step ==1 ? instructions: ""}
            {this.state.step ==1 && this.state.aiPlatform == SUPPORTED_PLATFORM.CUSTOM &&
                <CustomBotInputFields customBotIntegrationInputValue = {this.customBotIntegrationInputValue} />
            }
           
            {
                this.state.step==2 &&
                <div style={{margin:"-20px -33px"}}>
                {  (CommonUtils.isKommunicateDashboard() && !CommonUtils.isTrialPlan() && !CommonUtils.isStartupPlan())   &&
                        <Banner style={{margin:"-20px -32px"}} appearance="info" heading={["Adding a bot will increase the number of team members in your plan ",<strong key={1} >(1 bot = 1 team member).</strong>," Your bill will be updated on pro rata basis."]} />
                    }

                        {  (CommonUtils.isKommunicateDashboard() && CommonUtils.isTrialPlan() && CommonUtils.isStartupPlan()) &&
                          <Banner appearance="warning" style={{margin:"-20px -32px"}} heading={["Upgrade to a paid plan before your trial period ends ",<strong key={2} >({this.state.applicationExpiryDate}})</strong>," to ensure that all bot related features continue to work"]} />
                }
                </div>
            }
            {this.state.step == 2 &&
                <BotProfile  handleBotImageUpload= {this.uploadBotImage} botName={this.botName} botImage={this.state.selectedBotImage}/>
            }
            <BotIntegrationModalFooter onButtonClick ={this.state.step == 1 ? this.onNext : this.integrateBot} buttonText={this.state.buttonText} closeModal={this.props.closeModal} onClickIntegrate={this.integrateBot}/>
        </div>

    )
}
}
export default BotIntegrationModalContent;