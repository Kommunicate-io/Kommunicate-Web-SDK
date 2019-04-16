import React, { Component } from 'react';
import styled from 'styled-components';
import { SettingsHeader } from '../../components/SettingsComponent/SettingsComponents';
import SliderToggle from '../../components/SliderToggle/SliderToggle';
import {getAppSetting, updateAppSetting} from '../../utils/kommunicateClient';
import Notification from '../model/Notification';
import {InputButtonTop ,InputButtonBottom } from '../../assets/svg/svgs';

let updateTimer;

class ConversationAutoResolving extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            inputDuration: 10,
            durationOptions: [
                { value: 1, label: "minutes" },
                { value: 2, label: "hours" }
            ],
            defaultDurationType :[{ value: 1, label: "minutes" }] ,
            durationType : 'minutes',
        };
    }

    componentDidMount = () => {
        this.getConversationAutoResolveSettings();
    }

    getConversationAutoResolveSettings = () => {
        getAppSetting().then(response => {
            if(response.status == 200 && response.data.response) { 
                response.data.response && this.setState({
                    inputDuration: !response.data.response.conversationResolveTime ?  10 : response.data.response.conversationResolveTime/60 ,
                    enableConversationAutoResolving:  response.data.response.conversationResolveTime === 0 ?  false : true
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleKeypress = (e) =>{
        var a = [];
        var k = e.which;
    
        for (var i = 48; i < 58; i++)
            a.push(i);
    
        if (!(a.indexOf(k,a)>=0))
            e.preventDefault();
    }

    changeConversationResolvingTime = (change) =>{
        if(change === -1 && this.state.inputDuration ===0){
            return;
        }
        this.setState({
            inputDuration : this.state.inputDuration + change
        },()=>{ updateTimer && clearTimeout(updateTimer), this.handleConversationResolvingTimeChange()})
    }

    handleConversationResolvingTimeChange = () =>{
        let timer = 500;
        updateTimer = setTimeout(() => {
            let ResolvingTime = this.state.inputDuration > 0  ? this.state.inputDuration*60 : 0 ;
            this.updateConversationResolvingTime(ResolvingTime);
        }, timer);
    }


    toggleConversationAutoResolving = () => {
        let ResolvingTime = !this.state.enableConversationAutoResolving  ? this.state.inputDuration*60 : 0 ;
        this.updateConversationResolvingTime(ResolvingTime);
    }

    updateConversationResolvingTime = (ResolvingTime) =>{
        let data = {
            conversationCloseTime: ResolvingTime
        }
        updateAppSetting(data).then(response => {
            if(response.status == 200 && response.data.code == "SUCCESS") {
                data.conversationCloseTime && this.state.enableConversationAutoResolving && Notification.success("Conversation auto-resolving time updated") 
                !data.conversationCloseTime && Notification.success("Conversation auto-resolving disabled successfully");
                data.conversationCloseTime && !this.state.enableConversationAutoResolving && Notification.success("Conversation auto-resolving enabled successfully") 
                this.setState({ enableConversationAutoResolving: data.conversationCloseTime ? true : false });
            }
        }).catch( err => {
            Notification.error("Could not update CSAT Rating settings. Please try again after some time.");
            console.log(err);
        })
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>
                <Content>
                    <ToggleSettingsContainer>
                        <ToggleSettingsText>Allow conversations to be resolved automatically</ToggleSettingsText>
                        <ToggleSettingsToggler>
                            <SliderToggle 
                                checked={this.state.enableConversationAutoResolving} 
                                handleOnChange={this.toggleConversationAutoResolving}
                            />
                        </ToggleSettingsToggler>
                    </ToggleSettingsContainer>
                    <ToggleSettingsDescription style={this.state.enableConversationAutoResolving ? {} : {pointerEvents: 'none', opacity: .5} }>
                    Conversations which are assigned to a bot will be auto-resolved, when the user has not replied for
                    <InputNumberWrapper>
                        <DurationInput type="number" min="0" value={this.state.inputDuration}
                            onChange={(e)=>{
                                this.setState({
                                    inputDuration : parseInt(e.target.value)
                                },()=>{
                                    updateTimer && clearTimeout(updateTimer), this.handleConversationResolvingTimeChange();
                                })
                            }}
                            onKeyPress={this.handleKeypress}
                            />
                        <ToggleButtonWrapper>
                            <ToggleButton onClick={()=>{this.changeConversationResolvingTime(+1)}}> <InputButtonTop/> </ToggleButton>
                            <ToggleButton onClick={()=>{this.changeConversationResolvingTime(-1)}}> <InputButtonBottom/> </ToggleButton>
                        </ToggleButtonWrapper>
                    </InputNumberWrapper>minutes.
                    </ToggleSettingsDescription>
                </Content>
            </Container>
        );
    }
}


//Styles
const Container = styled.div`
    & .switch.switch-3d {
        margin-bottom: 0px;
    }
`;
const Content = styled.div`
    margin-left: 15px;
`;
const ToggleSettingsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const ToggleSettingsText = styled.div`
    margin: 0 10px 0 0;
    font-size: 16px;
    letter-spacing: 0.3px;
    color: #272828;
`;
const ToggleSettingsToggler = styled.div``;
const ToggleSettingsDescription = styled.div`
    font-size: 15px;
    line-height: 1.4;
    letter-spacing: 0.5px;
    color: #797575;
    margin: 30px auto;
`;

const InputNumberWrapper = styled.div`
    display: inline-flex;
    width: 70px;
    margin-right: 10px;
`;
const ToggleButtonWrapper = styled.div``;
const ToggleButton = styled.div`
    font-size: 10px;
    height: 5px;
    font-size: 7px;
    height: 10px;
    background: #eee;
    margin: 3px 0;
    padding: 0 4px;
    cursor: pointer;
    z-index: 10;
`;

const DurationInput = styled.input`
    outline: none;
    border: none;
    box-shadow: none;
    padding: 0 8px;
    position: relative;
    width: 50px;
    /* Hide default arrows in numver field */
    -moz-appearance: textfield; /*For FireFox*/
    &::-webkit-inner-spin-button { /*For Webkits like Chrome and Safari*/
        -webkit-appearance: none;
        margin: 0;
    }

    &:focus{
        outline: none;
        border: none;
    }
`

export default ConversationAutoResolving;