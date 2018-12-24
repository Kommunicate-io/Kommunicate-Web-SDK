import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { BotDefaultImage } from '../../views/Faq/LizSVG.js';
import CustomBotInputFields from './CustomBotInputFields'
import {createCustomerOrAgent, sendProfileImage} from '../../utils/kommunicateClient';
import Notification from '../model/Notification';
import ApplozicClient from '../../utils/applozicClient';
import {createBot} from '../../utils/botPlatformClient';
import { ROLE_TYPE } from '../../utils/Constant';
import CommonUtils from '../../utils/CommonUtils';
import { Title, Instruction, Footer, BotProfileContainer} from './BotStyle'
import Linkify from 'react-linkify';

function BotIntegrationTitle(props) {
    return (
        <Title>
            <p className="bot-integration-title">{props.title}</p>
            <hr/>
            <p className="bot-integration-sub-title">{props.subTitle}</p>
        </Title>
    )
}

function BotIntegrationInstructions(props) {
    return (
        <Instruction>
            <div className="instruction-order-circle">
                <span className="instruction-order">{props.order}</span>
            </div> 
            <Linkify properties={{target: '_blank'}}>
                <span className="instruction">{props.instruction}</span>
            </Linkify>
            
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

const defaultBotUrl = "https://applozicbucket.s3.amazonaws.com/APPLOZIC/APP/prod_website/kommunicate-support/_Attachment/639f7f0f1d06c5604cadce69291023fda846d67a_default_bot_image.png";

class BotIntegrationModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText:"Next",
            step:1,
            clickedButton:"",
            botImageUrl:defaultBotUrl,
            title:this.props.integrationContent.step1.title,
            subTitle:this.props.integrationContent.step1.subTitle,
            step1InputField:this.props.integrationContent.step1.inputFieldComponent,
            aiPlatform:this.props.aiPlatform ,
            InputField1Value:"",
            InputField2Value:"",
            InputField3Value:"",
            botName:"",
            selectedBotImage:""

        }
        
    }
    onNext = (e) => {
        let clickedButton = e.target.dataset.buttonText;
        if (this.state.aiPlatform == "custom" && this.isInputFieldEmpty(this.state.InputField1Value.trim())){
            Notification.warning(this.props.integrationContent.inputFields.field1.label+" is mandatory");
            return;
        }
        clickedButton == "Next" && this.setState({
            step:2,
            buttonText:"Integrate",
            botImageFileObject:"",
            title:this.props.integrationContent.step2.title,
            subTitle:this.props.integrationContent.step2.subTitle,
        })
    }
    InputField1Value = (e) => {
        let InputField1Value = this.state.InputField1Value;
        InputField1Value = e.target.value;
        this.setState({ InputField1Value: InputField1Value })
    }
    InputField2Value = (e) => {
        let InputField2Value = this.state.InputField2Value;
        InputField2Value = e.target.value;
        this.setState({ InputField2Value: InputField2Value });
    }
    InputField3Value = (e) => {
        let InputField3Value = this.state.InputField3Value;
        InputField3Value = e.target.value;
        this.setState({ InputField3Value: InputField3Value });
    }
    botName = (e) => {
        let botName = this.state.botName;
        botName = e.target.value;
        this.setState({ botName: botName });
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
        let userId = this.state.botName.trim().toLowerCase().replace(/ /g, '-');
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
            imageLink: this.state.selectedBotImage ? this.state.selectedBotImage : this.state.defaultBotUrl
        }
        let botInfo = {}
        if (this.state.aiPlatform == "custom") {
            botInfo["aiPlatform"] = this.state.aiPlatform
            botInfo["webhook"] = this.state.InputField1Value.trim();
            (this.state.InputField2Value.trim() || this.state.InputField3Value.trim()) && (botInfo ["webhookAuthentication"] = {});
            this.state.InputField2Value.trim() &&(botInfo.webhookAuthentication["key"] = this.state.InputField2Value.trim());
            this.state.InputField3Value.trim() && (botInfo.webhookAuthentication["value"] = this.state.InputField3Value.trim());  
        }   
        let data = { "userIdList": [userId] }
        createCustomerOrAgent(userInfo, "BOT").then(bot => {
            var bot = bot.data.data;
            let botAgentMap = CommonUtils.getItemFromLocalStorage("KM_BOT_AGENT_MAP");
            botAgentMap[bot.userName] = bot;
            CommonUtils.setItemInLocalStorage("KM_BOT_AGENT_MAP", botAgentMap);
            ApplozicClient.getUserDetails(data).then(response => {
                if (response.data.response[0]) {
                    let id = response.data.response[0].id;
                    let data = { id: id, botInfo: botInfo };
                    createBot(data).then(response => {
                        this.props.closeModal();
                        Notification.success("Bot successfully created");  
                    }).catch(err => {
                        console.log(err)
                    })
                }

            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            if (err.code == "USER_ALREADY_EXISTS") {
                Notification.info("Bot name taken. Try again.");
            } else {
                Notification.error("Something went wrong");
                console.log("Error creating bot", err);
            }
        })

    }
    isInputFieldEmpty = (value) => {
       if (!value) {
        return true
       } else {
           return false
       }
    }
render() {
    let instructions;
    let inputField;
    let step2;
    (this.state.step == 1 && this.props.integrationContent) && [this.props.integrationContent].map((integration) => {
        instructions = integration.step1.instructions.map((instruction, index) => {
            return <BotIntegrationInstructions key={index} instruction={instruction} order={index+1} />
        })
    });
    return (
        <div className="">
            <BotIntegrationTitle title={this.state.title} subTitle={this.state.subTitle}/>
            {this.state.step ==1 ? instructions: ""}
            {this.state.step ==1 && this.state.step1InputField == "CustomBotInputFields" &&
                <CustomBotInputFields InputField1Value = {this.InputField1Value} InputField2Value={this.InputField2Value} InputField3Value={this.InputField3Value} inputFields ={this.props.integrationContent.inputFields}/>
            }
            {/* {this.state.step ==1 ? inputField: ""} */}
            {this.state.step == 2 &&
                <BotProfile  handleBotImageUpload= {this.uploadBotImage} botName={this.botName} botImage={this.state.selectedBotImage}/>
            }
            <BotIntegrationModalFooter onButtonClick ={this.state.buttonText == "Next" ? this.onNext : this.integrateBot} buttonText={this.state.buttonText} closeModal={this.props.closeModal} onClickIntegrate={this.integrateBot}/>
        </div>

    )
}
}
export default BotIntegrationModalContent;