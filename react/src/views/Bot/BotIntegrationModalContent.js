import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { BotDefaultImage } from '../../views/Faq/LizSVG.js';
import CustomBotInputFields from './CustomBotInputFields'
import {createCustomerOrAgent} from '../../utils/kommunicateClient';
const Title = styled.div`
    & > .bot-integration-title {
            font-size: 22px;
            letter-spacing: 1.5px;
            color: #242424;
    }
    & > hr {
            margin-right: -1.2rem;
            margin-left: -1.2rem;
    }
    & .bot-integration-sub-title {
            font-size: 16px;
            letter-spacing: 0.6px;
            color: #4a4a4a;
    }
`;
const Instruction = styled.div`
    display: flex;
    margin-bottom:15px;
    
    & > .instruction-order-circle {
            width: 20px;
            height: 20px;
            border-radius: 11.5px;
            background-color: #5553b7;
            text-align: center;
    }
    & .instruction-order {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.2px;
            text-align: center;
            color: #ffffff;
    }
    & > .instruction {
            margin-left: 11px;
            font-size: 14px;
            line-height: normal;
            letter-spacing: 0.3px;
            color: #666464;
    }
`;
const Footer = styled.div`
    text-align: right;
    margin-top: 29px;

    & > .bot-integration-cancel-button {
         margin-right: 16px;
    }
`;
const BotProfileContainer = styled.div`
    display: flex;
    & > .bot-name-wrapper {
            margin-left: 56px;
    }
    & > .km-edit-bot-image-wrapper {
            overflow: hidden;
            border-radius: 61%;
            position: relative;
            width: 105px;
            height: 105px;
            cursor: pointer;
            margin-left:20px
    }
    & > .bot-name-wrapper > input {
            height: 40px;
            padding: 16px;
    }
    & > .bot-name-wrapper > input::placeholder  {
            font-size: 14px;
            color: #cacaca;
    }
    & > .bot-name-wrapper > p {
            font-size: 17px;
            letter-spacing: 0.3px;
            color: #616366;
    }
    & .km-edit-bot-image-wrapper:hover, .bot-image-update {
        opacity: 0.7;
      }
    & .bot-image-update {
        text-align: center;
        position: absolute;
        background: black;
        opacity: 0;
        z-index: 100;
        color: white;
        bottom: -2px;
        left: 50%;
        display: block;
        width: 100%;
        transform: translate(-50%);
        text-transform: capitalize;
        height: 31px;
        padding: 4px 0 0 0;
        font-size: 14px;
        transition: .3s;
        letter-spacing: 0.8px;
    }
    & .km-hide-input-element {
        opacity: 0.0;
        position: absolute;
        top:0;
        left: 0;
        bottom: 0;
        right:0;
        width:100%;
        height:100%;
        font-size: 0px;
        cursor: pointer;
    }   
`;
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
            <span className="instruction">{props.instruction}</span>
        </Instruction>
        
    )
}
function BotIntegrationModalFooter(props) {
    return (
        <Footer>
            <button data-button-text="Cancel" className="km-button km-button--secondary bot-integration-cancel-button" onClick={props.onClickCancel}>Cancel</button>
            <button data-button-text={props.buttonText} className="km-button km-button--primary bot-integration-cancel-next" onClick={props.onNext}>{props.buttonText}</button>
        </Footer>
    )
}
function BotProfile(props) {
    return (
        <BotProfileContainer>
            <div className="km-edit-bot-image-wrapper">
                <BotDefaultImage />
                <label htmlFor="km-upload-bot-image-select" id="km-upload-bot-image-check" className="km-edit-section-hover bot-image-update" style={{ bottom: "-8px" }} onClick ={props.handleUpload} > Update
                  <input className="km-hide-input-element" type="file" id="km-upload-bot-image-select" accept="image/png, image/jpeg" />
                </label>
            </div>
            <div className="bot-name-wrapper">
                <p>Name</p>
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
            step1InputField:this.props.integrationContent.step1.inputFieldComponent

        }
        
    }
    onNext = (e) => {
        let clickedButton = e.target.dataset.buttonText;
        clickedButton == "Next" && this.setState({
            step:2,
            buttonText:"Integrate",
            botImageFileObject:"",
            title:this.props.integrationContent.step2.title,
            subTitle:this.props.integrationContent.step2.subTitle,
            customBotWebHookUrl:"",
            customBotKey:"",
            customBotValue:"",
            botName:""

        })
    }
    customBotWebHookUrl = (e) => {
        let customBotWebHookUrl = this.state.customBotWebHookUrl;
        customBotWebHookUrl = e.target.value;
        this.setState({ customBotWebHookUrl: customBotWebHookUrl })
    }
    customBotKey = (e) => {
        let customBotKey = this.state.customBotKey;
        customBotKey = e.target.value;
        this.setState({ customBotKey: customBotKey });
    }
    customBotValue = (e) => {
        let customBotValue = this.state.customBotValue;
        customBotValue = e.target.value;
        this.setState({ customBotValue: customBotValue });
    }
    botName = (e) => {
        let botName = this.state.botName;
        botName = e.target.value;
        this.setState({ botName: botName });
    }
    handleUpload = (e) => {
        let that = this;
        document.getElementById("km-upload-bot-image-select").addEventListener("change", function () {
            that.setState({
                botImageFileObject: document.getElementById("km-upload-bot-image-select").files[0]
            });
            // document.getElementById("km-upload-bot-image-select").value = "";
            // that.uploadBotProfileImage(that.state.botImageFileObject);
        });
        console.log(document.getElementById("km-upload-bot-image-select").files[0]);
    }
    handleInput = (e) => {

    }
render() {
    let instructions;
    let inputField;
    let step2;
    (this.state.step == 1 && this.props.integrationContent) && [this.props.integrationContent].map((integration) => {
        instructions = integration.step1.instructions.map((instruction, index) => {
            return <BotIntegrationInstructions key={index} instruction={instruction} order={index+1} />
        })
        // inputField = integration.step1.InputFieldComponent;
    });
    // (this.state.step == 2 && this.props.integrationContent) && [this.props.integrationContent].map((integration) => {
    //     step2 = integration.step2;
    //     this.setState()
    //     }) 
    return (
        <div className="">
            <BotIntegrationTitle title={this.state.title} subTitle={this.state.subTitle}/>
            {this.state.step ==1 ? instructions: ""}
            {this.state.step ==1 && this.state.step1InputField == "CustomBotInputFields" &&
                <CustomBotInputFields customBotWebHookUrl = {this.customBotWebHookUrl} customBotKey={this.customBotKey} customBotValue={this.customBotValue}/>
            }
            {/* {this.state.step ==1 ? inputField: ""} */}
            {this.state.step == 2 &&
                <BotProfile  handleUpload= {this.handleUpload} botName={this.botName}/>
            }
            <BotIntegrationModalFooter onNext ={this.onNext} buttonText={this.state.buttonText} onClickCancel={this.props.onClickCancel}/>
        </div>

    )
}
}
export default BotIntegrationModalContent;